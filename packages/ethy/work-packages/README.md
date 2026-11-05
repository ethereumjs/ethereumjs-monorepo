# Ethy Work Packages (`work-packages/`)

Instead of building isolated horizontal layers ("first build 100% of storage, then 100% of networking, then the UI at the end"), Ethy is organized into **7 holistic Work Packages (`WP-00` to `WP-06`)**.

Every Work Package delivers a **runnable, observable, and live-testable increment** where `@ethereumjs/*` library hardening, `EthySpine`, the 4-Zone Zero-Log TUI, the `IntentEngine` microscope, and the deterministic CI harness advance together.

---

## Execution Order & Dependency Graph

```text
  ┌─────────────────────────────────────────┐   ┌─────────────────────────────────────────┐
  │ WP-00: @ethereumjs/devp2p Worker-Thread │   │ WP-01: Ethy Foundation — Scaffolding,   │
  │        Runtime, Discovery Flow Control  │   │        EthySpine, 4-Zone TUI &          │
  │        & O(N²) Peer Buffer Hardening    │   │        Deterministic Prompt Loop        │
  └───────────────────┬─────────────────────┘   └───────┬─────────────────────────┬───────┘
                      │                                 │                         │
                      └───────────────┬─────────────────┘                         ▼
                                      ▼                                 ┌─────────────────────────┐
                      ┌─────────────────────────────────────────┐       │ WP-04: Bidirectional    │
                      │ WP-02: Live Threaded P2P Harness,       │       │        Local LLM        │
                      │        Sepolia Amsterdam Config &       │       │        IntentEngine     │
                      │        Fresh Pivot Header Acquisition   │       │        (<ethy_state>)   │
                      └───────────────────┬─────────────────────┘       └─────────┬───────────────┘
                                          │                                       │
                                          ▼                                       │
                      ┌─────────────────────────────────────────┐                 │
                      │ WP-03: FlatStateManager, Offline snap/1 │                 │
                      │        Account Sync & Dev Microscope    │                 │
                      └───────────────────┬─────────────────────┘                 │
                                          │                                       │
                                          ▼                                       │
                      ┌─────────────────────────────────────────┐                 │
                      │ WP-03b: P2P Master Plan — 4-Stage Probe,│                 │
                      │         Direct DNS/EIP-868 ENR Pipeline │                 │
                      │         & Live snap/1 Verification      │                 │
                      └───────────────────┬─────────────────────┘                 │
                                          │                                       │
                                          ▼                                       │
                      ┌─────────────────────────────────────────┐                 │
                      │ WP-03c: Honest Block-Range Advertising  │                 │
                      │         & Rolling-Window eth/69–71      │                 │
                      │         Server (Headers/Bodies/Receipts)│                 │
                      └───────────────────┬─────────────────────┘                 │
                                          │                                       │
                                          ▼                                       │
                      ┌─────────────────────────────────────────┐                 │
                      │ WP-04a: P2P Reliability, VIP Peer       │                 │
                      │         Retention, Single-Pivot snap/1  │                 │
                      │         Discipline & --fresh Canary     │                 │
                      └───────────────────┬─────────────────────┘                 │
                                          │                                       │
                                          ▼                                       │
                      ┌─────────────────────────────────────────┐                 │
                      │ WP-04b: 4-Row Phase-Adaptive Node Pulse │                 │
                      │         UI, Post-SNAP eth/71 BAL        │                 │
                      │         Catch-Up & Laptop-Sleep Resume  │                 │
                      └───────────────────┬─────────────────────┘                 │
                                          │                                       │
                                          ▼                                       │
                      ┌─────────────────────────────────────────┐                 │
                      │ WP-04c: @ethereumjs/util BinaryAccount, │                 │
                      │         Constant-Time Sync Throughput,  │                 │
                      │         2x Peer Pipelining & Pause      │                 │
                      └───────────────────┬─────────────────────┘                 │
                                          │                                       │
                                          ▼                                       │
                      ┌─────────────────────────────────────────┐                 │
                      │ WP-04d: Worker Proof Verifier, 256-Shard│                 │
                      │         FlatStateManager & Resume-After-│                 │
                      │         Head Ordering                   │                 │
                      └───────────────────┬─────────────────────┘                 │
                                          │                                       │
                                          ▼                                       │
                      ┌─────────────────────────────────────────┐                 │
                      │ WP-04e: O(1) Contract Queue, Multi-     │                 │
                      │         Worker Verify Pool, Multi-Peer  │                 │
                      │         Hold & 100k Scale/Resume Gate   │                 │
                      └───────────────────┬─────────────────────┘                 │
                                          │                                       │
                                          ▼                                       │
                      ┌─────────────────────────────────────────┐                 │
                      │ WP-04f: Multi-Peer Swarm Engine (devp2p │                 │
                      │         Dial Pool, Pre-STATUS Gate,     │                 │
                      │         PeerBook Rotator & 8-Peer Sim)  │                 │
                      └───────────────────┬─────────────────────┘                 │
                                          │                                       │
                                          ▼                                       │
                      ┌─────────────────────────────────────────┐                 │
                      │ WP-04g: 100M-Account Scale (Slab-Arena  │                 │
                      │         FlatStateManager, Bounded Cache,│                 │
                      │         O(1) Tail Resume & Watchdog)    │                 │
                      └───────────────────┬─────────────────────┘                 │
                                          │                                       │
                                          ▼                                       │
                      ┌─────────────────────────────────────────┐                 │
                      │ WP-04h: N-Way Sub-Range Cursor Pool &   │                 │
                      │         10-Peer Dynamic Work-Stealing   │                 │
                      └───────────────────┬─────────────────────┘                 │
                                          │                                       │
                                          ▼                                       │
                      ┌─────────────────────────────────────────┐                 │
                      │ WP-04i: @ethereumjs/mpt Batch Range-    │                 │
                      │         Proof Hashing (8x Fewer Keccak) │                 │
                      │         & Direct-to-Slab Account Parser │                 │
                      └───────────────────┬─────────────────────┘                 │
                                          │                                       │
                                          ▼                                       │
                      ┌─────────────────────────────────────────┐                 │
                      │ WP-04j: Stack-Wide WASM Crypto          │                 │
                      │         Acceleration (keccak256) &      │                 │
                      │         devp2p RLPx MAC Cipher Reuse    │                 │
                      └───────────────────┬─────────────────────┘                 │
                                          │                                       │
                                          ▼                                       │
                      ┌─────────────────────────────────────────┐                 │
                      │ WP-04k: Continuous Parallel eth/71 BAL  │                 │
                      │         Streaming, Routine 16-Block     │                 │
                      │         Rolling Pivot & Live Head Flip  │                 │
                      └───────────────────┬─────────────────────┘                 │
                                          │                                       │
                                          ▼                                       │
                      ┌─────────────────────────────────────────┐                 │
                      │ WP-05a: @ethereumjs/beacon-light Core — │                 │
                      │         Common CL Config, SSZ Merkle &  │                 │
                      │         BLS12-381 Sync Committee Verify │                 │
                      └───────────────────┬─────────────────────┘                 │
                                          │                                       │
                                          ▼                                       │
                      ┌─────────────────────────────────────────┐                 │
                      │ WP-05b: @ethereumjs/beacon-light Live   │                 │
                      │         Transport, Standalone CLI Pulse │                 │
                      │         & Ethy Consensus Anchor (/cl)   │                 │
                      └───────────────────┬─────────────────────┘                 │
                                          │                                       │
                                          ▼                                       │
                      ┌─────────────────────────────────────────┐                 │
                      │ WP-06a: ETHY/0 DevP2P Protocol Spec     │                 │
                      │         (ethereumjs/protocols Repo &    │                 │
                      │         devp2p/ETHY-0-SPEC.md)          │                 │
                      └───────────────────┬─────────────────────┘                 │
                                          │                                       │
                                          ▼                                       │
                      ┌─────────────────────────────────────────┐                 │
                      │ WP-06b: @ethereumjs/devp2p ETHY/0       │                 │
                      │         Subprotocol, Proven-Chunk       │                 │
                      │         Server, ETHY_PEX & --connect    │                 │
                      └───────────────────┬─────────────────────┘                 │
                                          │                                       │
                                          ▼                                       │
                      ┌─────────────────────────────────────────┐                 │
                      │ WP-06c: Ethy ETHY/0 Swarm Sync, Proof   │                 │
                      │         Sidecars, ETHY vs SNAP Selector,│                 │
                      │         Adaptive TUI & 2-Node Loopback  │                 │
                      └───────────────────┬─────────────────────┘                 │
                                          │                                       │
                                          ▼                                       │
                      ┌─────────────────────────────────────────┐                 │
                      │ WP-06d: Stateful Session Resume         │                 │
                      │         Coordinator, Multi-Hour BAL     │                 │
                      │         Pivot Bridging & Slot Alignment │                 │
                      └───────────────────┬─────────────────────┘                 │
                                          │                                       │
                                          ▼                                       │
                      ┌─────────────────────────────────────────┐                 │
                      │ WP-06e: 3x-5x Sync Throughput Engine —  │                 │
                      │         Client Affinity (Nethermind),   │                 │
                      │         384KiB Chunks & Speculative     │                 │
                      │         Zero-Bubble Cursor Pipelining   │                 │
                      └───────────────────┬─────────────────────┘                 │
                                          │                                       │
                                          └───────────────────┬───────────────────┘
                                                              ▼
                                          ┌─────────────────────────────────────────┐
                                          │ WP-07: Bidirectional Local LLM          │
                                          │        IntentEngine (<ethy_state>       │
                                          │        & Dynamic Tool Gating)           │
                                          └───────────────────┬─────────────────────┘
                                                              │
                                                              ▼
                                          ┌─────────────────────────────────────────┐
                                          │ WP-08: On-Demand @ethereumjs/evm        │
                                          │        Sandbox, P2P Tx Broadcast &      │
                                          │        Headless SDK (FYP / MCP Ready)   │
                                          └───────────────────┬─────────────────────┘
                                                              │
                                                              ▼ (Optional)
                                          ┌─────────────────────────────────────────┐
                                          │ WP-09: Optional ETHY/0 Discovery Infra  │
                                          │        (--rendezvous Seed & Signed      │
                                          │        EIP-1459 DNS ENR Tree)           │
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
