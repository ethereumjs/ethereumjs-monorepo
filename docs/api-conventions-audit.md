# API Conventions Audit

Status: API surface audit. Constraint for any follow-up: **additive only** —
new canonical names may be added; legacy names get `@deprecated` JSDoc and keep working until a
future major. The "Decisions needed" section at the end is the actionable output; each line carries
a recommended additive resolution and an approval marker filled in during review.

## Method & scope

- **Active packages audited:** `binarytree, block, blockchain, common, e2store, ethash, evm, genesis,
  mpt, rlp, statemanager, tx, util, vm`. (`client`, `devp2p`, `wallet` are out of scope / deprecated.)
- **Export source:** no checked-in api-extractor `.api.md` reports exist on `master` yet (the
  API-surface tooling has not landed). The export list below was therefore derived directly from
  each package's `src/**` `export` statements (every `export {…}`, `export *` barrel target,
  `export function/const/class/enum/interface/type`). It is the full public surface, not a sample.
- **Caveat on a few false positives:** `util/src/errors.ts` contains a *commented-out* `UsageError` /
  `UsageErrorType` block; these appear in a naive grep but are **not** real exports (tracked under
  D-ERR-2). Likewise a handful of `tx`/`evm` "exports" (`serialize`, `sign`, `hash`,
  `trap`, `precompileNN`, …) are low-level helpers re-exported from `util/` subfolders — intentional
  but not part of the "shaped" object API.
- **Classification approach:** the 7 axes are about API *shape*. Construction / serialization /
  events / errors are classified per **class**; hex-bytes / options / async are classified per
  **function/option family** (a per-row table over ~1000 plain helper exports would be noise). Each
  package section lists its full export inventory, then the axis notes that apply to it.

---

## Per-package inventory

### binarytree
**Exports:** `BinaryNode, BinaryNodeOptions, BinaryNodeType, BinaryTree, BinaryTreeOpts, Checkpoint,
CheckpointDB, CheckpointDBOpts, ChildBinaryNode, InternalBinaryNode, NODE_WIDTH, ROOT_DB_KEY,
StemBinaryNode, TypedBinaryNode, binaryTreeFromProof, createBinaryTree, decodeBinaryNode,
decodeRawBinaryNode, dumpLeafValues, dumpNodeHashes, isInternalBinaryNode, isRawBinaryNode,
isStemBinaryNode, verifyBinaryProof`

- **Construction:** `createBinaryTree(opts)` (createX). `BinaryTree` constructor is implicitly public
  but `createBinaryTree` is the documented entry. Proof→tree built by **`binaryTreeFromProof`** —
  the only "from proof" constructor in the repo *not* prefixed `create` (cf. mpt `createMPTFromProof`). ⚠️ D-NAME-2
- **Serialization:** node classes expose `raw(): …` and `serialize(): Uint8Array` (RLP). Consistent.
- **Hex/bytes:** `decodeBinaryNode`/`decodeRawBinaryNode` mirror mpt's `decodeMPTNode`. Consistent.
- **Async:** tree ops return `Promise`; no sync/async name pairs. Consistent.
- **Events:** none. **Errors:** `EthereumJSErrorWithoutCode` / plain throws.

### block
**Exports:** `BeaconPayloadJSON, Block, BlockBodyBytes, BlockBytes, BlockData, BlockHeader,
BlockHeaderBytes, BlockOptions, CLIQUE_EXTRA_SEAL, CLIQUE_EXTRA_VANITY, ExecutionPayload, HeaderData,
JSONBlock, JSONHeader, JSONRPCBlock, TransactionsBytes, UncleHeadersBytes, WithdrawalV1,
WithdrawalsBytes, clique* (helpers), computeBlobGasPrice, createBlock, createBlockFromBeaconPayloadJSON,
createBlockFromBytesArray, createBlockFromExecutionPayload, createBlockFromJSONRPCProvider,
createBlockFromRLP, createBlockFromRPC, createBlockHeader, createBlockHeaderFromBytesArray,
createBlockHeaderFromRLP, createBlockHeaderFromRPC, createEmptyBlock, createSealedCliqueBlock,
createSealedCliqueBlockHeader, ethashCanonicalDifficulty, executionPayloadFromBeaconPayload,
fakeExponential, genRequestsRoot, genTransactionsTrieRoot, genWithdrawalsTrieRoot,
generateCliqueBlockExtraData, getDifficulty, getNumBlobs, numberToHex, paramsBlock, requireClique,
valuesArrayToHeaderData`

