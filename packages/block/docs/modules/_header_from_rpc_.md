[@ethereumjs/block](../README.md) › ["header-from-rpc"](_header_from_rpc_.md)

# Module: "header-from-rpc"

## Index

### Functions

* [blockHeaderFromRpc](_header_from_rpc_.md#blockheaderfromrpc)

## Functions

###  blockHeaderFromRpc

▸ **blockHeaderFromRpc**(`blockParams`: any, `options?`: [BlockOptions](../interfaces/_index_.blockoptions.md)): *[BlockHeader](../classes/_header_.blockheader.md)‹›*

*Defined in [header-from-rpc.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header-from-rpc.ts#L10)*

Creates a new block header object from Ethereum JSON RPC.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`blockParams` | any | Ethereum JSON RPC of block (eth_getBlockByNumber) |
`options?` | [BlockOptions](../interfaces/_index_.blockoptions.md) | - |

**Returns:** *[BlockHeader](../classes/_header_.blockheader.md)‹›*
