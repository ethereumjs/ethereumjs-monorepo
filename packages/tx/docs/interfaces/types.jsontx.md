[@ethereumjs/tx](../README.md) / [types](../modules/types.md) / JsonTx

# Interface: JsonTx

[types](../modules/types.md).JsonTx

Generic interface for all tx types with a
JSON representation of a transaction.

Note that all values are marked as optional
and not all the values are present on all tx types
(an EIP1559 tx e.g. lacks a `gasPrice`).

## Table of contents

### Properties

- [accessList](types.jsontx.md#accesslist)
- [chainId](types.jsontx.md#chainid)
- [data](types.jsontx.md#data)
- [gasLimit](types.jsontx.md#gaslimit)
- [gasPrice](types.jsontx.md#gasprice)
- [maxFeePerGas](types.jsontx.md#maxfeepergas)
- [maxPriorityFeePerGas](types.jsontx.md#maxpriorityfeepergas)
- [nonce](types.jsontx.md#nonce)
- [r](types.jsontx.md#r)
- [s](types.jsontx.md#s)
- [to](types.jsontx.md#to)
- [type](types.jsontx.md#type)
- [v](types.jsontx.md#v)
- [value](types.jsontx.md#value)

## Properties

### accessList

• `Optional` **accessList**: `JsonAccessListItem`[]

#### Defined in

[types.ts:259](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L259)

___

### chainId

• `Optional` **chainId**: `string`

#### Defined in

[types.ts:258](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L258)

___

### data

• `Optional` **data**: `string`

#### Defined in

[types.ts:253](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L253)

___

### gasLimit

• `Optional` **gasLimit**: `string`

#### Defined in

[types.ts:251](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L251)

___

### gasPrice

• `Optional` **gasPrice**: `string`

#### Defined in

[types.ts:250](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L250)

___

### maxFeePerGas

• `Optional` **maxFeePerGas**: `string`

#### Defined in

[types.ts:262](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L262)

___

### maxPriorityFeePerGas

• `Optional` **maxPriorityFeePerGas**: `string`

#### Defined in

[types.ts:261](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L261)

___

### nonce

• `Optional` **nonce**: `string`

#### Defined in

[types.ts:249](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L249)

___

### r

• `Optional` **r**: `string`

#### Defined in

[types.ts:255](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L255)

___

### s

• `Optional` **s**: `string`

#### Defined in

[types.ts:256](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L256)

___

### to

• `Optional` **to**: `string`

#### Defined in

[types.ts:252](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L252)

___

### type

• `Optional` **type**: `string`

#### Defined in

[types.ts:260](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L260)

___

### v

• `Optional` **v**: `string`

#### Defined in

[types.ts:254](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L254)

___

### value

• `Optional` **value**: `string`

#### Defined in

[types.ts:257](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L257)
