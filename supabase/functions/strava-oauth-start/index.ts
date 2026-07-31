import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
    const stravaClientId = Deno.env.get("STRAVA_CLIENT_ID")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authorization } },
    });
    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();
    if (userError || !user) throw new Error("Invalid session");

    const { returnUrl } = await request.json();
    const allowedOrigins = [
      Deno.env.get("SITE_ORIGIN"),
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ].filter((origin): origin is string => Boolean(origin));
    const destination = new URL(returnUrl);
    if (!allowedOrigins.includes(destination.origin)) {
      throw new Error(`Invalid return URL origin: ${destination.origin}`);
    }

    const state = crypto.randomUUID();
    const admin = createClient(supabaseUrl, serviceRoleKey);
    const { error: stateError } = await admin.from("strava_oauth_states").insert({
      state,
      owner_id: user.id,
      return_url: destination.toString(),
    });
    if (stateError) throw stateError;

    const redirectUri = `${supabaseUrl}/functions/v1/strava-oauth-callback`;
    const authorizationUrl = new URL("https://www.strava.com/oauth/authorize");
    authorizationUrl.searchParams.set("client_id", stravaClientId);
    authorizationUrl.searchParams.set("redirect_uri", redirectUri);
    authorizationUrl.searchParams.set("response_type", "code");
    authorizationUrl.searchParams.set("approval_prompt", "auto");
    authorizationUrl.searchParams.set("scope", "read,activity:read_all");
    authorizationUrl.searchParams.set("state", state);

    return Response.json({ url: authorizationUrl.toString() }, { headers: corsHeaders });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to start OAuth" },
      { status: 400, headers: corsHeaders },
    );
  }
});
