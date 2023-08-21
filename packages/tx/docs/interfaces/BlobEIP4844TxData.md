[@ethereumjs/tx](../README.md) / BlobEIP4844TxData

# Interface: BlobEIP4844TxData

[BlobEIP4844Transaction](../classes/BlobEIP4844Transaction.md) data.

## Hierarchy

- [`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md)

  ↳ **`BlobEIP4844TxData`**

## Table of contents

### Properties

- [accessList](BlobEIP4844TxData.md#accesslist)
- [blobs](BlobEIP4844TxData.md#blobs)
- [blobsData](BlobEIP4844TxData.md#blobsdata)
- [chainId](BlobEIP4844TxData.md#chainid)
- [data](BlobEIP4844TxData.md#data)
- [gasLimit](BlobEIP4844TxData.md#gaslimit)
- [gasPrice](BlobEIP4844TxData.md#gasprice)
- [kzgCommitments](BlobEIP4844TxData.md#kzgcommitments)
- [kzgProofs](BlobEIP4844TxData.md#kzgproofs)
- [maxFeePerGas](BlobEIP4844TxData.md#maxfeepergas)
- [maxFeePerblobGas](BlobEIP4844TxData.md#maxfeeperblobgas)
- [maxPriorityFeePerGas](BlobEIP4844TxData.md#maxpriorityfeepergas)
- [nonce](BlobEIP4844TxData.md#nonce)
- [r](BlobEIP4844TxData.md#r)
- [s](BlobEIP4844TxData.md#s)
- [to](BlobEIP4844TxData.md#to)
- [type](BlobEIP4844TxData.md#type)
- [v](BlobEIP4844TxData.md#v)
- [value](BlobEIP4844TxData.md#value)
- [versionedHashes](BlobEIP4844TxData.md#versionedhashes)

## Properties

### accessList

• `Optional` **accessList**: ``null`` \| [`AccessListBytes`](../README.md#accesslistbytes) \| [`AccessList`](../README.md#accesslist)

The access list which contains the addresses/storage slots which the transaction wishes to access

#### Inherited from

[FeeMarketEIP1559TxData](FeeMarketEIP1559TxData.md).[accessList](FeeMarketEIP1559TxData.md#accesslist)

#### Defined in

[tx/src/types.ts:252](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L252)

___

### blobs

• `Optional` **blobs**: `BytesLike`[]

The blobs associated with a transaction

#### Defined in

[tx/src/types.ts:289](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L289)

___

### blobsData

• `Optional` **blobsData**: `string`[]

An array of arbitrary strings that blobs are to be constructed from

#### Defined in

[tx/src/types.ts:301](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L301)

___

### chainId

• `Optional` **chainId**: `BigIntLike`

The transaction's chain ID

#### Inherited from

[FeeMarketEIP1559TxData](FeeMarketEIP1559TxData.md).[chainId](FeeMarketEIP1559TxData.md#chainid)

#### Defined in

[tx/src/types.ts:247](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L247)

___

### data

• `Optional` **data**: `BytesLike`

This will contain the data of the message or the init of a contract.

#### Inherited from

[FeeMarketEIP1559TxData](FeeMarketEIP1559TxData.md).[data](FeeMarketEIP1559TxData.md#data)

#### Defined in

[tx/src/types.ts:216](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L216)

___

### gasLimit

• `Optional` **gasLimit**: `BigIntLike`

The transaction's gas limit.

#### Inherited from

[FeeMarketEIP1559TxData](FeeMarketEIP1559TxData.md).[gasLimit](FeeMarketEIP1559TxData.md#gaslimit)

#### Defined in

[tx/src/types.ts:201](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L201)

___

### gasPrice

• `Optional` **gasPrice**: ``null``

The transaction's gas price, inherited from [Transaction](Transaction.md).  This property is not used for EIP1559
transactions and should always be undefined for this specific transaction type.

#### Inherited from

[FeeMarketEIP1559TxData](FeeMarketEIP1559TxData.md).[gasPrice](FeeMarketEIP1559TxData.md#gasprice)

#### Defined in

[tx/src/types.ts:263](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L263)

___

### kzgCommitments

• `Optional` **kzgCommitments**: `BytesLike`[]

The KZG commitments corresponding to the versioned hashes for each blob

#### Defined in

[tx/src/types.ts:293](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L293)

___

### kzgProofs

• `Optional` **kzgProofs**: `BytesLike`[]

The KZG proofs associated with the transaction

#### Defined in

[tx/src/types.ts:297](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L297)

___

### maxFeePerGas

• `Optional` **maxFeePerGas**: `BigIntLike`

The maximum total fee

#### Inherited from

[FeeMarketEIP1559TxData](FeeMarketEIP1559TxData.md).[maxFeePerGas](FeeMarketEIP1559TxData.md#maxfeepergas)

#### Defined in

[tx/src/types.ts:271](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L271)

___

### maxFeePerblobGas

• `Optional` **maxFeePerblobGas**: `BigIntLike`

The maximum fee per blob gas paid for the transaction

#### Defined in

[tx/src/types.ts:285](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L285)

___

### maxPriorityFeePerGas

• `Optional` **maxPriorityFeePerGas**: `BigIntLike`

The maximum inclusion fee per gas (this fee is given to the miner)

#### Inherited from

[FeeMarketEIP1559TxData](FeeMarketEIP1559TxData.md).[maxPriorityFeePerGas](FeeMarketEIP1559TxData.md#maxpriorityfeepergas)

#### Defined in

[tx/src/types.ts:267](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L267)

___

### nonce

• `Optional` **nonce**: `BigIntLike`

The transaction's nonce.

#### Inherited from

[FeeMarketEIP1559TxData](FeeMarketEIP1559TxData.md).[nonce](FeeMarketEIP1559TxData.md#nonce)

#### Defined in

[tx/src/types.ts:191](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L191)

___

### r

• `Optional` **r**: `BigIntLike`

EC signature parameter.

#### Inherited from

[FeeMarketEIP1559TxData](FeeMarketEIP1559TxData.md).[r](FeeMarketEIP1559TxData.md#r)

#### Defined in

[tx/src/types.ts:226](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L226)

___

### s

• `Optional` **s**: `BigIntLike`

EC signature parameter.

#### Inherited from

[FeeMarketEIP1559TxData](FeeMarketEIP1559TxData.md).[s](FeeMarketEIP1559TxData.md#s)

#### Defined in

[tx/src/types.ts:231](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L231)

___

### to

• `Optional` **to**: `AddressLike`

The transaction's the address is sent to.

#### Inherited from

[FeeMarketEIP1559TxData](FeeMarketEIP1559TxData.md).[to](FeeMarketEIP1559TxData.md#to)

#### Defined in

[tx/src/types.ts:206](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L206)

___

### type

• `Optional` **type**: `BigIntLike`

The transaction type

#### Inherited from

[FeeMarketEIP1559TxData](FeeMarketEIP1559TxData.md).[type](FeeMarketEIP1559TxData.md#type)

#### Defined in

[tx/src/types.ts:237](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L237)

___

### v

• `Optional` **v**: `BigIntLike`

EC recovery ID.

#### Inherited from

[FeeMarketEIP1559TxData](FeeMarketEIP1559TxData.md).[v](FeeMarketEIP1559TxData.md#v)

#### Defined in

[tx/src/types.ts:221](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L221)

___

### value

• `Optional` **value**: `BigIntLike`

The amount of Ether sent.

#### Inherited from

[FeeMarketEIP1559TxData](FeeMarketEIP1559TxData.md).[value](FeeMarketEIP1559TxData.md#value)

#### Defined in

[tx/src/types.ts:211](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L211)

___

### versionedHashes

• `Optional` **versionedHashes**: `BytesLike`[]

The versioned hashes used to validate the blobs attached to a transaction

#### Defined in

[tx/src/types.ts:281](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L281)
