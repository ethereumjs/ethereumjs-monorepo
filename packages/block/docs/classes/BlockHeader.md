[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / BlockHeader

# Class: BlockHeader

Defined in: [header/header.ts:44](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L44)

An object that represents the block header.

## Constructors

### Constructor

> **new BlockHeader**(`headerData`, `opts`): `BlockHeader`

Defined in: [header/header.ts:95](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L95)

This constructor takes the values, validates them, assigns them and freezes the object.

#### Parameters

##### headerData

[`HeaderData`](../interfaces/HeaderData.md)

##### opts

[`BlockOptions`](../interfaces/BlockOptions.md) = `{}`

#### Returns

`BlockHeader`

#### Deprecated

Use the public static factory methods to assist in creating a Header object from
varying data types. For a default empty header, use [createBlockHeader](../functions/createBlockHeader.md).

## Properties

### baseFeePerGas?

> `readonly` `optional` **baseFeePerGas**: `bigint`

Defined in: [header/header.ts:60](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L60)

***

### blobGasUsed?

> `readonly` `optional` **blobGasUsed**: `bigint`

Defined in: [header/header.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L62)

***

### coinbase

> `readonly` **coinbase**: `Address`

Defined in: [header/header.ts:47](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L47)

***

### common

> `readonly` **common**: `Common`

Defined in: [header/header.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L67)

***

### difficulty

> `readonly` **difficulty**: `bigint`

Defined in: [header/header.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L52)

***

### excessBlobGas?

> `readonly` `optional` **excessBlobGas**: `bigint`

Defined in: [header/header.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L63)

***

### extraData

> `readonly` **extraData**: `Uint8Array`

Defined in: [header/header.ts:57](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L57)

***

### gasLimit

> `readonly` **gasLimit**: `bigint`

Defined in: [header/header.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L54)

***

### gasUsed

> `readonly` **gasUsed**: `bigint`

Defined in: [header/header.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L55)

***

### logsBloom

> `readonly` **logsBloom**: `Uint8Array`

Defined in: [header/header.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L51)

***

### mixHash

> `readonly` **mixHash**: `Uint8Array`

Defined in: [header/header.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L58)

***

### nonce

> `readonly` **nonce**: `Uint8Array`

Defined in: [header/header.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L59)

***

### number

> `readonly` **number**: `bigint`

Defined in: [header/header.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L53)

***

### parentBeaconBlockRoot?

> `readonly` `optional` **parentBeaconBlockRoot**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [header/header.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L64)

***

### parentHash

> `readonly` **parentHash**: `Uint8Array`

Defined in: [header/header.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L45)

***

### receiptTrie

> `readonly` **receiptTrie**: `Uint8Array`

Defined in: [header/header.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L50)

***

### requestsHash?

> `readonly` `optional` **requestsHash**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [header/header.ts:65](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L65)

***

### stateRoot

> `readonly` **stateRoot**: `Uint8Array`

Defined in: [header/header.ts:48](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L48)

***

### timestamp

> `readonly` **timestamp**: `bigint`

Defined in: [header/header.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L56)

***

### transactionsTrie

> `readonly` **transactionsTrie**: `Uint8Array`

Defined in: [header/header.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L49)

***

### uncleHash

> `readonly` **uncleHash**: `Uint8Array`

Defined in: [header/header.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L46)

***

### withdrawalsRoot?

> `readonly` `optional` **withdrawalsRoot**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [header/header.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L61)

## Accessors

### prevRandao

#### Get Signature

> **get** **prevRandao**(): `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [header/header.ts:78](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L78)

EIP-4399: After merge to PoS, `mixHash` supplanted as `prevRandao`

##### Returns

`Uint8Array`\<`ArrayBufferLike`\>

## Methods

### calcDataFee()

> **calcDataFee**(`numBlobs`): `bigint`

Defined in: [header/header.ts:551](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L551)

Returns the total fee for blob gas spent for including blobs in block.

#### Parameters

##### numBlobs

`number`

number of blobs in the transaction/block

#### Returns

`bigint`

the total blob gas fee for numBlobs blobs

***

### calcNextBaseFee()

> **calcNextBaseFee**(): `bigint`

Defined in: [header/header.ts:500](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L500)

Calculates the base fee for a potential next block

#### Returns

`bigint`

***

### calcNextBlobGasPrice()

> **calcNextBlobGasPrice**(`childCommon`): `bigint`

Defined in: [header/header.ts:595](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L595)

Calculate the blob gas price of the block built on top of this one

#### Parameters

##### childCommon

`Common`

#### Returns

`bigint`

The blob gas price

***

### calcNextExcessBlobGas()

> **calcNextExcessBlobGas**(`childCommon`): `bigint`

Defined in: [header/header.ts:562](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L562)

Calculates the excess blob gas for next (hopefully) post EIP 4844 block.

#### Parameters

##### childCommon

`Common`

#### Returns

`bigint`

***

### errorStr()

> **errorStr**(): `string`

Defined in: [header/header.ts:810](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L810)

Return a compact error string representation of the object

#### Returns

`string`

***

### ethashCanonicalDifficulty()

> **ethashCanonicalDifficulty**(`parentBlockHeader`): `bigint`

Defined in: [header/header.ts:666](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L666)

Returns the canonical difficulty for this block.

#### Parameters

##### parentBlockHeader

`BlockHeader`

the header from the parent `Block` of this header

#### Returns

`bigint`

***

### getBlobGasPrice()

> **getBlobGasPrice**(): `bigint`

Defined in: [header/header.ts:538](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L538)

Returns the price per unit of blob gas for a blob transaction in the current/pending block

#### Returns

`bigint`

the price in gwei per unit of blob gas spent

***

### hash()

> **hash**(): `Uint8Array`

Defined in: [header/header.ts:646](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L646)

Returns the hash of the block header.

#### Returns

`Uint8Array`

***

### isGenesis()

> **isGenesis**(): `boolean`

Defined in: [header/header.ts:657](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L657)

Checks if the block header is a genesis header.

#### Returns

`boolean`

***

### raw()

> **raw**(): [`BlockHeaderBytes`](../type-aliases/BlockHeaderBytes.md)

Defined in: [header/header.ts:602](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L602)

Returns a Uint8Array Array of the raw Bytes in this header, in order.

#### Returns

[`BlockHeaderBytes`](../type-aliases/BlockHeaderBytes.md)

***

### serialize()

> **serialize**(): `Uint8Array`

Defined in: [header/header.ts:737](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L737)

Returns the rlp encoding of the block header.

#### Returns

`Uint8Array`

***

### toJSON()

> **toJSON**(): [`JSONHeader`](../interfaces/JSONHeader.md)

Defined in: [header/header.ts:744](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L744)

Returns the block header in JSON format.

#### Returns

[`JSONHeader`](../interfaces/JSONHeader.md)

***

### validateGasLimit()

> **validateGasLimit**(`parentBlockHeader`): `void`

Defined in: [header/header.ts:454](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header/header.ts#L454)

Validates if the block gasLimit remains in the boundaries set by the protocol.
Throws if out of bounds.

#### Parameters

##### parentBlockHeader

`BlockHeader`

the header from the parent `Block` of this header

#### Returns

`void`