- **Construction:** `createBlock*` / `createBlockHeader*` (createX). Variants are uniform:
  `…FromRLP`, `…FromBytesArray`, `…FromRPC`, `…FromJSONRPCProvider`, `…FromBeaconPayloadJSON`,
  `…FromExecutionPayload`. Public constructors exist but createX is canonical. **Reference pattern.**
- **Serialization:** `Block`/`BlockHeader`: `raw(): BlockBytes|BlockHeaderBytes`,
  `serialize(): Uint8Array` (RLP), `toJSON(): JSONBlock|JSONHeader`. **Canonical triple.**
- **Hex/bytes:** consumes `PrefixedHexString`; local `numberToHex`. **Options:** `BlockOptions`
  with `common?: Common`, `setHardfork?`, `freeze?`, `skipConsensusFormatValidation?`. Canonical
  options shape.
- **Async:** static factories sync; consensus/validate paths async. **Events:** none.
  **Errors:** `EthereumJSErrorWithoutCode` / plain.

### blockchain
**Exports:** `Blockchain, BlockchainEvent, BlockchainInterface, BlockchainOptions, CLIQUE_* consts,
Cache, CacheMap, CasperConsensus, CliqueConsensus, Consensus, ConsensusDict, ConsensusOptions,
DBManager, DBOp, DBOpData, DBTarget, DatabaseKey, EthashConsensus, GenesisOptions, GetOpts,
MinimalEthashInterface, OnBlock, createBlockchain, createBlockchainFromBlocksData, genGenesisStateRoot,
getGenesisStateRoot`

- **Construction:** `createBlockchain(opts)`, `createBlockchainFromBlocksData(...)` (createX, async).
- **Serialization:** n/a (persistence via DB ops).
- **Async:** all I/O async (`putBlock`, `getBlock`, `getCanonicalHeadBlock`, …) returning `Promise`;
  no `Sync` suffixes. Consistent.
- **Events:** `events?: EventEmitter<BlockchainEvent>` is **optional in `BlockchainInterface`**
  (`types.ts`) but **always defined** on the `Blockchain` class (set in constructor). Event map
  `BlockchainEvent` exported. ⚠️ D-EVT-1
- **Errors:** `EthereumJSErrorWithoutCode` / plain.

### common
**Exports:** `Common, CommonEvent, CommonOpts, Chain, Hardfork, ConsensusAlgorithm, ConsensusType,
Mainnet/Sepolia/Holesky/Hoodi, ChainConfig, …Config/…Dict types, CreateCommonFromGethGenesisOpts,
GethGenesis*, StateManagerInterface, BinaryTreeAccessWitnessInterface, Proof, StorageDump/Range/Proof,
crc32, createCommonFromGethGenesis, createCustomCommon, eipsDict, getPresetChainConfig, hardforksDict,
parseGethGenesis, parseGethGenesisState` (+ shared interface/type hub)

- **Construction:** **`new Common(opts)` is the canonical/documented constructor** — outlier vs the
  repo-wide `createX` convention. Factory helpers exist for derived cases only
  (`createCustomCommon`, `createCommonFromGethGenesis`). No plain `createCommon`. ⚠️ D-NAME-3
- **Options:** `CommonOpts { chain, hardfork?, eips?, params?, customCrypto? }` — the reference for
  the `common`/`hardfork` vocabulary other packages reuse.
- **Events:** `events: EventEmitter<CommonEvent>` always defined (consistent with the target pattern).
  `CommonEvent` exported.
