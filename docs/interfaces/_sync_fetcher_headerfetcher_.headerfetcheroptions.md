[ethereumjs-client](../README.md) › ["sync/fetcher/headerfetcher"](../modules/_sync_fetcher_headerfetcher_.md) › [HeaderFetcherOptions](_sync_fetcher_headerfetcher_.headerfetcheroptions.md)

# Interface: HeaderFetcherOptions

## Hierarchy

  ↳ [BlockFetcherOptions](_sync_fetcher_blockfetcher_.blockfetcheroptions.md)

  ↳ **HeaderFetcherOptions**

## Index

### Properties

* [banTime](_sync_fetcher_headerfetcher_.headerfetcheroptions.md#optional-bantime)
* [chain](_sync_fetcher_headerfetcher_.headerfetcheroptions.md#chain)
* [config](_sync_fetcher_headerfetcher_.headerfetcheroptions.md#config)
* [count](_sync_fetcher_headerfetcher_.headerfetcheroptions.md#count)
* [first](_sync_fetcher_headerfetcher_.headerfetcheroptions.md#first)
* [flow](_sync_fetcher_headerfetcher_.headerfetcheroptions.md#flow)
* [interval](_sync_fetcher_headerfetcher_.headerfetcheroptions.md#optional-interval)
* [maxPerRequest](_sync_fetcher_headerfetcher_.headerfetcheroptions.md#optional-maxperrequest)
* [maxQueue](_sync_fetcher_headerfetcher_.headerfetcheroptions.md#optional-maxqueue)
* [pool](_sync_fetcher_headerfetcher_.headerfetcheroptions.md#pool)
* [timeout](_sync_fetcher_headerfetcher_.headerfetcheroptions.md#optional-timeout)

## Properties

### `Optional` banTime

• **banTime**? : *undefined | number*

*Inherited from [FetcherOptions](_sync_fetcher_fetcher_.fetcheroptions.md).[banTime](_sync_fetcher_fetcher_.fetcheroptions.md#optional-bantime)*

*Defined in [lib/sync/fetcher/fetcher.ts:17](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.ts#L17)*

___

###  chain

• **chain**: *[Chain](../classes/_blockchain_chain_.chain.md)*

*Inherited from [BlockFetcherOptions](_sync_fetcher_blockfetcher_.blockfetcheroptions.md).[chain](_sync_fetcher_blockfetcher_.blockfetcheroptions.md#chain)*

*Defined in [lib/sync/fetcher/blockfetcher.ts:9](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/blockfetcher.ts#L9)*

___

###  config

• **config**: *[Config](../classes/_config_.config.md)*

*Inherited from [FetcherOptions](_sync_fetcher_fetcher_.fetcheroptions.md).[config](_sync_fetcher_fetcher_.fetcheroptions.md#config)*

*Defined in [lib/sync/fetcher/fetcher.ts:8](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.ts#L8)*

___

###  count

• **count**: *BN*

*Inherited from [BlockFetcherOptions](_sync_fetcher_blockfetcher_.blockfetcheroptions.md).[count](_sync_fetcher_blockfetcher_.blockfetcheroptions.md#count)*

*Defined in [lib/sync/fetcher/blockfetcher.ts:15](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/blockfetcher.ts#L15)*

___

###  first

• **first**: *BN*

*Inherited from [BlockFetcherOptions](_sync_fetcher_blockfetcher_.blockfetcheroptions.md).[first](_sync_fetcher_blockfetcher_.blockfetcheroptions.md#first)*

*Defined in [lib/sync/fetcher/blockfetcher.ts:12](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/blockfetcher.ts#L12)*

___

###  flow

• **flow**: *[FlowControl](../classes/_net_protocol_flowcontrol_.flowcontrol.md)*

*Defined in [lib/sync/fetcher/headerfetcher.ts:7](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/headerfetcher.ts#L7)*

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
