@ethereumjs/block

# @ethereumjs/block

## Table of contents

### Classes

- [Block](classes/Block.md)
- [BlockHeader](classes/BlockHeader.md)

### Interfaces

- [BlockData](interfaces/BlockData.md)
- [BlockOptions](interfaces/BlockOptions.md)
- [Blockchain](interfaces/Blockchain.md)
- [HeaderData](interfaces/HeaderData.md)
- [JsonBlock](interfaces/JsonBlock.md)
- [JsonHeader](interfaces/JsonHeader.md)

### Type aliases

- [BlockBodyBuffer](README.md#blockbodybuffer)
- [BlockBuffer](README.md#blockbuffer)
- [BlockHeaderBuffer](README.md#blockheaderbuffer)
- [TransactionsBuffer](README.md#transactionsbuffer)
- [UncleHeadersBuffer](README.md#uncleheadersbuffer)

## Type aliases

### BlockBodyBuffer

Ƭ **BlockBodyBuffer**: [[`TransactionsBuffer`](README.md#transactionsbuffer), [`UncleHeadersBuffer`](README.md#uncleheadersbuffer)]

#### Defined in

[types.ts:126](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L126)

___

### BlockBuffer

Ƭ **BlockBuffer**: [[`BlockHeaderBuffer`](README.md#blockheaderbuffer), [`TransactionsBuffer`](README.md#transactionsbuffer), [`UncleHeadersBuffer`](README.md#uncleheadersbuffer)]

#### Defined in

[types.ts:124](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L124)

___

### BlockHeaderBuffer

Ƭ **BlockHeaderBuffer**: `Buffer`[]

#### Defined in

[types.ts:125](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L125)

___

### TransactionsBuffer

Ƭ **TransactionsBuffer**: `Buffer`[][] \| `Buffer`[]

TransactionsBuffer can be an array of serialized txs for Typed Transactions or an array of Buffer Arrays for legacy transactions.

#### Defined in

[types.ts:130](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L130)

___

### UncleHeadersBuffer

Ƭ **UncleHeadersBuffer**: `Buffer`[][]

#### Defined in

[types.ts:131](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L131)
