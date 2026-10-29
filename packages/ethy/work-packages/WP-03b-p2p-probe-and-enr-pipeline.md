# WP-03b: P2P Master Plan — Surgical 4-Stage P2P Probe, Direct DNS/EIP-868 ENR Pipeline & Live `snap/1` Verification

- **Status:** `DONE` (offline gates green; live Sepolia stages 1–3 + ethy soak are manual)
- **Dependencies:** `WP-00` (`DONE`), `WP-01` (`DONE`), `WP-02` (`DONE`), `WP-02b` (`DONE`), `WP-03` (offline sync & `FlatStateManager` `DONE`)
- **Branch:** `ethy-wp03` (or dedicated continuation branch)
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Strategic Context & Root-Cause Forensics

### Why P2P Is Core UX
In a UI-first, execution-free client like Ethy, **P2P reliability and time-to-first-data *are* the core UX**. A polished 3-box cockpit is meaningless if the node sits at `0 connected` or takes 2 hours to find peers that should be reachable in 2 seconds.

During `WP-03`, live Sepolia runs showed 3,684 DNS records fetched and 2,404 RLPx dials, yet `statusOk` stayed near `0`, the k-bucket filled with Polygon (`bor`), BNB Chain (`reth-bsc`), PulseChain (`networkId=369`), and other non-Sepolia nodes, and real Sepolia `Geth/v1.17.0` peers dropped us with `SUBPROTOCOL_ERROR (remote dropped us)`.

### The 3 "Smoking Guns" Identified in the Codebase

1. **Smoking Gun #1 — `ENR.parseAndVerifyRecord` (`packages/devp2p/src/dns/enr.ts:87-91`) Drops `peer.id` and `obj.eth`!**
   - Look at `enr.ts:87-91`:
     ```ts
     const peerInfo: PeerInfo = {
       address: ipToString(obj.ip),
       tcpPort: bytesToPort(obj.tcp),
       udpPort: bytesToPort(obj.udp),
     }
     ```
   - Even though `obj.secp256k1` (the 33-byte compressed public key) was just verified on line 80, **`id: pk2id(obj.secp256k1)` is never set on `peerInfo`!** (`pk2id` in `src/util.ts:37` already supports 33-byte compressed keys via `secp256k1.Point.fromBytes(pk)`!).
   - **Fatal consequence:** Because `peer.id` is `undefined`, `RLPx.connect(peer)` cannot dial DNS peers directly! Instead, `DPT.refresh()` (`dpt.ts:508`) feeds all DNS peers into `DPT.addPeer()`, forcing a slow UDP `PING`/`PONG` round-trip just to learn the `id` we *already had* in the signed ENR! Worse, once 155 random discovery-v4 nodes fill the k-bucket, `_onKBucketPing` rejects and **bans** the verified Sepolia DNS peers (`Cause: k-bucket full; existing remotes answered`, `Ban: new 22350`) before `RLPx` ever dials them!
   - Also in `enr.ts`: if an ENR lacks `ip`, `tcp`, or `udp` (e.g. IPv6-only or UDP-only consensus record), `ipToString(obj.ip)` or `bytesToPort(obj.tcp)` throws or produces invalid ports. Guard `obj.ip`, `obj.tcp`, and `obj.udp` cleanly.

2. **Smoking Gun #2 — Missing EIP-868 (`eth` ENR Entry) Filtering & The Giant Discovery v4 Pool:**
   - Discovery v4 (`FINDNEIGHBOURS` / `NEIGHBOURS`) is a single global DHT shared by Ethereum Mainnet, Sepolia, Polygon (`bor`), BNB Chain, PulseChain, and dozens of other chains.
   - How do Geth and Reth filter out alien chains *before* TCP dial? Via **EIP-868 (`eth` ENR entry: `[[forkHash, forkNext]]`)**!
   - Both EIP-1459 DNS ENR records (`enr.ts`) and discovery v4 `ENRResponse` packets (`src/dpt/` ENR helper) contain the `"eth"` key-value pair: `[ [forkHash4Bytes, forkNextBytes] ]`.
   - By decoding `enr.eth` (`forkHash` + `nextFork`):
     - We can filter out any peer whose `forkHash` is not in our chain's known `hardforks` list *before* adding it to the dial queue.
     - We should **stop blindly adding unsolicited inbound UDP `ping` senders to our peer table** (`packages/devp2p/src/dpt/server.ts:192-194`: `if (peer === null && info.typename === 'ping') setTimeout(() => this.events.emit('peers', [info.data.from]), 100)`), which is the primary vector through which Polygon/BSC crawlers inject themselves into our k-bucket!