- **Errors:** `EthereumJSErrorWithoutCode` / plain. **Async:** mostly sync (config resolution).
- **Role note:** also the cross-package **interface hub** (`StateManagerInterface`,
  `BinaryTreeAccessWitnessInterface`).

### e2store
**Exports:** `CompressStream, UncompressStream, CompressStreamOptions, UncompressStreamOptions,
CommonTypes, E2HSTypes, Era1Types, EraTypes, EpochAccumulator, HeaderRecord, SlotIndex, DBKey,
DBTarget, VERSION, createBlockIndex, createBlockTuples, createCompressStream, createUncompressStream,
+ many read*/format*/parse*/get* helpers`

- **Construction:** `createCompressStream` / `createUncompressStream` / `createBlockIndex` /
  `createBlockTuples` (createX). Consistent. Stream classes have public constructors.
- **Hex/bytes:** `numberToHash`, `readBinaryFile` (top-level helper). **Async:** read/export async.
- **Events:** stream classes extend Node `Transform` (Node EventEmitter, not eventemitter3 — by
  design, they are streams). **Errors:** plain. Low-priority package.

### ethash
**Exports:** `Ethash, Miner, Solution, bytesReverse, fnv, fnvBytes, getCacheSize, getEpoc,
getFullSize, getSeed, params`

- **Construction:** `new Ethash(...)` / `new Miner(...)` public constructors; **no `createX`**.
  Low-priority/legacy-ish package; not flagged for harmonization.
- **Async:** `mine`/verify async. **Events/Errors:** none / plain.

### evm
**Exports (shaped subset):** `EVM, EVMError, EVMErrorType, EVMErrorTypeString, EVMEvent, EVMInterface,
EVMOpts, EVMResult, EVMRunCallOpts, EVMRunCodeOpts, ExecResult, Message, Interpreter, Journal, Memory,
Stack, TransientStorage, EOFContainer, Opcode, getActivePrecompiles, getOpcodesForHF, createEVM,
BinaryTreeAccessWitness, …` (+ a large surface of EIP/precompile/EOF constants and helpers:
`paramsEVM, precompile01…precompile100, BLS_* consts, create7928Gas, createEIP7708*Log,
createAddressFromStackBigInt, validateEOF, …`)

- **Construction:** `createEVM(opts)` (createX, async — resolves precompiles). `EVM` constructor
  public but createX canonical. Note ad-hoc top-level EIP files (`eip7708.ts`, `eip8037.ts`) export
  `create7928Gas`, `createEIP7708BurnLog`, `createEIP7708TransferLog` — createX-shaped but living
  outside a `constructors.ts` (an internal-structure concern, not an API-name issue).
- **Serialization:** EVM has no serialize; `Message.toJSON()`, `…toCreationAddress()`.
- **Events:** `events?: EventEmitter<EVMEvent>` **optional in `EVMInterface`** (`types.ts:182`) but
  `public readonly events` **always defined** on the `EVM` class (`evm.ts:203`). `EVMEvent` exported.
  ⚠️ D-EVT-1
- **Errors:** **`EVMError`** — its own class, **not** an `Error`, **not** an `EthereumJSError`, **no
  `code`**. Shape: `{ error: EVMErrorType, errorType: 'EVMError' }` + static `errorMessages` map.
  Constructed everywhere as `new EVMError(EVMError.errorMessages.X)`; compared via `err.error === …`.
  ⚠️ D-ERR-1

### genesis
**Exports:** `getGenesis, holeskyGenesis, hoodiGenesis, mainnetGenesis, sepoliaGenesis`

- **Construction:** `getGenesis(chainId)` — a **lookup**, correctly `getX` not `createX`. The
  `*Genesis` exports are large generated data constants ("data masquerading as code"). No API
  shape issues. **Events/Errors:** none.

