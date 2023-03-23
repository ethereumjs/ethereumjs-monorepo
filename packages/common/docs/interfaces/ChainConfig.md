[@ethereumjs/common](../README.md) / ChainConfig

# Interface: ChainConfig

## Table of contents

### Properties

- [bootstrapNodes](ChainConfig.md#bootstrapnodes)
- [chainId](ChainConfig.md#chainid)
- [comment](ChainConfig.md#comment)
- [consensus](ChainConfig.md#consensus)
- [defaultHardfork](ChainConfig.md#defaulthardfork)
- [dnsNetworks](ChainConfig.md#dnsnetworks)
- [genesis](ChainConfig.md#genesis)
- [hardforks](ChainConfig.md#hardforks)
- [name](ChainConfig.md#name)
- [networkId](ChainConfig.md#networkid)
- [url](ChainConfig.md#url)

## Properties

### bootstrapNodes

• **bootstrapNodes**: [`BootstrapNodeConfig`](BootstrapNodeConfig.md)[]

#### Defined in

[packages/common/src/types.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L27)

___

### chainId

• **chainId**: `number` \| `bigint`

#### Defined in

[packages/common/src/types.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L20)

___

### comment

• `Optional` **comment**: `string`

#### Defined in

[packages/common/src/types.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L23)

___

### consensus

• **consensus**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `algorithm` | `string` |
| `casper?` | [`CasperConfig`](../README.md#casperconfig) |
| `clique?` | [`CliqueConfig`](../README.md#cliqueconfig) |
| `ethash?` | [`EthashConfig`](../README.md#ethashconfig) |
| `type` | `string` |

#### Defined in

[packages/common/src/types.ts:29](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L29)

___

### defaultHardfork

• `Optional` **defaultHardfork**: `string`

#### Defined in

[packages/common/src/types.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L22)

___

### dnsNetworks

• `Optional` **dnsNetworks**: `string`[]

#### Defined in

[packages/common/src/types.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L28)

___

### genesis

• **genesis**: [`GenesisBlockConfig`](GenesisBlockConfig.md)

#### Defined in

[packages/common/src/types.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L25)

___

### hardforks

• **hardforks**: [`HardforkConfig`](HardforkConfig.md)[]

#### Defined in

[packages/common/src/types.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L26)

___

### name

• **name**: `string`

#### Defined in

[packages/common/src/types.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L19)

___

### networkId

• **networkId**: `number` \| `bigint`

#### Defined in

[packages/common/src/types.ts:21](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L21)

___

### url

• `Optional` **url**: `string`

#### Defined in

[packages/common/src/types.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L24)
