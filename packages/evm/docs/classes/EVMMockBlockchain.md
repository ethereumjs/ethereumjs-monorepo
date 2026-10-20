[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / EVMMockBlockchain

# Class: EVMMockBlockchain

Defined in: [types.ts:617](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L617)

In-memory mock blockchain for tests and stand-alone [createEVM](../functions/createEVM.md) defaults.

## Implements

- [`EVMMockBlockchainInterface`](../interfaces/EVMMockBlockchainInterface.md)

## Constructors

### Constructor

> **new EVMMockBlockchain**(): `EVMMockBlockchain`

#### Returns

`EVMMockBlockchain`

## Methods

### getBlock()

> **getBlock**(): `Promise`\<\{ `hash`: `Uint8Array`\<`ArrayBuffer`\>; \}\>

Defined in: [types.ts:618](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L618)

#### Returns

`Promise`\<\{ `hash`: `Uint8Array`\<`ArrayBuffer`\>; \}\>

#### Implementation of

[`EVMMockBlockchainInterface`](../interfaces/EVMMockBlockchainInterface.md).[`getBlock`](../interfaces/EVMMockBlockchainInterface.md#getblock)

***

### putBlock()

> **putBlock**(): `Promise`\<`void`\>

Defined in: [types.ts:625](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L625)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`EVMMockBlockchainInterface`](../interfaces/EVMMockBlockchainInterface.md).[`putBlock`](../interfaces/EVMMockBlockchainInterface.md#putblock)

***

### shallowCopy()

> **shallowCopy**(): `EVMMockBlockchain`

Defined in: [types.ts:626](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L626)

#### Returns

`EVMMockBlockchain`

#### Implementation of

[`EVMMockBlockchainInterface`](../interfaces/EVMMockBlockchainInterface.md).[`shallowCopy`](../interfaces/EVMMockBlockchainInterface.md#shallowcopy)
