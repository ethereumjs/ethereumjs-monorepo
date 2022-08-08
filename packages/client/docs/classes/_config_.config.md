[ethereumjs-client](../README.md) › ["config"](../modules/_config_.md) › [Config](_config_.config.md)

# Class: Config

## Hierarchy

- **Config**

## Index

### Constructors

- [constructor](_config_.config.md#constructor)

### Properties

- [common](_config_.config.md#common)
- [datadir](_config_.config.md#datadir)
- [lightserv](_config_.config.md#lightserv)
- [logger](_config_.config.md#logger)
- [loglevel](_config_.config.md#loglevel)
- [maxPeers](_config_.config.md#maxpeers)
- [minPeers](_config_.config.md#minpeers)
- [rpc](_config_.config.md#rpc)
- [rpcaddr](_config_.config.md#rpcaddr)
- [rpcport](_config_.config.md#rpcport)
- [servers](_config_.config.md#servers)
- [syncmode](_config_.config.md#syncmode)
- [transports](_config_.config.md#transports)
- [COMMON_DEFAULT](_config_.config.md#static-common_default)
- [DATADIR_DEFAULT](_config_.config.md#static-datadir_default)
- [LIGHTSERV_DEFAULT](_config_.config.md#static-lightserv_default)
- [LOGLEVEL_DEFAULT](_config_.config.md#static-loglevel_default)
- [MAXPEERS_DEFAULT](_config_.config.md#static-maxpeers_default)
- [MINPEERS_DEFAULT](_config_.config.md#static-minpeers_default)
- [RPCADDR_DEFAULT](_config_.config.md#static-rpcaddr_default)
- [RPCPORT_DEFAULT](_config_.config.md#static-rpcport_default)
- [RPC_DEFAULT](_config_.config.md#static-rpc_default)
- [SYNCMODE_DEFAULT](_config_.config.md#static-syncmode_default)
- [TRANSPORTS_DEFAULT](_config_.config.md#static-transports_default)

### Methods

- [getSyncDataDirectory](_config_.config.md#getsyncdatadirectory)

## Constructors

### constructor

\+ **new Config**(`options`: [ConfigOptions](../interfaces/_config_.configoptions.md)): _[Config](_config_.config.md)_

_Defined in [lib/config.ts:128](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L128)_

**Parameters:**

| Name      | Type                                                     | Default |
| --------- | -------------------------------------------------------- | ------- |
| `options` | [ConfigOptions](../interfaces/_config_.configoptions.md) | {}      |

**Returns:** _[Config](_config_.config.md)_

## Properties

### common

• **common**: _Common_

_Defined in [lib/config.ts:115](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L115)_

---

### datadir

• **datadir**: _string_

_Defined in [lib/config.ts:119](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L119)_

---

### lightserv

• **lightserv**: _boolean_

_Defined in [lib/config.ts:118](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L118)_

---

### logger

• **logger**: _Logger_

_Defined in [lib/config.ts:116](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L116)_

---

### loglevel

• **loglevel**: _string_

_Defined in [lib/config.ts:124](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L124)_

---

### maxPeers

• **maxPeers**: _number_

_Defined in [lib/config.ts:126](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L126)_

---

### minPeers

• **minPeers**: _number_

_Defined in [lib/config.ts:125](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L125)_

---

### rpc

• **rpc**: _boolean_

_Defined in [lib/config.ts:121](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L121)_

---

### rpcaddr

• **rpcaddr**: _string_

_Defined in [lib/config.ts:123](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L123)_

---

### rpcport

• **rpcport**: _number_

_Defined in [lib/config.ts:122](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L122)_

---

### servers

• **servers**: _([RlpxServer](_net_server_rlpxserver_.rlpxserver.md)‹› | [Libp2pServer](_net_server_libp2pserver_.libp2pserver.md)‹›)[]_ = []

_Defined in [lib/config.ts:128](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L128)_

---

### syncmode

• **syncmode**: _string_

_Defined in [lib/config.ts:117](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L117)_

---

### transports

• **transports**: _string[]_

_Defined in [lib/config.ts:120](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L120)_

---

### `Static` COMMON_DEFAULT

▪ **COMMON_DEFAULT**: _Common‹›_ = new Common({ chain: 'mainnet', hardfork: 'chainstart' })

_Defined in [lib/config.ts:103](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L103)_

---

### `Static` DATADIR_DEFAULT

▪ **DATADIR_DEFAULT**: _string_ = `${os.homedir()}/Library/Ethereum`

_Defined in [lib/config.ts:106](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L106)_

---

### `Static` LIGHTSERV_DEFAULT

▪ **LIGHTSERV_DEFAULT**: _false_ = false

_Defined in [lib/config.ts:105](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L105)_

---

### `Static` LOGLEVEL_DEFAULT

▪ **LOGLEVEL_DEFAULT**: _"info"_ = "info"

_Defined in [lib/config.ts:111](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L111)_

---

### `Static` MAXPEERS_DEFAULT

▪ **MAXPEERS_DEFAULT**: _25_ = 25

_Defined in [lib/config.ts:113](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L113)_

---

### `Static` MINPEERS_DEFAULT

▪ **MINPEERS_DEFAULT**: _2_ = 2

_Defined in [lib/config.ts:112](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L112)_

---

### `Static` RPCADDR_DEFAULT

▪ **RPCADDR_DEFAULT**: _"localhost"_ = "localhost"

_Defined in [lib/config.ts:110](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L110)_

---

### `Static` RPCPORT_DEFAULT

▪ **RPCPORT_DEFAULT**: _8545_ = 8545

_Defined in [lib/config.ts:109](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L109)_

---

### `Static` RPC_DEFAULT

▪ **RPC_DEFAULT**: _false_ = false

_Defined in [lib/config.ts:108](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L108)_

---

### `Static` SYNCMODE_DEFAULT

▪ **SYNCMODE_DEFAULT**: _"full"_ = "full"

_Defined in [lib/config.ts:104](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L104)_

---

### `Static` TRANSPORTS_DEFAULT

▪ **TRANSPORTS_DEFAULT**: _string[]_ = ['rlpx:port=30303', 'libp2p']

_Defined in [lib/config.ts:107](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L107)_

## Methods

### getSyncDataDirectory

▸ **getSyncDataDirectory**(): _string_

_Defined in [lib/config.ts:181](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L181)_

Returns the directory for storing the client sync data
based on syncmode and selected chain (subdirectory of 'datadir')

**Returns:** _string_
