# Malu Birthday Website

A romantic five-page birthday website created for Malu with a warm red-and-pink theme, floating hearts, a Stitch-inspired blue alien character, childhood memories, recent photos, and a final birthday surprise.

## Project structure

```text
malu-birthday-website/
├── index.html
├── childhood.html
├── now.html
├── us.html
├── birthday.html
├── css/
│   └── style.css
├── js/
│   ├── script.js
│   └── chat-config.js
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── test_app.py
├── render.yaml
├── media/
│   ├── childhood/
│   ├── now/
│   ├── us/
│   ├── characters/
│   ├── music/
│   └── videos/
└── README.md
```

## Birthday AI chat

The final homepage section uses a FastAPI backend and the OpenAI Python SDK configured for Groq's OpenAI-compatible Chat Completions API. The browser sends the current conversation to `/api/chat`; the backend adds the assistant instructions and reads `GROQ_API_KEY` from its server environment. The API key is never included in the website or returned to the browser. The chat is not trained specifically on Malu and does not invent personal memories.

The site remains hosted on GitHub Pages, which cannot run the private API key securely. Deploy the backend separately (the included `render.yaml` is a Render Blueprint), then set its public URL in `js/chat-config.js`.

### Configure and run locally (PowerShell)

1. Copy `backend\.env.example` to `backend\.env` and add your Groq API key to that local file. `.env` files are ignored by Git; never paste the key into `js/chat-config.js` or commit it.
2. From the project root, install the backend dependencies:

   ```powershell
   .\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
   ```

3. Start the API:

   ```powershell
   .\.venv\Scripts\python.exe -m uvicorn app:app --app-dir backend --reload --port 8001
   ```

4. Temporarily set `apiBaseUrl` in `js/chat-config.js` to `http://localhost:8001`, then serve the website in a second terminal:

   ```powershell
   .\.venv\Scripts\python.exe -m http.server 8000
   ```

5. Open `http://localhost:8000/`. Send a message and a follow-up to check conversation context. The separate “ONE LAST THING...” button reveals the message configured by `finalRevealMessage` in `js/chat-config.js`.

### Deploy the backend

1. In Render, create a Blueprint from this repository and use the included `render.yaml`.
2. Set `GROQ_API_KEY` as a secret environment variable in the Render dashboard. Do not add it to the Blueprint, GitHub, or the frontend.
3. After the service is healthy at `/health`, copy its HTTPS URL into `apiBaseUrl` in `js/chat-config.js` and push that non-secret URL change to GitHub Pages.
4. The backend's `ALLOWED_ORIGINS` must contain the website origin (`https://bharath3-alt.github.io`). For local development, include the localhost origin as shown in `backend\.env.example`.

The service uses the configurable `GROQ_MODEL` setting (default `openai/gpt-oss-20b`), a currently supported Groq model with free-tier availability subject to Groq's rate limits. The existing OpenAI Python SDK targets `https://api.groq.com/openai/v1`; no additional SDK dependency is needed. See Groq's [OpenAI compatibility guide](https://console.groq.com/docs/openai), [supported models](https://console.groq.com/docs/models), and [rate limits](https://console.groq.com/docs/rate-limits).

The API rejects invalid or oversized conversation history and limits requests to 20 per minute per running service instance.

Run the backend's automated validation tests from the project root:

```powershell
.\.venv\Scripts\python.exe -m unittest discover -s backend -p "test_*.py"
```

These tests mock the OpenAI SDK and do not spend API credits. To verify actual model replies, configure a valid Groq key and send messages through the locally served site.

## How to add your photos and videos

### Childhood photos
Place files in `media/childhood/`.

- Example filenames: `childhood-1.svg`, `childhood-2.svg`, `childhood-3.svg`, `childhood-4.svg`
- Update the `src` and `data-image` values inside `childhood.html` to match your real file names.
- Update the captions under each figure to personalize the memories.

### Current photos
Place files in `media/now/`.

- Example filenames: `now-1.svg`, `now-2.svg`, `now-3.svg`, `now-4.svg`
- Replace the placeholder image paths in `now.html`.
- Keep the `lightbox-trigger` structure or replace it with new cards.

### Photos together
Place files in `media/us/`.

- Example filenames: `us-1.svg`, `us-2.svg`, `us-3.svg`, `us-4.svg`
- Update the captions and `src` values in `us.html`.

### Video memories
Place a valid video file in `media/childhood/`.

- For example: `childhood-video.mp4`
- Update the `source` path and the `poster` image on `childhood.html`.
- The childhood video is already included at `media/childhood/IMG_3162.mp4`.

### Storage video on the homepage
The homepage storage section uses `media/videos/WhatsApp Video 2026-11-24 at 9.21.32 PM.mp4` and includes playback controls.

## How to edit the messages

### Love note on the us page
Update the paragraph in `us.html`:

```html
<p>
  Malu, every memory with you holds a special place in my heart...
</p>
```

### Birthday letter on the final page
Update the text inside the letter card in `birthday.html`.

```html
<article id="birthday-letter" class="letter-card hidden">
  <p>
    Happy Birthday, Malu! ❤️🌹
    ...
  </p>
</article>
```

## Sitewide background music

Place the MP3 at `media/music/until-i-found-you.mp3`. The floating player attempts to start it on every page and remembers mute and position preferences while navigating in the same tab. Some browsers block sound autoplay until the visitor interacts with the page or allows autoplay for the site.

## Local preview instructions

From the project folder, run:

```bash
python -m http.server 8000
```

Then open this in the browser:

```text
http://localhost:8000/
```

This will let you preview the site locally before publishing.

## Deploy to GitHub Pages

1. Create a GitHub repository and push the folder contents.
2. On GitHub, open the repository settings.
3. Go to Pages.
4. Select the branch you want to publish (usually `main`).
5. Keep the folder as `/root` if the project is at the repo root.
6. Save the settings.
7. GitHub Pages will provide a public URL for your site.

## Tips for customizing the design

- Edit `css/style.css` to change colors, spacing, or layout.
- Keep image file names relative so the site works on GitHub Pages.
- Add more cards or sections by following the existing gallery pattern.
- Keep any new assets inside the `media/` folders to preserve the overall structure.

## Important notes

- The current media files are placeholders so the site works immediately without broken paths.
- Replace the placeholder artwork with Malu's real photos and your own memories whenever you are ready.
- All pages are designed to work on mobile, tablet, and desktop layouts.
