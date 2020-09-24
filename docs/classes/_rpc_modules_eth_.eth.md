[ethereumjs-client](../README.md) › ["rpc/modules/eth"](../modules/_rpc_modules_eth_.md) › [Eth](_rpc_modules_eth_.eth.md)

# Class: Eth

eth_* RPC module

**`memberof`** module:rpc/modules

## Hierarchy

* **Eth**

## Index

### Constructors

* [constructor](_rpc_modules_eth_.eth.md#constructor)

### Methods

* [getBlockByHash](_rpc_modules_eth_.eth.md#getblockbyhash)
* [getBlockByNumber](_rpc_modules_eth_.eth.md#getblockbynumber)
* [getBlockTransactionCountByHash](_rpc_modules_eth_.eth.md#getblocktransactioncountbyhash)
* [protocolVersion](_rpc_modules_eth_.eth.md#protocolversion)

## Constructors

###  constructor

\+ **new Eth**(`node`: any): *[Eth](_rpc_modules_eth_.eth.md)*

*Defined in [lib/rpc/modules/eth.js:10](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/eth.js#L10)*

Create eth_* RPC module

**Parameters:**

Name | Type |
------ | ------ |
`node` | any |

**Returns:** *[Eth](_rpc_modules_eth_.eth.md)*

## Methods

###  getBlockByHash

▸ **getBlockByHash**(`params`: undefined | any[], `cb`: undefined | Function): *Promise‹any›*

*Defined in [lib/rpc/modules/eth.js:65](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/eth.js#L65)*

Returns information about a block by hash

**Parameters:**

Name | Type |
------ | ------ |
`params` | undefined &#124; any[] |
`cb` | undefined &#124; Function |

**Returns:** *Promise‹any›*

___

###  getBlockByNumber

▸ **getBlockByNumber**(`params`: undefined | any[], `cb`: undefined | Function): *Promise‹any›*

*Defined in [lib/rpc/modules/eth.js:41](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/eth.js#L41)*

Returns information about a block by block number

**Parameters:**

Name | Type |
------ | ------ |
`params` | undefined &#124; any[] |
`cb` | undefined &#124; Function |

**Returns:** *Promise‹any›*

___

###  getBlockTransactionCountByHash

▸ **getBlockTransactionCountByHash**(`params`: undefined | string[], `cb`: undefined | Function): *Promise‹any›*

*Defined in [lib/rpc/modules/eth.js:89](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/eth.js#L89)*

Returns the transaction count for a block given by the block hash

**Parameters:**

Name | Type |
------ | ------ |
`params` | undefined &#124; string[] |
`cb` | undefined &#124; Function |

**Returns:** *Promise‹any›*

___

###  protocolVersion

▸ **protocolVersion**(`params`: undefined | any[], `cb`: undefined | Function): *void*

*Defined in [lib/rpc/modules/eth.js:108](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/eth.js#L108)*

Returns the current ethereum protocol version

**Parameters:**

Name | Type |
------ | ------ |
`params` | undefined &#124; any[] |
`cb` | undefined &#124; Function |

**Returns:** *void*
