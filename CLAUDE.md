# Formation Drawer

Single-file web app: type a formation call (e.g. `24B I`), see the diagram, download a PNG.
Everything lives in `index.html` — parser, canvas renderer, PNG export, recent-calls list,
and the reference chart embedded as a JPEG data URI. No build step, no dependencies.
README.md documents the full call syntax; keep it in sync when the system changes.

## Editing rules

- Player alignments live in `surfaceLayout()` (per-side eligibles; `u` = units from center,
  `off` = off the line) and `backfieldLayout()` (QB + backs; `d` = depth in yards).
  Positions mirror automatically per side — always express them as positive `u`.
- The owner iterates by marking up screenshots; tweak coordinates to match, don't redesign.
- UB syntax: trailing space-separated word only (`24 K UB`). Squished `12UB` is reserved
  for a future meaning and must stay rejected.
- Test by driving the page headlessly (Playwright + system Chromium) and screenshotting
  the canvas for a visual check before pushing.
- To swap the embedded reference chart: compress to JPEG (~300 KB), re-encode to base64
  into the `refchart` img, and update `reference/formation-system.png`.

## Deploy

Push to `main`. The owner pulls on the iMac (`~/Desktop/FormationDrawer`) and uses
`serve.command` (port 5003) for phone access over Tailscale.
