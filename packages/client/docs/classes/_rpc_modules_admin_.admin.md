[ethereumjs-client](../README.md) › ["rpc/modules/admin"](../modules/_rpc_modules_admin_.md) › [Admin](_rpc_modules_admin_.admin.md)

# Class: Admin

admin\_\* RPC module

**`memberof`** module:rpc/modules

## Hierarchy

- **Admin**

## Index

### Constructors

- [constructor](_rpc_modules_admin_.admin.md#constructor)

### Properties

- [\_chain](_rpc_modules_admin_.admin.md#_chain)
- [\_ethProtocol](_rpc_modules_admin_.admin.md#_ethprotocol)
- [\_node](_rpc_modules_admin_.admin.md#_node)

### Methods

- [nodeInfo](_rpc_modules_admin_.admin.md#nodeinfo)

## Constructors

### constructor

\+ **new Admin**(`node`: [Node](_node_.node.md)): _[Admin](_rpc_modules_admin_.admin.md)_

_Defined in [lib/rpc/modules/admin.ts:17](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/admin.ts#L17)_

Create admin\_\* RPC module

**Parameters:**

| Name   | Type                   |
| ------ | ---------------------- |
| `node` | [Node](_node_.node.md) |

**Returns:** _[Admin](_rpc_modules_admin_.admin.md)_

## Properties

### \_chain

• **\_chain**: _[Chain](_blockchain_chain_.chain.md)_

_Defined in [lib/rpc/modules/admin.ts:15](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/admin.ts#L15)_

---

### \_ethProtocol

• **\_ethProtocol**: _[EthProtocol](_net_protocol_ethprotocol_.ethprotocol.md)_

_Defined in [lib/rpc/modules/admin.ts:17](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/admin.ts#L17)_

---

### \_node

• **\_node**: _[Node](_node_.node.md)_

_Defined in [lib/rpc/modules/admin.ts:16](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/admin.ts#L16)_

## Methods

### nodeInfo

▸ **nodeInfo**(`params`: any, `cb`: Function): _Promise‹any›_

_Defined in [lib/rpc/modules/admin.ts:38](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/admin.ts#L38)_

Returns information about the currently running node.
see for reference: https://geth.ethereum.org/docs/rpc/ns-admin#admin_nodeinfo

**Parameters:**

| Name     | Type     |
| -------- | -------- |
| `params` | any      |
| `cb`     | Function |

**Returns:** _Promise‹any›_
