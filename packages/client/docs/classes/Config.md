[**@ethereumjs/client**](../README.md)

***

[@ethereumjs/client](../README.md) / Config

# Class: Config

Defined in: [config.ts:350](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L350)

## Constructors

### Constructor

> **new Config**(`options`): `Config`

Defined in: [config.ts:476](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L476)

#### Parameters

##### options

[`ConfigOptions`](../interfaces/ConfigOptions.md) = `{}`

#### Returns

`Config`

## Properties

### accountCache

> `readonly` **accountCache**: `number`

Defined in: [config.ts:419](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L419)

***

### accounts

> `readonly` **accounts**: \[`Address`, `Uint8Array`\<`ArrayBufferLike`\>\][]

Defined in: [config.ts:428](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L428)

***

### blobsAndProofsCacheBlocks

> `readonly` **blobsAndProofsCacheBlocks**: `number`

Defined in: [config.ts:458](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L458)

***

### bootnodes?

> `readonly` `optional` **bootnodes**: `Multiaddr`[]

Defined in: [config.ts:405](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L405)

***

### chainCommon

> `readonly` **chainCommon**: `Common`

Defined in: [config.ts:469](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L469)

***

### codeCache

> `readonly` **codeCache**: `number`

Defined in: [config.ts:421](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L421)

***

### datadir

> `readonly` **datadir**: `string`

Defined in: [config.ts:403](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L403)

***

### debugCode

> `readonly` **debugCode**: `boolean`

Defined in: [config.ts:423](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L423)

***

### discDns

> `readonly` **discDns**: `boolean`

Defined in: [config.ts:424](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L424)

***

### discV4

> `readonly` **discV4**: `boolean`

Defined in: [config.ts:425](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L425)

***

### dnsAddr

> `readonly` **dnsAddr**: `string`

Defined in: [config.ts:416](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L416)

***

### enableSnapSync

> `readonly` **enableSnapSync**: `boolean`

Defined in: [config.ts:449](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L449)

***

### engineNewpayloadMaxExecute

> `readonly` **engineNewpayloadMaxExecute**: `number`

Defined in: [config.ts:442](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L442)

***

### engineNewpayloadMaxTxsExecute

> `readonly` **engineNewpayloadMaxTxsExecute**: `number`

Defined in: [config.ts:443](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L443)

***

### engineParentLookupMaxDepth

> `readonly` **engineParentLookupMaxDepth**: `number`

Defined in: [config.ts:441](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L441)

***

### events

> `readonly` **events**: `EventEmitter`\<`EventParams`\>

Defined in: [config.ts:355](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L355)

Central event bus for events emitted by the different
components of the client

***

### execCommon

> `readonly` **execCommon**: `Common`

Defined in: [config.ts:470](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L470)

***

### execution

> `readonly` **execution**: `boolean`

Defined in: [config.ts:417](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L417)

***

### extIP?

> `readonly` `optional` **extIP**: `string`

Defined in: [config.ts:407](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L407)

***

### ignoreStatelessInvalidExecs

> `readonly` **ignoreStatelessInvalidExecs**: `boolean`

Defined in: [config.ts:456](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L456)

***

### isSingleNode

> `readonly` **isSingleNode**: `boolean`

Defined in: [config.ts:427](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L427)

***

### key

> `readonly` **key**: `Uint8Array`

Defined in: [config.ts:404](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L404)

***

### lastSyncDate

> **lastSyncDate**: `number`

Defined in: [config.ts:463](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L463)

lastSyncDate in ms

***

### lastSynchronized?

> `optional` **lastSynchronized**: `boolean`

Defined in: [config.ts:461](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L461)

***

### logger

> `readonly` **logger**: `undefined` \| `Logger`

Defined in: [config.ts:400](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L400)

***

### maxAccountRange

> `readonly` **maxAccountRange**: `bigint`

Defined in: [config.ts:436](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L436)

***

### maxFetcherJobs

> `readonly` **maxFetcherJobs**: `number`

Defined in: [config.ts:412](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L412)

***

### maxFetcherRequests

> `readonly` **maxFetcherRequests**: `number`

Defined in: [config.ts:413](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L413)

***

### maxInvalidBlocksErrorCache

> `readonly` **maxInvalidBlocksErrorCache**: `number`

Defined in: [config.ts:438](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L438)

***

### maxPeers

> `readonly` **maxPeers**: `number`

Defined in: [config.ts:415](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L415)

***

