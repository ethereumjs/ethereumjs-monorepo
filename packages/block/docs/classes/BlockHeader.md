[@ethereumjs/block](../README.md) / BlockHeader

# Class: BlockHeader

An object that represents the block header.

## Table of contents

### Constructors

- [constructor](BlockHeader.md#constructor)

### Properties

- [baseFeePerGas](BlockHeader.md#basefeepergas)
- [blobGasUsed](BlockHeader.md#blobgasused)
- [coinbase](BlockHeader.md#coinbase)
- [common](BlockHeader.md#common)
- [difficulty](BlockHeader.md#difficulty)
- [excessBlobGas](BlockHeader.md#excessblobgas)
- [extraData](BlockHeader.md#extradata)
- [gasLimit](BlockHeader.md#gaslimit)
- [gasUsed](BlockHeader.md#gasused)
- [logsBloom](BlockHeader.md#logsbloom)
- [mixHash](BlockHeader.md#mixhash)
- [nonce](BlockHeader.md#nonce)
- [number](BlockHeader.md#number)
- [parentBeaconBlockRoot](BlockHeader.md#parentbeaconblockroot)
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

- [calcDataFee](BlockHeader.md#calcdatafee)
- [calcNextBaseFee](BlockHeader.md#calcnextbasefee)
- [calcNextExcessBlobGas](BlockHeader.md#calcnextexcessblobgas)
- [cliqueEpochTransitionSigners](BlockHeader.md#cliqueepochtransitionsigners)
- [cliqueExtraSeal](BlockHeader.md#cliqueextraseal)
- [cliqueExtraVanity](BlockHeader.md#cliqueextravanity)
- [cliqueIsEpochTransition](BlockHeader.md#cliqueisepochtransition)
- [cliqueSigHash](BlockHeader.md#cliquesighash)
- [cliqueSigner](BlockHeader.md#cliquesigner)
- [cliqueVerifySignature](BlockHeader.md#cliqueverifysignature)
- [errorStr](BlockHeader.md#errorstr)
- [ethashCanonicalDifficulty](BlockHeader.md#ethashcanonicaldifficulty)
- [getBlobGasPrice](BlockHeader.md#getblobgasprice)
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

[header.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L147)

## Properties

### baseFeePerGas

• `Optional` `Readonly` **baseFeePerGas**: `bigint`

#### Defined in

[header.ts:60](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L60)

___

### blobGasUsed

• `Optional` `Readonly` **blobGasUsed**: `bigint`

#### Defined in

[header.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L62)

___

### coinbase

• `Readonly` **coinbase**: `Address`

#### Defined in

[header.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L47)

___

### common

• `Readonly` **common**: `Common`

#### Defined in

[header.ts:66](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L66)

___

### difficulty

• `Readonly` **difficulty**: `bigint`

#### Defined in

[header.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L52)

___

### excessBlobGas

• `Optional` `Readonly` **excessBlobGas**: `bigint`

#### Defined in

[header.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L63)

___

### extraData

• `Readonly` **extraData**: `Uint8Array`

#### Defined in

[header.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L57)

___

### gasLimit

• `Readonly` **gasLimit**: `bigint`

#### Defined in

[header.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L54)

___

### gasUsed

• `Readonly` **gasUsed**: `bigint`

#### Defined in

[header.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L55)

___

### logsBloom

• `Readonly` **logsBloom**: `Uint8Array`

#### Defined in

[header.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L51)

___

### mixHash

• `Readonly` **mixHash**: `Uint8Array`

#### Defined in

[header.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L58)

___

### nonce

• `Readonly` **nonce**: `Uint8Array`

#### Defined in

[header.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L59)

___

### number

• `Readonly` **number**: `bigint`

#### Defined in

[header.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L53)

___

### parentBeaconBlockRoot

• `Optional` `Readonly` **parentBeaconBlockRoot**: `Uint8Array`

#### Defined in

[header.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L64)

___

### parentHash

• `Readonly` **parentHash**: `Uint8Array`

#### Defined in

[header.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L45)

___

### receiptTrie

• `Readonly` **receiptTrie**: `Uint8Array`

#### Defined in

[header.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L50)

___

### stateRoot

• `Readonly` **stateRoot**: `Uint8Array`

#### Defined in

[header.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L48)

___

### timestamp

• `Readonly` **timestamp**: `bigint`

#### Defined in

[header.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L56)

___

### transactionsTrie

• `Readonly` **transactionsTrie**: `Uint8Array`

#### Defined in

[header.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L49)

___

### uncleHash

• `Readonly` **uncleHash**: `Uint8Array`

#### Defined in

[header.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L46)

___

### withdrawalsRoot

• `Optional` `Readonly` **withdrawalsRoot**: `Uint8Array`

#### Defined in

[header.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L61)

## Accessors

### prevRandao

• `get` **prevRandao**(): `Uint8Array`

EIP-4399: After merge to PoS, `mixHash` supplanted as `prevRandao`

#### Returns

`Uint8Array`

#### Defined in

[header.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L75)

## Methods

### calcDataFee

▸ **calcDataFee**(`numBlobs`): `bigint`

Returns the total fee for blob gas spent for including blobs in block.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `numBlobs` | `number` | number of blobs in the transaction/block |

#### Returns

`bigint`

the total blob gas fee for numBlobs blobs

#### Defined in

[header.ts:598](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L598)

___

### calcNextBaseFee

▸ **calcNextBaseFee**(): `bigint`

Calculates the base fee for a potential next block

#### Returns

`bigint`

#### Defined in

[header.ts:537](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L537)

___

### calcNextExcessBlobGas

▸ **calcNextExcessBlobGas**(): `bigint`

Calculates the excess blob gas for next (hopefully) post EIP 4844 block.

#### Returns

`bigint`

#### Defined in

[header.ts:609](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L609)

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

[header.ts:830](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L830)

___

### cliqueExtraSeal

▸ **cliqueExtraSeal**(): `Uint8Array`

Returns extra seal data
(only clique PoA, throws otherwise)

#### Returns

`Uint8Array`

#### Defined in

[header.ts:798](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L798)

___

### cliqueExtraVanity

▸ **cliqueExtraVanity**(): `Uint8Array`

Returns extra vanity data
(only clique PoA, throws otherwise)

#### Returns

`Uint8Array`

#### Defined in

[header.ts:789](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L789)

___

### cliqueIsEpochTransition

▸ **cliqueIsEpochTransition**(): `boolean`

Checks if the block header is an epoch transition
header (only clique PoA, throws otherwise)

#### Returns

`boolean`

#### Defined in

[header.ts:777](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L777)

___

### cliqueSigHash

▸ **cliqueSigHash**(): `Uint8Array`

PoA clique signature hash without the seal.

#### Returns

`Uint8Array`

#### Defined in

[header.ts:766](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L766)

___

### cliqueSigner

▸ **cliqueSigner**(): `Address`

Returns the signer address

#### Returns

`Address`

#### Defined in

[header.ts:867](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L867)

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

[header.ts:855](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L855)

___

### errorStr

▸ **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Defined in

[header.ts:950](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L950)

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

[header.ts:695](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L695)

___

### getBlobGasPrice

▸ **getBlobGasPrice**(): `bigint`

Returns the price per unit of blob gas for a blob transaction in the current/pending block

#### Returns

`bigint`

the price in gwei per unit of blob gas spent

#### Defined in

[header.ts:581](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L581)

___

### hash

▸ **hash**(): `Uint8Array`

Returns the hash of the block header.

#### Returns

`Uint8Array`

#### Defined in

[header.ts:664](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L664)

___

### isGenesis

▸ **isGenesis**(): `boolean`

Checks if the block header is a genesis header.

#### Returns

`boolean`

#### Defined in

[header.ts:677](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L677)

___

### raw

▸ **raw**(): [`BlockHeaderBytes`](../README.md#blockheaderbytes)

Returns a Uint8Array Array of the raw Bytes in this header, in order.

#### Returns

[`BlockHeaderBytes`](../README.md#blockheaderbytes)

#### Defined in

[header.ts:624](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L624)

___

### serialize

▸ **serialize**(): `Uint8Array`

Returns the rlp encoding of the block header.

#### Returns

`Uint8Array`

#### Defined in

[header.ts:884](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L884)

___

### toJSON

▸ **toJSON**(): [`JsonHeader`](../interfaces/JsonHeader.md)

Returns the block header in JSON format.

#### Returns

[`JsonHeader`](../interfaces/JsonHeader.md)

#### Defined in

[header.ts:891](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L891)

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

[header.ts:499](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L499)

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

[header.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L91)

___

### fromRLPSerializedHeader

▸ `Static` **fromRLPSerializedHeader**(`serializedHeaderData`, `opts?`): [`BlockHeader`](BlockHeader.md)

Static constructor to create a block header from a RLP-serialized header

#### Parameters

| Name | Type |
| :------ | :------ |
| `serializedHeaderData` | `Uint8Array` |
| `opts` | [`BlockOptions`](../interfaces/BlockOptions.md) |

#### Returns

[`BlockHeader`](BlockHeader.md)

#### Defined in

[header.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L101)

___

### fromValuesArray

▸ `Static` **fromValuesArray**(`values`, `opts?`): [`BlockHeader`](BlockHeader.md)

Static constructor to create a block header from an array of Bytes values

#### Parameters

| Name | Type |
| :------ | :------ |
| `values` | [`BlockHeaderBytes`](../README.md#blockheaderbytes) |
| `opts` | [`BlockOptions`](../interfaces/BlockOptions.md) |

#### Returns

[`BlockHeader`](BlockHeader.md)

#### Defined in

[header.ts:115](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L115)
