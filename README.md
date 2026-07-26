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
| 8 | Trips | 3 |

### Modifiers (right after the number)

- **B** = Bunch (4, 7, 8) — condensed tight to the tackle. On 2 and 5, the receiver
  splits halfway in.
- **W** = Wing (4, 7, 8) — innermost eligible becomes a detached wing (H) just off
  the last man on the line. 4W is X wide + H wing.

### Backfield tags

- 1 back: **D** Dot (under center) · **P** Pistol · **L** Gun Left · **R** Gun Right
- 2 backs: **F** Split (UC) · **I** I-form · **K** King (TB in the Dot spot, FB offset
  to strength) · **Q** Queen · **S** Split (Gun) · **T** T-form (HB up, weak side) ·
  **TS** T-form strong side
- No tag → shotgun assumed. Under center only when I, K, Q, F, or D is called.

### Rules

- Backs = 5 − total surface eligibles.
- 2 eligibles → 3 backs (full house, no tag) · 5 eligibles → empty (no tag) ·
  6 eligibles → **ILLEGAL**.
- **UB** (own word, last, space before): unbalanced — calls the opposite X over;
  he covers the TE when crossing to a 1/3/5 side.

## Files

- `index.html` — the entire app (parser, canvas renderer, PNG export, recent-calls
  history, embedded reference chart).
- `reference/formation-system.png` — the original full-resolution system chart
  (a compressed copy is embedded in `index.html`).
- `serve.command` — double-click static server on port 5003 for phone access.
