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
- [calcNextBlobGasPrice](BlockHeader.md#calcnextblobgasprice)
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

• **new BlockHeader**(`headerData`, `opts?`)

This constructor takes the values, validates them, assigns them and freezes the object.

**`Deprecated`**

Use the public static factory methods to assist in creating a Header object from
varying data types. For a default empty header, use [fromHeaderData](BlockHeader.md#fromheaderdata).

#### Parameters

| Name | Type |
| :------ | :------ |
| `headerData` | [`HeaderData`](../interfaces/HeaderData.md) |
| `opts` | [`BlockOptions`](../interfaces/BlockOptions.md) |

#### Defined in

[header.ts:150](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L150)

## Properties

### baseFeePerGas

• `Optional` `Readonly` **baseFeePerGas**: `bigint`

#### Defined in

[header.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L61)

___

### blobGasUsed

• `Optional` `Readonly` **blobGasUsed**: `bigint`

#### Defined in

[header.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L63)

___

### coinbase

• `Readonly` **coinbase**: `Address`

#### Defined in

[header.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L48)

___

### common

• `Readonly` **common**: `Common`

#### Defined in

[header.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L67)

___

### difficulty

• `Readonly` **difficulty**: `bigint`

#### Defined in

[header.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L53)

___

### excessBlobGas

• `Optional` `Readonly` **excessBlobGas**: `bigint`

#### Defined in

[header.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L64)

___

### extraData

• `Readonly` **extraData**: `Uint8Array`

#### Defined in

[header.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L58)

___

### gasLimit

• `Readonly` **gasLimit**: `bigint`

#### Defined in

[header.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L55)

___

### gasUsed

• `Readonly` **gasUsed**: `bigint`

#### Defined in

[header.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L56)

___

### logsBloom

• `Readonly` **logsBloom**: `Uint8Array`

#### Defined in

[header.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L52)

___

### mixHash

• `Readonly` **mixHash**: `Uint8Array`

#### Defined in

[header.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L59)

___

### nonce

• `Readonly` **nonce**: `Uint8Array`

#### Defined in

[header.ts:60](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L60)

___

### number

• `Readonly` **number**: `bigint`

#### Defined in

[header.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L54)

___

### parentBeaconBlockRoot

• `Optional` `Readonly` **parentBeaconBlockRoot**: `Uint8Array`

#### Defined in

[header.ts:65](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L65)

___

### parentHash

• `Readonly` **parentHash**: `Uint8Array`

#### Defined in

[header.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L46)

___

### receiptTrie

• `Readonly` **receiptTrie**: `Uint8Array`

#### Defined in

[header.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L51)

___

### stateRoot

• `Readonly` **stateRoot**: `Uint8Array`

#### Defined in

[header.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L49)

___

### timestamp

• `Readonly` **timestamp**: `bigint`

#### Defined in

[header.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L57)

___

### transactionsTrie

• `Readonly` **transactionsTrie**: `Uint8Array`

#### Defined in

[header.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L50)

___

### uncleHash

• `Readonly` **uncleHash**: `Uint8Array`

#### Defined in

[header.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L47)

___

### withdrawalsRoot

• `Optional` `Readonly` **withdrawalsRoot**: `Uint8Array`

#### Defined in

[header.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L62)

## Accessors

### prevRandao

• `get` **prevRandao**(): `Uint8Array`

EIP-4399: After merge to PoS, `mixHash` supplanted as `prevRandao`

#### Returns

`Uint8Array`

#### Defined in

[header.ts:78](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L78)

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

[header.ts:621](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L621)

___

### calcNextBaseFee

▸ **calcNextBaseFee**(): `bigint`

Calculates the base fee for a potential next block

#### Returns

`bigint`

#### Defined in

[header.ts:552](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L552)

___

### calcNextBlobGasPrice

▸ **calcNextBlobGasPrice**(): `bigint`

Calculate the blob gas price of the block built on top of this one

#### Returns

`bigint`

The blob gas price

#### Defined in

[header.ts:648](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L648)

___

### calcNextExcessBlobGas

▸ **calcNextExcessBlobGas**(): `bigint`

Calculates the excess blob gas for next (hopefully) post EIP 4844 block.

#### Returns

`bigint`

#### Defined in

[header.ts:632](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L632)

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

[header.ts:870](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L870)

___

### cliqueExtraSeal

▸ **cliqueExtraSeal**(): `Uint8Array`

Returns extra seal data
(only clique PoA, throws otherwise)

#### Returns

`Uint8Array`

#### Defined in

[header.ts:837](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L837)

___

### cliqueExtraVanity

▸ **cliqueExtraVanity**(): `Uint8Array`

Returns extra vanity data
(only clique PoA, throws otherwise)

#### Returns

`Uint8Array`

#### Defined in

[header.ts:828](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L828)

___

### cliqueIsEpochTransition

▸ **cliqueIsEpochTransition**(): `boolean`

Checks if the block header is an epoch transition
header (only clique PoA, throws otherwise)

#### Returns

`boolean`

#### Defined in

[header.ts:816](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L816)

___

### cliqueSigHash

▸ **cliqueSigHash**(): `Uint8Array`

PoA clique signature hash without the seal.

#### Returns

`Uint8Array`

#### Defined in

[header.ts:805](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L805)

___

### cliqueSigner

▸ **cliqueSigner**(): `Address`

Returns the signer address

#### Returns

`Address`

#### Defined in

[header.ts:907](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L907)

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

[header.ts:895](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L895)

___

### errorStr

▸ **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Defined in

[header.ts:994](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L994)

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

[header.ts:734](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L734)

___

### getBlobGasPrice

▸ **getBlobGasPrice**(): `bigint`

Returns the price per unit of blob gas for a blob transaction in the current/pending block

#### Returns

`bigint`

the price in gwei per unit of blob gas spent

#### Defined in

[header.ts:596](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L596)

___

### hash

▸ **hash**(): `Uint8Array`

Returns the hash of the block header.

#### Returns

`Uint8Array`

#### Defined in

[header.ts:703](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L703)

___

### isGenesis

▸ **isGenesis**(): `boolean`

Checks if the block header is a genesis header.

#### Returns

`boolean`

#### Defined in

[header.ts:716](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L716)

___

### raw

▸ **raw**(): [`BlockHeaderBytes`](../README.md#blockheaderbytes)

Returns a Uint8Array Array of the raw Bytes in this header, in order.

#### Returns

[`BlockHeaderBytes`](../README.md#blockheaderbytes)

#### Defined in

[header.ts:655](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L655)

___

### serialize

▸ **serialize**(): `Uint8Array`

Returns the rlp encoding of the block header.

#### Returns

`Uint8Array`

#### Defined in

[header.ts:924](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L924)

___

### toJSON

▸ **toJSON**(): [`JsonHeader`](../interfaces/JsonHeader.md)

Returns the block header in JSON format.

#### Returns

[`JsonHeader`](../interfaces/JsonHeader.md)

#### Defined in

[header.ts:931](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L931)

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

[header.ts:505](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L505)

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

[header.ts:94](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L94)

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

[header.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L104)

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

[header.ts:118](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L118)
