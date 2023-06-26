@ethereumjs/common

# @ethereumjs/common

## Table of contents

### Enumerations

- [Chain](enums/Chain.md)
- [ConsensusAlgorithm](enums/ConsensusAlgorithm.md)
- [ConsensusType](enums/ConsensusType.md)
- [CustomChain](enums/CustomChain.md)
- [Hardfork](enums/Hardfork.md)

### Classes

- [Common](classes/Common.md)

### Interfaces

- [BootstrapNodeConfig](interfaces/BootstrapNodeConfig.md)
- [ChainConfig](interfaces/ChainConfig.md)
- [ChainName](interfaces/ChainName.md)
- [ChainsConfig](interfaces/ChainsConfig.md)
- [CommonOpts](interfaces/CommonOpts.md)
- [CustomCommonOpts](interfaces/CustomCommonOpts.md)
- [GenesisBlockConfig](interfaces/GenesisBlockConfig.md)
- [GethConfigOpts](interfaces/GethConfigOpts.md)
- [HardforkConfig](interfaces/HardforkConfig.md)

### Type Aliases

- [CasperConfig](README.md#casperconfig)
- [CliqueConfig](README.md#cliqueconfig)
- [EthashConfig](README.md#ethashconfig)

### Functions

- [parseGethGenesis](README.md#parsegethgenesis)

## Type Aliases

### CasperConfig

Ƭ **CasperConfig**: `Object`

#### Defined in

[packages/common/src/types.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L17)

___

### CliqueConfig

Ƭ **CliqueConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `epoch` | `number` |
| `period` | `number` |

#### Defined in

[packages/common/src/types.ts:10](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L10)

___

### EthashConfig

Ƭ **EthashConfig**: `Object`

#### Defined in

[packages/common/src/types.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L15)

## Functions

### parseGethGenesis

▸ **parseGethGenesis**(`json`, `name?`, `mergeForkIdPostMerge?`): `Object`

Parses a genesis.json exported from Geth into parameters for Common instance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `json` | `any` | representing the Geth genesis file |
| `name?` | `string` | optional chain name |
| `mergeForkIdPostMerge?` | `boolean` | - |

#### Returns

`Object`

parsed params

| Name | Type |
| :------ | :------ |
| `bootstrapNodes` | `never`[] |
| `chainId` | `number` |
| `consensus` | { `algorithm`: `string` = 'clique'; `clique`: { `epoch`: `any` ; `period`: `any`  } ; `ethash`: `undefined` = {}; `type`: `string` = 'poa' } \| { `algorithm`: `string` = 'ethash'; `clique`: `undefined` ; `ethash`: {} = {}; `type`: `string` = 'pow' } |
| `genesis` | { `baseFeePerGas`: `string` ; `coinbase`: `string` ; `difficulty`: `number` ; `extraData`: `string` ; `gasLimit`: `number` ; `mixHash`: `string` ; `nonce`: `string` ; `timestamp`: `string`  } |
| `genesis.baseFeePerGas` | `string` |
| `genesis.coinbase` | `string` |
| `genesis.difficulty` | `number` |
| `genesis.extraData` | `string` |
| `genesis.gasLimit` | `number` |
| `genesis.mixHash` | `string` |
| `genesis.nonce` | `string` |
| `genesis.timestamp` | `string` |
| `hardfork` | `undefined` \| `string` |
| `hardforks` | `ConfigHardfork`[] |
| `name` | `string` |
| `networkId` | `number` |

#### Defined in

[packages/common/src/utils.ts:196](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/utils.ts#L196)
