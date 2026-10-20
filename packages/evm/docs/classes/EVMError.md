[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / EVMError

# Class: EVMError

Defined in: [errors.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/errors.ts#L38)

Typed error thrown by the EVM on exceptional halt conditions.

## Constructors

### Constructor

> **new EVMError**(`error`): `EVMError`

Defined in: [errors.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/errors.ts#L43)

#### Parameters

##### error

`EVMErrorType`

#### Returns

`EVMError`

## Properties

### error

> **error**: `EVMErrorType`

Defined in: [errors.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/errors.ts#L39)

***

### errorType

> **errorType**: `string`

Defined in: [errors.ts:40](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/errors.ts#L40)

***

### errorMessages

> `static` **errorMessages**: `Record`\<keyof *typeof* `EVMErrorMessage`, `EVMErrorType`\> = `EVMErrorMessage`

Defined in: [errors.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/errors.ts#L41)
