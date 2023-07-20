[@ethereumjs/tx](../README.md) / AccessListEIP2930TxData

# Interface: AccessListEIP2930TxData

[AccessListEIP2930Transaction](../classes/AccessListEIP2930Transaction.md) data.

## Hierarchy

- [`LegacyTxData`](../README.md#legacytxdata)

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

• `Optional` **accessList**: ``null`` \| [`AccessListBytes`](../README.md#accesslistbytes) \| [`AccessList`](../README.md#accesslist)

The access list which contains the addresses/storage slots which the transaction wishes to access

#### Defined in

[tx/src/types.ts:252](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L252)

___

### chainId

• `Optional` **chainId**: `BigIntLike`

The transaction's chain ID

#### Defined in

[tx/src/types.ts:247](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L247)

___

### data

• `Optional` **data**: `BytesLike`

This will contain the data of the message or the init of a contract.

#### Inherited from

LegacyTxData.data

#### Defined in

[tx/src/types.ts:216](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L216)

___

### gasLimit

• `Optional` **gasLimit**: `BigIntLike`

The transaction's gas limit.

#### Inherited from

LegacyTxData.gasLimit

#### Defined in

[tx/src/types.ts:201](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L201)

___

### gasPrice

• `Optional` **gasPrice**: ``null`` \| `BigIntLike`

The transaction's gas price.

#### Inherited from

LegacyTxData.gasPrice

#### Defined in

[tx/src/types.ts:196](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L196)

___

### nonce

• `Optional` **nonce**: `BigIntLike`

The transaction's nonce.

#### Inherited from

LegacyTxData.nonce

#### Defined in

[tx/src/types.ts:191](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L191)

___

### r

• `Optional` **r**: `BigIntLike`

EC signature parameter.

#### Inherited from

LegacyTxData.r

#### Defined in

[tx/src/types.ts:226](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L226)

___

### s

• `Optional` **s**: `BigIntLike`

EC signature parameter.

#### Inherited from

LegacyTxData.s

#### Defined in

[tx/src/types.ts:231](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L231)

___

### to

• `Optional` **to**: `AddressLike`

The transaction's the address is sent to.

#### Inherited from

LegacyTxData.to

#### Defined in

[tx/src/types.ts:206](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L206)

___

### type

• `Optional` **type**: `BigIntLike`

The transaction type

#### Inherited from

LegacyTxData.type

#### Defined in

[tx/src/types.ts:237](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L237)

___

### v

• `Optional` **v**: `BigIntLike`

EC recovery ID.

#### Inherited from

LegacyTxData.v

#### Defined in

[tx/src/types.ts:221](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L221)

___

### value

• `Optional` **value**: `BigIntLike`

The amount of Ether sent.

#### Inherited from

LegacyTxData.value

#### Defined in

[tx/src/types.ts:211](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L211)
