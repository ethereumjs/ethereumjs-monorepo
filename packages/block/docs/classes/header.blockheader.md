[@ethereumjs/block](../README.md) / [header](../modules/header.md) / BlockHeader

# Class: BlockHeader

[header](../modules/header.md).BlockHeader

An object that represents the block header.

## Table of contents

### Constructors

- [constructor](header.blockheader.md#constructor)

### Properties

- [\_common](header.blockheader.md#_common)
- [\_errorPostfix](header.blockheader.md#_errorpostfix)
- [baseFeePerGas](header.blockheader.md#basefeepergas)
- [bloom](header.blockheader.md#bloom)
- [coinbase](header.blockheader.md#coinbase)
- [difficulty](header.blockheader.md#difficulty)
- [extraData](header.blockheader.md#extradata)
- [gasLimit](header.blockheader.md#gaslimit)
- [gasUsed](header.blockheader.md#gasused)
- [mixHash](header.blockheader.md#mixhash)
- [nonce](header.blockheader.md#nonce)
- [number](header.blockheader.md#number)
- [parentHash](header.blockheader.md#parenthash)
- [receiptTrie](header.blockheader.md#receipttrie)
- [stateRoot](header.blockheader.md#stateroot)
- [timestamp](header.blockheader.md#timestamp)
- [transactionsTrie](header.blockheader.md#transactionstrie)
- [uncleHash](header.blockheader.md#unclehash)

### Methods

- [\_validateHeaderFields](header.blockheader.md#_validateheaderfields)
- [calcNextBaseFee](header.blockheader.md#calcnextbasefee)
- [canonicalDifficulty](header.blockheader.md#canonicaldifficulty)
- [cliqueEpochTransitionSigners](header.blockheader.md#cliqueepochtransitionsigners)
- [cliqueExtraSeal](header.blockheader.md#cliqueextraseal)
- [cliqueExtraVanity](header.blockheader.md#cliqueextravanity)
- [cliqueIsEpochTransition](header.blockheader.md#cliqueisepochtransition)
- [cliqueSigHash](header.blockheader.md#cliquesighash)
- [cliqueSigner](header.blockheader.md#cliquesigner)
- [cliqueVerifySignature](header.blockheader.md#cliqueverifysignature)
- [hash](header.blockheader.md#hash)
- [isGenesis](header.blockheader.md#isgenesis)
- [raw](header.blockheader.md#raw)
- [serialize](header.blockheader.md#serialize)
- [toJSON](header.blockheader.md#tojson)
- [validate](header.blockheader.md#validate)
- [validateCliqueDifficulty](header.blockheader.md#validatecliquedifficulty)
- [validateDifficulty](header.blockheader.md#validatedifficulty)
- [validateGasLimit](header.blockheader.md#validategaslimit)
- [fromHeaderData](header.blockheader.md#fromheaderdata)
- [fromRLPSerializedHeader](header.blockheader.md#fromrlpserializedheader)
- [fromValuesArray](header.blockheader.md#fromvaluesarray)
- [genesis](header.blockheader.md#genesis)

## Constructors

### constructor

\+ **new BlockHeader**(`parentHash`: *Buffer*, `uncleHash`: *Buffer*, `coinbase`: *Address*, `stateRoot`: *Buffer*, `transactionsTrie`: *Buffer*, `receiptTrie`: *Buffer*, `bloom`: *Buffer*, `difficulty`: *BN*, `number`: *BN*, `gasLimit`: *BN*, `gasUsed`: *BN*, `timestamp`: *BN*, `extraData`: *Buffer*, `mixHash`: *Buffer*, `nonce`: *Buffer*, `options?`: [*BlockOptions*](../interfaces/types.blockoptions.md), `baseFeePerGas?`: *BN*): [*BlockHeader*](header.blockheader.md)

This constructor takes the values, validates them, assigns them and freezes the object.

**`deprecated`** - Use the public static factory methods to assist in creating a Header object from
varying data types. For a default empty header, use `BlockHeader.fromHeaderData()`.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `parentHash` | *Buffer* | - |
| `uncleHash` | *Buffer* | - |
| `coinbase` | *Address* | - |
| `stateRoot` | *Buffer* | - |
| `transactionsTrie` | *Buffer* | - |
| `receiptTrie` | *Buffer* | - |
| `bloom` | *Buffer* | - |
| `difficulty` | *BN* | - |
| `number` | *BN* | - |
| `gasLimit` | *BN* | - |
| `gasUsed` | *BN* | - |
| `timestamp` | *BN* | - |
| `extraData` | *Buffer* | - |
| `mixHash` | *Buffer* | - |
| `nonce` | *Buffer* | - |
| `options` | [*BlockOptions*](../interfaces/types.blockoptions.md) | {} |
| `baseFeePerGas?` | *BN* | - |

**Returns:** [*BlockHeader*](header.blockheader.md)

Defined in: [header.ts:174](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L174)

## Properties

### \_common

• `Readonly` **\_common**: *default*

Defined in: [header.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L48)

___

### \_errorPostfix

• **\_errorPostfix**: *string*= ''

Defined in: [header.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L49)

___

### baseFeePerGas

• `Optional` `Readonly` **baseFeePerGas**: *BN*

Defined in: [header.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L46)

___

### bloom

• `Readonly` **bloom**: *Buffer*

Defined in: [header.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L37)

___

### coinbase

• `Readonly` **coinbase**: *Address*

Defined in: [header.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L33)

___

### difficulty

• `Readonly` **difficulty**: *BN*

Defined in: [header.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L38)

___

### extraData

• `Readonly` **extraData**: *Buffer*

Defined in: [header.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L43)

___

### gasLimit

• `Readonly` **gasLimit**: *BN*

Defined in: [header.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L40)

___

### gasUsed

• `Readonly` **gasUsed**: *BN*

Defined in: [header.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L41)

___

### mixHash

• `Readonly` **mixHash**: *Buffer*

Defined in: [header.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L44)

___

### nonce

• `Readonly` **nonce**: *Buffer*

Defined in: [header.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L45)

___

### number

• `Readonly` **number**: *BN*

Defined in: [header.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L39)

___

### parentHash

• `Readonly` **parentHash**: *Buffer*

Defined in: [header.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L31)

___

### receiptTrie

• `Readonly` **receiptTrie**: *Buffer*

Defined in: [header.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L36)

___

### stateRoot

• `Readonly` **stateRoot**: *Buffer*

Defined in: [header.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L34)

___

### timestamp

• `Readonly` **timestamp**: *BN*

Defined in: [header.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L42)

___

### transactionsTrie

• `Readonly` **transactionsTrie**: *Buffer*

Defined in: [header.ts:35](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L35)

___

### uncleHash

• `Readonly` **uncleHash**: *Buffer*

Defined in: [header.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L32)

## Methods

### \_validateHeaderFields

▸ **_validateHeaderFields**(): *void*

Validates correct buffer lengths, throws if invalid.

**Returns:** *void*

Defined in: [header.ts:302](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L302)

___

### calcNextBaseFee

▸ **calcNextBaseFee**(): *BN*

Calculates the base fee for a potential next block

**Returns:** *BN*

Defined in: [header.ts:607](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L607)

___

### canonicalDifficulty

▸ **canonicalDifficulty**(`parentBlockHeader`: [*BlockHeader*](header.blockheader.md)): *BN*

Returns the canonical difficulty for this block.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentBlockHeader` | [*BlockHeader*](header.blockheader.md) | the header from the parent `Block` of this header |

**Returns:** *BN*

Defined in: [header.ts:332](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L332)

___

### cliqueEpochTransitionSigners

▸ **cliqueEpochTransitionSigners**(): *Address*[]

Returns a list of signers
(only clique PoA, throws otherwise)

This function throws if not called on an epoch
transition block and should therefore be used
in conjunction with `cliqueIsEpochTransition()`

**Returns:** *Address*[]

Defined in: [header.ts:752](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L752)

___

### cliqueExtraSeal

▸ **cliqueExtraSeal**(): *Buffer*

Returns extra seal data
(only clique PoA, throws otherwise)

**Returns:** *Buffer*

Defined in: [header.ts:723](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L723)

___

### cliqueExtraVanity

▸ **cliqueExtraVanity**(): *Buffer*

Returns extra vanity data
(only clique PoA, throws otherwise)

**Returns:** *Buffer*

Defined in: [header.ts:714](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L714)

___

### cliqueIsEpochTransition

▸ **cliqueIsEpochTransition**(): *boolean*

Checks if the block header is an epoch transition
header (only clique PoA, throws otherwise)

**Returns:** *boolean*

Defined in: [header.ts:702](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L702)

___

### cliqueSigHash

▸ **cliqueSigHash**(): *Buffer*

PoA clique signature hash without the seal.

**Returns:** *Buffer*

Defined in: [header.ts:691](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L691)

___

### cliqueSigner

▸ **cliqueSigner**(): *Address*

Returns the signer address

**Returns:** *Address*

Defined in: [header.ts:788](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L788)

___

### cliqueVerifySignature

▸ **cliqueVerifySignature**(`signerList`: *Address*[]): *boolean*

Verifies the signature of the block (last 65 bytes of extraData field)
(only clique PoA, throws otherwise)

 Method throws if signature is invalid

#### Parameters

| Name | Type |
| :------ | :------ |
| `signerList` | *Address*[] |

**Returns:** *boolean*

Defined in: [header.ts:776](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L776)

___

### hash

▸ **hash**(): *Buffer*

Returns the hash of the block header.

**Returns:** *Buffer*

Defined in: [header.ts:671](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L671)

___

### isGenesis

▸ **isGenesis**(): *boolean*

Checks if the block header is a genesis header.

**Returns:** *boolean*

Defined in: [header.ts:678](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L678)

___

### raw

▸ **raw**(): [*BlockHeaderBuffer*](../modules/types.md#blockheaderbuffer)

Returns a Buffer Array of the raw Buffers in this header, in order.

**Returns:** [*BlockHeaderBuffer*](../modules/types.md#blockheaderbuffer)

Defined in: [header.ts:642](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L642)

___

### serialize

▸ **serialize**(): *Buffer*

Returns the rlp encoding of the block header.

**Returns:** *Buffer*

Defined in: [header.ts:805](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L805)

___

### toJSON

▸ **toJSON**(): [*JsonHeader*](../interfaces/types.jsonheader.md)

Returns the block header in JSON format.

**Returns:** [*JsonHeader*](../interfaces/types.jsonheader.md)

Defined in: [header.ts:812](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L812)

___

### validate

▸ **validate**(`blockchain`: [*Blockchain*](../interfaces/types.blockchain.md), `height?`: *BN*): *Promise*<void\>

Validates the block header, throwing if invalid. It is being validated against the reported `parentHash`.
It verifies the current block against the `parentHash`:
- The `parentHash` is part of the blockchain (it is a valid header)
- Current block number is parent block number + 1
- Current block has a strictly higher timestamp
- Additional PoW checks ->
  - Current block has valid difficulty and gas limit
  - In case that the header is an uncle header, it should not be too old or young in the chain.
- Additional PoA clique checks ->
  - Various extraData checks
  - Checks on coinbase and mixHash
  - Current block has a timestamp diff greater or equal to PERIOD
  - Current block has difficulty correctly marked as INTURN or NOTURN

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockchain` | [*Blockchain*](../interfaces/types.blockchain.md) | validate against an @ethereumjs/blockchain |
| `height?` | *BN* | If this is an uncle header, this is the height of the block that is including it |

**Returns:** *Promise*<void\>

Defined in: [header.ts:492](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L492)

___

### validateCliqueDifficulty

▸ **validateCliqueDifficulty**(`blockchain`: [*Blockchain*](../interfaces/types.blockchain.md)): *boolean*

For poa, validates `difficulty` is correctly identified as INTURN or NOTURN.
Returns false if invalid.

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockchain` | [*Blockchain*](../interfaces/types.blockchain.md) |

**Returns:** *boolean*

Defined in: [header.ts:416](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L416)

___

### validateDifficulty

▸ **validateDifficulty**(`parentBlockHeader`: [*BlockHeader*](header.blockheader.md)): *boolean*

Checks that the block's `difficulty` matches the canonical difficulty.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentBlockHeader` | [*BlockHeader*](header.blockheader.md) | the header from the parent `Block` of this header |

**Returns:** *boolean*

Defined in: [header.ts:408](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L408)

___

### validateGasLimit

▸ **validateGasLimit**(`parentBlockHeader`: [*BlockHeader*](header.blockheader.md)): *boolean*

Validates if the block gasLimit remains in the
boundaries set by the protocol.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentBlockHeader` | [*BlockHeader*](header.blockheader.md) | the header from the parent `Block` of this header |

**Returns:** *boolean*

Defined in: [header.ts:450](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L450)

___

### fromHeaderData

▸ `Static` **fromHeaderData**(`headerData?`: [*HeaderData*](../interfaces/types.headerdata.md), `opts?`: [*BlockOptions*](../interfaces/types.blockoptions.md)): [*BlockHeader*](header.blockheader.md)

Static constructor to create a block header from a header data dictionary

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `headerData` | [*HeaderData*](../interfaces/types.headerdata.md) | {} |
| `opts` | [*BlockOptions*](../interfaces/types.blockoptions.md) | {} |

**Returns:** [*BlockHeader*](header.blockheader.md)

Defined in: [header.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L57)

___

### fromRLPSerializedHeader

▸ `Static` **fromRLPSerializedHeader**(`serialized`: *Buffer*, `opts?`: [*BlockOptions*](../interfaces/types.blockoptions.md)): [*BlockHeader*](header.blockheader.md)

Static constructor to create a block header from a RLP-serialized header

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `serialized` | *Buffer* | - |
| `opts` | [*BlockOptions*](../interfaces/types.blockoptions.md) | {} |

**Returns:** [*BlockHeader*](header.blockheader.md)

Defined in: [header.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L104)

___

### fromValuesArray

▸ `Static` **fromValuesArray**(`values`: [*BlockHeaderBuffer*](../modules/types.md#blockheaderbuffer), `opts?`: [*BlockOptions*](../interfaces/types.blockoptions.md)): [*BlockHeader*](header.blockheader.md)

Static constructor to create a block header from an array of Buffer values

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `values` | [*BlockHeaderBuffer*](../modules/types.md#blockheaderbuffer) | - |
| `opts` | [*BlockOptions*](../interfaces/types.blockoptions.md) | {} |

**Returns:** [*BlockHeader*](header.blockheader.md)

Defined in: [header.ts:120](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L120)

___

### genesis

▸ `Static` **genesis**(`headerData?`: [*HeaderData*](../interfaces/types.headerdata.md), `opts?`: [*BlockOptions*](../interfaces/types.blockoptions.md)): [*BlockHeader*](header.blockheader.md)

Alias for Header.fromHeaderData() with initWithGenesisHeader set to true.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `headerData` | [*HeaderData*](../interfaces/types.headerdata.md) | {} |
| `opts?` | [*BlockOptions*](../interfaces/types.blockoptions.md) | - |

**Returns:** [*BlockHeader*](header.blockheader.md)

Defined in: [header.ts:171](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L171)
