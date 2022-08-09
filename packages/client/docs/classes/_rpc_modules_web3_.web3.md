[ethereumjs-client](../README.md) › ["rpc/modules/web3"](../modules/_rpc_modules_web3_.md) › [Web3](_rpc_modules_web3_.web3.md)

# Class: Web3

web3\_\* RPC module

**`memberof`** module:rpc/modules

## Hierarchy

- **Web3**

## Index

### Constructors

- [constructor](_rpc_modules_web3_.web3.md#constructor)

### Methods

- [clientVersion](_rpc_modules_web3_.web3.md#clientversion)
- [sha3](_rpc_modules_web3_.web3.md#sha3)

## Constructors

### constructor

\+ **new Web3**(`node`: any): _[Web3](_rpc_modules_web3_.web3.md)_

_Defined in [lib/rpc/modules/web3.ts:10](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/web3.ts#L10)_

Create web3\_\* RPC module

**Parameters:**

| Name   | Type |
| ------ | ---- |
| `node` | any  |

**Returns:** _[Web3](_rpc_modules_web3_.web3.md)_

## Methods

### clientVersion

▸ **clientVersion**(`_params`: never[], `cb`: function): _void_

_Defined in [lib/rpc/modules/web3.ts:31](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/web3.ts#L31)_

Returns the current client version

**Parameters:**

▪`Default value` **\_params**: _never[]_= []

▪ **cb**: _function_

▸ (`err`: null, `version`: string): _void_

**Parameters:**

| Name      | Type   |
| --------- | ------ |
| `err`     | null   |
| `version` | string |

**Returns:** _void_

---

### sha3

▸ **sha3**(`params`: string[], `cb`: function): _void_

_Defined in [lib/rpc/modules/web3.ts:42](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/web3.ts#L42)_

Returns Keccak-256 (not the standardized SHA3-256) of the given data

**Parameters:**

▪ **params**: _string[]_

▪ **cb**: _function_

▸ (`err`: Error | null, `hash?`: undefined | string): _void_

**Parameters:**

| Name    | Type                    |
| ------- | ----------------------- |
| `err`   | Error &#124; null       |
| `hash?` | undefined &#124; string |

**Returns:** _void_
