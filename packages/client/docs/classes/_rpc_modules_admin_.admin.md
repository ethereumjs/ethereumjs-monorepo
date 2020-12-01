[ethereumjs-client](../README.md) › ["rpc/modules/admin"](../modules/_rpc_modules_admin_.md) › [Admin](_rpc_modules_admin_.admin.md)

# Class: Admin

admin_* RPC module

**`memberof`** module:rpc/modules

## Hierarchy

* **Admin**

## Index

### Constructors

* [constructor](_rpc_modules_admin_.admin.md#constructor)

### Properties

* [_chain](_rpc_modules_admin_.admin.md#_chain)
* [_ethProtocol](_rpc_modules_admin_.admin.md#_ethprotocol)
* [_node](_rpc_modules_admin_.admin.md#_node)

### Methods

* [nodeInfo](_rpc_modules_admin_.admin.md#nodeinfo)

## Constructors

###  constructor

\+ **new Admin**(`node`: [Node](_node_.node.md)): *[Admin](_rpc_modules_admin_.admin.md)*

*Defined in [lib/rpc/modules/admin.ts:17](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/admin.ts#L17)*

Create admin_* RPC module

**Parameters:**

Name | Type |
------ | ------ |
`node` | [Node](_node_.node.md) |

**Returns:** *[Admin](_rpc_modules_admin_.admin.md)*

## Properties

###  _chain

• **_chain**: *[Chain](_blockchain_chain_.chain.md)*

*Defined in [lib/rpc/modules/admin.ts:15](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/admin.ts#L15)*

___

###  _ethProtocol

• **_ethProtocol**: *[EthProtocol](_net_protocol_ethprotocol_.ethprotocol.md)*

*Defined in [lib/rpc/modules/admin.ts:17](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/admin.ts#L17)*

___

###  _node

• **_node**: *[Node](_node_.node.md)*

*Defined in [lib/rpc/modules/admin.ts:16](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/admin.ts#L16)*

## Methods

###  nodeInfo

▸ **nodeInfo**(`params`: any, `cb`: Function): *Promise‹any›*

*Defined in [lib/rpc/modules/admin.ts:38](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/admin.ts#L38)*

Returns information about the currently running node.
see for reference: https://geth.ethereum.org/docs/rpc/ns-admin#admin_nodeinfo

**Parameters:**

Name | Type |
------ | ------ |
`params` | any |
`cb` | Function |

**Returns:** *Promise‹any›*
