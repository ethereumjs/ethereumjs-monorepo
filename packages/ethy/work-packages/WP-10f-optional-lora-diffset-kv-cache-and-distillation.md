# WP-10f (Optional): Frontier-Distilled `ethy-detective` LoRA Diffset (`~30 MB`), Pinned KV-Cache & Dynamic Adapter Scaling

- **Status:** `OPTIONAL_FUTURE` *(Scheduled after `WP-10d` / `WP-10e` — optional specialization layer on top of stock `Qwen3.5-2B`)*
- **Series:** `WP-10` — Next-Generation LLM Integration, Capabilities & Model Strategy
- **Dependencies:** `WP-10d`, `WP-10e`
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements (Coordinator — Gemini 4 Carbon)

### Goal
Dramatically elevate `Qwen3.5-2B` (or `Qwen3.5-0.8B`) on modern Ethereum protocol literacy (**EIP-7928 BALs**, **EIP-7702 delegations**, **EIP-4844 L2 blobs**, proxy chains, and disciplined restraint) while cutting inference latency and keeping the shipped weight delta tiny (**`~25–35 MB`**) by attaching a frontier-distilled GGUF LoRA adapter ("weight diffset") on top of unmodified upstream base weights.

### Key Deliverables (`WP-10f`)

1. **Frontier Teacher Distillation Pipeline (`scripts/distill-detective-dataset.ts`):**
   - Takes `~1,500` recorded `WP-10b` live snapshots (`--record-signals`), generates verified 1-step and 2-step `ChainDetective` trajectories using a frontier teacher model, and filters out any trace with invalid JSON, hallucinated numbers, or unsupported tool arguments.
2. **Reproducible QLoRA Training & GGUF Adapter Export:**
   - Produces a `~25–35 MB` rank-16 F16 GGUF LoRA adapter (`ethy-detective-v1.gguf`) compatible with unmodified upstream `Qwen3.5-2B-Q4_K_M.gguf` (verified against `WP-10e`'s `ethy-eval` harness to confirm measurable gains over the stock base model).
   - Optionally documents one-command `llama-export-lora` merge for users who prefer running a single merged `ethy-2b.gguf` inside Ollama (since Ollama `>= 0.34.1` requires merged GGUF files rather than runtime `ADAPTER` lines).
3. **Runtime Dynamic LoRA Scaling & Pinned System KV-Cache in `ManagedModelRunner`:**
   - Loads `ethy-detective-v1.gguf` natively in `node-llama-cpp` / `llama-server --lora`:
     - **`scale = 1.0`** during autonomous `ChainDetective` and structured tool-calling turns;
     - **`scale = 0.0..0.2`** during open-ended general protocol Q&A so the base model retains zero catastrophic forgetting.
   - Pins the static `~500`-token system prompt + tool schema in the runner's **KV-cache prefix**, cutting per-pulse prompt evaluation latency by `~5×` and keeping laptop fans quiet.
   - Allows Ethy protocol intelligence updates via a `~30 MB` adapter bump whenever new hardforks (e.g. Hegota) introduce new EIPs, without re-downloading the `1.28 GB` base model.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled out if/when activated after `WP-10e`.)*
