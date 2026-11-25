# WP-16a: `@ethereumjs/devp2p` — `STATY/0` Subprotocol, `ETHY/0` `v0.3` Per-Plane & Storage Upgrade, Shared Code Serving & `STATY_PEX`

- **Status:** `READY_FOR_PLANNING`
- **Dependencies:** `WP-06b` (`DONE`), `WP-11b` (`DONE`), `WP-13` (`DONE`), [`protocols/devp2p/STATY-0-SPEC.md`](../../../../protocols/devp2p/STATY-0-SPEC.md) (`v0.1`), [`protocols/devp2p/ETHY-0-SPEC.md`](../../../../protocols/devp2p/ETHY-0-SPEC.md) (`v0.3`)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Implement the complete **`STATY/0` (`["staty", 0]`, `length = 11`)** DevP2P subprotocol and upgrade **`ETHY/0` (`["ethy", 0]`, `length = 11`)** to **`v0.3`** inside **`@ethereumjs/devp2p`** (`packages/devp2p/`), keeping all wire framing, peer exchange, disk serving, and capability gating strictly inside the worker-thread runtime with zero new runtime dependencies and clean commit isolation (**D-008**).

`STATY/0` carries **zero BAL wire messages** (rolling `(header, BAL)` windows stay on `eth/71`), while `ETHY/0` `v0.3` remains 100% wire-compatible with existing `v0.2` peers.

---

### Key Deliverables (`WP-16a`)

1. **`STATY/0` Subprotocol Class & Wire Codecs (`packages/devp2p/src/protocol/staty.ts`, `staty/codes.ts`, `staty/codec.ts`):**
   - Implement `STATY extends Protocol` (mirroring `ETHY` in `protocol/ethy.ts`) with:
     - `STATY.staty0 = { name: 'staty', version: 0, length: 11, constructor: STATY }`
     - `ProtocolType.STATY = 'staty'` in `src/types.ts` and capability mapping `'staty0'` in `src/lab/capabilities.ts`.
   - Message codes (`StatyMessageCodes`, `0x00`–`0x0a`):
     - `STATUS = 0x00`
     - `GET_EPOCH_MANIFEST = 0x01`, `EPOCH_MANIFEST = 0x02`
     - `GET_EPOCH_PART = 0x03`, `EPOCH_PART = 0x04`
     - `GET_WITNESSES = 0x05`, `WITNESSES = 0x06`
     - `GET_BYTECODES = 0x07`, `BYTECODES = 0x08`
     - `GET_STATY_PEERS = 0x09`, `STATY_PEERS = 0x0a`
   - `STATUS` (`0x00`) 10-tuple encoding/decoding per `STATY-0-SPEC.md` § 7:
     `[protocolVersion(0), chainId, genesisHash, earliestEpoch, latestEpoch, epochMask, mintingEpoch, witnessMinAnchorBlock, witnessCountHint, codeCountHint]`.
     - Validate `protocolVersion === 0`, `chainId`, and `genesisHash`; disconnect (`SUBPROTOCOL_ERROR`) on mismatch.
     - Accept repeat `STATUS` messages (emitting `'status'` on first, `'statusUpdated'` on subsequent updates) and ignore trailing future extension fields beyond index `9`.
     - Canonical minimal big-endian scalars (`0` encoded as `0x80` / `new Uint8Array(0)`, never `0x00`).
     - Snappy compression on RLPx v5 and strict decoded payload cap (`MAX_STATY_MESSAGE_BYTES = 2 * 1024 * 1024`).

