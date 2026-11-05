# WP-06b: `@ethereumjs/devp2p` `ETHY/0` Subprotocol, Proven-Chunk Server, `ETHY_PEX` & Localhost Peer Connect

- **Status:** `DONE`
- **Dependencies:** `WP-06a` (`DONE` — see [`../protocols/devp2p/ETHY-0-SPEC.md`](../../../../protocols/devp2p/ETHY-0-SPEC.md))
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Implement the **`ETHY/0` (`["ethy", 0]`) subprotocol**, **ENR `"ethy"` capability tag**, **`ETHY_PEX` peer exchange**, and **worker-hosted `ETHY/0` chunk/BAL serving** inside **`@ethereumjs/devp2p`** (`packages/devp2p/`), along with **direct multi-peer CLI flags (`--bootnodes` / `--connect` + `--port` + `--data-dir`)** so two instances can connect directly on the same laptop (`127.0.0.1:30303` ↔ `127.0.0.1:30304`) or across a LAN with **zero external infrastructure**.

---

### Key Deliverables (`WP-06b`)

1. **`ETHY` Subprotocol Class & Message Codecs in `@ethereumjs/devp2p` (`packages/devp2p/src/protocol/ethy.ts`):**
   - Implement `ETHY extends Protocol` (alongside `ETH` and `SNAP`) with capability descriptor `ETHY.ethy0 = { name: 'ethy', version: 0, length: 11, constructor: ETHY }` and `ProtocolType.ETHY = 'ethy'`.
   - Message codes (`EthyMessageCodes`):
     - `STATUS = 0x00`
     - `GET_BUCKET_MANIFEST = 0x01`, `BUCKET_MANIFEST = 0x02`
     - `GET_PROVEN_ACCOUNT_CHUNK = 0x03`, `PROVEN_ACCOUNT_CHUNK = 0x04`
     - `GET_PROVEN_STORAGE_OR_CODE = 0x05`, `PROVEN_STORAGE_OR_CODE = 0x06`
     - `GET_BAL_RANGE = 0x07`, `BAL_RANGE = 0x08`
     - `GET_ETHY_PEERS = 0x09`, `ETHY_PEERS = 0x0a`
   - Automatic `STATUS` exchange on `ETHY` session start (validating `chainId` and `genesisHash` match, storing the remote peer's `EthyPeerStatus = { basePivotBlock, basePivotStateRoot, bucketsBitmask, balEarliestBlock, balLatestBlock, latestBlockHash }`, and emitting `'status'` and `'statusUpdated'`).
   - Allow peers to re-send `ETHY STATUS` (`0x00`) whenever a new bucket completes (`bucketsBitmask` changes) or `balLatestBlock` advances!
   - All integer fields encoded with canonical unpadded RLP (`intToUnpaddedBytes` / `bigIntToUnpaddedBytes`).

2. **EIP-778 ENR `"ethy"` Tag & `ETHY_PEX` Peer Exchange in `@ethereumjs/devp2p` (`packages/devp2p/src/dpt/` & `src/worker/host.ts`):**
   - Include `"ethy": 0` (`Uint8Array(0)`) in our signed discovery v4 ENR response when `ethy0` capability is enabled, and parse `"ethy"` on incoming ENRs (`peer.ethyCapable = true`).
   - In `Devp2pWorkerHost` (`packages/devp2p/src/worker/host.ts`):
     - Expose `ethySession: boolean` and `ethyStatus?: WorkerEthyPeerStatus` on `WorkerPeerSnapshot` in telemetry snapshots!
     - Maintain a bounded in-worker table of recently seen `ethy/0` peers (`_ethyKnownPeers`, max 64) and automatically answer inbound `GET_ETHY_PEERS (0x09)` with `ETHY_PEERS (0x0a)`.
     - On establishing any new `ETHY/0` session, automatically send `GET_ETHY_PEERS` (`0x09`) and feed returned peers into `RLPx` / telemetry so discovering **one** `ethy/0` peer automatically discovers the rest of the swarm!

3. **Worker-Side `ETHY/0` Serving Hook & Telemetry (`packages/devp2p/src/worker/`):**
   - Extend `WorkerServingSnapshot` with `ethyChunksServed: number`, `ethyBalBlocksServed: number`, and `ethyBytesServed: number`.
   - Answer `GET_BAL_RANGE (0x07)` directly in the worker from `RollingBlockStore` (and/or forward to main-thread `SnapPivotStore` `heal/` directory for deeper historical BAL ranges).
   - Route `GET_BUCKET_MANIFEST`, `GET_PROVEN_ACCOUNT_CHUNK`, and `GET_PROVEN_STORAGE_OR_CODE` to the provider handler (or serve directly from the active `pivots/<root>/` directory path configured in the worker so disk reads happen inside the worker thread without blocking the TUI!).

4. **Same-Laptop / Zero-Infra Direct Peer Connection & Local Enode Display (`packages/devp2p` & `packages/ethy/src/cli/args.ts`):**
   - Support `--connect <enode://pubkey@ip:port | ip:port>` (or `--bootnodes`) and `--port <tcpPort>` in `packages/ethy/src/cli/args.ts`.
   - Expose the local node's full `enode://<nodeId>@127.0.0.1:<boundTcpPort>` in `WorkerDiscoverySnapshot` (`localEnode`) and in `/peers` so a user can launch Node A on `--port 30303` and launch Node B on `--port 30304 --data-dir /tmp/ethy-2 --connect <enode>` on the exact same laptop!

5. **Comprehensive `@ethereumjs/devp2p` Test Suite (`packages/devp2p/test/protocol/ethy.spec.ts` & `test/worker/ethy-swarm.spec.ts`):**
   - Unit tests for all `ETHY/0` codecs (`STATUS` exchange, dynamic `bucketsBitmask` updates, `BUCKET_MANIFEST`, `PROVEN_ACCOUNT_CHUNK`, `BAL_RANGE`, and `ETHY_PEX`).
   - Two-node and three-node `createThreadedNetwork` integration tests verifying:
     1. Node A and Node B negotiate `ethy/0` alongside `eth/71` and exchange `EthyPeerStatus` (`bucketsBitmask = 0x00ff`).
     2. Node C connects only to Node B, sends `GET_ETHY_PEERS`, discovers Node A via `ETHY_PEX`, and dials Node A automatically.
     3. Node B requests a proven account chunk and a 16-block `BAL_RANGE` from Node A over `ethy/0` and verifies both cryptographically.

---

### Acceptance Criteria (`WP-06b`)
- [x] `ETHY/0` (`capabilities: ['eth69', 'eth70', 'eth71', 'eth72', 'snap1', 'ethy0']`) negotiates cleanly between Ethy nodes while remaining 100% invisible/ignored when talking to standard Geth/Reth/Nethermind peers.
- [x] `WorkerPeerSnapshot` surfaces `ethySession`, `ethyStatus` (`basePivotBlock`, `bucketsBitmask`, `balEarliestBlock`, `balLatestBlock`), and `WorkerDiscoverySnapshot` surfaces `localEnode`.
- [x] `npm run tsc`, `npm test`, and `npm run spellcheck` pass across `@ethereumjs/devp2p` (ethy CLI flags + `tsc` in `@ethereumjs/ethy`; package-wide spellcheck may flag pre-existing tokens outside this WP).

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

**Spec:** [`protocols/devp2p/ETHY-0-SPEC.md`](../../../../protocols/devp2p/ETHY-0-SPEC.md) §4–6, §9. **Out of scope (WP-06c):** proof-sidecar writes during snap sync, `--sync-mode`, Ethy-vs-Snap TUI, product 2-client loopback.

### Design refinements (D-088)

| Topic | Decision |
| --- | --- |
| HELLO `ethy` version `0` | Use `intToUnpaddedBytes` in `Peer._sendHello` for capability versions so `0` → RLP `0x80` (spec §5.1 wins over §4.1 `intToBytes(0)`). |
| Snappy | Same as ETH/SNAP in `ETHY.sendMessage` / `sendStatus`; `Peer._handleMessage` uncompresses before dispatch. |
| Chunk server | In-worker memory via `putEthyAccountChunk`; optional read-only `accounts/<n>.proof.idx` when `ethyPivotDir` set. Empty miss replies; no hang. Sidecar writes → WP-06c. |
| PEX | Worker auto-sends `GET_ETHY_PEERS` after first valid remote `ETHY STATUS`; dials `ETHY_PEERS` without main-thread wake. |
| Default caps | Ethy adds `ethy0` alongside `eth69`–`eth72`, `snap1`; non-Ethy peers ignore via HELLO intersection. |

### File tree

| Path | Action |
| --- | --- |
| `packages/devp2p/src/protocol/ethy.ts` | New: `ETHY`, codes, STATUS + repeat STATUS, codecs |
| `packages/devp2p/src/protocol/ethy/codec.ts` | New: encode/decode helpers, `EthyPeerStatus` |
| `packages/devp2p/src/serve/ethyChunkStore.ts` | New: memory chunks + optional `.proof.idx` read |
| `packages/devp2p/src/serve/ethyServer.ts` | New: answer GET_* from store + `RollingBlockStore` |
| `packages/devp2p/src/types.ts` | `ProtocolType.ETHY`, `PeerInfo.ethyCapable` |
| `packages/devp2p/src/protocol/index.ts` | export `ETHY` |
| `packages/devp2p/src/lab/capabilities.ts` | `ethy0` → `ETHY.ethy0` |
| `packages/devp2p/src/rlpx/peer.ts` | `intToUnpaddedBytes` for HELLO cap versions |
| `packages/devp2p/src/dpt/discv4Enr.ts` | optional `"ethy"` pair when caps include `ethy0` |
| `packages/devp2p/src/dns/enrPeerFields.ts` | parse `ethy` → `ethyCapable` |
| `packages/devp2p/src/worker/protocol.ts` | telemetry, commands, `localEnode` |
| `packages/devp2p/src/worker/host.ts` | wire ETHY, serve, PEX, `setEthyStatus` |
| `packages/devp2p/src/worker/client.ts` | `sendEthyMessage`, `setEthyStatus`, `putEthyAccountChunk` |
| `packages/devp2p/src/discovery/metrics.ts` | `localEnode` in snapshot |
| `packages/devp2p/test/protocol/ethy.spec.ts` | Codecs + HELLO + no-ETHY peer |
| `packages/devp2p/test/worker/ethy-swarm.spec.ts` | 3-node PEX + chunk + BAL |
| `packages/ethy/src/cli/args.ts` | `--port`, `--connect`, `--bootnodes`, `--data-dir` |
| `packages/ethy/src/net/peerCoordinator.ts` | `ethy0`, connect peers |
| `packages/ethy/src/tools/diagnose.ts` | `localEnode` in `/peers` comment |
| `packages/ethy/test/args.spec.ts` | flag parsing |

### Wire / session

1. HELLO negotiates `ethy/0` (length 11).
2. On mount: worker sends `ETHY STATUS` from `setEthyStatus` or zeros + chain genesis from `Common`.
3. Inbound `STATUS`: validate version/chain/genesis; emit `status` then `statusUpdated` on updates; never reject repeat STATUS.
4. After first valid remote STATUS: send `GET_ETHY_PEERS`; upsert `_ethyKnownPeers` (max 64).
5. `GET_*` served in worker (`handled`); responses also forwarded on `protocol: 'ethy'` for tests.

### Gates

`npm run tsc` + `npm test` + spellcheck in `devp2p` and `ethy`. No new runtime deps. Devp2p commits separate from ethy.

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

- **PEX dial endpoint:** `Peer.advertisedTcpEndpoint()` uses HELLO `port` (listen port) for `_ethyKnownPeers`, not the ephemeral TCP source port on inbound connections.
- **Inbound `ETHY_PEERS`:** Worker calls `_consumeEthyPeers` in `subprotocolDispatch` before forwarding to the main thread (dispatch returns `handled` and would otherwise skip protocol `_handleMessage`).
- **Proven chunk test:** Wire-level chunk fetch is covered via `tryServeEthyGet` unit test (`test/serve/ethyServer.spec.ts`); swarm integration covers STATUS, PEX, BAL_RANGE, and eth71-only cap intersection.
- **Read-only `.proof.idx`:** `ethyPivotDir` init option is wired; sidecar parsing remains minimal until WP-06c.
- **Ethy CLI:** `--connect` / `--bootnodes` require `enode://` (RLPx needs the 64-byte node id); field name `connectEnodeUrls` in args/coordinator.
