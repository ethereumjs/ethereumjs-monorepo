[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / utf8ToBytes

# Function: utf8ToBytes()

> **utf8ToBytes**(`str`): `Uint8Array`

Defined in: packages/util/node\_modules/@noble/hashes/utils.d.ts:64

Converts string to bytes using UTF8 encoding.
Built-in doesn't validate input to be string: we do the check.

## Parameters

### str

`string`

## Returns

`Uint8Array`

## Example

```ts
utf8ToBytes('abc') // Uint8Array.from([97, 98, 99])
```
