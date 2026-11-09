# WP-07d: Dynamic Contract Intelligence — Bytecode Selector/Proxy Fingerprinting, Local Zero-Dep ABI Lens, BAL Behavioral Classification & `/contract` Microscope

- **Status:** `BLOCKED_BY_WP-07c`
- **Dependencies:** `WP-07a` (`DONE`), `WP-07b`, `WP-07c`
- **Planner:** Grok 4.7
- **Implementer:** Composer 2.5

---

## 1. Holistic Scope & Architectural Requirements

### Goal
Enable Ethy to **dynamically classify, reverse-engineer, and explain smart contracts and transaction calls on the fly** — without relying on a hardcoded static address list or any external RPC/explorer API — by combining **four signals Ethy already owns locally**:
1. **Synced Runtime Bytecode (`FlatStateManager` / `SnapPivotStore`)** — single-pass opcode & `PUSH4` selector dispatcher scanning + proxy/delegation target extraction (`EIP-1167`, `EIP-1967`, `EIP-7702`).
2. **Transaction Calldata (`tx.data` from `bodyRlp`)** — 4-byte function selector + local zero-dependency ABI word/tuple decoding.
3. **Receipt Logs (`topics[0..3]` + `data` from `receiptsEth69Rlp`)** — 32-byte event `topic0` matching + indexed/data parameter decoding.
4. **EIP-7928 Block Access Lists (`balJson`)** — behavioral footprint correlation (co-touched contracts, storage write/read ratios, code deployments, net ETH flows).

