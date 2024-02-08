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

[rpcStateManager.ts:435](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L435)

## Properties

### provider

• `Readonly` **provider**: `string`

#### Defined in

[rpcStateManager.ts:434](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L434)

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

[rpcStateManager.ts:439](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L439)

___

### shallowCopy

▸ **shallowCopy**(): [`RPCBlockChain`](RPCBlockChain.md)

#### Returns

[`RPCBlockChain`](RPCBlockChain.md)

#### Defined in

[rpcStateManager.ts:449](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L449)
