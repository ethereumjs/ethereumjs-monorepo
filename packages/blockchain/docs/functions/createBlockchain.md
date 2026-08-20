[**@ethereumjs/blockchain**](../README.md)

***

[@ethereumjs/blockchain](../README.md) / createBlockchain

# Function: createBlockchain()

> **createBlockchain**(`opts?`): `Promise`\<[`Blockchain`](../classes/Blockchain.md)\>

Defined in: [constructors.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/constructors.ts#L32)

Initialize a blockchain, seeding genesis when the DB is empty.

## Parameters

### opts?

[`BlockchainOptions`](../interfaces/BlockchainOptions.md) = `{}`

## Returns

`Promise`\<[`Blockchain`](../classes/Blockchain.md)\>

## Throws

If the DB genesis hash does not match the provided genesis block
