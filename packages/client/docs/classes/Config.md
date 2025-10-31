[**@ethereumjs/client**](../README.md)

***

[@ethereumjs/client](../README.md) / Config

# Class: Config

Defined in: [config.ts:342](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L342)

## Constructors

### Constructor

> **new Config**(`options`): `Config`

Defined in: [config.ts:463](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L463)

#### Parameters

##### options

[`ConfigOptions`](../interfaces/ConfigOptions.md) = `{}`

#### Returns

`Config`

## Properties

### accountCache

> `readonly` **accountCache**: `number`

Defined in: [config.ts:411](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L411)

***

### accounts

> `readonly` **accounts**: \[`Address`, `Uint8Array`\<`ArrayBufferLike`\>\][]

Defined in: [config.ts:420](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L420)

***

### blobsAndProofsCacheBlocks

> `readonly` **blobsAndProofsCacheBlocks**: `number`

Defined in: [config.ts:445](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L445)

***

### bootnodes?

> `readonly` `optional` **bootnodes**: `Multiaddr`[]

Defined in: [config.ts:397](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L397)

***

### chainCommon

> `readonly` **chainCommon**: `Common`

Defined in: [config.ts:456](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L456)

***

### codeCache

> `readonly` **codeCache**: `number`

Defined in: [config.ts:413](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L413)

***

### datadir

> `readonly` **datadir**: `string`

Defined in: [config.ts:395](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L395)

***

### debugCode

> `readonly` **debugCode**: `boolean`

Defined in: [config.ts:415](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L415)

***

### discDns

> `readonly` **discDns**: `boolean`

Defined in: [config.ts:416](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L416)

***

### discV4

> `readonly` **discV4**: `boolean`

Defined in: [config.ts:417](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L417)

***

### dnsAddr

> `readonly` **dnsAddr**: `string`

Defined in: [config.ts:408](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L408)

***

### enableSnapSync

> `readonly` **enableSnapSync**: `boolean`

Defined in: [config.ts:441](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L441)

***

### engineNewpayloadMaxExecute

> `readonly` **engineNewpayloadMaxExecute**: `number`

Defined in: [config.ts:434](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L434)

***

### engineNewpayloadMaxTxsExecute

> `readonly` **engineNewpayloadMaxTxsExecute**: `number`

Defined in: [config.ts:435](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L435)

***

### engineParentLookupMaxDepth

> `readonly` **engineParentLookupMaxDepth**: `number`

Defined in: [config.ts:433](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L433)

***

### events

> `readonly` **events**: `EventEmitter`\<`EventParams`\>

Defined in: [config.ts:347](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L347)

Central event bus for events emitted by the different
components of the client

***

### execCommon

> `readonly` **execCommon**: `Common`

Defined in: [config.ts:457](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L457)

***

### execution

> `readonly` **execution**: `boolean`

Defined in: [config.ts:409](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L409)

***

### extIP?

> `readonly` `optional` **extIP**: `string`

Defined in: [config.ts:399](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L399)

***

### isSingleNode

> `readonly` **isSingleNode**: `boolean`

Defined in: [config.ts:419](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L419)

***

### key

> `readonly` **key**: `Uint8Array`

Defined in: [config.ts:396](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L396)

***

### lastSyncDate

> **lastSyncDate**: `number`

Defined in: [config.ts:450](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L450)

lastSyncDate in ms

***

### lastSynchronized?

> `optional` **lastSynchronized**: `boolean`

Defined in: [config.ts:448](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L448)

***

### logger

> `readonly` **logger**: `Logger` \| `undefined`

Defined in: [config.ts:392](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L392)

***

### maxAccountRange

> `readonly` **maxAccountRange**: `bigint`

Defined in: [config.ts:428](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L428)

***

### maxFetcherJobs

> `readonly` **maxFetcherJobs**: `number`

Defined in: [config.ts:404](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L404)

***

### maxFetcherRequests

> `readonly` **maxFetcherRequests**: `number`

Defined in: [config.ts:405](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L405)

***

### maxInvalidBlocksErrorCache

> `readonly` **maxInvalidBlocksErrorCache**: `number`

Defined in: [config.ts:430](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L430)

***

### maxPeers

> `readonly` **maxPeers**: `number`

Defined in: [config.ts:407](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L407)

***

### maxPerRequest

