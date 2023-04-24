[@ethereumjs/tx](../README.md) / AccessListEIP2930TxData

# Interface: AccessListEIP2930TxData

[AccessListEIP2930Transaction](../classes/AccessListEIP2930Transaction.md) data.

## Hierarchy

- [`TxData`](../README.md#txdata)

  ↳ **`AccessListEIP2930TxData`**

  ↳↳ [`FeeMarketEIP1559TxData`](FeeMarketEIP1559TxData.md)

## Table of contents

### Properties

- [accessList](AccessListEIP2930TxData.md#accesslist)
- [chainId](AccessListEIP2930TxData.md#chainid)
- [data](AccessListEIP2930TxData.md#data)
- [gasLimit](AccessListEIP2930TxData.md#gaslimit)
- [gasPrice](AccessListEIP2930TxData.md#gasprice)
- [nonce](AccessListEIP2930TxData.md#nonce)
- [r](AccessListEIP2930TxData.md#r)
- [s](AccessListEIP2930TxData.md#s)
- [to](AccessListEIP2930TxData.md#to)
- [type](AccessListEIP2930TxData.md#type)
- [v](AccessListEIP2930TxData.md#v)
- [value](AccessListEIP2930TxData.md#value)

## Properties

### accessList

• `Optional` **accessList**: ``null`` \| [`AccessListBuffer`](../README.md#accesslistbuffer) \| [`AccessList`](../README.md#accesslist)

The access list which contains the addresses/storage slots which the transaction wishes to access

#### Defined in

[types.ts:214](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L214)

___

### chainId

• `Optional` **chainId**: `BigIntLike`

The transaction's chain ID

#### Defined in

[types.ts:209](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L209)

___

### data

• `Optional` **data**: `BufferLike`

This will contain the data of the message or the init of a contract.

#### Inherited from

TxData.data

#### Defined in

[types.ts:178](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L178)

___

### gasLimit

• `Optional` **gasLimit**: `BigIntLike`

The transaction's gas limit.

#### Inherited from

TxData.gasLimit

#### Defined in

[types.ts:163](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L163)

___

### gasPrice

• `Optional` **gasPrice**: ``null`` \| `BigIntLike`

The transaction's gas price.

#### Inherited from

TxData.gasPrice

#### Defined in

[types.ts:158](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L158)

___

### nonce

• `Optional` **nonce**: `BigIntLike`

The transaction's nonce.

#### Inherited from

TxData.nonce

#### Defined in

[types.ts:153](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L153)

___

### r

• `Optional` **r**: `BigIntLike`

EC signature parameter.

#### Inherited from

TxData.r

#### Defined in

[types.ts:188](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L188)

___

### s

• `Optional` **s**: `BigIntLike`

EC signature parameter.

#### Inherited from

TxData.s

#### Defined in

[types.ts:193](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L193)

___

### to

• `Optional` **to**: `AddressLike`

The transaction's the address is sent to.

#### Inherited from

TxData.to

#### Defined in

[types.ts:168](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L168)

___

### type

• `Optional` **type**: `BigIntLike`

The transaction type

#### Inherited from

TxData.type

#### Defined in

[types.ts:199](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L199)

___

### v

• `Optional` **v**: `BigIntLike`

EC recovery ID.

#### Inherited from

TxData.v

#### Defined in

[types.ts:183](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L183)

___

### value

• `Optional` **value**: `BigIntLike`

The amount of Ether sent.

#### Inherited from

TxData.value

#### Defined in

[types.ts:173](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L173)
