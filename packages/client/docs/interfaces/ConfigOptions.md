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

[config.ts:218](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L218)

___

### bootnodes

• `Optional` **bootnodes**: `Multiaddr`[]

Network bootnodes
(e.g. abc@18.138.108.67 or /ip4/127.0.0.1/tcp/50505/p2p/QmABC)

#### Defined in

[config.ts:95](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L95)

___

### common

• `Optional` **common**: `Common`

Specify the chain by providing a Common instance,
the common instance will not be modified by client

Default: 'mainnet' Common

#### Defined in

[config.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L31)

___

### datadir

• `Optional` **datadir**: `string`

Root data directory for the blockchain

#### Defined in

[config.ts:75](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L75)

___

### debugCode

• `Optional` **debugCode**: `boolean`

Generate code for local debugging, currently providing a
code snippet which can be used to run blocks on the
EthereumJS VM on execution errors

(meant to be used internally for the most part)

#### Defined in

[config.ts:189](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L189)

___

### disableBeaconSync

• `Optional` **disableBeaconSync**: `boolean`

Whether to disable beacon (optimistic) sync if CL provides
blocks at the head of chain.

Default: false

#### Defined in

[config.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L46)

___

### discDns

• `Optional` **discDns**: `boolean`

Query EIP-1459 DNS TXT records for peer discovery

Default: `true` for testnets, false for mainnet

#### Defined in

[config.ts:196](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L196)

___

### discV4

• `Optional` **discV4**: `boolean`

Use v4 ("findneighbour" node requests) for peer discovery

Default: `false` for testnets, true for mainnet

#### Defined in

[config.ts:203](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L203)

___

### dnsAddr

• `Optional` **dnsAddr**: `string`

DNS server to query DNS TXT records from for peer discovery

Default `8.8.8.8` (Google)

#### Defined in

[config.ts:175](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L175)

___

### dnsNetworks

• `Optional` **dnsNetworks**: `string`[]

EIP-1459 ENR Tree urls to query via DNS for peer discovery

#### Defined in

[config.ts:180](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L180)

___

### extIP

• `Optional` **extIP**: `string`

RLPx external IP

#### Defined in

[config.ts:107](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L107)

___

### forceSnapSync

• `Optional` **forceSnapSync**: `boolean`

Whether to test and run snapSync. When fully ready, this needs to
be replaced by a more sophisticated condition based on how far back we are
from the head, and how to run it in conjuction with the beacon sync
blocks at the head of chain.

Default: false

#### Defined in

[config.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L56)

___

### key

• `Optional` **key**: `Buffer`

Private key for the client.
Use return value of [getClientKey](../classes/Config.md#getclientkey).
If left blank, a random key will be generated and used.

#### Defined in

[config.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L82)

___

### lightserv

• `Optional` **lightserv**: `boolean`

Serve light peer requests

Default: `false`

#### Defined in

[config.ts:70](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L70)

___

### logger

• `Optional` **logger**: `Logger`

A custom winston logger can be provided
if setting logging verbosity is not sufficient

Default: Logger with loglevel 'info'

#### Defined in

[config.ts:140](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L140)

___

### maxFetcherJobs

• `Optional` **maxFetcherJobs**: `number`

Max jobs to be enqueued in the fetcher at any given time

Default: `100`

#### Defined in

[config.ts:154](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L154)

___

### maxPeers

• `Optional` **maxPeers**: `number`

Maximum peers allowed

Default: `25`

#### Defined in

[config.ts:168](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L168)

___

### maxPerRequest

• `Optional` **maxPerRequest**: `number`

Max items per block or header request

Default: `50``

#### Defined in

[config.ts:147](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L147)

___

### minPeers

• `Optional` **minPeers**: `number`

Number of peers needed before syncing

Default: `1`

#### Defined in

[config.ts:161](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L161)

___

### mine

• `Optional` **mine**: `boolean`

Enable mining

Default: `false`

#### Defined in

[config.ts:210](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L210)

___

### minerCoinbase

• `Optional` **minerCoinbase**: `Address`

Address for mining rewards (etherbase)
If not provided, defaults to the primary account.

#### Defined in

[config.ts:224](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L224)

___

### multiaddrs

• `Optional` **multiaddrs**: `Multiaddr`[]

Network multiaddrs for libp2p
(e.g. /ip4/127.0.0.1/tcp/50505/p2p/QmABC)

#### Defined in

[config.ts:113](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L113)

___

### port

• `Optional` **port**: `number`

RLPx listening port

Default: `30303`

#### Defined in

[config.ts:102](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L102)

___

### safeReorgDistance

• `Optional` **safeReorgDistance**: `number`

If there is a reorg, this is a safe distance from which
to try to refetch and refeed the blocks.

#### Defined in

[config.ts:230](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L230)

___

### saveReceipts

• `Optional` **saveReceipts**: `boolean`

Save tx receipts and logs in the meta db (default: false)

#### Defined in

[config.ts:126](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L126)

___

### servers

• `Optional` **servers**: (`Libp2pServer` \| `RlpxServer`)[]

Transport servers (RLPx or Libp2p)
Use `transports` option, only used for testing purposes

Default: servers created from `transports` option

#### Defined in

[config.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L121)

___

### skeletonFillCanonicalBackStep

• `Optional` **skeletonFillCanonicalBackStep**: `number`

If there is a skeleton fillCanonicalChain block lookup errors
because of closing chain conditions, this allows skeleton
to backstep and fill again using reverse block fetcher.

#### Defined in

[config.ts:237](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L237)

___

### skeletonSubchainMergeMinimum

• `Optional` **skeletonSubchainMergeMinimum**: `number`

If skeleton subchains can be merged, what is the minimum tail
gain, as subchain merge will lead to the ReverseBlockFetcher
reset

#### Defined in

[config.ts:244](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L244)

___

### syncmode

• `Optional` **syncmode**: [`SyncMode`](../enums/SyncMode.md)

Synchronization mode ('full' or 'light')

Default: 'full'

#### Defined in

[config.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L38)

___

### transports

• `Optional` **transports**: `string`[]

Network transports ('rlpx' and/or 'libp2p')

Default: `['rlpx', 'libp2p']`

#### Defined in

[config.ts:89](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L89)

___

### txLookupLimit

• `Optional` **txLookupLimit**: `number`

Number of recent blocks to maintain transactions index for
(default = 2350000 = about one year, 0 = entire chain)

#### Defined in

[config.ts:132](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L132)

___

### vm

• `Optional` **vm**: `VM`

Provide a custom VM instance to process blocks

Default: VM instance created by client

#### Defined in

[config.ts:63](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/client/lib/config.ts#L63)
