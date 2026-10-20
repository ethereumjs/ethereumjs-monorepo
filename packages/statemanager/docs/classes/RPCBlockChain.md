[**@ethereumjs/statemanager**](../README.md)

***

[@ethereumjs/statemanager](../README.md) / RPCBlockChain

# Class: RPCBlockChain

Defined in: [rpcStateManager.ts:373](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L373)

## Constructors

### Constructor

> **new RPCBlockChain**(`provider`): `RPCBlockChain`

Defined in: [rpcStateManager.ts:375](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L375)

#### Parameters

##### provider

`string`

#### Returns

`RPCBlockChain`

## Properties

### provider

> `readonly` **provider**: `string`

Defined in: [rpcStateManager.ts:374](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L374)

## Methods

### getBlock()

> **getBlock**(`blockId`): `Promise`\<\{ `hash`: () => `Uint8Array`\<`ArrayBufferLike`\>; \}\>

Defined in: [rpcStateManager.ts:380](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L380)

#### Parameters

##### blockId

`number`

#### Returns

`Promise`\<\{ `hash`: () => `Uint8Array`\<`ArrayBufferLike`\>; \}\>

***

### shallowCopy()

> **shallowCopy**(): `RPCBlockChain`

Defined in: [rpcStateManager.ts:390](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/statemanager/src/rpcStateManager.ts#L390)

#### Returns

`RPCBlockChain`
