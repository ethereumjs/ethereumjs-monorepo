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

[types.ts:267](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L267)

___

### chainId

• `Optional` **chainId**: `string`

#### Defined in

[types.ts:266](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L266)

___

### data

• `Optional` **data**: `string`

#### Defined in

[types.ts:261](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L261)

___

### gasLimit

• `Optional` **gasLimit**: `string`

#### Defined in

[types.ts:259](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L259)

___

### gasPrice

• `Optional` **gasPrice**: `string`

#### Defined in

[types.ts:258](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L258)

___

### maxFeePerDataGas

• `Optional` **maxFeePerDataGas**: `string`

#### Defined in

[types.ts:271](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L271)

___

### maxFeePerGas

• `Optional` **maxFeePerGas**: `string`

#### Defined in

[types.ts:270](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L270)

___

### maxPriorityFeePerGas

• `Optional` **maxPriorityFeePerGas**: `string`

#### Defined in

[types.ts:269](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L269)

___

### nonce

• `Optional` **nonce**: `string`

#### Defined in

[types.ts:257](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L257)

___

### r

• `Optional` **r**: `string`

#### Defined in

[types.ts:263](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L263)

___

### s

• `Optional` **s**: `string`

#### Defined in

[types.ts:264](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L264)

___

### to

• `Optional` **to**: `string`

#### Defined in

[types.ts:260](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L260)

___

### type

• `Optional` **type**: `string`

#### Defined in

[types.ts:268](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L268)

___

### v

• `Optional` **v**: `string`

#### Defined in

[types.ts:262](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L262)

___

### value

• `Optional` **value**: `string`

#### Defined in

[types.ts:265](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L265)

___

### versionedHashes

• `Optional` **versionedHashes**: `string`[]

#### Defined in

[types.ts:272](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L272)
