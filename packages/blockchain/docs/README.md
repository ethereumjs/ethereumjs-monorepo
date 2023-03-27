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

### Functions

- [parseGethGenesisState](README.md#parsegethgenesisstate)

## Functions

### parseGethGenesisState

▸ **parseGethGenesisState**(`json`): `GenesisState`

Parses the geth genesis state into Blockchain GenesisState

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `json` | `any` | representing the `alloc` key in a Geth genesis file |

#### Returns

`GenesisState`

#### Defined in

[utils.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/blockchain/src/utils.ts#L9)
