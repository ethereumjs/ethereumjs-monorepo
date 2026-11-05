# WP-06b: `@ethereumjs/devp2p` `ETHY/0` Subprotocol, Proven-Chunk Server, `ETHY_PEX` & Localhost Peer Connect

- **Status:** `READY_FOR_PLANNING`
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
- [ ] `ETHY/0` (`capabilities: ['eth69', 'eth70', 'eth71', 'eth72', 'snap1', 'ethy0']`) negotiates cleanly between Ethy nodes while remaining 100% invisible/ignored when talking to standard Geth/Reth/Nethermind peers.
- [ ] `WorkerPeerSnapshot` surfaces `ethySession`, `ethyStatus` (`basePivotBlock`, `bucketsBitmask`, `balEarliestBlock`, `balLatestBlock`), and `WorkerDiscoverySnapshot` surfaces `localEnode`.
- [ ] `npm run tsc`, `npm test`, and `npm run spellcheck` pass across `@ethereumjs/devp2p`.

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled out by Grok 4.7 during the Planning pass.)*

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled out by Composer 2.5 after implementation and verification.)*
