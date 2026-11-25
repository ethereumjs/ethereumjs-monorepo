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
                                          ▼                                       │
                      ┌─────────────────────────────────────────┐                 │
                      │ WP-06f: Storage & Code Sync Engine —    │                 │
                      │         Pre-Hashed Storage Trie Fix,    │                 │
                      │         16-Acc Batching & Progress UI   │                 │
                      └───────────────────┬─────────────────────┘                 │
                                          │                                       │
                                          ▼                                       │
                      ┌─────────────────────────────────────────┐                 │
                      │ WP-06g: Canonical Pivot Grid (K = 32),  │                 │
                      │         Multi-Peer & Cross-Snapshot     │                 │
                      │         ETHY/0 Bucket Striping & Cap    │                 │
                      └───────────────────┬─────────────────────┘                 │
                                          │                                       │
                                          └───────────────────┬───────────────────┘
                                                              ▼
                                          ┌─────────────────────────────────────────┐
                                          │ WP-07a: ETHEconomyDataManager,          │
                                          │         Permission-Structured Domain    │
                                          │         Snapshots & /economy Tool       │
                                          └───────────────────┬─────────────────────┘
                                                              │
                                                              ▼
                                          ┌─────────────────────────────────────────┐
                                          │ WP-07b: Spatial Cockpit Redesign        │
                                          │         (Economy + AI Overview +        │
                                          │         TableUIComponent + Ctrl+D Debug)│
                                          └───────────────────┬─────────────────────┘
                                                              │
                                                              ▼
                                          ┌─────────────────────────────────────────┐
                                          │ WP-07c: Local LLM Dual-Mode Engine      │
                                          │         (30-60s Read-Only Pulse,        │
                                          │         IntentEngine & UI Composer)     │
                                          └───────────────────┬─────────────────────┘
                                                              │
                                                              ▼
                                          ┌─────────────────────────────────────────┐
                                          │ WP-07d: Dynamic Contract Intelligence   │
                                          │         (Bytecode PUSH4/Proxy Scanner,  │
                                          │         Local ABI Lens, BAL Classifier  │
                                          │         & /contract Microscope)         │
                                          └───────────────────┬─────────────────────┘
                                                              │
                                                              ▼
                                          ┌─────────────────────────────────────────┐
                                          │ WP-07e: 20x-50x BAL Catch-Up & Bridge   │
                                          │         Engine (32-Block eth/71 Batches,│
                                          │         Header+BAL Fast Path &          │
                                          │         statemanager consumeBALBatch)   │
                                          └───────────────────┬─────────────────────┘
                                                              │
                                                              ▼
                                          ┌─────────────────────────────────────────┐
                                          │ WP-07f: 3-Domain Cockpit Streamline     │
                                          │         (State · Economy · P2P, Full-   │
                                          │         Height 3-Part AI, Tab Help &    │
                                          │         Left/Right View History)        │
                                          └───────────────────┬─────────────────────┘
                                                              │
                                                              ▼
                                          ┌─────────────────────────────────────────┐
                                          │ WP-07g: Holistic Head Stability, Synced │
                                          │         Chain-Head Clock, Dual Serving  │
                                          │         (eth/69-71 + ETHY/0) & Cap UX   │
                                          └───────────────────┬─────────────────────┘
                                                              │
                                                              ▼
                                          ┌─────────────────────────────────────────┐
                                          │ WP-07h: Ethereum Plaza (/live), Block   │
                                          │         Moment Detector, 16-District    │
                                          │         State Lights & Enter-to-Plaza   │
                                          └───────────────────┬─────────────────────┘
                                                              │
                                                              ▼
                                          ┌─────────────────────────────────────────┐
                                          │ WP-07i: Adaptive Sub-Gwei Fees, 64-Blk  │
                                          │         Macro Economy Cockpit & Plaza   │
                                          │         Contract Pulse (64B)            │
                                          └───────────────────┬─────────────────────┘
                                                              │
                                                              ▼
                                          ┌─────────────────────────────────────────┐
                                          │ WP-07j: Unified Tab Help, Universal     │
                                          │         View History, Frame Chrome &    │
                                          │         /rpc Method Status Matrix       │
                                          └───────────────────┬─────────────────────┘
                                                              │
                                                              ▼
                                          ┌─────────────────────────────────────────┐
                                          │ WP-08a: Default-On JSON-RPC 2.0 Server  │
                                          │         (:8545), coldStorageLookup,     │
                                          │         Header/Footer Chrome & /rpc     │
                                          └───────────────────┬─────────────────────┘
                                                              │
                                                              ▼
                                          ┌─────────────────────────────────────────┐
                                          │ WP-08b: On-Demand @ethereumjs/evm       │
                                          │         (eth_call, /simulate), P2P Tx   │
                                          │         Broadcast & Headless SDK        │
                                          └───────────────────┬─────────────────────┘
                                                              │
                                                              ├───────────────────────────────┐
                                                              ▼                               ▼ (Optional)
                                          ┌─────────────────────────────────────────┐   ┌─────────────────────────────────────────┐
                                          │ WP-10a: Modular AI Modes (default/off/  │   │ WP-09: Optional ETHY/0 Discovery Infra  │
                                          │         local), First-Open Choice,      │   │        (--rendezvous Seed & Signed      │
                                          │         Full-Width UI & Ollama Auto-Det │   │        EIP-1459 DNS ENR Tree)           │
                                          └───────────────────┬─────────────────────┘   └─────────────────────────────────────────┘
                                                              │
                                                              ▼
                                          ┌─────────────────────────────────────────┐
                                          │ WP-10b: Layer 1 Deterministic Signal    │
                                          │         Engine, Multi-Horizon Series,   │
                                          │         7702/L2/BAL Slots & Local ENS   │
                                          └───────────────────┬─────────────────────┘
                                                              │
                                                              ▼
                                          ┌─────────────────────────────────────────┐
                                          │ WP-10c: Layer 2 Chain-Detective LLM,    │
                                          │         Bounded Investigation Toolbelt, │
                                          │         Dispatch Feed & Prompt Consent  │
                                          └───────────────────┬─────────────────────┘
                                                              │
                                                              ▼
                                          ┌─────────────────────────────────────────┐
                                          │ WP-10d: Default Model (Qwen3.5-2B) —    │
                                          │         GGUF Store, Local Runner, Live  │
                                          │         Hot-Start & ai:smoke Testing    │
                                          └───────────────────┬─────────────────────┘
                                                              │
                                                              ▼ (Optional Future)
                                          ┌─────────────────────────────────────────┐
                                          │ WP-10e..10g: Optional Eval Bake-Off,    │
                                          │         ~30 MB LoRA Diffset + KV-Cache, │
                                          │         Zero-CPU Watch Rules & Lenses   │
                                          └───────────────────┬─────────────────────┘
                                                              │
                                                              ▼ (Swarm Production Readiness)
                                          ┌─────────────────────────────────────────┐
                                          │ WP-11a: Multi-Client Swarm Simulator    │
                                          │         (ethy-sim), Shared-Policy Hooks │
                                          │         & 10-Scenario Stress Harness    │
                                          └───────────────────┬─────────────────────┘
                                                              │
                                                              ▼
                                          ┌─────────────────────────────────────────┐
                                          │ WP-11b: Amortized O(1) Generation       │
                                          │         Election, Contiguous Disk BAL   │
                                          │         Archive, Rarest-First Striping  │
                                          │         & Background Shadow Re-Seeding  │
                                          └───────────────────┬─────────────────────┘
                                                              │
                                                              ▼ (Curiosity-First AI Experience)
                                          ┌─────────────────────────────────────────┐
                                          │ WP-12: Chain Storyteller — Uncaged Prose│
                                          │        Engine, Curated Ethereum Lore &  │
                                          │        Threat Grounding, Editorial TUI  │
                                          │        & Conversational Deep-Dives      │
                                          └───────────────────┬─────────────────────┘
                                                              │
                                                              ▼ (Network Citizenship & Machine Control)
                                          ┌─────────────────────────────────────────┐
                                          │ WP-13: The Machine — Unified Sync &     │
                                          │        Network Lifecycle Orchestrator,  │
                                          │        Dynamic Subprotocol Planes       │
                                          │        (SNAP/ETHY/Disc/CL) & Cockpit UI │
                                          └───────────────────┬─────────────────────┘
                                                              │
                                                              ▼ (5x-10x BAL Catch-Up & Fast BAL Stack)
                                          ┌─────────────────────────────────────────┐
                                          │ WP-14: High-Throughput BAL Catch-Up &   │
                                          │        Fast Ecosystem BAL Stack         │
                                          │        (util/statemanager/vm + Ethy     │
                                          │        Async Lookup, bal-tail & Swarm)  │
                                          └───────────────────┬─────────────────────┘
                                                              │
                                                              ▼ (Deep Forensics & Grounded AI)
                                          ┌─────────────────────────────────────────┐
                                          │ WP-15: Deep Contract Forensics, Guided- │
                                          │        Randomness Storytelling, Local   │
                                          │        Dossier DB & AI Observability    │
                                          └───────────────────┬─────────────────────┘
                                                              │
                                                              ▼ (Two-Protocol State Suite: STATY/0 + ETHY/0 v0.3)
                                          ┌─────────────────────────────────────────┐
                                          │ WP-16a: @ethereumjs/devp2p STATY/0      │
                                          │         Subprotocol, ETHY/0 v0.3 Upgrade│
                                          │         & Shared Code / Storage Serving │
                                          └───────────────────┬─────────────────────┘
                                                              │
                                                              ▼
                                          ┌─────────────────────────────────────────┐
                                          │ WP-16b: Open-World FlatStateManager,    │
                                          │         Proven-Empty Tombstones, Local  │
                                          │         Write-Index & Multi-Proof Core  │
                                          └───────────────────┬─────────────────────┘
                                                              │
                                                              ▼
                                          ┌─────────────────────────────────────────┐
                                          │ WP-16c: STATY/0 Default Fast Onboarding,│
                                          │         Hot Epoch Sync, O(1) Minter &   │
                                          │         Cold-Miss Witness Pipeline      │
                                          └───────────────────┬─────────────────────┘
                                                              │
                                                              ▼
                                          ┌─────────────────────────────────────────┐
                                          │ WP-16d: ETHY/0 v0.3 Full Code/Storage   │
                                          │         Swarm & Hybrid --full Mode      │
                                          │         (Open-World -> Closed-World)    │
                                          └───────────────────┬─────────────────────┘
                                                              │
                                                              ▼
                                          ┌─────────────────────────────────────────┐
                                          │ WP-16e: The Machine 6th Plane (staty),  │
                                          │         Cockpit UI, /staty Microscope   │
                                          │         & ethy-sim STATY Swarm Gates    │
                                          └───────────────────┬─────────────────────┘
                                                              │
                                                              ▼
                                          ┌─────────────────────────────────────────┐
                                          │ WP-16f: Client-Wide STATY/0 Leverage —  │
                                          │         Priority EVM Pool, False-Zero-  │
                                          │         Safe RPC/Tx, Live ENS & UX      │
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
