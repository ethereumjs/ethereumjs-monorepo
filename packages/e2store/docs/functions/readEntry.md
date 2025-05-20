[**@ethereumjs/e2store**](../README.md)

***

[@ethereumjs/e2store](../README.md) / readEntry

# Function: readEntry()

> **readEntry**(`bytes`): [`e2StoreEntry`](../type-aliases/e2StoreEntry.md)

Defined in: [packages/e2store/src/e2store.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/e2store/src/e2store.ts#L50)

Reads the first e2Store formatted entry from a string of bytes

## Parameters

### bytes

`Uint8Array`

a Uint8Array containing one or more serialized [e2StoreEntry](../type-aliases/e2StoreEntry.md)

## Returns

[`e2StoreEntry`](../type-aliases/e2StoreEntry.md)

a deserialized [e2StoreEntry](../type-aliases/e2StoreEntry.md)

## Throws

if the length of the entry read is greater than the possible number of bytes in the data element
