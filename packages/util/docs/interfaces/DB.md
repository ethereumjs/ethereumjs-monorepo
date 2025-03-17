[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / DB

# Interface: DB\<TKey, TValue\>

Defined in: [packages/util/src/db.ts:41](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L41)

## Type Parameters

• **TKey** *extends* `Uint8Array` \| `string` \| `number` = `Uint8Array`

• **TValue** *extends* `Uint8Array` \| `string` \| [`DBObject`](../type-aliases/DBObject.md) = `Uint8Array`

## Methods

### batch()

> **batch**(`opStack`): `Promise`\<`void`\>

Defined in: [packages/util/src/db.ts:69](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L69)

Performs a batch operation on db.

#### Parameters

##### opStack

[`BatchDBOp`](../type-aliases/BatchDBOp.md)\<`TKey`, `TValue`\>[]

A stack of levelup operations

#### Returns

`Promise`\<`void`\>

***

### del()

> **del**(`key`, `opts`?): `Promise`\<`void`\>

Defined in: [packages/util/src/db.ts:63](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L63)

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

> **get**(`key`, `opts`?): `Promise`\<`undefined` \| `TValue`\>

Defined in: [packages/util/src/db.ts:50](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L50)

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

Defined in: [packages/util/src/db.ts:80](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L80)

Opens the database -- if applicable

#### Returns

`Promise`\<`void`\>

***

### put()

> **put**(`key`, `val`, `opts`?): `Promise`\<`void`\>

Defined in: [packages/util/src/db.ts:57](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L57)

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

> **shallowCopy**(): [`DB`](DB.md)\<`TKey`, `TValue`\>

Defined in: [packages/util/src/db.ts:75](https://github.com/Dargon789/ethereumjs-monorepo/blob/master/packages/util/src/db.ts#L75)

Returns a copy of the DB instance, with a reference
to the **same** underlying db instance.

#### Returns

[`DB`](DB.md)\<`TKey`, `TValue`\>
