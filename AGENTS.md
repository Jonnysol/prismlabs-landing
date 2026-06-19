# AGENTS.md — PrismLabs landing page

Guide for any AI agent or developer working on this repo. Read this first.

## What this is
A single-page investor landing site for **PrismLabs** — a pre-seed startup building **"the ambient OS for physical space."** One overhead device sees a room in 3D and projects an interactive display onto any surface (paper, table, wall), then disappears. No headset, no glasses, no screen. Founders: an Apple Vision Pro engineer + a co-founder from Even Realities; a prior projection-tracking system won a national gold medal (recognized by U.S. Senator Mark Warner).

Owner: Jonny (jonatechtv@gmail.com). Repo: https://github.com/Jonnysol/prismlabs-landing — served via GitHub Pages at https://jonnysol.github.io/prismlabs-landing/

## Repo layout
```
index.html        the live site (single file: HTML + CSS + JS)
studio.js         live design panel, gated behind ?studio (see below)
admin.html        version-control portal (compare every version, pick a favourite, toggle editor)
versions.json     manifest the admin reads (auto-generated)
versions/<sha>/   one viewable snapshot per commit (auto-generated; shares root /assets)
build_versions.py rebuilds versions/ + versions.json + git tags from git history
assets/           web-optimized video + poster files (muted, faststart, ~720p)
AGENTS.md         this file
```
There is no build step. It's static. Edit `index.html` directly.

## Design system (do NOT drift from this)
- **Concept:** a dim room lit only by the projector. Dark "viewfinder" staging, real footage full-bleed, deck-tight copy. Reference vibe: Anduril / Linear — serious hardware company.
- **Hard no:** never go back to the old look — cream background + Instrument Serif + terracotta. That's the AI-default that was explicitly rejected (it's archived as v1/v2).
- **Palette (CSS vars in `:root`):** `--room #0E0D0B` bg · `--paper #E9E7E0` text · `--mute #928C80` · `--beam #F2A65A` (warm accent, used sparingly) · `--scan #7FC9D2` (cool, for perception/AI cues).
- **Type:** `--font-display` + `--font-body` = **Satoshi** (loaded via Fontshare). `--font-mono` = **Space Mono** (labels/eyebrows/telemetry). All fonts + the type scale are CSS variables so the Studio can drive them live: `--hero-scale --head-scale --body-scale --disp-weight --disp-stretch --disp-tracking`.
- **Structure (a deck, not a website):** hero → "the idea" → measure reel → proof grid (6 real clips) → "it sees the room" (perception) → ambient-at-home → "any room" scene renders → why-now → closing → footer. Keep it tight; cut, don't pad.
- **Signature:** real footage + the device's own telemetry as the only decoration (mono labels like `DEPTH · SURFACE LOCKED · PROJECTING`), subtle viewfinder corner ticks.

## Copy rules (enforced — the owner cares a lot)
Follow **stop-slop** (https://github.com/hardikpandya/stop-slop). Concretely:
- **No em dashes.** Ever. Use periods, commas, colons, or restructure. (Both the owner and stop-slop ban them.)
- No "Wh-" sentence openers in prose, no "not X but Y" binary contrasts, no metronomic fragment stacking, no business jargon, no adverb pileups, active voice.
- Sentence case. Short and scannable — no big paragraphs (nobody reads them).
- Voice: confident, plain, real. Not corny. Tone target lines: "the ambient OS for physical space", "the room is the interface", "only light shows. black stays invisible", "your home already has walls. we gave it a mind."
- A full copy brief lives at `~/Downloads/prismlabs_copy_brief.md` (owner's machine).

## Video rules
- Mobile won't autoplay many videos. Only the hero has `autoplay`; all others are played/paused by an IntersectionObserver (`index.html` script) when they enter/leave the viewport, plus a gesture "kick" fallback. **Keep this pattern** — do not add `autoplay` to every `<video>`.
- All clips: `muted loop playsinline preload="metadata"` (+ poster). Web assets are muted + faststart.
- Source footage lives on the owner's machine (`~/Downloads/Photos-3-001 (1)/`, `~/Downloads/prismlabs_clips/`, `~/Downloads/prismlabs_fbcdn/`). Transcode with ffmpeg to ~720p CRF 30, `-an`, `+faststart`.

### What each asset is
- `hero-tutoring` — long-division projected on a notebook (hero + proof). The signature "magic" shot.
- `measure`, `measure-2`, `measure-table` — projected dimension labels on real objects (the "H" fiducial calibration table).
- `overhead` — the system's overhead camera tracking view.
- `track-person` — live body/pose skeleton projected on a person. `object` — object recognition close-up. `artwork` — colourful image projected on a surface.
- `ambient-bird`, `ambient-art`, `ambient-display` — polished home demos: art on a wall, mint canvas, gesture display. The most "big-company" footage.
- `room-scan`, `room-layout`, `room-seg`, `rooms-grid` — 3D scene-understanding renders (SceneScript-class, MIT-licensed, represent the perception tech). Use in dark sections.
- `signoff`, `device.jpg` — founder thumbs-up + the real prototype rig. Kept for the deck, not currently placed.

## The Studio (live editor) — `studio.js`
Enable by visiting any page with `?studio` (persists in localStorage). A gear appears bottom-right. Lets the owner change fonts (Google + Fontshare: Satoshi/General Sans/Switzer/Clash…), type scale, weight/width/spacing, accent colour, and edit text inline. "Copy settings" exports a `:root{…}` block + font `<link>`s to paste back; an agent then bakes those values into `index.html`'s `:root`. Gated so investors never see it. To kill it for good: delete `studio.js` + its `<script>` tag.

## The version system — `admin.html` + `build_versions.py`
- **Every commit that changes `index.html` becomes a viewable version.** `build_versions.py` walks git history, writes a snapshot to `versions/<sha7>/` (asset paths rewritten to the shared root `/assets`, so each snapshot is tiny), regenerates `versions.json` (newest-first), and tags each commit `v1..vN`.
- `admin.html` reads `versions.json` and shows every version with a live preview, a "Favourite" picker, a Studio on/off toggle (sets `localStorage.pl_studio` for the whole origin), and an "Export for Claude" button.
- **Run `python3 build_versions.py` after any change to `index.html`**, then commit, so the timeline stays complete. (TODO: a GitHub Action could do this on push automatically.)

## Branches & deploy
- `main` = live (GitHub Pages serves it). `level-three`, `level-four` = working branches. `stable` = the original cream page. Tags `v1..vN` = per-commit versions.
- Deploy flow used here: commit on the working branch → `git push origin <branch>` → `git checkout main && git merge <branch> --ff-only && git push origin main` → Pages rebuilds (~1 min). Push tags with `git push -f origin --tags`.
- End commit messages with: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.

## Working copy
The repo lives at `~/prismlabs-landing` on the owner's machine (moved out of `/tmp` after it got wiped — never use `/tmp` for the working copy). Preview locally with `python3 -m http.server` from the repo root.

## Open TODOs
- Owner has screenshots + more videos to add (check `~/Downloads`).
- Consider softening hero font weight (Satoshi 700 → 500/600) — owner felt it's a touch bold.
- Optional: GitHub Action to auto-run `build_versions.py` on push.
- The v1/v2 cream archives reference Facebook-CDN media that may have expired (design shows, videos may 404).
