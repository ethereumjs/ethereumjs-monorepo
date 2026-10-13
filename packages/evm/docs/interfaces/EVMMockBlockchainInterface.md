[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / EVMMockBlockchainInterface

# Interface: EVMMockBlockchainInterface

Defined in: [types.ts:612](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L612)

Lightweight blockchain interface used by stand-alone EVM execution.

## Methods

### getBlock()

> **getBlock**(`blockId`): `Promise`\<`EVMMockBlock`\>

Defined in: [types.ts:613](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L613)

#### Parameters

##### blockId

`number`

#### Returns

`Promise`\<`EVMMockBlock`\>

***

### putBlock()

> **putBlock**(`block`): `Promise`\<`void`\>

Defined in: [types.ts:614](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L614)

#### Parameters

##### block

`EVMMockBlock`

#### Returns

`Promise`\<`void`\>

***

### shallowCopy()

> **shallowCopy**(): `EVMMockBlockchainInterface`

Defined in: [types.ts:615](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L615)

#### Returns

`EVMMockBlockchainInterface`
