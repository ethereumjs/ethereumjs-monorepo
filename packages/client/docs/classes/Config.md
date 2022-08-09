[@ethereumjs/client](../README.md) / Config

# Class: Config

## Table of contents

### Constructors

- [constructor](Config.md#constructor)

### Properties

- [accounts](Config.md#accounts)
- [bootnodes](Config.md#bootnodes)
- [chainCommon](Config.md#chaincommon)
- [datadir](Config.md#datadir)
- [debugCode](Config.md#debugcode)
- [disableBeaconSync](Config.md#disablebeaconsync)
- [disableSnapSync](Config.md#disablesnapsync)
- [discDns](Config.md#discdns)
- [discV4](Config.md#discv4)
- [dnsAddr](Config.md#dnsaddr)
- [events](Config.md#events)
- [execCommon](Config.md#execcommon)
- [extIP](Config.md#extip)
- [forceSnapSync](Config.md#forcesnapsync)
- [key](Config.md#key)
- [lastSyncDate](Config.md#lastsyncdate)
- [lightserv](Config.md#lightserv)
- [logger](Config.md#logger)
- [maxFetcherJobs](Config.md#maxfetcherjobs)
- [maxPeers](Config.md#maxpeers)
- [maxPerRequest](Config.md#maxperrequest)
- [minPeers](Config.md#minpeers)
- [mine](Config.md#mine)
- [minerCoinbase](Config.md#minercoinbase)
- [multiaddrs](Config.md#multiaddrs)
- [port](Config.md#port)
- [safeReorgDistance](Config.md#safereorgdistance)
- [saveReceipts](Config.md#savereceipts)
- [servers](Config.md#servers)
- [skeletonFillCanonicalBackStep](Config.md#skeletonfillcanonicalbackstep)
- [skeletonSubchainMergeMinimum](Config.md#skeletonsubchainmergeminimum)
- [syncTargetHeight](Config.md#synctargetheight)
- [synchronized](Config.md#synchronized)
- [syncmode](Config.md#syncmode)
- [transports](Config.md#transports)
- [txLookupLimit](Config.md#txlookuplimit)
- [vm](Config.md#vm)
- [CHAIN\_DEFAULT](Config.md#chain_default)
- [DATADIR\_DEFAULT](Config.md#datadir_default)
- [DEBUGCODE\_DEFAULT](Config.md#debugcode_default)
- [DNSADDR\_DEFAULT](Config.md#dnsaddr_default)
- [LIGHTSERV\_DEFAULT](Config.md#lightserv_default)
- [MAXFETCHERJOBS\_DEFAULT](Config.md#maxfetcherjobs_default)
- [MAXPEERS\_DEFAULT](Config.md#maxpeers_default)
- [MAXPERREQUEST\_DEFAULT](Config.md#maxperrequest_default)
- [MINPEERS\_DEFAULT](Config.md#minpeers_default)
- [PORT\_DEFAULT](Config.md#port_default)
- [SAFE\_REORG\_DISTANCE](Config.md#safe_reorg_distance)
- [SKELETON\_FILL\_CANONICAL\_BACKSTEP](Config.md#skeleton_fill_canonical_backstep)
- [SKELETON\_SUBCHAIN\_MERGE\_MINIMUM](Config.md#skeleton_subchain_merge_minimum)
- [SYNCMODE\_DEFAULT](Config.md#syncmode_default)
- [TRANSPORTS\_DEFAULT](Config.md#transports_default)

### Methods

- [getDataDirectory](Config.md#getdatadirectory)
- [getDnsDiscovery](Config.md#getdnsdiscovery)
- [getNetworkDirectory](Config.md#getnetworkdirectory)
- [getV4Discovery](Config.md#getv4discovery)
- [getClientKey](Config.md#getclientkey)
- [getConfigDB](Config.md#getconfigdb)

## Constructors

### constructor

• **new Config**(`options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`ConfigOptions`](../interfaces/ConfigOptions.md) |

#### Defined in

[config.ts:313](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L313)

## Properties

### accounts

• `Readonly` **accounts**: [address: Address, privKey: Buffer][]

#### Defined in

[config.ts:292](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L292)

___

### bootnodes

• `Optional` `Readonly` **bootnodes**: `Multiaddr`[]

#### Defined in

[config.ts:277](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L277)

___

### chainCommon

• `Readonly` **chainCommon**: `Common`

#### Defined in

[config.ts:308](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L308)

___

### datadir

• `Readonly` **datadir**: `string`

#### Defined in

[config.ts:274](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L274)

___

### debugCode

• `Readonly` **debugCode**: `boolean`

#### Defined in

[config.ts:288](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L288)

___

### disableBeaconSync

• `Readonly` **disableBeaconSync**: `boolean`

#### Defined in

[config.ts:298](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L298)

___

### disableSnapSync

• `Readonly` **disableSnapSync**: `boolean` = `false`

#### Defined in

[config.ts:301](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L301)

___

### discDns

• `Readonly` **discDns**: `boolean`

#### Defined in

[config.ts:289](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L289)

___

### discV4

• `Readonly` **discV4**: `boolean`

#### Defined in

[config.ts:290](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L290)

___

### dnsAddr

• `Readonly` **dnsAddr**: `string`

#### Defined in

[config.ts:287](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L287)

___

### events

• `Readonly` **events**: `EventBusType`

Central event bus for events emitted by the different
components of the client

#### Defined in

[config.ts:252](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L252)

___

### execCommon

• `Readonly` **execCommon**: `Common`

#### Defined in

[config.ts:309](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L309)

___

### extIP

• `Optional` `Readonly` **extIP**: `string`

#### Defined in

[config.ts:279](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L279)

___

### forceSnapSync

• `Readonly` **forceSnapSync**: `boolean`

#### Defined in

[config.ts:299](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L299)

___

### key

• `Readonly` **key**: `Buffer`

#### Defined in

[config.ts:275](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L275)

___

### lastSyncDate

• **lastSyncDate**: `number`

#### Defined in

[config.ts:304](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L304)

___

### lightserv

• `Readonly` **lightserv**: `boolean`

#### Defined in

[config.ts:273](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L273)

___

### logger

• `Readonly` **logger**: `Logger`

#### Defined in

[config.ts:270](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L270)

___

### maxFetcherJobs

• `Readonly` **maxFetcherJobs**: `number`

#### Defined in

[config.ts:284](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L284)

___

### maxPeers

• `Readonly` **maxPeers**: `number`

#### Defined in

[config.ts:286](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L286)

___

### maxPerRequest

• `Readonly` **maxPerRequest**: `number`

#### Defined in

[config.ts:283](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L283)

___

### minPeers

• `Readonly` **minPeers**: `number`

#### Defined in

[config.ts:285](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L285)

___

### mine

• `Readonly` **mine**: `boolean`

#### Defined in

[config.ts:291](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L291)

___

### minerCoinbase

• `Optional` `Readonly` **minerCoinbase**: `Address`

#### Defined in

[config.ts:293](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L293)

___

### multiaddrs

• `Optional` `Readonly` **multiaddrs**: `Multiaddr`[]

#### Defined in

[config.ts:280](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L280)

___

### port

• `Optional` `Readonly` **port**: `number`

#### Defined in

[config.ts:278](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L278)

___

### safeReorgDistance

• `Readonly` **safeReorgDistance**: `number`

#### Defined in

[config.ts:295](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L295)

___

### saveReceipts

• `Readonly` **saveReceipts**: `boolean`

#### Defined in

[config.ts:281](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L281)

___

### servers

• `Readonly` **servers**: (`Libp2pServer` \| `RlpxServer`)[] = `[]`

#### Defined in

[config.ts:311](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L311)

___

### skeletonFillCanonicalBackStep

• `Readonly` **skeletonFillCanonicalBackStep**: `number`

#### Defined in

[config.ts:296](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L296)

___

### skeletonSubchainMergeMinimum

• `Readonly` **skeletonSubchainMergeMinimum**: `number`

#### Defined in

[config.ts:297](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L297)

___

### syncTargetHeight

• `Optional` **syncTargetHeight**: `bigint`

Best known block height

#### Defined in

[config.ts:306](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L306)

___

### synchronized

• **synchronized**: `boolean`

#### Defined in

[config.ts:303](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L303)

___

### syncmode

• `Readonly` **syncmode**: [`SyncMode`](../enums/SyncMode.md)

#### Defined in

[config.ts:271](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L271)

___

### transports

• `Readonly` **transports**: `string`[]

#### Defined in

[config.ts:276](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L276)

___

### txLookupLimit

• `Readonly` **txLookupLimit**: `number`

#### Defined in

[config.ts:282](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L282)

___

### vm

• `Optional` `Readonly` **vm**: `VM`

#### Defined in

[config.ts:272](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L272)

___

### CHAIN\_DEFAULT

▪ `Static` `Readonly` **CHAIN\_DEFAULT**: ``"mainnet"``

#### Defined in

[config.ts:254](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L254)

___

### DATADIR\_DEFAULT

▪ `Static` `Readonly` **DATADIR\_DEFAULT**: ``"./datadir"``

#### Defined in

[config.ts:257](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L257)

___

### DEBUGCODE\_DEFAULT

▪ `Static` `Readonly` **DEBUGCODE\_DEFAULT**: ``false``

#### Defined in

[config.ts:265](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L265)

___

### DNSADDR\_DEFAULT

▪ `Static` `Readonly` **DNSADDR\_DEFAULT**: ``"8.8.8.8"``

#### Defined in

[config.ts:264](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L264)

___

### LIGHTSERV\_DEFAULT

▪ `Static` `Readonly` **LIGHTSERV\_DEFAULT**: ``false``

#### Defined in

[config.ts:256](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L256)

___

### MAXFETCHERJOBS\_DEFAULT

▪ `Static` `Readonly` **MAXFETCHERJOBS\_DEFAULT**: ``100``

#### Defined in

[config.ts:261](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L261)

___

### MAXPEERS\_DEFAULT

▪ `Static` `Readonly` **MAXPEERS\_DEFAULT**: ``25``

#### Defined in

[config.ts:263](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L263)

___

### MAXPERREQUEST\_DEFAULT

▪ `Static` `Readonly` **MAXPERREQUEST\_DEFAULT**: ``50``

#### Defined in

[config.ts:260](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L260)

___

### MINPEERS\_DEFAULT

▪ `Static` `Readonly` **MINPEERS\_DEFAULT**: ``1``

#### Defined in

[config.ts:262](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L262)

___

### PORT\_DEFAULT

▪ `Static` `Readonly` **PORT\_DEFAULT**: ``30303``

#### Defined in

[config.ts:259](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L259)

___

### SAFE\_REORG\_DISTANCE

▪ `Static` `Readonly` **SAFE\_REORG\_DISTANCE**: ``100``

#### Defined in

[config.ts:266](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L266)

___

### SKELETON\_FILL\_CANONICAL\_BACKSTEP

▪ `Static` `Readonly` **SKELETON\_FILL\_CANONICAL\_BACKSTEP**: ``100``

#### Defined in

[config.ts:267](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L267)

___

### SKELETON\_SUBCHAIN\_MERGE\_MINIMUM

▪ `Static` `Readonly` **SKELETON\_SUBCHAIN\_MERGE\_MINIMUM**: ``1000``

#### Defined in

[config.ts:268](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L268)

___

### SYNCMODE\_DEFAULT

▪ `Static` `Readonly` **SYNCMODE\_DEFAULT**: [`Full`](../enums/SyncMode.md#full) = `SyncMode.Full`

#### Defined in

[config.ts:255](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L255)

___

### TRANSPORTS\_DEFAULT

▪ `Static` `Readonly` **TRANSPORTS\_DEFAULT**: `string`[]

#### Defined in

[config.ts:258](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L258)

## Methods

### getDataDirectory

▸ **getDataDirectory**(`dir`): `string`

Returns the location for each [DataDirectory](../enums/DataDirectory.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `dir` | [`DataDirectory`](../enums/DataDirectory.md) |

#### Returns

`string`

#### Defined in

[config.ts:395](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L395)

___

### getDnsDiscovery

▸ **getDnsDiscovery**(`option`): `boolean`

Returns specified option or the default setting for whether DNS-based peer discovery
is enabled based on chainName. `true` for ropsten, rinkeby, and goerli

#### Parameters

| Name | Type |
| :------ | :------ |
| `option` | `undefined` \| `boolean` |

#### Returns

`boolean`

#### Defined in

[config.ts:441](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L441)

___

### getNetworkDirectory

▸ **getNetworkDirectory**(): `string`

Returns the network directory for the chain.

#### Returns

`string`

#### Defined in

[config.ts:387](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L387)

___

### getV4Discovery

▸ **getV4Discovery**(`option`): `boolean`

Returns specified option or the default setting for whether v4 peer discovery
is enabled based on chainName. `true` for `mainnet`

#### Parameters

| Name | Type |
| :------ | :------ |
| `option` | `undefined` \| `boolean` |

#### Returns

`boolean`

#### Defined in

[config.ts:451](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L451)

___

### getClientKey

▸ `Static` **getClientKey**(`datadir`, `common`): `Promise`<`undefined` \| `Buffer`\>

Gets the client private key from the config db.

#### Parameters

| Name | Type |
| :------ | :------ |
| `datadir` | `string` |
| `common` | `Common` |

#### Returns

`Promise`<`undefined` \| `Buffer`\>

#### Defined in

[config.ts:419](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L419)

___

### getConfigDB

▸ `Static` **getConfigDB**(`networkDir`): `Level`<`string` \| `Buffer`, `Buffer`\>

Returns the config level db.

#### Parameters

| Name | Type |
| :------ | :------ |
| `networkDir` | `string` |

#### Returns

`Level`<`string` \| `Buffer`, `Buffer`\>

#### Defined in

[config.ts:412](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L412)
