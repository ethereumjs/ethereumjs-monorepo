[@ethereumjs/tx](../README.md) / [types](../modules/types.md) / AccessListEIP2930TxData

# Interface: AccessListEIP2930TxData

[types](../modules/types.md).AccessListEIP2930TxData

Access list EIP2930 tx data.

## Hierarchy

- [*TxData*](../modules/types.md#txdata)

  ↳ **AccessListEIP2930TxData**

  ↳↳ [*FeeMarketEIP1559TxData*](types.feemarketeip1559txdata.md)

## Table of contents

### Properties

- [accessList](types.accesslisteip2930txdata.md#accesslist)
- [chainId](types.accesslisteip2930txdata.md#chainid)
- [data](types.accesslisteip2930txdata.md#data)
- [gasLimit](types.accesslisteip2930txdata.md#gaslimit)
- [gasPrice](types.accesslisteip2930txdata.md#gasprice)
- [nonce](types.accesslisteip2930txdata.md#nonce)
- [r](types.accesslisteip2930txdata.md#r)
- [s](types.accesslisteip2930txdata.md#s)
- [to](types.accesslisteip2930txdata.md#to)
- [type](types.accesslisteip2930txdata.md#type)
- [v](types.accesslisteip2930txdata.md#v)
- [value](types.accesslisteip2930txdata.md#value)

## Properties

### accessList

• `Optional` **accessList**: [*AccessListBuffer*](../modules/types.md#accesslistbuffer) \| [*AccessList*](../modules/types.md#accesslist)

The access list which contains the addresses/storage slots which the transaction wishes to access

Defined in: [types.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L147)

___

### chainId

• `Optional` **chainId**: *string* \| *number* \| *BN* \| *Buffer*

The transaction's chain ID

Defined in: [types.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L142)

___

### data

• `Optional` **data**: *string* \| *number* \| *BN* \| *Buffer* \| *Uint8Array* \| *number*[] \| TransformableToBuffer

This will contain the data of the message or the init of a contract.

Inherited from: TxData.data

Defined in: [types.ts:111](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L111)

___

### gasLimit

• `Optional` **gasLimit**: *string* \| *number* \| *BN* \| *Buffer*

The transaction's gas limit.

Inherited from: TxData.gasLimit

Defined in: [types.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L96)

___

### gasPrice

• `Optional` **gasPrice**: *string* \| *number* \| *BN* \| *Buffer*

The transaction's gas price.

Inherited from: TxData.gasPrice

Defined in: [types.ts:91](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L91)

___

### nonce

• `Optional` **nonce**: *string* \| *number* \| *BN* \| *Buffer*

The transaction's nonce.

Inherited from: TxData.nonce

Defined in: [types.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L86)

___

### r

• `Optional` **r**: *string* \| *number* \| *BN* \| *Buffer*

EC signature parameter.

Inherited from: TxData.r

Defined in: [types.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L121)

___

### s

• `Optional` **s**: *string* \| *number* \| *BN* \| *Buffer*

EC signature parameter.

Inherited from: TxData.s

Defined in: [types.ts:126](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L126)

___

### to

• `Optional` **to**: *string* \| *Address* \| *Buffer*

The transaction's the address is sent to.

Inherited from: TxData.to

Defined in: [types.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L101)

___

### type

• `Optional` **type**: *string* \| *number* \| *BN* \| *Buffer*

The transaction type

Inherited from: TxData.type

Defined in: [types.ts:132](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L132)

___

### v

• `Optional` **v**: *string* \| *number* \| *BN* \| *Buffer*

EC recovery ID.

Inherited from: TxData.v

Defined in: [types.ts:116](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L116)

___

### value

• `Optional` **value**: *string* \| *number* \| *BN* \| *Buffer*

The amount of Ether sent.

Inherited from: TxData.value

Defined in: [types.ts:106](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L106)
