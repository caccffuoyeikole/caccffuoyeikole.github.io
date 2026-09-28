# GreenWave V5 secure admin setup

The public site remains static on GitHub Pages. The admin login and GitHub publishing use Supabase:

- Supabase Auth handles email/password login.
- The browser never receives the GitHub personal access token.
- The GitHub token is stored as a Supabase Edge Function secret.
- `publish-content` checks the signed-in user before publishing `content.json`.

## One-time setup

1. Create a Supabase project.
2. In Authentication > Providers, enable Email provider.
3. Create the admin user with the Gmail address you want to use. **Do not use your normal Gmail password as a password for this site. Create a separate admin password.**
4. Copy the project URL and anon/public key into `admin/config.js`.
5. Deploy the `supabase/functions/publish-content` Edge Function.
6. Set these Edge Function secrets:
   - `GITHUB_OWNER` = GitHub account/organization that owns the site repository
   - `GITHUB_REPO` = repository name
   - `GITHUB_BRANCH` = `main` (or your actual Pages branch)
   - `GITHUB_TOKEN` = your GitHub token, stored only as a server secret
   - `ADMIN_EMAIL` = the exact email address allowed to publish
7. Open `/admin/`, sign in, and use Save & publish.

## Important

The GitHub token is still needed once as a server-side credential because GitHub must authorize the publish operation. You no longer type or paste it into the admin dashboard.
