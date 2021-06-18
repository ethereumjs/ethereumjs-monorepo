[@ethereumjs/block](../README.md) / header-from-rpc

# Module: header-from-rpc

## Table of contents

### Functions

- [default](header_from_rpc.md#default)

## Functions

### default

▸ **default**(`blockParams`: *any*, `options?`: [*BlockOptions*](../interfaces/types.blockoptions.md)): [*BlockHeader*](../classes/header.blockheader.md)

Creates a new block header object from Ethereum JSON RPC.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `blockParams` | *any* | Ethereum JSON RPC of block (eth_getBlockByNumber) |
| `options?` | [*BlockOptions*](../interfaces/types.blockoptions.md) | - |

**Returns:** [*BlockHeader*](../classes/header.blockheader.md)

Defined in: [header-from-rpc.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/header-from-rpc.ts#L10)
