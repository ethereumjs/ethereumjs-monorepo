[ethereumjs-client](../README.md) › ["rpc/modules/eth"](../modules/_rpc_modules_eth_.md) › [Eth](_rpc_modules_eth_.eth.md)

# Class: Eth

eth_* RPC module

**`memberof`** module:rpc/modules

## Hierarchy

* **Eth**

## Index

### Constructors

* [constructor](_rpc_modules_eth_.eth.md#constructor)

### Properties

* [ethVersion](_rpc_modules_eth_.eth.md#ethversion)

### Methods

* [blockNumber](_rpc_modules_eth_.eth.md#blocknumber)
* [getBlockByHash](_rpc_modules_eth_.eth.md#getblockbyhash)
* [getBlockByNumber](_rpc_modules_eth_.eth.md#getblockbynumber)
* [getBlockTransactionCountByHash](_rpc_modules_eth_.eth.md#getblocktransactioncountbyhash)
* [protocolVersion](_rpc_modules_eth_.eth.md#protocolversion)

## Constructors

###  constructor

\+ **new Eth**(`node`: any): *[Eth](_rpc_modules_eth_.eth.md)*

*Defined in [lib/rpc/modules/eth.ts:11](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/eth.ts#L11)*

Create eth_* RPC module

**Parameters:**

Name | Type |
------ | ------ |
`node` | any |

**Returns:** *[Eth](_rpc_modules_eth_.eth.md)*

## Properties

###  ethVersion

• **ethVersion**: *any*

*Defined in [lib/rpc/modules/eth.ts:11](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/eth.ts#L11)*

## Methods

###  blockNumber

▸ **blockNumber**(`_params`: never[], `cb`: function): *Promise‹void›*

*Defined in [lib/rpc/modules/eth.ts:51](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/eth.ts#L51)*

Returns Returns the number of most recent block.

**Parameters:**

▪`Default value`  **_params**: *never[]*= []

▪ **cb**: *function*

▸ (`err`: Error | null, `val?`: undefined | string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`err` | Error &#124; null |
`val?` | undefined &#124; string |

**Returns:** *Promise‹void›*

___

###  getBlockByHash

▸ **getBlockByHash**(`params`: [string, boolean], `cb`: function): *Promise‹void›*

*Defined in [lib/rpc/modules/eth.ts:92](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/eth.ts#L92)*

Returns information about a block by hash

**Parameters:**

▪ **params**: *[string, boolean]*

▪ **cb**: *function*

▸ (`err`: Error | null, `val?`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`err` | Error &#124; null |
`val?` | any |

**Returns:** *Promise‹void›*

___

###  getBlockByNumber

▸ **getBlockByNumber**(`params`: [string, boolean], `cb`: function): *Promise‹void›*

*Defined in [lib/rpc/modules/eth.ts:68](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/eth.ts#L68)*

Returns information about a block by block number

**Parameters:**

▪ **params**: *[string, boolean]*

▪ **cb**: *function*

▸ (`err`: Error | null, `val?`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`err` | Error &#124; null |
`val?` | any |

**Returns:** *Promise‹void›*

___

###  getBlockTransactionCountByHash

▸ **getBlockTransactionCountByHash**(`params`: [string], `cb`: function): *Promise‹void›*

*Defined in [lib/rpc/modules/eth.ts:115](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/eth.ts#L115)*

Returns the transaction count for a block given by the block hash

**Parameters:**

▪ **params**: *[string]*

▪ **cb**: *function*

▸ (`err`: Error | null, `val?`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`err` | Error &#124; null |
`val?` | any |

**Returns:** *Promise‹void›*

___

###  protocolVersion

▸ **protocolVersion**(`_params`: never[], `cb`: function): *void*

*Defined in [lib/rpc/modules/eth.ts:137](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/eth.ts#L137)*

Returns the current ethereum protocol version

**Parameters:**

▪`Default value`  **_params**: *never[]*= []

▪ **cb**: *function*

▸ (`err`: null, `val`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`err` | null |
`val` | string |

**Returns:** *void*
