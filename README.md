# Daily Pause

Daily Pause is a mobile-first PWA photo journal. It helps you keep a small,
private daily pause: choose photos, write one sentence, select a mood, and come
back later through a calm timeline archive.

Everything stays in the browser. There is no account, no backend, no cloud sync,
and no social feed.

## Preview

Daily Pause is designed for phones first, but it also works in a desktop browser.

Core screens:

- Today: save today's photos, note, and mood
- History: timeline-style archive
- Calendar: current month photo wall
- Entry detail: view, edit, delete, and open photos in a full-screen viewer
- Settings: local library stats and clear-data action

## Features

- Multiple photos per daily entry
- Full-screen image viewer
- Emoji mood picker with common moods and more hidden options
- Timeline archive for history
- Monthly photo wall
- IndexedDB local storage via Dexie
- Separate `entries` and `photos` tables
- Cover photo support with `coverPhotoId`
- Local image validation by file signature
- Local black-border cleanup for letterboxed images
- PWA manifest and offline support
- No login, no backend, no upload

## Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Dexie / IndexedDB
- vite-plugin-pwa

## Requirements

- Node.js 20 or newer
- npm

If you use `nvm`, run:

```bash
nvm use
```

## Quick Start

Clone the project:

```bash
git clone https://github.com/ksenrii/daily-pause.git
cd daily-pause
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the URL shown in the terminal, usually:

```txt
http://127.0.0.1:5173/
```

On Windows, if PowerShell blocks `npm`, use:

```bash
npm.cmd install
npm.cmd run dev
```

For repeatable installs in CI or after cloning a locked release, you can also
use:

```bash
npm ci
```

## Available Scripts

```bash
npm run dev
```

Start the local development server.

```bash
npm run build
```

Type-check and build the production app into `dist/`.

```bash
npm run preview
```

Preview the production build locally.

```bash
npm run check
```

Run linting and production build checks.

## Repository Size

The repository is intentionally small. The large folders generated during local
development are ignored:

- `node_modules/`
- `dist/`
- local caches and logs

Commit `package-lock.json`; it makes installs more predictable for other people.

## Local Network Testing

To test on a phone connected to the same Wi-Fi:

```bash
npm run dev:host
```

Then open the network URL printed by Vite on your phone.

## Privacy

All photos and notes are stored locally in your browser.
Daily Pause does not upload your data anywhere.
There is no account system and no cloud sync.

Because the data is local, clearing browser data can remove your entries.

## Image Safety

Daily Pause treats selected image files as untrusted input.

- Only JPEG, PNG, WebP, and GIF are accepted
- File headers are checked instead of trusting file extensions
- Files over 10MB are rejected
- File names are not used as paths
- Image data is stored as IndexedDB blobs
- Image data is never uploaded or executed by a backend

This app is not antivirus software, but it avoids the common risky upload chain:
there is no server-side file write, public upload path, or executable backend.

## Data Model

Daily Pause uses two IndexedDB tables:

- `entries`: date, note, mood, timestamps, and optional `coverPhotoId`
- `photos`: entry id, image blob, MIME type, size, and creation time

For the MVP, the first selected photo becomes the cover photo. All selected
photos are still stored and shown in the entry.

## Project Structure

```txt
public/
  icons/
  images/
src/
  app/
  components/
  db/
  hooks/
  pages/
  styles/
  utils/
```

## Deployment

The easiest options are Vercel or Netlify:

1. Push this repository to GitHub
2. Import the repository in Vercel or Netlify
3. Use the default Vite settings
4. Build command: `npm run build`
5. Output directory: `dist`

For GitHub Pages, remember that Vite apps deployed under a repository subpath may
need a `base` setting in `vite.config.ts`.

## Troubleshooting

If changes do not appear after a rebuild, the PWA service worker may be serving
cached files. Hard refresh the page with `Ctrl + F5`, or clear site data for the
local development URL.

If installation fails, check your Node version:

```bash
node -v
```

Use Node 20 or newer.

## License

MIT
