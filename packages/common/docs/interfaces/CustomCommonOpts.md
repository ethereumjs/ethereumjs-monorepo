[@ethereumjs/common](../README.md) / CustomCommonOpts

# Interface: CustomCommonOpts

Options to be used with the {@link Common.custom} static constructor.

## Hierarchy

- `BaseOpts`

  ↳ **`CustomCommonOpts`**

## Table of contents

### Properties

- [baseChain](CustomCommonOpts.md#basechain)
- [eips](CustomCommonOpts.md#eips)
- [hardfork](CustomCommonOpts.md#hardfork)
- [supportedHardforks](CustomCommonOpts.md#supportedhardforks)

## Properties

### baseChain

• `Optional` **baseChain**: `string` \| `number` \| `BN`

The name (`mainnet`), id (`1`), or [Chain](../enums/Chain.md) enum of
a standard chain used to base the custom chain params on.

#### Defined in

[packages/common/src/index.ts:181](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L181)

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

[packages/common/src/index.ts:118](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L118)

___

### hardfork

• `Optional` **hardfork**: `string`

String identifier ('byzantium') for hardfork or [Hardfork](../enums/Hardfork.md) enum.

Default: Hardfork.Istanbul

#### Inherited from

BaseOpts.hardfork

#### Defined in

[packages/common/src/index.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L105)

___

### supportedHardforks

• `Optional` **supportedHardforks**: `string`[]

Limit parameter returns to the given hardforks

#### Inherited from

BaseOpts.supportedHardforks

#### Defined in

[packages/common/src/index.ts:109](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/index.ts#L109)
