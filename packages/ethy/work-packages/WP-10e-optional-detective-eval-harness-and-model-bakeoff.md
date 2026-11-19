# WP-10e (Optional): Ethy Detective Evaluation Harness (`ethy-eval`) & Multi-Model Bake-Off

- **Status:** `OPTIONAL_FUTURE` *(Scheduled after `WP-10d` live runs — everything in `WP-10a`..`WP-10d` works with `Qwen3.5-2B` without this package)*
- **Series:** `WP-10` — Next-Generation LLM Integration, Capabilities & Model Strategy
- **Dependencies:** `WP-10b`, `WP-10c`, `WP-10d`
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements (Coordinator — Gemini 4 Carbon)

### Goal
Replace intuition with objective, reproducible measurements before considering a smaller model, a newer upstream family, or LoRA fine-tuning (`WP-10f`). Capture real Sepolia and Mainnet `SignalDigest` + tool-result traces directly from live Ethy nodes and score candidate small models head-to-head.

### Key Deliverables (`WP-10e`)

1. **Headless Live Signal Recorder (`--record-signals <path>`):**
   - Appends sanitized, deterministic `WP-10b` `SignalDigest` + `InvestigationTools` snapshot bundles to a JSONL file during live Mainnet / Sepolia runs (zero user prompts recorded).
2. **Curated 50-Case `ethy-eval` Benchmark Suite (`eval/detective-cases.jsonl`):**
   - Covers real on-chain patterns: EIP-7702 proxy surges, breakout NFT/DEX venues, L2 blob cost spikes, revert storms, monotonic BAL storage-slot climbs, proxy upgrades, AND ~15 quiet/noisy **"restraint traps"** where calling unnecessary tools or inventing drama is penalized.
3. **Automated 4-Metric Scoring Runner (`npm run ai:eval -- --model <spec>`):**
   - Scores every candidate across:
     1. **Tool Selection Accuracy** (right tool & arguments on 2-step cases);
     2. **Restraint & Honesty** (staying calm on noise; explicitly stating uncertainty on unknown bytecode);
     3. **Fact Faithfulness** (zero hallucinated addresses, ENS names, or numbers);
     4. **Laptop Efficiency** (median latency ms, peak RAM MB, tokens/sec).
4. **Head-to-Head Model Bake-Off Report:**
   - Evaluates stock `Qwen3.5-2B` (`1.28 GB`) vs `Qwen3.5-0.8B` (`532 MB`), `LFM2.5-1.2B` (`750 MB`), community `Qwen3.8-2B-Distill` (same GGUF architecture), `Qwen3.5-4B` (`2.74 GB` reference ceiling), and any newly released official `Qwen4` / `Gemma` small checkpoints.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled out if/when activated after `WP-10d`.)*
