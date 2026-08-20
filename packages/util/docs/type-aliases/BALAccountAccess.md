[**@ethereumjs/util**](../README.md)

***

[@ethereumjs/util](../README.md) / BALAccountAccess

# Type Alias: BALAccountAccess

> **BALAccountAccess** = `object`

Defined in: [packages/util/src/bal/index.ts:51](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L51)

Per-account access summary inside a block-level access list.

## Properties

### balanceChanges

> **balanceChanges**: `Map`\<`BALAccessIndexNumber`, `BALBalanceHex`\>

Defined in: [packages/util/src/bal/index.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L53)

***

### codeChanges

> **codeChanges**: `BALRawCodeChange`[]

Defined in: [packages/util/src/bal/index.ts:54](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L54)

***

### nonceChanges

> **nonceChanges**: `Map`\<`BALAccessIndexNumber`, `BALNonceHex`\>

Defined in: [packages/util/src/bal/index.ts:52](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L52)

***

### storageChanges

> **storageChanges**: `Record`\<`BALStorageKeyHex`, `BALRawStorageChange`[]\>

Defined in: [packages/util/src/bal/index.ts:55](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L55)

***

### storageReads

> **storageReads**: `Set`\<`BALStorageKeyHex`\>

Defined in: [packages/util/src/bal/index.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/src/bal/index.ts#L56)
