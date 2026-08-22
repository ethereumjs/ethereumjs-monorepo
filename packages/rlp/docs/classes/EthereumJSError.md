[**@ethereumjs/rlp**](../README.md)

***

[@ethereumjs/rlp](../README.md) / EthereumJSError

# Class: EthereumJSError\<T\>

Defined in: [packages/rlp/src/errors.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/rlp/src/errors.ts#L26)

Generic EthereumJS error with attached metadata

## Extends

- `Error`

## Type Parameters

### T

`T` *extends* `object`

## Constructors

### Constructor

> **new EthereumJSError**\<`T`\>(`type`, `message?`, `stack?`): `EthereumJSError`\<`T`\>

Defined in: [packages/rlp/src/errors.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/rlp/src/errors.ts#L28)

#### Parameters

##### type

`T`

##### message?

`string`

##### stack?

`string`

#### Returns

`EthereumJSError`\<`T`\>

#### Overrides

`Error.constructor`

## Properties

### message

> **message**: `string`

Defined in: node\_modules/typescript-6/lib/lib.es5.d.ts:1075

#### Inherited from

`Error.message`

***

### name

> **name**: `string`

Defined in: node\_modules/typescript-6/lib/lib.es5.d.ts:1074

#### Inherited from

`Error.name`

***

### stack?

> `optional` **stack?**: `string`

Defined in: node\_modules/typescript-6/lib/lib.es5.d.ts:1076

#### Inherited from

`Error.stack`

***

### type

> **type**: `T`

Defined in: [packages/rlp/src/errors.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/rlp/src/errors.ts#L27)

***

### prepareStackTrace?

> `static` `optional` **prepareStackTrace?**: (`err`, `stackTraces`) => `any`

Defined in: node\_modules/@types/node/globals.d.ts:143

Optional override for formatting stack traces

#### Parameters

##### err

`Error`

##### stackTraces

`CallSite`[]

#### Returns

`any`

#### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

`Error.prepareStackTrace`

***

### stackTraceLimit

> `static` **stackTraceLimit**: `number`

Defined in: node\_modules/@types/node/globals.d.ts:145

#### Inherited from

`Error.stackTraceLimit`

## Methods

### getMetadata()

> **getMetadata**(): [`EthereumJSErrorMetaData`](../type-aliases/EthereumJSErrorMetaData.md)

Defined in: [packages/rlp/src/errors.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/rlp/src/errors.ts#L34)

#### Returns

[`EthereumJSErrorMetaData`](../type-aliases/EthereumJSErrorMetaData.md)

***

### toObject()

> **toObject**(): [`EthereumJSErrorObject`](../type-aliases/EthereumJSErrorObject.md)

Defined in: [packages/rlp/src/errors.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/rlp/src/errors.ts#L41)

Get the metadata and the stacktrace for the error.

#### Returns

[`EthereumJSErrorObject`](../type-aliases/EthereumJSErrorObject.md)

***

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Defined in: node\_modules/@types/node/globals.d.ts:136

Create .stack property on a target object

#### Parameters

##### targetObject

`object`

##### constructorOpt?

`Function`

#### Returns

`void`

#### Inherited from

`Error.captureStackTrace`
