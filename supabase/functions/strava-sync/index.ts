import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface StravaActivity {
  id: number;
  name: string;
  sport_type: string;
  start_date_local: string;
  moving_time: number;
  distance: number;
}

function mapSport(sportType: string): "run" | "bike" | "swim" | null {
  if (["Run", "TrailRun", "VirtualRun"].includes(sportType)) return "run";
  if (["Ride", "MountainBikeRide", "GravelRide", "VirtualRide"].includes(sportType)) return "bike";
  if (sportType === "Swim") return "swim";
  return null;
}

function dateDifferenceDays(first: string, second: string): number {
  const firstTime = new Date(`${first}T12:00:00Z`).getTime();
  const secondTime = new Date(`${second}T12:00:00Z`).getTime();
  return Math.abs(firstTime - secondTime) / 86_400_000;
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
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authorization } },
    });
    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();
    if (userError || !user) throw new Error("Invalid session");

    const admin = createClient(supabaseUrl, serviceRoleKey);
    const { data: connection } = await admin
      .from("strava_connections")
      .select("*")
      .eq("owner_id", user.id)
      .maybeSingle();
    if (!connection) throw new Error("Strava is not connected");

    let accessToken = connection.access_token;
    if (connection.expires_at <= Math.floor(Date.now() / 1000) + 60) {
      const refreshResponse = await fetch("https://www.strava.com/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: Deno.env.get("STRAVA_CLIENT_ID")!,
          client_secret: Deno.env.get("STRAVA_CLIENT_SECRET")!,
          grant_type: "refresh_token",
          refresh_token: connection.refresh_token,
        }),
      });
      if (!refreshResponse.ok) throw new Error("Unable to refresh Strava access");
      const refreshed = await refreshResponse.json();
      accessToken = refreshed.access_token;
      await admin.from("strava_connections").update({
        access_token: refreshed.access_token,
        refresh_token: refreshed.refresh_token,
        expires_at: refreshed.expires_at,
        updated_at: new Date().toISOString(),
      }).eq("owner_id", user.id);
    }

    const after = Math.floor(Date.now() / 1000) - 120 * 86_400;
    const activitiesResponse = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?after=${after}&per_page=100`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    if (!activitiesResponse.ok) throw new Error("Unable to load Strava activities");
    const activities = (await activitiesResponse.json()) as StravaActivity[];

    const supportedActivities = activities.flatMap((activity) => {
      const sport = mapSport(activity.sport_type);
      return sport ? [{ activity, sport }] : [];
    });
    const { data: runnaPlans, error: plansError } = await admin
      .from("training_workouts")
      .select("*")
      .eq("owner_id", user.id)
      .eq("source", "runna")
      .is("matched_strava_activity_id", null);
    if (plansError) throw plansError;

    const availablePlans = [...(runnaPlans ?? [])];
    const unmatchedRows = [];
    let matched = 0;

    for (const { activity, sport } of supportedActivities) {
      const activityDate = activity.start_date_local.slice(0, 10);
      const actualDistanceKm = Math.round(activity.distance / 10) / 100;
      const candidates = availablePlans
        .map((plan, index) => {
          if (plan.sport !== sport) return null;
          const dayDifference = dateDifferenceDays(plan.workout_date, activityDate);
          if (dayDifference > 3) return null;

          const plannedDistance = Number(plan.planned_distance_km ?? plan.distance_km ?? 0);
          const distanceDifference = plannedDistance
            ? Math.abs(actualDistanceKm - plannedDistance) / plannedDistance
            : 0;
          if (plannedDistance && distanceDifference > 0.45) return null;

          return {
            index,
            score: dayDifference * 10 + distanceDifference * 10,
          };
        })
        .filter((candidate): candidate is { index: number; score: number } => candidate !== null)
        .sort((a, b) => a.score - b.score);

      const bestMatch = candidates[0];
      if (bestMatch) {
        const [plan] = availablePlans.splice(bestMatch.index, 1);
        const { error: matchError } = await admin
          .from("training_workouts")
          .update({
            completed: true,
            duration_minutes: Math.max(1, Math.round(activity.moving_time / 60)),
            distance_km: actualDistanceKm,
            matched_strava_activity_id: activity.id,
          })
          .eq("id", plan.id);
        if (matchError) throw matchError;

        await admin
          .from("training_workouts")
          .delete()
          .eq("owner_id", user.id)
          .eq("source", "strava")
          .eq("strava_activity_id", activity.id);
        matched += 1;
        continue;
      }

      unmatchedRows.push({
        owner_id: user.id,
        workout_date: activityDate,
        title: activity.name,
        sport,
        duration_minutes: Math.max(1, Math.round(activity.moving_time / 60)),
        distance_km: actualDistanceKm,
        completed: true,
        source: "strava",
        strava_activity_id: activity.id,
      });
    }

    if (unmatchedRows.length) {
      const { error: upsertError } = await admin
        .from("training_workouts")
        .upsert(unmatchedRows, { onConflict: "owner_id,strava_activity_id" });
      if (upsertError) throw upsertError;
    }

    return Response.json(
      { imported: unmatchedRows.length, matched },
      { headers: corsHeaders },
    );
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to sync Strava" },
      { status: 400, headers: corsHeaders },
    );
  }
});
