[@ethereumjs/block](../README.md) › ["from-rpc"](_from_rpc_.md)

# Module: "from-rpc"

## Index

### Functions

* [blockFromRpc](_from_rpc_.md#blockfromrpc)

## Functions

###  blockFromRpc

▸ **blockFromRpc**(`blockParams`: any, `uncles`: any[], `options?`: [BlockOptions](../interfaces/_index_.blockoptions.md)): *[Block](../classes/_block_.block.md)‹›*

*Defined in [from-rpc.ts:32](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/from-rpc.ts#L32)*

Creates a new block object from Ethereum JSON RPC.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`blockParams` | any | - | Ethereum JSON RPC of block (eth_getBlockByNumber) |
`uncles` | any[] | [] | Optional list of Ethereum JSON RPC of uncles (eth_getUncleByBlockHashAndIndex) |
`options?` | [BlockOptions](../interfaces/_index_.blockoptions.md) | - | - |

**Returns:** *[Block](../classes/_block_.block.md)‹›*
