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
| Fork preview | Hook → what to try → **not production** → links | Short thread (3–5) |
| Minor / finalized feature | What unlocks → one code path → links | Tweet or thread |

**One idea, one audience.** Do not list all twelve packages unless integrators need that.

**Links:** GitHub `@ethereumjs/vm@v<version>` (richest notes); `npm i @ethereumjs/vm@<version>`.

## Paste-ready kit

Deliver in one message:

1. **Twitter/X** — single tweet (hook + version + one capability + link) or thread (hook → what to try → links + caveat). Stay under 280; split rather than abbreviate API names.
2. **Discord** — same facts, slightly more context (hardfork, spec snapshot, `npm i` fence).
3. **Optional third** — default skip (e.g. Magicians only if the human wants it).

**Visuals (v1):** text first. Optional one release card via image generation if the human wants it. Code-snippet images are a follow-up.

Do not over-promise production readiness on experimental forks. Do not auto-post.