3. **Smoking Gun #3 — Simulated Wall-Clock (`Oct 2026`) vs. Real-World Sepolia Fork Schedule (`0x6c1d9423` vs `0x268956b6`):**
   - In `WP-03`, `packages/common/src/chains.ts:314` added `amsterdam` on Sepolia with `timestamp: '1791294816'` (Oct 6, 2026) and `forkHash: '0x6c1d9423'`.
   - Because the local environment clock is in **Oct 2026**, `activeHardfork(Sepolia)` (`getHardforkBy({ timestamp: now })`) selected `amsterdam` (`0x6c1d9423`).
   - Meanwhile, real-world `Geth/v1.17.0` nodes on the live Sepolia network today are on **`bpo2` (`forkHash: 0x268956b6`, `nextFork: 0`)**! When we sent `forkHash: 0x6c1d9423` in our `ETH` `STATUS`, every real Sepolia Geth node rejected our `forkId` under EIP-2124 and dropped us with `SUBPROTOCOL_ERROR (remote dropped us)`.
   - **The deterministic solution:** Never guess the live network's active fork from the local machine's wall-clock alone! When `DNS` resolves the chain's official ENR tree, the ENRs' EIP-868 `eth` entries tell us the **exact `forkHash` and `nextFork` advertised by the chain's live boot/directory nodes right now**! And in `chains.ts`, `amsterdam` on Sepolia must remain `block: null` (without a past timestamp) until Amsterdam is actually live on public Sepolia, or we dynamically align our advertised `forkId` with the verified DNS ENR tree consensus.

---

## 2. Key Deliverables (4 Structured Slices)

### Slice 1 — Deterministic 4-Stage Surgical P2P Probe CLI (`packages/devp2p/scripts/p2p-probe.ts` & `npm run p2p:probe`)

Before running full multi-peer node soaks, AI agents and developers need a **fast (2–5 second), deterministic, single-peer diagnostic probe** that isolates each layer of the P2P funnel with zero background noise:

```bash
npx tsx packages/devp2p/scripts/p2p-probe.ts --chain sepolia [--stage 1|2|3|4] [--peer ip:port:id]
```

- **Stage 1 — `dns-enr` (~0.5s):**
  - Resolves up to N records from the chain's EIP-1459 `dnsNetworks` tree.
  - Verifies signatures, extracts `{ id, address, tcpPort, udpPort, ethForkHash, ethNextFork }`, and prints a clean JSON/table summary showing:
    - Total ENRs resolved, count with valid `id` + `tcpPort`, and the **histogram of `eth.forkHash` values advertised by live DNS peers** vs. our local `Common` `forkHash` schedule!
- **Stage 2 — `single-status` (~1.5s):**
  - Picks 1 verified DNS peer from Stage 1 (or `--peer`), opens **one** isolated TCP `RLPx` connection (no `DPT` background noise), and logs exact millisecond timings and payloads for:
    1. TCP connect + ECIES Auth/Ack
    2. `HELLO` exchange (`clientId`, `protocolVersion`, negotiated `eth/*` and `snap/1` caps)
    3. `ETH` `STATUS` exchange — logs **both** our outbound `STATUS` fields and the remote peer's inbound `STATUS` fields (`networkId`, `genesisHash`, `forkId: [forkHash, next]`, `earliestBlock`, `latestBlock`, `latestBlockHash`). If either side disconnects, prints the exact reason and field diff.
    4. Holds the connection open for **6 seconds** (past the 5s status timeout) to prove sustained session stability.
- **Stage 3 — `single-snap` (~1.5s):**
  - On the validated single peer from Stage 2:
    1. Sends `GET_BLOCK_HEADERS` for the peer's announced `latestBlockHash` → decodes the `BlockHeader` and extracts `stateRoot` + `number`.
    2. Sends one `snap/1` `GET_ACCOUNT_RANGE` (`reqId=1`, `root=stateRoot`, `origin=0x00..00`, `limit=0x0f..ff`, `bytes=32768`).
    3. Decodes `ACCOUNT_RANGE`, runs `verifyMerkleRangeProof`, and prints `{ pivotBlock, stateRoot, accountsReturned, proofVerified: true, latencyMs }`.
- **Stage 4 — `funnel-soak` (`--soak 20`):**
  - Runs the threaded network for N seconds and outputs a single deterministic JSON scorecard measuring the exact conversion funnel:
    `dnsRecordsResolved` → `enrForkMatched` → `tcpDials` → `helloOk` → `statusValidated` → `peersSustained5s` → `pivotAnchored` → `snapRangesVerified` → `snapAccountsIngested`.