These deterministic signals produce a structured **`ContractProfile`** that:
- Automatically enriches `ETHEconomyDataManager`'s `topContracts` leaderboard (`ERC-20`, `DEX Router`, `DEX Pool`, `EIP-1967 Proxy`, `AA EntryPoint`, `MEV Solver`, etc.),
- Powers a dedicated **`/contract [address]`** microscope view in the Interaction View (defaulting to the current #1 hot contract when `<address>` is omitted!), and
- Feeds the Local LLM (`WP-07c`) structured ground-truth features so it can narrate *what* an unlabelled contract is doing in plain human prose.

---

## 2. Deep Architectural Design

### 2.1 Zero-Dependency Local ABI & Signature Lens (`src/contracts/localAbi.ts` & `signatureCatalog.ts`)

Per project dependency rules (**D-002**), we keep old external ABI libraries rested and implement a tight, zero-dependency local ABI & signature module directly inside `@ethereumjs/ethy`:

1. **Minimal ABI Parameter Decoder (`src/contracts/localAbi.ts`):**
   - Decodes 32-byte ABI words from `calldata.slice(4)` and receipt log `topics` / `data`:
     - Static primitives: `address` (last 20 bytes), `uint256` / `uint128` / `uint64` / `uint8` (`BigInt`), `int256` (two's complement `BigInt`), `bool`, `bytes32`, `bytes4`.
     - Dynamic tail types (following 32-byte head offset pointers with strict bounds checks so malformed calldata never throws): `bytes`, `string` (UTF-8 printable check), `address[]`, `uint256[]`.
   - Formats decoded calls into compact human-readable strings:
     - `transfer(to: 0xd8dA…6045, amount: 250_000_000)`
     - `swap(recipient: 0x3fC9…7FAD, zeroForOne: true, amountSpecified: -1.5 ETH)`
   - Formats decoded receipt events:
     - `Transfer(from: 0x1111…, to: 0x2222…, value: 1000)`
     - `Swap(sender: 0x3fC9…, amount0: -500, amount1: +1420)`

2. **Built-In Canonical Selector & Event Catalog (`src/contracts/signatureCatalog.ts`):**
   - A curated, high-coverage local table (~250–350 entries) of the most common Ethereum 4-byte function selectors and 32-byte `topic0` event hashes across:
     - **Tokens:** ERC-20 (`transfer`, `transferFrom`, `approve`, `permit`, `mint`, `burn`), ERC-721 (`safeTransferFrom`, `setApprovalForAll`), ERC-1155 (`safeBatchTransferFrom`), WETH (`deposit`, `withdraw`).
     - **DeFi / DEX:** Uniswap V2/V3/V4 & UniversalRouter (`swap`, `execute`, `exactInputSingle`, `mint`, `burn`, `flash`), Curve, Aave/Lending (`supply`, `borrow`, `repay`, `liquidationCall`).
     - **Account Abstraction & Wallets:** ERC-4337 (`handleOps`, `handleAggregatedOps`, `validateUserOp`), Safe multisig (`execTransaction`), EIP-7702 delegation helpers.
     - **Bridges, Staking & Layer-2:** Beacon deposit (`deposit`), L1/L2 standard bridges (`depositETH`, `finalizeWithdrawalTransaction`, `proveWithdrawalTransaction`).
     - **Governance & Proxies:** `upgradeTo`, `upgradeToAndCall`, `propose`, `castVote`, `execute`.

---

### 2.2 Single-Pass Bytecode & Proxy Scanner (`src/contracts/bytecodeFingerprint.ts`)

When Ethy has a contract's runtime bytecode (either in `FlatStateManager.getCodeByHash`, on-disk `SnapPivotStore` code shards, or in a BAL `codeChanges` entry), `fingerprintBytecode(code: Uint8Array)` runs a `< 0.1ms` single-pass instruction scan:

1. **Instruction-Aware Disassembly Loop:**
   - Walks `pc = 0 .. code.length - 1`. Whenever opcode `0x60..0x7f` (`PUSH1..PUSH32`) is encountered, advances `pc` past the `1..32` immediate data bytes so immediate data is never misclassified as opcodes.
2. **Function Dispatcher Selector Extraction (`PUSH4 <sel> EQ`):**
   - Records every `PUSH4 <b0 b1 b2 b3>` (`0x63`) instruction that participates in dispatcher comparisons (`EQ` `0x14`, `SUB` `0x03`, or binary-search `GT`/`LT` followed by conditional jump `0x57`), yielding the exact set of 4-byte selectors implemented by the contract (`implementedSelectors: string[]`).
3. **Proxy & Delegation Detection:**
   - **EIP-1167 Minimal Proxy Clone:** Matches the exact prefix `363d3d373d3d3d363d73` + 20-byte implementation address + `5af43d82803e903d91602b57fd5bf3`.
   - **EIP-7702 Delegated EOA:** Matches `0xef0100` + 20-byte delegate address (`23` bytes total).
   - **EIP-1967 / Transparent Upgradeable Proxy:** Detects delegate call (`0xf4`) in a small dispatcher body and checks the EIP-1967 implementation storage slot (`0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc`) or beacon slot (`0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50`) in `FlatStateManager` / BAL storage touches!
4. **Structural Interface & Archetype Classification:**
   - Tests `implementedSelectors` against interface rule sets:
     - **ERC-20:** `transfer` (`0xa9059cbb`) + `balanceOf` (`0x70a08231`) + (`approve` or `transferFrom`).
     - **ERC-721 / ERC-1155:** `ownerOf` / `safeTransferFrom` / `balanceOfBatch`.
     - **DEX Pool:** `swap` (`0x022c0d9f` or `0x128acb08`) + (`getReserves` or `slot0` / `liquidity`).
     - **DEX Router / Aggregator:** `execute` (`0x3593564c`) or `swapExactTokensForTokens` / `exactInputSingle`.
     - **ERC-4337 EntryPoint / Smart Account:** `handleOps` (`0x1fad948c`) or `validateUserOp` (`0x3a871cdd`).
     - **WETH / Wrapper:** `deposit` (`0xd0e30db0`) + `withdraw` (`0x2e1a7d4d`) + ERC-20 selectors.

---

### 2.3 Behavioral Classification from BALs & Receipts (`src/contracts/contractIntelligence.ts`)

Even when a contract is an **unverified custom contract** (like an MEV bot or custom batcher whose selectors are non-standard) or its bytecode hasn't been fetched yet, `ContractIntelligenceManager` classifies its live behavior from `bodyRlp` + `receiptsEth69Rlp` + `balJson`:

| Archetype | Dynamic Detection Rule (Bytecode + Calldata + Receipt Logs + BAL) |
| --- | --- |
| **`ERC-20 Token`** | Bytecode implements ERC-20 selectors **or** contract emits `Transfer(address,address,uint256)` (`0xddf252ad…`) with 3 topics + writes 2 storage slots per call. |
| **`ERC-721 / NFT`** | Bytecode implements ERC-721/1155 **or** emits `Transfer` with 4 indexed topics (`tokenId`) / `TransferSingle`. |
| **`DEX Pool`** | Bytecode implements V2/V3 pool selectors **or** emits `Swap` + `Sync` events while co-touching 2 ERC-20 token contracts in the BAL. |
| **`DEX Router`** | Receives user txs (`tx.to === addr`) with `execute`/`swap` selectors and fans out across multiple DEX Pools & ERC-20s in the BAL. |
| **`MEV / Arbitrage Bot`** | Custom bytecode (no standard ERC interface) where a single tx touches $\ge 2$ DEX pools in the BAL and emits $\ge 2$ `Swap` logs with net positive token/ETH delta. |
| **`Batch Dispatcher`** | Single transaction writes $\ge 15$ storage slots or emits $\ge 10$ `Transfer` logs across distinct addresses. |
| **`AA / Smart Wallet`** | Calls or is called via `handleOps` / emits `UserOperationEvent` (`0x49628fd1…`) or has `0xef0100` EIP-7702 code prefix. |
| **`Proxy Contract`** | EIP-1167 clone, EIP-7702 delegation, or delegate-call (`0xf4`) proxy with EIP-1967 implementation slot; resolves and classifies the underlying implementation when available! |

---

### 2.4 Enriching `ETHEconomyDataManager`, `/contract` Tool & the Local LLM

1. **Dynamic Labels on `TopContractRow` (`ETHEconomyDataManager`):**
   - Each `TopContractRow` in `spine.economy.topContracts` gains:
     - `archetype: string` (e.g. `'DEX Router'`, `'ERC-20'`, `'DEX Pool'`, `'MEV Bot'`, `'EIP-1967 Proxy'`, `'Contract'`)
     - `knownName?: string` (optional match from a small canonical Mainnet/Sepolia registry like `'WETH'`, `'USDC'`, `'Uniswap Router'`, `'EntryPoint v0.7'`)
     - `topSelectors: string[]` (e.g. `['execute (42x)', 'swap (11x)']`)
   - In the top **`Economy`** cockpit box (`WP-07b`), `Hot Contract` can now display:
     - `0x3fC9… [DEX Router] (38w)` or `WETH 0xfFf9… [ERC-20] (52w)`!

2. **`/contract [address]` Slash Tool (`src/tools/contractTools.ts`):**
   - If invoked as `/contract` with no argument, inspects the current **#1 Hot Contract** from `spine.economy.topContracts[0]`.
   - If invoked as `/contract 0x...` (or `/contract 1` to pick rank `#1..#10` from the `/economy` leaderboard!), builds a rich **`ContractProfile`**:
     - **Core Page (`TableUIComponent` / `KeyValueUIComponent`):**
       - Address, Dynamic Archetype & Confidence (`DEX Router · High`), Bytecode Size & Proxy Target (if EIP-1167 / EIP-1967 / EIP-7702),
       - Rolling 64-block BAL Activity (`Blocks Active`, `Storage Writes`, `Storage Reads`, `Net ETH Δ`),
       - **Decoded Call & Event Summary Table:** Top decoded function calls (`execute(bytes,bytes[]) · 42 calls`) and emitted events (`Swap · 39x`, `Transfer · 84x`) observed in the rolling window!
     - **`Ctrl+D` Debug Page (`DebugPageUIComponent`):**
       - Full list of extracted `PUSH4` bytecode selectors (matched signature vs. unknown `0x........`),
       - Opcode distribution summary (`SSTORE`, `SLOAD`, `CALL`, `STATICCALL`, `LOG1..LOG4`),
       - Raw EIP-1967 proxy storage slot values and recent co-touched BAL addresses.

3. **Local LLM Contract Explanations (`WP-07c` Integration):**
   - When the user asks `"What is the hottest contract doing?"` or `"Explain contract 0x..."` (or during the 30–60s `HEAD_FOLLOWING` background pulse), the LLM receives the structured `ContractProfile` JSON and synthesizes a clear human summary in `AI Overview`:
     > *"Contract 0x3fC9… is a DEX Router (EIP-1967 proxy → 0x881d…). Over the last 48 blocks it executed 42 batched swap calls, mutating 312 storage slots across WETH and 6 ERC-20 pools."*

---

## 3. Acceptance Criteria (`WP-07d`)

- [ ] `src/contracts/localAbi.ts` and `src/contracts/signatureCatalog.ts` decode standard 4-byte selectors, 32-byte event `topic0` hashes, and static/dynamic ABI parameters with zero external npm dependencies and strict bounds safety on malformed input.
- [ ] `src/contracts/bytecodeFingerprint.ts` performs an instruction-aware single-pass scan of contract bytecode to extract `PUSH4` dispatcher selectors, detect `EIP-1167`, `EIP-1967`, and `EIP-7702` proxies/delegations, and classify structural ERC/protocol interfaces.
- [ ] `src/contracts/contractIntelligence.ts` combines bytecode fingerprints, decoded calldata, receipt `topic0` logs, and EIP-7928 BAL footprint metrics to classify contracts dynamically and enrich `TopContractRow` in `ETHEconomyDataManager`.
- [ ] `/contract [address | rank]` slash tool (and `/co` autocomplete + natural-language `IntentEngine` routing) opens the Contract Microscope in the Interaction View (`TableUIComponent` core view + `Ctrl+D` `DebugPageUIComponent` with raw selectors/opcodes/proxy slots).
- [ ] Unit tests (`test/contractIntelligence.spec.ts`) cover `localAbi` decoding, `PUSH4` extraction (verifying `PUSH32` data containing `0x63` is skipped), EIP-1167/1967/7702 detection, ERC-20/DEX/MEV behavioral classification, and `/contract` view rendering.
- [ ] `npm run tsc`, `npm test`, and `npm run spellcheck` pass in `@ethereumjs/ethy`.

---

## 4. Concrete Implementation Plan (Planner — Grok 4.7)

*(To be filled by Grok 4.7 during planning)*

---

## 5. Implementation Notes & Deviations (Implementer — Composer 2.5)

*(To be filled by Composer 2.5 during implementation)*