### mpt
**Exports:** `MerklePatriciaTrie, BranchMPTNode, ExtensionMPTNode, LeafMPTNode,
ExtensionOrLeafMPTNodeBase, WalkController, CheckpointDB, MPTOpts, MPTOptsWithDefaults,
TrieShallowCopyOpts, Proof, Nibbles, Path, MPTNode, Raw*MPTNode, createMPT, createMPTFromProof,
createMerkleProof, decodeMPTNode, decodeRawMPTNode, updateMPTFromMerkleProof, verifyMPTWithMerkleProof,
verifyMerkleProof, verifyMerkleRangeProof, genesisMPTStateRoot, + nibble helpers`

- **Construction:** `createMPT(opts)`, **`createMPTFromProof(...)`** (createX) — the reference for the
  "build structure from proof" name binarytree should match. `WalkController` has a **private
  constructor** + static `newWalk` factory.
- **Serialization:** nodes expose `raw()` / `serialize(): Uint8Array`. Consistent.
- **Proof verbs:** `createMerkleProof` (build proof), `verifyMerkleProof`/`verifyMerkleRangeProof`
  (verify), `createMPTFromProof`/`updateMPTFromMerkleProof` (consume). Verb set is the model for
  binarytree (`verifyBinaryProof`, `binaryTreeFromProof`).
- **Async:** trie ops async, `Promise`-returning, no `Sync` suffixes. **Events:** none.

### rlp
**Exports:** `RLP, encode, decode, Decoded, Input, NestedUint8Array, utils, hexToBytes,
EthereumJSError, EthereumJSErrorWithoutCode, EthereumJSErrorMetaData, EthereumJSErrorObject,
DEFAULT_ERROR_CODE`

- **The error machinery lives here** (lowest dep), re-exported by `util`:
  `class EthereumJSError<T extends { code: string }> extends Error` with `type`, `getMetadata()`,
  `toObject()`; `EthereumJSErrorWithoutCode(message?, stack?)` factory (**already `@deprecated`** in
  favour of a coded `EthereumJSError`); `DEFAULT_ERROR_CODE`. This is the target shape for D-ERR-1.
- **API:** `RLP.encode/decode` namespace + free `encode`/`decode`. **Errors:** throws
  `EthereumJSError`. No events/async.

### statemanager
**Exports:** `MerkleStateManager, SimpleStateManager, RPCStateManager, StatefulBinaryTreeStateManager,
Caches, AccountCache, CodeCache, StorageCache, OriginalStorageCache, Cache, RPCBlockChain,
MerkleStateManagerOpts, SimpleStateManagerOpts, RPCStateManagerOpts,
StatefulBinaryTreeStateManagerOpts, CachesStateManagerOpts, CacheOpts, CacheType, Proof,
StorageProof, BinaryTreeState, EncodedBinaryTreeState, modifyAccountFields, get*Proof helpers,
verifyMerkleStateProof, …`

- **Construction:** **all four state managers use `new XStateManager(opts)`** — **no `createX`
  factories at all.** Second outlier vs the createX convention (after Common). ⚠️ D-NAME-4
- **Options:** each `…Opts` carries `common?`, `caches?`/`cacheSize?`. Consistent vocabulary.
- **Async:** the full `StateManagerInterface` is async (`getAccount`, `putCode`, `getStorage`,
  `checkpoint`/`commit`/`revert`, `getStateRoot`, …) → `Promise`; no `Sync` pairs. Consistent.
- **Events:** none. **Errors:** `EthereumJSErrorWithoutCode` / plain.

### tx
**Exports (shaped subset):** `LegacyTx, AccessList2930Tx, FeeMarket1559Tx, Blob4844Tx, EOACode7702Tx,
TransactionType, Capability, TransactionInterface, TypedTransaction, TypedTxData, TxOptions, TxData,
JSONTx, create* factories (per type + `createTx`, `createTxFromRLP`, `createTxFromRPC`,
`createTxFromJSONRPCProvider`, `createTxFromBlockBodyData`), is*Tx / is*TxData guards, params`

