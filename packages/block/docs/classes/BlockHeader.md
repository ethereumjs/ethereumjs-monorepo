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
- [excessDataGas](BlockHeader.md#excessdatagas)
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
- [withdrawalsRoot](BlockHeader.md#withdrawalsroot)

### Accessors

- [prevRandao](BlockHeader.md#prevrandao)

### Methods

- [\_consensusFormatValidation](BlockHeader.md#_consensusformatvalidation)
- [\_genericFormatValidation](BlockHeader.md#_genericformatvalidation)
- [calcNextBaseFee](BlockHeader.md#calcnextbasefee)
- [cliqueEpochTransitionSigners](BlockHeader.md#cliqueepochtransitionsigners)
- [cliqueExtraSeal](BlockHeader.md#cliqueextraseal)
- [cliqueExtraVanity](BlockHeader.md#cliqueextravanity)
- [cliqueIsEpochTransition](BlockHeader.md#cliqueisepochtransition)
- [cliqueSigHash](BlockHeader.md#cliquesighash)
- [cliqueSigner](BlockHeader.md#cliquesigner)
- [cliqueVerifySignature](BlockHeader.md#cliqueverifysignature)
- [errorStr](BlockHeader.md#errorstr)
- [ethashCanonicalDifficulty](BlockHeader.md#ethashcanonicaldifficulty)
- [hash](BlockHeader.md#hash)
- [isGenesis](BlockHeader.md#isgenesis)
- [raw](BlockHeader.md#raw)
- [serialize](BlockHeader.md#serialize)
- [toJSON](BlockHeader.md#tojson)
- [validateGasLimit](BlockHeader.md#validategaslimit)
- [fromHeaderData](BlockHeader.md#fromheaderdata)
- [fromRLPSerializedHeader](BlockHeader.md#fromrlpserializedheader)
- [fromValuesArray](BlockHeader.md#fromvaluesarray)

## Constructors

### constructor

• **new BlockHeader**(`headerData`, `options?`)

This constructor takes the values, validates them, assigns them and freezes the object.

**`Deprecated`**

Use the public static factory methods to assist in creating a Header object from
varying data types. For a default empty header, use [fromHeaderData](BlockHeader.md#fromheaderdata).

#### Parameters

| Name | Type |
| :------ | :------ |
| `headerData` | [`HeaderData`](../interfaces/HeaderData.md) |
| `options` | [`BlockOptions`](../interfaces/BlockOptions.md) |

#### Defined in

[header.ts:126](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L126)

## Properties

### \_common

• `Readonly` **\_common**: `Common`

#### Defined in

[header.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L57)

___

### baseFeePerGas

• `Optional` `Readonly` **baseFeePerGas**: `bigint`

#### Defined in

[header.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L53)

___

### coinbase

• `Readonly` **coinbase**: `Address`

#### Defined in

[header.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L40)

___

### difficulty

• `Readonly` **difficulty**: `bigint`

#### Defined in

[header.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L45)

___

### excessDataGas

• `Optional` `Readonly` **excessDataGas**: `bigint`

#### Defined in

[header.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L55)

___

### extraData

• `Readonly` **extraData**: `Buffer`

#### Defined in

[header.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L50)

___

### gasLimit

• `Readonly` **gasLimit**: `bigint`

#### Defined in

[header.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L47)

___

### gasUsed

• `Readonly` **gasUsed**: `bigint`

#### Defined in

[header.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L48)

___

### logsBloom

• `Readonly` **logsBloom**: `Buffer`

#### Defined in

[header.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L44)

___

### mixHash

• `Readonly` **mixHash**: `Buffer`

#### Defined in

[header.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L51)

___

### nonce

• `Readonly` **nonce**: `Buffer`

#### Defined in

[header.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L52)

___

### number

• `Readonly` **number**: `bigint`

#### Defined in

[header.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L46)

___

### parentHash

• `Readonly` **parentHash**: `Buffer`

#### Defined in

[header.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L38)

___

### receiptTrie

• `Readonly` **receiptTrie**: `Buffer`

#### Defined in

[header.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L43)

___

### stateRoot

• `Readonly` **stateRoot**: `Buffer`

#### Defined in

[header.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L41)

___

### timestamp

• `Readonly` **timestamp**: `bigint`

#### Defined in

[header.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L49)

___

### transactionsTrie

• `Readonly` **transactionsTrie**: `Buffer`

#### Defined in

[header.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L42)

___

### uncleHash

• `Readonly` **uncleHash**: `Buffer`

#### Defined in

[header.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L39)

___

### withdrawalsRoot

• `Optional` `Readonly` **withdrawalsRoot**: `Buffer`

#### Defined in

[header.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L54)

## Accessors

### prevRandao

• `get` **prevRandao**(): `Buffer`

EIP-4399: After merge to PoS, `mixHash` supplanted as `prevRandao`

#### Returns

`Buffer`

#### Defined in

[header.ts:66](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L66)

## Methods

### \_consensusFormatValidation

▸ **_consensusFormatValidation**(): `void`

Checks static parameters related to consensus algorithm

**`Throws`**

if any check fails

#### Returns

`void`

#### Defined in

[header.ts:349](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L349)

___

### \_genericFormatValidation

▸ **_genericFormatValidation**(): `void`

Validates correct buffer lengths, throws if invalid.

#### Returns

`void`

#### Defined in

[header.ts:272](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L272)

___

### calcNextBaseFee

▸ **calcNextBaseFee**(): `bigint`

Calculates the base fee for a potential next block

#### Returns

`bigint`

#### Defined in

[header.ts:481](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L481)

___

### cliqueEpochTransitionSigners

▸ **cliqueEpochTransitionSigners**(): `Address`[]

Returns a list of signers
(only clique PoA, throws otherwise)

This function throws if not called on an epoch
transition block and should therefore be used
in conjunction with [cliqueIsEpochTransition](BlockHeader.md#cliqueisepochtransition)

#### Returns

`Address`[]

#### Defined in

[header.ts:731](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L731)

___

### cliqueExtraSeal

▸ **cliqueExtraSeal**(): `Buffer`

Returns extra seal data
(only clique PoA, throws otherwise)

#### Returns

`Buffer`

#### Defined in

[header.ts:698](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L698)

___

### cliqueExtraVanity

▸ **cliqueExtraVanity**(): `Buffer`

Returns extra vanity data
(only clique PoA, throws otherwise)

#### Returns

`Buffer`

#### Defined in

[header.ts:689](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L689)

___

### cliqueIsEpochTransition

▸ **cliqueIsEpochTransition**(): `boolean`

Checks if the block header is an epoch transition
header (only clique PoA, throws otherwise)

#### Returns

`boolean`

#### Defined in

[header.ts:677](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L677)

___

### cliqueSigHash

▸ **cliqueSigHash**(): `Buffer`

PoA clique signature hash without the seal.

#### Returns

`Buffer`

#### Defined in

[header.ts:666](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L666)

___

### cliqueSigner

▸ **cliqueSigner**(): `Address`

Returns the signer address

#### Returns

`Address`

#### Defined in

[header.ts:768](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L768)

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

[header.ts:756](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L756)

___

### errorStr

▸ **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Defined in

[header.ts:847](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L847)

___

### ethashCanonicalDifficulty

▸ **ethashCanonicalDifficulty**(`parentBlockHeader`): `bigint`

Returns the canonical difficulty for this block.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentBlockHeader` | [`BlockHeader`](BlockHeader.md) | the header from the parent `Block` of this header |

#### Returns

`bigint`

#### Defined in

[header.ts:593](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L593)

___

### hash

▸ **hash**(): `Buffer`

Returns the hash of the block header.

#### Returns

`Buffer`

#### Defined in

[header.ts:561](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L561)

___

### isGenesis

▸ **isGenesis**(): `boolean`

Checks if the block header is a genesis header.

#### Returns

`boolean`

#### Defined in

[header.ts:575](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L575)

___

### raw

▸ **raw**(): [`BlockHeaderBuffer`](../README.md#blockheaderbuffer)

Returns a Buffer Array of the raw Buffers in this header, in order.

#### Returns

[`BlockHeaderBuffer`](../README.md#blockheaderbuffer)

#### Defined in

[header.ts:525](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L525)

___

### serialize

▸ **serialize**(): `Buffer`

Returns the rlp encoding of the block header.

#### Returns

`Buffer`

#### Defined in

[header.ts:785](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L785)

___

### toJSON

▸ **toJSON**(): [`JsonHeader`](../interfaces/JsonHeader.md)

Returns the block header in JSON format.

#### Returns

[`JsonHeader`](../interfaces/JsonHeader.md)

#### Defined in

[header.ts:792](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L792)

___

### validateGasLimit

▸ **validateGasLimit**(`parentBlockHeader`): `void`

Validates if the block gasLimit remains in the boundaries set by the protocol.
Throws if out of bounds.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `parentBlockHeader` | [`BlockHeader`](BlockHeader.md) | the header from the parent `Block` of this header |

#### Returns

`void`

#### Defined in

[header.ts:439](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L439)

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

[header.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L82)

___

### fromRLPSerializedHeader

▸ `Static` **fromRLPSerializedHeader**(`serializedHeaderData`, `opts?`): [`BlockHeader`](BlockHeader.md)

Static constructor to create a block header from a RLP-serialized header

#### Parameters

| Name | Type |
| :------ | :------ |
| `serializedHeaderData` | `Buffer` |
| `opts` | [`BlockOptions`](../interfaces/BlockOptions.md) |

#### Returns

[`BlockHeader`](BlockHeader.md)

#### Defined in

[header.ts:92](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L92)

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

[header.ts:106](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L106)