### maxPerRequest

> `readonly` **maxPerRequest**: `number`

Defined in: [config.ts:411](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L411)

***

### maxRangeBytes

> `readonly` **maxRangeBytes**: `number`

Defined in: [config.ts:435](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L435)

***

### maxStorageRange

> `readonly` **maxStorageRange**: `bigint`

Defined in: [config.ts:437](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L437)

***

### metrics

> `readonly` **metrics**: `undefined` \| `PrometheusMetrics`

Defined in: [config.ts:474](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L474)

***

### mine

> `readonly` **mine**: `boolean`

Defined in: [config.ts:426](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L426)

***

### minerCoinbase?

> `readonly` `optional` **minerCoinbase**: `Address`

Defined in: [config.ts:429](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L429)

***

### minPeers

> `readonly` **minPeers**: `number`

Defined in: [config.ts:414](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L414)

***

### multiaddrs?

> `readonly` `optional` **multiaddrs**: `Multiaddr`[]

Defined in: [config.ts:408](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L408)

***

### numBlocksPerIteration

> `readonly` **numBlocksPerIteration**: `number`

Defined in: [config.ts:418](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L418)

***

### port?

> `readonly` `optional` **port**: `number`

Defined in: [config.ts:406](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L406)

***

### prefixStorageTrieKeys

> `readonly` **prefixStorageTrieKeys**: `boolean`

Defined in: [config.ts:447](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L447)

***

### pruneEngineCache

> `readonly` **pruneEngineCache**: `boolean`

Defined in: [config.ts:439](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L439)

***

### safeReorgDistance

> `readonly` **safeReorgDistance**: `number`

Defined in: [config.ts:432](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L432)

***

### savePreimages

> `readonly` **savePreimages**: `boolean`

Defined in: [config.ts:451](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L451)

***

### saveReceipts

> `readonly` **saveReceipts**: `boolean`

Defined in: [config.ts:409](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L409)

***

### server

> `readonly` **server**: `undefined` \| `RlpxServer` = `undefined`

Defined in: [config.ts:472](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L472)

***

### shutdown

> **shutdown**: `boolean` = `false`

Defined in: [config.ts:467](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L467)

Client is in the process of shutting down

***

### skeletonFillCanonicalBackStep

> `readonly` **skeletonFillCanonicalBackStep**: `number`

Defined in: [config.ts:433](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L433)

***

### skeletonSubchainMergeMinimum

> `readonly` **skeletonSubchainMergeMinimum**: `number`

Defined in: [config.ts:434](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L434)

***

### snapAvailabilityDepth

> `readonly` **snapAvailabilityDepth**: `bigint`

Defined in: [config.ts:444](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L444)

***

### snapTransitionSafeDepth

> `readonly` **snapTransitionSafeDepth**: `bigint`

Defined in: [config.ts:445](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L445)

***

### startExecution

> `readonly` **startExecution**: `boolean`

Defined in: [config.ts:455](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L455)

***

### statefulVerkle

> `readonly` **statefulVerkle**: `boolean`

Defined in: [config.ts:454](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L454)

***

### statelessVerkle

> `readonly` **statelessVerkle**: `boolean`

Defined in: [config.ts:453](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L453)

***

### storageCache

> `readonly` **storageCache**: `number`

Defined in: [config.ts:420](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L420)

***

### syncedStateRemovalPeriod

> `readonly` **syncedStateRemovalPeriod**: `number`

Defined in: [config.ts:440](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L440)

***

### synchronized

> **synchronized**: `boolean`

Defined in: [config.ts:460](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L460)

***

### syncmode

> `readonly` **syncmode**: [`SyncMode`](../type-aliases/SyncMode.md)

Defined in: [config.ts:401](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L401)

***

### syncTargetHeight?

> `optional` **syncTargetHeight**: `bigint`

Defined in: [config.ts:465](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L465)

Best known block height

***

### trieCache

> `readonly` **trieCache**: `number`

Defined in: [config.ts:422](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L422)

***

### txLookupLimit

> `readonly` **txLookupLimit**: `number`

Defined in: [config.ts:410](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L410)

***

### useStringValueTrieDB

> `readonly` **useStringValueTrieDB**: `boolean`

Defined in: [config.ts:450](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L450)

***

### vm?

> `readonly` `optional` **vm**: `VM`

Defined in: [config.ts:402](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L402)

***

### vmProfilerOpts?

> `readonly` `optional` **vmProfilerOpts**: `VMProfilerOpts`

