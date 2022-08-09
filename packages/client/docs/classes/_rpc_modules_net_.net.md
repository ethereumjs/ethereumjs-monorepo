[ethereumjs-client](../README.md) › ["rpc/modules/net"](../modules/_rpc_modules_net_.md) › [Net](_rpc_modules_net_.net.md)

# Class: Net

net\_\* RPC module

**`memberof`** module:rpc/modules

## Hierarchy

- **Net**

## Index

### Constructors

- [constructor](_rpc_modules_net_.net.md#constructor)

### Methods

- [listening](_rpc_modules_net_.net.md#listening)
- [peerCount](_rpc_modules_net_.net.md#peercount)
- [version](_rpc_modules_net_.net.md#version)

## Constructors

### constructor

\+ **new Net**(`node`: any): _[Net](_rpc_modules_net_.net.md)_

_Defined in [lib/rpc/modules/net.ts:12](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/net.ts#L12)_

Create net\_\* RPC module

**Parameters:**

| Name   | Type |
| ------ | ---- |
| `node` | any  |

**Returns:** _[Net](_rpc_modules_net_.net.md)_

## Methods

### listening

▸ **listening**(`_params`: never[], `cb`: function): _void_

_Defined in [lib/rpc/modules/net.ts:45](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/net.ts#L45)_

Returns true if client is actively listening for network connections

**Parameters:**

▪`Default value` **\_params**: _never[]_= []

▪ **cb**: _function_

▸ (`err`: Error | null, `isListening`: boolean): _void_

**Parameters:**

| Name          | Type              |
| ------------- | ----------------- |
| `err`         | Error &#124; null |
| `isListening` | boolean           |

**Returns:** _void_

---

### peerCount

▸ **peerCount**(`_params`: never[], `cb`: function): _void_

_Defined in [lib/rpc/modules/net.ts:55](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/net.ts#L55)_

Returns number of peers currently connected to the client

**Parameters:**

▪`Default value` **\_params**: _never[]_= []

▪ **cb**: _function_

▸ (`err`: Error | null, `numberOfPeers`: string): _void_

**Parameters:**

| Name            | Type              |
| --------------- | ----------------- |
| `err`           | Error &#124; null |
| `numberOfPeers` | string            |

**Returns:** _void_

---

### version

▸ **version**(`_params`: never[], `cb`: function): _void_

_Defined in [lib/rpc/modules/net.ts:35](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/net.ts#L35)_

Returns the current network id

**Parameters:**

▪`Default value` **\_params**: _never[]_= []

▪ **cb**: _function_

▸ (`err`: Error | null, `id`: string): _void_

**Parameters:**

| Name  | Type              |
| ----- | ----------------- |
| `err` | Error &#124; null |
| `id`  | string            |

**Returns:** _void_
