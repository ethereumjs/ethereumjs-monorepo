# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
(modification: no type change headlines) and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 5.3.2 - 2021-04-12

This is a hot-fix performance release, removing the `debug` functionality from PR [#1080](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1080) and follow-up PRs. While highly useful for debugging, this feature side-introduced a siginficant reduction in VM performance which went along unnoticed. For now we will remove since upstream dependencies are awaiting a new release before the `Belin` HF happening. We will try to re-introduce in a performance friendly manner in some subsequent release (we cannot promise on that though).

See PR [#1198](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1198).

## 5.3.1 - 2021-04-09

**Features**

- Added `receipt` to `RunTxResult`, moved the tx receipt generation logic from `VM.runBlock()` to `VM.runTx()` (`generateTxReceipt()` and receipt exports in `runBlock` are now marked as *deprecated*), PR [#1185](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1185)

**Bug Fixes**

- Fixed BlockBuilder (see `v5.3.0` release) to allow building a block with zero txs, PR [#1185](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1185)
- BlockBuilder: Moves the `stateManager.commit` to after putting the block in blockchain in case it throws on validating, PR [#1185](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1185)

**Testing**

- Added test cases for legacy and access list transactions to `VM.runBlock()` tests, PR [#1185](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1185)
- Added type safety test (thanks to @alcuadrado from Hardhat for this code magic piece ❤️), PR [#1185](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1185)

## 5.3.0 - 2021-03-31

### EIP-2930 Tx Access List Generation

This release adds the ability to generate access lists from tx runs with `VM.runTx()`, see PR [#1170](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1170). There is a new option `reportAccessList` which can be used on all tx types to generate an access list as defined by [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930) which is then returned along the `VM.runTx()` result adhering to the `@ethereumjs/tx` `AccessList` TypeScript type definition.

Note that this functionality needs the new `StateManager.generateAccessList()` function which is not yet part of the `StateManager` interface for compatibility reasons. If you implement an own `StateManager` make sure that this function is present (e.g. by inheriting your `StateManager` from the `DefaultStateManager` implementation).

Another note: there is an edge case on accessList generation where an internal call might revert without an accessList but pass if the accessList is used for a tx run (so the subsequent behavior might change). This edge case is not covered by this implementation.

### New Block Builder

There is a new Block Builder API for creating new blocks on top of the current state by adding transactions one at a time, see PR [#1158](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1158).

It can be used like the following:

```typescript
const blockBuilder = await vm.buildBlock({ parentBlock, blockData, blockOpts })
const txResult = await blockBuilder.addTransaction(tx)
// reset the state with `blockBuilder.revert()`
const block = await blockBuilder.build()
```

When the block is built it becomes fully executed in the vm and its blockchain.

### Other Changes

- Fixed `VM.runBlock()` with `generate: true` by setting the header fields for `gasUsed`, `logsBloom`, `receiptTrie`, and `transactionsTrie`, PR [#1158](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1158)
- Fixed a bug in `VM.runTx()` with `reportAccessList=true`returning addresses without a `0x` prefix, PR [#1183](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1183)
- Do not include the tx sender address in the access list in `VM.runTx()` with `reportAccessList=true`, only include the `to` address if storage slots have been touched, PR [#1183](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1183)

## 5.2.0 - 2021-03-18

### Berlin HF Support

This release is the first VM release with official `berlin` HF support. All `EthereumJS` dependencies are updated with `berlin` enabling versions and support for all EIPs which finally made it into `berlin` has been added, namely:

- [EIP-2565](https://eips.ethereum.org/EIPS/eip-2565): ModExp gas cost
- [EIP-2718](https://eips.ethereum.org/EIPS/eip-2718): Typed transactions
- [EIP-2929](https://eips.ethereum.org/EIPS/eip-2929): Gas cost increases for state access opcodes
- [EIP-2930](https://eips.ethereum.org/EIPS/eip-2930): Optional Access Lists Typed Transactions

Please note that the default HF is still set to `istanbul`. You therefore need to explicitly set the `hardfork` parameter for instantiating a `VM` instance with a `berlin` HF activated:

```typescript
import VM from '@ethereumjs/vm'
import Common from '@ethereumjs/common'
const common = new Common({ chain: 'mainnet', hardfork: 'berlin' })
const vm = new VM({ common })
```

There is a relatively broad set of changes since the last VM version `v5.1.0` introducing support for a first set of to-be-expected `berlin` EIPs, here is a summary:

#### Added Typed Transaction Support (EIP-2718 / EIP-2930)

The VM is now prepared to work with Typed Transactions ([EIP2718](https://eips.ethereum.org/EIPS/eip-2718)) which have been introduced along the `@ethereumjs/tx` `v3.1.0` release. It now therefore gets possible to pass typed txs to `VM.runTx()` respectively a block containing typed txs to `VM.runBlock()`, see PR [#1048](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1048) and PR [#1138](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1138).

There is a first concrete tx type 1 including optional access lists added along the `berlin` HF ([EIP2930](https://eips.ethereum.org/EIPS/eip-2930)). Access lists are now properly detected by the VM and gas costs calculated accordingly.

#### Fixed EIP-2929 Implementation

Our implementation of `EIP-2929` (gas cost increases for state access opcodes) was falling short in the form that warm storage slots / addresses were only tracked per internal message, not on the entire transaction as implied by the EIP. This needed a relatively intense rework along PR [#1124](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1124). We are now confident in the implementation and official tests are passing.

Along with this rework a new `StateManager` interface `EIP2929StateManager` has been introduced which inherits from `StateManager` and adds the following methods:

```typescript
export interface EIP2929StateManager extends StateManager {
  addWarmedAddress(address: Buffer): void
  isWarmedAddress(address: Buffer): boolean
  addWarmedStorage(address: Buffer, slot: Buffer): void
  isWarmedStorage(address: Buffer, slot: Buffer): boolean
  clearWarmedAccounts(): void
}
```

The `StateManager` base interface and the inherited `EIP2929StateManager` interface will be merged again on the next breaking release.

#### Removed EIP-2315 from Berlin

`EIP-2315` has been removed from the list of EIPs included in `berlin`. This is ensured by using a `Common` dependency version `v2.2.0`+ containing the final list of `Berlin` EIPs and also needed some changes in the VM code, see PR [#1142](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1142).

#### EthereumJS Libraries - Typed Transactions Readiness

If you are using this library in conjunction with other EthereumJS libraries make sure to minimally have the following library versions installed for typed transaction support:

- `@ethereumjs/common` `v2.2.0`
- `@ethereumjs/tx` `v3.1.0`
- `@ethereumjs/block` `v3.2.0`
- `@ethereumjs/blockchain` `v5.2.0`
- `@ethereumjs/vm` `v5.2.0`

### Other Features

- `{ stateRoot, gasUsed, logsBloom, receiptRoot }` have been added to `RunBlockResult` and will be emitted with `afterBlock`, PR [#853](https://github.com/ethereumjs/ethereumjs-monorepo/pull/853)
- Added `vm:eei:gas` EEI gas debug looger, PR [#1124](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1124)

### Other Fixes

- Fixes VM Node 10 support being broken due to the usage of `globalThis` for browser detection, PR [#1151](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1151)
- Fixed `ECRECOVER` precompile to work correctly on networks with very large chain IDs, PR [#1139](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1139)

**CI and Test Improvements**

- Benchmark improvements and fixes, PR [#853](https://github.com/ethereumjs/ethereumjs-monorepo/pull/853)

### 5.1.0 - 2021-02-22

### Clique/PoA Support

This release introduces Clique/PoA support, see the main PR [#1032](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1032) as well as the follow-up PRs [#1074](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1074) and PR [#1088](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1088). This means that you now can run a VM with blocks or transactions from the main PoA networks `Goerli` and `Rinkeby` and generally can use the VM in a Clique/PoA context.

Here is a simple example:

```typescript
import VM from '@ethereumjs/vm'
import Common from '@ethereumjs/common'

const common = new Common({ chain: 'goerli' })
const hardforkByBlockNumber = true
const vm = new VM({ common, hardforkByBlockNumber })

const serialized = Buffer.from('f901f7a06bfee7294bf4457...', 'hex')
const block = Block.fromRLPSerializedBlock(serialized, { hardforkByBlockNumber })
const result = await vm.runBlock(block)
```

All the corresponding internal dependencies have been updated to Clique/PoA supporting versions, namely:

- @ethereumjs/block -> `v3.1.0`
- @ethereumjs/blockchain -> `v5.1.0`
- @ethereumjs/common" -> `v2.1.0`

Note that you need to also use library versions equal or higher than the ones mentioned above when you pass in an instance from one of the libraries to an API call (e.g. `VM.runBlock()`, see example above) to ensure everything is working properly in a Clique/PoA context.

New VM behavior in a Clique/PoA context:

- `VM.runBlock()`: If you do block validation along block runs blocks are now validated to comply with the various Clique/PoA block format specifications (various `extraData` checks e.g.)
- `VM.runBlock()`: There is no assignment of block rewards to the `coinbase` account taking place
- `VM.runTx()`: Tx fees are attributed to the block signer instead of the `coinbase` account
- `COINBASE` opcode: The `COINBASE` opcode returns the block signer instead of the `coinbase` address (Clique specification)

### StateManager Checkpointing Performance

This is the first release which reliably exposes performance gains on all checkpointing operations by integrating the respective `merkle-patricia-trie` [v4.1.0](https://github.com/ethereumjs/ethereumjs-monorepo/releases/tag/merkle-patricia-tree%404.1.0) where the checkpointing mechanism has been reworked substantially.

This leads to linearly growing performance gains on all checkpointing operations (in `VM.runBlock()`, `VM.runTx()` as well as along all `message` calls) along with the size of the trie (state) being operated upon. In practice we have seen 10-50x increases when working on blocks from `mainnet` or the other test networks.

We would be happy on some feedback if this integration is noticeable in your execution context! 😀

### New EIPs

#### EIP-2565: ModExp precompile gas cost

This release adds support for [EIP 2565](https://eips.ethereum.org/EIPS/eip-2565), ModExp precompile gas cost, which is planned to be included in the Berlin hardfork, see PR [#1026](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1026).

#### VM Debug Logger

The VM now comes with an integrated debug logger which gives you fine-grained control to display selected log output along the VM execution flow, see PR [#1080](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1080). These loggers use the [debug](https://github.com/visionmedia/debug) library and can be activated on the CL with `DEBUG=[Logger Selection] node [Your Script to Run].js` and produce output like the following:

![EthereumJS VM Debug Logger](./debug.png?raw=true)

For an overview on the different loggers available see the respective [README section](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/vm#understanding-the-vm).

### Other Features

- The `afterBlock` (`VM.runBlock()`) and `afterTx` (`VM.runTx()`) events now expose the respective block or transaction in the event results, PR [#965](https://github.com/ethereumjs/ethereumjs-monorepo/pull/965)
- New `hardforkByBlockNumber` VM constructor option for `VM.runBlock()` runs (see also corresponding `Block` option), PR [#966](https://github.com/ethereumjs/ethereumjs-monorepo/pull/966) and [#967](https://github.com/ethereumjs/ethereumjs-monorepo/pull/967) (option renamed along release PR)
- Added new optional `maxBlocks` option to `VM.runBlockchain()`, PR [#1025](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1025)
- `VM.runBlockchain()` now returns the number of actual blocks run (needs `Blockchain` `v5.1.0` or higher, `void` kept in `TypeScript` function signature for backwards-compatibility), PR [#1065](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1065)
- New option `skipBlockGasLimitValidation` to disable the block gas limit check in `VM.runTx()`, PR [#1039](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1039)
- Added type definition `Log` for logs in `TxReceipt` items returned (result of `VM.runBlocks()` and `afterBlock` event), PR [#1084](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1084)

### Bug Fixes

- **Consensus**: fixed `Frontier` consensus bug along `CREATE` with not enough gas, PR [#1081](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1081)
- Update opcodes along HF switches, added a dedicated `tangerineWhistle` opcode list (no need for calls to `VM._updateOpcodes()` on HF switches manually any more), PR [#1101](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1101) and [#1112](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1112)
- Use `common` from VM when creating default blocks in `VM.runCall()` and `VM.runCode()`, PR [#1011](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1011)
- Fixed a bug when the result of the `MODEXP` opcode is 0, PR [#1026](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1026)

### Maintenance

- Updated `run-solidity-contract` example, PR [#1104](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1104)
- Updated `ethereum/tests` submodule to `1fcd4e5` (2021-02-02), PR [#1116](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1116)
- Only expose API method on docs, PR [#1119](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1119)

## 5.0.0 - 2020-11-24

### New Package Name

**Attention!** This new version is part of a series of EthereumJS releases all moving to a new scoped package name format. In this case the library is renamed as follows:

- `ethereumjs-vm` -> `@ethereumjs/vm`

Please update your library references accordingly or install with:

```shell
npm i @ethereumjs/vm
```

### Support for all current Hardforks / HF API Changes

This is the first release of the VM which supports all hardforks currently applied on mainnet starting with the support of the Frontier HF rules all along up to MuirGlacier. 🎉

The following HFs have been added:

- **Spurious Dragon**, PR [#791](https://github.com/ethereumjs/ethereumjs-monorepo/pull/791)
- **Tangerine Whistle**, PR [#807](https://github.com/ethereumjs/ethereumjs-monorepo/pull/807)
- **DAO**, PR [#843](https://github.com/ethereumjs/ethereumjs-monorepo/pull/843)
- **Homestead**, PR [#815](https://github.com/ethereumjs/ethereumjs-monorepo/pull/815)
- **Frontier**, PR [#828](https://github.com/ethereumjs/ethereumjs-monorepo/pull/828)

A VM with the specific HF rules (on the chain provided) can be instantiated by passing in a `Common` instance:

```typescript
import VM from '@ethereumjs/vm'
import Common from '@ethereumjs/common'

const common = new Common({ chain: 'mainnet', hardfork: 'spuriousDragon' })
const vm = new VM({ common })
```

**Breaking**: The default HF from the VM has been updated from `petersburg` to `istanbul`. The HF setting is now automatically taken from the HF set for `Common.DEAULT_HARDFORK`, see PR [#906](https://github.com/ethereumjs/ethereumjs-monorepo/pull/906).

**Breaking**: Please note that the options to directly pass in `chain` and `hardfork` strings have been removed to simplify the API. Providing a `Common` instance is now the only way to change the chain setup, see PR [#863](https://github.com/ethereumjs/ethereumjs-monorepo/pull/863)

### Berlin HF Support / HF-independent EIPs

This releases adds support for subroutines (`EIP-2315`) which gets activated under the `berlin` HF setting which can now be used as a `hardfork` instantiation option, see PR [#754](https://github.com/ethereumjs/ethereumjs-monorepo/pull/754).

**Attention!** Berlin HF support is still considered experimental and implementations can change on non-major VM releases!

Support for BLS12-381 precompiles (`EIP-2537`) is added as an independent EIP implementation - see PR [#785](https://github.com/ethereumjs/ethereumjs-monorepo/pull/785) - since there is still an ongoing discussion on taking this EIP in for Berlin or using a more generalized approach on curve computation with the Ethereum EVM (`evm384` by the eWASM team).

Another new EIP added is the `EIP-2929` with gas cost increases for state access opcodes, see PR [#889](https://github.com/ethereumjs/ethereumjs-monorepo/pull/889).

These integrations come along with an API addition to the VM to support the activation of specific EIPs, see PR [#856](https://github.com/ethereumjs/ethereumjs-monorepo/pull/856), PR [#869](https://github.com/ethereumjs/ethereumjs-monorepo/pull/869) and PR [#872](https://github.com/ethereumjs/ethereumjs-monorepo/pull/872).

This API can be used as follows:

```typescript
import Common from '@ethereumjs/common'
import VM from '@ethereumjs/vm'

const common = new Common({ chain: 'mainnet', eips: [2537] })
const vm = new VM({ common })
```

### API Change: New Major Library Versions

The following `EthereumJS` libraries which are used within the VM internally and can be passed in on instantiation have been updated to new major versions.

- `merkle-patricia-tree` `v3` (VM option `state`) -> `merkle-patricia-tree` `v4`, PR [#787](https://github.com/ethereumjs/ethereumjs-monorepo/pull/787)
- `ethereumjs-blockchain` `v4`-> `@ethereumjs/blockchain` `v5`, PR [#833](https://github.com/ethereumjs/ethereumjs-monorepo/pull/833)
- `ethereumjs-common` `v1` -> `@ethereumjs/common` `v2`

**Breaking**: If you pass in instances of these libraries to the VM please make sure to update these library versions as stated. Please also take a note on the package name changes!

All these libraries are now written in `TypeScript` and use promises instead of callbacks for accessing their APIs.

### New StateManager Interface / StateManager API Changes

There is now a new `TypeScript` interface for the `StateManager`, see PR [#763](https://github.com/ethereumjs/ethereumjs-monorepo/pull/763). If you are
using a custom `StateManager` you can use this interface to get better assurance that you are using a `StateManager` which conforms with the current `StateManager` API and will run in the VM without problems.

The integration of this new interface is highly encouraged since this release also comes with `StateManager` API changes. Usage of the old
[ethereumjs-account](https://github.com/ethereumjs/ethereumjs-account) package (this package will be retired) has been replaced by the new
[Account class](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/modules/_account_.md) from the `ethereumjs-util` package. This affects all `Account` related `StateManager` methods, see PR [#911](https://github.com/ethereumjs/ethereumjs-monorepo/pull/911).

The Util package also introduces a new  [Address class](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/modules/_address_.md). This class replaces all current `Buffer` inputs on `StateManager` methods representing an address.

### Dual ES5 and ES2017 Builds

We significantly updated our internal tool and CI setup along the work on PR [#913](https://github.com/ethereumjs/ethereumjs-monorepo/pull/913) with an update to `ESLint` from `TSLint` for code linting and formatting and the introduction of a new build setup.

Packages now target `ES2017` for Node.js builds (the `main` entrypoint from `package.json`) and introduce a separate `ES5` build distributed along using the `browser` directive as an entrypoint, see PR [#921](https://github.com/ethereumjs/ethereumjs-monorepo/pull/921). This will result in performance benefits for Node.js consumers, see [here](https://github.com/ethereumjs/merkle-patricia-tree/pull/117) for a releated discussion.

### Other Changes

**Changes and Refactoring**

- Group opcodes based upon hardfork, PR [#798](https://github.com/ethereumjs/ethereumjs-monorepo/pull/798)
- Split opcodes logic into codes, fns, and utils files, PR [#896](https://github.com/ethereumjs/ethereumjs-monorepo/pull/896)
- Group precompiles based upon hardfork, PR [#783](https://github.com/ethereumjs/ethereumjs-monorepo/pull/783)
- **Breaking:** the `step` event now emits an `ethereumjs-util` [Account](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/modules/_account_.md) object instead of an [ethereumjs-account](https://github.com/ethereumjs/ethereumjs-account)
(package retired) object
- **Breaking:** `NewContractEvent` now emits an `address` of type `Address` (see `ethereumjs-util`) instead of a `Buffer`, PR [#919](https://github.com/ethereumjs/ethereumjs-monorepo/pull/919)
- **Breaking:** `EVMResult` now returns a `createdAddress` of type `Address` (see `ethereumjs-util`) instead of a `Buffer`, PR [#919](https://github.com/ethereumjs/ethereumjs-monorepo/pull/919)
- **Breaking:** `RunTxResult` now returns a `createdAddress` of type `Address` (see `ethereumjs-util`) instead of a `Buffer`, PR [#919](https://github.com/ethereumjs/ethereumjs-monorepo/pull/919)
- **Breaking:** `RunCallOpts` now expects `origin`, `caller` and `to` inputs to be of type `Address` (see `ethereumjs-util`) instead of a `Buffer`, PR [#919](https://github.com/ethereumjs/ethereumjs-monorepo/pull/919)
- **Breaking:** `RunCodeOpts` now expects `origin`, `caller` and `address` inputs to be of type `Address` (see `ethereumjs-util`) instead of a `Buffer`, PR [#919](https://github.com/ethereumjs/ethereumjs-monorepo/pull/919)
- Visibility cleanup (Renaming and/or code docs additions) for class members not being part of the API, PR [#925](https://github.com/ethereumjs/ethereumjs-monorepo/pull/925)
- Make `memory.ts` use Buffers instead of Arrays, PR [#850](https://github.com/ethereumjs/ethereumjs-monorepo/pull/850)
- Use `Map` for `OpcodeList` and `opcode` handlers, PR [#852](https://github.com/ethereumjs/ethereumjs-monorepo/pull/852)
- Compare buffers directly, PR [#851](https://github.com/ethereumjs/ethereumjs-monorepo/pull/851)
- Moved gas base fees from VM to Common, PR [#806](https://github.com/ethereumjs/ethereumjs-monorepo/pull/806)
- Return precompiles on `getPrecompile()` based on hardfork, PR [#783](https://github.com/ethereumjs/ethereumjs-monorepo/pull/783)
- Removed `async` dependency, PR [#779](https://github.com/ethereumjs/ethereumjs-monorepo/pull/779)
- Updated `ethereumjs-util` to v7, PR [#748](https://github.com/ethereumjs/ethereumjs-monorepo/pull/748)

**CI and Test Improvements**

- New benchmarking tool for the VM, CI integration on GitHub actions, PR [#794](https://github.com/ethereumjs/ethereumjs-monorepo/pull/794) and PR [#830](https://github.com/ethereumjs/ethereumjs-monorepo/pull/830)
- Various updates, fixes and refactoring work on the test runner, PR [#752](https://github.com/ethereumjs/ethereumjs-monorepo/pull/752) and PR [#849](https://github.com/ethereumjs/ethereumjs-monorepo/pull/849)
- Integrated `ethereumjs-testing` code logic into VM for more flexible future test load optimizations, PR [#808](https://github.com/ethereumjs/ethereumjs-monorepo/pull/808)
- Transition VM tests to TypeScript, PR [#881](https://github.com/ethereumjs/ethereumjs-monorepo/pull/881) and PR [#882](https://github.com/ethereumjs/ethereumjs-monorepo/pull/882)
- On-demand state and blockchain test runs for all hardforks triggered by PR label, PR [#951](https://github.com/ethereumjs/ethereumjs-monorepo/pull/951) 
- Dropped `ethereumjs-testing` dev dependency, PR [#953](https://github.com/ethereumjs/ethereumjs-monorepo/pull/953)

**Bug Fixes**

- Fix `activatePrecompiles`, PR [#797](https://github.com/ethereumjs/ethereumjs-monorepo/pull/797)
- Strip zeros when putting contract storage in StateManager, PR [#880](https://github.com/ethereumjs/ethereumjs-monorepo/pull/880)
- Two bug fixes along `istanbul` `SSTORE` gas calculation, PR [#870](https://github.com/ethereumjs/ethereumjs-monorepo/pull/870)
- Security fixes by `mcl-wasm` package dependency update, PR [#955](https://github.com/ethereumjs/ethereumjs-monorepo/pull/955)

## 5.0.0-rc.1 - 2020-11-19

This is the first release candidate towards a final library release, see [beta.2](https://github.com/ethereumjs/ethereumjs-monorepo/releases/tag/%40ethereumjs%2Fvm%405.0.0-beta.2) and especially [beta.1](https://github.com/ethereumjs/ethereumjs-monorepo/releases/tag/%40ethereumjs%2Fvm%405.0.0-beta.1) release notes for an overview on the full changes since the last publicly released version.

- Security fixes by `mcl-wasm` package dependency update, PR [#955](https://github.com/ethereumjs/ethereumjs-monorepo/pull/955)
- On-demand state and blockchain test runs for all hardforks triggered by PR label, PR [#951](https://github.com/ethereumjs/ethereumjs-monorepo/pull/951) 
- Dropped `ethereumjs-testing` dev dependency, PR [#953](https://github.com/ethereumjs/ethereumjs-monorepo/pull/953)

## 5.0.0-beta.2 - 2020-11-12

This is the second beta release towards a final library release, see [beta.1 release notes](https://github.com/ethereumjs/ethereumjs-monorepo/releases/tag/%40ethereumjs%2Fvm%405.0.0-beta.1) for an overview on the full changes since the last publicly released version.

- Fixed `SSTORE` gas calculation on `constantinople`, PR [#931](https://github.com/ethereumjs/ethereumjs-monorepo/pull/931)
- Visibility cleanup (Renaming and/or code docs additions) for class members not being part of the API, PR [#925](https://github.com/ethereumjs/ethereumjs-monorepo/pull/925)

## 5.0.0-beta.1 - 2020-10-22

### New Package Name

**Attention!** This new version is part of a series of EthereumJS releases all moving to a new scoped package name format. In this case the library is renamed as follows:

- `ethereumjs-monorepo` -> `@ethereumjs/vm`

Please update your library references accordingly or install with:

```shell
npm i @ethereumjs/vm
```

### Support for all current Hardforks / HF API Changes

This is the first release of the VM which supports all hardforks
currently applied on mainnet starting with the support of the
Frontier HF rules all along up to MuirGlacier. 🎉

The following HFs have been added:

- **Spurious Dragon**,
  PR [#791](https://github.com/ethereumjs/ethereumjs-monorepo/pull/791)
- **Tangerine Whistle**,
  PR [#807](https://github.com/ethereumjs/ethereumjs-monorepo/pull/807)
- **DAO**,
  PR [#843](https://github.com/ethereumjs/ethereumjs-monorepo/pull/843)
- **Homestead**,
  PR [#815](https://github.com/ethereumjs/ethereumjs-monorepo/pull/815)
- **Frontier**,
  PR [#828](https://github.com/ethereumjs/ethereumjs-monorepo/pull/828)

A VM with the specific HF rules (on the chain provided) can be instantiated
by passing in a `Common` instance:

```typescript
import VM from '@ethereumjs/vm'
import Common from '@ethereumjs/common'

const common = new Common({ chain: 'mainnet', hardfork: 'spuriousDragon' })
const vm = new VM({ common })
```

**Breaking**: The default HF from the VM has been updated from `petersburg` to `istanbul`.
The HF setting is now automatically taken from the HF set for `Common.DEAULT_HARDFORK`,
see PR [#906](https://github.com/ethereumjs/ethereumjs-monorepo/pull/906).

**Breaking**: Please note that the options to directly pass in
`chain` and `hardfork` strings have been removed to simplify the API.
Providing a `Common` instance is now the only way to change
the chain setup, see PR [#863](https://github.com/ethereumjs/ethereumjs-monorepo/pull/863)

### Berlin HF Support / HF-independent EIPs

This releases adds support for subroutines (`EIP-2315`) which gets
activated under the `berlin` HF setting which can now be used
as a `hardfork` instantiation option, see
PR [#754](https://github.com/ethereumjs/ethereumjs-monorepo/pull/754).

**Attention!** Berlin HF support is still considered experimental
and implementations can change on non-major VM releases!

Support for BLS12-381 precompiles (`EIP-2537`) is added as an independent EIP
implementation - see PR [#785](https://github.com/ethereumjs/ethereumjs-monorepo/pull/785) -
since there is still an ongoing discussion on taking this EIP in for Berlin or
using a more generalized approach on curve computation with the Ethereum EVM
(`evm384` by the eWASM team).

Another new EIP added is the `EIP-2929` with gas cost increases for state access
opcodes, see PR [#889](https://github.com/ethereumjs/ethereumjs-monorepo/pull/889).

These integrations come along with an API addition to the VM to support the activation
of specific EIPs, see PR [#856](https://github.com/ethereumjs/ethereumjs-monorepo/pull/856),
PR [#869](https://github.com/ethereumjs/ethereumjs-monorepo/pull/869) and
PR [#872](https://github.com/ethereumjs/ethereumjs-monorepo/pull/872).

This API can be used as follows:

```typescript
import Common from '@ethereumjs/common'
import VM from '@ethereumjs/vm'

const common = new Common({ chain: 'mainnet', eips: [2537] })
const vm = new VM({ common })
```

### API Change: New Major Library Versions

The following `EthereumJS` libraries which are used within the VM internally
and can be passed in on instantiation have been updated to new major versions.

- `merkle-patricia-tree` `v3` (VM option `state`) -> `merkle-patricia-tree` `v4`,
  PR [#787](https://github.com/ethereumjs/ethereumjs-monorepo/pull/787)
- `ethereumjs-blockchain` `v4`-> `@ethereumjs/blockchain` `v5`,
  PR [#833](https://github.com/ethereumjs/ethereumjs-monorepo/pull/833)
- `ethereumjs-common` `v1` -> `@ethereumjs/common` `v2`

**Breaking**: If you pass in instances of these libraries to the VM please make sure to
update these library versions as stated. Please also take a note on the
package name changes!

All these libraries are now written in `TypeScript` and use promises instead of
callbacks for accessing their APIs.

### New StateManager Interface / StateManager API Changes

There is now a new `TypeScript` interface for the `StateManager`, see
PR [#763](https://github.com/ethereumjs/ethereumjs-monorepo/pull/763). If you are
using a custom `StateManager` you can use this interface to get better
assurance that you are using a `StateManager` which conforms with the current
`StateManager` API and will run in the VM without problems.

The integration of this new interface is highly encouraged since this release
also comes with `StateManager` API changes. Usage of the old
[ethereumjs-account](https://github.com/ethereumjs/ethereumjs-account) package
(this package will be retired) has been replaced by the new
[Account class](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/modules/_account_.md)
from the `ethereumjs-util` package. This affects all `Account` related
`StateManager` methods, see PR [#911](https://github.com/ethereumjs/ethereumjs-monorepo/pull/911).

The Util package also introduces a new 
[Address class](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/modules/_address_.md).
This class replaces all current `Buffer` inputs on `StateManager` methods representing an address.

### Dual ES5 and ES2017 Builds

We significantly updated our internal tool and CI setup along the work on 
PR [#913](https://github.com/ethereumjs/ethereumjs-monorepo/pull/913) with an update to `ESLint` from `TSLint` 
for code linting and formatting and the introduction of a new build setup.

Packages now target `ES2017` for Node.js builds (the `main` entrypoint from `package.json`) and introduce
a separate `ES5` build distributed along using the `browser` directive as an entrypoint, see
PR [#921](https://github.com/ethereumjs/ethereumjs-monorepo/pull/921). This will result
in performance benefits for Node.js consumers, see [here](https://github.com/ethereumjs/merkle-patricia-tree/pull/117) for a releated discussion.

### Other Changes

**Changes and Refactoring**

- Group opcodes based upon hardfork,
  PR [#798](https://github.com/ethereumjs/ethereumjs-monorepo/pull/798)
- Split opcodes logic into codes, fns, and utils files,
  PR [#896](https://github.com/ethereumjs/ethereumjs-monorepo/pull/896)
- Group precompiles based upon hardfork,
  PR [#783](https://github.com/ethereumjs/ethereumjs-monorepo/pull/783)
- **Breaking:** the `step` event now emits an `ethereumjs-util`
[Account](https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/modules/_account_.md)
object instead of an [ethereumjs-account](https://github.com/ethereumjs/ethereumjs-account)
(package retired) object
- **Breaking:** `NewContractEvent` now emits an `address` of 
  type `Address` (see `ethereumjs-util`) instead of a `Buffer`,
  PR [#919](https://github.com/ethereumjs/ethereumjs-monorepo/pull/919)
- **Breaking:** `EVMResult` now returns a `createdAddress` of
  type `Address` (see `ethereumjs-util`) instead of a `Buffer`,
  PR [#919](https://github.com/ethereumjs/ethereumjs-monorepo/pull/919)
- **Breaking:** `RunTxResult` now returns a `createdAddress` of
  type `Address` (see `ethereumjs-util`) instead of a `Buffer`,
  PR [#919](https://github.com/ethereumjs/ethereumjs-monorepo/pull/919)
- **Breaking:** `RunCallOpts` now expects `origin`, `caller` and
  `to` inputs to be of
  type `Address` (see `ethereumjs-util`) instead of a `Buffer`,
  PR [#919](https://github.com/ethereumjs/ethereumjs-monorepo/pull/919)
- **Breaking:** `RunCodeOpts` now expects `origin`, `caller` and
  `address` inputs to be of
  type `Address` (see `ethereumjs-util`) instead of a `Buffer`,
  PR [#919](https://github.com/ethereumjs/ethereumjs-monorepo/pull/919)
- Make `memory.ts` use Buffers instead of Arrays,
  PR [#850](https://github.com/ethereumjs/ethereumjs-monorepo/pull/850)
- Use `Map` for `OpcodeList` and `opcode` handlers,
  PR [#852](https://github.com/ethereumjs/ethereumjs-monorepo/pull/852)
- Compare buffers directly,
  PR [#851](https://github.com/ethereumjs/ethereumjs-monorepo/pull/851)
- Moved gas base fees from VM to Common,
  PR [#806](https://github.com/ethereumjs/ethereumjs-monorepo/pull/806)
- Return precompiles on `getPrecompile()` based on hardfork,
  PR [#783](https://github.com/ethereumjs/ethereumjs-monorepo/pull/783)
- Removed `async` dependency,
  PR [#779](https://github.com/ethereumjs/ethereumjs-monorepo/pull/779)
- Updated `ethereumjs-util` to v7,
  PR [#748](https://github.com/ethereumjs/ethereumjs-monorepo/pull/748)

**CI and Test Improvements**

- New benchmarking tool for the VM, CI integration on GitHub actions,
  PR [#794](https://github.com/ethereumjs/ethereumjs-monorepo/pull/794) and
  PR [#830](https://github.com/ethereumjs/ethereumjs-monorepo/pull/830)
- Various updates, fixes and refactoring work on the test runner,
  PR [#752](https://github.com/ethereumjs/ethereumjs-monorepo/pull/752) and
  PR [#849](https://github.com/ethereumjs/ethereumjs-monorepo/pull/849)
- Integrated `ethereumjs-testing` code logic into VM for more
  flexible future test load optimizations,
  PR [#808](https://github.com/ethereumjs/ethereumjs-monorepo/pull/808)
- Transition VM tests to TypeScript,
  PR [#881](https://github.com/ethereumjs/ethereumjs-monorepo/pull/881) and
  PR [#882](https://github.com/ethereumjs/ethereumjs-monorepo/pull/882)

**Bug Fixes**

- Fix `activatePrecompiles`,
  PR [#797](https://github.com/ethereumjs/ethereumjs-monorepo/pull/797)
- Strip zeros when putting contract storage in StateManager,
  PR [#880](https://github.com/ethereumjs/ethereumjs-monorepo/pull/880)
- Two bug fixes along `istanbul` `SSTORE` gas calculation,
  PR [#870](https://github.com/ethereumjs/ethereumjs-monorepo/pull/870)

## [4.2.0] - 2020-05-06

**Additions**

- Add `codeAddress` to VMs `step` event,
  PR [#651](https://github.com/ethereumjs/ethereumjs-monorepo/pull/651)
- Support for `skipNonce` and `skipBalance` tx options in `runBlock`,
  PR [#663](https://github.com/ethereumjs/ethereumjs-monorepo/pull/663)
- Add `init()` method to prevent race conditions,
  PR [#665](https://github.com/ethereumjs/ethereumjs-monorepo/pull/665)

**Removals**

- Remove `PStateManager` (`StateManager` now uses Promises by default),
  PR [#719](https://github.com/ethereumjs/ethereumjs-monorepo/pull/719)

**Bug Fixes**

- Explicitly duplicate EVMs stack items to ensure these do not get accidentally modified internally,
  PR [#733](https://github.com/ethereumjs/ethereumjs-monorepo/pull/733)

**Other changes**

- Refactor opcodes,
  PR [#664](https://github.com/ethereumjs/ethereumjs-monorepo/pull/664)

## [4.1.3] - 2020-01-09

This release fixes a critical bug preventing the `MuirGlacier` release `4.1.2`
working properly, an update is mandatory if you want a working installation.

**Bug Fixes**

- Fixed `getOpcodesForHF()` opcode selection for any HF > Istanbul,
  PR [#647](https://github.com/ethereumjs/ethereumjs-monorepo/pull/647)

**Test Related Changes**

- Switched from `Coveralls` to `Codecov` (monorepo preparation, coverage
  reports on PRs),
  PR [#646](https://github.com/ethereumjs/ethereumjs-monorepo/pull/646)
- Added nightly `StateTests` runs,
  PR [#639](https://github.com/ethereumjs/ethereumjs-monorepo/pull/639)
- Run consensus tests on `MuirGlacier`,
  PR [#648](https://github.com/ethereumjs/ethereumjs-monorepo/pull/648)

[4.1.3]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fvm%404.1.2...%40ethereumjs%2Fvm%404.1.3

## [4.1.2] - 2019-12-19 [DEPRECATED]

**Deprecation Notice**: This is a broken release containing a critical bug
affecting all installations using the `MuirGlacier` HF option. Please update
to the `4.1.3` release.

Release adds support for the `MuirGlacier` hardfork by updating relevant
dependencies:

- `ethereumjs-tx`:
  [v2.1.2](https://github.com/ethereumjs/ethereumjs-tx/releases/tag/v2.1.2)
- `ethereumjs-block`:
  [v2.2.2](https://github.com/ethereumjs/ethereumjs-block/releases/tag/v2.2.2)
- `ethereumjs-blockchain`:
  [v4.0.3](https://github.com/ethereumjs/ethereumjs-blockchain/releases/tag/v4.0.3)
- `ethereumjs-common`:
  [v1.5.0](https://github.com/ethereumjs/ethereumjs-common/releases/tag/v1.5.0)

Other changes:

- Upgraded `ethereumjs-util` to `v6.2.0`,
  PR [#621](https://github.com/ethereumjs/ethereumjs-monorepo/pull/621)
- Removed outdated cb param definition in `runBlockchain`,
  PR [#623](https://github.com/ethereumjs/ethereumjs-monorepo/pull/623)
- Properly output zero balance in `examples/run-transactions-complete`,
  PR [#624](https://github.com/ethereumjs/ethereumjs-monorepo/pull/624)

[4.1.2]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fvm%404.1.1...%40ethereumjs%2Fvm%404.1.2

## [4.1.1] - 2019-11-19

First stable `Istanbul` release passing all `StateTests` and `BlockchainTests`
from the official Ethereum test suite
[v7.0.0-beta.1](https://github.com/ethereum/tests/releases/tag/v7.0.0-beta.1).
Test suite conformance have been reached along work on
PR [#607](https://github.com/ethereumjs/ethereumjs-monorepo/pull/607) (thanks @s1na!)
and there were several fixes along the way, so it is strongly recommended that
you upgrade from the first `beta` `Istanbul` release `v4.1.0`.

**Istanbul Related Fixes**

- Refund counter has been moved from the `EEI` to the `EVM` module,
  PR [#612](https://github.com/ethereumjs/ethereumjs-monorepo/pull/612), `gasRefund`
  is re-added to the `execResult` in the `EVM` module at the end of message
  execution in `EVM` to remain (for the most part) backwards-compatible in the
  release
- Fixed `blake2f` precompile for rounds > `0x4000000`
- Fixed issues causing `RevertPrecompiled*` test failures
- Fixed an issue where the `RIPEMD` precompile has to remain _touched_ even
  when the call reverts and be considered for deletion,
  see [EIP issue #716](https://github.com/ethereum/EIPs/issues/716) for context
- Updated `ethereumjs-block` to `v2.2.1`
- Updated `ethereumjs-blockchain` to `v4.0.2`
- Limited `ethereumjs-util` from `^6.1.0` to `~6.1.0`
- Hardfork-related fixes in test runners and test utilities

**Other Changes**

- Introduction of a new caching mechanism to cache calls towards `promisify`
  being present in hot paths (performance optimization),
  PR [#600](https://github.com/ethereumjs/ethereumjs-monorepo/pull/600)
- Renamed some missing `result.return` to `result.returnValue` on `EVM`
  execution in examples,
  PR [#604](https://github.com/ethereumjs/ethereumjs-monorepo/pull/604)
- Improved event documentation,
  PR [#601](https://github.com/ethereumjs/ethereumjs-monorepo/pull/601)

[4.1.1]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fvm%404.1.0...%40ethereumjs%2Fvm%404.1.1

## [4.1.0] - 2019-09-12

This is the first feature-complete `Istanbul` release, containing implementations
for all 6 EIPs, see the HF meta EIP [EIP-1679](https://eips.ethereum.org/EIPS/eip-1679)
for an overview. Beside this release contains further unrelated features as
well as bug fixes.

Note that `Istanbul` support is still labeled as `beta`. All implementations
have only basic test coverage since the official Ethereum consensus tests are
not yet merged. There might be also last minute changes to EIPs during the
testing period.

**Istanbul Summary**

See the VM `Istanbul` hardfork meta issue
[#501](https://github.com/ethereumjs/ethereumjs-monorepo/issues/501) for a summary
on all the changes.

Added EIPs:

- [EIP-152](https://eips.ethereum.org/EIPS/eip-152): Blake 2b `F` precompile,
  PR [#584](https://github.com/ethereumjs/ethereumjs-monorepo/pull/584)
- [EIP-1108](https://eips.ethereum.org/EIPS/eip-1108): Reduce `alt_bn128`
  precompile gas costs,  
  PR [#540](https://github.com/ethereumjs/ethereumjs-monorepo/pull/540)
  (already released in `v4.0.0`)
- [EIP-1344](https://eips.ethereum.org/EIPS/eip-1344): Add ChainID Opcode,
  PR [#572](https://github.com/ethereumjs/ethereumjs-monorepo/pull/572)
- [EIP-1884](https://eips.ethereum.org/EIPS/eip-1884): Trie-size-dependent
  Opcode Repricing,
  PR [#581](https://github.com/ethereumjs/ethereumjs-monorepo/pull/581)
- [EIP-2200](https://eips.ethereum.org/EIPS/eip-2200): Rebalance net-metered
  SSTORE gas costs,
  PR [#590](https://github.com/ethereumjs/ethereumjs-monorepo/pull/590)

**Other Features**

- Two new event types `beforeMessage` and `afterMessage`, emitting a `Message`
  before and an `EVMResult` after running a `Message`, see also the
  [updated section](https://github.com/ethereumjs/ethereumjs-monorepo#vms-tracing-events)
  in the `README` on this,
  PR [#577](https://github.com/ethereumjs/ethereumjs-monorepo/pull/577)

**Bug Fixes**

- Transaction error strings should not contain multiple consecutive whitespace
  characters, this has been fixed,
  PR [#578](https://github.com/ethereumjs/ethereumjs-monorepo/pull/578)
- Fixed `vm.stateManager.generateCanonicalGenesis()` to produce a correct
  genesis block state root (in particular for the `Goerli` testnet),
  PR [#589](https://github.com/ethereumjs/ethereumjs-monorepo/pull/589)

**Refactoring / Docs**

- Preparation for separate lists of opcodes for the different HFs,
  PR [#582](https://github.com/ethereumjs/ethereumjs-monorepo/pull/582),
  see also follow-up
  PR [#592](https://github.com/ethereumjs/ethereumjs-monorepo/pull/592) making this
  list a property of the VM instance
- Clarification in the docs for the behavior of the `activatePrecompiles`
  VM option,
  PR [#595](https://github.com/ethereumjs/ethereumjs-monorepo/pull/595)

[4.1.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fvm%404.0.0...%40ethereumjs%2Fvm%404.1.0

## [4.0.0] - 2019-08-06

First `TypeScript` based VM release, other highlights:

- New Call and Code Loop Structure / EVM Encapsulation
- EEI for Environment Communication
- Istanbul Process Start
- Promise-based API

See [v4.0.0-beta.1](https://github.com/ethereumjs/ethereumjs-monorepo/releases/tag/v4.0.0-beta.1)
release for full release notes.

**Changes since last beta**

- Simplification of execution results,
  PR [#551](https://github.com/ethereumjs/ethereumjs-monorepo/pull/551)
- Fix error propagation in `Cache.flush()` method from `StateManager`,
  PR [#562](https://github.com/ethereumjs/ethereumjs-monorepo/pull/562)
- `StateManager` storage key length validation (now throws on addresses not
  having a 32-byte length),
  PR [#565](https://github.com/ethereumjs/ethereumjs-monorepo/pull/565)

[4.0.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fvm%404.0.0...%40ethereumjs%2Fta.1...v4.0.0

## [4.0.0-beta.1] - 2019-06-19

Since changes in this release are pretty deep reaching and broadly distributed,
we will first drop out one or several `beta` releases until we are confident on
both external API as well as inner structural changes. See
[v4 branch](https://github.com/ethereumjs/ethereumjs-monorepo/pull/479) for some
major entry point into the work on the release.

It is highly recommended that you do some testing of your library against this
and following `beta` versions and give us some feedback!

These will be the main release notes for the `v4` feature updates, subsequent
`beta` releases and the final release will just publish the delta changes and
point here for reference.

Breaking changes in the release notes are preeceeded with `[BREAKING]`, do a
search for an overview.

The outstanding work of [@s1na](https://github.com/s1na) has to be mentioned
here. He has done the very large portion of the coding and without him this
release wouldn't have been possible. Thanks Sina! 🙂

So what's new?

### TypeScript

This is the first `TypeScript` release of the VM (yay! 🎉).

`TypeScript` handles `ES6` transpilation
[a bit differently](https://github.com/Microsoft/TypeScript/issues/2719) (at the
end: cleaner) than `babel` so `require` syntax of the library slightly changes to:

```javascript
const VM = require('ethereumjs-monorepo').default
```

The library now also comes with **type declaration files** distributed along
with the package published.

##### Relevant PRs

- Preparation, migration of `Bloom`, `Stack` and `Memory`,
  PR [#495](https://github.com/ethereumjs/ethereumjs-monorepo/pull/495)
- `StateManager` migration,
  PR [#496](https://github.com/ethereumjs/ethereumjs-monorepo/pull/496)
- Migration of precompiles, opcode list, `EEI`, `Message`, `TxContext` to
  `TypeScript`, PR [#497](https://github.com/ethereumjs/ethereumjs-monorepo/pull/497)
- Migration of `EVM` (old: `Interpreter`) and exceptions,
  PR [#504](https://github.com/ethereumjs/ethereumjs-monorepo/pull/504)
- Migration of `Interpreter` (old: `Loop`),
  PR [#505](https://github.com/ethereumjs/ethereumjs-monorepo/pull/505)
- Migration of `opFns` (opcode implementations),
  PR [#506](https://github.com/ethereumjs/ethereumjs-monorepo/pull/506)
- Migration of the main `index.js` `VM` class,
  PR [#507](https://github.com/ethereumjs/ethereumjs-monorepo/pull/507)
- Migration of `VM.runCode()`,
  PR [#508](https://github.com/ethereumjs/ethereumjs-monorepo/pull/508)
- Migration of `VM.runCall()`,
  PR [#510](https://github.com/ethereumjs/ethereumjs-monorepo/pull/510)
- Migration of `VM.runTx()`,
  PR [#511](https://github.com/ethereumjs/ethereumjs-monorepo/pull/511)
- Migration of `VM.runBlock()`,
  PR [#512](https://github.com/ethereumjs/ethereumjs-monorepo/pull/512)
- Migration of `VM.runBlockchain()`,
  PR [#517](https://github.com/ethereumjs/ethereumjs-monorepo/pull/517)
- `TypeScript` finalization PR, config switch,
  PR [#518](https://github.com/ethereumjs/ethereumjs-monorepo/pull/518)
- Doc generation via `TypeDoc`,
  PR [#522](https://github.com/ethereumjs/ethereumjs-monorepo/pull/522)

### EVM Modularization and Structural Refactoring

##### New Call and Code Loop Structure / EVM Encapsulation

This release switches to a new class based and promisified structure for
working down VM calls and running through code loops, and encapsulates this
logic to be bound to the specific `EVM` (so the classical Ethereum Virtual Machine)
implementation in the
[evm](https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/lib/evm) module,
opening the way for a future parallel `eWASM` additional implementation.

This new logic is mainly handled by the two new classes `EVM` (old: `Interpreter`)
and `Interpreter` (old: `Loop`),
see PR [#483](https://github.com/ethereumjs/ethereumjs-monorepo/pull/483)
for the initial work on this. The old `VM.runCall()` and `VM.runCode()`
methods are just kept as being wrappers and will likely be deprecated on future
releases once the inner API structure further stabilizes.

This new structure should make extending the VM by subclassing and
adopting functionality much easier, e.g. by changing opcode functionality or adding
custom onces by using an own `Interpreter.getOpHandler()` implementation. You are
highly encouraged to play around, see what you can do and give us feedback on
possibilities and limitations.

#### EEI for Environment Communication

For interacting with the blockchain environment there has been introduced a
dedicated `EEI` (Ethereum Environment Interface) module closely resembling the
respective
[EEI spec](https://github.com/ewasm/design/blob/master/eth_interface.md), see
PR [#486](https://github.com/ethereumjs/ethereumjs-monorepo/pull/486) for the initial
work.

This makes handling of environmental data by the VM a lot cleaner and transparent
and should as well allow for much easier extension and modification.

##### Changes

- Detached precompiles from the VM,
  PR [#492](https://github.com/ethereumjs/ethereumjs-monorepo/pull/492)
- Subdivided `runState`, refactored `Interpreter` (old: `Loop`),
  PR [#498](https://github.com/ethereumjs/ethereumjs-monorepo/pull/498)
- [BREAKING] Dropped `emitFreeLogs` flag, to replace it is suggested to
  implement by inheriting `Interpreter` (old: `Loop`),
  PR [#498](https://github.com/ethereumjs/ethereumjs-monorepo/pull/498)
- Split `EVM.executeMessage()` with `EVM.executeCall()` and
  `EVM.executeCreate()` for `call` and `create` specific logic
  (old names: `Interpreter.[METHOD_NAME]()`),
  PR [#499](https://github.com/ethereumjs/ethereumjs-monorepo/pull/499)
- Further simplification of `Interpreter`/`EVM`
  (old: `Loop`/`Interpreter`) structure,
  PR [#506](https://github.com/ethereumjs/ethereumjs-monorepo/pull/506)
- [BREAKING] Dropped `VM.runJit()` in favor of direct handling in
  `EVM` (old: `Interpreter`),
  officially not part of the external API but mentioning just in case,
  PR [#515](https://github.com/ethereumjs/ethereumjs-monorepo/pull/515)
- Removed `StorageReader`, moved logic to `StateManager`,
  [#534](https://github.com/ethereumjs/ethereumjs-monorepo/pull/534)

### Istanbul Process Start

With this release we start the `Istanbul` hardfork integration process and
have activated the `istanbul` `hardfork` option for the constructor.

This is meant to be used experimentation and reference implementations, we have made
a start with integrating draft [EIP-1108](https://eips.ethereum.org/EIPS/eip-1108)
`Istanbul` candidate support reducing the gas costs for `alt_bn128` precompiles,
see PR [#539](https://github.com/ethereumjs/ethereumjs-monorepo/issues/539) for
implementation details.

Note that this is still very early in the process since no EIP in a final
state is actually accepted for being included into `Istanbul` on the time of
release. The `v4` release series will be kept as an experimental series
during the process with breaking changes introduced along the way without too
much notice, so be careful and tighten the VM dependency if you want to give
your users the chance for some early experimentation with some specific
implementation state.

Once scope of `Istanbul` as well as associated EIPs are finalized a stable
`Istanbul` VM version will be released as a subsequent major release.

### Code Modernization and Version Updates

The main API with the `v4` release switches from being `callback` based to
using promises,
see PR [#546](https://github.com/ethereumjs/ethereumjs-monorepo/pull/546).

Here is an example for changed API call `runTx`.

Old `callback`-style invocation:

```javascript
vm.runTx(
  {
    tx: tx,
  },
  function (err, result) {
    if (err) {
      // Handle errors appropriately
    }
    // Do something with the result
  },
)
```

Promisified usage:

```javascript
try {
  let result = await vm.runTx({ tx: tx })
  // Do something with the result
} catch (err) {
  // handle errors appropriately
}
```

##### Code Modernization Changes

- Promisified internal usage of async opcode handlers,
  PR [#491](https://github.com/ethereumjs/ethereumjs-monorepo/pull/491)
- Promisified `runTx` internals,
  PR [#493](https://github.com/ethereumjs/ethereumjs-monorepo/pull/493)
- Promisified `runBlock` internals, restructure, reduced shared global state,
  PR [#494](https://github.com/ethereumjs/ethereumjs-monorepo/pull/494)

##### Version Updates

- Updated `ethereumjs-account` from `2.x` to `3.x`, part of
  PR [#496](https://github.com/ethereumjs/ethereumjs-monorepo/pull/496)

##### Features

- The VM now also supports a
  [Common](https://github.com/ethereumjs/ethereumjs-common)
  class instance for chain and HF setting,
  PRs [#525](https://github.com/ethereumjs/ethereumjs-monorepo/pull/525) and
  [#526](https://github.com/ethereumjs/ethereumjs-monorepo/pull/526)

##### Bug Fixes

- Fixed error message in `runTx()`,
  PR [#523](https://github.com/ethereumjs/ethereumjs-monorepo/pull/523)
- Changed default hardfork in `StateManager` to `petersburg`,
  PR [#524](https://github.com/ethereumjs/ethereumjs-monorepo/pull/524)
- Replaced `Object.assign()` calls and fixed type errors,
  PR [#529](https://github.com/ethereumjs/ethereumjs-monorepo/pull/529)

#### Development

- Significant blockchain test speed improvements,
  PR [#536](https://github.com/ethereumjs/ethereumjs-monorepo/pull/536)

[4.0.0-beta.1]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fvm%403.0.0...%40ethereumjs%2Fvm%404.0.0-beta.1

## [3.0.0] - 2019-03-29

This release comes with a modernized `ES6`-class structured code base, some
significant local refactoring work regarding how `Stack` and `Memory`
are organized within the VM and it finalizes a first round of module structuring
now having separate folders for `bloom`, `evm` and `state` related code. The
release also removes some rarely used parts of the API (`hookedVM`, `VM.deps`).

All this is to a large extend preparatory work for a `v4.0.0` release which will
follow in the next months with `TypeScript` support and more system-wide
refactoring work leading to a more modular and expandable VM and providing the
ground for future `eWASM` integration. If you are interested in the release
process and want to take part in the refactoring discussion see the associated
issue [#455](https://github.com/ethereumjs/ethereumjs-monorepo/issues/455).

**VM Refactoring/Breaking Changes**

- New `Memory` class for evm memory manipulation,
  PR [#442](https://github.com/ethereumjs/ethereumjs-monorepo/pull/442)
- Refactored `Stack` manipulation in evm,
  PR [#460](https://github.com/ethereumjs/ethereumjs-monorepo/pull/460)
- Dropped `createHookedVm` (BREAKING), being made obsolete by the
  new `StateManager` API,
  PR [#451](https://github.com/ethereumjs/ethereumjs-monorepo/pull/451)
- Dropped `VM.deps` attribute (please require dependencies yourself if you
  used this),
  PR [#478](https://github.com/ethereumjs/ethereumjs-monorepo/pull/478)
- Removed `fakeBlockchain` class and associated tests,
  PR [#466](https://github.com/ethereumjs/ethereumjs-monorepo/pull/466)
- The `petersburg` hardfork rules are now run as default
  (before: `byzantium`),
  PR [#485](https://github.com/ethereumjs/ethereumjs-monorepo/pull/485)

**Modularization**

- Renamed `vm` module to `evm`, move `precompiles` to `evm` module,
  PR [#481](https://github.com/ethereumjs/ethereumjs-monorepo/pull/481)
- Moved `stateManager`, `storageReader` and `cache` to `state` module,
  [#443](https://github.com/ethereumjs/ethereumjs-monorepo/pull/443)
- Replaced static VM `logTable` with dynamic inline version in `EXP` opcode,
  [#450](https://github.com/ethereumjs/ethereumjs-monorepo/pull/450)

**Code Modernization/ES6**

- Converted `VM` to `ES6` class,
  PR [#478](https://github.com/ethereumjs/ethereumjs-monorepo/pull/478)
- Migrated `stateManager` and `storageReader` to `ES6` class syntax,
  PR [#452](https://github.com/ethereumjs/ethereumjs-monorepo/pull/452)

**Bug Fixes**

- Fixed a bug where `stateManager.setStateRoot()` didn't clear
  the `_storageTries` cache,
  PR [#445](https://github.com/ethereumjs/ethereumjs-monorepo/issues/445)
- Fixed longer output than return length in `CALL` opcode,
  PR [#454](https://github.com/ethereumjs/ethereumjs-monorepo/pull/454)
- Use `BN.toArrayLike()` instead of `BN.toBuffer()` (browser compatibility),
  PR [#458](https://github.com/ethereumjs/ethereumjs-monorepo/pull/458)
- Fixed tx value overflow 256 bits,
  PR [#471](https://github.com/ethereumjs/ethereumjs-monorepo/pull/471)

**Maintenance/Optimization**

- Use `BN` reduction context in `MODEXP` precompile,
  PR [#463](https://github.com/ethereumjs/ethereumjs-monorepo/pull/463)

**Documentation**

- Fixed API doc types for `Bloom` filter methods,
  PR [#439](https://github.com/ethereumjs/ethereumjs-monorepo/pull/439)

**Testing**

- New Karma browser testing for the API tests,
  PRs [#461](https://github.com/ethereumjs/ethereumjs-monorepo/pull/461),
  [#468](https://github.com/ethereumjs/ethereumjs-monorepo/pull/468)
- Removed unused parts and tests within the test setup,
  PR [#437](https://github.com/ethereumjs/ethereumjs-monorepo/pull/437)
- Fixed a bug using `--json` trace flag in the tests,
  PR [#438](https://github.com/ethereumjs/ethereumjs-monorepo/pull/438)
- Complete switch to Petersburg on tests, fix coverage,
  PR [#448](https://github.com/ethereumjs/ethereumjs-monorepo/pull/448)
- Added test for `StateManager.dumpStorage()`,
  PR [#462](https://github.com/ethereumjs/ethereumjs-monorepo/pull/462)
- Fixed `ecmul_0-3_5616_28000_96` (by test setup adoption),
  PR [#473](https://github.com/ethereumjs/ethereumjs-monorepo/pull/473)

[3.0.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fvm%402.6.0...%40ethereumjs%2Fvm%403.0.0

## [2.6.0] - 2019-02-07

**Petersburg Support**

Support for the `Petersburg` (aka `constantinopleFix`) hardfork by integrating
`Petersburg` ready versions of associated libraries, see also
PR [#433](https://github.com/ethereumjs/ethereumjs-monorepo/pull/433):

- `ethereumjs-common` (chain and HF logic and helper functionality) [v1.1.0](https://github.com/ethereumjs/ethereumjs-common/releases/tag/v1.1.0)
- `ethereumjs-blockchain` [v3.4.0](https://github.com/ethereumjs/ethereumjs-blockchain/releases/tag/v3.4.0)
- `ethereumjs-block` [v2.2.0](https://github.com/ethereumjs/ethereumjs-block/releases)

To instantiate the VM with `Petersburg` HF rules set the `opts.hardfork`
constructor parameter to `petersburg`. This will run the VM on the new
Petersburg rules having removed the support for
[EIP 1283](https://eips.ethereum.org/EIPS/eip-1283).

**Goerli Readiness**

The VM is now also ready to execute on blocks from the final version of the
[Goerli](https://github.com/goerli/testnet) cross-client testnet and can
therefore be instantiated with `opts.chain` set to `goerli`.

**Bug Fixes**

- Fixed mixed `sync`/`async` functions in `cache`,
  PR [#422](https://github.com/ethereumjs/ethereumjs-monorepo/pull/422)
- Fixed a bug in `setStateroot` and caching by clearing the `stateManager` cache
  after setting the state root such that stale values are not returned,
  PR [#420](https://github.com/ethereumjs/ethereumjs-monorepo/pull/420)
- Fixed cache access on the hooked VM (_deprecated_),
  PR [#434](https://github.com/ethereumjs/ethereumjs-monorepo/pull/434)

**Refactoring**

Following changes might be relevant for you if you are hotfixing/monkey-patching
on parts of the VM:

- Moved `bloom` to its own directory,
  PR [#429](https://github.com/ethereumjs/ethereumjs-monorepo/pull/429)
- Moved `opcodes`, `opFns` and `logTable` to `lib/vm`,
  PR [#425](https://github.com/ethereumjs/ethereumjs-monorepo/pull/425)
- Converted `Bloom` to `ES6` class,
  PR [#428](https://github.com/ethereumjs/ethereumjs-monorepo/pull/428)
- Converted `Cache` to `ES6` class, added unit tests,
  PR [427](https://github.com/ethereumjs/ethereumjs-monorepo/pull/427)

[2.6.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fvm%402.5.1...%40ethereumjs%2Fvm%402.6.0

## [2.5.1] - 2019-01-19

### Features

- Added `memoryWordCount` to the `step` event object,
  PR [#405](https://github.com/ethereumjs/ethereumjs-monorepo/pull/405)

### Bug Fixes

- Fixed a bug which caused an overwrite of the passed state trie (`opts.state`)
  when instantiating the library with the `opts.activatePrecompiles` option,
  PR [#415](https://github.com/ethereumjs/ethereumjs-monorepo/pull/415)
- Fixed error handling in `runCode` (in case `loadContract` fails),
  PR [#408](https://github.com/ethereumjs/ethereumjs-monorepo/pull/408)
- Fixed a bug in the `StateManager.generateGenesis()` function,
  PR [#400](https://github.com/ethereumjs/ethereumjs-monorepo/pull/400)

### Tests

- Upgraded `ethereumjs-blockchain` and `level` for test runs,
  PR [#414](https://github.com/ethereumjs/ethereumjs-monorepo/pull/414)
- Fixed issue when running code coverage on PRs from forks,
  PR [#402](https://github.com/ethereumjs/ethereumjs-monorepo/pull/402)

[2.5.1]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fvm%402.5.0...%40ethereumjs%2Fvm%402.5.1

## [2.5.0] - 2018-11-21

This is the first release of the VM with full support for all `Constantinople` EIPs. It further comes along with huge improvements on consensus conformity and introduces the `Beta` version of a new `StateManager` API.

### Constantinople Support

For running the VM with `Constantinople` hardfork rules, set the [option](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/docs/index.md#vm) in the `VM` constructor `opts.hardfork` to `constantinople`. Supported hardforks are `byzantium` and `constantinople`, `default` setting will stay on `byzantium` for now but this will change in a future release.

Changes related to Constantinople:

- EIP 1283 `SSTORE`, see PR [#367](https://github.com/ethereumjs/ethereumjs-monorepo/pull/367)
- EIP 1014 `CREATE2`, see PR [#329](https://github.com/ethereumjs/ethereumjs-monorepo/pull/329)
- EIP 1052 `EXTCODEHASH`, see PR [#324](https://github.com/ethereumjs/ethereumjs-monorepo/pull/324)
- Constantinople ready versions of [ethereumjs-block](https://github.com/ethereumjs/ethereumjs-block/releases/tag/v2.1.0) and [ethereumjs-blockchain](https://github.com/ethereumjs/ethereumjs-blockchain/releases/tag/v3.3.0) dependencies (difficulty bomb delay), see PRs [#371](https://github.com/ethereumjs/ethereumjs-monorepo/pull/371), [#325](https://github.com/ethereumjs/ethereumjs-monorepo/pull/325)

### Consensus Conformity

This release is making a huge leap forward regarding consensus conformity, and even if you are not interested in `Constantinople` support at all, you should upgrade just for this reason. Some context: we couldn't run blockchain tests for a long time on a steady basis due to performance constraints and when we re-triggered a test run after quite some time with PR [#341](https://github.com/ethereumjs/ethereumjs-monorepo/pull/341) the result was a bit depressing with over 300 failing tests. Thanks to joined efforts from the community and core team members we could bring this down far quicker than expected and this is the first release for a long time which practically comes with complete consensus conformity - with just three recently added tests failing (see `skipBroken` list in `tests/tester.js`) and otherwise passing all blockchain tests and all state tests for both `Constantinople` and `Byzantium` rules. 🏆 🏆 🏆

Consensus Conformity related changes:

- Reset `selfdestruct` on `REVERT`, see PR [#392](https://github.com/ethereumjs/ethereumjs-monorepo/pull/392)
- Undo `Bloom` filter changes from PR [#295](https://github.com/ethereumjs/ethereumjs-monorepo/pull/295), see PR [#384](https://github.com/ethereumjs/ethereumjs-monorepo/pull/384)
- Fixes broken `BLOCKHASH` opcode, see PR [#381](https://github.com/ethereumjs/ethereumjs-monorepo/pull/381)
- Fix failing blockchain test `GasLimitHigherThan2p63m1`, see PR [#380](https://github.com/ethereumjs/ethereumjs-monorepo/pull/380)
- Stop adding `account` to `cache` when checking if it is empty, see PR [#375](https://github.com/ethereumjs/ethereumjs-monorepo/pull/375)

### State Manager Interface

The `StateManager` (`lib/stateManager.js`) - providing a high-level interface to account and contract data from the underlying state trie structure - has been completely reworked and there is now a close-to-being finalized API (currently marked as `Beta`) coming with its own [documentation](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/docs/stateManager.md).

This comes along with larger refactoring work throughout more-or-less the whole code base and the `StateManager` now completely encapsulates the trie structure and the cache backend used, see issue [#268](https://github.com/ethereumjs/ethereumjs-monorepo/issues/268) and associated PRs for reference. This will make it much easier in the future to bring along an own state manager serving special needs (optimized for memory and performance, run on mobile,...) by e.g. using a different trie implementation, cache or underlying storage or database backend.

We plan to completely separate the currently still integrated state manager into its own repository in one of the next releases, this will then be a breaking `v3.0.0` release. Discussion around a finalized interface (we might e.g. drop all genesis-releated methods respectively methods implemented in the `DefaultStateManager`) is still ongoing and you are very much invited to jump in and articulate your needs, just take e.g. the issue mentioned above as an entry point.

Change related to the new `StateManager` interface:

- `StateManager` interface simplification, see PR [#388](https://github.com/ethereumjs/ethereumjs-monorepo/pull/388)
- Make `StateManager` cache and trie private, see PR [#385](https://github.com/ethereumjs/ethereumjs-monorepo/pull/385)
- Remove vm accesses to `StateManager` `trie` and `cache`, see PR [#376](https://github.com/ethereumjs/ethereumjs-monorepo/pull/376)
- Remove explicit direct cache interactions, see PR [#366](https://github.com/ethereumjs/ethereumjs-monorepo/pull/366)
- Remove contract specific commit, see PR [#335](https://github.com/ethereumjs/ethereumjs-monorepo/pull/335)
- Fixed incorrect references to `trie` in tests, see PR [#345](https://github.com/ethereumjs/ethereumjs-monorepo/pull/345)
- Added `StateManager` API documentation, see PR [#393](https://github.com/ethereumjs/ethereumjs-monorepo/pull/393)

### New Features

- New `emitFreeLogs` option, allowing any contract to emit an unlimited quantity of events without modifying the block gas limit (default: `false`) which can be used in debugging contexts, see PRs [#378](https://github.com/ethereumjs/ethereumjs-monorepo/pull/378), [#379](https://github.com/ethereumjs/ethereumjs-monorepo/pull/379)

### Testing and Documentation

Beyond the reintegrated blockchain tests there is now a separate test suite to test the API of the library, see `tests/api`. This should largely reduce the risk of introducing new bugs on the API level on future changes, generally ease the development process by being able to develop against the specific tests and also allows using the tests as a reference for examples on how to use the API.

On the documentation side the API documentation has also been consolidated and there is now a unified and auto-generated [API documentation](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/docs/index.md) (previously being manually edited (and too often forgotten) in `README`).

- Added API tests for `index.js`, `StateManager`, see PR [#364](https://github.com/ethereumjs/ethereumjs-monorepo/pull/364)
- Added API Tests for `runJit` and `fakeBlockchain`, see PR [#331](https://github.com/ethereumjs/ethereumjs-monorepo/pull/331)
- Added API tests for `runBlockchain`, see PR [#336](https://github.com/ethereumjs/ethereumjs-monorepo/pull/336)
- Added `runBlock` API tests, see PR [#360](https://github.com/ethereumjs/ethereumjs-monorepo/pull/360)
- Added `runTx` API tests, see PR [#352](https://github.com/ethereumjs/ethereumjs-monorepo/pull/352)
- Added API Tests for the `Bloom` module, see PR [#330](https://github.com/ethereumjs/ethereumjs-monorepo/pull/330)
- New consistent auto-generated [API documentation](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/docs/index.md), see PR [#377](https://github.com/ethereumjs/ethereumjs-monorepo/pull/377)
- Blockchain tests now run by default on CI, see PR [#374](https://github.com/ethereumjs/ethereumjs-monorepo/pull/374)
- Switched from `istanbul` to `nyc`, see PR [#334](https://github.com/ethereumjs/ethereumjs-monorepo/pull/334)
- Usage of `sealEngine` in blockchain tests, see PR [#373](https://github.com/ethereumjs/ethereumjs-monorepo/pull/373)
- New `tap-spec` option to get a formatted test run result summary, see [README](https://github.com/ethereumjs/ethereumjs-monorepo#running-tests-with-a-reporterformatter), see PR [#363](https://github.com/ethereumjs/ethereumjs-monorepo/pull/363)
- Updates/fixes on the JSDoc comments, see PRs [#362](https://github.com/ethereumjs/ethereumjs-monorepo/pull/362), [#361](https://github.com/ethereumjs/ethereumjs-monorepo/pull/361)

### Bug Fixes and Maintenance

Some bug fix and maintenance updates:

- Fix error handling in `fakeBlockChain`, see PR [#320](https://github.com/ethereumjs/ethereumjs-monorepo/pull/320)
- Update of `ethereumjs-util` to [v6.0.0](https://github.com/ethereumjs/ethereumjs-util/releases/tag/v6.0.0), see PR [#369](https://github.com/ethereumjs/ethereumjs-monorepo/pull/369)

### Thank You

Special thanks to:

- @mattdean-digicatapult for his indefatigable work on the new StateManager interface and for fixing a large portion of the failing blockchain tests
- @rmeissner for the work on Constantinople
- @vpulim for jumping in so quickly and doing a reliable `SSTORE` implementation within 4 days
- @s1na for the new API test suite

Beyond this release contains contributions from the following people:
@jwasinger, @Agusx1211, @HolgerD77, @danjm, @whymarrh, @seesemichaelj, @kn

Thank you all very much, and thanks @axic for keeping an ongoing eye on overall library quality!

[2.5.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fvm%402.4.0...%40ethereumjs%2Fvm%402.5.0

## [2.4.0] - 2018-07-27

With the `2.4.x` release series we now start to gradually add `Constantinople` features with the
bitwise shifting instructions from [EIP 145](https://eips.ethereum.org/EIPS/eip-145)
making the start being introduced in the `v2.4.0` release.

Since both the scope of the `Constantinople` hardfork as well as the state of at least some of the EIPs
to be included are not yet finalized, this is only meant for `EXPERIMENTAL` purposes, e.g. for developer
tools to give users early access and make themself familiar with dedicated features.

Once scope and EIPs from `Constantinople` are final we will target a `v2.5.0` release which will officially
introduce `Constantinople` support with all the changes bundled together.

Note that from this release on we also introduce new `chain` (default: `mainnet`) and `hardfork`
(default: `byzantium`) initialization parameters, which make use of our new [ethereumjs-common](https://github.com/ethereumjs/ethereumjs-common) library and in the future will allow
for parallel hardfork support from `Byzantium` onwards.

Since `hardfork` default might be changed or dropped in future releases, you might want to explicitly
set this to `byzantium` on your next update to avoid future unexpected behavior.

All the changes from this release:

**FEATURES/FUNCTIONALITY**

- Improved chain and fork support, see PR [#304](https://github.com/ethereumjs/ethereumjs-monorepo/pull/304)
- Support for the `Constantinople` bitwise shifiting instructions `SHL`, `SHR` and `SAR`, see PR [#251](https://github.com/ethereumjs/ethereumjs-monorepo/pull/251)
- New `newContract` event which can be used to do interrupting tasks on contract/address creation, see PR [#306](https://github.com/ethereumjs/ethereumjs-monorepo/pull/306)
- Alignment of behavior of bloom filter hashing to go along with mainnet compatible clients _BREAKING_, see PR [#295](https://github.com/ethereumjs/ethereumjs-monorepo/pull/295)

**UPDATES/TESTING**

- Usage of the latest `rustbn.js` API, see PR [#312](https://github.com/ethereumjs/ethereumjs-monorepo/pull/312)
- Some cleanup in precompile error handling, see PR [#318](https://github.com/ethereumjs/ethereumjs-monorepo/pull/318)
- Some cleanup for `StateManager`, see PR [#266](https://github.com/ethereumjs/ethereumjs-monorepo/pull/266)
- Renaming of `util.sha3` usages to `util.keccak256` and bump `ethereumjs-util` to `v5.2.0` (you should do to if you use `ethereumjs-util`)
- Parallel testing of the`Byzantium` and `Constantinople` state tests, see PR [#317](https://github.com/ethereumjs/ethereumjs-monorepo/pull/317)
- For lower build times our CI configuration now runs solely on `CircleCI` and support for `Travis` have been dropped, see PR [#316](https://github.com/ethereumjs/ethereumjs-monorepo/pull/316)

**BUG FIXES**

- Programmatic runtime errors in the VM execution context (within an opcode) are no longer absorbed and displayed as a VMError but explicitly thrown, allowing for easier discovery of implementation bugs, see PR [#307](https://github.com/ethereumjs/ethereumjs-monorepo/pull/307)
- Fix of the `Bloom.check()` method not working properly, see PR [#311](https://github.com/ethereumjs/ethereumjs-monorepo/pull/311)
- Fix a bug when `REVERT` is used within a `CREATE` context, see PR [#297](https://github.com/ethereumjs/ethereumjs-monorepo/pull/297)
- Fix a bug in `FakeBlockChain` error handing, see PR [#320](https://github.com/ethereumjs/ethereumjs-monorepo/pull/320)

[2.4.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fvm%402.3.5...%40ethereumjs%2Fvm%402.4.0

## [2.3.5] - 2018-04-25

- Fixed `BYTE` opcode return value bug, PR [#293](https://github.com/ethereumjs/ethereumjs-monorepo/pull/293)
- Clean up touched-accounts management in `StateManager`, PR [#287](https://github.com/ethereumjs/ethereumjs-monorepo/pull/287)
- New `stateManager.copy()` function, PR [#276](https://github.com/ethereumjs/ethereumjs-monorepo/pull/276)
- Updated Circle CI configuration to 2.0 format, PR [#292](https://github.com/ethereumjs/ethereumjs-monorepo/pull/292)

[2.3.5]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fvm%402.3.4...%40ethereumjs%2Fvm%402.3.5

## [2.3.4] - 2018-04-06

- Support of external statemanager in VM constructor (experimental), PR [#264](https://github.com/ethereumjs/ethereumjs-monorepo/pull/264)
- `ES5` distribution on npm for better toolchain compatibility, PR [#281](https://github.com/ethereumjs/ethereumjs-monorepo/pull/281)
- `allowUnlimitedContractSize` VM option for debugging purposes, PR [#282](https://github.com/ethereumjs/ethereumjs-monorepo/pull/282)
- Added `gasRefund` to transaction results, PR [#284](https://github.com/ethereumjs/ethereumjs-monorepo/pull/284)
- Test coverage / coveralls support for the library, PR [#270](https://github.com/ethereumjs/ethereumjs-monorepo/pull/270)
- Properly calculate totalgas for large return values, PR [#275](https://github.com/ethereumjs/ethereumjs-monorepo/pull/275)
- Improve iterateVm check output after step hook, PR [#279](https://github.com/ethereumjs/ethereumjs-monorepo/pull/279)

[2.3.4]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fvm%402.3.3...%40ethereumjs%2Fvm%402.3.4

## [2.3.3] - 2018-02-02

- Reworked memory expansion/access for opcodes, PR [#174](https://github.com/ethereumjs/ethereumjs-monorepo/pull/174) (fixes consensus bugs on
  large numbers >= 53 bit for opcodes using memory location)
- Keep stack items as bn.js instances (arithmetic performance increases), PRs [#159](https://github.com/ethereumjs/ethereumjs-monorepo/pull/159), [#254](https://github.com/ethereumjs/ethereumjs-monorepo/pull/254) and [#256](https://github.com/ethereumjs/ethereumjs-monorepo/pull/256)
- More consistent VM error handling, PR [#219](https://github.com/ethereumjs/ethereumjs-monorepo/pull/219)
- Validate stack items after operations, PR [#222](https://github.com/ethereumjs/ethereumjs-monorepo/pull/222)
- Updated `ethereumjs-util` dependency from `4.5.0` to `5.1.x`, PR [#241](https://github.com/ethereumjs/ethereumjs-monorepo/pull/241)
- Fixed child contract deletion bug, PR [#246](https://github.com/ethereumjs/ethereumjs-monorepo/pull/246)
- Fixed a bug associated with direct stack usage, PR [#240](https://github.com/ethereumjs/ethereumjs-monorepo/pull/240)
- Fix error on large return fees, PR [#235](https://github.com/ethereumjs/ethereumjs-monorepo/pull/235)
- Various bug fixes

[2.3.3]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fvm%402.3.2...%40ethereumjs%2Fvm%402.3.3

## [2.3.2] - 2017-10-29

- Better handling of `rustbn.js` exceptions
- Fake (default if non-provided) blockchain fixes
- Testing improvements (separate skip lists)
- Minor optimizations and bug fixes

[2.3.2]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fvm%402.3.1...%40ethereumjs%2Fvm%402.3.2

## [2.3.1] - 2017-10-11

- `Byzantium` compatible
- New opcodes `REVERT`, `RETURNDATA` and `STATICCALL`
- Precompiles for curve operations and bigint mod exp
- Transaction return data in receipts
- For detailed list of changes see PR [#161](https://github.com/ethereumjs/ethereumjs-monorepo/pull/161)
- For a `Spurious Dragon`/`EIP 150` compatible version of this library install latest version of `2.2.x`

[2.3.1]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fvm%402.2.2...%40ethereumjs%2Fvm%402.3.1

## [2.3.0] - Version Skipped due to faulty npm release

## [2.2.2] - 2017-09-19

- Fixed [JS number issues](https://github.com/ethereumjs/ethereumjs-monorepo/pull/168)
  and [certain edge cases](https://github.com/ethereumjs/ethereumjs-monorepo/pull/188)
- Fixed various smaller bugs and improved code consistency
- Some VM speedups
- Testing improvements
- Narrowed down dependencies for library not to break after Byzantium release

[2.2.2]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fvm%402.2.1...%40ethereumjs%2Fvm%402.2.2

## [2.2.1] - 2017-08-04

- Fixed bug prevent the library to be used in the browser

[2.2.1]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fvm%402.2.0...%40ethereumjs%2Fvm%402.2.1

## [2.2.0] - 2017-07-28

- `Spurious Dragon` & `EIP 150` compatible
- Detailed list of changes in pull requests [#147](https://github.com/ethereumjs/ethereumjs-monorepo/pull/147) and [#143](https://github.com/ethereumjs/ethereumjs-monorepo/pull/143)
- Removed `enableHomestead` option when creating a [ new VM object](https://github.com/ethereumjs/ethereumjs-monorepo#new-vmstatetrie-blockchain) (pre-Homestead fork rules not supported any more)

[2.2.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fvm%402.1.0...%40ethereumjs%2Fvm%402.2.0

## [2.1.0] - 2017-06-28

- Homestead compatible
- update state test runner for General State Tests

[2.1.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fvm%402.0.1...%40ethereumjs%2Fvm%402.1.0

## Older releases:

- [2.0.1](https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fvm%402.0.0...%40ethereumjs%2Fvm%402.0.1) - 2016-10-31
- [2.0.0](https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fvm%401.4.0...%40ethereumjs%2Fvm%402.0.0) - 2016-09-26
- [1.4.0](https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fvm%401.3.0...%40ethereumjs%2Fvm%401.4.0) - 2016-05-20
- [1.3.0](https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fvm%401.2.2...%40ethereumjs%2Fvm%401.3.0) - 2016-04-02
- [1.2.2](https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fvm%401.2.1...%40ethereumjs%2Fvm%401.2.2) - 2016-03-31
- [1.2.1](https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fvm%401.2.0...%40ethereumjs%2Fvm%401.2.1) - 2016-03-03
- [1.2.0](https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fvm%401.1.0...%40ethereumjs%2Fvm%401.2.0) - 2016-02-27
- [1.1.0](https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fvm%401.0.4...%40ethereumjs%2Fvm%401.1.0) - 2016-01-09
- [1.0.4](https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fvm%401.0.3...%40ethereumjs%2Fvm%401.0.4) - 2015-12-18
- [1.0.3](https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Fvm%401.0.0...%40ethereumjs%2Fvm%401.0.3) - 2015-11-27
- 1.0.0 - 2015-10-06