Defined in: [config.ts:430](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L430)

***

### ACCOUNT\_CACHE

> `readonly` `static` **ACCOUNT\_CACHE**: `400000` = `400000`

Defined in: [config.ts:369](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L369)

***

### BLOBS\_AND\_PROOFS\_CACHE\_BLOCKS

> `readonly` `static` **BLOBS\_AND\_PROOFS\_CACHE\_BLOCKS**: `32` = `32`

Defined in: [config.ts:398](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L398)

***

### CHAIN\_DEFAULT

> `readonly` `static` **CHAIN\_DEFAULT**: `ChainConfig` = `Mainnet`

Defined in: [config.ts:357](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L357)

***

### CODE\_CACHE

> `readonly` `static` **CODE\_CACHE**: `200000` = `200000`

Defined in: [config.ts:371](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L371)

***

### DATADIR\_DEFAULT

> `readonly` `static` **DATADIR\_DEFAULT**: `"./datadir"`

Defined in: [config.ts:359](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L359)

***

### DEBUGCODE\_DEFAULT

> `readonly` `static` **DEBUGCODE\_DEFAULT**: `false` = `false`

Defined in: [config.ts:373](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L373)

***

### DNSADDR\_DEFAULT

> `readonly` `static` **DNSADDR\_DEFAULT**: `"8.8.8.8"` = `'8.8.8.8'`

Defined in: [config.ts:366](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L366)

***

### ENGINE\_NEWPAYLOAD\_MAX\_EXECUTE

> `readonly` `static` **ENGINE\_NEWPAYLOAD\_MAX\_EXECUTE**: `2` = `2`

Defined in: [config.ts:390](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L390)

***

### ENGINE\_NEWPAYLOAD\_MAX\_TXS\_EXECUTE

> `readonly` `static` **ENGINE\_NEWPAYLOAD\_MAX\_TXS\_EXECUTE**: `200` = `200`

Defined in: [config.ts:391](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L391)

***

### ENGINE\_PARENT\_LOOKUP\_MAX\_DEPTH

> `readonly` `static` **ENGINE\_PARENT\_LOOKUP\_MAX\_DEPTH**: `128` = `128`

Defined in: [config.ts:389](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L389)

***

### EXECUTION

> `readonly` `static` **EXECUTION**: `true` = `true`

Defined in: [config.ts:367](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L367)

***

### MAX\_ACCOUNT\_RANGE

> `readonly` `static` **MAX\_ACCOUNT\_RANGE**: `bigint`

Defined in: [config.ts:380](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L380)

***

### MAX\_INVALID\_BLOCKS\_ERROR\_CACHE

> `readonly` `static` **MAX\_INVALID\_BLOCKS\_ERROR\_CACHE**: `128` = `128`

Defined in: [config.ts:384](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L384)

***

### MAX\_RANGE\_BYTES

> `readonly` `static` **MAX\_RANGE\_BYTES**: `50000` = `50000`

Defined in: [config.ts:378](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L378)

***

### MAX\_STORAGE\_RANGE

> `readonly` `static` **MAX\_STORAGE\_RANGE**: `bigint`

Defined in: [config.ts:382](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L382)

***

### MAXFETCHERJOBS\_DEFAULT

> `readonly` `static` **MAXFETCHERJOBS\_DEFAULT**: `100` = `100`

Defined in: [config.ts:362](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L362)

***

### MAXFETCHERREQUESTS\_DEFAULT

> `readonly` `static` **MAXFETCHERREQUESTS\_DEFAULT**: `5` = `5`

Defined in: [config.ts:363](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L363)

***

### MAXPEERS\_DEFAULT

> `readonly` `static` **MAXPEERS\_DEFAULT**: `25` = `25`

Defined in: [config.ts:365](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L365)

***

### MAXPERREQUEST\_DEFAULT

> `readonly` `static` **MAXPERREQUEST\_DEFAULT**: `100` = `100`

Defined in: [config.ts:361](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L361)

***

### MINPEERS\_DEFAULT

> `readonly` `static` **MINPEERS\_DEFAULT**: `1` = `1`

Defined in: [config.ts:364](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L364)

***

### NUM\_BLOCKS\_PER\_ITERATION

> `readonly` `static` **NUM\_BLOCKS\_PER\_ITERATION**: `100` = `100`

Defined in: [config.ts:368](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L368)

***

### PORT\_DEFAULT