- **Construction:** per-type `createX` factories. Variants per type:
  `create<Type>Tx`, `create<Type>TxFromRLP`, `create<Type>TxFromBytesArray`. **The one break:**
  1559 has `createFeeMarket1559Tx` + `createFeeMarket1559TxFromRLP` but its bytes-array factory is
  **`create1559FeeMarketTxFromBytesArray`** (token order reversed; class is `FeeMarket1559Tx`).
  ⚠️ D-NAME-1. Tx classes have **public constructors** (`public constructor(txData, opts)`) — the one
  family that documents the raw constructor as usable; createX still recommended.
- **Serialization:** every tx type: `raw(): TxValuesArray`, `serialize(): Uint8Array` (typed-tx
  envelope), `toJSON(): JSONTx`, plus `toCreationAddress()`. **Canonical triple + `toCreationAddress`.**
- **Hex/bytes:** `PrefixedHexString` in JSON; guard family `isLegacyTx`, `isBlob4844Tx`, … (canonical
  `isX` guards). **Options:** `TxOptions { common?, freeze?, allowUnlimitedInitCodeSize? }`.
- **Async:** construction/sign sync; KZG paths async where needed. **Events:** none.
  **Errors:** `EthereumJSErrorWithoutCode` (`errorMsg`/`getSharedErrorPostfix` helpers) / plain.

### util
**Exports (shaped subset):** classes `Account, Address, Withdrawal, CLRequest, BlockLevelAccessList,
Units, Lock, MapDB, PrioritizedTaskExecutor`; error re-exports from rlp; `create*` factories
(`createAccount(+FromRLP/+FromBytesArray)`, `createAddressFrom*`, `createWithdrawal(+FromBytesArray)`,
`createCLRequest`, `createContractAddress(+2)`, `createPartialAccount(+FromRLP)`, `createZeroAddress`,
`createBlockLevelAccessList(+FromJSON/+FromRLP)`); the **bytes/hex converter family**; signature, kzg,
account-body, binary-tree-key helpers; `BIGINT_*`/`KECCAK256_*`/`MAX_*` constants.

- **Construction:** `createX` factories throughout. `Account`/`Address`/`Withdrawal` also have public
  constructors; createX canonical.
- **Serialization — the inconsistency spread lives here:**
  - `Account`: `raw(): Uint8Array[]`, `serialize(): Uint8Array`. ✅ canonical.
  - `BlockLevelAccessList`: `raw()`, `serialize()`, `toJSON()`. ✅ canonical.
  - `Withdrawal`: `raw()`, `toJSON()`, **and `toValue()`** (returns a `{bigint|bytes}` object) — a
    one-off verb not used by any other class. ⚠️ D-SER-1 (low priority; distinct semantics from
    `toJSON`).
  - `Address`: **`toBytes(): Uint8Array`** (returns the raw 20-byte address) — `toBytes` here means
    "the address bytes", **not** RLP serialization. Different concept from `serialize()`; acceptable
    but worth a doc note so `toBytes` vs `serialize` isn't read as synonyms. ⚠️ D-SER-2 (doc only).
  - `Withdrawal` also has free fn `withdrawalToBytesArray`.
- **Hex/bytes — the reference family (consistent `xToY`):** `bytesToHex` (→ `PrefixedHexString`,
  0x-prefixed), `hexToBytes`, `bytesToUnprefixedHex` / `unprefixedHexToBytes` (no 0x), `bytesToBigInt`,
  `bigIntToBytes`, `bigIntToHex`, `intToBytes`/`bytesToInt`, `intToHex`, `toBytes` (catch-all),
  `bigIntToUnpaddedBytes`/`intToUnpaddedBytes`. 0x-prefix rule encoded in the name (`unprefixed`).
  **This is the convention other packages should be measured against.**
- **Errors:** `class UsageError` / `enum UsageErrorType` are **commented out** in `errors.ts`
  (dead). The only live error surface is the rlp re-exports. ⚠️ D-ERR-2.
- **Events:** none. **Async:** provider/db helpers async.

