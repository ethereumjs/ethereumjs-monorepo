# P2P live log

Measured Sepolia sessions from `packages/devp2p` (`npm run p2p:probe`). Each entry is one run. Do not treat a single soak as a fleet guarantee.

## Record

| Field | Meaning |
| --- | --- |
| When | Local time |
| Build | What this tree dials |
| Stage | Probe stage and duration |
| DNS fork | Histogram vs our `forkHash` |
| Dials / HELLO / STATUS | Cumulative RLPx counters |
| Kept | Peers still up at the end, with a remote head |
| Drop | Dominant remote disconnect |
| Verdict | `keep` if STATUS peers stay up, `drop` if the dial path is wrong |

## Log

### 2026-10-29 — ENR `eth` decoded as bytes only

| Field | Value |
| --- | --- |
| Stage | 1, DNS only |
| DNS fork | 30/30 `(no eth ENR)` |
| Verdict | **drop.** Sepolia TXT records store `eth` as an RLP list. The parser cast that list to bytes, so every directory peer was rejected and discovery v4 neighbors (other networks) filled RLPx. |

### 2026-10-29 — List decode, DNS on, neighbors off, stale head

| Field | Value |
| --- | --- |
| Stage | 4, 45–90s, `chainDirectoryDiscovery` |
| DNS fork | `0x6c1d9423` matches Amsterdam |
| Dials / HELLO / STATUS | 140 / 36 / 3 in 90s |
| Kept | 2 (Erigon, Nethermind) with heads |
| Drop | `TOO_MANY_PEERS` from the remote (~33 of 36 HELLOs) |
| Verdict | **keep the path.** Fork and client identity are Sepolia. A burst of 20 dials per refresh got 0 keepers in 60s. 8 per refresh found keepers. Public nodes are mostly full, so 5 simultaneous peers inside 60s was not reproducible here. |

## What is working

- Sepolia DNS ENRs advertise `0x6c1d9423` (same hash we send).
- Decoding the ENR `eth` list lets those peers through the fork check.
- Directory discovery (DNS + bootnodes) without discovery v4 neighbor crawl stops alien networks (`bor`, network id `1337`).
- A recent head pin (block `0xb7663f`) is accepted: Erigon and Nethermind completed ETH STATUS and stayed.
- TCP connect has its own timeout, so a dead ENR does not hold a `maxPeers` slot until the OS gives up.
- Remote `TOO_MANY_PEERS` stays in the dial LRU so the next wave tries a different ENR.

## What is not working

- Most reachable Sepolia ENRs answer HELLO and then disconnect with `TOO_MANY_PEERS`. That is their peer cap, not our fork id.
- Raising the per-refresh dial cap makes this worse (60s at 20 dials: STATUS 0).
- Five headed peers inside one minute is not something this network sample can promise. Two headed peers in 90s is the best soak in this log.
