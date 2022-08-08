[@ethereumjs/tx](../README.md) / JsonTx

# Interface: JsonTx

Generic interface for all tx types with a
JSON representation of a transaction.

Note that all values are marked as optional
and not all the values are present on all tx types
(an EIP1559 tx e.g. lacks a `gasPrice`).

## Table of contents

### Properties

- [accessList](JsonTx.md#accesslist)
- [chainId](JsonTx.md#chainid)
- [data](JsonTx.md#data)
- [gasLimit](JsonTx.md#gaslimit)
- [gasPrice](JsonTx.md#gasprice)
- [maxFeePerGas](JsonTx.md#maxfeepergas)
- [maxPriorityFeePerGas](JsonTx.md#maxpriorityfeepergas)
- [nonce](JsonTx.md#nonce)
- [r](JsonTx.md#r)
- [s](JsonTx.md#s)
- [to](JsonTx.md#to)
- [type](JsonTx.md#type)
- [v](JsonTx.md#v)
- [value](JsonTx.md#value)

## Properties

### accessList

• `Optional` **accessList**: `JsonAccessListItem`[]

#### Defined in

[types.ts:261](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L261)

---

### chainId

• `Optional` **chainId**: `string`

#### Defined in

[types.ts:260](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L260)

---

### data

• `Optional` **data**: `string`

#### Defined in

[types.ts:255](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L255)

---

### gasLimit

• `Optional` **gasLimit**: `string`

#### Defined in

[types.ts:253](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L253)

---

### gasPrice

• `Optional` **gasPrice**: `string`

#### Defined in

[types.ts:252](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L252)

---

### maxFeePerGas

• `Optional` **maxFeePerGas**: `string`

#### Defined in

[types.ts:264](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L264)

---

### maxPriorityFeePerGas

• `Optional` **maxPriorityFeePerGas**: `string`

#### Defined in

[types.ts:263](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L263)

---

### nonce

• `Optional` **nonce**: `string`

#### Defined in

[types.ts:251](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L251)

---

### r

• `Optional` **r**: `string`

#### Defined in

[types.ts:257](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L257)

---

### s

• `Optional` **s**: `string`

#### Defined in

[types.ts:258](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L258)

---

### to

• `Optional` **to**: `string`

#### Defined in

[types.ts:254](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L254)

---

### type

• `Optional` **type**: `string`

#### Defined in

[types.ts:262](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L262)

---

### v

• `Optional` **v**: `string`

#### Defined in

[types.ts:256](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L256)

---

### value

• `Optional` **value**: `string`

#### Defined in

[types.ts:259](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L259)
