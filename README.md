GREENWAVE V5 — SECURE ADMIN LOGIN

Public UI:
- index.html is preserved from V4.
- css/style.css is preserved from V4.
- js/app.js is preserved from V4.

Admin:
- /admin/
- No Admin link is added to the public site.
- Admin now requires email/password authentication.
- The admin email can be a Gmail address.
- The password is a separate password for this admin account; it is NOT your Gmail password.
- GitHub username/repository/token fields have been removed from the dashboard.
- Publishing is performed by a Supabase Edge Function.
- The GitHub personal access token is stored as a server secret and is never exposed to the browser.

SETUP:
1. Create a Supabase project.
2. Enable Email authentication and create the admin user.
3. Put the Supabase project URL and anon key into admin/config.js.
4. Deploy supabase/functions/publish-content.
5. Configure the function secrets described in supabase/README.md.
6. Deploy the public site and /admin/ to GitHub Pages.

This V5 changes the admin authentication/publishing architecture. It does not redesign the public site.
