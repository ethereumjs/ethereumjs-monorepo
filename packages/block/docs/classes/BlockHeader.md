[@ethereumjs/block](../README.md) / BlockHeader

# Class: BlockHeader

An object that represents the block header.

## Table of contents

### Constructors

- [constructor](BlockHeader.md#constructor)

### Properties

- [baseFeePerGas](BlockHeader.md#basefeepergas)
- [coinbase](BlockHeader.md#coinbase)
- [common](BlockHeader.md#common)
- [dataGasUsed](BlockHeader.md#datagasused)
- [difficulty](BlockHeader.md#difficulty)
- [excessDataGas](BlockHeader.md#excessdatagas)
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
- [calcNextExcessDataGas](BlockHeader.md#calcnextexcessdatagas)
- [cliqueEpochTransitionSigners](BlockHeader.md#cliqueepochtransitionsigners)
- [cliqueExtraSeal](BlockHeader.md#cliqueextraseal)
- [cliqueExtraVanity](BlockHeader.md#cliqueextravanity)
- [cliqueIsEpochTransition](BlockHeader.md#cliqueisepochtransition)
- [cliqueSigHash](BlockHeader.md#cliquesighash)
- [cliqueSigner](BlockHeader.md#cliquesigner)
- [cliqueVerifySignature](BlockHeader.md#cliqueverifysignature)
- [errorStr](BlockHeader.md#errorstr)
- [ethashCanonicalDifficulty](BlockHeader.md#ethashcanonicaldifficulty)
- [getDataGasPrice](BlockHeader.md#getdatagasprice)
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

[header.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L142)

## Properties

### baseFeePerGas

• `Optional` `Readonly` **baseFeePerGas**: `bigint`

#### Defined in

[header.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L55)

___

### coinbase

• `Readonly` **coinbase**: `Address`

#### Defined in

[header.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L42)

___

### common

• `Readonly` **common**: `Common`

#### Defined in

[header.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L61)

___

### dataGasUsed

• `Optional` `Readonly` **dataGasUsed**: `bigint`

#### Defined in

[header.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L57)

___

### difficulty

• `Readonly` **difficulty**: `bigint`

#### Defined in

[header.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L47)

___

### excessDataGas

• `Optional` `Readonly` **excessDataGas**: `bigint`

#### Defined in

[header.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L58)

___

### extraData

• `Readonly` **extraData**: `Uint8Array`

#### Defined in

[header.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L52)

___

### gasLimit

• `Readonly` **gasLimit**: `bigint`

#### Defined in

[header.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L49)

___

### gasUsed

• `Readonly` **gasUsed**: `bigint`

#### Defined in

[header.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L50)

___

### logsBloom

• `Readonly` **logsBloom**: `Uint8Array`

#### Defined in

[header.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L46)

___

### mixHash

• `Readonly` **mixHash**: `Uint8Array`

#### Defined in

[header.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L53)

___

### nonce

• `Readonly` **nonce**: `Uint8Array`

#### Defined in

[header.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L54)

___

### number

• `Readonly` **number**: `bigint`

#### Defined in

[header.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L48)

___

### parentBeaconBlockRoot

• `Optional` `Readonly` **parentBeaconBlockRoot**: `Uint8Array`

#### Defined in

[header.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L59)

___

### parentHash

• `Readonly` **parentHash**: `Uint8Array`

#### Defined in

[header.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L40)

___

### receiptTrie

• `Readonly` **receiptTrie**: `Uint8Array`

#### Defined in

[header.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L45)

___

### stateRoot

• `Readonly` **stateRoot**: `Uint8Array`

#### Defined in

[header.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L43)

___

### timestamp

• `Readonly` **timestamp**: `bigint`

#### Defined in

[header.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L51)

___

### transactionsTrie

• `Readonly` **transactionsTrie**: `Uint8Array`

#### Defined in

[header.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L44)

___

### uncleHash

• `Readonly` **uncleHash**: `Uint8Array`

#### Defined in

[header.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L41)

___

### withdrawalsRoot

• `Optional` `Readonly` **withdrawalsRoot**: `Uint8Array`

#### Defined in

[header.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L56)

## Accessors

### prevRandao

• `get` **prevRandao**(): `Uint8Array`

EIP-4399: After merge to PoS, `mixHash` supplanted as `prevRandao`

#### Returns

`Uint8Array`

#### Defined in

[header.ts:70](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L70)

## Methods

### calcDataFee

▸ **calcDataFee**(`numBlobs`): `bigint`

Returns the total fee for data gas spent for including blobs in block.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `numBlobs` | `number` | number of blobs in the transaction/block |

#### Returns

`bigint`

the total data gas fee for numBlobs blobs

#### Defined in

[header.ts:599](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L599)

___

### calcNextBaseFee

▸ **calcNextBaseFee**(): `bigint`

Calculates the base fee for a potential next block

#### Returns

`bigint`

#### Defined in

[header.ts:537](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L537)

___

### calcNextExcessDataGas

▸ **calcNextExcessDataGas**(): `bigint`

Calculates the excess data gas for next (hopefully) post EIP 4844 block.

#### Returns

`bigint`

#### Defined in

[header.ts:610](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L610)

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

[header.ts:838](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L838)

___

### cliqueExtraSeal

▸ **cliqueExtraSeal**(): `Uint8Array`

Returns extra seal data
(only clique PoA, throws otherwise)

#### Returns

`Uint8Array`

#### Defined in

[header.ts:802](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L802)

___

### cliqueExtraVanity

▸ **cliqueExtraVanity**(): `Uint8Array`

Returns extra vanity data
(only clique PoA, throws otherwise)

#### Returns

`Uint8Array`

#### Defined in

[header.ts:793](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L793)

___

### cliqueIsEpochTransition

▸ **cliqueIsEpochTransition**(): `boolean`

Checks if the block header is an epoch transition
header (only clique PoA, throws otherwise)

#### Returns

`boolean`

#### Defined in

[header.ts:781](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L781)

___

### cliqueSigHash

▸ **cliqueSigHash**(): `Uint8Array`

PoA clique signature hash without the seal.

#### Returns

`Uint8Array`

#### Defined in

[header.ts:770](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L770)

___

### cliqueSigner

▸ **cliqueSigner**(): `Address`

Returns the signer address

#### Returns

`Address`

#### Defined in

[header.ts:875](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L875)

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

[header.ts:863](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L863)

___

### errorStr

▸ **errorStr**(): `string`

Return a compact error string representation of the object

#### Returns

`string`

#### Defined in

[header.ts:958](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L958)

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

[header.ts:697](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L697)

___

### getDataGasPrice

▸ **getDataGasPrice**(): `bigint`

Returns the price per unit of data gas for a blob transaction in the current/pending block

#### Returns

`bigint`

the price in gwei per unit of data gas spent

#### Defined in

[header.ts:582](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L582)

___

### hash

▸ **hash**(): `Uint8Array`

Returns the hash of the block header.

#### Returns

`Uint8Array`

#### Defined in

[header.ts:665](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L665)

___

### isGenesis

▸ **isGenesis**(): `boolean`

Checks if the block header is a genesis header.

#### Returns

`boolean`

#### Defined in

[header.ts:679](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L679)

___

### raw

▸ **raw**(): [`BlockHeaderBytes`](../README.md#blockheaderbytes)

Returns a Uint8Array Array of the raw Bytes in this header, in order.

#### Returns

[`BlockHeaderBytes`](../README.md#blockheaderbytes)

#### Defined in

[header.ts:625](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L625)

___

### serialize

▸ **serialize**(): `Uint8Array`

Returns the rlp encoding of the block header.

#### Returns

`Uint8Array`

#### Defined in

[header.ts:892](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L892)

___

### toJSON

▸ **toJSON**(): [`JsonHeader`](../interfaces/JsonHeader.md)

Returns the block header in JSON format.

#### Returns

[`JsonHeader`](../interfaces/JsonHeader.md)

#### Defined in

[header.ts:899](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L899)

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

[header.ts:495](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L495)

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

[header.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L86)

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

[header.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L96)

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

[header.ts:110](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header.ts#L110)
