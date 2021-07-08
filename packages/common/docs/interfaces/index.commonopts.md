[@ethereumjs/common](../README.md) / [index](../modules/index.md) / CommonOpts

# Interface: CommonOpts

[index](../modules/index.md).CommonOpts

Options for instantiating a {@link Common} instance.

## Hierarchy

- `BaseOpts`

  ↳ **CommonOpts**

## Table of contents

### Properties

- [chain](index.commonopts.md#chain)
- [customChains](index.commonopts.md#customchains)
- [eips](index.commonopts.md#eips)
- [hardfork](index.commonopts.md#hardfork)
- [supportedHardforks](index.commonopts.md#supportedhardforks)

## Properties

### chain

• **chain**: `string` \| `number` \| `object` \| `BN`

Chain name ('mainnet') or id (1), either from a chain directly supported
or a custom chain passed in via [CommonOpts.customChains](index.commonopts.md#customchains)

#### Defined in

[packages/common/src/index.ts:93](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L93)

___

### customChains

• `Optional` **customChains**: [Chain](types.chain.md)[]

Initialize (in addition to the supported chains) with the selected
custom chains

Usage (directly with the respective chain intialization via the [CommonOpts.chain](index.commonopts.md#chain) option):

```javascript
import myCustomChain1 from '[PATH_TO_MY_CHAINS]/myCustomChain1.json'
const common = new Common({ chain: 'myCustomChain1', customChains: [ myCustomChain1 ]})
```

#### Defined in

[packages/common/src/index.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L105)

___

### eips

• `Optional` **eips**: `number`[]

Selected EIPs which can be activated, please use an array for instantiation
(e.g. `eips: [ 2537, ]`)

Currently supported:

- [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537) - BLS12-381 precompiles

#### Inherited from

BaseOpts.eips

#### Defined in

[packages/common/src/index.ts:82](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L82)

___

### hardfork

• `Optional` **hardfork**: `string`

String identifier ('byzantium') for hardfork

Default: `istanbul`

#### Inherited from

BaseOpts.hardfork

#### Defined in

[packages/common/src/index.ts:69](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L69)

___

### supportedHardforks

• `Optional` **supportedHardforks**: `string`[]

Limit parameter returns to the given hardforks

#### Inherited from

BaseOpts.supportedHardforks

#### Defined in

[packages/common/src/index.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L73)