> `readonly` `static` **PORT\_DEFAULT**: `30303` = `30303`

Defined in: [config.ts:360](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L360)

***

### PRUNE\_ENGINE\_CACHE

> `readonly` `static` **PRUNE\_ENGINE\_CACHE**: `true` = `true`

Defined in: [config.ts:385](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L385)

***

### SAFE\_REORG\_DISTANCE

> `readonly` `static` **SAFE\_REORG\_DISTANCE**: `100` = `100`

Defined in: [config.ts:374](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L374)

***

### SKELETON\_FILL\_CANONICAL\_BACKSTEP

> `readonly` `static` **SKELETON\_FILL\_CANONICAL\_BACKSTEP**: `100` = `100`

Defined in: [config.ts:375](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L375)

***

### SKELETON\_SUBCHAIN\_MERGE\_MINIMUM

> `readonly` `static` **SKELETON\_SUBCHAIN\_MERGE\_MINIMUM**: `1000` = `1000`

Defined in: [config.ts:376](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L376)

***

### SNAP\_AVAILABILITY\_DEPTH

> `readonly` `static` **SNAP\_AVAILABILITY\_DEPTH**: `bigint`

Defined in: [config.ts:392](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L392)

***

### SNAP\_TRANSITION\_SAFE\_DEPTH

> `readonly` `static` **SNAP\_TRANSITION\_SAFE\_DEPTH**: `bigint`

Defined in: [config.ts:395](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L395)

***

### STORAGE\_CACHE

> `readonly` `static` **STORAGE\_CACHE**: `200000` = `200000`

Defined in: [config.ts:370](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L370)

***

### SYNCED\_STATE\_REMOVAL\_PERIOD

> `readonly` `static` **SYNCED\_STATE\_REMOVAL\_PERIOD**: `60000` = `60000`

Defined in: [config.ts:387](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L387)

***

### SYNCMODE\_DEFAULT

> `readonly` `static` **SYNCMODE\_DEFAULT**: `"full"` = `SyncMode.Full`

Defined in: [config.ts:358](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L358)

***

### TRIE\_CACHE

> `readonly` `static` **TRIE\_CACHE**: `200000` = `200000`

Defined in: [config.ts:372](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L372)

## Methods

### getDataDirectory()

> **getDataDirectory**(`dir`): `string`

Defined in: [config.ts:664](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L664)

Returns the location for each [DataDirectory](../variables/DataDirectory.md)

#### Parameters

##### dir

[`DataDirectory`](../type-aliases/DataDirectory.md)

#### Returns

`string`

***

### getDnsDiscovery()

> **getDnsDiscovery**(`option`): `boolean`

Defined in: [config.ts:725](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L725)

Returns specified option or the default setting for whether DNS-based peer discovery
is enabled based on chainName.

#### Parameters

##### option

`undefined` | `boolean`

#### Returns

`boolean`

***

### getInvalidPayloadsDir()

> **getInvalidPayloadsDir**(): `string`

Defined in: [config.ts:657](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L657)

#### Returns

`string`

***

### getNetworkDirectory()

> **getNetworkDirectory**(): `string`

Defined in: [config.ts:652](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L652)

Returns the network directory for the chain.

#### Returns

`string`

***

### superMsg()

> **superMsg**(`msgs`, `meta?`): `void`

Defined in: [config.ts:706](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L706)

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

Defined in: [config.ts:593](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L593)

Update the synchronized state of the chain

#### Parameters

##### latest?

`null` | `BlockHeader`

##### emitSyncEvent?

`boolean`

#### Returns

`void`

#### Emits

Event.SYNC\_SYNCHRONIZED

***

### getClientKey()

> `static` **getClientKey**(`datadir`, `common`): `Promise`\<`undefined` \| `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [config.ts:688](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L688)

Gets the client private key from the config db.

#### Parameters

##### datadir

`string`

##### common

`Common`

#### Returns

`Promise`\<`undefined` \| `Uint8Array`\<`ArrayBufferLike`\>\>

***

### getConfigDB()

> `static` **getConfigDB**(`networkDir`): `Level`\<`string` \| `Uint8Array`\<`ArrayBufferLike`\>, `Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [config.ts:681](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/src/config.ts#L681)

Returns the config level db.

#### Parameters

##### networkDir

`string`

#### Returns

`Level`\<`string` \| `Uint8Array`\<`ArrayBufferLike`\>, `Uint8Array`\<`ArrayBufferLike`\>\>
