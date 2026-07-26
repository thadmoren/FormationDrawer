# Formation Drawer

Single-file web app: type a football formation call (e.g. `24B I`), see the diagram on
canvas, download it as a PNG. Everything lives in `index.html` — parser, renderer, PNG
export, Recent/Basic call rows, and the reference chart embedded as a JPEG data URI.
No build step, no dependencies, nothing sensitive. README.md documents the call syntax
for humans; keep both docs in sync when the system changes.

## Where it runs (keep all three in sync)

- **Live site**: https://thadmoren.github.io/FormationDrawer/ — GitHub Pages off `main`
  (root). Pushing to `main` redeploys it automatically in ~1 minute.
- **Claude artifact** (same app, published from a chat): update it by passing
  `url: https://claude.ai/code/artifact/6b8e536f-9ce3-4419-aff4-abedb40ba874` to the
  Artifact tool. Its copy has no `<html>/<head>/<body>` wrapper — content only.
- **Mac clone**: `~/Desktop/FormationDrawer` on the owner's iMac (they `git pull`).
  `serve.command` (port 5003) is an optional Tailscale server; the site usually makes
  it unnecessary.

## How the owner works

Thad iterates from a phone: tests calls, screenshots a diagram, marks the wrong spot
with a red scribble, and sends it. Tweak the coordinates to match the markup — don't
redesign. Confirm each change with a headless screenshot (Playwright + system Chromium
at `/opt/pw-browsers/chromium`, page via `file://`) before pushing. Small nudges
("out a little", "teeny bit in") mean ~0.2–0.6 units.

## The call system (as clarified by the owner — trumps the reference chart)

`<left#><mod?><right#><mod?> <tag?> UB?` — e.g. `24B I`, `44W L`, `24 K UB`.

- Surfaces 1–8 (eligibles per side): 1 TE · 2 WR · 3 TE/Wing · 4 Twins (X on line,
  Z slot) · 5 TE/Pro · 6 Inverted Twins · 7 Trey · 8 Trips. Backs = 5 − total
  eligibles; 2 elig = full house, 5 = empty, 6 = ILLEGAL.
- **B** (bunch): tight to the tackle — 4B is X on the line just outside the tackle
  with Z tucked inside off the line. On 2 and 5 the receiver splits halfway in.
- **W** (wing): innermost eligible becomes a detached wing (H) just off the last man
  on the line (tight to the tackle when there's no TE). 4W = X wide + H wing.
- Tags: D/P/L/R (1 back) · F/I/K/Q/S/T/TS/KG/QG (2 backs). **Gun is assumed unless
  I, K, Q, F, or D is explicitly called.** K (King) = tailback in the Dot spot with
  the fullback offset to strength. T = halfback up level with the fullback, weak
  side; TS = same but strong side. KG/QG = King/Queen from the gun.
- **UB**: its own word, last, space before (`24 K UB`). Calls the opposite X over;
  he covers the TE (lands on the line just outside him) when crossing to a 1/3/5
  side. Squished `12UB` is reserved for a future meaning and must stay rejected.
- The embedded reference chart has two known self-inconsistencies (its `47B P` and
  `38W S` example rows contradict its own back-count math); the math wins.

## UI conventions

- **Recent** row: last 10 valid calls, recorded on pause/Enter/blur/download,
  persisted in localStorage (`formationRecent`).
- **Basic** row: 10 owner-chosen quick calls, hardcoded in `EXAMPLES`:
  18 R · 23 T · 44 R · 44W L · 14 I · 24 QG · 18B D · 51 I · 34 R · 27 L.
- Positions live in `surfaceLayout()` (per-side eligibles; `u` = units from center,
  positive, mirrored per side; `off` = off the LOS) and `backfieldLayout()` (`d` =
  depth in yards; `str` = ±1 strength side, right on ties).
- To swap the embedded reference chart: compress to JPEG (~300 KB), base64 into the
  `refchart` img, and update `reference/formation-system.png`.
