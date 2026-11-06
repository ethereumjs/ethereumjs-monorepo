# WP-09 (Optional): Dedicated `ETHY/0` Discovery Infrastructure — Stateless Rendezvous Daemon & Signed EIP-1459 DNS Tree

- **Status:** `OPTIONAL_POST_MVP` *(Scheduled after `WP-08` — everything in `WP-06a..WP-08` works without this infrastructure)*
- **Dependencies:** `WP-06b`, `WP-06c`, `WP-07`, `WP-08`
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Provide an **optional, ultra-lightweight (~30 MB RAM, zero-state) `ETHY/0` Rendezvous & EIP-1459 DNS Tree Publisher** (`ethy --rendezvous`) that can be deployed on a minimal VPS later if/when we want global zero-config discovery for the first 500–1,000 public Ethy nodes across the internet.

> **Important Design Principle:** All features in `WP-06a` through `WP-08` (`ETHY/0` protocol, `ETHY_PEX` peer exchange, ENR `"ethy"` tags, `--connect`, and `peers.json` mesh persistence) work **100% without this infrastructure**. This optional package simply adds a public "meeting point" when you are ready to turn one on.

### Key Deliverables (`WP-09`)

1. **Stateless `--rendezvous` Mode in `@ethereumjs/ethy` (`src/cli/rendezvous.ts`):**
   - Runs `@ethereumjs/devp2p` (`DPT` + `RLPx` with `ETHY/0` and `ETH/71`) with **zero state sync, zero disk journals, and < 30 MB RAM**.
   - Accepts inbound `RLPx` connections from Ethy nodes, records their `{ id, address, tcpPort, udpPort, basePivotBlock, bucketsBitmask, lastSeen }` in a 1,000-entry in-memory ring buffer, and serves `ETHY_PEX` (`GET_ETHY_PEERS` → `ETHY_PEERS`) to every connecting Ethy client.
2. **Optional EIP-1459 DNS ENR Tree Signer (`scripts/ethy-dns-tree.ts`):**
   - Exports the active `ethy/0` peer table as a signed EIP-1459 DNS ENR tree TXT record bundle (compatible with Cloudflare / Route53 / static DNS Zone files) so `Common.dnsNetworks` can optionally include an `ethy` ENR tree URL.
3. **Default Bootstrap Hook in `@ethereumjs/common`:**
   - Optional `ethyBootstrapNodes` / `ethyDnsNetworks` fields in `ChainConfig` (empty or commented until a public rendezvous host is configured).

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled out if/when activated after `WP-08`.)*
