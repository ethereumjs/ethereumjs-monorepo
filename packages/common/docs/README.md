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
- [EVMStateManagerInterface](interfaces/EVMStateManagerInterface.md)
- [GenesisBlockConfig](interfaces/GenesisBlockConfig.md)
- [GethConfigOpts](interfaces/GethConfigOpts.md)
- [HardforkByOpts](interfaces/HardforkByOpts.md)
- [HardforkConfig](interfaces/HardforkConfig.md)
- [StateManagerInterface](interfaces/StateManagerInterface.md)
- [StorageDump](interfaces/StorageDump.md)

### Type Aliases

- [AccessList](README.md#accesslist)
- [AccessListBytes](README.md#accesslistbytes)
- [AccessListBytesItem](README.md#accesslistbytesitem)
- [AccessListItem](README.md#accesslistitem)
- [AccountFields](README.md#accountfields)
- [CasperConfig](README.md#casperconfig)
- [CliqueConfig](README.md#cliqueconfig)
- [EthashConfig](README.md#ethashconfig)
- [Proof](README.md#proof)
- [StorageProof](README.md#storageproof)

### Variables

- [ChainGenesis](README.md#chaingenesis)

### Functions

- [parseGethGenesis](README.md#parsegethgenesis)

## Type Aliases

### AccessList

Ƭ **AccessList**: [`AccessListItem`](README.md#accesslistitem)[]

#### Defined in

[interfaces.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L39)

___

### AccessListBytes

Ƭ **AccessListBytes**: [`AccessListBytesItem`](README.md#accesslistbytesitem)[]

#### Defined in

[interfaces.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L38)

___

### AccessListBytesItem

Ƭ **AccessListBytesItem**: [`Uint8Array`, `Uint8Array`[]]

#### Defined in

[interfaces.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L37)

___

### AccessListItem

Ƭ **AccessListItem**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `address` | `PrefixedHexString` |
| `storageKeys` | `PrefixedHexString`[] |

#### Defined in

[interfaces.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L29)

___

### AccountFields

Ƭ **AccountFields**: `Partial`<`Pick`<`Account`, ``"nonce"`` \| ``"balance"`` \| ``"storageRoot"`` \| ``"codeHash"``\>\>

#### Defined in

[interfaces.ts:7](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L7)

___

### CasperConfig

Ƭ **CasperConfig**: `Object`

#### Defined in

[types.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L18)

___

### CliqueConfig

Ƭ **CliqueConfig**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `epoch` | `number` |
| `period` | `number` |

#### Defined in

[types.ts:11](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L11)

___

### EthashConfig

Ƭ **EthashConfig**: `Object`

#### Defined in

[types.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L16)

___

### Proof

Ƭ **Proof**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `accountProof` | `PrefixedHexString`[] |
| `address` | `PrefixedHexString` |
| `balance` | `PrefixedHexString` |
| `codeHash` | `PrefixedHexString` |
| `nonce` | `PrefixedHexString` |
| `storageHash` | `PrefixedHexString` |
| `storageProof` | [`StorageProof`](README.md#storageproof)[] |

#### Defined in

[interfaces.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L15)

___

### StorageProof

Ƭ **StorageProof**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `key` | `PrefixedHexString` |
| `proof` | `PrefixedHexString`[] |
| `value` | `PrefixedHexString` |

#### Defined in

[interfaces.ts:9](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/interfaces.ts#L9)

## Variables

### ChainGenesis

• `Const` **ChainGenesis**: `Record`<[`Chain`](enums/Chain.md), `GenesisState`\>

GenesisState info about well known ethereum chains

#### Defined in

[enums.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/enums.ts#L23)

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
| `genesis` | { `baseFeePerGas`: `string` ; `coinbase`: `string` ; `difficulty`: `string` ; `excessDataGas`: `string` ; `extraData`: `string` ; `gasLimit`: `string` ; `mixHash`: `string` ; `nonce`: `string` ; `timestamp`: `string`  } |
| `genesis.baseFeePerGas` | `string` |
| `genesis.coinbase` | `string` |
| `genesis.difficulty` | `string` |
| `genesis.excessDataGas` | `string` |
| `genesis.extraData` | `string` |
| `genesis.gasLimit` | `string` |
| `genesis.mixHash` | `string` |
| `genesis.nonce` | `string` |
| `genesis.timestamp` | `string` |
| `hardfork` | `undefined` \| `string` |
| `hardforks` | `ConfigHardfork`[] |
| `name` | `string` |
| `networkId` | `number` |

#### Defined in

[utils.ts:199](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/utils.ts#L199)
