[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / VMEvent

# Type Alias: VMEvent

> **VMEvent**: `object`

Defined in: [vm/src/types.ts:83](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L83)

## Type declaration

### afterBlock()

> **afterBlock**: (`data`, `resolve`?) => `void`

#### Parameters

##### data

[`AfterBlockEvent`](../interfaces/AfterBlockEvent.md)

##### resolve?

(`result`?) => `void`

#### Returns

`void`

### afterTx()

> **afterTx**: (`data`, `resolve`?) => `void`

#### Parameters

##### data

[`AfterTxEvent`](../interfaces/AfterTxEvent.md)

##### resolve?

(`result`?) => `void`

#### Returns

`void`

### beforeBlock()

> **beforeBlock**: (`data`, `resolve`?) => `void`

#### Parameters

##### data

`Block`

##### resolve?

(`result`?) => `void`

#### Returns

`void`

### beforeTx()

> **beforeTx**: (`data`, `resolve`?) => `void`

#### Parameters

##### data

`TypedTransaction`

##### resolve?

(`result`?) => `void`

#### Returns

`void`
