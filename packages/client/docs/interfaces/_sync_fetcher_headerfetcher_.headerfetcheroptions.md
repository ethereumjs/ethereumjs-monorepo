[ethereumjs-client](../README.md) › ["sync/fetcher/headerfetcher"](../modules/_sync_fetcher_headerfetcher_.md) › [HeaderFetcherOptions](_sync_fetcher_headerfetcher_.headerfetcheroptions.md)

# Interface: HeaderFetcherOptions

## Hierarchy

↳ [BlockFetcherOptions](_sync_fetcher_blockfetcher_.blockfetcheroptions.md)

↳ **HeaderFetcherOptions**

## Index

### Properties

- [banTime](_sync_fetcher_headerfetcher_.headerfetcheroptions.md#optional-bantime)
- [chain](_sync_fetcher_headerfetcher_.headerfetcheroptions.md#chain)
- [config](_sync_fetcher_headerfetcher_.headerfetcheroptions.md#config)
- [count](_sync_fetcher_headerfetcher_.headerfetcheroptions.md#count)
- [first](_sync_fetcher_headerfetcher_.headerfetcheroptions.md#first)
- [flow](_sync_fetcher_headerfetcher_.headerfetcheroptions.md#flow)
- [interval](_sync_fetcher_headerfetcher_.headerfetcheroptions.md#optional-interval)
- [maxPerRequest](_sync_fetcher_headerfetcher_.headerfetcheroptions.md#optional-maxperrequest)
- [maxQueue](_sync_fetcher_headerfetcher_.headerfetcheroptions.md#optional-maxqueue)
- [pool](_sync_fetcher_headerfetcher_.headerfetcheroptions.md#pool)
- [timeout](_sync_fetcher_headerfetcher_.headerfetcheroptions.md#optional-timeout)

## Properties

### `Optional` banTime

• **banTime**? : _undefined | number_

_Inherited from [FetcherOptions](_sync_fetcher_fetcher_.fetcheroptions.md).[banTime](_sync_fetcher_fetcher_.fetcheroptions.md#optional-bantime)_

_Defined in [lib/sync/fetcher/fetcher.ts:17](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.ts#L17)_

---

### chain

• **chain**: _[Chain](../classes/_blockchain_chain_.chain.md)_

_Inherited from [BlockFetcherOptions](_sync_fetcher_blockfetcher_.blockfetcheroptions.md).[chain](_sync_fetcher_blockfetcher_.blockfetcheroptions.md#chain)_

_Defined in [lib/sync/fetcher/blockfetcher.ts:9](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/blockfetcher.ts#L9)_

---

### config

• **config**: _[Config](../classes/_config_.config.md)_

_Inherited from [FetcherOptions](_sync_fetcher_fetcher_.fetcheroptions.md).[config](_sync_fetcher_fetcher_.fetcheroptions.md#config)_

_Defined in [lib/sync/fetcher/fetcher.ts:8](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.ts#L8)_

---

### count

• **count**: _BN_

_Inherited from [BlockFetcherOptions](_sync_fetcher_blockfetcher_.blockfetcheroptions.md).[count](_sync_fetcher_blockfetcher_.blockfetcheroptions.md#count)_

_Defined in [lib/sync/fetcher/blockfetcher.ts:15](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/blockfetcher.ts#L15)_

---

### first

• **first**: _BN_

_Inherited from [BlockFetcherOptions](_sync_fetcher_blockfetcher_.blockfetcheroptions.md).[first](_sync_fetcher_blockfetcher_.blockfetcheroptions.md#first)_

_Defined in [lib/sync/fetcher/blockfetcher.ts:12](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/blockfetcher.ts#L12)_

---

### flow

• **flow**: _[FlowControl](../classes/_net_protocol_flowcontrol_.flowcontrol.md)_

_Defined in [lib/sync/fetcher/headerfetcher.ts:7](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/headerfetcher.ts#L7)_

---

### `Optional` interval

• **interval**? : _undefined | number_

_Inherited from [FetcherOptions](_sync_fetcher_fetcher_.fetcheroptions.md).[interval](_sync_fetcher_fetcher_.fetcheroptions.md#optional-interval)_

_Defined in [lib/sync/fetcher/fetcher.ts:26](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.ts#L26)_

---

### `Optional` maxPerRequest

• **maxPerRequest**? : _undefined | number_

_Inherited from [FetcherOptions](_sync_fetcher_fetcher_.fetcheroptions.md).[maxPerRequest](_sync_fetcher_fetcher_.fetcheroptions.md#optional-maxperrequest)_

_Defined in [lib/sync/fetcher/fetcher.ts:23](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.ts#L23)_

---

### `Optional` maxQueue

• **maxQueue**? : _undefined | number_

_Inherited from [FetcherOptions](_sync_fetcher_fetcher_.fetcheroptions.md).[maxQueue](_sync_fetcher_fetcher_.fetcheroptions.md#optional-maxqueue)_

_Defined in [lib/sync/fetcher/fetcher.ts:20](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.ts#L20)_

---

### pool

• **pool**: _[PeerPool](../classes/_net_peerpool_.peerpool.md)_

_Inherited from [FetcherOptions](_sync_fetcher_fetcher_.fetcheroptions.md).[pool](_sync_fetcher_fetcher_.fetcheroptions.md#pool)_

_Defined in [lib/sync/fetcher/fetcher.ts:11](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.ts#L11)_

---

### `Optional` timeout

• **timeout**? : _undefined | number_

_Inherited from [FetcherOptions](_sync_fetcher_fetcher_.fetcheroptions.md).[timeout](_sync_fetcher_fetcher_.fetcheroptions.md#optional-timeout)_

_Defined in [lib/sync/fetcher/fetcher.ts:14](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/sync/fetcher/fetcher.ts#L14)_
