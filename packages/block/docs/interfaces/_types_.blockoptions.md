[@ethereumjs/block](../README.md) › ["types"](../modules/_types_.md) › [BlockOptions](_types_.blockoptions.md)

# Interface: BlockOptions

An object to set to which blockchain the blocks and their headers belong. This could be specified
using a Common object, or `chain` and `hardfork`. Defaults to mainnet without specifying a
hardfork.

## Hierarchy

* **BlockOptions**

## Index

### Properties

* [calcDifficultyFromHeader](_types_.blockoptions.md#optional-calcdifficultyfromheader)
* [common](_types_.blockoptions.md#optional-common)
* [freeze](_types_.blockoptions.md#optional-freeze)
* [hardforkByBlockNumber](_types_.blockoptions.md#optional-hardforkbyblocknumber)
* [initWithGenesisHeader](_types_.blockoptions.md#optional-initwithgenesisheader)

## Properties

### `Optional` calcDifficultyFromHeader

• **calcDifficultyFromHeader**? : *[BlockHeader](../classes/_header_.blockheader.md)*

*Defined in [types.ts:45](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/types.ts#L45)*

If a preceding `BlockHeader` (usually the parent header) is given the preceding
header will be used to calculate the difficulty for this block and the calculated
difficulty takes precedence over a provided static `difficulty` value.

___

### `Optional` common

• **common**? : *Common*

*Defined in [types.ts:21](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/types.ts#L21)*

A Common object defining the chain and the hardfork a block/block header belongs to.

Default: `Common` object set to `mainnet` and the HF currently defined as the default
hardfork in the `Common` class.

Current default hardfork: `istanbul`

___

### `Optional` freeze

• **freeze**? : *undefined | false | true*

*Defined in [types.ts:56](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/types.ts#L56)*

A block object by default gets frozen along initialization. This gives you
strong additional security guarantees on the consistency of the block parameters.

If you need to deactivate the block freeze - e.g. because you want to subclass block and
add aditional properties - it is strongly encouraged that you do the freeze yourself
within your code instead.

Default: true

___

### `Optional` hardforkByBlockNumber

• **hardforkByBlockNumber**? : *undefined | false | true*

*Defined in [types.ts:27](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/types.ts#L27)*

Determine the HF by the block number

Default: `false` (HF is set to whatever default HF is set by the Common instance)

___

### `Optional` initWithGenesisHeader

• **initWithGenesisHeader**? : *undefined | false | true*

*Defined in [types.ts:38](https://github.com/ethereumjs/ethereumjs-vm/blob/master/packages/block/src/types.ts#L38)*

Turns the block header into the canonical genesis block header

If set to `true` all other header data is ignored.

If a Common instance is passed the instance need to be set to `chainstart` as a HF,
otherwise usage of this option will throw

Default: `false`
