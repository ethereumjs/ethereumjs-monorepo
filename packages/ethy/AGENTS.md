# Agent Notes — `@ethereumjs/ethy`

Entrypoint for coding agents working in **`packages/ethy`** (`@ethereumjs/ethy`, CLI binary `ethy`).

**Read this file first.** Then read [`PROGRESS.md`](./PROGRESS.md) and the specific Work Package in [`work-packages/`](./work-packages/) assigned to you.

---

## 1. Multi-Agent Operating Model

We build Ethy using three specialized agent roles:

1. **Coordinator (Gemini 4 Argon — persistent main session):**
   - Owns overall vision, cross-package consistency, work-package sequencing, and reviews progress when the human returns to say *"get up to latest changes"*.
2. **Planner (Grok 4.7):**
   - Picks up a single Work Package (`work-packages/WP-XX-*.md`), inspects the current repo state, and writes a concrete, file-by-file implementation plan into the `## Concrete Implementation Plan (Planner)` section of that WP file.
   - Records any design refinements or trade-offs in the WP file and adds architectural decisions to [`PROGRESS.md`](./PROGRESS.md).
3. **Implementer (Composer 2.5):**
   - Implements the Planner's blueprint, writes unit/virtual-buffer/synthetic-peer tests, runs `npm run tsc`, `npm test`, and `npm run spellcheck`, and updates both the WP file (`## Implementation Notes & Deviations`) and [`PROGRESS.md`](./PROGRESS.md).

## 2. Document Map

| File | Purpose |
| --- | --- |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Vision, 4-Layer `EthySpine` design, 4-Zone Zero-Log TUI, `<ethy_state>` LLM protocol, Amsterdam `snap/1` + `eth/71` BAL sync, EthereumJS codebase integration map, and CI harness. |
| [`PROGRESS.md`](./PROGRESS.md) | **Single source of truth for project state:** Work Package status table, Architectural Decision Log (`D-001`…), Upstream Library Touch Queue, and Chronological Implementation Log. |
| [`work-packages/README.md`](./work-packages/README.md) | Overview of holistic vertical slices (`WP-00` to `WP-06`), dependency graph, and how Planners and Implementers hand off work. |
| [`../../.cursor/rules/ethy-workflow.mdc`](../../.cursor/rules/ethy-workflow.mdc) | Always-on workflow rule for `packages/ethy/**` (role handoffs, upstream library hardening, dependency lock, git isolation). |
| [`../../.cursor/rules/ethy-architecture.mdc`](../../.cursor/rules/ethy-architecture.mdc) | Always-on technical invariants for `packages/ethy/**` (Worker-threaded P2P, Headless Core vs. TUI, CI abstractions, Amsterdam sync). |
| [`.cursor/rules/ethy-tui.mdc`](./.cursor/rules/ethy-tui.mdc) | TUI layout: fixed-width zones, no horizontal jump, `layout.ts` helpers. |

## 3. Non-Negotiable Guardrails

1. **No new dependencies without human approval:** Do not add packages to `package.json` without asking the human first. Build with `node:*`, `@ethereumjs/*`, and `@noble/*`.
2. **Harden the `@ethereumjs/*` stack (with clean commit isolation):**
   - A core mission of Ethy is to harden and improve our monorepo libraries under real client workloads.
   - `@ethereumjs/devp2p` can be refactored radically (starting with `WP-00`: Worker-Thread runtime, `DPT` discovery throttling, and O(N²) socket buffer elimination) while keeping general library ergonomics appealing for research and production users.
   - Other active packages (`common`, `mpt`, `statemanager`, `util`, `block`, `evm`, `vm`, `rlp`) should be actively improved when beneficial, keeping all changes **100% backwards-compatible**, logged in [`PROGRESS.md`](./PROGRESS.md) (*Upstream Library Touch Queue*), and committed separately from `packages/ethy` commits.
3. **CI is 100% offline & deterministic:** Never download LLM weights, open live P2P sockets, or require native DBs in default unit test runs. Always test through `IntentEngine`, `StateStore`, `SnapTransport`, and `renderFrame` virtual screen buffers.
4. **Headless Core:** `EthyCore` and `EthySpine` must never import TUI/ANSI/stdout modules so Ethy can double as a programmatic/MCP engine (e.g. for *Feel Your Protocol*).
5. **Finish checks:** Run `npm run tsc` and `npm run spellcheck` before completing any turn. Never `git commit` or `git push` unless explicitly asked by the human.
