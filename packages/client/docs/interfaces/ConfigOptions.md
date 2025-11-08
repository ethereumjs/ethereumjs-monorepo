[**@ethereumjs/client**](../README.md)

***

[@ethereumjs/client](../README.md) / ConfigOptions

# Interface: ConfigOptions

Defined in: [config.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L32)

## Properties

### accountCache?

> `optional` **accountCache**: `number`

Defined in: [config.ts:195](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L195)

Size for the account cache (max number of accounts)

***

### accounts?

> `optional` **accounts**: \[`Address`, `Uint8Array`\<`ArrayBufferLike`\>\][]

Defined in: [config.ts:265](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L265)

Unlocked accounts of form [address, privateKey]
Currently only the first account is used to seal mined PoA blocks

Default: []

***

### blobsAndProofsCacheBlocks?

> `optional` **blobsAndProofsCacheBlocks**: `number`

Defined in: [config.ts:334](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L334)

The cache for blobs and proofs to support CL import blocks

***

### bootnodes?

> `optional` **bootnodes**: `Multiaddr`[]

Defined in: [config.ts:92](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L92)

Network bootnodes
(e.g. abc@18.138.108.67 or /ip4/127.0.0.1/tcp/50505/p2p/QmABC)

***

### codeCache?

> `optional` **codeCache**: `number`

Defined in: [config.ts:205](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L205)

Size for the code cache (max number of contracts)

***

### common?

> `optional` **common**: `Common`

Defined in: [config.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L39)

Specify the chain by providing a Common instance,
the common instance will not be modified by client

Default: 'mainnet' Common

***

### datadir?

> `optional` **datadir**: `string`

Defined in: [config.ts:79](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L79)

Root data directory for the blockchain

***

### debugCode?

> `optional` **debugCode**: `boolean`

Defined in: [config.ts:219](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L219)

Generate code for local debugging, currently providing a
code snippet which can be used to run blocks on the
EthereumJS VM on execution errors

(meant to be used internally for the most part)

***

### discDns?

> `optional` **discDns**: `boolean`

Defined in: [config.ts:226](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L226)

Query EIP-1459 DNS TXT records for peer discovery

Default: `true` for testnets, false for mainnet

***

### discV4?

> `optional` **discV4**: `boolean`

Defined in: [config.ts:233](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L233)

Use v4 ("findneighbour" node requests) for peer discovery

Default: `false` for testnets, true for mainnet

***

### dnsAddr?

> `optional` **dnsAddr**: `string`

Defined in: [config.ts:175](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L175)

DNS server to query DNS TXT records from for peer discovery

Default `8.8.8.8` (Google)

***

### dnsNetworks?

> `optional` **dnsNetworks**: `string`[]

Defined in: [config.ts:180](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L180)

EIP-1459 ENR Tree urls to query via DNS for peer discovery

***

### enableSnapSync?

> `optional` **enableSnapSync**: `boolean`

Defined in: [config.ts:53](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L53)

Whether to enable and run snapSync, currently experimental

Default: false

***

### engineNewpayloadMaxExecute?

> `optional` **engineNewpayloadMaxExecute**: `number`

Defined in: [config.ts:309](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L309)

Max blocks including unexecuted parents to be executed in engine's newPayload

***

### engineNewpayloadMaxTxsExecute?

> `optional` **engineNewpayloadMaxTxsExecute**: `number`

Defined in: [config.ts:314](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L314)

Limit max transactions per block to execute in engine's newPayload for responsive engine api

***

### engineParentLookupMaxDepth?

> `optional` **engineParentLookupMaxDepth**: `number`

Defined in: [config.ts:304](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L304)

Max depth for parent lookups in engine's newPayload and forkchoiceUpdated

***

### execution?

> `optional` **execution**: `boolean`

Defined in: [config.ts:185](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L185)

Start continuous VM execution (pre-Merge setting)

***

### extIP?

> `optional` **extIP**: `string`

Defined in: [config.ts:104](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L104)

RLPx external IP

***

### isSingleNode?

> `optional` **isSingleNode**: `boolean`

Defined in: [config.ts:247](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L247)

Is a single node and doesn't need peers for synchronization

Default: `false`

***

### key?

> `optional` **key**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [config.ts:86](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L86)

