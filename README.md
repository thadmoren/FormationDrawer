# Formation Drawer

Type a football formation call (like `24B I`) and get the diagram as a downloadable PNG.
The whole app is one self-contained file — `index.html` — with no build step, no server
requirement, and no dependencies. Double-click it, or serve it for phone access.

## Run it

- **Mac**: double-click `index.html` (opens in the browser), or double-click `serve.command`
  to serve it on port 5003 for other devices.
- **Phone (Tailscale on)**: with `serve.command` running, open
  `http://thads-imac.taildabbd5.ts.net:5003`.

## Call syntax

`<left#><mod?><right#><mod?> <tag?> UB?` — e.g. `24B I`, `38W`, `23 TS`, `24 K UB`

### Surface numbers (eligibles on that side)

| # | Look | Eligibles |
|---|------|-----------|
| 1 | Single TE | 1 |
| 2 | Single WR | 1 |
| 3 | TE / Wing | 2 |
| 4 | Twins (X on line, Z slot) | 2 |
| 5 | TE / Pro | 2 |
| 6 | Inverted Twins | 2 |
| 7 | Trey | 3 |
| 8 | Trips (W–Z–X going out from the middle, X on line) | 3 |

### Modifiers (right after the number)

- **B** = Bunch (4, 7, 8) — condensed tight to the tackle. On 2 and 5, the receiver
  splits halfway in.
- **W** = Wing (4, 7, 8) — innermost eligible becomes a detached wing (H) just off
  the last man on the line. 4W is X wide + H wing.

### Backfield tags

- 1 back: **D** Dot (under center) · **P** Pistol · **L** Gun Left · **R** Gun Right
- 2 backs: **F** Split (UC) · **I** I-form · **K** King (TB in the Dot spot, FB offset
  to strength) · **Q** Queen (King's mirror — FB opposite strength, TB deep behind
  QB) · **S** Split (Gun) · **SG** gun stack strong (FB to strength, TB stacked
  behind him) · **FG** gun stack weak (same stack on the weak side) ·
  **T** T-form (HB up, weak side) ·
  **TS** T-form strong side
- No tag → shotgun assumed. Under center only when I, K, Q, F, or D is called.

### Strength

The strength side is fixed per surface combo (the winning surface is shown;
mirrors flip): 12→1 · 13→3 · 14→1 · 15→5 · 16→1 · 17→7 · 18→1 · 23→3 · 24→4 ·
25→5 · 26→6 · 27→7 · 28→8 · 34→3 · 35→3 · 36→3 · 45→5 · 56→5.
Doubles (11, 22, …), 46, and the empty combos default strength to the right.

### Rules

- Backs = 5 − total surface eligibles.
- 2 eligibles → 3 backs (full house, no tag) · 5 eligibles → empty (no tag) ·
  6 eligibles → **ILLEGAL**.
- **UB** (own word, last, space before): unbalanced — calls the opposite X over;
  he stays on the line and splits out far, covering the TE on a 1/3/5 side.

## Files

- `index.html` — the entire app (parser, canvas renderer, PNG export, recent-calls
  history, embedded reference chart).
- `reference/formation-system.png` — the original full-resolution system chart
  (a compressed copy is embedded in `index.html`).
- `serve.command` — double-click static server on port 5003 for phone access.
