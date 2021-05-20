[@ethereumjs/common](../README.md) / [types](../modules/types.md) / Chain

# Interface: Chain

[types](../modules/types.md).Chain

## Table of contents

### Properties

- [bootstrapNodes](types.chain.md#bootstrapnodes)
- [chainId](types.chain.md#chainid)
- [comment](types.chain.md#comment)
- [consensus](types.chain.md#consensus)
- [defaultHardfork](types.chain.md#defaulthardfork)
- [dnsNetworks](types.chain.md#dnsnetworks)
- [genesis](types.chain.md#genesis)
- [hardforks](types.chain.md#hardforks)
- [name](types.chain.md#name)
- [networkId](types.chain.md#networkid)
- [url](types.chain.md#url)

## Properties

### bootstrapNodes

• **bootstrapNodes**: [*BootstrapNode*](types.bootstrapnode.md)[]

Defined in: [packages/common/src/types.ts:27](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L27)

___

### chainId

• **chainId**: *number* \| *BN*

Defined in: [packages/common/src/types.ts:19](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L19)

___

### comment

• **comment**: *string*

Defined in: [packages/common/src/types.ts:23](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L23)

___

### consensus

• `Optional` **consensus**: *object*

#### Type declaration

| Name | Type |
| :------ | :------ |
| `algorithm` | *string* |
| `clique?` | *object* |
| `clique.epoch` | *number* |
| `clique.period` | *number* |
| `ethash?` | *any* |
| `type` | *string* |

Defined in: [packages/common/src/types.ts:30](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L30)

___

### defaultHardfork

• `Optional` **defaultHardfork**: *string*

Defined in: [packages/common/src/types.ts:22](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L22)

___

### dnsNetworks

• `Optional` **dnsNetworks**: *string*[]

Defined in: [packages/common/src/types.ts:28](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L28)

___

### genesis

• **genesis**: [*GenesisBlock*](types.genesisblock.md)

Defined in: [packages/common/src/types.ts:25](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L25)

___

### hardforks

• **hardforks**: [*Hardfork*](types.hardfork.md)[]

Defined in: [packages/common/src/types.ts:26](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L26)

___

### name

• **name**: *string*

Defined in: [packages/common/src/types.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L18)

___

### networkId

• **networkId**: *number* \| *BN*

Defined in: [packages/common/src/types.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L20)

___

### url

• **url**: *string*

Defined in: [packages/common/src/types.ts:24](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L24)
