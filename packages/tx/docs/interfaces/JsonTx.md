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
- [maxFeePerblobGas](JsonTx.md#maxfeeperblobgas)
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

[tx/src/types.ts:399](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L399)

___

### chainId

• `Optional` **chainId**: `string`

#### Defined in

[tx/src/types.ts:398](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L398)

___

### data

• `Optional` **data**: `string`

#### Defined in

[tx/src/types.ts:393](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L393)

___

### gasLimit

• `Optional` **gasLimit**: `string`

#### Defined in

[tx/src/types.ts:391](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L391)

___

### gasPrice

• `Optional` **gasPrice**: `string`

#### Defined in

[tx/src/types.ts:390](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L390)

___

### maxFeePerGas

• `Optional` **maxFeePerGas**: `string`

#### Defined in

[tx/src/types.ts:402](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L402)

___

### maxFeePerblobGas

• `Optional` **maxFeePerblobGas**: `string`

#### Defined in

[tx/src/types.ts:403](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L403)

___

### maxPriorityFeePerGas

• `Optional` **maxPriorityFeePerGas**: `string`

#### Defined in

[tx/src/types.ts:401](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L401)

___

### nonce

• `Optional` **nonce**: `string`

#### Defined in

[tx/src/types.ts:389](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L389)

___

### r

• `Optional` **r**: `string`

#### Defined in

[tx/src/types.ts:395](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L395)

___

### s

• `Optional` **s**: `string`

#### Defined in

[tx/src/types.ts:396](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L396)

___

### to

• `Optional` **to**: `string`

#### Defined in

[tx/src/types.ts:392](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L392)

___

### type

• `Optional` **type**: `string`

#### Defined in

[tx/src/types.ts:400](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L400)

___

### v

• `Optional` **v**: `string`

#### Defined in

[tx/src/types.ts:394](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L394)

___

### value

• `Optional` **value**: `string`

#### Defined in

[tx/src/types.ts:397](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L397)

___

### versionedHashes

• `Optional` **versionedHashes**: `string`[]

#### Defined in

[tx/src/types.ts:404](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L404)
