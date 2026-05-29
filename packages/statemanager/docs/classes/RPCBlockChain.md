[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / RPCBlockChain

# Class: RPCBlockChain

Defined in: [rpcStateManager.ts:361](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L361)

## Constructors

### Constructor

> **new RPCBlockChain**(`provider`): `RPCBlockChain`

Defined in: [rpcStateManager.ts:363](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L363)

#### Parameters

##### provider

`string`

#### Returns

`RPCBlockChain`

## Properties

### provider

> `readonly` **provider**: `string`

Defined in: [rpcStateManager.ts:362](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L362)

## Methods

### getBlock()

> **getBlock**(`blockId`): `Promise`\<\{ `hash`: () => `Uint8Array`\<`ArrayBufferLike`\>; \}\>

Defined in: [rpcStateManager.ts:368](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L368)

#### Parameters

##### blockId

`number`

#### Returns

`Promise`\<\{ `hash`: () => `Uint8Array`\<`ArrayBufferLike`\>; \}\>

***

### shallowCopy()

> **shallowCopy**(): `RPCBlockChain`

Defined in: [rpcStateManager.ts:378](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L378)

#### Returns

`RPCBlockChain`
