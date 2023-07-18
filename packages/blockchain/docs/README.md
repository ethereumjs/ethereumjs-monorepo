@ethereumjs/blockchain

# @ethereumjs/blockchain

## Table of contents

### Classes

- [Blockchain](classes/Blockchain.md)
- [CasperConsensus](classes/CasperConsensus.md)
- [CliqueConsensus](classes/CliqueConsensus.md)
- [EthashConsensus](classes/EthashConsensus.md)

### Interfaces

- [BlockchainInterface](interfaces/BlockchainInterface.md)
- [BlockchainOptions](interfaces/BlockchainOptions.md)
- [Consensus](interfaces/Consensus.md)
- [ConsensusOptions](interfaces/ConsensusOptions.md)
- [GenesisOptions](interfaces/GenesisOptions.md)

### Type Aliases

- [OnBlock](README.md#onblock)

## Type Aliases

### OnBlock

Ƭ **OnBlock**: (`block`: `Block`, `reorg`: `boolean`) => `Promise`<`void`\> \| `void`

#### Type declaration

▸ (`block`, `reorg`): `Promise`<`void`\> \| `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `block` | `Block` |
| `reorg` | `boolean` |

##### Returns

`Promise`<`void`\> \| `void`

#### Defined in

[types.ts:6](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/types.ts#L6)