> `readonly` **maxPerRequest**: `number`

Defined in: [config.ts:403](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L403)

***

### maxRangeBytes

> `readonly` **maxRangeBytes**: `number`

Defined in: [config.ts:427](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L427)

***

### maxStorageRange

> `readonly` **maxStorageRange**: `bigint`

Defined in: [config.ts:429](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L429)

***

### metrics

> `readonly` **metrics**: `PrometheusMetrics` \| `undefined`

Defined in: [config.ts:461](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L461)

***

### mine

> `readonly` **mine**: `boolean`

Defined in: [config.ts:418](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L418)

***

### minerCoinbase?

> `readonly` `optional` **minerCoinbase**: `Address`

Defined in: [config.ts:421](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L421)

***

### minPeers

> `readonly` **minPeers**: `number`

Defined in: [config.ts:406](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L406)

***

### multiaddrs?

> `readonly` `optional` **multiaddrs**: `Multiaddr`[]

Defined in: [config.ts:400](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L400)

***

### numBlocksPerIteration

> `readonly` **numBlocksPerIteration**: `number`

Defined in: [config.ts:410](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L410)

***

### port?

> `readonly` `optional` **port**: `number`

Defined in: [config.ts:398](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L398)

***

### prefixStorageTrieKeys

> `readonly` **prefixStorageTrieKeys**: `boolean`

Defined in: [config.ts:439](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L439)

***

### pruneEngineCache

> `readonly` **pruneEngineCache**: `boolean`

Defined in: [config.ts:431](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L431)

***

### safeReorgDistance

> `readonly` **safeReorgDistance**: `number`

Defined in: [config.ts:424](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L424)

***

### savePreimages

> `readonly` **savePreimages**: `boolean`

Defined in: [config.ts:443](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L443)

***

### saveReceipts

> `readonly` **saveReceipts**: `boolean`

Defined in: [config.ts:401](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L401)

***

### server

> `readonly` **server**: `RlpxServer` \| `undefined` = `undefined`

Defined in: [config.ts:459](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L459)

***

### shutdown

> **shutdown**: `boolean` = `false`

Defined in: [config.ts:454](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L454)

Client is in the process of shutting down

***

### skeletonFillCanonicalBackStep

> `readonly` **skeletonFillCanonicalBackStep**: `number`

Defined in: [config.ts:425](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L425)

***

### skeletonSubchainMergeMinimum

> `readonly` **skeletonSubchainMergeMinimum**: `number`

Defined in: [config.ts:426](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L426)

***

### snapAvailabilityDepth

> `readonly` **snapAvailabilityDepth**: `bigint`

Defined in: [config.ts:436](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L436)

***

### snapTransitionSafeDepth

> `readonly` **snapTransitionSafeDepth**: `bigint`

Defined in: [config.ts:437](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L437)

***

### storageCache

> `readonly` **storageCache**: `number`

Defined in: [config.ts:412](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L412)

***

### syncedStateRemovalPeriod

> `readonly` **syncedStateRemovalPeriod**: `number`

Defined in: [config.ts:432](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L432)

***

### synchronized

> **synchronized**: `boolean`

Defined in: [config.ts:447](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L447)

***

### syncmode

> `readonly` **syncmode**: [`SyncMode`](../type-aliases/SyncMode.md)

Defined in: [config.ts:393](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L393)

***

### syncTargetHeight?

> `optional` **syncTargetHeight**: `bigint`

Defined in: [config.ts:452](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L452)

Best known block height

***

### trieCache

> `readonly` **trieCache**: `number`

Defined in: [config.ts:414](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L414)

***

### txLookupLimit

> `readonly` **txLookupLimit**: `number`

Defined in: [config.ts:402](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L402)

***

### useStringValueTrieDB

> `readonly` **useStringValueTrieDB**: `boolean`

Defined in: [config.ts:442](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L442)

***

### vm?

> `readonly` `optional` **vm**: `VM`

Defined in: [config.ts:394](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L394)

***

### vmProfilerOpts?

> `readonly` `optional` **vmProfilerOpts**: `VMProfilerOpts`

Defined in: [config.ts:422](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L422)

***

### ACCOUNT\_CACHE

> `readonly` `static` **ACCOUNT\_CACHE**: `400000` = `400000`

Defined in: [config.ts:361](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L361)

***

