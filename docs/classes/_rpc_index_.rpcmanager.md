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

\+ **new RPCManager**(`node`: any, `config`: any): *[RPCManager](_rpc_index_.rpcmanager.md)*

*Defined in [lib/rpc/index.js:21](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/index.js#L21)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | any |
`config` | any |

**Returns:** *[RPCManager](_rpc_index_.rpcmanager.md)*

## Methods

###  getMethods

▸ **getMethods**(): *Object*

*Defined in [lib/rpc/index.js:33](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/index.js#L33)*

gets methods for all modules which concat with underscore "_"
e.g. convert getBlockByNumber() in eth module to { eth_getBlockByNumber }

**Returns:** *Object*

methods
