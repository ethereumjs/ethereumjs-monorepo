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

*Defined in [lib/rpc/modules/net.js:10](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/net.js#L10)*

Create net_* RPC module

**Parameters:**

Name | Type |
------ | ------ |
`node` | any |

**Returns:** *[Net](_rpc_modules_net_.net.md)*

## Methods

###  listening

▸ **listening**(`params`: undefined | any[], `cb`: undefined | Function): *void*

*Defined in [lib/rpc/modules/net.js:42](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/net.js#L42)*

Returns true if client is actively listening for network connections

**Parameters:**

Name | Type |
------ | ------ |
`params` | undefined &#124; any[] |
`cb` | undefined &#124; Function |

**Returns:** *void*

___

###  peerCount

▸ **peerCount**(`params`: undefined | any[], `cb`: undefined | Function): *void*

*Defined in [lib/rpc/modules/net.js:52](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/net.js#L52)*

Returns number of peers currently connected to the client

**Parameters:**

Name | Type |
------ | ------ |
`params` | undefined &#124; any[] |
`cb` | undefined &#124; Function |

**Returns:** *void*

___

###  version

▸ **version**(`params`: undefined | any[], `cb`: undefined | Function): *void*

*Defined in [lib/rpc/modules/net.js:32](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/net.js#L32)*

Returns the current network id

**Parameters:**

Name | Type |
------ | ------ |
`params` | undefined &#124; any[] |
`cb` | undefined &#124; Function |

**Returns:** *void*
