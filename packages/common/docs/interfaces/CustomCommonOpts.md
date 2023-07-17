[@ethereumjs/common](../README.md) / CustomCommonOpts

# Interface: CustomCommonOpts

Options to be used with the [custom](../classes/Common.md#custom) static constructor.

## Hierarchy

- `BaseOpts`

  ↳ **`CustomCommonOpts`**

## Table of contents

### Properties

- [baseChain](CustomCommonOpts.md#basechain)
- [eips](CustomCommonOpts.md#eips)
- [hardfork](CustomCommonOpts.md#hardfork)

## Properties

### baseChain

• `Optional` **baseChain**: `string` \| `number` \| `bigint`

The name (`mainnet`), id (`1`), or [Chain](../enums/Chain.md) enum of
a standard chain used to base the custom chain params on.

#### Defined in

[types.ts:113](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L113)

___

### eips

• `Optional` **eips**: `number`[]

Selected EIPs which can be activated, please use an array for instantiation
(e.g. `eips: [ 1559, 3860 ]`)

#### Inherited from

BaseOpts.eips

#### Defined in

[types.ts:78](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L78)

___

### hardfork

• `Optional` **hardfork**: `string`

String identifier ('byzantium') for hardfork or [Hardfork](../enums/Hardfork.md) enum.

Default: Hardfork.London

#### Inherited from

BaseOpts.hardfork

#### Defined in

[types.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L73)
