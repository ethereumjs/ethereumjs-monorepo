[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / VMEvent

# Type Alias: VMEvent

> **VMEvent** = `object`

Defined in: [vm/src/types.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L83)

## Properties

### afterBlock()

> **afterBlock**: (`data`, `resolve?`) => `void`

Defined in: [vm/src/types.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L85)

#### Parameters

##### data

[`AfterBlockEvent`](../interfaces/AfterBlockEvent.md)

##### resolve?

(`result?`) => `void`

#### Returns

`void`

***

### afterTx()

> **afterTx**: (`data`, `resolve?`) => `void`

Defined in: [vm/src/types.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L87)

#### Parameters

##### data

[`AfterTxEvent`](../interfaces/AfterTxEvent.md)

##### resolve?

(`result?`) => `void`

#### Returns

`void`

***

### beforeBlock()

> **beforeBlock**: (`data`, `resolve?`) => `void`

Defined in: [vm/src/types.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L84)

#### Parameters

##### data

`Block`

##### resolve?

(`result?`) => `void`

#### Returns

`void`

***

### beforeTx()

> **beforeTx**: (`data`, `resolve?`) => `void`

Defined in: [vm/src/types.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L86)

#### Parameters

##### data

`TypedTransaction`

##### resolve?

(`result?`) => `void`

#### Returns

`void`
