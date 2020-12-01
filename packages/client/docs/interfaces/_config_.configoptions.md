[ethereumjs-client](../README.md) › ["config"](../modules/_config_.md) › [ConfigOptions](_config_.configoptions.md)

# Interface: ConfigOptions

## Hierarchy

* **ConfigOptions**

## Index

### Properties

* [common](_config_.configoptions.md#optional-common)
* [datadir](_config_.configoptions.md#optional-datadir)
* [lightserv](_config_.configoptions.md#optional-lightserv)
* [logger](_config_.configoptions.md#optional-logger)
* [loglevel](_config_.configoptions.md#optional-loglevel)
* [maxPeers](_config_.configoptions.md#optional-maxpeers)
* [minPeers](_config_.configoptions.md#optional-minpeers)
* [rpc](_config_.configoptions.md#optional-rpc)
* [rpcaddr](_config_.configoptions.md#optional-rpcaddr)
* [rpcport](_config_.configoptions.md#optional-rpcport)
* [servers](_config_.configoptions.md#optional-servers)
* [syncmode](_config_.configoptions.md#optional-syncmode)
* [transports](_config_.configoptions.md#optional-transports)

## Properties

### `Optional` common

• **common**? : *Common*

*Defined in [lib/config.ts:13](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L13)*

Specify the chain and hardfork by passing a Common instance.

Default: chain 'mainnet' and hardfork 'chainstart'

___

### `Optional` datadir

• **datadir**? : *undefined | string*

*Defined in [lib/config.ts:32](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L32)*

Root data directory for the blockchain

___

### `Optional` lightserv

• **lightserv**? : *undefined | false | true*

*Defined in [lib/config.ts:27](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L27)*

Serve light peer requests

Default: `false`

___

### `Optional` logger

• **logger**? : *[Logger](../modules/_logging_.md#logger)*

*Defined in [lib/config.ts:82](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L82)*

A custom winston logger can be provided
if setting logging verbosity is not sufficient

Default: Logger with loglevel 'info'

___

### `Optional` loglevel

• **loglevel**? : *undefined | string*

*Defined in [lib/config.ts:74](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L74)*

Logging verbosity

Choices: ['debug', 'info', 'warn', 'error', 'off']
Default: 'info'

___

### `Optional` maxPeers

• **maxPeers**? : *undefined | number*

*Defined in [lib/config.ts:96](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L96)*

Maximum peers allowed

Default: `25`

___

### `Optional` minPeers

• **minPeers**? : *undefined | number*

*Defined in [lib/config.ts:89](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L89)*

Number of peers needed before syncing

Default: `2`

___

### `Optional` rpc

• **rpc**? : *undefined | false | true*

*Defined in [lib/config.ts:54](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L54)*

Enable the JSON-RPC server

Default: false

___

### `Optional` rpcaddr

• **rpcaddr**? : *undefined | string*

*Defined in [lib/config.ts:66](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L66)*

HTTP-RPC server listening interface

___

### `Optional` rpcport

• **rpcport**? : *undefined | number*

*Defined in [lib/config.ts:61](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L61)*

HTTP-RPC server listening port

Default: 8545

___

### `Optional` servers

• **servers**? : *([RlpxServer](../classes/_net_server_rlpxserver_.rlpxserver.md)‹› | [Libp2pServer](../classes/_net_server_libp2pserver_.libp2pserver.md)‹›)[]*

*Defined in [lib/config.ts:47](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L47)*

Transport servers (RLPx or Libp2p)
Use `transports` option, only used for testing purposes

Default: servers created from `transports` option

___

### `Optional` syncmode

• **syncmode**? : *undefined | string*

*Defined in [lib/config.ts:20](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L20)*

Synchronization mode ('full' or 'light')

Default: 'full'

___

### `Optional` transports

• **transports**? : *string[]*

*Defined in [lib/config.ts:39](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L39)*

Network transports ('rlpx' and/or 'libp2p')

Default: `['rlpx:port=30303', 'libp2p']`
