[**@ethereumjs/e2store**](../README.md)

***

[@ethereumjs/e2store](../README.md) / e2StoreEntry

# Type Alias: e2StoreEntry

> **e2StoreEntry** = `object`

Defined in: [packages/e2store/src/types.ts:4](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/e2store/src/types.ts#L4)

Parsed e2store entry header and payload bytes.

## Properties

### data

> **data**: `Uint8Array`

Defined in: [packages/e2store/src/types.ts:8](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/e2store/src/types.ts#L8)

Entry payload (often Snappy-compressed).

***

### type

> **type**: `Uint8Array`

Defined in: [packages/e2store/src/types.ts:6](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/e2store/src/types.ts#L6)

Two-byte type tag identifying the entry kind.