2. **EIP-778 ENR `"staty"` Discovery Tag & Epidemic `STATY_PEX` (`packages/devp2p/src/dpt/`, `dns/`, `worker/`):**
   - Advertise `"staty": rlp(0)` (`0x80`) in signed discovery v4 ENR when `statyDiscoveryTag` (or `staty0` capability) is enabled; parse `"staty"` on incoming ENRs into `PeerInfo.statyCapable = true`.
   - Maintain a bounded `_statyKnownPeers` table (`max 64`) inside `Devp2pWorkerHost` with **75% freshest-epoch / highest-coverage + 25% random** peer selection (`selectStatyPexPeers`), mirroring `worker/ethyPex.ts`.
   - Automatically send `GET_STATY_PEERS (0x09)` after the first valid remote `STATY STATUS`, ingest returned `STATY_PEERS (0x0a)` into `RLPx` dialing, and expose `statySession: boolean` and `statyStatus?: WorkerStatyPeerStatus` on `WorkerPeerSnapshot`.
   - Extend `NetworkProfile` (`WP-13`) cleanly with optional `minStatyPeers?: number`, `statyDiscoveryTag?: boolean`, and `preferStatyDiscovery?: boolean` (defaulting to `0` / `false` for backward compatibility).

3. **Worker-Side `STATY/0` Store, Shared `code/` Store & Non-Blocking Server (`packages/devp2p/src/serve/statyStore.ts`, `statyServer.ts`, `sharedCodeDisk.ts`):**
   - **Shared `code/` store (`sharedCodeDisk.ts`):** Content-addressed bytecode reader/cache keyed by 32-byte `codeHash` (with bounded concurrency and in-memory hot LRU) shared directly by BOTH `STATY/0 GET_BYTECODES (0x07)` and `ETHY/0 GET_PROVEN_STORAGE_OR_CODE (kind = 0)`.
   - **In-worker `StatyStore` (`statyStore.ts`):** Reads verified Hot Epoch manifests/parts (`staty/epochs/<epoch>/`) and cached ad-hoc witnesses (`staty/witnesses/`) from disk or in-memory test fixtures.
   - **Non-blocking `tryServeStatyGet` (`statyServer.ts`):**
     - `GET_EPOCH_MANIFEST (0x01)` → `EPOCH_MANIFEST (0x02)` (or empty `shards = []`, `anchorBlock = 0` on miss).
     - `GET_EPOCH_PART (0x03)` → `EPOCH_PART (0x04)` (or empty lists on miss).
     - `GET_WITNESSES (0x05)` → `WITNESSES (0x06)` strictly from local store/cache, filtering `anchorBlock >= minAnchorBlock`, respecting `maxResponseBytes` (`<= 524,288`) and query bounds (`<= 64` accounts, `<= 256` total slots), grouping by `(anchorBlock, anchorStateRoot)`, and omitting misses cleanly (never blocking on upstream `snap/1`).
     - `GET_BYTECODES (0x07)` → `BYTECODES (0x08)` (`1..64` `codeHashes`, `<= 524,288` bytes, misses omitted).
     - `GET_STATY_PEERS (0x09)` → `STATY_PEERS (0x0a)`.
   - Extend `WorkerServingSnapshot` with `statyPartsServed`, `statyWitnessesServed`, `statyCodesServed`, and `statyBytesServed`.

4. **`ETHY/0` `v0.3` Wire Upgrade (`packages/devp2p/src/protocol/ethy/codec.ts`, `serve/ethyChunkStore.ts`, `serve/ethyServer.ts`):**
   - **`0x00 STATUS` Trailing Per-Plane Completeness:**
     - Add `storageBucketsBitmask: number` (index `9`) and `codeBucketsBitmask: number` (index `10`) to `EthyPeerStatus` and `EthyLocalStatusFields`.
     - `parseEthyStatus`: remain backward-compatible with `v0.2` 9-tuple peers (default omitted indices `9` and `10` to `0`, ignore extra trailing fields).
     - `encodeEthyStatus`: emit the full 11-tuple with canonical unpadded integers (`0` → `0x80`).
   - **`0x05`/`0x06` (`PROVEN_STORAGE_OR_CODE`) Full Serving (`kind = 0`, `1`, `2`):**
     - **`kind = 0` (Bytecode Batch):** Serve up to `64` requested `codeHashes` from the shared `code/` store (`sharedCodeDisk.ts`), omitting misses cleanly.
     - **`kind = 1` (Chunked Large-Contract Storage Range):** Serve `[reqId, 1, accountHash, storageRoot, chunkBlockNumber, originSlotHash, lastSlotHash, hasRight, slotsSlab64B, proofNodes]` using packed 64-byte `BinaryStorageSlot` slabs (`32B slotHash + 32B valueBE`) from `ethyStorageDir` / in-memory store (empty `slotsSlab64B = 0x80` on miss).
     - **`kind = 2` (Batched Complete-Trie Small Contracts):** Accept `1..64` `[accountHash, storageRoot]` pairs and return `[reqId, 2, entries: [[accountHash, storageRoot, slotsSlab64B], ...]]` within `maxResponseBytes` (`<= 524,288`), omitting missing or multi-chunk contracts cleanly so clients fall back to `kind = 1`.
   - Extend `WorkerServingSnapshot` with `ethyStorageServed` and `ethyCodesServed` (or include cleanly in existing `ethyBytesServed` + per-plane counters).