### vm
**Exports:** `VM, VMOpts, VMEvent, VMProfilerOpts, EVMProfilerOpts, BlockBuilder, BuildBlockOpts,
BuilderOpts, BuildStatus, Bloom, RunBlockOpts, RunBlockResult, RunTxOpts, RunTxResult, SealBlockOpts,
TxReceipt (+ Pre/PostByzantium, EIP4844Blob, BaseTxReceipt), AfterBlockEvent, AfterTxEvent,
ApplyBlockResult, buildBlock, createVM, runBlock, runTx, encodeReceipt, accumulate* helpers,
consumeBal, paramsVM, …`

- **Construction:** `createVM(opts)` (createX, async). `VM` constructor public, createX canonical.
  `buildBlock(...)` returns a `BlockBuilder`.
- **Async:** `runBlock`/`runTx`/`buildBlock` async. **Serialization:** `encodeReceipt` free fn.
- **Events:** `readonly events: EventEmitter<VMEvent>` **always defined** on `VM` (no optional-typed
  interface variant). `VMEvent` exported. ✅ already matches target.
- **Errors:** `EthereumJSErrorWithoutCode` / plain.

---

## Cross-package synthesis (per axis)

1. **Construction.** `createX()` factories are the established convention and are uniform in
   block, tx, blockchain, mpt, binarytree, evm, vm, util, e2store. **Outliers that use only
   `new X()`:** `common` (D-NAME-3) and `statemanager` (D-NAME-4). `ethash`/`genesis` are
   intentionally exempt (legacy / data-lookup). Public constructors generally coexist with createX;
   only `mpt.WalkController` and `blockchain.DBOp` truly hide theirs (private constructor + static
   factory).
2. **Serialization.** Canonical triple **`raw()` (decoded values) / `serialize()` (RLP `Uint8Array`)
   / `toJSON()` (JSON, hex strings)** holds in block, tx, mpt, binarytree, util(`Account`,
   `BlockLevelAccessList`). Deviations: `Withdrawal.toValue()` (D-SER-1) and `Address.toBytes()`
   meaning "address bytes" not RLP (D-SER-2).
3. **Hex/bytes.** `util` defines the canonical `xToY` converters; 0x-prefix expectation is encoded in
   the name (`bytesToHex` is prefixed, `bytesToUnprefixedHex` is not). All packages consume
   `PrefixedHexString` for 0x-strings and `Uint8Array` for bytes. **No inconsistency found.**
4. **Options.** Options-object pattern is universal for constructors/run-methods (positional args
   only for tiny leaf helpers). The shared vocabulary — `common?: Common`, `hardfork?`,
   `setHardfork?: boolean`, `freeze?: boolean`, `cacheSize?: number` — is used consistently; the
   only variation (`common` required vs optional) is genuinely contextual. **No rename needed.**
5. **Async.** Async methods are plain-named and return `Promise`; there are **no `Sync`/`Async`
   suffixed pairs** anywhere, so there is nothing to disambiguate. **Consistent by construction.**
6. **Events.** `eventemitter3` with typed event maps in `common`, `blockchain`, `evm`, `vm`. Event
   maps exported from each package (`CommonEvent`, `BlockchainEvent`, `EVMEvent`, `VMEvent`).
   **Inconsistency:** `events` is typed **optional** (`events?:`) in `EVMInterface` and
   `BlockchainInterface` but is **always defined at runtime** on the concrete classes; `common`/`vm`
   already type it as always-defined. (D-EVT-1.)
7. **Errors.** Two regimes: (a) the `EthereumJSError`/`EthereumJSErrorWithoutCode` machinery (rlp →
   util re-export) used by most packages — but predominantly via the **already-`@deprecated`**
   codeless `EthereumJSErrorWithoutCode`; (b) **`evm`'s `EVMError`**, a parallel non-`Error` class
   with no `code` and no shared shape. Plus dead commented `UsageError` machinery in util. (D-ERR-1,
   D-ERR-2.)

---

## Decisions needed

Markers: ✅ approved · ⏭️ deferred-to-major · 💤 no-op/doc-only.
"Additive migration" = exactly what the implementation adds; nothing existing is renamed or removed.

