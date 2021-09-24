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

• `Optional` **accessList**: [`AccessListBuffer`](../README.md#accesslistbuffer) \| [`AccessList`](../README.md#accesslist)

The access list which contains the addresses/storage slots which the transaction wishes to access

#### Defined in

[types.ts:178](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L178)

___

### chainId

• `Optional` **chainId**: `BNLike`

The transaction's chain ID

#### Defined in

[types.ts:173](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L173)

___

### data

• `Optional` **data**: `BufferLike`

This will contain the data of the message or the init of a contract.

#### Inherited from

TxData.data

#### Defined in

[types.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L142)

___

### gasLimit

• `Optional` **gasLimit**: `BNLike`

The transaction's gas limit.

#### Inherited from

TxData.gasLimit

#### Defined in

[types.ts:127](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L127)

___

### gasPrice

• `Optional` **gasPrice**: `BNLike`

The transaction's gas price.

#### Inherited from

TxData.gasPrice

#### Defined in

[types.ts:122](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L122)

___

### nonce

• `Optional` **nonce**: `BNLike`

The transaction's nonce.

#### Inherited from

TxData.nonce

#### Defined in

[types.ts:117](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L117)

___

### r

• `Optional` **r**: `BNLike`

EC signature parameter.

#### Inherited from

TxData.r

#### Defined in

[types.ts:152](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L152)

___

### s

• `Optional` **s**: `BNLike`

EC signature parameter.

#### Inherited from

TxData.s

#### Defined in

[types.ts:157](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L157)

___

### to

• `Optional` **to**: `AddressLike`

The transaction's the address is sent to.

#### Inherited from

TxData.to

#### Defined in

[types.ts:132](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L132)

___

### type

• `Optional` **type**: `BNLike`

The transaction type

#### Inherited from

TxData.type

#### Defined in

[types.ts:163](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L163)

___

### v

• `Optional` **v**: `BNLike`

EC recovery ID.

#### Inherited from

TxData.v

#### Defined in

[types.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L147)

___

### value

• `Optional` **value**: `BNLike`

The amount of Ether sent.

#### Inherited from

TxData.value

#### Defined in

[types.ts:137](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L137)
