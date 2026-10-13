[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / EthereumJSErrorWithoutCode

# ~~Function: EthereumJSErrorWithoutCode()~~

> **EthereumJSErrorWithoutCode**(`message?`, `stack?`): [`EthereumJSError`](../classes/EthereumJSError.md)\<\{ `code`: `string`; \}\>

Defined in: [packages/rlp/src/errors.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/rlp/src/errors.ts#L55)

## Parameters

### message?

`string`

### stack?

`string`

## Returns

[`EthereumJSError`](../classes/EthereumJSError.md)\<\{ `code`: `string`; \}\>

## Deprecated

Use `EthereumJSError` with a set error code instead

## Throws

Always uses [DEFAULT\_ERROR\_CODE](../variables/DEFAULT_ERROR_CODE.md)