| ID | Inconsistency | Recommended resolution (additive) | Status |
|----|---------------|-----------------------------------|--------|
| **D-NAME-1** | `tx`: bytes-array factory is `create1559FeeMarketTxFromBytesArray`, breaking the `FeeMarket1559` token order used by its siblings and the `FeeMarket1559Tx` class. | Add `createFeeMarket1559TxFromBytesArray` as a one-line re-export/wrapper delegating to the existing impl; mark `create1559FeeMarketTxFromBytesArray` `@deprecated Use {@link createFeeMarket1559TxFromBytesArray}`. | ✅ |
| **D-NAME-2** | `binarytree`: proof→tree constructor is `binaryTreeFromProof`, the only "from proof" builder not prefixed `create` (cf. mpt `createMPTFromProof`). | Add `createBinaryTreeFromProof` wrapper; `@deprecate` `binaryTreeFromProof`. | ✅ |
| **D-NAME-3** | `common`: constructed via `new Common(opts)` only — no createX factory, unlike the rest of the monorepo. | Add `createCommon(opts)` factory delegating to `new Common(opts)`. Do **not** deprecate the constructor (still supported); document `createCommon` as the convention-aligned form. | ✅ |
| **D-NAME-4** | `statemanager`: all four managers use `new XStateManager(opts)` with no createX factories. | Add `createMerkleStateManager`, `createSimpleStateManager`, `createRPCStateManager`, `createStatefulBinaryTreeStateManager` factories delegating to the constructors. Constructors stay public/undeprecated. | ✅ |
| **D-SER-1** | `util`: `Withdrawal.toValue()` is a one-off serializer verb. | Distinct semantics from `toJSON` (typed object vs hex JSON). Leave as-is; not worth an alias. | 💤 |
| **D-SER-2** | `util`: `Address.toBytes()` reads like RLP `serialize()` but returns the raw address bytes. | Doc-only clarification in JSDoc; no rename (would collide with the `serialize` meaning). | 💤 |
| **D-EVT-1** | `events` typed optional in `EVMInterface`/`BlockchainInterface` but always defined at runtime. | Keep optional typing (compat); guarantee + document always-defined runtime; ensure event-map types exported from every `types.ts`. Runtime already always-defines. | ✅ |
| **D-ERR-1** | `evm.EVMError` is a parallel error class: not an `Error`, not an `EthereumJSError`, no `code`. | **Additive, no reparenting** (reparenting would break `instanceof EVMError` downstream): add a `readonly code: string` to `EVMError` + an `EVMErrorCode` map; introduce a shared structural interface `EthereumJSErrorLike { readonly code: string }` (in rlp, re-exported via util) that both `EVMError` and `EthereumJSError` conform to (add a `code` getter to `EthereumJSError` returning `type.code`). Document the taxonomy in DEVELOPER.md. | ✅ |
| **D-ERR-2** | `util/src/errors.ts` carries dead commented-out `UsageError`/`UsageErrorType` machinery. | Delete the dead comment; replace with the live `EthereumJSErrorLike` re-export + a pointer to the DEVELOPER.md taxonomy. | ✅ |
| **D-ERR-3** | Most packages throw the already-`@deprecated` codeless `EthereumJSErrorWithoutCode`. | Migrating every throw site to coded `EthereumJSError` is a large per-package effort with semantic choices per call — out of scope for an additive consistency pass. | ⏭️ |
| **D-CTOR-1** | `ethash` uses `new X()` with no createX; `genesis` exposes data + `getGenesis` lookup. | Intentionally exempt (low-priority/legacy package; data-lookup is correctly `getX`). | 💤 |

### Kill-criteria check
No approved item requires a non-additive change: every ✅ adds a new export (factory/field/interface)
or JSDoc/runtime-doc only; no existing export is renamed, removed, or has its signature narrowed.
D-ERR-3 is the one genuinely non-additive-in-spirit item and is deferred-to-major.
