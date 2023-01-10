[@ethereumjs/client](../README.md) / ConfigOptions

# Interface: ConfigOptions

## Table of contents

### Properties

- [accounts](ConfigOptions.md#accounts)
- [bootnodes](ConfigOptions.md#bootnodes)
- [common](ConfigOptions.md#common)
- [datadir](ConfigOptions.md#datadir)
- [debugCode](ConfigOptions.md#debugcode)
- [disableBeaconSync](ConfigOptions.md#disablebeaconsync)
- [discDns](ConfigOptions.md#discdns)
- [discV4](ConfigOptions.md#discv4)
- [dnsAddr](ConfigOptions.md#dnsaddr)
- [dnsNetworks](ConfigOptions.md#dnsnetworks)
- [extIP](ConfigOptions.md#extip)
- [forceSnapSync](ConfigOptions.md#forcesnapsync)
- [key](ConfigOptions.md#key)
- [lightserv](ConfigOptions.md#lightserv)
- [logger](ConfigOptions.md#logger)
- [maxFetcherJobs](ConfigOptions.md#maxfetcherjobs)
- [maxPeers](ConfigOptions.md#maxpeers)
- [maxPerRequest](ConfigOptions.md#maxperrequest)
- [minPeers](ConfigOptions.md#minpeers)
- [mine](ConfigOptions.md#mine)
- [minerCoinbase](ConfigOptions.md#minercoinbase)
- [multiaddrs](ConfigOptions.md#multiaddrs)
- [port](ConfigOptions.md#port)
- [safeReorgDistance](ConfigOptions.md#safereorgdistance)
- [saveReceipts](ConfigOptions.md#savereceipts)
- [servers](ConfigOptions.md#servers)
- [skeletonFillCanonicalBackStep](ConfigOptions.md#skeletonfillcanonicalbackstep)
- [skeletonSubchainMergeMinimum](ConfigOptions.md#skeletonsubchainmergeminimum)
- [syncmode](ConfigOptions.md#syncmode)
- [transports](ConfigOptions.md#transports)
- [txLookupLimit](ConfigOptions.md#txlookuplimit)
- [vm](ConfigOptions.md#vm)

## Properties

### accounts

• `Optional` **accounts**: [address: Address, privKey: Buffer][]

Unlocked accounts of form [address, privateKey]
Currently only the first account is used to seal mined PoA blocks

Default: []

#### Defined in

[config.ts:221](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L221)

___

### bootnodes

• `Optional` **bootnodes**: `Multiaddr`[]

Network bootnodes
(e.g. abc@18.138.108.67 or /ip4/127.0.0.1/tcp/50505/p2p/QmABC)

#### Defined in

[config.ts:98](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L98)

___

### common

• `Optional` **common**: `Common`

Specify the chain by providing a Common instance,
the common instance will not be modified by client

Default: 'mainnet' Common

#### Defined in

[config.ts:34](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L34)

___

### datadir

• `Optional` **datadir**: `string`

Root data directory for the blockchain

#### Defined in

[config.ts:78](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L78)

___

### debugCode

• `Optional` **debugCode**: `boolean`

Generate code for local debugging, currently providing a
code snippet which can be used to run blocks on the
EthereumJS VM on execution errors

(meant to be used internally for the most part)

#### Defined in

[config.ts:192](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L192)

___

### disableBeaconSync

• `Optional` **disableBeaconSync**: `boolean`

Whether to disable beacon (optimistic) sync if CL provides
blocks at the head of chain.

Default: false

#### Defined in

[config.ts:49](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L49)

___

### discDns

• `Optional` **discDns**: `boolean`

Query EIP-1459 DNS TXT records for peer discovery

Default: `true` for testnets, false for mainnet

#### Defined in

[config.ts:199](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L199)

___

### discV4

• `Optional` **discV4**: `boolean`

Use v4 ("findneighbour" node requests) for peer discovery

Default: `false` for testnets, true for mainnet

#### Defined in

[config.ts:206](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L206)

___

### dnsAddr

• `Optional` **dnsAddr**: `string`

DNS server to query DNS TXT records from for peer discovery

Default `8.8.8.8` (Google)

#### Defined in

[config.ts:178](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L178)

___

### dnsNetworks

• `Optional` **dnsNetworks**: `string`[]

EIP-1459 ENR Tree urls to query via DNS for peer discovery

#### Defined in

[config.ts:183](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L183)

___

### extIP

• `Optional` **extIP**: `string`

RLPx external IP

#### Defined in

[config.ts:110](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L110)

___

### forceSnapSync

• `Optional` **forceSnapSync**: `boolean`

Whether to test and run snapSync. When fully ready, this needs to
be replaced by a more sophisticated condition based on how far back we are
from the head, and how to run it in conjunction with the beacon sync
blocks at the head of chain.

Default: false

#### Defined in

[config.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L59)

___

### key

• `Optional` **key**: `Buffer`

Private key for the client.
Use return value of [getClientKey](../classes/Config.md#getclientkey).
If left blank, a random key will be generated and used.

#### Defined in

[config.ts:85](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L85)

___

### lightserv

• `Optional` **lightserv**: `boolean`

Serve light peer requests

Default: `false`

#### Defined in

[config.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L73)

___

### logger

• `Optional` **logger**: `Logger`

A custom winston logger can be provided
if setting logging verbosity is not sufficient

Default: Logger with loglevel 'info'

#### Defined in

[config.ts:143](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L143)

___

### maxFetcherJobs

• `Optional` **maxFetcherJobs**: `number`

Max jobs to be enqueued in the fetcher at any given time

Default: `100`

#### Defined in

[config.ts:157](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L157)

___

### maxPeers

• `Optional` **maxPeers**: `number`

Maximum peers allowed

Default: `25`

#### Defined in

[config.ts:171](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L171)

___

### maxPerRequest

• `Optional` **maxPerRequest**: `number`

Max items per block or header request

Default: `50``

#### Defined in

[config.ts:150](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L150)

___

### minPeers

• `Optional` **minPeers**: `number`

Number of peers needed before syncing

Default: `1`

#### Defined in

[config.ts:164](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L164)

___

### mine

• `Optional` **mine**: `boolean`

Enable mining

Default: `false`

#### Defined in

[config.ts:213](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L213)

___

### minerCoinbase

• `Optional` **minerCoinbase**: `Address`

Address for mining rewards (etherbase)
If not provided, defaults to the primary account.

#### Defined in

[config.ts:227](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L227)

___

### multiaddrs

• `Optional` **multiaddrs**: `Multiaddr`[]

Network multiaddrs for libp2p
(e.g. /ip4/127.0.0.1/tcp/50505/p2p/QmABC)

#### Defined in

[config.ts:116](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L116)

___

### port

• `Optional` **port**: `number`

RLPx listening port

Default: `30303`

#### Defined in

[config.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L105)

___

### safeReorgDistance

• `Optional` **safeReorgDistance**: `number`

If there is a reorg, this is a safe distance from which
to try to refetch and refeed the blocks.

#### Defined in

[config.ts:233](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L233)

___

### saveReceipts

• `Optional` **saveReceipts**: `boolean`

Save tx receipts and logs in the meta db (default: false)

#### Defined in

[config.ts:129](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L129)

___

### servers

• `Optional` **servers**: (`Libp2pServer` \| `RlpxServer`)[]

Transport servers (RLPx or Libp2p)
Use `transports` option, only used for testing purposes

Default: servers created from `transports` option

#### Defined in

[config.ts:124](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L124)

___

### skeletonFillCanonicalBackStep

• `Optional` **skeletonFillCanonicalBackStep**: `number`

If there is a skeleton fillCanonicalChain block lookup errors
because of closing chain conditions, this allows skeleton
to backstep and fill again using reverse block fetcher.

#### Defined in

[config.ts:240](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L240)

___

### skeletonSubchainMergeMinimum

• `Optional` **skeletonSubchainMergeMinimum**: `number`

If skeleton subchains can be merged, what is the minimum tail
gain, as subchain merge will lead to the ReverseBlockFetcher
reset

#### Defined in

[config.ts:247](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L247)

___

### syncmode

• `Optional` **syncmode**: [`SyncMode`](../enums/SyncMode.md)

Synchronization mode ('full' or 'light')

Default: 'full'

#### Defined in

[config.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L41)

___

### transports

• `Optional` **transports**: `string`[]

Network transports ('rlpx' and/or 'libp2p')

Default: `['rlpx', 'libp2p']`

#### Defined in

[config.ts:92](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L92)

___

### txLookupLimit

• `Optional` **txLookupLimit**: `number`

Number of recent blocks to maintain transactions index for
(default = 2350000 = about one year, 0 = entire chain)

#### Defined in

[config.ts:135](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L135)

___

### vm

• `Optional` **vm**: `VM`

Provide a custom VM instance to process blocks

Default: VM instance created by client

#### Defined in

[config.ts:66](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L66)
