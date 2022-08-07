[ethereumjs-client](../README.md) › ["rpc/modules/eth"](../modules/_rpc_modules_eth_.md) › [Eth](_rpc_modules_eth_.eth.md)

# Class: Eth

eth\_\* RPC module

**`memberof`** module:rpc/modules

## Hierarchy

- **Eth**

## Index

### Constructors

- [constructor](_rpc_modules_eth_.eth.md#constructor)

### Properties

- [ethVersion](_rpc_modules_eth_.eth.md#ethversion)

### Methods

- [blockNumber](_rpc_modules_eth_.eth.md#blocknumber)
- [getBlockByHash](_rpc_modules_eth_.eth.md#getblockbyhash)
- [getBlockByNumber](_rpc_modules_eth_.eth.md#getblockbynumber)
- [getBlockTransactionCountByHash](_rpc_modules_eth_.eth.md#getblocktransactioncountbyhash)
- [protocolVersion](_rpc_modules_eth_.eth.md#protocolversion)

## Constructors

### constructor

\+ **new Eth**(`node`: any): _[Eth](_rpc_modules_eth_.eth.md)_

_Defined in [lib/rpc/modules/eth.ts:11](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/eth.ts#L11)_

Create eth\_\* RPC module

**Parameters:**

| Name   | Type |
| ------ | ---- |
| `node` | any  |

**Returns:** _[Eth](_rpc_modules_eth_.eth.md)_

## Properties

### ethVersion

• **ethVersion**: _any_

_Defined in [lib/rpc/modules/eth.ts:11](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/eth.ts#L11)_

## Methods

### blockNumber

▸ **blockNumber**(`_params`: never[], `cb`: function): _Promise‹void›_

_Defined in [lib/rpc/modules/eth.ts:51](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/eth.ts#L51)_

Returns Returns the number of most recent block.

**Parameters:**

▪`Default value` **\_params**: _never[]_= []

▪ **cb**: _function_

▸ (`err`: Error | null, `val?`: undefined | string): _void_

**Parameters:**

| Name   | Type                    |
| ------ | ----------------------- |
| `err`  | Error &#124; null       |
| `val?` | undefined &#124; string |

**Returns:** _Promise‹void›_

---

### getBlockByHash

▸ **getBlockByHash**(`params`: [string, boolean], `cb`: function): _Promise‹void›_

_Defined in [lib/rpc/modules/eth.ts:92](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/eth.ts#L92)_

Returns information about a block by hash

**Parameters:**

▪ **params**: _[string, boolean]_

▪ **cb**: _function_

▸ (`err`: Error | null, `val?`: any): _void_

**Parameters:**

| Name   | Type              |
| ------ | ----------------- |
| `err`  | Error &#124; null |
| `val?` | any               |

**Returns:** _Promise‹void›_

---

### getBlockByNumber

▸ **getBlockByNumber**(`params`: [string, boolean], `cb`: function): _Promise‹void›_

_Defined in [lib/rpc/modules/eth.ts:68](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/eth.ts#L68)_

Returns information about a block by block number

**Parameters:**

▪ **params**: _[string, boolean]_

▪ **cb**: _function_

▸ (`err`: Error | null, `val?`: any): _void_

**Parameters:**

| Name   | Type              |
| ------ | ----------------- |
| `err`  | Error &#124; null |
| `val?` | any               |

**Returns:** _Promise‹void›_

---

### getBlockTransactionCountByHash

▸ **getBlockTransactionCountByHash**(`params`: [string], `cb`: function): _Promise‹void›_

_Defined in [lib/rpc/modules/eth.ts:115](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/eth.ts#L115)_

Returns the transaction count for a block given by the block hash

**Parameters:**

▪ **params**: _[string]_

▪ **cb**: _function_

▸ (`err`: Error | null, `val?`: any): _void_

**Parameters:**

| Name   | Type              |
| ------ | ----------------- |
| `err`  | Error &#124; null |
| `val?` | any               |

**Returns:** _Promise‹void›_

---

### protocolVersion

▸ **protocolVersion**(`_params`: never[], `cb`: function): _void_

_Defined in [lib/rpc/modules/eth.ts:137](https://github.com/ethereumjs/ethereumjs-client/blob/master/lib/rpc/modules/eth.ts#L137)_

Returns the current ethereum protocol version

**Parameters:**

▪`Default value` **\_params**: _never[]_= []

▪ **cb**: _function_

▸ (`err`: null, `val`: string): _void_

**Parameters:**

| Name  | Type   |
| ----- | ------ |
| `err` | null   |
| `val` | string |

**Returns:** _void_