### BLOBS\_AND\_PROOFS\_CACHE\_BLOCKS

> `readonly` `static` **BLOBS\_AND\_PROOFS\_CACHE\_BLOCKS**: `32` = `32`

Defined in: [config.ts:390](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L390)

***

### CHAIN\_DEFAULT

> `readonly` `static` **CHAIN\_DEFAULT**: `ChainConfig` = `Mainnet`

Defined in: [config.ts:349](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L349)

***

### CODE\_CACHE

> `readonly` `static` **CODE\_CACHE**: `200000` = `200000`

Defined in: [config.ts:363](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L363)

***

### DATADIR\_DEFAULT

> `readonly` `static` **DATADIR\_DEFAULT**: `"./datadir"`

Defined in: [config.ts:351](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L351)

***

### DEBUGCODE\_DEFAULT

> `readonly` `static` **DEBUGCODE\_DEFAULT**: `false` = `false`

Defined in: [config.ts:365](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L365)

***

### DNSADDR\_DEFAULT

> `readonly` `static` **DNSADDR\_DEFAULT**: `"8.8.8.8"` = `'8.8.8.8'`

Defined in: [config.ts:358](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L358)

***

### ENGINE\_NEWPAYLOAD\_MAX\_EXECUTE

> `readonly` `static` **ENGINE\_NEWPAYLOAD\_MAX\_EXECUTE**: `2` = `2`

Defined in: [config.ts:382](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L382)

***

### ENGINE\_NEWPAYLOAD\_MAX\_TXS\_EXECUTE

> `readonly` `static` **ENGINE\_NEWPAYLOAD\_MAX\_TXS\_EXECUTE**: `200` = `200`

Defined in: [config.ts:383](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L383)

***

### ENGINE\_PARENT\_LOOKUP\_MAX\_DEPTH

> `readonly` `static` **ENGINE\_PARENT\_LOOKUP\_MAX\_DEPTH**: `128` = `128`

Defined in: [config.ts:381](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L381)

***

### EXECUTION

> `readonly` `static` **EXECUTION**: `true` = `true`

Defined in: [config.ts:359](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L359)

***

### MAX\_ACCOUNT\_RANGE

> `readonly` `static` **MAX\_ACCOUNT\_RANGE**: `bigint`

Defined in: [config.ts:372](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L372)

***

### MAX\_INVALID\_BLOCKS\_ERROR\_CACHE

> `readonly` `static` **MAX\_INVALID\_BLOCKS\_ERROR\_CACHE**: `128` = `128`

Defined in: [config.ts:376](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L376)

***

### MAX\_RANGE\_BYTES

> `readonly` `static` **MAX\_RANGE\_BYTES**: `50000` = `50000`

Defined in: [config.ts:370](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L370)

***

### MAX\_STORAGE\_RANGE

> `readonly` `static` **MAX\_STORAGE\_RANGE**: `bigint`

Defined in: [config.ts:374](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L374)

***

### MAXFETCHERJOBS\_DEFAULT

> `readonly` `static` **MAXFETCHERJOBS\_DEFAULT**: `100` = `100`

Defined in: [config.ts:354](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L354)

***

### MAXFETCHERREQUESTS\_DEFAULT

> `readonly` `static` **MAXFETCHERREQUESTS\_DEFAULT**: `5` = `5`

Defined in: [config.ts:355](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L355)

***

### MAXPEERS\_DEFAULT

> `readonly` `static` **MAXPEERS\_DEFAULT**: `25` = `25`

Defined in: [config.ts:357](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L357)

***

### MAXPERREQUEST\_DEFAULT

> `readonly` `static` **MAXPERREQUEST\_DEFAULT**: `100` = `100`

Defined in: [config.ts:353](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L353)

***

### MINPEERS\_DEFAULT

> `readonly` `static` **MINPEERS\_DEFAULT**: `1` = `1`

Defined in: [config.ts:356](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L356)

***

### NUM\_BLOCKS\_PER\_ITERATION

> `readonly` `static` **NUM\_BLOCKS\_PER\_ITERATION**: `100` = `100`

Defined in: [config.ts:360](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L360)

***

### PORT\_DEFAULT

> `readonly` `static` **PORT\_DEFAULT**: `30303` = `30303`

Defined in: [config.ts:352](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L352)

***

### PRUNE\_ENGINE\_CACHE

