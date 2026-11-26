# WP-09 (Optional): Dedicated `ETHY/0` Discovery Infrastructure — Stateless Rendezvous Daemon & Signed EIP-1459 DNS Tree

- **Status:** `OPTIONAL_POST_MVP` *(Scheduled after `WP-16` — everything in `WP-06a..WP-16h` works without this infrastructure)*
- **Dependencies:** `WP-06b`, `WP-06c`, `WP-16c`, `WP-16d`
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Provide an **optional, ultra-lightweight (~30 MB RAM, zero-state) `ETHY/0` Custody Rendezvous & EIP-1459 DNS Tree Publisher** (`ethy --rendezvous`) that can be deployed on a minimal VPS later if/when we want global zero-config discovery for the first 500–1,000 public Ethy nodes across the internet.

> **Important Design Principle:** All features in `WP-06a` through `WP-16h` (Unified Custody `ETHY/0`, bucket-aware `ETHY_PEX` peer exchange, ENR `"ethy"` tag, `--connect`, and `peers.json` mesh persistence) work **100% without this infrastructure**. This optional package simply adds a public "meeting point" when you are ready to turn one on.

### Key Deliverables (`WP-09`)

1. **Stateless `--rendezvous` Mode in `@ethereumjs/ethy` (`src/cli/rendezvous.ts`):**
   - Runs `@ethereumjs/devp2p` (`DPT` + `RLPx` with `ETHY/0` `v0.4` and `ETH/71`) with **zero state sync, zero disk journals, and < 30 MB RAM**.
   - Accepts inbound `RLPx` connections from Ethy nodes, records their per-bucket custody capabilities (`basePivotBlock`, `bucketsBitmask`, `storageBucketsBitmask`, `codeBucketsBitmask`, `trieBucketsBitmask`) in a bounded 1,000-entry in-memory peer table, and serves bucket-aware `ETHY_PEX` (`GET_ETHY_PEERS` → `ETHY_PEERS`) to every connecting client.
2. **Optional EIP-1459 DNS ENR Tree Signer (`scripts/ethy-dns-tree.ts`):**
   - Exports the active `ethy/0` peer table (preserving signed `"ethy"` ENR keys) as signed EIP-1459 DNS ENR tree TXT record bundles (compatible with Cloudflare / Route53 / static DNS Zone files) so `Common.dnsNetworks` can optionally include a public Ethy ENR tree URL.
3. **Default Bootstrap Hook in `@ethereumjs/common`:**
   - Optional `ethyBootstrapNodes` / `ethyDnsNetworks` fields in `ChainConfig` (empty or commented until a public rendezvous host is configured).

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled out if/when activated after `WP-08`.)*
