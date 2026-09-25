/* Echo offline worker.

   In plain terms: it keeps a copy of the app on the device so it opens without a
   connection, and it tells the page when a newer version exists so you can take it
   when you are ready.

   The one rule that matters: a new version is NEVER applied while you are mid-read.
   It downloads quietly, the page shows a small bar, and the swap happens only when
   you tap it. Changing the interface under someone who is verifying a story is
   worse than them running a ten-minute-old version.

   Bump VERSION on every deploy. That is what tells every installed copy that
   something changed. */
const VERSION = "echo-2026-09-25-launch-film";

const ASSETS = [
  "./",
  "./index.html",
  "./window.html",
  "./manifest.webmanifest",
  "./logo.svg",
  "./favicon.svg",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./icon-monochrome-512.png",
  "./apple-touch-icon.png",
  // The brand face. Cache-first like the icons: three files, ~140KB, and they never
  // change unless the typeface does.
  "./ArialNova-Light.woff2",
  "./ArialNova.woff2",
  "./ArialNova-Bold.woff2"
];

/* PAST THE BROWSER'S HTTP CACHE. GitHub Pages serves every file with max-age=600, and a plain fetch
   from here goes through the browser's HTTP cache. So for ten minutes after a deploy this worker
   installed the NEW version number holding the OLD page, and every visit in that window ran old code:
   a new tab opened 2026-09-21 on "echo-2026-09-21-ask-smart-steady" was still missing that deploy's
   functions. That is why only Ctrl+F5 (which skips the HTTP cache) seemed to fix things. "reload" on
   install always downloads; "no-cache" on a page asks the server first and costs a 304 when unchanged. */
self.addEventListener("install", e => {
  // Deliberately no skipWaiting here. The page decides when to swap.
  e.waitUntil(caches.open(VERSION)
    .then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: "reload" }))))
    .catch(() => {}));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // Never touch anything off this origin. Google sign-in and the Drive API must go
  // straight to the network, and caching a Drive response would be actively wrong —
  // it would serve yesterday's news as though it were today's.
  if (url.origin !== self.location.origin) return;

  // Network first for the app itself, so a fresh copy wins whenever there is a
  // connection and the cache is the fallback rather than the default.
  const isPage = req.mode === "navigate" ||
                 url.pathname.endsWith(".html") ||
                 url.pathname.endsWith("/");
  if (isPage) {
    e.respondWith(
      // By URL, not by req: a navigation Request cannot be copied with options.
      fetch(req.url, { cache: "no-cache", credentials: "same-origin" })
        .then(res => {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then(hit => hit || caches.match("./window.html")))
    );
    return;
  }

  // Cache first for icons and the manifest, which change rarely.
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(VERSION).then(c => c.put(req, copy)).catch(() => {});
      return res;
    }))
  );
});

self.addEventListener("message", e => {
  if (e.data === "applyUpdate") self.skipWaiting();
});