---

### Slice 2 — `ENR` `id` + EIP-868 `eth` Decoding & Direct DNS-to-RLPx Fast-Path (`@ethereumjs/devp2p`)

1. **Upgrade `ENR.parseAndVerifyRecord` (`packages/devp2p/src/dns/enr.ts`):**
   - Set `id: pk2id(obj.secp256k1)` on the returned `PeerInfo` (when `obj.secp256k1` is present).
   - Guard `obj.ip`, `obj.tcp`, and `obj.udp`: only call `ipToString(obj.ip)` when `obj.ip instanceof Uint8Array && (obj.ip.length === 4 || obj.ip.length === 16)`, and only decode ports when `obj.tcp` / `obj.udp` is a `Uint8Array` of length `>= 1` (handle 1-byte or 2-byte big-endian port encodings safely via `bytesToInt`!).
   - Decode the optional EIP-868 `obj.eth` entry (`[[forkHashBytes, forkNextBytes]]`) into `peerInfo.ethForkId = { forkHash: bytesToHex(forkHashBytes), nextFork: bytesToBigInt(forkNextBytes) }` on `PeerInfo` (`src/types.ts`).
   - Also parse the `eth` field in `src/dpt/` when receiving discovery v4 `enrResponse` packets!
2. **Direct DNS-to-RLPx Dialing (Bypass UDP `DPT.addPeer` & K-Bucket Bottleneck):**
   - When `DNS.getPeers()` returns verified ENR peers that *already* have `{ id, address, tcpPort }`:
     - Filter them by `ethForkId`: if `peer.ethForkId` is present and `common` is configured, verify `common.hardforkForForkHash(peer.ethForkId.forkHash) !== null` (rejecting alien chains immediately!).
     - Emit/feed those verified directory peers **directly to `RLPx` (`_onDiscoveredPeer`)** instead of routing them through `DPT.addPeer()`'s UDP `ping` and `_kbucket` capacity check!
3. **Stop Unsolicited UDP Ping Pollution in `DPTServer` (`packages/devp2p/src/dpt/server.ts:192-194`):**
   - In `DPTServer._handler`, when an unknown remote sends us an unsolicited UDP `ping`, **do not** blindly emit `peers` after 100ms when `shouldGetDnsPeers` / chain filtering is active (or require `enrRequest`/`enrResponse` fork verification first). This stops Polygon/BSC crawlers from filling our k-bucket and dial queue.

---

### Slice 3 — Fork-ID Reality Alignment (`@ethereumjs/common` & `@ethereumjs/ethy`)

1. **Fix Sepolia Schedule in `@ethereumjs/common` (`packages/common/src/chains.ts`):**
   - Revert the premature `timestamp: '1791294816'` on Sepolia `amsterdam` in `chains.ts` back to `block: null` (matching `Mainnet` and `Holesky` where `amsterdam` has `block: null` until official mainnet/testnet activation, or use the forkHash discovered from live Sepolia ENRs).
   - Verify with **Stage 1 of `p2p:probe`** what `forkHash` live Sepolia DNS ENRs advertise today (`0x268956b6` for `bpo2`), and ensure `activeHardfork(Sepolia)` (or dynamic ENR fork-sync in `Devp2pWorkerHost`) advertises the exact forkId that live Sepolia peers expect!
2. **Symmetric `STATUS` Validation (`packages/devp2p/src/protocol/eth.ts`):**
   - Ensure `ETH._validateForkId` and `ETH.sendStatus` use the peer's/chain's active `forkHash` and `nextFork` cleanly so both Geth and Reth accept our `STATUS` and we accept theirs.

---

### Slice 4 — End-to-End Live Sepolia `snap/1` Verification in `@ethereumjs/ethy`

1. Wire the improved `Devp2pWorkerHost` + direct DNS-to-RLPx pipeline into `packages/ethy`.
2. Verify with the Stage 1–4 `p2p:probe` and `node --import tsx packages/ethy/src/cli/main.ts sepolia --headless` (and TUI `ethy sepolia`) that:
   - `statusOk` climbs to `>= 3` within 10–15 seconds.
   - `spine.pivotBlockNumber` and `spine.pivotStateRoot` anchor automatically from the best validated peer.
   - `SnapAccountSynchronizer` transitions `spine.phase` to `'SNAP_SYNCING'` and ingests real verified Sepolia accounts (`totalAccountsSynced > 0`) into `FlatStateManager`!

---

