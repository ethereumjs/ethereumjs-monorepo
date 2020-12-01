[ethereumjs-client](../README.md) › ["sync/fetcher/blockfetcher"](../modules/_sync_fetcher_blockfetcher_.md) › [BlockFetcherOptions](_sync_fetcher_blockfetcher_.blockfetcheroptions.md)

# Interface: BlockFetcherOptions

## Hierarchy

* [FetcherOptions](_sync_fetcher_fetcher_.fetcheroptions.md)

  ↳ **BlockFetcherOptions**

  ↳ [HeaderFetcherOptions](_sync_fetcher_headerfetcher_.headerfetcheroptions.md)

## Index

### Properties

* [banTime](_sync_fetcher_blockfetcher_.blockfetcheroptions.md#optional-bantime)
* [chain](_sync_fetcher_blockfetcher_.blockfetcheroptions.md#chain)
* [config](_sync_fetcher_blockfetcher_.blockfetcheroptions.md#config)
* [count](_sync_fetcher_blockfetcher_.blockfetcheroptions.md#count)
* [first](_sync_fetcher_blockfetcher_.blockfetcheroptions.md#first)
* [interval](_sync_fetcher_blockfetcher_.blockfetcheroptions.md#optional-interval)
* [maxPerRequest](_sync_fetcher_blockfetcher_.blockfetcheroptions.md#optional-maxperrequest)
* [maxQueue](_sync_fetcher_blockfetcher_.blockfetcheroptions.md#optional-maxqueue)
* [pool](_sync_fetcher_blockfetcher_.blockfetcheroptions.md#pool)
* [timeout](_sync_fetcher_blockfetcher_.blockfetcheroptions.md#optional-timeout)

## Properties

### `Optional` banTime

• **banTime**? : *undefined | number*

*Inherited from [FetcherOptions](_sync_fetcher_fetcher_.fetcheroptions.md).[banTime](_sync_fetcher_fetcher_.fetcheroptions.md#optional-bantime)*

*Defined in [lib/sync/fetcher/fetcher.ts:17](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.ts#L17)*

___

###  chain

• **chain**: *[Chain](../classes/_blockchain_chain_.chain.md)*

*Defined in [lib/sync/fetcher/blockfetcher.ts:9](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/blockfetcher.ts#L9)*

___

###  config

• **config**: *[Config](../classes/_config_.config.md)*

*Inherited from [FetcherOptions](_sync_fetcher_fetcher_.fetcheroptions.md).[config](_sync_fetcher_fetcher_.fetcheroptions.md#config)*

*Defined in [lib/sync/fetcher/fetcher.ts:8](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.ts#L8)*

___

###  count

• **count**: *BN*

*Defined in [lib/sync/fetcher/blockfetcher.ts:15](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/blockfetcher.ts#L15)*

___

###  first

• **first**: *BN*

*Defined in [lib/sync/fetcher/blockfetcher.ts:12](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/blockfetcher.ts#L12)*

___

### `Optional` interval

• **interval**? : *undefined | number*

*Inherited from [FetcherOptions](_sync_fetcher_fetcher_.fetcheroptions.md).[interval](_sync_fetcher_fetcher_.fetcheroptions.md#optional-interval)*

*Defined in [lib/sync/fetcher/fetcher.ts:26](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.ts#L26)*

___

### `Optional` maxPerRequest

• **maxPerRequest**? : *undefined | number*

*Inherited from [FetcherOptions](_sync_fetcher_fetcher_.fetcheroptions.md).[maxPerRequest](_sync_fetcher_fetcher_.fetcheroptions.md#optional-maxperrequest)*

*Defined in [lib/sync/fetcher/fetcher.ts:23](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.ts#L23)*

___

### `Optional` maxQueue

• **maxQueue**? : *undefined | number*

*Inherited from [FetcherOptions](_sync_fetcher_fetcher_.fetcheroptions.md).[maxQueue](_sync_fetcher_fetcher_.fetcheroptions.md#optional-maxqueue)*

*Defined in [lib/sync/fetcher/fetcher.ts:20](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.ts#L20)*

___

###  pool

• **pool**: *[PeerPool](../classes/_net_peerpool_.peerpool.md)*

*Inherited from [FetcherOptions](_sync_fetcher_fetcher_.fetcheroptions.md).[pool](_sync_fetcher_fetcher_.fetcheroptions.md#pool)*

*Defined in [lib/sync/fetcher/fetcher.ts:11](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.ts#L11)*

___

### `Optional` timeout

• **timeout**? : *undefined | number*

*Inherited from [FetcherOptions](_sync_fetcher_fetcher_.fetcheroptions.md).[timeout](_sync_fetcher_fetcher_.fetcheroptions.md#optional-timeout)*

*Defined in [lib/sync/fetcher/fetcher.ts:14](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.ts#L14)*
