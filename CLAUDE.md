# Formation Drawer

Single-file web app: type a football formation call (e.g. `24B I`), see the diagram on
canvas, download it as a PNG. Everything lives in `index.html` — parser, renderer, PNG
export, Recent/Basic call rows, and the reference chart embedded as a JPEG data URI.
No build step, no dependencies, nothing sensitive. README.md documents the call syntax
for humans; keep both docs in sync when the system changes.

## Where it runs (keep all three in sync)

- **Live site**: https://thadmoren.github.io/FormationDrawer/ — GitHub Pages off `main`
  (root). Pushing to `main` redeploys it automatically in ~1 minute. The page carries
  no-cache meta tags and a `.ver` stamp next to the subtitle (`v2026.07.26` style) —
  **bump it on every push**. When the owner reports a fix that "didn't take", compare
  the stamp in their screenshot against the current one before touching code: it is
  usually a stale phone cache, not a bug. Verify with
  `curl -s https://thadmoren.github.io/FormationDrawer/index.html | grep …`.
- **Claude artifact** (same app, published from a chat): update it by passing
  `url: https://claude.ai/code/artifact/6b8e536f-9ce3-4419-aff4-abedb40ba874` to the
  Artifact tool. Its copy has no `<html>/<head>/<body>` wrapper — content only.
- **Mac clone**: `~/Documents/FormationDrawer` on the owner's iMac (they `git pull`).
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
- **Q (Quad)** is a ninth surface written as a letter, not a digit: 4 eligibles —
  X on the line at 7.2 with Z (5.8), H (4.3) and W (2.9) off it inside him
  (W innermost, matching Trips). Four
  eligibles means the only legal partners are 1 and 2, so **Q is always an empty
  backfield**. `surf()` in `parseCall` keeps "Q" a string while digits become
  numbers, so anything doing arithmetic on `side.n` (the TO odd/even test) must
  special-case it.
- **B** (bunch): tight to the tackle — 4B is X on the line just outside the tackle
  with Z tucked inside off the line. 8B is the same **triangle** as 8P but tight:
  X the point on the line at 4.0, W (3.2) and Z (4.8) winging off him on both sides.
  On 2 and 5 the receiver splits halfway in.
- **W** (wing): innermost eligible becomes a detached wing (H) just off the last man
  on the line (tight to the tackle when there's no TE). 4W = X wide + H wing.
- **P** (Pokémon, 4 and 8 only): the bunch picked up and set out wide. 8P is the
  bunch out where the X normally splits, formed as a **triangle**: X is the point on
  the line at 7.2 with W (6.4) and Z (8.0) winging off him on *both* sides, one
  inside and one outside. 4P is X at a normal 7.2 split with Z at 6.1 as an inside
  wing. **QP is the quad out wide as a DIAMOND**: X the point on the line at 7.2,
  W (6.1) and Z (8.3) flanking off the ball, H behind at 7.2 and 2.4 yards deep.
  That back man is the only player who uses an explicit `d` in `surfaceLayout` —
  every other entry gets its depth from the `off` flag (0 or 1.1).
  **P collides with the Pistol tag** once spaces are stripped, so `parseCall` checks
  for a trailing `" P"` *before* stripping: spaced (`18 P`) = Pistol, attached
  (`18P`) = Pokémon. Don't "simplify" that check away — it silently breaks Pistol.
- Tags: D/P/L/R (1 back) · F/I/K/Q/S/T/TS/KG/QG/SG/WG (2 backs). SG/WG are the
  gun stacks (fullback with the tailback directly behind him) — SG to strength,
  WG away from it. **`FG` is a legacy alias for WG**: the owner first named it FG,
  then corrected it to WG, so both parse. Keep FG working. **Gun is assumed unless
  I, K, Q, F, or D is explicitly called.** The single back in gun is labeled T
  (D and P stay R). K (King) = tailback in the Dot spot with the fullback offset
  to strength in the guard–tackle gap. Q (Queen) = King's mirror: fullback opposite
  strength, tailback straight behind the QB but deeper than the Dot. KG/QG =
  King/Queen from the gun; there the tailback offsets beside the QB — to strength
  in QG, away from it in KG (opposite the fullback). **King and Queen are mirrors:
  any markup fix to one applies flipped to the other, including the G versions.**
  T = halfback up level with the fullback, weak side; TS = same but strong side.
- **Two-Up tags (3 backs, gun): S2G · W2G · K2G · Q2G.** The first real 3-back tags —
  before these, any tag on a 2-eligible formation was rejected. Two backs sit a yard
  off the ball in the **B gap (1.5) and C gap (2.5)** on the named side; the third
  takes the matching 2-back tag's tailback spot, which is what separates S2G from K2G
  (third strong vs weak) and W2G from Q2G. Their names carry a digit, so they must
  come FIRST in the tag alternation or `S` would match and leave `2G` dangling.
- Strength is owner-locked per surface pair (winning surface listed; mirrors flip):
  12→1 · 13→3 · 14→1 · 15→5 · 16→1 · 17→7 · 18→1 · 23→3 · 24→4 · 25→5 · 26→6 ·
  27→7 · 28→8 · 34→3 · 35→3 · 36→3 · 45→5 · 56→5. Unlisted pairs (doubles, 46,
  and the empty 5-eligible combos) default strength to the right side; the owner
  called those "difficult to determine". Table lives in `STR_WINNER`.
- **TO**: its own word, last, like UB (`17W L TO`). It is UB's twin — UB crosses the
  backside **X**, TO crosses the backside **Y** — but they move different men. **TO needs
  exactly one odd surface and one even**: the odd side has the Y being doubled, and
  **the even side's WR crosses over to become the second Y**. Two odds is rejected —
  you can't tell which TE should travel; two evens has no TE to double. So the
  single-receiver side is called as its even number: `27W L TO`, not `17W L TO`. The TE crosses to the strength side and
  stacks on the line just outside its last lineman, giving a 4-man surface that reads
  **G T Y Y**. The receiving side keeps everyone it already had (in `17W L TO` the
  7 keeps its Y/H/Z and the extra Y stacks on); **the donor side is left bare — just
  T G**. Everyone off the ball on that side slides out with the line (capped at an 8.6
  split), so a 7W still reads as a 7W one man wider — wing flanking **outside both
  Y's**, Z out at a real receiver split. Only a player moves, so eligible and back counts are unchanged.
- **UB**: its own word, last, space before (`24 K UB`). Calls the opposite X over;
  he stays on the line and lands FAR — a wide split (7.2u), or one unit outside
  the widest on-line man if that's wider. Covers the TE on a 1/3/5 side.
  Squished `12UB` is reserved for a future meaning and must stay rejected.
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
