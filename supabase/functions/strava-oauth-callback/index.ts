import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (request) => {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const oauthError = requestUrl.searchParams.get("error");

  if (!state) {
    return new Response("Missing OAuth state", { status: 400 });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(supabaseUrl, serviceRoleKey);
  const { data: stateRow } = await admin
    .from("strava_oauth_states")
    .select("*")
    .eq("state", state)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (!stateRow) {
    return new Response("Expired or invalid OAuth state", { status: 400 });
  }

  const destination = new URL(stateRow.return_url);

  try {
    if (oauthError || !code) throw new Error(oauthError ?? "Missing authorization code");

    const tokenResponse = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: Deno.env.get("STRAVA_CLIENT_ID")!,
        client_secret: Deno.env.get("STRAVA_CLIENT_SECRET")!,
        code,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) throw new Error("Strava token exchange failed");
    const tokens = await tokenResponse.json();

    const { error: connectionError } = await admin.from("strava_connections").upsert({
      owner_id: stateRow.owner_id,
      athlete_id: tokens.athlete.id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: tokens.expires_at,
      updated_at: new Date().toISOString(),
    });
    if (connectionError) throw connectionError;

    destination.searchParams.set("strava", "connected");
  } catch (error) {
    console.error(error);
    destination.searchParams.set("strava", "error");
  } finally {
    await admin.from("strava_oauth_states").delete().eq("state", state);
  }

  return Response.redirect(destination.toString(), 302);
});
