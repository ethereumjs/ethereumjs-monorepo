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

• `Optional` **accessList**: JsonAccessListItem[]

Defined in: [types.ts:229](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L229)

___

### chainId

• `Optional` **chainId**: *string*

Defined in: [types.ts:228](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L228)

___

### data

• `Optional` **data**: *string*

Defined in: [types.ts:223](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L223)

___

### gasLimit

• `Optional` **gasLimit**: *string*

Defined in: [types.ts:221](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L221)

___

### gasPrice

• `Optional` **gasPrice**: *string*

Defined in: [types.ts:220](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L220)

___

### maxFeePerGas

• `Optional` **maxFeePerGas**: *string*

Defined in: [types.ts:232](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L232)

___

### maxPriorityFeePerGas

• `Optional` **maxPriorityFeePerGas**: *string*

Defined in: [types.ts:231](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L231)

___

### nonce

• `Optional` **nonce**: *string*

Defined in: [types.ts:219](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L219)

___

### r

• `Optional` **r**: *string*

Defined in: [types.ts:225](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L225)

___

### s

• `Optional` **s**: *string*

Defined in: [types.ts:226](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L226)

___

### to

• `Optional` **to**: *string*

Defined in: [types.ts:222](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L222)

___

### type

• `Optional` **type**: *string*

Defined in: [types.ts:230](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L230)

___

### v

• `Optional` **v**: *string*

Defined in: [types.ts:224](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L224)

___

### value

• `Optional` **value**: *string*

Defined in: [types.ts:227](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L227)
