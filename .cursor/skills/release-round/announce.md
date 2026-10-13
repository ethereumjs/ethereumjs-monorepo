# Announcements (phase 6)

The human posts; the agent prepares paste-ready copy. No Twitter/Discord MCP.

## Before writing

1. Re-read the **phase-1 emphasis**.
2. Skim what shipped — `@ethereumjs/vm` CHANGELOG is the default richest source.
3. Confirm Twitter/X handle (historically `@EFJavaScript` — do not assume) and Discord channel (`https://discord.gg/TNwARpR`) if unclear.

## Narrative

| Type | Story | Format |
| --- | --- | --- |
| Bugfix / maintenance | What was broken → fixed in `10.x.y` | Single tweet + links |
| Security-sensitive | Severity without drama → upgrade path | Tweet + Discord detail; no exploit recipe |
| Fork preview | Hook → map → try → **not production** → links | Thread (5–8). Spark a follow-up EIP series when the fork is the story. |
| EIP deep-dive | Status quo → what changed → run it → gotcha | Thread (8–12). Hold the reader's hand. |
| Minor / finalized feature | What unlocks → one code path → links | Tweet or short thread |

**One idea, one audience.** Do not list all twelve packages unless integrators need that.

**Links:** GitHub `@ethereumjs/vm@v<version>` (richest notes); `npm i @ethereumjs/vm@<version>`. Official fork sources only: `eips.ethereum.org`, `blog.ethereum.org`, `ethereum-magicians.org`, execution-specs releases. Do not cite random recap blogs.

## Visual grammar (every thread)

Tweets are a *layout*, not a paragraph with line breaks. Aim for a poster you can scan in two seconds.

- **One beat per tweet.** Hook, map, feeling, try, series, caveat — never two of those in one card.
- **Short lines + blank lines.** Three or four beats, then air. Walls of text get skipped.
- **A repeating mark, used sparingly.** One emoji as a section label (`⛽` gas, `📋` BAL) — not a sticker on every line.
- **Lists as posters.** `•` or `1.` with a short title, then a quieter sub-line. No nested bullets.
- **Code as a prop, not a dump.** One identifier or a 2–3 line snippet in backticks. Longer code → **snippet PNG**, not a tweet body.
- **Links at the end of a tweet**, never in the middle of a sentence. One or two per tweet; park the rest in the last tweet / Discord.
- **Stay under 280.** Split rather than abbreviate API names (`Hardfork.Amsterdam`, `estimateTxGasDimensions`). Count URLs as 23 characters.
- **Images.** Attach a snippet PNG on the tweet that *shows* the idea (the "try" or "this is how it feels" card). Alt text: what the snippet demonstrates, not "screenshot".
- **Thread chrome.** `🧵` only on tweet 1. Do not number `1/7` on every tweet unless the human asks.

## EIP deep-dive series (follow-up threads)

Audience is **Ethereum developers**, not "JS people". JavaScript is the accessible lab bench. Assume mixed platforms and little TypeScript.

Each EIP thread must:

1. **Name the status quo** in one concrete sentence ("a transfer was always 21,000 gas").
2. **Name the new behavior** in one concrete sentence, with the EIP number and a link.
3. **Walk the example** as if sitting next to the reader: install → copy this file → this line is the old world → this line is the new world → this is what prints and why.
4. **Call out the gotcha** wallets / indexers / dapps will hit.
5. End with the next thread teaser and the experimental caveat.

Do not dump the spec. Translate it.

## Paste-ready kit

Deliver in one message:

1. **Twitter/X** — numbered tweets as copy-paste blocks, plus which PNG (if any) attaches to which tweet. Stay under 280; split rather than abbreviate API names.
2. **Discord** — same facts, slightly more context (hardfork, spec snapshot, `npm i` fence).
3. **Optional third** — default skip (e.g. Magicians only if the human wants it).
4. **Series plan** — if this is a fork overview, list the planned follow-up EIP threads *now* (titles + EIP numbers + why that EIP).

**Snippet PNGs** from package examples:

```sh
npm run install-browser-deps   # once, if Chromium is missing
npm run snippet:png -- --file=packages/vm/examples/runTxGasDimensions.ts \
  --lines=36-46 --title="Amsterdam: a transfer is two gas dimensions" \
  --out=tmp/announce/amsterdam-gas.png
```

Attach PNGs manually; do not auto-post.

Do not over-promise production readiness on experimental forks. EthereumJS covers the **execution-layer (Amsterdam)** surface, not consensus-layer headliners (e.g. ePBS / EIP-7732) — say so when the fork name is Glamsterdam. Do not auto-post.
