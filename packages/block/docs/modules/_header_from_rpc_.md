[ethereumjs-block](../README.md) › ["header-from-rpc"](_header_from_rpc_.md)

# Module: "header-from-rpc"

## Index

### Functions

- [blockHeaderFromRpc](_header_from_rpc_.md#blockheaderfromrpc)

## Functions

### blockHeaderFromRpc

▸ **blockHeaderFromRpc**(`blockParams`: any, `chainOptions?`: [ChainOptions](../interfaces/_index_.chainoptions.md)): _[BlockHeader](../classes/\_header_.blockheader.md)‹›\_

_Defined in [header-from-rpc.ts:11](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/header-from-rpc.ts#L11)_

Creates a new block header object from Ethereum JSON RPC.

**Parameters:**

| Name            | Type                                                  | Description                                       |
| --------------- | ----------------------------------------------------- | ------------------------------------------------- |
| `blockParams`   | any                                                   | Ethereum JSON RPC of block (eth_getBlockByNumber) |
| `chainOptions?` | [ChainOptions](../interfaces/_index_.chainoptions.md) | An object describing the blockchain               |

**Returns:** _[BlockHeader](../classes/\_header_.blockheader.md)‹›\_
