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

[types.ts:179](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L179)

___

### chainId

• `Optional` **chainId**: `BigIntLike`

The transaction's chain ID

#### Defined in

[types.ts:174](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L174)

___

### data

• `Optional` **data**: `BufferLike`

This will contain the data of the message or the init of a contract.

#### Inherited from

TxData.data

#### Defined in

[types.ts:143](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L143)

___

### gasLimit

• `Optional` **gasLimit**: `BigIntLike`

The transaction's gas limit.

#### Inherited from

TxData.gasLimit

#### Defined in

[types.ts:128](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L128)

___

### gasPrice

• `Optional` **gasPrice**: `BigIntLike`

The transaction's gas price.

#### Inherited from

TxData.gasPrice

#### Defined in

[types.ts:123](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L123)

___

### nonce

• `Optional` **nonce**: `BigIntLike`

The transaction's nonce.

#### Inherited from

TxData.nonce

#### Defined in

[types.ts:118](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L118)

___

### r

• `Optional` **r**: `BigIntLike`

EC signature parameter.

#### Inherited from

TxData.r

#### Defined in

[types.ts:153](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L153)

___

### s

• `Optional` **s**: `BigIntLike`

EC signature parameter.

#### Inherited from

TxData.s

#### Defined in

[types.ts:158](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L158)

___

### to

• `Optional` **to**: `AddressLike`

The transaction's the address is sent to.

#### Inherited from

TxData.to

#### Defined in

[types.ts:133](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L133)

___

### type

• `Optional` **type**: `BigIntLike`

The transaction type

#### Inherited from

TxData.type

#### Defined in

[types.ts:164](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L164)

___

### v

• `Optional` **v**: `BigIntLike`

EC recovery ID.

#### Inherited from

TxData.v

#### Defined in

[types.ts:148](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L148)

___

### value

• `Optional` **value**: `BigIntLike`

The amount of Ether sent.

#### Inherited from

TxData.value

#### Defined in

[types.ts:138](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L138)
