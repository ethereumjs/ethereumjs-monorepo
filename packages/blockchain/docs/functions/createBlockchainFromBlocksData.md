[**@ethereumjs/blockchain**](../README.md)

***

[@ethereumjs/blockchain](../README.md) / createBlockchainFromBlocksData

# Function: createBlockchainFromBlocksData()

> **createBlockchainFromBlocksData**(`blocksData`, `opts?`): `Promise`\<[`Blockchain`](../classes/Blockchain.md)\>

Defined in: [constructors.ts:112](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/constructors.ts#L112)

Initialize a blockchain and append a sequence of blocks from plain data.

## Parameters

### blocksData

`BlockData`[]

Blocks readable by createBlock

### opts?

[`BlockchainOptions`](../interfaces/BlockchainOptions.md) = `{}`

## Returns

`Promise`\<[`Blockchain`](../classes/Blockchain.md)\>

## Throws

If genesis initialization fails

## Throws

If any [Blockchain.putBlock](../classes/Blockchain.md#putblock) validation fails
