# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
(modification: no type change headlines) and this project adheres to
[Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 3.2.1 - 2021-06-11

This release comes with significant library usability improvements by allowing a tx instantiation more independently from the `Common` library. This was reported and requested by Web3.js (thanks to @gregthegreek for giving some guidance on the discussion) and others, since they needed the possibility of a tx instantiation in unknown contexts where the chain or HF state is somewhat unclear.

So we've decided to do the following tweaks to the libray:

### New Rules for Internal Default HF Setting

Up to `v3.2.0` it was simply necessary/mandatory to pass in a `Common` instance for typed tx instantiation (otherwise the instantiation process would have thrown an error). For compatibility reasons the tx library was still on `istanbul` as the default HF and both `EIP-2930` (access lists) and `EIP-1559` (fee market) txs needed a higher (`berlin` respectively `london`) HF setting. After some reflection we have therefore decided to adopt our tx library tx type default HF setting and go with the following expanded rule:

"The default HF is the default HF from `Common` if the tx type is active on that HF. Otherwise it is set to the first greater HF where the tx is active."

This has been done in PR [#1292](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1292). This should be safe to do since there just are no txs of the specific type before this new default HF (`EIP-2930`: `istanbul` -> `berlin`, `EIP-1559`: `istanbul` -> `london`).

### More Intelligent Default Chain Instantiation

We tried to get more intelligent on the instantiation with a default chain if no `Common` is provided. On older versions of the library `mainnet` was the default fallback here. For typed txs the chain ID is also provided as a data parameter along instantiation. This chain ID parameter is now used for the internal `Common` and therefore the internal chain setting. Same for signed EIP-155 respecting legacy txs, there the chain ID is now extracted from the `v` parameter provided and initialized with the internal `Common` accordingly. For unsigned or non-EIP-1559 legacy txs the chain for `Common` still defaults back to `mainnet`.

Both these changes with the new default HF rules and the more intelligent chain ID instantiation now allows for an e.g. `EIP-155` tx instantiation without a Common (and generally for a safer non-Common tx instantiation) like this:


```typescript
import Common from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'

const txData = {
  "data": "0x1a8451e600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "gasLimit": "0x02625a00",
  "maxPriorityFeePerGas": "0x01",
  "maxFeePerGas": "0xff",
  "nonce": "0x00",
  "to": "0xcccccccccccccccccccccccccccccccccccccccc",
  "value": "0x0186a0",
  "v": "0x01",
  "r": "0xafb6e247b1c490e284053c87ab5f6b59e219d51f743f7a4d83e400782bc7e4b9",
  "s": "0x479a268e0e0acd4de3f1e28e4fac2a6b32a4195e8dfa9d19147abe8807aa6f64",
  "chainId": "0x01",
  "accessList": [],
  "type": "0x02"
}

const tx = FeeMarketEIP1559Transaction.fromTxData(txData)
```

Note that depending on your usage context it might still be a good idea to instantiate with `Common` since you then have a deterministic state setup, explicitly know what rule set your tx is operating on, and are safe towards eventual future behavioral changes (e.g. on a default HF update along a major version tx library bump).

### Signing Txs with a Hardware Wallet

This is just a note on documentation. There has been some confusion around how to use the tx library for signing of a tx with a HW wallet device (e.g. a Ledger) - see Issue [#1228](https://github.com/ethereumjs/ethereumjs-monorepo/issues/1228) - especially around the usage of `tx.getMessageToSign()`. This is now better documented in the code. Dropping here the associated code on how to do for awareness, for some more context have a look into the associated issue:

```typescript
import { rlp } from 'ethereumjs-util'
import Common from '@ethereumjs/common'
import { Transaction } from '@ethereumjs/tx'

const common = new Common({ chain: 'goerli', hardfork: 'berlin'})
const tx = Transaction.fromTxData({}, { common })

const message = tx.getMessageToSign(false)
const serializedMessage = rlp.encode(message) // use this for the ledger input
```

### Other Changes

- EIP-1559 Validation (spec update): The `maxFeePerGas` and `maxPriorityFeePerGas` parameters are now limited in size to not exceed 256-bit to prevent chain spamming, PR [#1272](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1272)
- Code docs have been improved substantially, PR [#1283](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1283)
- Deprecation of `tx.transactionType`, use `tx.type` instead, PR [#1283](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1283)
- Deprecation of `tx.yParity`, `tx.senderR` and `tx.senderS`, use `v`, `r` and `s` instead, PR [#1283](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1283)

## 3.2.0 - 2021-05-26

### London HF Support

This `Tx` release comes with full support for the `london` hardfork. There is a new [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) transaction type `FeeMarketEIP1559Transaction` (type `2`) added together with the new data types `FeeMarketEIP1559TxData` (for instantiation with the `fromTxData()` static constructor method) and `FeeMarketEIP1559ValuesArray` (for instantiation with `fromValuesArray()`), see PR [#1148](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1148) for the main implementation work.

An `EIP-1559` tx inherits the access list feature from the `AccessListEIP2930Transaction` (type `1`) but comes with its own gas fee market mechanism. There is no `gasPrice` field in favor of two new gas related properties `maxFeePerGas` - which represents the total gas fee the tx sender is willing to pay for the tx (including the priority fee) - and the `maxPriorityFeePerGas` property - which represents the fee the sender is willing to give as some tip to the miner to prioritize a tx.

An `EIP-1559` tx can be instantiated with:

```typescript
import Common from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'

const common = new Common({ chain: 'mainnet', hardfork: 'london' })

const txData = {
  "data": "0x1a8451e600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "gasLimit": "0x02625a00",
  "maxPriorityFeePerGas": "0x01",
  "maxFeePerGas": "0xff",
  "nonce": "0x00",
  "to": "0xcccccccccccccccccccccccccccccccccccccccc",
  "value": "0x0186a0",
  "v": "0x01",
  "r": "0xafb6e247b1c490e284053c87ab5f6b59e219d51f743f7a4d83e400782bc7e4b9",
  "s": "0x479a268e0e0acd4de3f1e28e4fac2a6b32a4195e8dfa9d19147abe8807aa6f64",
  "chainId": "0x01",
  "accessList": [],
  "type": "0x02"
}

const tx = FeeMarketEIP1559Transaction.fromTxData(txData, { common })
```

Please note that the default HF is still set to `istanbul`. You therefore need to explicitly set the `hardfork` parameter for instantiating a `Tx` instance with a `london` HF activated.

### Bug Fixes

- Fixed `getMessageToSign()` return type for typed txs, PR [#1255](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1255)

### Other Changes

- Deprecated `TransactionFactory.getTransactionClass()` method, PR [#1148](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1148)

## 3.1.4 - 2021-04-22

- Added a new boolean `hashMessage` parameter (defaulting to `true`) to `getMessageToSign()` to allow for returning the raw unsigned `EIP-155` tx and not only the hash, PR [#1188](https://github.com/ethereumjs/ethereumjs-monorepo/issues/1188)

## 3.1.3 - 2021-04-09

This release fixes a critical EIP-2930 tx constructor bug which slipped through our tests and where a tx is not initialized correctly when a `v` value of `0` is passed (which is a common case for EIP-2930 txs). This makes the typed txs unusable on prior versions and an update from a version `v3.1.0` or higher is necessary for working typed tx support. Releases `v3.1.0`, `v3.1.1` and `v3.1.2` are marked as deprecated.

**Change Summary**

- Fixed `AccessListEIP2930Transaction` constructor bug with `v=0`, PR [#1190](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1190)
- Added alias `type` for `transactionType` so it can be interpreted correctly for an `AccessListEIP2930Transaction` instantiation when passed to `fromTxData()`, PR [#1185](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1185)
- `TransactionFactory.fromTxData()`: fixed a bug where instantiation was breaking when `type` was passed in as a 0x-prefixed hex string, PR [#1185](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1185)
- `AccessListEIP2930Transaction`: added a test that initializes correctly from its own data (adds coverage for `type` property alias), PR [#1185](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1185)
- EIP-2930 aliases for `senderS`, `senderR`, `yParity` are now marked as *deprecated*, use `v`, `r`, `s` instead

## 3.1.2 - 2021-03-31

**DEPRECATED**: Release is deprecated in favor of 3.1.3 which fixes a critical EIP-2930 tx constructor bug.

- Fixed default value for empty access lists in the `AccessListEIP2930Transaction.fromValuesArray()` static constructor method, PR [#1179](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1179)

## 3.1.1 - 2021-03-23

**DEPRECATED**: Release is deprecated in favor of 3.1.3 which fixes a critical EIP-2930 tx constructor bug.

This release fixes a bug in the `v3.1.0` Berlin HF `@ethereumjs/tx` release where the import path for `eip2930Transaction` was broken on operating systems with case sensitive filename resolution.

The `v3.1.0` release has been deprecated in favor of this new version.

## 3.1.0 - 2021-03-18

**DEPRECATED**: Release is deprecated in favor of 3.1.1 which fixes an import-path bug.

### Berlin HF Support

This release comes with full support for the `berlin` hardfork by updating the library to support typed transactions ([EIP-2718](https://eips.ethereum.org/EIPS/eip-2718)). The first supported transaction type is the `AccessListEIP2930Transaction` ([EIP-2930](https://eips.ethereum.org/EIPS/eip-2930)) which adds optional access lists to the mix and is activated along with the `berlin` hardfork.

`EIP-2930` transactions can be instantiated with:

```typescript
import Common from '@ethereumjs/common'
import { AccessListEIP2930Transaction } from '@ethereumjs/tx'

const common = new Common({ chain: 'mainnet', hardfork: 'berlin' })

const txData = {
  "data": "0x1a8451e600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "gasLimit": "0x02625a00",
  "gasPrice": "0x01",
  "nonce": "0x00",
  "to": "0xcccccccccccccccccccccccccccccccccccccccc",
  "value": "0x0186a0",
  "v": "0x01",
  "r": "0xafb6e247b1c490e284053c87ab5f6b59e219d51f743f7a4d83e400782bc7e4b9",
  "s": "0x479a268e0e0acd4de3f1e28e4fac2a6b32a4195e8dfa9d19147abe8807aa6f64",
  "chainId": "0x01",
  "accessList": [
    {
      "address": "0x0000000000000000000000000000000000000101",
      "storageKeys": [
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        "0x00000000000000000000000000000000000000000000000000000000000060a7"
      ]
    }
  ],
  "type": "0x01"
}

const tx = AccessListEIP2930Transaction.fromTxData(txData, { common })
```

Please note that the default HF is still set to `istanbul`. You therefore need to explicitly set the `hardfork` parameter for instantiating a `Transaction` instance with a `berlin` HF activated.

The now called "legacy" transactions are still supported and can be used as before by using the `Transaction` class. If the type of a tx is only known at runtime there is a new `TransactionFactory` class introduced for your convenience. This factory class decides on the tx type based on the input data and uses the corresponding tx type class for instantiation.

For more guidance on how to use the new tx types and the tx factory have a look at the [README](./README.md) of this library which has received an extensive update along with this release.

#### EthereumJS Libraries - Typed Transactions Readiness

If you are using this library in conjunction with other EthereumJS libraries make sure to minimally have the following library versions installed for typed transaction support:

- `@ethereumjs/common` `v2.2.0`
- `@ethereumjs/tx` `v3.1.0`
- `@ethereumjs/block` `v3.2.0`
- `@ethereumjs/blockchain` `v5.2.0`
- `@ethereumjs/vm` `v5.2.0`

### EIP-2718/EIP-2930 Changes

- Base implementation of both EIPs, PR [#1048](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1048)
- Tx Renaming / Improve backwards-compatibility, PR [#1138](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1138)
- Improvements and additional tests, PR [#1141](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1141)
- Further improvements and small fixes, PR [#1144](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1144)

## 3.0.2 - 2021-02-16

Follow-up release on `v3.0.1` which only partly addressed a **critical** bug. An update is - again - strongly recommended.

- Fixes `tx.isSigned()` always returning true when using the `Tx.fromValuesArray()` static constructor, see PR [#1077](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1077)
- The `Common` instance passed is now copied to avoid side-effects towards the outer common instance on HF updates, PR [#1088](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1088)

## 3.0.1 - 2021-01-20

- Fixes `tx.isSigned()` always returning true - so also for unsigned transactions - due to a bug in the `Transaction` class constructor. This bug is regarded as **critical** and an update is strongly recommended. See PR [#1042](https://github.com/ethereumjs/ethereumjs-monorepo/pull/1042)

## 3.0.0 - 2020-11-24

### New Package Name

**Attention!** This new version is part of a series of EthereumJS releases all moving to a new scoped package name format. In this case the library is renamed as follows:

- `ethereumjs-tx` -> `@ethereumjs/tx`

Please update your library references accordingly or install with:

```shell
npm i @ethereumjs/tx
```

### Major Refactoring - Breaking Changes

This release is a major refactoring of the transaction library to simplify and strengthen its code base. Refactoring work has been done along PR [#812](https://github.com/ethereumjs/ethereumjs-monorepo/pull/812) and PR [#887](https://github.com/ethereumjs/ethereumjs-monorepo/pull/887).

#### New Constructor Params

The constructor has been reworked and new static factory methods `fromTxData`, `fromRlpSerializedTx`, and `fromValuesArray` have been added for a more `TypeScript` friendly and less error-prone way to initialize a `Transaction` object. The direct usage of the main constructor (now just being an alias to `Tx.fromTxData()`, see PR [#944](https://github.com/ethereumjs/ethereumjs-monorepo/pull/944)) is now discouraged and the static factory methods should be used.

**Breaking:** Note that you **need** to adopt your `Transaction` initialization code since the constructor API has changed!

Examples:

```typescript
// Initializing from serialized data
const s1 = tx1.serialize().toString('hex')
const tx = Transaction.fromRlpSerializedTx(toBuffer('0x' + s1))

// Initializing with object
const txData = {
  gasPrice: 1000,
  gasLimit: 10000000,
  value: 42,
}
const tx = Transaction.fromTxData(txData)

// Initializing from array of 0x-prefixed strings.
// First, convert to array of Buffers.
const arr = txFixture.raw.map(toBuffer)
const tx = Transaction.fromValuesArray(arr)
```

Learn more about the full API in the [docs](./docs/README.md).

#### Immutability

The returned transaction is now frozen and immutable. To work with a maliable transaction, copy it with `const fakeTx = Object.create(tx)`. For security reasons it is highly recommended to stay in a freezed `Transaction` context on usage.

If you need `Transaction` mutability - e.g. because you want to subclass `Transaction` and modifiy its behavior - there is a `freeze` option to prevent the `Object.freeze()` call on initialization, see PR [#941](https://github.com/ethereumjs/ethereumjs-monorepo/pull/941).

#### from

The `tx.from` alias was removed, please use `const from = tx.getSenderAddress()`.

#### Message to sign

Getting a message to sign has been changed from calling `tx.hash(false)` to `tx.getMessageToSign()`.

#### Fake Transaction

The `FakeTransaction` class was removed since its functionality can now be implemented with less code. To create a fake tansaction for use in e.g. `VM.runTx()` overwrite `getSenderAddress` with your own `Address`. See a full example in the section in the [README](./README.md#fake-transaction).

### New Default Hardfork

**Breaking:** The default HF on the library has been updated from `petersburg` to `istanbul`, see PR [#906](https://github.com/ethereumjs/ethereumjs-monorepo/pull/906).

The HF setting is now automatically taken from the HF set for `Common.DEAULT_HARDFORK`, see PR [#863](https://github.com/ethereumjs/ethereumjs-monorepo/pull/863).

### Dual ES5 and ES2017 Builds

We significantly updated our internal tool and CI setup along the work on PR [#913](https://github.com/ethereumjs/ethereumjs-monorepo/pull/913) with an update to `ESLint` from `TSLint` for code linting and formatting and the introduction of a new build setup.

Packages now target `ES2017` for Node.js builds (the `main` entrypoint from `package.json`) and introduce a separate `ES5` build distributed along using the `browser` directive as an entrypoint, see PR [#921](https://github.com/ethereumjs/ethereumjs-monorepo/pull/921). This will result in performance benefits for Node.js consumers, see [here](https://github.com/ethereumjs/merkle-patricia-tree/pull/117) for a releated discussion.

### Other Changes

**Changes and Refactoring**

- Updated `ethereumjs-util` to v7, PR [#748](https://github.com/ethereumjs/ethereumjs-monorepo/pull/748)
- Replaced `new Buffer()` (deprecated) statements with `Buffer.from()`, PR [#721](https://github.com/ethereumjs/ethereumjs-monorepo/pull/721)
- Dropped `ethereumjs-testing` dev dependency, PR [#953](https://github.com/ethereumjs/ethereumjs-monorepo/pull/953)

## 3.0.0-rc.1 - 2020-11-19

This is the first release candidate towards a final library release, see [beta.2](https://github.com/ethereumjs/ethereumjs-monorepo/releases/tag/%40ethereumjs%2Ftx%403.0.0-beta.2) and especially [beta.1](https://github.com/ethereumjs/ethereumjs-monorepo/releases/tag/%40ethereumjs%2Ftx%403.0.0-beta.1) release notes for an overview on the full changes since the last publicly released version.

- Dropped `ethereumjs-testing` dev dependency, PR [#953](https://github.com/ethereumjs/ethereumjs-monorepo/pull/953)

## 3.0.0-beta.2 - 2020-11-12

This is the second beta release towards a final library release, see [beta.1 release notes](https://github.com/ethereumjs/ethereumjs-monorepo/releases/tag/%40ethereumjs%2Ftx%403.0.0-beta.1) for an overview on the full changes since the last publicly released version.

- Added `freeze` option to allow for transaction freeze deactivation (e.g. to allow for subclassing tx and adding additional parameters), see PR [#941](https://github.com/ethereumjs/ethereumjs-monorepo/pull/941)
- **Breaking:** Reworked constructor to take in data as a `TxData` typed dictionary instead of single values, the `Tx.fromTxData()` factory method becomes an alias for the constructor with this change, see PR [#944](https://github.com/ethereumjs/ethereumjs-monorepo/pull/944)

## 3.0.0-beta.1 - 2020-10-22

### New Package Name

**Attention!** This new version is part of a series of EthereumJS releases all moving to a new scoped package name format. In this case the library is renamed as follows:

- `ethereumjs-tx` -> `@ethereumjs/tx`

Please update your library references accordingly or install with:

```shell
npm i @ethereumjs/tx
```

### Major Refactoring - Breaking Changes

This release is a major refactoring of the transaction library to simplify and strengthen its code base. Refactoring work has been done along PR [#812](https://github.com/ethereumjs/ethereumjs-monorepo/pull/812) and PR [#887](https://github.com/ethereumjs/ethereumjs-monorepo/pull/887).

#### New Constructor Params

The constructor used to accept a varying amount of options but now has the following shape:

```typescript
  Transaction(
    nonce: BN,
    gasPrice: BN,
    gasLimit: BN,
    to: Address | undefined,
    value: BN,
    data: Buffer,
    v?: BN,
    r?: BN,
    s?: BN,
    opts?: TxOptions
  )
```

Initializing from other data types is assisted with new static factory helpers `fromTxData`, `fromRlpSerializedTx`, and `fromValuesArray`.

Examples:

```typescript
// Initializing from serialized data
const s1 = tx1.serialize().toString('hex')
const tx = Transaction.fromRlpSerializedTx(toBuffer('0x' + s1))

// Initializing with object
const txData = {
  gasPrice: 1000,
  gasLimit: 10000000,
  value: 42,
}
const tx = Transaction.fromTxData(txData)

// Initializing from array of 0x-prefixed strings.
// First, convert to array of Buffers.
const arr = txFixture.raw.map(toBuffer)
const tx = Transaction.fromValuesArray(arr)
```

Learn more about the full API in the [docs](./docs/README.md).

#### Immutability

The returned transaction is now frozen and immutable. To work with a maliable transaction, copy it with `const fakeTx = Object.create(tx)`.

#### from

The `tx.from` alias was removed, please use `const from = tx.getSenderAddress()`.

#### Message to sign

Getting a message to sign has been changed from calling `tx.hash(false)` to `tx.getMessageToSign()`.

#### Fake Transaction

The `FakeTransaction` class was removed since its functionality can now be implemented with less code. To create a fake tansaction for use in e.g. `VM.runTx()` overwrite `getSenderAddress` with your own `Address`. See a full example in the section in the [README](./README.md#fake-transaction).

### New Default Hardfork

**Breaking:** The default HF on the library has been updated from `petersburg` to `istanbul`, see PR [#906](https://github.com/ethereumjs/ethereumjs-monorepo/pull/906).
The HF setting is now automatically taken from the HF set for `Common.DEAULT_HARDFORK`,
see PR [#863](https://github.com/ethereumjs/ethereumjs-monorepo/pull/863).

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

- Updated `ethereumjs-util` to v7,
  PR [#748](https://github.com/ethereumjs/ethereumjs-monorepo/pull/748)
- Replaced `new Buffer()` (deprecated) statements with `Buffer.from()`,
  PR [#721](https://github.com/ethereumjs/ethereumjs-monorepo/pull/721)

## [2.1.2] - 2019-12-19

- Added support for the `MuirGlacier` HF by updating the `ethereumjs-common` dependency
  to [v1.5.0](https://github.com/ethereumjs/ethereumjs-common/releases/tag/v1.5.0)

[2.1.2]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Ftx%402.1.1...%40ethereumjs%2Ftx%402.1.2

## [2.1.1] - 2019-08-30

- Added support for `Istanbul` reduced non-zero call data gas prices
  ([EIP-2028](https://eips.ethereum.org/EIPS/eip-2028)),
  PR [#171](https://github.com/ethereumjs/ethereumjs-tx/pull/171)

[2.1.1]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Ftx%402.1.0...%40ethereumjs%2Ftx%402.1.1

## [2.1.0] - 2019-06-28

**Using testnets and custom/private networks is now easier**

This release is focused on making this library easier to use in chains other than `mainnet`.

Using standard testnets can be as easy as passing their names to the `Transaction` constructor. For
example, `new Transaction(rawTx, {chain: 'ropsten', hardfork: 'byzantium'})` is enough to use this
library with Ropsten on Byzantium.

If you are using a custom network, you can take advantage of [ethereumjs-common](https://github.com/ethereumjs/ethereumjs-common),
which contains all the network parameters. In this version of `ethereumjs-tx` you can use its new
`Common.forCustomNetwork` to create a `Common` instance based on a standard network with some
parameters changed. You can see an example of how to do this [here](https://github.com/ethereumjs/ethereumjs-common/blob/9e624f86107cea904d8171524130d92c99bf9302/src/index.ts).

List of changes:

- Upgraded [ethereumjs-common](https://github.com/ethereumjs/ethereumjs-common) to `^1.3.0`
- Added more documentation and examples on how to create transactions for public testnets and
  custom networks.

[2.1.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Ftx%402.0.0...%40ethereumjs%2Ftx%402.1.0

## [2.0.0] - 2019-06-03

**TypeScript / Module Import / Node Support**

First `TypeScript` based release of the library, see
PR [#145](https://github.com/ethereumjs/ethereumjs-tx/pull/145) for details.

This comes along with some changes on the API, Node import of the exposed
classes now goes like this:

```javascript
const EthereumTx = require('ethereumjs-transaction').Transaction
const FakeEthereumTx = require('ethereumjs-transaction').FakeTransaction
```

The library now also comes with a **type declaration file** distributed along
with the package published.

Along with this release we drop official support for `Node` versions `4`,`5`
and `6`. Officially tested versions are now `Node` `8`, `10` and `11`
(see PRs [#138](https://github.com/ethereumjs/ethereumjs-tx/pull/138) and
[#146](https://github.com/ethereumjs/ethereumjs-tx/pull/146)).

**Hardfork Support / Official Test Updates**

Along with a long overdue update of the official Ethereum Transaction tests
(see PRs [#131](https://github.com/ethereumjs/ethereumjs-tx/pull/131) and
[#138](https://github.com/ethereumjs/ethereumjs-tx/pull/138) for
`FakeTransaction`) and
an introduction of setting chain and hardfork by using our shared
[ethereumjs-common](https://github.com/ethereumjs/ethereumjs-common) class
(see PR [#131](https://github.com/ethereumjs/ethereumjs-tx/pull/130)) the
transaction library now supports all HFs up to the `Petersburg` hardfork,
see [constructor option docs](https://github.com/ethereumjs/ethereumjs-tx/blob/master/docs/interfaces/transactionoptions.md) for information on instantiation and default values (current hardfork default: `petersburg`).

API Changes:

- Removal of the `data.chainId` parameter, use the `opts.chain` parameter or a custom `Common` instance

**Default EIP-155 Support**

Along with defaulting to a post-`Spurious Dragon` HF replay protection from
[EIP-155](https://eips.ethereum.org/EIPS/eip-155) is now activated by default. Transactions are subsequently also by default signed with `EIP-155` replay protection,
see PRs [#153](https://github.com/ethereumjs/ethereumjs-tx/pull/153),
[#147](https://github.com/ethereumjs/ethereumjs-tx/pull/147) and
[#143](https://github.com/ethereumjs/ethereumjs-tx/pull/143).

This comes with some changes in how different `v` values passed on instantation
or changed on runtime are handled:

- The constructor throws if the `v` value is present, indicates that `EIP-155`
  was enabled, and the chain id it indicates doesn't match the one of the
  internal `common` object
- No default `v` is set. If a transaction isn't signed, it would be an empty
  buffer
- If `v` is changed after construction its value is validated in its setter

For activating non-`EIP-155` behavior instantiate the transaction with a
pre-`Spurious Dragon` hardfork option.

[2.0.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Ftx%401.3.7...%40ethereumjs%2Ftx%402.0.0

## [1.3.7] - 2018-07-25

- Fix bug causing `FakeTransaction.from` to not retrieve sender address from tx signature, see PR [#118](https://github.com/ethereumjs/ethereumjs-tx/pull/118)

[1.3.7]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Ftx%401.3.6...%40ethereumjs%2Ftx%401.3.7

## [1.3.6] - 2018-07-02

- Fixes issue [#108](https://github.com/ethereumjs/ethereumjs-tx/issues/108) with the `FakeTransaction.hash()` function by reverting the introduced signature handling changes in Fake transaction hash creation from PR [#94](https://github.com/ethereumjs/ethereumjs-tx/pull/94) introduced in `v1.3.5`. The signature is now again only created and added to the hash when `from` address is set and `from` is not defaulting to the zero adress any more, see PR [#110](https://github.com/ethereumjs/ethereumjs-tx/pull/110)
- Added additional tests to cover issue described above

[1.3.6]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Ftx%401.3.5...%40ethereumjs%2Ftx%401.3.6

## [1.3.5] - 2018-06-22

- Include signature by default in `FakeTransaction.hash`, PR [#97](https://github.com/ethereumjs/ethereumjs-tx/pull/97)
- Fix `FakeTransaction` signature failure bug, PR [#94](https://github.com/ethereumjs/ethereumjs-tx/pull/94)

[1.3.5]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Ftx%401.3.4...%40ethereumjs%2Ftx%401.3.5

## [1.3.4] - 2018-03-06

- Fix a bug producing hash collisions on `FakeTransaction` for different senders, PR [#81](https://github.com/ethereumjs/ethereumjs-tx/pull/81)
- Switched from deprecated `es2015` to `env` babel preset, PR [#86](https://github.com/ethereumjs/ethereumjs-tx/pull/86)
- Dropped Node 4 support

[1.3.4]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Ftx%401.3.3...%40ethereumjs%2Ftx%401.3.4

## [1.3.3] - 2017-07-12

- Allow zeros in `v`,`r`,`s` signature values
- Dropped `browserify` transform from `package.json`
- (combined v1.3.3 and v1.3.2 release notes)

[1.3.3]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Ftx%401.3.1...%40ethereumjs%2Ftx%401.3.3

## [1.3.1] - 2017-05-13

- Added `ES5` build

[1.3.1]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Ftx%401.3.0...%40ethereumjs%2Ftx%401.3.1

## [1.3.0] - 2017-04-24

- `EIP155`: allow `v` value to be greater than one byte (replay attack protection)
- Added `browserify` `ES2015` transform to `package.json`
- Improved documentation
- (combined v1.3.0, v1.2.5 and v1.2.4 release notes)

[1.3.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Ftx%401.2.3...%40ethereumjs%2Ftx%401.3.0

## [1.2.3] - 2017-01-30

- `EIP155` hash implementation
- README example and doc fixes

[1.2.3]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Ftx%401.2.2...%40ethereumjs%2Ftx%401.2.3

## [1.2.2] - 2016-12-15

- Moved `chainId` param to `txParams`, parse `sig` for `chainId` (`EIP155` refactor)
- Test improvements
- (combined v1.2.2 and v1.2.1 release notes)

[1.2.2]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Ftx%401.2.0...%40ethereumjs%2Ftx%401.2.2

## [1.2.0] - 2016-12-14

- Added `EIP155` changes
- Renamed `chain_id` to `chainId`
- Node 4/5 compatibility
- `ES6` standards

[1.2.0]: https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Ftx%401.1.4...%40ethereumjs%2Ftx%401.2.0

## Older releases:

- [1.1.4](https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Ftx%401.1.3...%40ethereumjs%2Ftx%401.1.4) - 2016-11-17
- [1.1.3](https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Ftx%401.1.2...%40ethereumjs%2Ftx%401.1.3) - 2016-11-10
- [1.1.2](https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Ftx%401.1.1...%40ethereumjs%2Ftx%401.1.2) - 2016-07-17
- [1.1.1](https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Ftx%401.1.0...%40ethereumjs%2Ftx%401.1.1) - 2016-03-05
- [1.1.0](https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Ftx%401.0.1...%40ethereumjs%2Ftx%401.1.0) - 2016-03-03
- [1.0.1](https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Ftx%401.0.0...%40ethereumjs%2Ftx%401.0.1) - 2016-03-03
- [1.0.0](https://github.com/ethereumjs/ethereumjs-monorepo/compare/%40ethereumjs%2Ftx%400.7.3...%40ethereumjs%2Ftx%401.0.0) - 2016-02-11
