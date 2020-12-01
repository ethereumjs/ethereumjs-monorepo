[ethereumjs-client](../README.md) › ["config"](../modules/_config_.md) › [Config](_config_.config.md)

# Class: Config

## Hierarchy

* **Config**

## Index

### Constructors

* [constructor](_config_.config.md#constructor)

### Properties

* [common](_config_.config.md#common)
* [datadir](_config_.config.md#datadir)
* [lightserv](_config_.config.md#lightserv)
* [logger](_config_.config.md#logger)
* [loglevel](_config_.config.md#loglevel)
* [maxPeers](_config_.config.md#maxpeers)
* [minPeers](_config_.config.md#minpeers)
* [rpc](_config_.config.md#rpc)
* [rpcaddr](_config_.config.md#rpcaddr)
* [rpcport](_config_.config.md#rpcport)
* [servers](_config_.config.md#servers)
* [syncmode](_config_.config.md#syncmode)
* [transports](_config_.config.md#transports)
* [COMMON_DEFAULT](_config_.config.md#static-common_default)
* [DATADIR_DEFAULT](_config_.config.md#static-datadir_default)
* [LIGHTSERV_DEFAULT](_config_.config.md#static-lightserv_default)
* [LOGLEVEL_DEFAULT](_config_.config.md#static-loglevel_default)
* [MAXPEERS_DEFAULT](_config_.config.md#static-maxpeers_default)
* [MINPEERS_DEFAULT](_config_.config.md#static-minpeers_default)
* [RPCADDR_DEFAULT](_config_.config.md#static-rpcaddr_default)
* [RPCPORT_DEFAULT](_config_.config.md#static-rpcport_default)
* [RPC_DEFAULT](_config_.config.md#static-rpc_default)
* [SYNCMODE_DEFAULT](_config_.config.md#static-syncmode_default)
* [TRANSPORTS_DEFAULT](_config_.config.md#static-transports_default)

### Methods

* [getSyncDataDirectory](_config_.config.md#getsyncdatadirectory)

## Constructors

###  constructor

\+ **new Config**(`options`: [ConfigOptions](../interfaces/_config_.configoptions.md)): *[Config](_config_.config.md)*

*Defined in [lib/config.ts:128](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L128)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [ConfigOptions](../interfaces/_config_.configoptions.md) | {} |

**Returns:** *[Config](_config_.config.md)*

## Properties

###  common

• **common**: *Common*

*Defined in [lib/config.ts:115](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L115)*

___

###  datadir

• **datadir**: *string*

*Defined in [lib/config.ts:119](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L119)*

___

###  lightserv

• **lightserv**: *boolean*

*Defined in [lib/config.ts:118](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L118)*

___

###  logger

• **logger**: *Logger*

*Defined in [lib/config.ts:116](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L116)*

___

###  loglevel

• **loglevel**: *string*

*Defined in [lib/config.ts:124](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L124)*

___

###  maxPeers

• **maxPeers**: *number*

*Defined in [lib/config.ts:126](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L126)*

___

###  minPeers

• **minPeers**: *number*

*Defined in [lib/config.ts:125](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L125)*

___

###  rpc

• **rpc**: *boolean*

*Defined in [lib/config.ts:121](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L121)*

___

###  rpcaddr

• **rpcaddr**: *string*

*Defined in [lib/config.ts:123](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L123)*

___

###  rpcport

• **rpcport**: *number*

*Defined in [lib/config.ts:122](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L122)*

___

###  servers

• **servers**: *([RlpxServer](_net_server_rlpxserver_.rlpxserver.md)‹› | [Libp2pServer](_net_server_libp2pserver_.libp2pserver.md)‹›)[]* = []

*Defined in [lib/config.ts:128](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L128)*

___

###  syncmode

• **syncmode**: *string*

*Defined in [lib/config.ts:117](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L117)*

___

###  transports

• **transports**: *string[]*

*Defined in [lib/config.ts:120](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L120)*

___

### `Static` COMMON_DEFAULT

▪ **COMMON_DEFAULT**: *Common‹›* = new Common({ chain: 'mainnet', hardfork: 'chainstart' })

*Defined in [lib/config.ts:103](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L103)*

___

### `Static` DATADIR_DEFAULT

▪ **DATADIR_DEFAULT**: *string* = `${os.homedir()}/Library/Ethereum`

*Defined in [lib/config.ts:106](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L106)*

___

### `Static` LIGHTSERV_DEFAULT

▪ **LIGHTSERV_DEFAULT**: *false* = false

*Defined in [lib/config.ts:105](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L105)*

___

### `Static` LOGLEVEL_DEFAULT

▪ **LOGLEVEL_DEFAULT**: *"info"* = "info"

*Defined in [lib/config.ts:111](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L111)*

___

### `Static` MAXPEERS_DEFAULT

▪ **MAXPEERS_DEFAULT**: *25* = 25

*Defined in [lib/config.ts:113](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L113)*

___

### `Static` MINPEERS_DEFAULT

▪ **MINPEERS_DEFAULT**: *2* = 2

*Defined in [lib/config.ts:112](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L112)*

___

### `Static` RPCADDR_DEFAULT

▪ **RPCADDR_DEFAULT**: *"localhost"* = "localhost"

*Defined in [lib/config.ts:110](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L110)*

___

### `Static` RPCPORT_DEFAULT

▪ **RPCPORT_DEFAULT**: *8545* = 8545

*Defined in [lib/config.ts:109](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L109)*

___

### `Static` RPC_DEFAULT

▪ **RPC_DEFAULT**: *false* = false

*Defined in [lib/config.ts:108](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L108)*

___

### `Static` SYNCMODE_DEFAULT

▪ **SYNCMODE_DEFAULT**: *"full"* = "full"

*Defined in [lib/config.ts:104](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L104)*

___

### `Static` TRANSPORTS_DEFAULT

▪ **TRANSPORTS_DEFAULT**: *string[]* = ['rlpx:port=30303', 'libp2p']

*Defined in [lib/config.ts:107](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L107)*

## Methods

###  getSyncDataDirectory

▸ **getSyncDataDirectory**(): *string*

*Defined in [lib/config.ts:181](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L181)*

Returns the directory for storing the client sync data
based on syncmode and selected chain (subdirectory of 'datadir')

**Returns:** *string*
