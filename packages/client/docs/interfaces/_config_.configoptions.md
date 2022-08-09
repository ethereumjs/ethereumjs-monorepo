[ethereumjs-client](../README.md) › ["config"](../modules/_config_.md) › [ConfigOptions](_config_.configoptions.md)

# Interface: ConfigOptions

## Hierarchy

- **ConfigOptions**

## Index

### Properties

- [common](_config_.configoptions.md#optional-common)
- [datadir](_config_.configoptions.md#optional-datadir)
- [lightserv](_config_.configoptions.md#optional-lightserv)
- [logger](_config_.configoptions.md#optional-logger)
- [loglevel](_config_.configoptions.md#optional-loglevel)
- [maxPeers](_config_.configoptions.md#optional-maxpeers)
- [minPeers](_config_.configoptions.md#optional-minpeers)
- [rpc](_config_.configoptions.md#optional-rpc)
- [rpcaddr](_config_.configoptions.md#optional-rpcaddr)
- [rpcport](_config_.configoptions.md#optional-rpcport)
- [servers](_config_.configoptions.md#optional-servers)
- [syncmode](_config_.configoptions.md#optional-syncmode)
- [transports](_config_.configoptions.md#optional-transports)

## Properties

### `Optional` common

• **common**? : _Common_

_Defined in [lib/config.ts:13](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L13)_

Specify the chain and hardfork by passing a Common instance.

Default: chain 'mainnet' and hardfork 'chainstart'

---

### `Optional` datadir

• **datadir**? : _undefined | string_

_Defined in [lib/config.ts:32](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L32)_

Root data directory for the blockchain

---

### `Optional` lightserv

• **lightserv**? : _undefined | false | true_

_Defined in [lib/config.ts:27](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L27)_

Serve light peer requests

Default: `false`

---

### `Optional` logger

• **logger**? : _[Logger](../modules/_logging_.md#logger)_

_Defined in [lib/config.ts:82](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L82)_

A custom winston logger can be provided
if setting logging verbosity is not sufficient

Default: Logger with loglevel 'info'

---

### `Optional` loglevel

• **loglevel**? : _undefined | string_

_Defined in [lib/config.ts:74](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L74)_

Logging verbosity

Choices: ['debug', 'info', 'warn', 'error', 'off']
Default: 'info'

---

### `Optional` maxPeers

• **maxPeers**? : _undefined | number_

_Defined in [lib/config.ts:96](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L96)_

Maximum peers allowed

Default: `25`

---

### `Optional` minPeers

• **minPeers**? : _undefined | number_

_Defined in [lib/config.ts:89](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L89)_

Number of peers needed before syncing

Default: `2`

---

### `Optional` rpc

• **rpc**? : _undefined | false | true_

_Defined in [lib/config.ts:54](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L54)_

Enable the JSON-RPC server

Default: false

---

### `Optional` rpcaddr

• **rpcaddr**? : _undefined | string_

_Defined in [lib/config.ts:66](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L66)_

HTTP-RPC server listening interface

---

### `Optional` rpcport

• **rpcport**? : _undefined | number_

_Defined in [lib/config.ts:61](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L61)_

HTTP-RPC server listening port

Default: 8545

---

### `Optional` servers

• **servers**? : _([RlpxServer](../classes/_net_server_rlpxserver_.rlpxserver.md)‹› | [Libp2pServer](../classes/_net_server_libp2pserver_.libp2pserver.md)‹›)[]_

_Defined in [lib/config.ts:47](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L47)_

Transport servers (RLPx or Libp2p)
Use `transports` option, only used for testing purposes

Default: servers created from `transports` option

---

### `Optional` syncmode

• **syncmode**? : _undefined | string_

_Defined in [lib/config.ts:20](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L20)_

Synchronization mode ('full' or 'light')

Default: 'full'

---

### `Optional` transports

• **transports**? : _string[]_

_Defined in [lib/config.ts:39](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/config.ts#L39)_

Network transports ('rlpx' and/or 'libp2p')

Default: `['rlpx:port=30303', 'libp2p']`
