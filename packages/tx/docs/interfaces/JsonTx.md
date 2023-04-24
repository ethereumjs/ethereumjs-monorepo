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
- [maxFeePerDataGas](JsonTx.md#maxfeeperdatagas)
- [maxFeePerGas](JsonTx.md#maxfeepergas)
- [maxPriorityFeePerGas](JsonTx.md#maxpriorityfeepergas)
- [nonce](JsonTx.md#nonce)
- [r](JsonTx.md#r)
- [s](JsonTx.md#s)
- [to](JsonTx.md#to)
- [type](JsonTx.md#type)
- [v](JsonTx.md#v)
- [value](JsonTx.md#value)
- [versionedHashes](JsonTx.md#versionedhashes)

## Properties

### accessList

• `Optional` **accessList**: `JsonAccessListItem`[]

#### Defined in

[types.ts:323](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L323)

___

### chainId

• `Optional` **chainId**: `string`

#### Defined in

[types.ts:322](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L322)

___

### data

• `Optional` **data**: `string`

#### Defined in

[types.ts:317](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L317)

___

### gasLimit

• `Optional` **gasLimit**: `string`

#### Defined in

[types.ts:315](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L315)

___

### gasPrice

• `Optional` **gasPrice**: `string`

#### Defined in

[types.ts:314](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L314)

___

### maxFeePerDataGas

• `Optional` **maxFeePerDataGas**: `string`

#### Defined in

[types.ts:327](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L327)

___

### maxFeePerGas

• `Optional` **maxFeePerGas**: `string`

#### Defined in

[types.ts:326](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L326)

___

### maxPriorityFeePerGas

• `Optional` **maxPriorityFeePerGas**: `string`

#### Defined in

[types.ts:325](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L325)

___

### nonce

• `Optional` **nonce**: `string`

#### Defined in

[types.ts:313](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L313)

___

### r

• `Optional` **r**: `string`

#### Defined in

[types.ts:319](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L319)

___

### s

• `Optional` **s**: `string`

#### Defined in

[types.ts:320](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L320)

___

### to

• `Optional` **to**: `string`

#### Defined in

[types.ts:316](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L316)

___

### type

• `Optional` **type**: `string`

#### Defined in

[types.ts:324](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L324)

___

### v

• `Optional` **v**: `string`

#### Defined in

[types.ts:318](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L318)

___

### value

• `Optional` **value**: `string`

#### Defined in

[types.ts:321](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L321)

___

### versionedHashes

• `Optional` **versionedHashes**: `string`[]

#### Defined in

[types.ts:328](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L328)
