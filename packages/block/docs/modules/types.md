[@ethereumjs/block](../README.md) / types

# Module: types

## Table of contents

### Interfaces

- [BlockData](../interfaces/types.blockdata.md)
- [BlockOptions](../interfaces/types.blockoptions.md)
- [Blockchain](../interfaces/types.blockchain.md)
- [HeaderData](../interfaces/types.headerdata.md)
- [JsonBlock](../interfaces/types.jsonblock.md)
- [JsonHeader](../interfaces/types.jsonheader.md)

### Type aliases

- [BlockBodyBuffer](types.md#blockbodybuffer)
- [BlockBuffer](types.md#blockbuffer)
- [BlockHeaderBuffer](types.md#blockheaderbuffer)
- [TransactionsBuffer](types.md#transactionsbuffer)
- [UncleHeadersBuffer](types.md#uncleheadersbuffer)

## Type aliases

### BlockBodyBuffer

Ƭ **BlockBodyBuffer**: [[*TransactionsBuffer*](types.md#transactionsbuffer), [*UncleHeadersBuffer*](types.md#uncleheadersbuffer)]

Defined in: [types.ts:103](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L103)

___

### BlockBuffer

Ƭ **BlockBuffer**: [[*BlockHeaderBuffer*](types.md#blockheaderbuffer), [*TransactionsBuffer*](types.md#transactionsbuffer), [*UncleHeadersBuffer*](types.md#uncleheadersbuffer)]

Defined in: [types.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L101)

___

### BlockHeaderBuffer

Ƭ **BlockHeaderBuffer**: Buffer[]

Defined in: [types.ts:102](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L102)

___

### TransactionsBuffer

Ƭ **TransactionsBuffer**: Buffer[][] \| Buffer[]

TransactionsBuffer can be an array of serialized txs for Typed Transactions or an array of Buffer Arrays for legacy transactions.

Defined in: [types.ts:107](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L107)

___

### UncleHeadersBuffer

Ƭ **UncleHeadersBuffer**: Buffer[][]

Defined in: [types.ts:108](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L108)
