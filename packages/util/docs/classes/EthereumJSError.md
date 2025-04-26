[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / EthereumJSError

# Class: EthereumJSError\<T\>

Defined in: packages/rlp/dist/esm/errors.d.ts:19

Generic EthereumJS error with attached metadata

## Extends

- `Error`

## Type Parameters

### T

`T` *extends* `object`

## Constructors

### Constructor

> **new EthereumJSError**\<`T`\>(`type`, `message?`, `stack?`): `EthereumJSError`\<`T`\>

Defined in: packages/rlp/dist/esm/errors.d.ts:23

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

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1077

#### Inherited from

`Error.message`

***

### name

> **name**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1076

#### Inherited from

`Error.name`

***

### stack?

> `optional` **stack**: `string`

Defined in: node\_modules/typescript/lib/lib.es5.d.ts:1078

#### Inherited from

`Error.stack`

***

### type

> **type**: `T`

Defined in: packages/rlp/dist/esm/errors.d.ts:22

***

### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`

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

Defined in: packages/rlp/dist/esm/errors.d.ts:24

#### Returns

[`EthereumJSErrorMetaData`](../type-aliases/EthereumJSErrorMetaData.md)

***

### toObject()

> **toObject**(): [`EthereumJSErrorObject`](../type-aliases/EthereumJSErrorObject.md)

Defined in: packages/rlp/dist/esm/errors.d.ts:28

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
