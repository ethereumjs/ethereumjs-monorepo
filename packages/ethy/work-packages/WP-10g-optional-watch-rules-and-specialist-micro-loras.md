# WP-10g (Optional): LLM-Compiled Zero-CPU Watch Rules & Specialist Protocol Micro-LoRAs

- **Status:** `OPTIONAL_FUTURE` *(Longer-horizon exploration after `WP-10d`–`WP-10f`)*
- **Series:** `WP-10` — Next-Generation LLM Integration, Capabilities & Model Strategy
- **Dependencies:** `WP-10b`, `WP-10c`, `WP-10d`, `WP-10f`
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements (Coordinator — Gemini 4 Carbon)

### Goal
Extend Ethy's two-layer architecture with two high-leverage user capabilities that keep laptop CPU/thermal load near zero while unlocking personalized, specialist on-chain monitoring.

### Key Deliverables (`WP-10g`)

1. **LLM-Compiled Zero-CPU Persistent Watch Rules (`src/economy/watchRules.ts`):**
   - Users type natural-language watch rules at `● ethy >` (e.g. *"Watch `0x123...` and alert me if its revert rate crosses 20% or its proxy upgrades"*, or *"Ping me when Base blob spend triples"*).
   - The LLM compiles the natural-language intent **once** into a strict, deterministic JSON predicate (`WatchRuleSpec`) persisted in `<dataDir>/config.json` (inspectable and removable via `/watch`).
   - Layer 1 (`ETHEconomyDataManager`) evaluates active rules on every block at **0% LLM CPU cost**, waking Layer 2 (`ChainDetectiveNarrator`) for a targeted deep-dive **only when a rule actually triggers**!
2. **Optional Hot-Swappable Specialist Micro-LoRA Lenses (`~15–30 MB` each):**
   - Leverages `WP-10f`'s shared `Qwen3.5-2B` base + runtime LoRA adapter loader to support optional domain lenses selectable via `/ai lens <name>`:
     - `detective` (general network & economy intelligence — default),
     - `security` (EIP-7702 drainer heuristics, suspicious proxy upgrades, approval sweeps),
     - `mev` (multi-account choreography, arbitrage/liquidation flow patterns).

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled out if/when activated after `WP-10f`.)*