> `readonly` `static` **PRUNE\_ENGINE\_CACHE**: `true` = `true`

Defined in: [config.ts:377](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L377)

***

### SAFE\_REORG\_DISTANCE

> `readonly` `static` **SAFE\_REORG\_DISTANCE**: `100` = `100`

Defined in: [config.ts:366](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L366)

***

### SKELETON\_FILL\_CANONICAL\_BACKSTEP

> `readonly` `static` **SKELETON\_FILL\_CANONICAL\_BACKSTEP**: `100` = `100`

Defined in: [config.ts:367](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L367)

***

### SKELETON\_SUBCHAIN\_MERGE\_MINIMUM

> `readonly` `static` **SKELETON\_SUBCHAIN\_MERGE\_MINIMUM**: `1000` = `1000`

Defined in: [config.ts:368](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L368)

***

### SNAP\_AVAILABILITY\_DEPTH

> `readonly` `static` **SNAP\_AVAILABILITY\_DEPTH**: `bigint`

Defined in: [config.ts:384](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L384)

***

### SNAP\_TRANSITION\_SAFE\_DEPTH

> `readonly` `static` **SNAP\_TRANSITION\_SAFE\_DEPTH**: `bigint`

Defined in: [config.ts:387](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L387)

***

### STORAGE\_CACHE

> `readonly` `static` **STORAGE\_CACHE**: `200000` = `200000`

Defined in: [config.ts:362](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L362)

***

### SYNCED\_STATE\_REMOVAL\_PERIOD

> `readonly` `static` **SYNCED\_STATE\_REMOVAL\_PERIOD**: `60000` = `60000`

Defined in: [config.ts:379](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L379)

***

### SYNCMODE\_DEFAULT

> `readonly` `static` **SYNCMODE\_DEFAULT**: `"full"` = `SyncMode.Full`

Defined in: [config.ts:350](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L350)

***

### TRIE\_CACHE

> `readonly` `static` **TRIE\_CACHE**: `200000` = `200000`

Defined in: [config.ts:364](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L364)

## Methods

### getDataDirectory()

> **getDataDirectory**(`dir`): `string`

Defined in: [config.ts:646](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L646)

Returns the location for each [DataDirectory](../variables/DataDirectory.md)

#### Parameters

##### dir

[`DataDirectory`](../type-aliases/DataDirectory.md)

#### Returns

`string`

***

### getDnsDiscovery()

> **getDnsDiscovery**(`option`): `boolean`

Defined in: [config.ts:707](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L707)

Returns specified option or the default setting for whether DNS-based peer discovery
is enabled based on chainName.

#### Parameters

##### option

`boolean` | `undefined`

#### Returns

`boolean`

***

### getInvalidPayloadsDir()

> **getInvalidPayloadsDir**(): `string`

Defined in: [config.ts:639](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L639)

#### Returns

`string`

***

### getNetworkDirectory()

> **getNetworkDirectory**(): `string`

Defined in: [config.ts:634](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L634)

Returns the network directory for the chain.

#### Returns

`string`

***

### superMsg()

> **superMsg**(`msgs`, `meta?`): `void`

Defined in: [config.ts:688](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L688)

#### Parameters

##### msgs

`string` | `string`[]

##### meta?

`any`

#### Returns

`void`

***

### updateSynchronizedState()

> **updateSynchronizedState**(`latest?`, `emitSyncEvent?`): `void`

Defined in: [config.ts:575](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L575)

Update the synchronized state of the chain

#### Parameters

##### latest?

`BlockHeader` | `null`

##### emitSyncEvent?

`boolean`

#### Returns

`void`

#### Emits

Event.SYNC\_SYNCHRONIZED

***

### getClientKey()

> `static` **getClientKey**(`datadir`, `common`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`\>

Defined in: [config.ts:670](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L670)

Gets the client private key from the config db.

#### Parameters

##### datadir

`string`

##### common

`Common`

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`\>

***

### getConfigDB()

> `static` **getConfigDB**(`networkDir`): `Level`\<`string` \| `Uint8Array`\<`ArrayBufferLike`\>, `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [config.ts:663](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L663)

Returns the config level db.

#### Parameters

##### networkDir

`string`

#### Returns

`Level`\<`string` \| `Uint8Array`\<`ArrayBufferLike`\>, `Uint8Array`\<`ArrayBufferLike`\>\>
