[ethereumjs-client](../README.md) › ["rpc/modules/net"](../modules/_rpc_modules_net_.md) › [Net](_rpc_modules_net_.net.md)

# Class: Net

net_* RPC module

**`memberof`** module:rpc/modules

## Hierarchy

* **Net**

## Index

### Constructors

* [constructor](_rpc_modules_net_.net.md#constructor)

### Methods

* [listening](_rpc_modules_net_.net.md#listening)
* [peerCount](_rpc_modules_net_.net.md#peercount)
* [version](_rpc_modules_net_.net.md#version)

## Constructors

###  constructor

\+ **new Net**(`node`: any): *[Net](_rpc_modules_net_.net.md)*

*Defined in [lib/rpc/modules/net.ts:12](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/net.ts#L12)*

Create net_* RPC module

**Parameters:**

Name | Type |
------ | ------ |
`node` | any |

**Returns:** *[Net](_rpc_modules_net_.net.md)*

## Methods

###  listening

▸ **listening**(`_params`: never[], `cb`: function): *void*

*Defined in [lib/rpc/modules/net.ts:45](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/net.ts#L45)*

Returns true if client is actively listening for network connections

**Parameters:**

▪`Default value`  **_params**: *never[]*= []

▪ **cb**: *function*

▸ (`err`: Error | null, `isListening`: boolean): *void*

**Parameters:**

Name | Type |
------ | ------ |
`err` | Error &#124; null |
`isListening` | boolean |

**Returns:** *void*

___

###  peerCount

▸ **peerCount**(`_params`: never[], `cb`: function): *void*

*Defined in [lib/rpc/modules/net.ts:55](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/net.ts#L55)*

Returns number of peers currently connected to the client

**Parameters:**

▪`Default value`  **_params**: *never[]*= []

▪ **cb**: *function*

▸ (`err`: Error | null, `numberOfPeers`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`err` | Error &#124; null |
`numberOfPeers` | string |

**Returns:** *void*

___

###  version

▸ **version**(`_params`: never[], `cb`: function): *void*

*Defined in [lib/rpc/modules/net.ts:35](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/net.ts#L35)*

Returns the current network id

**Parameters:**

▪`Default value`  **_params**: *never[]*= []

▪ **cb**: *function*

▸ (`err`: Error | null, `id`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`err` | Error &#124; null |
`id` | string |

**Returns:** *void*
