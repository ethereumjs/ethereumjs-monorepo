[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / DB

# Interface: DB\<TKey, TValue\>

Defined in: [packages/util/src/db.ts:45](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L45)

## Type Parameters

### TKey

`TKey` *extends* `Uint8Array` \| `string` \| `number` = `Uint8Array`

### TValue

`TValue` *extends* `Uint8Array` \| `string` \| [`DBObject`](../type-aliases/DBObject.md) = `Uint8Array`

## Methods

### batch()

> **batch**(`opStack`): `Promise`\<`void`\>

Defined in: [packages/util/src/db.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L73)

Performs a batch operation on db.

#### Parameters

##### opStack

[`BatchDBOp`](../type-aliases/BatchDBOp.md)\<`TKey`, `TValue`\>[]

A stack of levelup operations

#### Returns

`Promise`\<`void`\>

***

### del()

> **del**(`key`, `opts?`): `Promise`\<`void`\>

Defined in: [packages/util/src/db.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L67)

Removes a raw value in the underlying db.

#### Parameters

##### key

`TKey`

##### opts?

[`EncodingOpts`](../type-aliases/EncodingOpts.md)

#### Returns

`Promise`\<`void`\>

***

### get()

> **get**(`key`, `opts?`): `Promise`\<`undefined` \| `TValue`\>

Defined in: [packages/util/src/db.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L54)

Retrieves a raw value from db.

#### Parameters

##### key

`TKey`

##### opts?

[`EncodingOpts`](../type-aliases/EncodingOpts.md)

#### Returns

`Promise`\<`undefined` \| `TValue`\>

A Promise that resolves to `Uint8Array` if a value is found or `undefined` if no value is found.

***

### open()

> **open**(): `Promise`\<`void`\>

Defined in: [packages/util/src/db.ts:84](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L84)

Opens the database -- if applicable

#### Returns

`Promise`\<`void`\>

***

### put()

> **put**(`key`, `val`, `opts?`): `Promise`\<`void`\>

Defined in: [packages/util/src/db.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L61)

Writes a value directly to db.

#### Parameters

##### key

`TKey`

The key as a `TValue`

##### val

`TValue`

##### opts?

[`EncodingOpts`](../type-aliases/EncodingOpts.md)

#### Returns

`Promise`\<`void`\>

***

### shallowCopy()

> **shallowCopy**(): `DB`\<`TKey`, `TValue`\>

Defined in: [packages/util/src/db.ts:79](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L79)

Returns a copy of the DB instance, with a reference
to the **same** underlying db instance.

#### Returns

`DB`\<`TKey`, `TValue`\>
