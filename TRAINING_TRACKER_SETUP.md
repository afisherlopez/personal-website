# Training tracker setup

The tracker is available only by direct link at:

`https://annafisherlopez.com/#/training`

It is intentionally absent from the site navigation. This is obscurity, not password protection.

## Local-only preview

The page works immediately without Supabase. Workouts and strength entries are saved in browser
local storage. Open `http://localhost:3000/#/training` while running `npm run dev`.

## Supabase persistence

1. Create a Supabase project.
2. Enable **Anonymous Sign-Ins** under Authentication → Providers → Anonymous.
3. Run both SQL files in order in the Supabase SQL editor:
   - `supabase/migrations/202607260001_training_tracker.sql`
   - `supabase/migrations/202607310001_runna_sync.sql`
4. Copy `.env.example` to `.env.local` and fill in the project URL and anon key.
5. Restart the Vite development server.

Anonymous authentication keeps each browser's training data separate. If you need the same data
across devices later, replace anonymous auth with email magic-link authentication.

## Strava sync

1. Create a Strava API application at `https://www.strava.com/settings/api`.
2. Set the authorization callback domain to your Supabase project's domain:
   `YOUR_PROJECT.supabase.co`
3. Install the Supabase CLI and link this repository to the project.
4. Configure secrets:

```sh
supabase secrets set \
  STRAVA_CLIENT_ID=YOUR_CLIENT_ID \
  STRAVA_CLIENT_SECRET=YOUR_CLIENT_SECRET \
  SITE_ORIGIN=https://annafisherlopez.com
```

5. Deploy the functions:

```sh
supabase functions deploy strava-oauth-start
supabase functions deploy strava-oauth-callback --no-verify-jwt
supabase functions deploy strava-sync
```

Strava access and refresh tokens are stored only in the protected `strava_connections` table.
The browser never receives the Strava client secret or refresh token.

## Runna plan and completion sync

1. In Runna, open Profile → Connected Apps & Devices → Connect Calendar → Other Calendar.
2. Copy the private ICS calendar URL.
3. Store it as a Supabase secret:

```sh
supabase secrets set RUNNA_ICS_URL="YOUR_PRIVATE_RUNNA_ICS_URL"
```

4. Deploy the Runna importer and redeploy Strava sync:

```sh
supabase functions deploy runna-sync
supabase functions deploy strava-sync
```

The training page synchronizes when it opens and every 15 minutes while open:

1. `runna-sync` imports planned sessions using Runna's stable calendar event IDs.
2. Runna sends completed activities to Strava through its official integration.
3. `strava-sync` matches activities to Runna sessions within three days, using sport and planned
   distance as safeguards.
4. A match marks the Runna session complete and records actual time and distance. Unmatched Strava
   activities are added separately.

The Runna calendar itself does not contain completion status; Strava provides that signal. Keep the
ICS URL private because anyone with it can read the training plan.

## Editing the starter plan

Starter race dates, plan sessions, and strength data live in:

`src/content/trainingContent.ts`

Once Supabase is configured, sessions added through the page are stored in Supabase instead.
