# Generating formation diagrams from another tool

Formation Drawer is one self-contained HTML file — parser, renderer, and PNG export,
no build step and no dependencies. To produce diagrams somewhere else, **drive this page
rather than re-deriving the alignment rules**; the rules are owner-specified and change
often (strength table, King/Queen mirrors, UB splits), and a reimplementation goes stale
the moment they do.

## Where to get it

| | |
|---|---|
| Live app | https://thadmoren.github.io/FormationDrawer/ |
| Exact source | https://raw.githubusercontent.com/thadmoren/FormationDrawer/main/index.html |
| Repo | https://github.com/thadmoren/FormationDrawer |

Loading the live URL directly is enough — no file handoff needed, and you always get the
current rules. Fetch the raw URL instead if you want to pin a copy.

## The ready-made way

[`batch.mjs`](batch.mjs) takes formation calls and writes one PNG each.

```bash
npm i playwright && npx playwright install chromium
node batch.mjs "24B I" "18 R" "23 I UB" --out diagrams
node batch.mjs --file calls.txt --out diagrams      # one call per line, # comments ok
```

Files are named after the call: `24B I` → `24B_I.png`.

## Driving it yourself

Three DOM ids are the whole interface:

| Element | Purpose |
|---|---|
| `#call` | text input — set `.value`, then dispatch an `input` event |
| `#cv` | canvas holding the diagram — `toDataURL('image/png')` gives you the PNG |
| `#msg` | status line — `className` is `ok`, `warn`, or `err` |
| `#dl` | Download button — `.disabled` is `true` only when the call could not be parsed |

Rendering is synchronous: by the time the `input` event returns, the canvas is drawn.

```js
const input = document.getElementById('call');
input.value = '24B I';
input.dispatchEvent(new Event('input'));
const png = document.getElementById('cv').toDataURL('image/png');   // 2400x1560
```

### Reading the status (do not skip this)

| `#msg.className` | `#dl.disabled` | Meaning |
|---|---|---|
| `ok` | false | Valid call, diagram drawn |
| `warn` | false | Drawn, with a caveat — e.g. `35 K`: "K is a 2-back tag but 35 has 1 back — assuming Gun" |
| `err` | **false** | Formation is ILLEGAL (6+ eligibles) — the canvas shows an illegal card, which may be what you want |
| `err` | **true** | Call could not be parsed. **The canvas still shows the previous call** — saving here silently gives you the wrong diagram |

That last row is the trap: always check `#dl.disabled` before saving, or a typo in a call
list yields a duplicate of whatever came before it.

## Call syntax

`<left#><mod?><right#><mod?> <tag?> UB?` — e.g. `24B I`, `44W L`, `24 K UB`.
See [README.md](README.md) for surfaces 1–8, the B/W modifiers, backfield tags, and the
strength table. Note gun is assumed unless `I`, `K`, `Q`, `F`, or `D` is called, and `UB`
is its own word at the end with a space before it.
