# Setup: Supabase login for the admin page

Do these steps once. Everything here is free tier. Pages rebuilds the site on every save, so you do not need a server.

1. Go to https://supabase.com and sign up (free).
2. Click "New project". Pick a name (for example parliament-tattoos), set a database password and save it somewhere safe. Choose the region closest to you. Wait about 2 minutes for it to finish.
3. Open "SQL Editor" in the left menu. Click "New query".
4. Open the file supabase/init.sql in this repo. Copy everything in it, paste it into the SQL editor and click "Run". You should see "Success".
5. Go to "Authentication", then "Providers". Turn on "GitHub".
6. In the GitHub provider settings, copy the "Callback URL (for OAuth)" that Supabase shows you.
7. Go to https://github.com/settings/developers, click "New OAuth App". Fill in:
   - Application name: Parliament Tattoos admin
   - Homepage URL: https://immortalcyber112.github.io/tattoo-parlor-site/
   - Authorization callback URL: paste the callback URL from step 6
8. Click "Register application". Copy the Client ID and create a new client secret. Paste both into the GitHub provider settings in Supabase and click "Save".
9. Go to "Authentication", then "Users", then "Add user", then "Create new user". Enter your email and a password. Tick "Auto Confirm User". Save.
10. Copy your admin user's id (the uuid shown in the users list). Back in the SQL Editor, run:
    insert into public.admin_users (user_id, email) values ('PASTE-UUID-HERE', 'your-email@example.com');
11. In Supabase, open "Project Settings", then "API". Copy the "Project URL" and the "anon public" key. Keep the service_role key secret and never paste it into the site.
12. Deploy the OAuth proxy for Decap: this is a Supabase Edge Function. Install the Supabase CLI, run "supabase functions deploy decap-oauth", then copy the function URL. Put that URL (without the trailing auth) in admin/config.yml as base_url. This step is not built yet, so admin login stays broken until it is done.
13. Commit and push the change to config.yml. Wait 1 to 2 minutes for Pages to rebuild.
14. Open https://immortalcyber112.github.io/tattoo-parlor-site/admin/ and sign in with GitHub. Only the admin user above can save changes.

Notes
- Never put the service_role key or the GitHub client secret in any file in this repo.
- If you lose the database password, reset it in Project Settings, then Database.
