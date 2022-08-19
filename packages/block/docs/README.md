@ethereumjs/block

# @ethereumjs/block

## Table of contents

### Classes

- [Block](classes/Block.md)
- [BlockHeader](classes/BlockHeader.md)

### Interfaces

- [BlockData](interfaces/BlockData.md)
- [BlockOptions](interfaces/BlockOptions.md)
- [HeaderData](interfaces/HeaderData.md)
- [JsonBlock](interfaces/JsonBlock.md)
- [JsonHeader](interfaces/JsonHeader.md)

### Type Aliases

- [BlockBodyBuffer](README.md#blockbodybuffer)
- [BlockBuffer](README.md#blockbuffer)
- [BlockHeaderBuffer](README.md#blockheaderbuffer)
- [TransactionsBuffer](README.md#transactionsbuffer)
- [UncleHeadersBuffer](README.md#uncleheadersbuffer)

## Type Aliases

### BlockBodyBuffer

Ƭ **BlockBodyBuffer**: [[`TransactionsBuffer`](README.md#transactionsbuffer), [`UncleHeadersBuffer`](README.md#uncleheadersbuffer)]

#### Defined in

[types.ts:113](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L113)

___

### BlockBuffer

Ƭ **BlockBuffer**: [[`BlockHeaderBuffer`](README.md#blockheaderbuffer), [`TransactionsBuffer`](README.md#transactionsbuffer), [`UncleHeadersBuffer`](README.md#uncleheadersbuffer)]

#### Defined in

[types.ts:111](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L111)

___

### BlockHeaderBuffer

Ƭ **BlockHeaderBuffer**: `Buffer`[]

#### Defined in

[types.ts:112](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L112)

___

### TransactionsBuffer

Ƭ **TransactionsBuffer**: `Buffer`[][] \| `Buffer`[]

TransactionsBuffer can be an array of serialized txs for Typed Transactions or an array of Buffer Arrays for legacy transactions.

#### Defined in

[types.ts:117](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L117)

___

### UncleHeadersBuffer

Ƭ **UncleHeadersBuffer**: `Buffer`[][]

#### Defined in

[types.ts:118](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L118)
