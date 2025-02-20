[@ethereumjs/statemanager](../README.md) / RPCBlockChain

# Class: RPCBlockChain

## Table of contents

### Constructors

- [constructor](RPCBlockChain.md#constructor)

### Properties

- [provider](RPCBlockChain.md#provider)

### Methods

- [getBlock](RPCBlockChain.md#getblock)
- [shallowCopy](RPCBlockChain.md#shallowcopy)

## Constructors

### constructor

• **new RPCBlockChain**(`provider`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `provider` | `string` |

#### Defined in

[rpcStateManager.ts:445](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L445)

## Properties

### provider

• `Readonly` **provider**: `string`

#### Defined in

[rpcStateManager.ts:444](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L444)

## Methods

### getBlock

▸ **getBlock**(`blockId`): `Promise`<{ `hash`: () => `Uint8Array`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `blockId` | `number` |

#### Returns

`Promise`<{ `hash`: () => `Uint8Array`  }\>

#### Defined in

[rpcStateManager.ts:449](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L449)

___

### shallowCopy

▸ **shallowCopy**(): [`RPCBlockChain`](RPCBlockChain.md)

#### Returns

[`RPCBlockChain`](RPCBlockChain.md)

#### Defined in

[rpcStateManager.ts:459](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L459)
