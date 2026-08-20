[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / AccountData

# Interface: AccountData

Defined in: [packages/util/src/account.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L25)

Plain-object fields for constructing an [Account](../classes/Account.md).

## Properties

### balance?

> `optional` **balance?**: [`BigIntLike`](../type-aliases/BigIntLike.md)

Defined in: [packages/util/src/account.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L29)

Account balance in wei

***

### codeHash?

> `optional` **codeHash?**: [`BytesLike`](../type-aliases/BytesLike.md)

Defined in: [packages/util/src/account.ts:33](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L33)

Keccak-256 hash of the contract bytecode (or empty-account sentinel)

***

### nonce?

> `optional` **nonce?**: [`BigIntLike`](../type-aliases/BigIntLike.md)

Defined in: [packages/util/src/account.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L27)

Account nonce

***

### storageRoot?

> `optional` **storageRoot?**: [`BytesLike`](../type-aliases/BytesLike.md)

Defined in: [packages/util/src/account.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/account.ts#L31)

Storage trie root hash
