[**@ethereumjs/e2store**](../README.md)

***

[@ethereumjs/e2store](../README.md) / parseEntry

# Function: parseEntry()

> **parseEntry**(`entry`): `Promise`\<\{ `data`: `number` \| `bigint`; `type`: `Uint8Array`\<`ArrayBufferLike`\>; \} \| \{ `data`: `NestedUint8Array` \| `Uint8Array`\<`ArrayBufferLike`\> \| \{ `txs`: `number` \| `Uint8Array`\<`ArrayBufferLike`\> \| `NestedUint8Array`; `uncles`: `number` \| `Uint8Array`\<`ArrayBufferLike`\> \| `NestedUint8Array`; `withdrawals`: `number` \| `Uint8Array`\<`ArrayBufferLike`\> \| `NestedUint8Array`; \}; `type`: `Uint8Array`\<`ArrayBufferLike`\>; \}\>

Defined in: [packages/e2store/src/e2store.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/e2store/src/e2store.ts#L17)

Decompress and decode an e2store entry based on its type tag.

## Parameters

### entry

[`e2StoreEntry`](../type-aliases/e2StoreEntry.md)

## Returns

`Promise`\<\{ `data`: `number` \| `bigint`; `type`: `Uint8Array`\<`ArrayBufferLike`\>; \} \| \{ `data`: `NestedUint8Array` \| `Uint8Array`\<`ArrayBufferLike`\> \| \{ `txs`: `number` \| `Uint8Array`\<`ArrayBufferLike`\> \| `NestedUint8Array`; `uncles`: `number` \| `Uint8Array`\<`ArrayBufferLike`\> \| `NestedUint8Array`; `withdrawals`: `number` \| `Uint8Array`\<`ArrayBufferLike`\> \| `NestedUint8Array`; \}; `type`: `Uint8Array`\<`ArrayBufferLike`\>; \}\>
