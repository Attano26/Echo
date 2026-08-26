# Elemental

Competitor and market intelligence for the outward-opening aluminium window industry. The phone app
gathers the news. This is the web half: you read what it found, decide what holds up, and turn the
verified stories into a report.

**Use it at [attano26.github.io/Product_Market_Intel/elemental.html](https://attano26.github.io/Product_Market_Intel/elemental.html)**

## What it does

Sign in with Google and it reads the backup your phone wrote to your own Drive. You get everything
the phone holds: alerts, saved stories, liked and disliked, published reports, and the competitors,
markets and norms you have onboarded.

Tick the stories that stand up to a fact-check, then generate a report as PDF or Word. Published
stories move out of Alerts and into Published, exactly as they do on the phone.

## What it deliberately does not do

**It never fetches news.** Fetching costs money and only the phone does it. This page reads what has
already been gathered, so opening it costs nothing and it holds no API key of any kind.

## How syncing works

Two files in your Drive, each with one writer:

| File | Written by | Read by |
|---|---|---|
| `elemental-data.json` | the phone | this page |
| `elemental-web-actions.json` | this page | the phone |

Because no field is written by both sides, neither can overwrite the other. This page can never
destroy a news fetch your phone made while you were reading. Everything it writes is additive.

To see your data here, open the phone app, go to **Settings → Storage**, and press **Back up**. To
pull your web decisions back to the phone, press **Sync** on that same screen.

## Sign-in

You are asked for one permission: `drive.file`. That lets this page touch only the files it creates
in your Drive and nothing else you keep there.

The consent screen appears once. After that, signing in is silent, because Google remembers the
grant. **Sign out** forgets the token in this browser only — nothing in your Drive is deleted, and
signing back in needs no prompts.

Two people using this share nothing. Each signs in as themselves, and each file lives in its owner's
own Drive.

## Your data

There is no server in this. Nothing passes through anyone else. Your data is in your Drive and in
this browser, and nowhere else.

Clearing site data clears this browser's copy only. Your Drive file and your phone are untouched.

## Reports

**PDF** uses your browser's own print dialogue, so choose *Save as PDF* in the destination list. The
output matches what you see rather than a re-drawing of it.

**Word** downloads a document that Word and Google Docs both open normally.

Past reports stay under **Reports** and can be downloaded again at any time.

## What it is not

It reports what was published elsewhere. It does not verify claims for you, and a story appearing
here is not evidence that it is true. That is what the verify step is for. Check anything before it
informs a commercial decision.
