[ethereumjs-client](../README.md) › ["rpc/index"](../modules/_rpc_index_.md) › [RPCManager](_rpc_index_.rpcmanager.md)

# Class: RPCManager

RPC server manager

**`memberof`** module:rpc

## Hierarchy

* **RPCManager**

## Index

### Constructors

* [constructor](_rpc_index_.rpcmanager.md#constructor)

### Methods

* [getMethods](_rpc_index_.rpcmanager.md#getmethods)

## Constructors

###  constructor

\+ **new RPCManager**(`node`: [Node](_node_.node.md), `config`: [Config](_config_.config.md)): *[RPCManager](_rpc_index_.rpcmanager.md)*

*Defined in [lib/rpc/index.ts:25](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/index.ts#L25)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | [Node](_node_.node.md) |
`config` | [Config](_config_.config.md) |

**Returns:** *[RPCManager](_rpc_index_.rpcmanager.md)*

## Methods

###  getMethods

▸ **getMethods**(): *any*

*Defined in [lib/rpc/index.ts:37](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/index.ts#L37)*

gets methods for all modules which concat with underscore "_"
e.g. convert getBlockByNumber() in eth module to { eth_getBlockByNumber }

**Returns:** *any*

methods
