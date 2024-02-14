[@ethereumjs/block](../README.md) / BlockOptions

# Interface: BlockOptions

An object to set to which blockchain the blocks and their headers belong. This could be specified
using a Common object, or `chain` and `hardfork`. Defaults to mainnet without specifying a
hardfork.

## Table of contents

### Properties

- [calcDifficultyFromHeader](BlockOptions.md#calcdifficultyfromheader)
- [cliqueSigner](BlockOptions.md#cliquesigner)
- [common](BlockOptions.md#common)
- [freeze](BlockOptions.md#freeze)
- [setHardfork](BlockOptions.md#sethardfork)
- [skipConsensusFormatValidation](BlockOptions.md#skipconsensusformatvalidation)

## Properties

### calcDifficultyFromHeader

• `Optional` **calcDifficultyFromHeader**: [`BlockHeader`](../classes/BlockHeader.md)

If a preceding [BlockHeader](../classes/BlockHeader.md) (usually the parent header) is given the preceding
header will be used to calculate the difficulty for this block and the calculated
difficulty takes precedence over a provided static `difficulty` value.

Note that this option has no effect on networks other than PoW/Ethash networks
(respectively also deactivates on the Merge HF switching to PoS/Casper).

#### Defined in

[types.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L50)

___

### cliqueSigner

• `Optional` **cliqueSigner**: `Uint8Array`

Provide a clique signer's privateKey to seal this block.
Will throw if provided on a non-PoA chain.

#### Defined in

[types.ts:67](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L67)

___

### common

• `Optional` **common**: `Common`

A Common object defining the chain and the hardfork a block/block header belongs to.

Object will be internally copied so that tx behavior don't incidentally
change on future HF changes.

Default: Common object set to `mainnet` and the HF currently defined as the default
hardfork in the Common class.

Current default hardfork: `merge`

#### Defined in

[types.ts:31](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L31)

___

### freeze

• `Optional` **freeze**: `boolean`

A block object by default gets frozen along initialization. This gives you
strong additional security guarantees on the consistency of the block parameters.
It also enables block hash caching when the `hash()` method is called multiple times.

If you need to deactivate the block freeze - e.g. because you want to subclass block and
add additional properties - it is strongly encouraged that you do the freeze yourself
within your code instead.

Default: true

#### Defined in

[types.ts:62](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L62)

___

### setHardfork

• `Optional` **setHardfork**: `boolean` \| `BigIntLike`

Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number
for older Hfs.

Additionally it is possible to pass in a specific TD value to support live-Merge-HF
transitions. Note that this should only be needed in very rare and specific scenarios.

Default: `false` (HF is set to whatever default HF is set by the Common instance)

#### Defined in

[types.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L41)

___

### skipConsensusFormatValidation

• `Optional` **skipConsensusFormatValidation**: `boolean`

Skip consensus format validation checks on header if set. Defaults to false.

#### Defined in

[types.ts:71](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L71)
