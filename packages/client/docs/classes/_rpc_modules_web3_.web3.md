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

*Defined in [lib/rpc/modules/web3.ts:10](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/web3.ts#L10)*

Create web3_* RPC module

**Parameters:**

Name | Type |
------ | ------ |
`node` | any |

**Returns:** *[Web3](_rpc_modules_web3_.web3.md)*

## Methods

###  clientVersion

▸ **clientVersion**(`_params`: never[], `cb`: function): *void*

*Defined in [lib/rpc/modules/web3.ts:31](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/web3.ts#L31)*

Returns the current client version

**Parameters:**

▪`Default value`  **_params**: *never[]*= []

▪ **cb**: *function*

▸ (`err`: null, `version`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`err` | null |
`version` | string |

**Returns:** *void*

___

###  sha3

▸ **sha3**(`params`: string[], `cb`: function): *void*

*Defined in [lib/rpc/modules/web3.ts:42](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/web3.ts#L42)*

Returns Keccak-256 (not the standardized SHA3-256) of the given data

**Parameters:**

▪ **params**: *string[]*

▪ **cb**: *function*

▸ (`err`: Error | null, `hash?`: undefined | string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`err` | Error &#124; null |
`hash?` | undefined &#124; string |

**Returns:** *void*
