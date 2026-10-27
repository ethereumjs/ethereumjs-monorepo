# WP-00: `@ethereumjs/devp2p` Worker-Thread Architecture, Discovery Flow Control & Buffer Hardening

- **Status:** `PLANNED`
- **Dependencies:** None (First foundational work package — hardens `@ethereumjs/devp2p` before Ethy scaffolding)
- **Target Package:** `packages/devp2p` (`@ethereumjs/devp2p`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Evolve `@ethereumjs/devp2p` so it can run entirely inside a dedicated Node.js `worker_threads` Worker (`createThreadedNetwork` / `Devp2pWorkerClient`) while also fixing its two biggest internal CPU and memory bottlenecks: **unbounded UDP discovery (`DPT`) crypto storms** and **O(N²) socket buffer reallocations (`concatBytes`) in `RLPx` `Peer`**.

This work package embodies a core philosophy of the Ethy project: **use the client to actively harden and modernize the underlying `@ethereumjs/*` library stack** so both Ethy and external research/production users of `@ethereumjs/devp2p` get a dramatically faster, cleaner networking engine.

### Why This Comes First (`WP-00`)
In the old client days, running `devp2p` on the main thread starved the event loop:
1. **Discovery (`DPT`) CPU Storm:** Every inbound/outbound UDP packet in `src/dpt/message.ts` executes synchronous `secp256k1` (`sign` / `recoverPublicKey`), `keccak_256`, and `RLP`. Even after `RLPx` reaches `maxPeers`, `DPT` continues refreshing every 3 seconds (`_refreshIntervalId`) and fanning out `_addPeerBatch` timers.
2. **RLPx Frame Crypto & O(N²) Buffer Copying:** In `src/rlpx/peer.ts:647`, `_onSocketData` executes `this._socketData = concatBytes(this._socketData, data)` on every incoming TCP chunk. For large `snap/1` (`AccountRange`, `StorageRanges`, `ByteCodes`) or `eth/71` (`BlockAccessLists`) frames, this repeatedly reallocates and copies hundreds of kilobytes before running synchronous ECIES AES-CTR/SHA3-MAC decryption (`ecies.ts`), `snappy.uncompress` (`peer.ts:600`), and `RLP.decode`.
3. **Socket Ownership:** Node.js `net.Socket` and `dgram.Socket` cannot be transferred across `worker.postMessage()`, which means the right architecture is to host `DPT` + `RLPx` + `DNS` **100% inside the Network Worker** and expose a clean, zero-copy message & telemetry bridge to the main thread.

### Key Deliverables in `packages/devp2p`

1. **Eliminate O(N²) Socket Buffer Copying in `Peer` (`src/rlpx/peer.ts`):**
   - Replace `this._socketData = concatBytes(this._socketData, data)` in `Peer._onSocketData` (`peer.ts:647`) with a lightweight chunk-queue / ring-buffer reader (or offset cursor that only concatenates when a frame boundary straddles two TCP chunks, and advances a zero-copy byte view otherwise).
   - Ensure zero regressions in `Auth` / `Ack` / `Header` / `Body` state transitions.
   - Audit Snappy handling across `Peer._handleBody` (`peer.ts:599-601`) and `SNAP` (`src/protocol/snap.ts`):
     - Notice that `Peer._handleBody` already runs `payload = snappy.uncompress(payload)` for all subprotocols when `this._hello.protocolVersion >= 5` before calling `protocolObj.protocol._handleMessage(msgCode, payload)`, whereas `SNAP.sendMessage` (`snap.ts:116`) and `ETH.sendMessage` (`eth.ts:390`) compress outbound payloads. Verify and test that `SNAP` inbound/outbound messages work end-to-end when `protocolVersion >= 5` and when `< 5`.

2. **Discovery (`DPT`) Flow Control & Resource Discipline (`src/dpt/dpt.ts`, `src/rlpx/rlpx.ts`):**
   - Add configurable discovery flow control / saturation throttling so `DPT` does not burn CPU when `RLPx` peer slots are full:
     - Allow `DPT` (or `RLPx` coordinating with `this._dpt`) to pause or throttle active `findneighbours` / DNS refreshes when `RLPx` has `>= maxPeers` (or when a caller sets a target peer water-mark), automatically resuming when active peers drop below a low water-mark.
     - Bound concurrent in-flight `_addPeerBatch` pings (`dpt.ts:139`) so a burst of `neighbours` responses cannot queue hundreds of simultaneous `secp256k1` ping handshakes.
   - Keep default behavior backwards-compatible or cleanly configurable via `DPTOptions` / `RLPxOptions`.

3. **First-Class Worker-Thread Runtime (`src/worker/`):**
   - Design and export a general-purpose, zero-dependency (`node:worker_threads`) threaded networking API in `@ethereumjs/devp2p` that is appealing for both Ethy and standalone library users:
     - **`Devp2pWorkerClient` / `createThreadedNetwork(options)` (Main Thread):**
       - Spawns the worker thread (supporting both compiled ESM/CJS and `tsx` dev execution cleanly, plus an `inProcess?: boolean` option that runs the exact same message protocol over an in-memory `MessageChannel` for fast unit testing).
       - Sends control commands to the worker: `start()`, `stop()`, `connectPeer(peerInfo)`, `disconnectPeer(peerId, reason)`, `sendEthMessage(peerId, code, rlpPayloadBytes)`, `sendSnapMessage(peerId, code, rlpPayloadBytes)`, `setBlockRange(earliest, latest, latestHash)`.
       - Receives subprotocol frames (`eth`, `snap`) from the worker using **transferable `ArrayBuffer`s** (`postMessage(msg, [buffer])`) so large `snap/1` and `eth/71` payloads cross the thread boundary with **zero memory copy**.
       - Receives coalesced **Peer & Diagnostic Telemetry Snapshots** (e.g. every 100–200ms or on peer state change): connected peers, client IDs, capabilities, RTT latencies, and bounded diagnostic events (handshake errors, timeouts, disconnects) — shielding the main thread from raw UDP/TCP event storms.
     - **`Devp2pWorkerHost` (Worker Thread):**
       - Owns `DPT`, `DNS`, and `RLPx`.
       - Can optionally auto-respond to unsupported inbound `ETH` / `SNAP` requests in `<1ms` right inside the worker thread (`emptyWireReply` / Good Citizen mode) without even waking the main thread!

4. **Unit & Integration Tests (`packages/devp2p/test/`):**
   - `test/peer-buffer.spec.ts`: Tests chunked / fragmented TCP delivery of large RLPx frames (e.g. 512 KB payload split across 32 chunks) verifying zero corruption and no O(N²) behavior.
   - `test/dpt-throttling.spec.ts`: Verifies `DPT` throttles/pauses neighbour refreshes when peer slots are saturated and resumes when peers drop.
   - `test/worker-network.spec.ts`: Tests `createThreadedNetwork` (both via `MessageChannel` in-process and a real `node:worker_threads` `Worker`) performing peer connection, `ETH` `STATUS` + `SNAP` `GET_ACCOUNT_RANGE` exchange with zero-copy `ArrayBuffer` transfer, Good Citizen empty replies inside the worker, and telemetry snapshot emission.

### Acceptance Criteria
- [ ] `cd packages/devp2p && npm run tsc` and `npm test` pass with 0 errors.
- [ ] `npm run spellcheck` passes across all modified/added files.
- [ ] `createThreadedNetwork` is exported from `@ethereumjs/devp2p` with clean TypeDoc JSDoc comments (`api-docs.mdc`) so `WP-02` in `packages/ethy` can consume it directly.
- [ ] Record all changes in `packages/ethy/PROGRESS.md` under *Upstream Library Touch Queue* and *Chronological Progress Log*.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

WP-00 hardens `@ethereumjs/devp2p` only (no `packages/ethy` scaffold). Existing `DPT` / `RLPx` / `Peer` defaults stay backwards-compatible; `createThreadedNetwork` opts into discovery throttling and Good Citizen behavior.

### Design Refinements (ADR: `PROGRESS.md` D-010–D-014)

| ID | Choice |
| --- | --- |
| **D-010** | **`SocketByteQueue`** — Replace `_socketData` + `concatBytes` in `Peer._onSocketData` with a private chunk queue: `push`, `byteLength`, `peek(n)`, `consume(n)`. Single-chunk frames use zero-copy views; straddling frames copy once into a new head chunk. Auth/Ack EIP-8 length peek must not consume early. |
| **D-011** | **Discovery throttle opt-in** — `RLPxOptions.throttleDiscovery` defaults `false`. `createThreadedNetwork` sets `true`, low water `floor(0.8 * maxPeers)`, `maxInFlightPings: 8`. `DPT.setDiscoveryPaused(true)` skips `findneighbours`, DNS refresh, and new `_addPeerBatch` work; unpause triggers one `refresh()`. Unset `maxInFlightPings` preserves current 200ms-stagger batch behavior (incl. test overrides). |
| **D-012** | **One wire protocol, two transports** — Worker config uses `{ chain: 'mainnet' \| 'sepolia' \| 'hoodi' \| 'holesky', hardfork?: string }` (not structured-cloneable `Common`). Host builds `Common` in-thread. Payloads copied to dedicated `ArrayBuffer`s for transfer; client copies before send. `inProcess: true` uses `MessageChannel`. Real `Worker` entry resolved via stack-derived path (no `import.meta` in CJS emit). |
| **D-013** | **Worker-owned handshake & Good Citizen** — On `peer:added`, host calls `ETH.sendStatus` from options. `goodCitizen` default `true` uses `emptyWireReply`; extend for eth/71 `GET_BLOCK_ACCESS_LISTS` → `[requestId, []]`. Answered requests not forwarded to main thread. `setBlockRange` → `BLOCK_RANGE_UPDATE` on eth/69+ peers. |
| **D-014** | **Base protocol v5** — `BASE_PROTOCOL_VERSION = 5`. Snappy `< 5` covered by stubbed-hello unit test; live snap pair tests use v5. Single snappy decompress in `Peer._handleBody` only. |

**RTT:** `Peer._sendPing` records time; `PeerEvent.pong` gains optional `rttMs` (existing listeners unchanged).

### New files (`packages/devp2p/src/`)

| Path | Role |
| --- | --- |
| `rlpx/socketByteQueue.ts` | Chunk queue (internal; not exported from package root). |
| `worker/protocol.ts` | Command and event TypeScript unions. |
| `worker/host.ts` | `Devp2pWorkerHost` — owns `DPT`, DNS (via DPT), `RLPx`. |
| `worker/client.ts` | `Devp2pWorkerClient` — main-thread API. |
| `worker/resolveEntry.ts` | Resolve `workerEntry.ts` / `workerEntry.js` without `import.meta`. |
| `worker/workerEntry.ts` | `parentPort` → host bootstrap. |
| `worker/index.ts` | Export `createThreadedNetwork`. |

### Edited files

| Path | Change |
| --- | --- |
| `rlpx/peer.ts` | Queue in `_onSocketData`; handlers use `peek`/`consume`; pong RTT. |
| `dpt/dpt.ts` | `setDiscoveryPaused`, optional `maxInFlightPings` cap on `_addPeerBatch`. |
| `rlpx/rlpx.ts` | Hysteresis: pause/resume DPT when `_peers.size` vs `maxPeers` / low water (on add/remove/close). |
| `types.ts` | `DPTOptions.maxInFlightPings`; `RLPxOptions.throttleDiscovery`, `discoveryLowWaterMark` (throw if `>= maxPeers`); `PeerEvent.pong` optional `rttMs`. |
| `lab/emptyReply.ts` | eth/71 `GET_BLOCK_ACCESS_LISTS` empty list reply. |
| `index.ts` | Export threaded API + public types. |
| `README.md` | Short “Threaded network” section under library stack (no new `examples/` — runner opens sockets). |

No new npm dependencies. No CHANGELOG version section until release.

### Worker API

**Factory:** `createThreadedNetwork(options): Promise<Devp2pWorkerClient>` (calls `start` internally).

**Options (structured-cloneable):** `privateKey`, `chain`, optional `hardfork`, `maxPeers`, `capabilities` as strings (`eth68`…`eth71`, `snap1` → host maps to `ETH.ethXX` / `SNAP.snap`), `endpoint` / `listenPort` (`0` ok; `ready` reports bound ports), `bootnodes`, `clientId`, `status` (required if any eth cap), `throttleDiscovery` (default `true` here), `discoveryLowWaterMark`, `maxInFlightPings` (default `8`), `telemetryIntervalMs` (default `150`), `goodCitizen` (default `true`), `inProcess`.

**Client methods:** `start`, `stop`, `connectPeer`, `disconnectPeer`, `sendEthMessage(peerId, code, rlpBytes)`, `sendSnapMessage(peerId, code, rlpBytes)`, `setBlockRange(earliest, latest, latestHash)`. Do not send `STATUS` via `sendEthMessage` (`ETH.sendMessage` already throws).

**Host → client events:** `ready`, `protocol` (`eth` \| `snap`, peer id hex, code, transferred RLP bytes — after snappy decompress in `_handleBody`, before subprotocol RLP decode), `telemetry` (peers, caps, RTT, bounded diagnostics), `error`, `stopped`. Telemetry on interval + peer add/remove.

```text
Devp2pWorkerClient ──commands──► MessagePort ◄──frames/telemetry── Devp2pWorkerHost ──► DPT + DNS + RLPx
```

### Tests (`packages/devp2p/test/`)

Use existing folder layout; vitest `assert` (not bare `expect` for new cases). Localhost only; `destroy()` in cleanup; no live network.

| Spec | Coverage |
| --- | --- |
| `rlpx/socketByteQueue.spec.ts` | 512 KB / 32 chunks; single-chunk zero-copy peek; 2-byte peek no consume; boundary straddle. |
| `rlpx/peer-buffer.spec.ts` | Post-handshake, detach `data` listener, re-feed outbound frame via `_onSocketData` in 32 slices. |
| `protocol/snap-snappy.spec.ts` | Live pair v5 `GET_ACCOUNT_RANGE` round-trip; stub `protocolVersion = 4` → no outbound snappy. |
| `dpt/dpt-throttling.spec.ts` | Pause/unpause vs `findneighbours`/DNS; `maxInFlightPings: 2` with 20 peers; RLPx stub DPT pause/resume at water marks; default ctor unchanged. |
| `lab/emptyReply.spec.ts` | eth/71 `GET_BLOCK_ACCESS_LISTS` empty + same request id. |
| `worker/worker-network.spec.ts` | Two `inProcess` nodes, `listenPort: 0`, Good Citizen on/off, transferable buffer length; one real `Worker` case (longer timeout). |

### Implementer finish gates

1. `cd packages/devp2p && npm run tsc && npm test`
2. `npm run spellcheck` (reword flags; avoid dictionary adds)
3. `tsc --build tsconfig.prod.cjs.json` and `tsconfig.prod.esm.json` (worker entry must emit in both)
4. On human commit ask: **separate commit** for `packages/devp2p` vs Ethy ledger updates in `PROGRESS.md`

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled out by Composer 2.5 after implementation and verification. Also append summary to `packages/ethy/PROGRESS.md`.)*
