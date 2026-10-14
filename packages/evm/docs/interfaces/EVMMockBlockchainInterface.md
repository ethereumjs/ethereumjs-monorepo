[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / EVMMockBlockchainInterface

# Interface: EVMMockBlockchainInterface

Defined in: [types.ts:610](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L610)

Lightweight blockchain interface used by stand-alone EVM execution.

## Methods

### getBlock()

> **getBlock**(`blockId`): `Promise`\<`EVMMockBlock`\>

Defined in: [types.ts:611](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L611)

#### Parameters

##### blockId

`number`

#### Returns

`Promise`\<`EVMMockBlock`\>

***

### putBlock()

> **putBlock**(`block`): `Promise`\<`void`\>

Defined in: [types.ts:612](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L612)

#### Parameters

##### block

`EVMMockBlock`

#### Returns

`Promise`\<`void`\>

***

### shallowCopy()

> **shallowCopy**(): `EVMMockBlockchainInterface`

Defined in: [types.ts:613](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L613)

#### Returns

`EVMMockBlockchainInterface`
