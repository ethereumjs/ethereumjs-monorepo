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
- [blobVersionedHashes](JsonTx.md#blobversionedhashes)
- [chainId](JsonTx.md#chainid)
- [data](JsonTx.md#data)
- [gasLimit](JsonTx.md#gaslimit)
- [gasPrice](JsonTx.md#gasprice)
- [maxFeePerBlobGas](JsonTx.md#maxfeeperblobgas)
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

[tx/src/types.ts:450](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L450)

___

### blobVersionedHashes

• `Optional` **blobVersionedHashes**: `string`[]

#### Defined in

[tx/src/types.ts:455](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L455)

___

### chainId

• `Optional` **chainId**: `string`

#### Defined in

[tx/src/types.ts:449](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L449)

___

### data

• `Optional` **data**: `string`

#### Defined in

[tx/src/types.ts:444](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L444)

___

### gasLimit

• `Optional` **gasLimit**: `string`

#### Defined in

[tx/src/types.ts:442](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L442)

___

### gasPrice

• `Optional` **gasPrice**: `string`

#### Defined in

[tx/src/types.ts:441](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L441)

___

### maxFeePerBlobGas

• `Optional` **maxFeePerBlobGas**: `string`

#### Defined in

[tx/src/types.ts:454](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L454)

___

### maxFeePerGas

• `Optional` **maxFeePerGas**: `string`

#### Defined in

[tx/src/types.ts:453](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L453)

___

### maxPriorityFeePerGas

• `Optional` **maxPriorityFeePerGas**: `string`

#### Defined in

[tx/src/types.ts:452](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L452)

___

### nonce

• `Optional` **nonce**: `string`

#### Defined in

[tx/src/types.ts:440](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L440)

___

### r

• `Optional` **r**: `string`

#### Defined in

[tx/src/types.ts:446](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L446)

___

### s

• `Optional` **s**: `string`

#### Defined in

[tx/src/types.ts:447](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L447)

___

### to

• `Optional` **to**: `string`

#### Defined in

[tx/src/types.ts:443](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L443)

___

### type

• `Optional` **type**: `string`

#### Defined in

[tx/src/types.ts:451](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L451)

___

### v

• `Optional` **v**: `string`

#### Defined in

[tx/src/types.ts:445](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L445)

___

### value

• `Optional` **value**: `string`

#### Defined in

[tx/src/types.ts:448](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L448)
