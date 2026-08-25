import React, { useEffect, useMemo, useState } from "react";
import {
  raceGoals,
  seedStrengthEntries,
  seedWorkouts,
  sportColors,
  type StrengthEntry,
  type TrainingSport,
  type TrainingWorkout,
} from "../../content/trainingContent";
import { ensureAnonymousSession, isSupabaseConfigured, supabase } from "../../lib/supabase";

type CalendarView = "week" | "month";

const workoutStorageKey = "afl-training-workouts";
const strengthStorageKey = "afl-strength-entries";
const dayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });
const shortDateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const kilometersToMiles = 0.621371;
const poundsPerKilogram = 2.20462;
const sortedRaceGoals = [...raceGoals].sort((a, b) => a.date.localeCompare(b.date));

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date: Date, amount: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

function addMonthsClamped(date: Date, amount: number): Date {
  const result = new Date(date);
  const day = result.getDate();
  result.setDate(1);
  result.setMonth(result.getMonth() + amount);
  const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(day, lastDay));
  return result;
}

function formatCountdown(dateKey: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const raceDate = parseDateKey(dateKey);
  const totalDays = Math.max(0, Math.round((raceDate.getTime() - today.getTime()) / 86_400_000));

  if (totalDays < 30) {
    const weeks = Math.floor(totalDays / 7);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"}, ${totalDays % 7} ${totalDays % 7 === 1 ? "day" : "days"}`;
  }

  let months =
    (raceDate.getFullYear() - today.getFullYear()) * 12 +
    raceDate.getMonth() -
    today.getMonth();
  let monthMarker = addMonthsClamped(today, months);
  if (monthMarker > raceDate) {
    months -= 1;
    monthMarker = addMonthsClamped(today, months);
  }
  const days = Math.round((raceDate.getTime() - monthMarker.getTime()) / 86_400_000);
  return `${months} ${months === 1 ? "month" : "months"}, ${days} ${days === 1 ? "day" : "days"}`;
}

function startOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() - (day === 0 ? 6 : day - 1));
  result.setHours(0, 0, 0, 0);
  return result;
}

function loadLocalData<T>(key: string, fallback: T): T {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function extractRunnaUrl(notes?: string): string | undefined {
  if (!notes) return undefined;
  const taggedUrl = /^RUNNA_URL:(https?:\/\/\S+)/m.exec(notes)?.[1];
  if (taggedUrl) return taggedUrl;
  return notes.match(/https?:\/\/[^\s]*runna[^\s]*/i)?.[0]?.replace(/[),.;]+$/, "");
}

function workoutFromRow(row: Record<string, unknown>): TrainingWorkout {
  const source = row.source as TrainingWorkout["source"];
  const notes = row.notes ? String(row.notes) : undefined;
  return {
    id: String(row.id),
    workoutDate: String(row.workout_date),
    title: String(row.title),
    sport: row.sport as TrainingSport,
    durationMinutes: Number(row.duration_minutes ?? 0),
    distanceKm: row.distance_km == null ? undefined : Number(row.distance_km),
    plannedDistanceKm:
      row.planned_distance_km == null ? undefined : Number(row.planned_distance_km),
    completed: source === "strava" || Boolean(row.completed),
    source,
    notes,
    externalUrl: extractRunnaUrl(notes),
  };
}

function strengthFromRow(row: Record<string, unknown>): StrengthEntry {
  return {
    id: String(row.id),
    performedOn: String(row.performed_on),
    exercise: String(row.exercise),
    weightKg: Number(row.weight_kg),
    reps: Number(row.reps),
    sets: Number(row.sets),
  };
}

