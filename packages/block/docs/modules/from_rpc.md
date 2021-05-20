[@ethereumjs/block](../README.md) / from-rpc

# Module: from-rpc

## Table of contents

### Functions

- [default](from_rpc.md#default)

## Functions

### default

▸ **default**(`blockParams`: *any*, `uncles?`: *any*[], `options?`: [*BlockOptions*](../interfaces/types.blockoptions.md)): [*Block*](../classes/block.block-1.md)

Creates a new block object from Ethereum JSON RPC.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `blockParams` | *any* | - | Ethereum JSON RPC of block (eth_getBlockByNumber) |
| `uncles` | *any*[] | [] | Optional list of Ethereum JSON RPC of uncles (eth_getUncleByBlockHashAndIndex) |
| `options?` | [*BlockOptions*](../interfaces/types.blockoptions.md) | - | - |

**Returns:** [*Block*](../classes/block.block-1.md)

Defined in: [from-rpc.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/from-rpc.ts#L32)
