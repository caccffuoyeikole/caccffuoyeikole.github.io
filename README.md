GREENWAVE V4

Public UI:
- index.html is the user's supplied file, preserved unchanged.
- css/style.css is the user's supplied stylesheet, preserved unchanged.
- js/app.js is wired to content.json without changing the HTML structure.

Admin:
- /admin/
- Admin is not linked from the public site.
- Controls global settings, header, hero, stats, releases, categories, popular section, artists, player, footer and SEO.
- Local save/export/import.
- Optional GitHub publishing updates content.json through the GitHub Contents API using a token entered by the admin at publish time. The token is not embedded in the site.

Important:
- This does not upload audio files yet. It stores/edit their audio URLs and cover URLs.
- Do not commit a GitHub token into any source file.
- For production audio uploads, add a secure storage/upload layer (e.g. Cloudflare R2 via a serverless endpoint).
