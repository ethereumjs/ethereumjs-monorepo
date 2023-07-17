[@ethereumjs/common](../README.md) / GethConfigOpts

# Interface: GethConfigOpts

## Hierarchy

- `BaseOpts`

  ↳ **`GethConfigOpts`**

## Table of contents

### Properties

- [chain](GethConfigOpts.md#chain)
- [eips](GethConfigOpts.md#eips)
- [genesisHash](GethConfigOpts.md#genesishash)
- [hardfork](GethConfigOpts.md#hardfork)
- [mergeForkIdPostMerge](GethConfigOpts.md#mergeforkidpostmerge)

## Properties

### chain

• `Optional` **chain**: `string`

#### Defined in

[types.ts:117](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L117)

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

### genesisHash

• `Optional` **genesisHash**: `Uint8Array`

#### Defined in

[types.ts:118](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L118)

___

### hardfork

• `Optional` **hardfork**: `string`

String identifier ('byzantium') for hardfork or [Hardfork](../enums/Hardfork.md) enum.

Default: Hardfork.London

#### Inherited from

BaseOpts.hardfork

#### Defined in

[types.ts:73](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L73)

___

### mergeForkIdPostMerge

• `Optional` **mergeForkIdPostMerge**: `boolean`

#### Defined in

[types.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/src/types.ts#L119)
