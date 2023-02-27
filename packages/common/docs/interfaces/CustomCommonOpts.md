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

[packages/common/src/types.ts:115](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L115)

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

[packages/common/src/types.ts:80](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L80)

___

### hardfork

• `Optional` **hardfork**: `string`

String identifier ('byzantium') for hardfork or [Hardfork](../enums/Hardfork.md) enum.

Default: Hardfork.London

#### Inherited from

BaseOpts.hardfork

#### Defined in

[packages/common/src/types.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L71)
