[@ethereumjs/block](../README.md) › ["types"](_types_.md)

# Module: "types"

## Index

### Interfaces

* [BlockData](../interfaces/_types_.blockdata.md)
* [BlockOptions](../interfaces/_types_.blockoptions.md)
* [Blockchain](../interfaces/_types_.blockchain.md)
* [HeaderData](../interfaces/_types_.headerdata.md)
* [JsonBlock](../interfaces/_types_.jsonblock.md)
* [JsonHeader](../interfaces/_types_.jsonheader.md)

### Type aliases

* [BlockBodyBuffer](_types_.md#blockbodybuffer)
* [BlockBuffer](_types_.md#blockbuffer)
* [BlockHeaderBuffer](_types_.md#blockheaderbuffer)
* [TransactionsBuffer](_types_.md#transactionsbuffer)
* [UncleHeadersBuffer](_types_.md#uncleheadersbuffer)

## Type aliases

###  BlockBodyBuffer

Ƭ **BlockBodyBuffer**: *[[TransactionsBuffer](_types_.md#transactionsbuffer), [UncleHeadersBuffer](_types_.md#uncleheadersbuffer)]*

*Defined in [types.ts:102](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L102)*

___

###  BlockBuffer

Ƭ **BlockBuffer**: *[[BlockHeaderBuffer](_types_.md#blockheaderbuffer), [TransactionsBuffer](_types_.md#transactionsbuffer), [UncleHeadersBuffer](_types_.md#uncleheadersbuffer)]*

*Defined in [types.ts:100](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L100)*

___

###  BlockHeaderBuffer

Ƭ **BlockHeaderBuffer**: *Buffer[]*

*Defined in [types.ts:101](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L101)*

___

###  TransactionsBuffer

Ƭ **TransactionsBuffer**: *Buffer[][] | Buffer[]*

*Defined in [types.ts:106](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L106)*

TransactionsBuffer can be an array of serialized txs for Typed Transactions or an array of Buffer Arrays for legacy transactions.

___

###  UncleHeadersBuffer

Ƭ **UncleHeadersBuffer**: *Buffer[][]*

*Defined in [types.ts:107](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L107)*
