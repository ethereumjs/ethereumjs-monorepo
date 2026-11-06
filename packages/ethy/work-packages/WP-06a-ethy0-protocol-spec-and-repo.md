# WP-06a: `ETHY/0` DevP2P Protocol Specification & `ethereumjs/protocols` Repository

- **Status:** `DONE` *(Coordinator-Executed Task — Gemini 4 Argon)*
- **Dependencies:** `WP-04k` (`DONE`), `WP-05a` (`DONE`), `WP-05b` (`DONE`)
- **Author / Implementer:** Coordinator (Gemini 4 Argon)
- **Target Repository:** [`ethereumjs/protocols`](https://github.com/ethereumjs/protocols) (`/Users/holgerd/DEV/EthereumJS/protocols`)

---

## 1. Context & Vision: Why `ETHY/0` Exists

With EIP-7928 Block-Level Access Lists (`BAL` on `eth/71`) and Consensus Light Clients (`@ethereumjs/beacon-light`), an Ethereum node no longer needs to retain an 80 GB database of interior Merkle Patricia Trie (`MPT`) branch nodes or re-execute every block just to hold and verify the full Ethereum world state.

However, traditional `snap/1` has an asymmetric bottleneck:
- While every **syncing** `snap/1` client receives flat account/storage leaves accompanied by their left/right Merkle boundary proofs (`proof: bytes[]`), a flat-state client throws away those boundary proofs after verification.
- Because `snap/1` has no `STATUS` handshake to advertise partial or flat-only capabilities, flat-state clients cannot serve `snap/1` `AccountRange` or `StorageRanges` without maintaining 128 historical MPT roots — turning flat-state clients into pure `snap/1` consumers.

**`ETHY/0` (`["ethy", 0]` on `devp2p` RLPx)** solves this at the protocol root:
1. **Self-Proving State Chunks (Zero MPT Database Needed to Serve!):**
   - When an Ethy node syncs a sub-range chunk $[k_{\text{origin}} \dots k_{\text{last}}]$ from `snap/1` (or from another `ethy/0` peer), it persists the verified flat 136-byte `BinaryAccount` slab **together with the ~4 KB left/right Merkle boundary proof (`proofNodes`) and the chunk's `stateRoot` ($R_k$) & `blockNumber` ($B_k$)** in a compact proof sidecar index (`~1.5%` disk overhead).
   - Any `ethy/0` peer can serve that chunk directly from flat disk files with `O(1)` seeks, and the receiving peer verifies the chunk using standard `verifyMerkleRangeProof(R_k, origin, last, keys, values, proofNodes)` — **100% trustless, zero trust in the serving `ethy/0` peer!**
2. **Historical Checkpoint + Compact BAL Delta Tail (`#C + 1 .. #Head`):**
   - Because `eth/71` BALs deterministically advance flat state forward without EVM execution or trie healing, an `ethy/0` snapshot does **not** need to be within Geth's 128-block (~25 minute) retention window!
   - An `ethy/0` peer can serve a verified base snapshot from hours or days ago (`#C`) along with batch-streamed `(headerRlp, balRlp)` bundles (`GET_BAL_RANGE`) from `#C + 1 .. #Head`, allowing 1 `snap/1` seeder to onboard 100+ `ethy/0` peers!
3. **Epidemic Peer Exchange (`ETHY_PEX`) & Zero-Config Discovery:**
   - Includes native `GET_ETHY_PEERS` / `ETHY_PEERS` peer exchange + EIP-778 ENR `"ethy"` tag specification so sparse `ethy/0` nodes find each other in `< 200ms` without requiring central infrastructure.

---

## 2. Deliverables in `ethereumjs/protocols` (Executed by Coordinator Once Repo URL Is Provided)

### 2.1 Root `README.md` (`ethereumjs/protocols/README.md`)
- Positions **`ethereumjs/protocols`** as the home for open wire protocols, subprotocol extensions, and client specifications designed within the EthereumJS ecosystem and shared with the broader Ethereum community.
- Explains the philosophy: **approachable, implementation-ready specifications** written for both **human engineers** and **AI coding agents**, complete with architectural diagrams, exact RLP/SSZ wire layouts, state-machine invariants, security proofs, and worked byte-level examples.
- Provides a clear index table linking to [`devp2p/ETHY-0-SPEC.md`](./devp2p/ETHY-0-SPEC.md).

### 2.2 `devp2p/ETHY-0-SPEC.md` — The Complete, Self-Contained `ETHY/0` Specification
Unlike terse legacy `devp2p` specs, `devp2p/ETHY-0-SPEC.md` will be structured as a gold-standard reference document:

1. **Executive Overview & Problem Statement:**
   - The post-Amsterdam state sync landscape (`snap/1` + `eth/71` BAL + `beacon-light`).
   - Why `snap/1` cannot be served by flat-state nodes and how `ethy/0` turns flat-state nodes into a BitTorrent-style self-proving swarm (`1:100+` `snap/1` offload).
2. **Cryptographic Trust Model & End-to-End Verification Chain:**
   - How a joiner verifies `(blockNumber, blockHash, stateRoot)` via Consensus Light Client (`@ethereumjs/beacon-light`) or verified header/BAL hash chain.
   - How per-chunk `stateRoot` ($R_k$) + `verifyMerkleRangeProof` guarantees **completeness (no omitted accounts)** and **soundness (no forged balances/nonces/storage)** even across rolling-pivot snapshots (`WP-04k`).
   - How `GET_BAL_RANGE` heals any chunk from $R_k$ to the live head `#H` via `header.blockAccessListHash === keccak256(balRlp)`.
3. **Capability Negotiation, ENR Discovery & `ETHY_PEX`:**
   - RLPx `HELLO` capability tuple: `["ethy", 0]`.
   - EIP-778 ENR key: `"ethy"` (`rlp(0)` = `0x80` for v0) so discovery v4 / v5 and DNS ENR crawlers can identify `ethy/0` nodes before TCP dial.
   - Bidirectional serving over outbound TCP connections (how NATed laptop nodes serve chunks to peers they dialed).
4. **Complete Wire Protocol & Message Catalog (`0x00` – `0x0a`):**
   - Canonical RLP scalar rules (`0` encoded as `0x80` empty bytes, never `0x00`).
   - **`0x00 STATUS`:**
     ```text
     [version, chainId, genesisHash, basePivotBlock, basePivotStateRoot, bucketsBitmask, balEarliestBlock, balLatestBlock, latestBlockHash]
     ```
     - `bucketsBitmask` (`uint16`, `0x0000..0xffff`): exact bitmask of which of the 16 account nibbles (`0x0..0xf`) this peer has 100% verified and proven on disk — allowing a node that is only 50% synced (`8/16` buckets done) to immediately serve those 8 buckets to other peers!
   - **`0x01 GET_BUCKET_MANIFEST` / `0x02 BUCKET_MANIFEST`:**
     - Queries a peer for the list of self-proving chunks in bucket `0x0..0xf`:
       `[requestId, bucketIndex]` → `[requestId, bucketIndex, [[chunkIndex, originHash, lastHash, hasRight, chunkStateRoot, chunkBlockNumber, accountCount, byteSize], ...]]`.
   - **`0x03 GET_PROVEN_ACCOUNT_CHUNK` / `0x04 PROVEN_ACCOUNT_CHUNK`:**
     - Requests and returns one self-proving account chunk:
       `[requestId, bucketIndex, originHash]` → `[requestId, bucketIndex, originHash, lastHash, hasRight, chunkStateRoot, chunkBlockNumber, binaryAccountsSlab, proofNodesRlp]`.
     - Specifies both the compact 136-byte `BinaryAccount` slab layout (`32B hash + 8B nonce + 32B balance + 32B storageRoot + 32B codeHash`) and how the receiver runs `verifyMerkleRangeProof` in one pass!
   - **`0x05 GET_PROVEN_STORAGE_OR_CODE` / `0x06 PROVEN_STORAGE_OR_CODE`:**
     - Batch transfer of contract code blobs (`keccak256(code) === codeHash`) and proven storage slot ranges (`[accountHash, storageRoot, originSlot, lastSlot, hasRight, slotsPayload, proofNodes]`).
   - **`0x07 GET_BAL_RANGE` / `0x08 BAL_RANGE`:**
     - High-throughput batch streaming of contiguous `(blockNumber, headerRlp, balRlp)` tuples (`up to 32 blocks per request`) for healing from `basePivotBlock` (`#C`) to `#Head`.
   - **`0x09 GET_ETHY_PEERS` / `0x0a ETHY_PEERS`:**
     - Peer exchange (`PEX`) returning up to 32 recently active `ethy/0` peers:
       `[requestId, [[peerId, ipBytesOrString, tcpPort, udpPort, basePivotBlock, bucketsBitmask, lastSeenAgeSec], ...]]`.
5. **Sync Source Selection & Fallback Algorithm (The `ETHY/0` vs `SNAP/1` Decision State Machine):**
   - Clear, deterministic rules for implementers on when a node syncs via `ETHY/0` vs `SNAP/1` (matching `WP-06c`).
6. **Integrator Guide (For Human Engineers & AI Agents):**
   - Step-by-step implementation checklist, test-vector construction guide, and common pitfalls (RLP canonical zero, Snappy framing, per-chunk `chunkStateRoot` verification).

---

## 3. Acceptance Criteria

- [x] `ethereumjs/protocols` repository initialized with a compelling root `README.md`, `LICENSE`, `AGENTS.md`, `.cursor/rules/`, and `devp2p/ETHY-0-SPEC.md`.
- [x] All message codes (`0x00`..`0x0a`), RLP schemas, binary layouts (`136B` `BinaryAccount` slab + `<nibble>.proof.idx` sidecar), discovery tags (`"ethy"` ENR key), and verification invariants are specified unambiguously so Grok 4.7 / Composer 2.5 can implement `WP-06b` and `WP-06c` directly against the spec.