Private key for the client.
Use return value of [Config.getClientKey](../classes/Config.md#getclientkey).
If left blank, a random key will be generated and used.

***

### logger?

> `optional` **logger**: `Logger`

Defined in: [config.ts:135](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L135)

A custom winston logger can be provided
if setting logging verbosity is not sufficient

Default: Logger with loglevel 'info'

***

### maxAccountRange?

> `optional` **maxAccountRange**: `bigint`

Defined in: [config.ts:295](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L295)

***

### maxFetcherJobs?

> `optional` **maxFetcherJobs**: `number`

Defined in: [config.ts:149](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L149)

Max jobs to be enqueued in the fetcher at any given time

Default: `100`

***

### maxFetcherRequests?

> `optional` **maxFetcherRequests**: `number`

Defined in: [config.ts:154](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L154)

Max outgoing multi-peer requests by the fetcher at any given time

***

### maxInvalidBlocksErrorCache?

> `optional` **maxInvalidBlocksErrorCache**: `number`

Defined in: [config.ts:321](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L321)

Cache size of invalid block hashes and their errors

***

### maxPeers?

> `optional` **maxPeers**: `number`

Defined in: [config.ts:168](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L168)

Maximum peers allowed

Default: `25`

***

### maxPerRequest?

> `optional` **maxPerRequest**: `number`

Defined in: [config.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L142)

Max items per block or header request

Default: `100`

***

### maxRangeBytes?

> `optional` **maxRangeBytes**: `number`

Defined in: [config.ts:293](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L293)

***

### maxStorageRange?

> `optional` **maxStorageRange**: `bigint`

Defined in: [config.ts:316](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L316)

***

### mine?

> `optional` **mine**: `boolean`

Defined in: [config.ts:240](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L240)

Enable mining

Default: `false`

***

### minerCoinbase?

> `optional` **minerCoinbase**: `Address`

Defined in: [config.ts:271](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L271)

Address for mining rewards (etherbase)
If not provided, defaults to the primary account.

***

### minPeers?

> `optional` **minPeers**: `number`

Defined in: [config.ts:161](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L161)

Number of peers needed before syncing

Default: `1`

***

### multiaddrs?

> `optional` **multiaddrs**: `Multiaddr`[]

Defined in: [config.ts:110](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L110)

Network multiaddrs for libp2p
(e.g. /ip4/127.0.0.1/tcp/50505/p2p/QmABC)

***

### numBlocksPerIteration?

> `optional` **numBlocksPerIteration**: `number`

Defined in: [config.ts:190](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L190)

Number of blocks to execute in batch mode and logged to console

***

### port?

> `optional` **port**: `number`

Defined in: [config.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L99)

RLPx listening port

Default: `30303`

***

### prefixStorageTrieKeys?

> `optional` **prefixStorageTrieKeys**: `boolean`

Defined in: [config.ts:61](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L61)

A temporary option to offer backward compatibility with already-synced databases that are
using non-prefixed keys for storage tries

Default: true

***

### prometheusMetrics?

> `optional` **prometheusMetrics**: `PrometheusMetrics`

Defined in: [config.ts:339](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L339)

Enables Prometheus Metrics that can be collected for monitoring client health

***

### pruneEngineCache?

> `optional` **pruneEngineCache**: `boolean`

Defined in: [config.ts:322](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L322)

***

### safeReorgDistance?

> `optional` **safeReorgDistance**: `number`

Defined in: [config.ts:277](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L277)

If there is a reorg, this is a safe distance from which
to try to refetch and re-feed the blocks.

***

### savePreimages?

> `optional` **savePreimages**: `boolean`

Defined in: [config.ts:329](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L329)

Save account keys preimages in the meta db (default: false)

***

### saveReceipts?

> `optional` **saveReceipts**: `boolean`

Defined in: [config.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L121)

Save tx receipts and logs in the meta db (default: false)

***

### server?

> `optional` **server**: `RlpxServer`

Defined in: [config.ts:116](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L116)

Transport servers (RLPx)
Only used for testing purposes

***

### skeletonFillCanonicalBackStep?

> `optional` **skeletonFillCanonicalBackStep**: `number`

Defined in: [config.ts:284](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L284)

If there is a skeleton fillCanonicalChain block lookup errors
because of closing chain conditions, this allows skeleton
to backstep and fill again using reverse block fetcher.

***

### skeletonSubchainMergeMinimum?

> `optional` **skeletonSubchainMergeMinimum**: `number`

Defined in: [config.ts:291](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L291)

If skeleton subchains can be merged, what is the minimum tail
gain, as subchain merge will lead to the ReverseBlockFetcher
reset

***

### snapAvailabilityDepth?

> `optional` **snapAvailabilityDepth**: `bigint`

Defined in: [config.ts:323](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L323)

***

### snapTransitionSafeDepth?

> `optional` **snapTransitionSafeDepth**: `bigint`

Defined in: [config.ts:324](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L324)

***

### storageCache?

> `optional` **storageCache**: `number`

Defined in: [config.ts:200](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L200)

Size for the storage cache (max number of contracts)

***

### syncedStateRemovalPeriod?

> `optional` **syncedStateRemovalPeriod**: `number`

Defined in: [config.ts:299](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L299)

The time after which synced state is downgraded to unsynced

***

### syncmode?

> `optional` **syncmode**: [`SyncMode`](../type-aliases/SyncMode.md)

Defined in: [config.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L46)

Synchronization mode ('full', 'none')

Default: 'full'

***

### trieCache?

> `optional` **trieCache**: `number`

Defined in: [config.ts:210](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L210)

Size for the trie cache (max number of trie nodes)

***

### txLookupLimit?

> `optional` **txLookupLimit**: `number`

Defined in: [config.ts:127](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L127)

Number of recent blocks to maintain transactions index for
(default = 2350000 = about one year, 0 = entire chain)

***

### useStringValueTrieDB?

> `optional` **useStringValueTrieDB**: `boolean`

Defined in: [config.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L67)

A temporary option to offer backward compatibility with already-synced databases that stores
trie items as `string`, instead of the more performant `Uint8Array`

***

### vm?

> `optional` **vm**: `VM`

Defined in: [config.ts:74](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L74)

Provide a custom VM instance to process blocks

Default: VM instance created by client

***

### vmProfileBlocks?

> `optional` **vmProfileBlocks**: `boolean`

Defined in: [config.ts:252](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L252)

Whether to profile VM blocks

***

### vmProfileTxs?

> `optional` **vmProfileTxs**: `boolean`

Defined in: [config.ts:257](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L257)

Whether to profile VM txs
