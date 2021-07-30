[@ethereumjs/common](../README.md) / [index](../modules/index.md) / CustomCommonOpts

# Interface: CustomCommonOpts

[index](../modules/index.md).CustomCommonOpts

Options to be used with the {@link Common.custom} static constructor.

## Hierarchy

- `BaseOpts`

  ↳ **CustomCommonOpts**

## Table of contents

### Properties

- [baseChain](index.customcommonopts.md#basechain)
- [eips](index.customcommonopts.md#eips)
- [hardfork](index.customcommonopts.md#hardfork)
- [supportedHardforks](index.customcommonopts.md#supportedhardforks)

## Properties

### baseChain

• `Optional` **baseChain**: `string` \| `number` \| `BN`

The name (`mainnet`) or id (`1`) of a standard chain used to base the custom
chain params on.

#### Defined in

[packages/common/src/index.ts:116](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L116)

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
