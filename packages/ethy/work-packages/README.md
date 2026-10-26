# Ethy Work Packages (`work-packages/`)

Instead of building isolated horizontal layers ("first build 100% of storage, then 100% of networking, then the UI at the end"), Ethy is organized into **6 holistic vertical slices (`WP-01` to `WP-06`)**.

Every Work Package delivers a **runnable, observable, and live-testable increment** where `EthySpine`, the 4-Zone Zero-Log TUI, the `IntentEngine` microscope, and the deterministic CI harness advance together.

---

## Execution Order & Dependency Graph

```text
  ┌─────────────────────────────────────────────────────────────────────┐
  │ WP-01: Foundation — Package Scaffolding, EthySpine, 4-Zone TUI      │
  │        & Deterministic Prompt Loop (Runnable Day-1 Microscope)      │
  └───────────────────┬───────────────────────────────────┬─────────────┘
                      │                                   │
                      ▼                                   ▼ (Can run in parallel
  ┌─────────────────────────────────────────┐   ┌───────────────────────────────┐
  │ WP-02: Live devp2p Harness, Sepolia     │   │ WP-04: Bidirectional Local    │
  │        Amsterdam Config & Fresh Pivot   │   │        LLM IntentEngine       │
  │        Header Acquisition               │   │        (<ethy_state> & Gating)│
  └───────────────────┬─────────────────────┘   └───────────────┬───────────────┘
                      │                                         │
                      ▼                                         │
  ┌─────────────────────────────────────────┐                   │
  │ WP-03: 16-Bucket snap/1 Account Sync,   │                   │
  │        Range Proofs & Dev Microscope    │                   │
  └───────────────────┬─────────────────────┘                   │
                      │                                         │
                      ▼                                         │
  ┌─────────────────────────────────────────┐                   │
  │ WP-05: Contract Storage/Bytecode Sync   │                   │
  │        & Zero-Execution eth/71 BAL      │                   │
  │        Head Follower                    │                   │
  └───────────────────┬─────────────────────┘                   │
                      │                                         │
                      └───────────────────┬─────────────────────┘
                                          ▼
                      ┌─────────────────────────────────────────┐
                      │ WP-06: On-Demand @ethereumjs/evm        │
                      │        Sandbox, Light Beacon Pulse &    │
                      │        Headless SDK (FYP / MCP Ready)   │
                      └─────────────────────────────────────────┘
```

---

## How Planners (Grok 4.7) & Implementers (Composer 2.5) Use These Files

Each `WP-XX-*.md` file has three structured sections:

1. **`## 1. Holistic Scope & Architectural Requirements` (Written by Coordinator):**
   - Defines the goal, the vertical slice across Spine + TUI + Core + Tests, key EthereumJS touch points, and acceptance criteria.
2. **`## 2. Concrete Implementation Plan (Planner — Grok 4.7)`:**
   - When the human assigns a WP to Grok 4.7, Grok inspects the repo and fills out this section with exact file paths, TypeScript interfaces, edge-case handling, and test cases.
   - Grok updates the WP status in [`../PROGRESS.md`](../PROGRESS.md) from `READY_FOR_PLANNING` to `PLANNED` (and logs any new architectural decisions).
3. **`## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)`:**
   - When the human assigns the planned WP to Composer 2.5, Composer implements the code and tests, verifies `npm run tsc`, `npm test`, and `npm run spellcheck`, fills out this section with what landed (plus any implementation-time refinements and their reasoning), and marks the WP `DONE` in [`../PROGRESS.md`](../PROGRESS.md).
