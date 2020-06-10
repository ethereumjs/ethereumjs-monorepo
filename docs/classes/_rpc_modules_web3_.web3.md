[ethereumjs-client](../README.md) › ["rpc/modules/web3"](../modules/_rpc_modules_web3_.md) › [Web3](_rpc_modules_web3_.web3.md)

# Class: Web3

web3_* RPC module

**`memberof`** module:rpc/modules

## Hierarchy

* **Web3**

## Index

### Constructors

* [constructor](_rpc_modules_web3_.web3.md#constructor)

### Methods

* [clientVersion](_rpc_modules_web3_.web3.md#clientversion)
* [sha3](_rpc_modules_web3_.web3.md#sha3)

## Constructors

###  constructor

\+ **new Web3**(`node`: any): *[Web3](_rpc_modules_web3_.web3.md)*

*Defined in [lib/rpc/modules/web3.js:11](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/web3.js#L11)*

Create web3_* RPC module

**Parameters:**

Name | Type |
------ | ------ |
`node` | any |

**Returns:** *[Web3](_rpc_modules_web3_.web3.md)*

## Methods

###  clientVersion

▸ **clientVersion**(`params`: undefined | any[], `cb`: undefined | Function): *void*

*Defined in [lib/rpc/modules/web3.js:31](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/web3.js#L31)*

Returns the current client version

**Parameters:**

Name | Type |
------ | ------ |
`params` | undefined &#124; any[] |
`cb` | undefined &#124; Function |

**Returns:** *void*

___

###  sha3

▸ **sha3**(`params`: undefined | string[], `cb`: undefined | Function): *void*

*Defined in [lib/rpc/modules/web3.js:46](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/web3.js#L46)*

Returns Keccak-256 (not the standardized SHA3-256) of the given data

**Parameters:**

Name | Type |
------ | ------ |
`params` | undefined &#124; string[] |
`cb` | undefined &#124; Function |

**Returns:** *void*