export default function TrainingPage() {
  const [calendarView, setCalendarView] = useState<CalendarView>("week");
  const [focusDate, setFocusDate] = useState(() => new Date());
  const [workouts, setWorkouts] = useState<TrainingWorkout[]>(() =>
    loadLocalData<TrainingWorkout[]>(workoutStorageKey, seedWorkouts).map((workout) =>
      workout.source === "strava" ? { ...workout, completed: true } : workout,
    ),
  );
  const [strengthEntries, setStrengthEntries] = useState<StrengthEntry[]>(() =>
    loadLocalData(strengthStorageKey, seedStrengthEntries),
  );
  const [selectedExercise, setSelectedExercise] = useState("Back squat");
  const [showWorkoutForm, setShowWorkoutForm] = useState(false);
  const [syncStatus, setSyncStatus] = useState(
    isSupabaseConfigured ? "Connecting to training log…" : "Local demo mode",
  );
  const [workoutDraft, setWorkoutDraft] = useState({
    workoutDate: toDateKey(new Date()),
    title: "",
    sport: "run" as TrainingSport,
    durationMinutes: "45",
    distanceMiles: "",
  });
  const [strengthDraft, setStrengthDraft] = useState({
    performedOn: toDateKey(new Date()),
    exercise: "Back squat",
    weightLbs: "",
    reps: "5",
    sets: "3",
  });

  const loadRemoteData = async () => {
    if (!supabase) {
      return;
    }

    try {
      await ensureAnonymousSession();
      const [workoutsResult, strengthResult] = await Promise.all([
        supabase.from("training_workouts").select("*").order("workout_date"),
        supabase.from("strength_entries").select("*").order("performed_on"),
      ]);

      if (workoutsResult.error) throw workoutsResult.error;
      if (strengthResult.error) throw strengthResult.error;

      const remoteWorkouts = (workoutsResult.data ?? []).map((row) => workoutFromRow(row));
      const remoteStrength = (strengthResult.data ?? []).map((row) => strengthFromRow(row));

      setWorkouts(remoteWorkouts);
      setStrengthEntries((current) => {
        const pendingLocalEntries = current.filter((entry) => entry.id.startsWith("local-"));
        return [...remoteStrength, ...pendingLocalEntries];
      });
      setSyncStatus("Saved with Supabase");
    } catch (error) {
      console.error(error);
      setSyncStatus("Using local data · Supabase setup needed");
    }
  };

  const syncTrainingSources = async (showProgress = true) => {
    if (!supabase) {
      if (showProgress) {
        setSyncStatus("Add Supabase environment variables to sync training");
      }
      return;
    }

    if (showProgress) {
      setSyncStatus("Syncing Runna + Strava…");
    }

    try {
      await ensureAnonymousSession();
      const runnaResult = await supabase.functions.invoke("runna-sync");
      const stravaResult = await supabase.functions.invoke("strava-sync");
      await loadRemoteData();

      const runnaImported = runnaResult.data?.imported ?? 0;
      const stravaImported = stravaResult.data?.imported ?? 0;
      const stravaMatched = stravaResult.data?.matched ?? 0;

      if (runnaResult.error && stravaResult.error) {
        setSyncStatus("Saved with Supabase · connect training sources");
      } else {
        setSyncStatus(
          `Synced ${runnaImported} plans · ${stravaMatched} completed · ${stravaImported} other activities`,
        );
      }
    } catch (error) {
      console.error(error);
      await loadRemoteData();
    }
  };

  useEffect(() => {
    void syncTrainingSources(false);
    const intervalId = window.setInterval(() => {
      void syncTrainingSources(false);
    }, 15 * 60 * 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(workoutStorageKey, JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    window.localStorage.setItem(strengthStorageKey, JSON.stringify(strengthEntries));
  }, [strengthEntries]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("strava") === "connected") {
      setSyncStatus("Strava connected · ready to sync");
      window.history.replaceState(null, "", `${window.location.pathname}#/training`);
    }
  }, []);

  const visibleDays = useMemo(() => {
    if (calendarView === "week") {
      const start = startOfWeek(focusDate);
      return Array.from({ length: 7 }, (_, index) => addDays(start, index));
    }

    const first = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
    const calendarStart = startOfWeek(first);
    return Array.from({ length: 42 }, (_, index) => addDays(calendarStart, index));
  }, [calendarView, focusDate]);

  const selectedStrengthData = useMemo(
    () =>
      strengthEntries
        .filter((entry) => entry.exercise === selectedExercise)
        .sort((a, b) => a.performedOn.localeCompare(b.performedOn)),
    [selectedExercise, strengthEntries],
  );

  const chartPoints = useMemo(() => {
    if (!selectedStrengthData.length) return "";
    const weights = selectedStrengthData.map((entry) => entry.weightKg);
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const range = Math.max(max - min, 1);
    return selectedStrengthData
      .map((entry, index) => {
        const x = selectedStrengthData.length === 1 ? 50 : 8 + (index / (selectedStrengthData.length - 1)) * 84;
        const y = 82 - ((entry.weightKg - min) / range) * 64;
        return `${x},${y}`;
      })
      .join(" ");
  }, [selectedStrengthData]);

  const weeklyTotals = useMemo(() => {
    const start = startOfWeek(focusDate);
    const end = addDays(start, 7);
    const week = workouts.filter((workout) => {
      const date = parseDateKey(workout.workoutDate);
      return date >= start && date < end && workout.sport === "run";
    });
    return {
      completedDistance: week.reduce(
        (total, workout) => total + (workout.completed ? workout.distanceKm ?? 0 : 0),
        0,
      ),
      plannedDistance: week.reduce(
        (total, workout) =>
          total + (workout.plannedDistanceKm ?? workout.distanceKm ?? 0),
        0,
      ),
    };
  }, [focusDate, workouts]);

  const changePeriod = (direction: number) => {
    if (calendarView === "week") {
      setFocusDate((current) => addDays(current, direction * 7));
    } else {
      setFocusDate(
        (current) => new Date(current.getFullYear(), current.getMonth() + direction, 1),
      );
    }
  };

  const toggleWorkout = async (workout: TrainingWorkout) => {
    if (workout.source === "strava") {
      return;
    }

    const completed = !workout.completed;
    setWorkouts((current) =>
      current.map((item) => (item.id === workout.id ? { ...item, completed } : item)),
    );

    if (supabase && !workout.id.startsWith("seed-") && !workout.id.startsWith("local-")) {
      await supabase.from("training_workouts").update({ completed }).eq("id", workout.id);
    }
  };

  const openOrToggleWorkout = (workout: TrainingWorkout) => {
    if (workout.source === "runna" && workout.externalUrl) {
      window.open(workout.externalUrl, "_blank", "noopener,noreferrer");
      return;
    }
    void toggleWorkout(workout);
  };

  const addWorkout = async (event: React.FormEvent) => {
    event.preventDefault();
    const draft: TrainingWorkout = {
      id: `local-${crypto.randomUUID()}`,
      workoutDate: workoutDraft.workoutDate,
      title: workoutDraft.title,
      sport: workoutDraft.sport,
      durationMinutes: Number(workoutDraft.durationMinutes),
      distanceKm: workoutDraft.distanceMiles
        ? Number(workoutDraft.distanceMiles) / kilometersToMiles
        : undefined,
      completed: false,
      source: "manual",
    };

    if (supabase) {
      const session = await ensureAnonymousSession();
      const { data, error } = await supabase
        .from("training_workouts")
        .insert({
          owner_id: session?.user.id,
          workout_date: draft.workoutDate,
          title: draft.title,
          sport: draft.sport,
          duration_minutes: draft.durationMinutes,
          distance_km: draft.distanceKm,
          completed: false,
          source: "manual",
        })
        .select()
        .single();
      if (!error && data) draft.id = String(data.id);
    }

    setWorkouts((current) => [...current, draft].sort((a, b) => a.workoutDate.localeCompare(b.workoutDate)));
    setWorkoutDraft((current) => ({ ...current, title: "", distanceMiles: "" }));
    setShowWorkoutForm(false);
  };

  const addStrengthEntry = async (event: React.FormEvent) => {
    event.preventDefault();
    const draft: StrengthEntry = {
      id: `local-${crypto.randomUUID()}`,
      performedOn: strengthDraft.performedOn,
      exercise: strengthDraft.exercise,
      weightKg: Number(strengthDraft.weightLbs) / poundsPerKilogram,
      reps: Number(strengthDraft.reps),
      sets: Number(strengthDraft.sets),
    };

    if (supabase) {
      try {
        const session = await ensureAnonymousSession();
        if (!session) throw new Error("Unable to start a Supabase session");

        const { data, error } = await supabase
          .from("strength_entries")
          .insert({
            owner_id: session.user.id,
            performed_on: draft.performedOn,
            exercise: draft.exercise,
            weight_kg: draft.weightKg,
            reps: draft.reps,
            sets: draft.sets,
          })
          .select()
          .single();
        if (error) throw error;
        draft.id = String(data.id);
        setSyncStatus("Lift saved with Supabase");
      } catch (error) {
        console.error("Unable to save lift to Supabase", error);
        setSyncStatus("Lift saved locally · Supabase save failed");
      }
    }

    setStrengthEntries((current) => [...current, draft]);
    setSelectedExercise(draft.exercise);
    setStrengthDraft((current) => ({ ...current, weightLbs: "" }));
  };

  const connectStrava = async () => {
    if (!supabase) {
      setSyncStatus("Add Supabase environment variables to connect Strava");
      return;
    }
    setSyncStatus("Opening Strava…");
    const { data, error } = await supabase.functions.invoke("strava-oauth-start", {
      body: { returnUrl: `${window.location.origin}/#/training` },
    });
    if (error || !data?.url) {
      let detail = "";
      if (error && "context" in error && error.context instanceof Response) {
        const body = await error.context.clone().json().catch(() => null);
        detail = body?.error ? ` · ${body.error}` : "";
      }
      setSyncStatus(`Unable to start Strava connection${detail}`);
      return;
    }
    window.location.assign(data.url);
  };

  const syncStrava = async () => {
    await syncTrainingSources(true);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid rgba(25, 40, 35, 0.18)",
    borderRadius: "8px",
    padding: "0.62rem 0.68rem",
    backgroundColor: "rgba(255,255,255,0.72)",
    fontSize: "0.78rem",
  };

  return (
    <div className="training-page">
      <header className="training-header">
        <a href="#/about" className="training-brand">AFL</a>
        <span>Training Plan</span>
        <span className="training-sync-state">{syncStatus}</span>
      </header>

      <main className="training-main">
        <section className="training-hero">
          <figure className="training-polaroid">
            <img
              src="/images/training/the-hook.jpg"
              alt="The Hook coastline in Santa Cruz"
            />
            <figcaption>The Hook in Santa Cruz</figcaption>
          </figure>
          <div className="training-race-grid">
            {sortedRaceGoals.map((race) => (
                <article key={race.name} className="training-race-card">
                  <div>
                    <strong>{race.name}</strong>
                    <p>{race.type}</p>
                  </div>
                  <span>{formatCountdown(race.date)}</span>
                </article>
              ))}
          </div>
        </section>

        <section className="training-panel">
          <div className="training-panel-header">
            <div>
              <p className="training-eyebrow">TRAINING PLAN</p>
              <div className="training-period-heading">
                <h2>{calendarView === "month" ? monthFormatter.format(focusDate) : `Week of ${shortDateFormatter.format(startOfWeek(focusDate))}`}</h2>
                {calendarView === "week" ? (
                  <span className="training-period-distance">
                    {(weeklyTotals.completedDistance * kilometersToMiles).toFixed(1)} mi completed
                    {" / "}
                    {(weeklyTotals.plannedDistance * kilometersToMiles).toFixed(1)} mi planned
                  </span>
                ) : null}
              </div>
            </div>
            <div className="training-toolbar">
              <button onClick={() => changePeriod(-1)} aria-label="Previous period">←</button>
              <button onClick={() => setFocusDate(new Date())}>Today</button>
              <button onClick={() => changePeriod(1)} aria-label="Next period">→</button>
              <div className="training-view-toggle">
                <button className={calendarView === "week" ? "active" : ""} onClick={() => setCalendarView("week")}>Week</button>
                <button className={calendarView === "month" ? "active" : ""} onClick={() => setCalendarView("month")}>Month</button>
              </div>
              <button className="training-primary-button" onClick={() => setShowWorkoutForm((current) => !current)}>+ Add session</button>
            </div>
          </div>

          {showWorkoutForm ? (
            <form className="training-inline-form" onSubmit={addWorkout}>
              <input required placeholder="Workout title" value={workoutDraft.title} onChange={(event) => setWorkoutDraft({ ...workoutDraft, title: event.target.value })} style={inputStyle} />
              <input required type="date" value={workoutDraft.workoutDate} onChange={(event) => setWorkoutDraft({ ...workoutDraft, workoutDate: event.target.value })} style={inputStyle} />
              <select value={workoutDraft.sport} onChange={(event) => setWorkoutDraft({ ...workoutDraft, sport: event.target.value as TrainingSport })} style={inputStyle}>
                {Object.keys(sportColors).map((sport) => <option key={sport}>{sport}</option>)}
              </select>
              <input required type="number" min="1" placeholder="Minutes" value={workoutDraft.durationMinutes} onChange={(event) => setWorkoutDraft({ ...workoutDraft, durationMinutes: event.target.value })} style={inputStyle} />
              <input type="number" min="0" step="0.1" placeholder="Distance (miles)" value={workoutDraft.distanceMiles} onChange={(event) => setWorkoutDraft({ ...workoutDraft, distanceMiles: event.target.value })} style={inputStyle} />
              <button className="training-primary-button" type="submit">Save</button>
            </form>
          ) : null}

          <div className={`training-calendar training-calendar-${calendarView}`}>
            {visibleDays.map((day) => {
              const dateKey = toDateKey(day);
              const dayWorkouts = workouts.filter((workout) => workout.workoutDate === dateKey);
              const outsideMonth = calendarView === "month" && day.getMonth() !== focusDate.getMonth();
              const isToday = dateKey === toDateKey(new Date());
              return (
                <article
                  key={dateKey}
                  className={`training-day ${outsideMonth ? "muted" : ""} ${isToday ? "today" : ""}`}
                >
                  <div className="training-day-heading">
                    <span>{dayFormatter.format(day)}</span>
                    <strong>{day.getDate()}</strong>
                  </div>
                  <div className="training-day-sessions">
                    {dayWorkouts.map((workout) => (
                      <button
                        key={workout.id}
                        className={`training-session ${workout.completed ? "complete" : ""}`}
                        style={{ borderLeftColor: sportColors[workout.sport] }}
                        onClick={() => openOrToggleWorkout(workout)}
                        disabled={workout.source === "strava"}
                        title={
                          workout.source === "runna" && workout.externalUrl
                            ? "Open this workout in Runna"
                            : undefined
                        }
                      >
                        <span>{workout.sport}</span>
                        <strong>{workout.title}</strong>
                        <small>
                          {[
                            workout.distanceKm
                              ? `${(workout.distanceKm * kilometersToMiles).toFixed(1)} mi`
                              : "",
                            workout.source === "strava" ? "Strava" : "",
                            workout.source === "runna" ? "Runna" : "",
                          ].filter(Boolean).join(" · ")}
                        </small>
                      </button>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="training-two-column">
          <div className="training-panel training-strength-panel">
            <div className="training-panel-header">
              <div>
                <p className="training-eyebrow">STRENGTH</p>
                <h2>Progress over time</h2>
              </div>
              <select value={selectedExercise} onChange={(event) => setSelectedExercise(event.target.value)} style={{ ...inputStyle, width: "auto" }}>
                {[...new Set(strengthEntries.map((entry) => entry.exercise))].map((exercise) => <option key={exercise}>{exercise}</option>)}
              </select>
            </div>
            <div className="training-chart">
              {selectedStrengthData.length ? (
                <>
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label={`${selectedExercise} weight progress`}>
                    <line x1="8" y1="82" x2="94" y2="82" />
                    <line x1="8" y1="18" x2="8" y2="82" />
                    <polyline points={chartPoints} />
                    {chartPoints.split(" ").map((point, index) => {
                      const [cx, cy] = point.split(",");
                      return <circle key={selectedStrengthData[index].id} cx={cx} cy={cy} r="1.5" />;
                    })}
                  </svg>
                  <div className="training-chart-labels">
                    {selectedStrengthData.map((entry) => (
                      <span key={entry.id}>
                        {shortDateFormatter.format(parseDateKey(entry.performedOn))}
                        <strong>{Math.round(entry.weightKg * poundsPerKilogram * 10) / 10} lbs</strong>
                      </span>
                    ))}
                  </div>
                </>
              ) : <p>No strength data yet.</p>}
            </div>
          </div>

          <div className="training-panel">
            <p className="training-eyebrow">LOG A LIFT</p>
            <h2>Add strength work</h2>
            <form className="training-strength-form" onSubmit={addStrengthEntry}>
              <label>Exercise<input required value={strengthDraft.exercise} onChange={(event) => setStrengthDraft({ ...strengthDraft, exercise: event.target.value })} style={inputStyle} /></label>
              <label>Date<input required type="date" value={strengthDraft.performedOn} onChange={(event) => setStrengthDraft({ ...strengthDraft, performedOn: event.target.value })} style={inputStyle} /></label>
              <div>
                <label>Weight (lbs)<input required type="number" min="0" step="0.5" value={strengthDraft.weightLbs} onChange={(event) => setStrengthDraft({ ...strengthDraft, weightLbs: event.target.value })} style={inputStyle} /></label>
                <label>Sets<input required type="number" min="1" value={strengthDraft.sets} onChange={(event) => setStrengthDraft({ ...strengthDraft, sets: event.target.value })} style={inputStyle} /></label>
                <label>Reps<input required type="number" min="1" value={strengthDraft.reps} onChange={(event) => setStrengthDraft({ ...strengthDraft, reps: event.target.value })} style={inputStyle} /></label>
              </div>
              <button className="training-primary-button" type="submit">Add lift</button>
            </form>
          </div>
        </section>

        <section className="training-strava-panel">
          <div className="training-strava-mark">S</div>
          <div>
            <p className="training-eyebrow">STRAVA</p>
            <h2>Bring completed activities into your plan.</h2>
            <p>Connect once, then import recent runs, rides, and swims without entering them twice.</p>
          </div>
          <div className="training-strava-actions">
            <button onClick={() => void connectStrava()}>Connect Strava</button>
            <button className="training-primary-button" onClick={() => void syncStrava()}>Sync plan + activities</button>
          </div>
        </section>
      </main>
    </div>
  );
}