## 3. Acceptance Criteria
- [x] `ENR.parseAndVerifyRecord` sets `id: pk2id(obj.secp256k1)`, safely handles 1–2 byte ports / missing fields, and parses `ethForkId` (`forkHash` + `nextFork`).
- [x] Verified DNS ENR peers with `id` and `tcpPort` feed directly into `RLPx` without being dropped by UDP `DPT.ping` timeouts or a full discovery v4 k-bucket.
- [ ] Stage 1, Stage 2, and Stage 3 of `packages/devp2p/scripts/p2p-probe.ts` succeed against live Sepolia (`dns-enr` → `single-status` held >5s → `single-snap` fetches and verifies a real Sepolia account range).
- [ ] Running `ethy sepolia` anchors a live Sepolia pivot header and ingests real verified accounts (`totalAccountsSynced > 0`) via `snap/1`.
- [x] All offline unit tests (`npm test`), `npm run tsc`, and `npm run spellcheck` pass in `packages/common`, `packages/devp2p`, and `packages/ethy`.

---

## 4. Concrete Implementation Plan (Planner — Grok 4.7)

### Design refinements (D-045–D-047)

- **D-045.** `Common.forkHash()` returns explicit `forkHash` before the unscheduled-fork throw (Mainnet/Holesky Amsterdam rows). Sepolia `amsterdam` stays scheduled at `1791294816` per [EIP-7773](https://eips.ethereum.org/EIPS/eip-7773); wall-clock STATUS uses Amsterdam after activation. Stage 1 probe histogram is the live check.
- **D-046.** DNS peers with `{ id, address, tcpPort }` → `peer:new` + `chainDirectory`; skip `addPeer`/k-bucket. Bootnodes stay on `bootstrap()`. Unknown inbound pings get `pong` only. `enrResponse` parses `eth`; unknown fork hash → ban/remove.
- **D-047.** `npm run p2p:probe` in `@ethereumjs/devp2p`; not in CI/`npm test`. Vitest covers parsers, dial split, fork lookup only.

### Slice 1 — `@ethereumjs/devp2p` (ENR + DNS fast path)

**Parse (`enr.ts`, `peerFieldsFromEnrPairs` helper):** `id` via `pk2id(secp256k1)`; guarded `ip` (4/16 bytes); ports via `bytesToInt` (1–2 bytes, 1..65535); optional EIP-868 `eth` (RLP `[[forkHash, next]]` or `[forkHash, next]`) → `PeerInfo.ethForkId`.

**Discovery v4:** shared `eth` decoder in the DPT ENR module; `enrResponse` in `server.ts` bans unknown fork hashes.

**Dial split (`dpt.ts` `refresh`):** complete DNS peers → fork filter → `peer:new`; incomplete → drop; never `_addPeerBatch` for DNS. Metric `dns.forkRejected` on snapshot.

**Inbound ping:** remove auto-`peers` emit on unknown ping in `server.ts`.

**Tests:** `enr.spec.ts`, DPT DNS fast-path stub, server ping test.

### Slice 2 — `@ethereumjs/common`

Remove Sepolia `amsterdam` `timestamp: '1791294816'`. Reorder `forkHash()` to honor pinned hash before future throw. Update `hardforks.spec.ts`. One line in `ethy/ARCHITECTURE.md`.

### Slice 3 — `packages/devp2p/scripts/p2p-probe.ts`

Stages 1–4: `dns-enr`, `single-status`, `single-snap`, `funnel-soak`. Script `p2p:probe`.

### Slice 4 — Ethy

No `PeerCoordinator` fork override. Manual Sepolia soak gate after live probe stages 1–3.

### Gates

`tsc`, `test`, `spellcheck` per touched package. Separate commits: `common` → `devp2p` → `ethy` docs.

---

## 5. Implementation Notes & Deviations (Implementer — Composer 2.5)

- **`enrPeerFields.ts`:** Shared EIP-868 decode + `peerFieldsFromEnrPairs`; DNS and discovery v4 ENR paths reuse it.
- **DNS fast path:** `DPT._feedDnsDirectoryPeers` emits `peer:new` for valid TCP ENRs; fork rejects increment `dns.forkRejected`.
- **Inbound ping:** Auto-`peers` on unknown ping remains when `DPTServer` has **no** `common` (legacy local tests); Ethy passes `common` so crawlers are not bonded.
- **Sepolia fork:** EIP-7773 comment on Sepolia `amsterdam` row; `forkHash()` pin order for unscheduled forks with explicit hash.
- **Probe:** `npm run p2p:probe -- --chain sepolia --stage N` (live only). Stage 4 scorecard stops at sustained STATUS; pivot/snap ingestion stays on the ethy soak checklist.
- **Live gates:** Run stages 1–3 and `ethy sepolia --headless` manually on the network; not CI.
