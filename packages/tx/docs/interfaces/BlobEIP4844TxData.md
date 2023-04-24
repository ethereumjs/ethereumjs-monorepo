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
- [chainId](BlobEIP4844TxData.md#chainid)
- [data](BlobEIP4844TxData.md#data)
- [gasLimit](BlobEIP4844TxData.md#gaslimit)
- [gasPrice](BlobEIP4844TxData.md#gasprice)
- [kzgCommitments](BlobEIP4844TxData.md#kzgcommitments)
- [kzgProof](BlobEIP4844TxData.md#kzgproof)
- [maxFeePerDataGas](BlobEIP4844TxData.md#maxfeeperdatagas)
- [maxFeePerGas](BlobEIP4844TxData.md#maxfeepergas)
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

• `Optional` **accessList**: ``null`` \| [`AccessListBuffer`](../README.md#accesslistbuffer) \| [`AccessList`](../README.md#accesslist)

The access list which contains the addresses/storage slots which the transaction wishes to access

#### Inherited from

[FeeMarketEIP1559TxData](FeeMarketEIP1559TxData.md).[accessList](FeeMarketEIP1559TxData.md#accesslist)

#### Defined in

[types.ts:214](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L214)

___

### blobs

• `Optional` **blobs**: `BufferLike`[]

The blobs associated with a transaction

#### Defined in

[types.ts:251](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L251)

___

### chainId

• `Optional` **chainId**: `BigIntLike`

The transaction's chain ID

#### Inherited from

[FeeMarketEIP1559TxData](FeeMarketEIP1559TxData.md).[chainId](FeeMarketEIP1559TxData.md#chainid)

#### Defined in

[types.ts:209](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L209)

___

### data

• `Optional` **data**: `BufferLike`

This will contain the data of the message or the init of a contract.

#### Inherited from

[FeeMarketEIP1559TxData](FeeMarketEIP1559TxData.md).[data](FeeMarketEIP1559TxData.md#data)

#### Defined in

[types.ts:178](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L178)

___

### gasLimit

• `Optional` **gasLimit**: `BigIntLike`

The transaction's gas limit.

#### Inherited from

[FeeMarketEIP1559TxData](FeeMarketEIP1559TxData.md).[gasLimit](FeeMarketEIP1559TxData.md#gaslimit)

#### Defined in

[types.ts:163](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L163)

___

### gasPrice

• `Optional` **gasPrice**: ``null``

The transaction's gas price, inherited from [Transaction](../classes/Transaction.md).  This property is not used for EIP1559
transactions and should always be undefined for this specific transaction type.

#### Inherited from

[FeeMarketEIP1559TxData](FeeMarketEIP1559TxData.md).[gasPrice](FeeMarketEIP1559TxData.md#gasprice)

#### Defined in

[types.ts:225](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L225)

___

### kzgCommitments

• `Optional` **kzgCommitments**: `BufferLike`[]

The KZG commitments corresponding to the versioned hashes for each blob

#### Defined in

[types.ts:255](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L255)

___

### kzgProof

• `Optional` **kzgProof**: `BufferLike`

The aggregate KZG proof associated with the transaction

#### Defined in

[types.ts:259](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L259)

___

### maxFeePerDataGas

• `Optional` **maxFeePerDataGas**: `BigIntLike`

The maximum fee per data gas paid for the transaction

#### Defined in

[types.ts:247](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L247)

___

### maxFeePerGas

• `Optional` **maxFeePerGas**: `BigIntLike`

The maximum total fee

#### Inherited from

[FeeMarketEIP1559TxData](FeeMarketEIP1559TxData.md).[maxFeePerGas](FeeMarketEIP1559TxData.md#maxfeepergas)

#### Defined in

[types.ts:233](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L233)

___

### maxPriorityFeePerGas

• `Optional` **maxPriorityFeePerGas**: `BigIntLike`

The maximum inclusion fee per gas (this fee is given to the miner)

#### Inherited from

[FeeMarketEIP1559TxData](FeeMarketEIP1559TxData.md).[maxPriorityFeePerGas](FeeMarketEIP1559TxData.md#maxpriorityfeepergas)

#### Defined in

[types.ts:229](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L229)

___

### nonce

• `Optional` **nonce**: `BigIntLike`

The transaction's nonce.

#### Inherited from

[FeeMarketEIP1559TxData](FeeMarketEIP1559TxData.md).[nonce](FeeMarketEIP1559TxData.md#nonce)

#### Defined in

[types.ts:153](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L153)

___

### r

• `Optional` **r**: `BigIntLike`

EC signature parameter.

#### Inherited from

[FeeMarketEIP1559TxData](FeeMarketEIP1559TxData.md).[r](FeeMarketEIP1559TxData.md#r)

#### Defined in

[types.ts:188](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L188)

___

### s

• `Optional` **s**: `BigIntLike`

EC signature parameter.

#### Inherited from

[FeeMarketEIP1559TxData](FeeMarketEIP1559TxData.md).[s](FeeMarketEIP1559TxData.md#s)

#### Defined in

[types.ts:193](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L193)

___

### to

• `Optional` **to**: `AddressLike`

The transaction's the address is sent to.

#### Inherited from

[FeeMarketEIP1559TxData](FeeMarketEIP1559TxData.md).[to](FeeMarketEIP1559TxData.md#to)

#### Defined in

[types.ts:168](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L168)

___

### type

• `Optional` **type**: `BigIntLike`

The transaction type

#### Inherited from

[FeeMarketEIP1559TxData](FeeMarketEIP1559TxData.md).[type](FeeMarketEIP1559TxData.md#type)

#### Defined in

[types.ts:199](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L199)

___

### v

• `Optional` **v**: `BigIntLike`

EC recovery ID.

#### Inherited from

[FeeMarketEIP1559TxData](FeeMarketEIP1559TxData.md).[v](FeeMarketEIP1559TxData.md#v)

#### Defined in

[types.ts:183](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L183)

___

### value

• `Optional` **value**: `BigIntLike`

The amount of Ether sent.

#### Inherited from

[FeeMarketEIP1559TxData](FeeMarketEIP1559TxData.md).[value](FeeMarketEIP1559TxData.md#value)

#### Defined in

[types.ts:173](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L173)

___

### versionedHashes

• `Optional` **versionedHashes**: `BufferLike`[]

The versioned hashes used to validate the blobs attached to a transaction

#### Defined in

[types.ts:243](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L243)
