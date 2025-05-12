[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / BlobEIP4844TxData

# Interface: BlobEIP4844TxData

Defined in: [types.ts:400](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L400)

[Blob4844Tx](../classes/Blob4844Tx.md) data.

## Extends

- [`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md)

## Properties

### accessList?

> `optional` **accessList**: `null` \| [`AccessListBytes`](../type-aliases/AccessListBytes.md) \| [`AccessList`](../type-aliases/AccessList.md)

Defined in: [types.ts:375](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L375)

The access list which contains the addresses/storage slots which the transaction wishes to access

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`accessList`](FeeMarketEIP1559TxData.md#accesslist)

***

### blobs?

> `optional` **blobs**: `BytesLike`[]

Defined in: [types.ts:412](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L412)

The blobs associated with a transaction

***

### blobsData?

> `optional` **blobsData**: `string`[]

Defined in: [types.ts:424](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L424)

An array of arbitrary strings that blobs are to be constructed from

***

### blobVersionedHashes?

> `optional` **blobVersionedHashes**: `BytesLike`[]

Defined in: [types.ts:404](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L404)

The versioned hashes used to validate the blobs attached to a transaction

***

### chainId?

> `optional` **chainId**: `BigIntLike`

Defined in: [types.ts:370](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L370)

The transaction's chain ID

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`chainId`](FeeMarketEIP1559TxData.md#chainid)

***

### data?

> `optional` **data**: `""` \| `BytesLike`

Defined in: [types.ts:339](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L339)

This will contain the data of the message or the init of a contract.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`data`](FeeMarketEIP1559TxData.md#data)

***

### gasLimit?

> `optional` **gasLimit**: `BigIntLike`

Defined in: [types.ts:324](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L324)

The transaction's gas limit.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`gasLimit`](FeeMarketEIP1559TxData.md#gaslimit)

***

### gasPrice?

> `optional` **gasPrice**: `null`

Defined in: [types.ts:386](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L386)

The transaction's gas price, inherited from [Transaction](Transaction.md).  This property is not used for EIP1559
transactions and should always be undefined for this specific transaction type.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`gasPrice`](FeeMarketEIP1559TxData.md#gasprice)

***

### kzgCommitments?

> `optional` **kzgCommitments**: `BytesLike`[]

Defined in: [types.ts:416](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L416)

The KZG commitments corresponding to the versioned hashes for each blob

***

### kzgProofs?

> `optional` **kzgProofs**: `BytesLike`[]

Defined in: [types.ts:420](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L420)

The KZG proofs associated with the transaction

***

### maxFeePerBlobGas?

> `optional` **maxFeePerBlobGas**: `BigIntLike`

Defined in: [types.ts:408](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L408)

The maximum fee per blob gas paid for the transaction

***

### maxFeePerGas?

> `optional` **maxFeePerGas**: `BigIntLike`

Defined in: [types.ts:394](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L394)

The maximum total fee

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`maxFeePerGas`](FeeMarketEIP1559TxData.md#maxfeepergas)

***

### maxPriorityFeePerGas?

> `optional` **maxPriorityFeePerGas**: `BigIntLike`

Defined in: [types.ts:390](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L390)

The maximum inclusion fee per gas (this fee is given to the miner)

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`maxPriorityFeePerGas`](FeeMarketEIP1559TxData.md#maxpriorityfeepergas)

***

### nonce?

> `optional` **nonce**: `BigIntLike`

Defined in: [types.ts:314](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L314)

The transaction's nonce.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`nonce`](FeeMarketEIP1559TxData.md#nonce)

***

### r?

> `optional` **r**: `BigIntLike`

Defined in: [types.ts:349](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L349)

EC signature parameter.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`r`](FeeMarketEIP1559TxData.md#r)

***

### s?

> `optional` **s**: `BigIntLike`

Defined in: [types.ts:354](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L354)

EC signature parameter.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`s`](FeeMarketEIP1559TxData.md#s)

***

### to?

> `optional` **to**: `""` \| `AddressLike`

Defined in: [types.ts:329](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L329)

The transaction's the address is sent to.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`to`](FeeMarketEIP1559TxData.md#to)

***

### type?

> `optional` **type**: `BigIntLike`

Defined in: [types.ts:360](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L360)

The transaction type

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`type`](FeeMarketEIP1559TxData.md#type)

***

### v?

> `optional` **v**: `BigIntLike`

Defined in: [types.ts:344](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L344)

EC recovery ID.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`v`](FeeMarketEIP1559TxData.md#v)

***

### value?

> `optional` **value**: `BigIntLike`

Defined in: [types.ts:334](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L334)

The amount of Ether sent.

#### Inherited from

[`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md).[`value`](FeeMarketEIP1559TxData.md#value)
