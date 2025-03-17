[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / RPCBlockChain

# Class: RPCBlockChain

Defined in: [rpcStateManager.ts:361](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L361)

## Constructors

### new RPCBlockChain()

> **new RPCBlockChain**(`provider`): [`RPCBlockChain`](RPCBlockChain.md)

Defined in: [rpcStateManager.ts:363](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L363)

#### Parameters

##### provider

`string`

#### Returns

[`RPCBlockChain`](RPCBlockChain.md)

## Properties

### provider

> `readonly` **provider**: `string`

Defined in: [rpcStateManager.ts:362](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L362)

## Methods

### getBlock()

> **getBlock**(`blockId`): `Promise`\<\{ `hash`: () => `Uint8Array`; \}\>

Defined in: [rpcStateManager.ts:367](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L367)

#### Parameters

##### blockId

`number`

#### Returns

`Promise`\<\{ `hash`: () => `Uint8Array`; \}\>

***

### shallowCopy()

> **shallowCopy**(): [`RPCBlockChain`](RPCBlockChain.md)

Defined in: [rpcStateManager.ts:377](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L377)

#### Returns

[`RPCBlockChain`](RPCBlockChain.md)