5. **Worker Client & Host Commands (`packages/devp2p/src/worker/protocol.ts`, `host.ts`, `client.ts`):**
   - Add worker commands: `setStatyStatus`, `sendStatyMessage`, `setStatyDataDir`, `setSharedCodeDir`, `setEthyStorageDir`, plus in-memory test helpers (`putStatyEpochPart`, `putStatyWitness`, `putSharedCode`, `putEthyStorageEntry`) so offline unit/integration tests require zero disk setup.
   - Forward non-handled or response `staty` frames to main-thread `message` listeners (`protocol: 'staty'`) mirroring `protocol: 'ethy'`.

6. **Comprehensive `@ethereumjs/devp2p` Test Suite:**
   - `test/protocol/staty.spec.ts`: all 11 message codecs, canonical RLP zero (`0x80`), repeat `STATUS`, invalid chain/genesis disconnect, HELLO intersection ignoring `staty/0` on legacy peers.
   - `test/protocol/ethy.spec.ts`: `v0.2` 9-tuple ↔ `v0.3` 11-tuple interoperability (`storageBucketsBitmask` / `codeBucketsBitmask`), `kind = 0 / 1 / 2` encoding & decoding.
   - `test/serve/statyServer.spec.ts` & `test/serve/ethyServer.spec.ts`: `EPOCH_MANIFEST`, `EPOCH_PART`, `WITNESSES` (`minAnchorBlock` filtering + `maxResponseBytes` capping + miss omission), shared `code/` serving across both `STATY/0` and `ETHY/0`, and `ETHY/0` `kind = 1` / `kind = 2` storage serving.
   - `test/worker/staty-swarm.spec.ts`: 3-node `createThreadedNetwork` integration test verifying ENR `"staty"` discovery, `STATY_PEX` transitive discovery (Node C discovers Node A via Node B), `EPOCH_PART` + `WITNESSES` + `BYTECODES` transfer, and serving metrics.

---

### Acceptance Criteria (`WP-16a`)
- [ ] `STATY/0` (`["staty", 0]`, `length = 11`) negotiates cleanly alongside `eth/71`, `ethy/0`, and `snap/1`, and is silently ignored by peers without `staty/0`.
- [ ] `ETHY/0` `v0.3` `STATUS` (`storageBucketsBitmask`, `codeBucketsBitmask`) interoperates seamlessly with `v0.2` 9-tuple peers, and `0x05`/`0x06` serves `kind = 0`, `kind = 1` (64B slab), and `kind = 2` (batched small contracts).
- [ ] `STATY/0` and `ETHY/0` share a single content-addressed `code/` serving store with bounded read concurrency.
- [ ] No new runtime dependencies added; `npm run tsc`, `npm test`, and `npm run spellcheck` pass in `packages/devp2p` (and `packages/ethy` `tsc` remains green against the updated `devp2p` exports).

---

## 2. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled by Grok 4.7)*

---

## 3. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled by Composer 2.5)*
