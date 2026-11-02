# JM20 hub (main website)

Static site, Spanish by default with an English toggle. No build step: edit the files and deploy.

```
index.html          page content (every sentence exists twice: <span class="es"> and <span class="en">)
css/style.css       all styles; design tokens in :root at the top
js/app.js           language toggle, calculators, method stage, image zoom, contact form
assets/fonts/       Inter (400, 600)
assets/img/         hero posters (hero-*.jpg, hero-*-m.jpg), og-image.jpg, the six leak images (leak-*.jpg, and -sm.jpg for phones)
assets/video/       hero-es.mp4, hero-en.mp4 (desktop) and hero-es-m.mp4, hero-en-m.mp4 (phones, portrait)
favicon.svg
robots.txt  sitemap.xml  llms.txt  _headers
.well-known/agent-skills/   index.json + jm20-partner-info/SKILL.md (agent discovery)
wrangler.jsonc  .assetsignore   Cloudflare deploy config
video-source/       Remotion project for the hero video (not deployed)
```

## Deploy
1. Put this whole folder in the GitHub repo, keeping the folders (drag the folder, not loose files).
2. Connect the repo to Cloudflare. First deploy to the temporary `*.workers.dev` address and check it.
3. Only then point `jm20aisolutions.com` here. Before that, update the Murph repo's canonical tags and sitemap to `murph.jm20aisolutions.com`.

## Common edits
- **Change a sentence:** find it in `index.html`, edit the `es` and `en` spans together.
- **Colors / sizes:** `:root` and the rules in `css/style.css`.
- **Calculator formulas:** the `F` array in `js/app.js`.
- **Hero video:** see `video-source/README.md`, then replace the files in `assets/video/` and the posters in `assets/img/`. Screens up to 700px wide use the `-m` (portrait) files; the choice is made in `vid()` in `js/app.js`.
- **Contact form:** posts to the Supabase `leads` table (URL and key at the top of `js/app.js`, same ones the Murph site uses).
- **Leak images:** replace `assets/img/leak-*.jpg` (1280x720) and the `-sm.jpg` versions (800x450). The Spanish page shows the images; the English page shows text boxes until English images exist.

## Placeholders to check
- `https://jm20aisolutions.com` appears in `index.html` (canonical, social image), `sitemap.xml`, `llms.txt`, `robots.txt` and the agent-skills files. Change it if the hub is served from another domain.
