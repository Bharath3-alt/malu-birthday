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
│   └── script.js
├── media/
│   ├── childhood/
│   ├── now/
│   ├── us/
│   ├── characters/
│   └── music/
└── README.md
```

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
- The existing video is a placeholder file so you can swap it later without changing the page structure.

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

## Add background music

Place your audio file in `media/music/`.

- Example: `birthday-soft.wav` or `birthday-soft.mp3`
- Update the `audio` source in `birthday.html`.
- You can also replace the button text if you want a custom label.

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
