[@ethereumjs/client](../README.md) / ConfigOptions

# Interface: ConfigOptions

## Table of contents

### Properties

- [accountCache](ConfigOptions.md#accountcache)
- [accounts](ConfigOptions.md#accounts)
- [bootnodes](ConfigOptions.md#bootnodes)
- [codeCache](ConfigOptions.md#codecache)
- [common](ConfigOptions.md#common)
- [datadir](ConfigOptions.md#datadir)
- [debugCode](ConfigOptions.md#debugcode)
- [discDns](ConfigOptions.md#discdns)
- [discV4](ConfigOptions.md#discv4)
- [dnsAddr](ConfigOptions.md#dnsaddr)
- [dnsNetworks](ConfigOptions.md#dnsnetworks)
- [enableSnapSync](ConfigOptions.md#enablesnapsync)
- [engineNewpayloadMaxExecute](ConfigOptions.md#enginenewpayloadmaxexecute)
- [engineNewpayloadMaxTxsExecute](ConfigOptions.md#enginenewpayloadmaxtxsexecute)
- [engineParentLookupMaxDepth](ConfigOptions.md#engineparentlookupmaxdepth)
- [execution](ConfigOptions.md#execution)
- [extIP](ConfigOptions.md#extip)
- [isSingleNode](ConfigOptions.md#issinglenode)
- [key](ConfigOptions.md#key)
- [lightserv](ConfigOptions.md#lightserv)
- [logger](ConfigOptions.md#logger)
- [maxAccountRange](ConfigOptions.md#maxaccountrange)
- [maxFetcherJobs](ConfigOptions.md#maxfetcherjobs)
- [maxFetcherRequests](ConfigOptions.md#maxfetcherrequests)
- [maxInvalidBlocksErrorCache](ConfigOptions.md#maxinvalidblockserrorcache)
- [maxPeers](ConfigOptions.md#maxpeers)
- [maxPerRequest](ConfigOptions.md#maxperrequest)
- [maxRangeBytes](ConfigOptions.md#maxrangebytes)
- [maxStorageRange](ConfigOptions.md#maxstoragerange)
- [minPeers](ConfigOptions.md#minpeers)
- [mine](ConfigOptions.md#mine)
- [minerCoinbase](ConfigOptions.md#minercoinbase)
- [multiaddrs](ConfigOptions.md#multiaddrs)
- [numBlocksPerIteration](ConfigOptions.md#numblocksperiteration)
- [port](ConfigOptions.md#port)
- [prefixStorageTrieKeys](ConfigOptions.md#prefixstoragetriekeys)
- [pruneEngineCache](ConfigOptions.md#pruneenginecache)
- [safeReorgDistance](ConfigOptions.md#safereorgdistance)
- [savePreimages](ConfigOptions.md#savepreimages)
- [saveReceipts](ConfigOptions.md#savereceipts)
- [server](ConfigOptions.md#server)
- [skeletonFillCanonicalBackStep](ConfigOptions.md#skeletonfillcanonicalbackstep)
- [skeletonSubchainMergeMinimum](ConfigOptions.md#skeletonsubchainmergeminimum)
- [snapAvailabilityDepth](ConfigOptions.md#snapavailabilitydepth)
- [snapTransitionSafeDepth](ConfigOptions.md#snaptransitionsafedepth)
- [statelessVerkle](ConfigOptions.md#statelessverkle)
- [storageCache](ConfigOptions.md#storagecache)
- [syncedStateRemovalPeriod](ConfigOptions.md#syncedstateremovalperiod)
- [syncmode](ConfigOptions.md#syncmode)
- [trieCache](ConfigOptions.md#triecache)
- [txLookupLimit](ConfigOptions.md#txlookuplimit)
- [useStringValueTrieDB](ConfigOptions.md#usestringvaluetriedb)
- [vm](ConfigOptions.md#vm)
- [vmProfileBlocks](ConfigOptions.md#vmprofileblocks)
- [vmProfileTxs](ConfigOptions.md#vmprofiletxs)

## Properties

### accountCache

• `Optional` **accountCache**: `number`

Size for the account cache (max number of accounts)

#### Defined in

[config.ts:199](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L199)

___

### accounts

• `Optional` **accounts**: [address: Address, privKey: Uint8Array][]

Unlocked accounts of form [address, privateKey]
Currently only the first account is used to seal mined PoA blocks

Default: []

#### Defined in

[config.ts:269](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L269)

___

### bootnodes

• `Optional` **bootnodes**: `Multiaddr`[]

Network bootnodes
(e.g. abc@18.138.108.67 or /ip4/127.0.0.1/tcp/50505/p2p/QmABC)

#### Defined in

[config.ts:96](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L96)

___

### codeCache

• `Optional` **codeCache**: `number`

Size for the code cache (max number of contracts)

#### Defined in

[config.ts:209](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L209)

___

### common

• `Optional` **common**: `Common`

Specify the chain by providing a Common instance,
the common instance will not be modified by client

Default: 'mainnet' Common

#### Defined in

[config.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L36)

___

### datadir

• `Optional` **datadir**: `string`

Root data directory for the blockchain

#### Defined in

[config.ts:83](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L83)

___

### debugCode

• `Optional` **debugCode**: `boolean`

Generate code for local debugging, currently providing a
code snippet which can be used to run blocks on the
EthereumJS VM on execution errors

(meant to be used internally for the most part)

#### Defined in

[config.ts:223](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L223)

___

### discDns

• `Optional` **discDns**: `boolean`

Query EIP-1459 DNS TXT records for peer discovery

Default: `true` for testnets, false for mainnet

#### Defined in

[config.ts:230](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L230)

___

### discV4

• `Optional` **discV4**: `boolean`

Use v4 ("findneighbour" node requests) for peer discovery

Default: `false` for testnets, true for mainnet

#### Defined in

[config.ts:237](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L237)

___

### dnsAddr

• `Optional` **dnsAddr**: `string`

DNS server to query DNS TXT records from for peer discovery

Default `8.8.8.8` (Google)

#### Defined in

[config.ts:179](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L179)

___

### dnsNetworks

• `Optional` **dnsNetworks**: `string`[]

EIP-1459 ENR Tree urls to query via DNS for peer discovery

#### Defined in

[config.ts:184](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L184)

___

### enableSnapSync

• `Optional` **enableSnapSync**: `boolean`

Whether to enable and run snapSync, currently experimental

Default: false

#### Defined in

[config.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L50)

___

### engineNewpayloadMaxExecute

• `Optional` **engineNewpayloadMaxExecute**: `number`

Max blocks including unexecuted parents to be executed in engine's newPayload

#### Defined in

[config.ts:313](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L313)

___

### engineNewpayloadMaxTxsExecute

• `Optional` **engineNewpayloadMaxTxsExecute**: `number`

Limit max transactions per block to execute in engine's newPayload for responsive engine api

#### Defined in

[config.ts:318](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L318)

___

### engineParentLookupMaxDepth

• `Optional` **engineParentLookupMaxDepth**: `number`

Max depth for parent lookups in engine's newPayload and forkchoiceUpdated

#### Defined in

[config.ts:308](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L308)

___

### execution

• `Optional` **execution**: `boolean`

Start continuous VM execution (pre-Merge setting)

#### Defined in

[config.ts:189](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L189)

___

### extIP

• `Optional` **extIP**: `string`

RLPx external IP

#### Defined in

[config.ts:108](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L108)

___

### isSingleNode

• `Optional` **isSingleNode**: `boolean`

Is a single node and doesn't need peers for synchronization

Default: `false`

#### Defined in

[config.ts:251](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L251)

___

### key

• `Optional` **key**: `Uint8Array`

Private key for the client.
Use return value of [getClientKey](../classes/Config.md#getclientkey).
If left blank, a random key will be generated and used.

#### Defined in

[config.ts:90](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L90)

___

### lightserv

• `Optional` **lightserv**: `boolean`

Serve light peer requests

Default: `false`

#### Defined in

[config.ts:78](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L78)

___

### logger

• `Optional` **logger**: `Logger`

A custom winston logger can be provided
if setting logging verbosity is not sufficient

Default: Logger with loglevel 'info'

#### Defined in

[config.ts:139](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L139)

___

### maxAccountRange

• `Optional` **maxAccountRange**: `bigint`

#### Defined in

[config.ts:299](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L299)

___

### maxFetcherJobs

• `Optional` **maxFetcherJobs**: `number`

Max jobs to be enqueued in the fetcher at any given time

Default: `100`

#### Defined in

[config.ts:153](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L153)

___

### maxFetcherRequests

• `Optional` **maxFetcherRequests**: `number`

Max outgoing multi-peer requests by the fetcher at any given time

#### Defined in

[config.ts:158](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L158)

___

### maxInvalidBlocksErrorCache

• `Optional` **maxInvalidBlocksErrorCache**: `number`

Cache size of invalid block hashes and their errors

#### Defined in

[config.ts:325](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L325)

___

### maxPeers

• `Optional` **maxPeers**: `number`

Maximum peers allowed

Default: `25`

#### Defined in

[config.ts:172](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L172)

___

### maxPerRequest

• `Optional` **maxPerRequest**: `number`

Max items per block or header request

Default: `100`

#### Defined in

[config.ts:146](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L146)

___

### maxRangeBytes

• `Optional` **maxRangeBytes**: `number`

#### Defined in

[config.ts:297](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L297)

___

### maxStorageRange

• `Optional` **maxStorageRange**: `bigint`

#### Defined in

[config.ts:320](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L320)

___

### minPeers

• `Optional` **minPeers**: `number`

Number of peers needed before syncing

Default: `1`

#### Defined in

[config.ts:165](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L165)

___

### mine

• `Optional` **mine**: `boolean`

Enable mining

Default: `false`

#### Defined in

[config.ts:244](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L244)

___

### minerCoinbase

• `Optional` **minerCoinbase**: `Address`

Address for mining rewards (etherbase)
If not provided, defaults to the primary account.

#### Defined in

[config.ts:275](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L275)

___

### multiaddrs

• `Optional` **multiaddrs**: `Multiaddr`[]

Network multiaddrs for libp2p
(e.g. /ip4/127.0.0.1/tcp/50505/p2p/QmABC)

#### Defined in

[config.ts:114](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L114)

___

### numBlocksPerIteration

• `Optional` **numBlocksPerIteration**: `number`

Number of blocks to execute in batch mode and logged to console

#### Defined in

[config.ts:194](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L194)

___

### port

• `Optional` **port**: `number`

RLPx listening port

Default: `30303`

#### Defined in

[config.ts:103](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L103)

___

### prefixStorageTrieKeys

• `Optional` **prefixStorageTrieKeys**: `boolean`

A temporary option to offer backward compatibility with already-synced databases that are
using non-prefixed keys for storage tries

Default: true

#### Defined in

[config.ts:58](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L58)

___

### pruneEngineCache

• `Optional` **pruneEngineCache**: `boolean`

#### Defined in

[config.ts:326](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L326)

___

### safeReorgDistance

• `Optional` **safeReorgDistance**: `number`

If there is a reorg, this is a safe distance from which
to try to refetch and refeed the blocks.

#### Defined in

[config.ts:281](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L281)

___

### savePreimages

• `Optional` **savePreimages**: `boolean`

Save account keys preimages in the meta db (default: false)

#### Defined in

[config.ts:333](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L333)

___

### saveReceipts

• `Optional` **saveReceipts**: `boolean`

Save tx receipts and logs in the meta db (default: false)

#### Defined in

[config.ts:125](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L125)

___

### server

• `Optional` **server**: `RlpxServer`

Transport servers (RLPx)
Only used for testing purposes

#### Defined in

[config.ts:120](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L120)

___

### skeletonFillCanonicalBackStep

• `Optional` **skeletonFillCanonicalBackStep**: `number`

If there is a skeleton fillCanonicalChain block lookup errors
because of closing chain conditions, this allows skeleton
to backstep and fill again using reverse block fetcher.

#### Defined in

[config.ts:288](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L288)

___

### skeletonSubchainMergeMinimum

• `Optional` **skeletonSubchainMergeMinimum**: `number`

If skeleton subchains can be merged, what is the minimum tail
gain, as subchain merge will lead to the ReverseBlockFetcher
reset

#### Defined in

[config.ts:295](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L295)

___

### snapAvailabilityDepth

• `Optional` **snapAvailabilityDepth**: `bigint`

#### Defined in

[config.ts:327](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L327)

___

### snapTransitionSafeDepth

• `Optional` **snapTransitionSafeDepth**: `bigint`

#### Defined in

[config.ts:328](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L328)

___

### statelessVerkle

• `Optional` **statelessVerkle**: `boolean`

Enables stateless verkle block execution (default: false)

#### Defined in

[config.ts:338](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L338)

___

### storageCache

• `Optional` **storageCache**: `number`

Size for the storage cache (max number of contracts)

#### Defined in

[config.ts:204](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L204)

___

### syncedStateRemovalPeriod

• `Optional` **syncedStateRemovalPeriod**: `number`

The time after which synced state is downgraded to unsynced

#### Defined in

[config.ts:303](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L303)

___

### syncmode

• `Optional` **syncmode**: [`SyncMode`](../enums/SyncMode.md)

Synchronization mode ('full', 'light', 'none')

Default: 'full'

#### Defined in

[config.ts:43](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L43)

___

### trieCache

• `Optional` **trieCache**: `number`

Size for the trie cache (max number of trie nodes)

#### Defined in

[config.ts:214](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L214)

___

### txLookupLimit

• `Optional` **txLookupLimit**: `number`

Number of recent blocks to maintain transactions index for
(default = 2350000 = about one year, 0 = entire chain)

#### Defined in

[config.ts:131](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L131)

___

### useStringValueTrieDB

• `Optional` **useStringValueTrieDB**: `boolean`

A temporary option to offer backward compatibility with already-synced databases that stores
trie items as `string`, instead of the more performant `Uint8Array`

#### Defined in

[config.ts:64](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L64)

___

### vm

• `Optional` **vm**: `VM`

Provide a custom VM instance to process blocks

Default: VM instance created by client

#### Defined in

[config.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L71)

___

### vmProfileBlocks

• `Optional` **vmProfileBlocks**: `boolean`

Whether to profile VM blocks

#### Defined in

[config.ts:256](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L256)

___

### vmProfileTxs

• `Optional` **vmProfileTxs**: `boolean`

Whether to profile VM txs

#### Defined in

[config.ts:261](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L261)
