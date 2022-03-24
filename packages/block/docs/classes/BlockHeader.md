[@ethereumjs/block](../README.md) / BlockHeader

# Class: BlockHeader

An object that represents the block header.

## Table of contents

### Constructors

- [constructor](BlockHeader.md#constructor)

### Properties

- [\_common](BlockHeader.md#_common)
- [baseFeePerGas](BlockHeader.md#basefeepergas)
- [coinbase](BlockHeader.md#coinbase)
- [difficulty](BlockHeader.md#difficulty)
- [extraData](BlockHeader.md#extradata)
- [gasLimit](BlockHeader.md#gaslimit)
- [gasUsed](BlockHeader.md#gasused)
- [logsBloom](BlockHeader.md#logsbloom)
- [mixHash](BlockHeader.md#mixhash)
- [nonce](BlockHeader.md#nonce)
- [number](BlockHeader.md#number)
- [parentHash](BlockHeader.md#parenthash)
- [receiptTrie](BlockHeader.md#receipttrie)
- [stateRoot](BlockHeader.md#stateroot)
- [timestamp](BlockHeader.md#timestamp)
- [transactionsTrie](BlockHeader.md#transactionstrie)
- [uncleHash](BlockHeader.md#unclehash)

### Accessors

- [bloom](BlockHeader.md#bloom)
- [prevRandao](BlockHeader.md#prevrandao)

### Methods

- [\_validateHeaderFields](BlockHeader.md#_validateheaderfields)
- [calcNextBaseFee](BlockHeader.md#calcnextbasefee)
- [canonicalDifficulty](BlockHeader.md#canonicaldifficulty)
- [cliqueEpochTransitionSigners](BlockHeader.md#cliqueepochtransitionsigners)
- [cliqueExtraSeal](BlockHeader.md#cliqueextraseal)
- [cliqueExtraVanity](BlockHeader.md#cliqueextravanity)
- [cliqueIsEpochTransition](BlockHeader.md#cliqueisepochtransition)
- [cliqueSigHash](BlockHeader.md#cliquesighash)
- [cliqueSigner](BlockHeader.md#cliquesigner)
- [cliqueVerifySignature](BlockHeader.md#cliqueverifysignature)
- [errorStr](BlockHeader.md#errorstr)
- [hash](BlockHeader.md#hash)
- [isGenesis](BlockHeader.md#isgenesis)
- [raw](BlockHeader.md#raw)
- [serialize](BlockHeader.md#serialize)
- [toJSON](BlockHeader.md#tojson)
- [validate](BlockHeader.md#validate)
- [validateCliqueDifficulty](BlockHeader.md#validatecliquedifficulty)
- [validateDifficulty](BlockHeader.md#validatedifficulty)
- [validateGasLimit](BlockHeader.md#validategaslimit)
- [fromHeaderData](BlockHeader.md#fromheaderdata)
- [fromRLPSerializedHeader](BlockHeader.md#fromrlpserializedheader)
- [fromValuesArray](BlockHeader.md#fromvaluesarray)
- [genesis](BlockHeader.md#genesis)

## Constructors

### constructor

• **new BlockHeader**(`parentHash`, `uncleHash`, `coinbase`, `stateRoot`, `transactionsTrie`, `receiptTrie`, `logsBloom`, `difficulty`, `number`, `gasLimit`, `gasUsed`, `timestamp`, `extraData`, `mixHash`, `nonce`, `options?`, `baseFeePerGas?`)

This constructor takes the values, validates them, assigns them and freezes the object.

**`deprecated`** - Use the public static factory methods to assist in creating a Header object from
varying data types. For a default empty header, use [BlockHeader.fromHeaderData](BlockHeader.md#fromheaderdata).

#### Parameters

| Name | Type |
| :------ | :------ |
| `parentHash` | `Buffer` |
| `uncleHash` | `Buffer` |
| `coinbase` | `Address` |
| `stateRoot` | `Buffer` |
| `transactionsTrie` | `Buffer` |
| `receiptTrie` | `Buffer` |
| `logsBloom` | `Buffer` |
| `difficulty` | `BN` |
| `number` | `BN` |
| `gasLimit` | `BN` |
| `gasUsed` | `BN` |
| `timestamp` | `BN` |
| `extraData` | `Buffer` |
| `mixHash` | `Buffer` |
| `nonce` | `Buffer` |
| `options` | [`BlockOptions`](../interfaces/BlockOptions.md) |
| `baseFeePerGas?` | `BN` |

#### Defined in

[header.ts:225](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L225)

## Properties

### \_common

• `Readonly` **\_common**: `default`

#### Defined in

[header.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L53)

___

### baseFeePerGas

• `Optional` `Readonly` **baseFeePerGas**: `BN`

#### Defined in

[header.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L51)

___

### coinbase

• `Readonly` **coinbase**: `Address`

#### Defined in

[header.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L38)

___

### difficulty

• `Readonly` **difficulty**: `BN`

#### Defined in

[header.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L43)

___

### extraData

• `Readonly` **extraData**: `Buffer`

#### Defined in

[header.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L48)

___

### gasLimit

• `Readonly` **gasLimit**: `BN`

#### Defined in

[header.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L45)

___

### gasUsed

• `Readonly` **gasUsed**: `BN`

#### Defined in

[header.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L46)

___

### logsBloom

• `Readonly` **logsBloom**: `Buffer`

#### Defined in

[header.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L42)

___

### mixHash

• `Readonly` **mixHash**: `Buffer`

#### Defined in

[header.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L49)

___

### nonce

• `Readonly` **nonce**: `Buffer`

#### Defined in

[header.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L50)

___

### number

• `Readonly` **number**: `BN`

#### Defined in

[header.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L44)

___

### parentHash

• `Readonly` **parentHash**: `Buffer`

#### Defined in

[header.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L36)

___

### receiptTrie

• `Readonly` **receiptTrie**: `Buffer`

#### Defined in

[header.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L41)

___

### stateRoot

• `Readonly` **stateRoot**: `Buffer`

#### Defined in

[header.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L39)

___

### timestamp

• `Readonly` **timestamp**: `BN`

#### Defined in

[header.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L47)

___

### transactionsTrie

• `Readonly` **transactionsTrie**: `Buffer`

#### Defined in

[header.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L40)

___

### uncleHash

• `Readonly` **uncleHash**: `Buffer`

#### Defined in

[header.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L37)

## Accessors

### bloom

• `get` **bloom**(): `Buffer`

Backwards compatible alias for [BlockHeader.logsBloom](BlockHeader.md#logsbloom)
(planned to be removed in next major release)

**`deprecated`**

#### Returns

`Buffer`

#### Defined in

[header.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L64)

___

### prevRandao

• `get` **prevRandao**(): `Buffer`

EIP-4399: After merge to PoS, `mixHash` supplanted as `prevRandao`

Note: this is Merge-related functionality and considered `experimental`,
use with care.

#### Returns

`Buffer`

#### Defined in

[header.ts:74](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L74)

## Methods

### \_validateHeaderFields

▸ **_validateHeaderFields**(): `void`

Validates correct buffer lengths, throws if invalid.

#### Returns

`void`

#### Defined in

[header.ts:363](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L363)

___

### calcNextBaseFee

▸ **calcNextBaseFee**(): `BN`

Calculates the base fee for a potential next block

#### Returns

`BN`

#### Defined in

[header.ts:754](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L754)

___

### canonicalDifficulty

▸ **canonicalDifficulty**(`parentBlockHeader`): `BN`

Returns the canonical difficulty for this block.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentBlockHeader` | [`BlockHeader`](BlockHeader.md) | the header from the parent `Block` of this header |

#### Returns

`BN`

#### Defined in

[header.ts:453](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L453)

___

### cliqueEpochTransitionSigners

▸ **cliqueEpochTransitionSigners**(): `Address`[]

Returns a list of signers
(only clique PoA, throws otherwise)

This function throws if not called on an epoch
transition block and should therefore be used
in conjunction with [BlockHeader.cliqueIsEpochTransition](BlockHeader.md#cliqueisepochtransition)

#### Returns

`Address`[]

#### Defined in

[header.ts:912](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L912)

___

### cliqueExtraSeal

▸ **cliqueExtraSeal**(): `Buffer`

Returns extra seal data
(only clique PoA, throws otherwise)

#### Returns

`Buffer`

#### Defined in

[header.ts:883](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L883)

___

### cliqueExtraVanity

▸ **cliqueExtraVanity**(): `Buffer`

Returns extra vanity data
(only clique PoA, throws otherwise)

#### Returns

`Buffer`

#### Defined in

[header.ts:874](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L874)

___

### cliqueIsEpochTransition

▸ **cliqueIsEpochTransition**(): `boolean`

Checks if the block header is an epoch transition
header (only clique PoA, throws otherwise)

#### Returns

`boolean`

#### Defined in

[header.ts:862](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L862)

___

### cliqueSigHash

▸ **cliqueSigHash**(): `Buffer`

PoA clique signature hash without the seal.

#### Returns

`Buffer`

#### Defined in

[header.ts:851](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L851)

___

### cliqueSigner

▸ **cliqueSigner**(): `Address`

Returns the signer address

#### Returns

`Address`

#### Defined in

[header.ts:949](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L949)

___

### cliqueVerifySignature

▸ **cliqueVerifySignature**(`signerList`): `boolean`

Verifies the signature of the block (last 65 bytes of extraData field)
(only clique PoA, throws otherwise)

 Method throws if signature is invalid

#### Parameters

| Name | Type |
| :------ | :------ |
| `signerList` | `Address`[] |

#### Returns

`boolean`

#### Defined in

[header.ts:937](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L937)

___

### errorStr

▸ **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Defined in

[header.ts:1043](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L1043)

___

### hash

▸ **hash**(): `Buffer`

Returns the hash of the block header.

#### Returns

`Buffer`

#### Defined in

[header.ts:821](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L821)

___

### isGenesis

▸ **isGenesis**(): `boolean`

Checks if the block header is a genesis header.

#### Returns

`boolean`

#### Defined in

[header.ts:835](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L835)

___

### raw

▸ **raw**(): [`BlockHeaderBuffer`](../README.md#blockheaderbuffer)

Returns a Buffer Array of the raw Buffers in this header, in order.

#### Returns

[`BlockHeaderBuffer`](../README.md#blockheaderbuffer)

#### Defined in

[header.ts:792](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L792)

___

### serialize

▸ **serialize**(): `Buffer`

Returns the rlp encoding of the block header.

#### Returns

`Buffer`

#### Defined in

[header.ts:966](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L966)

___

### toJSON

▸ **toJSON**(): [`JsonHeader`](../interfaces/JsonHeader.md)

Returns the block header in JSON format.

#### Returns

[`JsonHeader`](../interfaces/JsonHeader.md)

#### Defined in

[header.ts:973](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L973)

___

### validate

▸ **validate**(`blockchain`, `height?`): `Promise`<`void`\>

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
| `blockchain` | [`Blockchain`](../interfaces/Blockchain.md) | validate against an @ethereumjs/blockchain |
| `height?` | `BN` | If this is an uncle header, this is the height of the block that is including it |

#### Returns

`Promise`<`void`\>

#### Defined in

[header.ts:620](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L620)

___

### validateCliqueDifficulty

▸ **validateCliqueDifficulty**(`blockchain`): `boolean`

For poa, validates `difficulty` is correctly identified as INTURN or NOTURN.
Returns false if invalid.

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockchain` | [`Blockchain`](../interfaces/Blockchain.md) |

#### Returns

`boolean`

#### Defined in

[header.ts:541](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L541)

___

### validateDifficulty

▸ **validateDifficulty**(`parentBlockHeader`): `boolean`

Checks that the block's `difficulty` matches the canonical difficulty.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentBlockHeader` | [`BlockHeader`](BlockHeader.md) | the header from the parent `Block` of this header |

#### Returns

`boolean`

#### Defined in

[header.ts:533](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L533)

___

### validateGasLimit

▸ **validateGasLimit**(`parentBlockHeader`): `boolean`

Validates if the block gasLimit remains in the
boundaries set by the protocol.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentBlockHeader` | [`BlockHeader`](BlockHeader.md) | the header from the parent `Block` of this header |

#### Returns

`boolean`

#### Defined in

[header.ts:577](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L577)

___

### fromHeaderData

▸ `Static` **fromHeaderData**(`headerData?`, `opts?`): [`BlockHeader`](BlockHeader.md)

Static constructor to create a block header from a header data dictionary

#### Parameters

| Name | Type |
| :------ | :------ |
| `headerData` | [`HeaderData`](../interfaces/HeaderData.md) |
| `opts` | [`BlockOptions`](../interfaces/BlockOptions.md) |

#### Returns

[`BlockHeader`](BlockHeader.md)

#### Defined in

[header.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L90)

___

### fromRLPSerializedHeader

▸ `Static` **fromRLPSerializedHeader**(`serialized`, `opts?`): [`BlockHeader`](BlockHeader.md)

Static constructor to create a block header from a RLP-serialized header

#### Parameters

| Name | Type |
| :------ | :------ |
| `serialized` | `Buffer` |
| `opts` | [`BlockOptions`](../interfaces/BlockOptions.md) |

#### Returns

[`BlockHeader`](BlockHeader.md)

#### Defined in

[header.ts:144](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L144)

___

### fromValuesArray

▸ `Static` **fromValuesArray**(`values`, `opts?`): [`BlockHeader`](BlockHeader.md)

Static constructor to create a block header from an array of Buffer values

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | [`BlockHeaderBuffer`](../README.md#blockheaderbuffer) |
| `opts` | [`BlockOptions`](../interfaces/BlockOptions.md) |

#### Returns

[`BlockHeader`](BlockHeader.md)

#### Defined in

[header.ts:160](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L160)

___

### genesis

▸ `Static` **genesis**(`headerData?`, `opts?`): [`BlockHeader`](BlockHeader.md)

Alias for [BlockHeader.fromHeaderData](BlockHeader.md#fromheaderdata) with [BlockOptions.initWithGenesisHeader](../interfaces/BlockOptions.md#initwithgenesisheader) set to true.

#### Parameters

| Name | Type |
| :------ | :------ |
| `headerData` | [`HeaderData`](../interfaces/HeaderData.md) |
| `opts?` | [`BlockOptions`](../interfaces/BlockOptions.md) |

#### Returns

[`BlockHeader`](BlockHeader.md)

#### Defined in

[header.ts:213](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L213)
