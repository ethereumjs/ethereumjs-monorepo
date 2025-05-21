[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / RPCBlockChain

# Class: RPCBlockChain

Defined in: [rpcStateManager.ts:362](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L362)

## Constructors

### Constructor

> **new RPCBlockChain**(`provider`): `RPCBlockChain`

Defined in: [rpcStateManager.ts:364](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L364)

#### Parameters

##### provider

`string`

#### Returns

`RPCBlockChain`

## Properties

### provider

> `readonly` **provider**: `string`

Defined in: [rpcStateManager.ts:363](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L363)

## Methods

### getBlock()

> **getBlock**(`blockId`): `Promise`\<\{ `hash`: () => `Uint8Array`\<`ArrayBufferLike`\>; \}\>

Defined in: [rpcStateManager.ts:369](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L369)

#### Parameters

##### blockId

`number`

#### Returns

`Promise`\<\{ `hash`: () => `Uint8Array`\<`ArrayBufferLike`\>; \}\>

***

### shallowCopy()

> **shallowCopy**(): `RPCBlockChain`

Defined in: [rpcStateManager.ts:379](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L379)

#### Returns

`RPCBlockChain`
