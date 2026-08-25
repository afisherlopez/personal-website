import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CalendarEvent {
  uid: string;
  date: string;
  title: string;
  description: string;
  url?: string;
}

function unfoldCalendar(value: string): string[] {
  return value
    .replace(/\r\n/g, "\n")
    .split("\n")
    .reduce<string[]>((lines, line) => {
      if (/^[ \t]/.test(line) && lines.length) {
        lines[lines.length - 1] += line.slice(1);
      } else {
        lines.push(line);
      }
      return lines;
    }, []);
}

function decodeCalendarText(value: string): string {
  return value
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\")
    .trim();
}

function parseCalendar(value: string): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  let current: Record<string, string> | null = null;

  for (const line of unfoldCalendar(value)) {
    if (line === "BEGIN:VEVENT") {
      current = {};
      continue;
    }
    if (line === "END:VEVENT") {
      if (current?.UID && current.DTSTART && current.SUMMARY) {
        const rawDate = current.DTSTART.replace(/\D/g, "").slice(0, 8);
        const description = decodeCalendarText(current.DESCRIPTION ?? "");
        const explicitUrl = current.URL ? decodeCalendarText(current.URL) : "";
        const descriptionRunnaUrl =
          description.match(/https?:\/\/[^\s]+runna[^\s]*/i)?.[0]?.replace(/[),.;]+$/, "");
        events.push({
          uid: decodeCalendarText(current.UID),
          date: `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`,
          title: decodeCalendarText(current.SUMMARY),
          description,
          url: explicitUrl || descriptionRunnaUrl || undefined,
        });
      }
      current = null;
      continue;
    }
    if (!current) continue;

    const separator = line.indexOf(":");
    if (separator < 0) continue;
    const property = line.slice(0, separator).split(";")[0];
    if (["UID", "DTSTART", "SUMMARY", "DESCRIPTION", "URL"].includes(property)) {
      current[property] = line.slice(separator + 1);
    }
  }

  return events;
}

function inferSport(title: string): "run" | "strength" | "recovery" {
  const normalized = title.toLowerCase();
  if (normalized.includes("strength") || normalized.includes("gym")) return "strength";
  if (normalized.includes("rest") || normalized.includes("recovery")) return "recovery";
  return "run";
}

function extractDurationMinutes(text: string): number {
  const hourMatch = /(\d+(?:\.\d+)?)\s*(?:hour|hours|hr|hrs)\b/i.exec(text);
  const minuteMatch = /(\d+)\s*(?:minute|minutes|min|mins)\b/i.exec(text);
  return Math.round(
    (hourMatch ? Number(hourMatch[1]) * 60 : 0) +
    (minuteMatch ? Number(minuteMatch[1]) : 0),
  );
}

function extractDistanceKm(text: string): number | null {
  const match =
    /(\d+(?:\.\d+)?)\s*(km|kilometres?|kilometers?|mi|miles?)\b/i.exec(text);
  if (!match) return null;
  const distance = Number(match[1]);
  const isMiles = match[2].toLowerCase().startsWith("mi");
  return Math.round(distance * (isMiles ? 1.60934 : 1) * 100) / 100;
}

function parseRunnaTitle(title: string): {
  baseTitle: string;
  completionMetric?: string;
} {
  const separatorMatch = /^(.*?)\s+[·•]\s+(.+)$/.exec(title);
  if (!separatorMatch) return { baseTitle: title.trim() };

  const [, baseTitle, suffix] = separatorMatch;
  const hasCompletionMetric =
    /\d+(?:\.\d+)?\s*(?:mi|miles?|km|kilometres?|kilometers?|m|min|mins|minutes?)\b/i
      .test(suffix);
  return hasCompletionMetric
    ? { baseTitle: baseTitle.trim(), completionMetric: suffix.trim() }
    : { baseTitle: title.trim() };
}

function normalizeRunnaTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authorization = request.headers.get("Authorization");
    if (!authorization) throw new Error("Missing authorization");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const calendarUrl = Deno.env.get("RUNNA_ICS_URL");
    if (!calendarUrl) throw new Error("RUNNA_ICS_URL is not configured");

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authorization } },
    });
    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();
    if (userError || !user) throw new Error("Invalid session");

    const calendarResponse = await fetch(calendarUrl, {
      headers: { "User-Agent": "AFL-Training-Tracker/1.0" },
    });
    if (!calendarResponse.ok) throw new Error("Unable to load Runna calendar");
    const events = parseCalendar(await calendarResponse.text());
    const admin = createClient(supabaseUrl, serviceRoleKey);
    const { data: existingRows, error: existingError } = await admin
      .from("training_workouts")
      .select(
        "id, external_uid, workout_date, title, sport, completed, duration_minutes, distance_km, planned_duration_minutes, planned_distance_km, matched_strava_activity_id",
      )
      .eq("owner_id", user.id)
      .eq("source", "runna");
    if (existingError) throw existingError;
    const existingByUid = new Map(
      (existingRows ?? []).map((row) => [row.external_uid, row]),
    );
    type ExistingRow = NonNullable<typeof existingRows>[number];
    const existingByWorkout = new Map<string, ExistingRow[]>();
    for (const row of existingRows ?? []) {
      const baseTitle = parseRunnaTitle(row.title).baseTitle;
      const key =
        `${row.workout_date}|${row.sport}|${normalizeRunnaTitle(baseTitle)}`;
      const group = existingByWorkout.get(key) ?? [];
      group.push(row);
      existingByWorkout.set(key, group);
    }

    const groupedEvents = new Map<
      string,
      {
        baseTitle: string;
        planned?: CalendarEvent;
        completion?: CalendarEvent;
        plannedMetric?: string;
      }
    >();

    for (const event of events) {
      const { baseTitle, completionMetric } = parseRunnaTitle(event.title);
      const key = `${event.date}|${inferSport(baseTitle)}|${normalizeRunnaTitle(baseTitle)}`;
      const group = groupedEvents.get(key) ?? { baseTitle };
      if (completionMetric) {
        group.baseTitle = baseTitle;
        group.planned = event;
        group.plannedMetric = completionMetric;
      } else {
        if (!group.planned) group.baseTitle = baseTitle;
        group.completion = event;
      }
      groupedEvents.set(key, group);
    }

    const staleRowIds = new Set<string>();
    const rows = [...groupedEvents.values()].map((group) => {
      const primaryEvent = group.planned ?? group.completion!;
      const existingPrimary = existingByUid.get(primaryEvent.uid);
      const workoutKey =
        `${primaryEvent.date}|${inferSport(group.baseTitle)}|${normalizeRunnaTitle(group.baseTitle)}`;
      const existingWorkoutRows = existingByWorkout.get(workoutKey) ?? [];
      const existingCompletion =
        (group.completion ? existingByUid.get(group.completion.uid) : undefined) ??
        existingWorkoutRows.find((row) => row.completed);
      const plannedText = `${group.plannedMetric ?? group.baseTitle}\n${group.planned?.description ?? primaryEvent.description}`;
      const plannedDurationMinutes = extractDurationMinutes(plannedText);
      const plannedDistanceKm = extractDistanceKm(plannedText);
      const completionDistanceKm = group.completion
        ? extractDistanceKm(`${group.completion.title}\n${group.completion.description}`)
        : null;
      const completed =
        Boolean(group.completion) ||
        Boolean(existingPrimary?.completed) ||
        Boolean(existingCompletion?.completed);

      for (const row of existingWorkoutRows) {
        if (row.external_uid !== primaryEvent.uid) staleRowIds.add(row.id);
      }

      return {
        owner_id: user.id,
        workout_date: primaryEvent.date,
        title: group.baseTitle,
        sport: inferSport(group.baseTitle),
        duration_minutes: completed
          ? existingPrimary?.duration_minutes ??
            existingCompletion?.duration_minutes ??
            plannedDurationMinutes
          : plannedDurationMinutes,
        distance_km: completed
          ? completionDistanceKm ??
            existingPrimary?.distance_km ??
            existingCompletion?.distance_km ??
            plannedDistanceKm
          : plannedDistanceKm,
        planned_duration_minutes:
          plannedDurationMinutes ||
          existingPrimary?.planned_duration_minutes ||
          existingCompletion?.planned_duration_minutes ||
          null,
        planned_distance_km:
          plannedDistanceKm ??
          existingPrimary?.planned_distance_km ??
          existingCompletion?.planned_distance_km ??
          null,
        completed,
        source: "runna",
        notes:
          [
            primaryEvent.url ? `RUNNA_URL:${primaryEvent.url}` : "",
            primaryEvent.description,
          ]
            .filter(Boolean)
            .join("\n") || null,
        external_uid: primaryEvent.uid,
        matched_strava_activity_id:
          existingPrimary?.matched_strava_activity_id ?? null,
      };
    });

    if (rows.length) {
      const { error: upsertError } = await admin
        .from("training_workouts")
        .upsert(rows, {
          onConflict: "owner_id,external_uid",
          ignoreDuplicates: false,
        });
      if (upsertError) throw upsertError;
    }

    if (staleRowIds.size) {
      const { error: deleteError } = await admin
        .from("training_workouts")
        .delete()
        .eq("owner_id", user.id)
        .eq("source", "runna")
        .in("id", [...staleRowIds]);
      if (deleteError) throw deleteError;
    }

    return Response.json(
      { imported: rows.length, merged: staleRowIds.size },
      { headers: corsHeaders },
    );
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to sync Runna" },
      { status: 400, headers: corsHeaders },
    );
  }
});
