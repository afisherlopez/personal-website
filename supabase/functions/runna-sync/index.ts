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
  const kmMatch = /(\d+(?:\.\d+)?)\s*(?:km|kilometres|kilometers)\b/i.exec(text);
  if (kmMatch) return Math.round(Number(kmMatch[1]) * 100) / 100;
  const mileMatch = /(\d+(?:\.\d+)?)\s*(?:mi|mile|miles)\b/i.exec(text);
  return mileMatch ? Math.round(Number(mileMatch[1]) * 1.60934 * 100) / 100 : null;
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
      .select("external_uid, completed, duration_minutes, distance_km, matched_strava_activity_id")
      .eq("owner_id", user.id)
      .eq("source", "runna");
    if (existingError) throw existingError;
    const existingByUid = new Map(
      (existingRows ?? []).map((row) => [row.external_uid, row]),
    );

    const rows = events.map((event) => {
      const combinedText = `${event.title}\n${event.description}`;
      const durationMinutes = extractDurationMinutes(combinedText);
      const distanceKm = extractDistanceKm(combinedText);
      const existing = existingByUid.get(event.uid);
      return {
        owner_id: user.id,
        workout_date: event.date,
        title: event.title,
        sport: inferSport(event.title),
        duration_minutes: existing?.completed ? existing.duration_minutes : durationMinutes,
        distance_km: existing?.completed ? existing.distance_km : distanceKm,
        planned_duration_minutes: durationMinutes || null,
        planned_distance_km: distanceKm,
        completed: existing?.completed ?? false,
        source: "runna",
        notes: [event.url ? `RUNNA_URL:${event.url}` : "", event.description]
          .filter(Boolean)
          .join("\n") || null,
        external_uid: event.uid,
        matched_strava_activity_id: existing?.matched_strava_activity_id ?? null,
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

    return Response.json({ imported: rows.length }, { headers: corsHeaders });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to sync Runna" },
      { status: 400, headers: corsHeaders },
    );
  }
});
