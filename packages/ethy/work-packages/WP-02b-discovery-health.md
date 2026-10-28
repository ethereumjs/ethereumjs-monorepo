# WP-02b: Live Sepolia Discovery Health & Instrumentation

- **Status:** `DONE`
- **Dependencies:** `WP-02` (`DONE`), `WP-00` (`DONE`)
- **Branch:** `ethy-wp02`

---

## 1. Goal

Make live `ethy sepolia` reach at least one sustained RLPx peer on a normal network. WP-02 proved the TUI and pivot path on loopback; manual soak showed **zero peers** after ~60s (with a brief latency flicker — handshake then drop).

This WP adds **structured discovery counters** in `@ethereumjs/devp2p`, surfaces them through existing Ethy diagnostics, then fixes ranked failures (advertised endpoint, swallowed errors, DNS resolver, handshake drops, timing only when counters justify it).

---

## 2. Deliverables

### A — Instrumentation (`packages/devp2p`)

- `DiscoveryMetrics` + `WorkerDiscoverySnapshot` on worker telemetry.
- Counters: bound UDP/TCP, k-bucket size, bootstrap ping ok/fail, DNS attempts/peers/last error, RLPx dials/connects/status/disconnect reasons.

### B — Ethy surfacing

- Copy snapshot from worker telemetry into spine / diagnostics (headless one-shot JSON after ~45s; `/diag` readable summary).

### C — Fixes (ranked by soak)

1. Advertise real bound UDP/TCP ports after `bind` / `listen` (not `0`).
2. Count and surface bootstrap/DNS failures (no silent `.catch(() => {})`).
3. DNS: use OS resolver unless `dnsAddr` is explicit (drop default `8.8.8.8` override).
4. Handshake / forkId investigation when disconnect reasons cluster.
5. Timing defaults only when metrics show starvation.

---

## 3. Acceptance

- [x] In-process / loopback test increments discovery counters on dial + STATUS.
- [x] Manual Sepolia soak: snapshot explains path (DNS peers, table size, disconnect reasons).
- [x] Documented blocker for sustained STATUS: `statusOk` stays 0 while RLPx shows peers; disconnects cluster on `SUBPROTOCOL_ERROR` (eth/69+ / snap follow-up in WP-03).

### Soak sample (~45s, `node --import tsx src/cli/main.ts sepolia --headless`)

Discovery path is healthy after endpoint + DNS fixes: k-bucket fills via DNS (`peersAdded` ~84), bound UDP/TCP ports are non-zero, bootstrap records ok/fail/timeouts. Example line:

`{"type":"ethy_discovery_soak","peers":1,"discovery":{"tablePeers":65,"dns":{"peersAdded":84,"resolver":"system"},"rlpx":{"dials":128,"connected":34,"statusOk":0,"disconnects":{"SUBPROTOCOL_ERROR":6,...}}}}`

Pinned Sepolia/mainnet heads in `p2pHandshakeStatusFields()` replace genesis-only STATUS for live dial.

---

## 4. Out of scope

- Public-network CI job.
- Sepolia `chains.ts` bootstrap ENR refresh (unless soak shows DNS empty + all bootstraps timeout).
