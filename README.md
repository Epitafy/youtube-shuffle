# Shuffle — Synced YouTube Playlist Player

A single-file web player for YouTube playlists with real-time multiplayer sync, a shuffleable queue, favorites, and an installable PWA experience. No build step, no framework — just one `index.html` served from GitHub Pages.

**Live:** https://epitafy.github.io/youtube-shuffle/

---

## Features

- **Load any YouTube playlist** by URL and play it in an embedded player.
- **Shuffle / Unshuffle** the queue while preserving the original order.
- **Queue management**
  - Add a single song by its YouTube link (or 11-char video ID).
  - Reorder tracks with drag-and-drop (works with mouse and touch).
  - Remove tracks from the queue.
- **Real-time lobby sync** — create or join a lobby and everyone stays in sync: same track, play/pause, seek position, queue order, and shuffle state, backed by Firebase Realtime Database.
- **Favorites** — star playlists and reopen them later.
- **Auto-resume** — on startup the app restores your last playlist, queue order, and position.
- **Player extras** — volume slider, mute, blackout/dimmer mode with a vinyl view, repeat modes, and Media Session integration (OS media keys).
- **PWA** — installable as a desktop/mobile app. On Windows (Edge) it uses Window Controls Overlay so the system title bar is hidden while the window stays resizable.
- **Responsive** — switches to a stacked layout (video on top, queue below) on narrow or portrait/half-screen windows.
- **Empty state** — a clear placeholder screen when no playlist is loaded.

---

## Repository layout

```
index.html      # The entire app: HTML, CSS, and JS in one file
manifest.json   # PWA metadata (icons, display mode, theme colors)
gifs/           # Optional logo GIFs (gif1.gif … gif31.gif) shown on logo click
favicon.ico     # App / PWA icon
README.md
```

---

## Configuration

All config lives at the top of the inline `<script>` in `index.html`.

### 1. YouTube Data API key

```js
const API_KEY = 'YOUR_YOUTUBE_DATA_API_V3_KEY';
```

Used to fetch playlist items, titles, and video durations via the YouTube Data API v3.

- Create a key in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials) and enable **YouTube Data API v3**.
- **Security note:** this key ships in client-side code and is publicly visible. Restrict it in the Google Cloud Console:
  - **Application restriction:** HTTP referrers → add your Pages origin (e.g. `https://epitafy.github.io/*`).
  - **API restriction:** limit it to *YouTube Data API v3* only.
  - The API key does **not** authenticate as your YouTube account — it only reads public playlist metadata. Age-restricted videos still can't be embedded (a YouTube limitation, not a key issue).

### 2. Firebase (lobby sync)

```js
const firebaseConfig = {
  apiKey: "…",
  authDomain: "…",
  databaseURL: "https://<project>-default-rtdb.<region>.firebasedatabase.app",
  projectId: "…",
  storageBucket: "…",
  messagingSenderId: "…",
  appId: "…"
};
```

Lobby state is stored in Firebase **Realtime Database** under `/lobbies/{code}/state`. To use your own project:

1. Create a Firebase project and a Realtime Database instance.
2. Paste its config into `firebaseConfig`.
3. Apply the security rules from `rules.json` (see below) so only valid lobby codes can read/write.

### 3. Logo GIFs (optional)

```js
const LOGO_GIF_FOLDER = 'gifs/';
const LOGO_GIF_FILES = Array.from({ length: 31 }, (_, i) => `gif${i + 1}.gif`);
```

Clicking the logo shows a random GIF over the player. Drop your own files into `gifs/` and adjust the count.

---

## Firebase security rules

Rules live in `rules.json` and restrict access to reasonably-shaped lobby codes and validated state fields. Apply them in the Firebase console under **Realtime Database → Rules**, or via the Firebase CLI:

```bash
firebase deploy --only database
```

---

## Running locally

It's a static file — no dependencies to install.

- Open `index.html` directly, **or** serve the folder (recommended, so the PWA manifest and relative paths resolve):

  ```bash
  python3 -m http.server 8000
  # then visit http://localhost:8000
  ```

---

## Deployment (GitHub Pages)

The app is hosted on GitHub Pages from the repository root.

**Option A — Deploy from a branch (simplest, no workflow):**
1. Settings → Pages → **Source** = *Deploy from a branch*.
2. Branch = `main`, folder = `/ (root)` → Save.
3. Push changes to `main`; Pages serves `index.html` directly.

**Option B — GitHub Actions:**
1. Settings → Pages → **Source** = *GitHub Actions*.
2. Ensure the `github-pages` environment allows deployments from `main` (Settings → Environments → github-pages).

To update the site without editing code in the browser, use **Add file → Upload files** and drop the new `index.html` (same filename overwrites the old one), then commit to `main`.

---

## Usage

1. Paste a YouTube playlist link and press **Load**.
2. Use the controls to play/pause, skip, shuffle, repeat, and adjust volume.
3. Add individual songs from the queue panel ("Add song by link…"), drag to reorder, or remove them.
4. Click **Lobby** to create or join a room and listen in sync with friends — the lobby code is shareable.
5. Star a playlist to save it to **Favorites**.

---

## Notes & limitations

- **Age-restricted videos** can't be played in the embedded player — this is enforced by YouTube for third-party embeds and cannot be worked around client-side.
- **Autoplay on startup** is blocked by browsers until you interact with the page; the restored track is cued and starts on your first play click.
- **Drag reordering** in very long queues works within the visible area (no edge auto-scroll yet).

---

## Tech

Vanilla HTML/CSS/JS · YouTube IFrame Player API · YouTube Data API v3 · Firebase Realtime Database · PWA (Window Controls Overlay).
