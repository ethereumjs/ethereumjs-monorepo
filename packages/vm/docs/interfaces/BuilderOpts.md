[@ethereumjs/vm](../README.md) / BuilderOpts

# Interface: BuilderOpts

Options for the block builder.

## Hierarchy

- `BlockOptions`

  ↳ **`BuilderOpts`**

## Table of contents

### Properties

- [calcDifficultyFromHeader](BuilderOpts.md#calcdifficultyfromheader)
- [cliqueSigner](BuilderOpts.md#cliquesigner)
- [common](BuilderOpts.md#common)
- [freeze](BuilderOpts.md#freeze)
- [putBlockIntoBlockchain](BuilderOpts.md#putblockintoblockchain)
- [setHardfork](BuilderOpts.md#sethardfork)
- [skipConsensusFormatValidation](BuilderOpts.md#skipconsensusformatvalidation)

## Properties

### calcDifficultyFromHeader

• `Optional` **calcDifficultyFromHeader**: `BlockHeader`

If a preceding BlockHeader (usually the parent header) is given the preceding
header will be used to calculate the difficulty for this block and the calculated
difficulty takes precedence over a provided static `difficulty` value.

Note that this option has no effect on networks other than PoW/Ethash networks
(respectively also deactivates on the Merge HF switching to PoS/Casper).

#### Inherited from

BlockOptions.calcDifficultyFromHeader

#### Defined in

block/dist/cjs/types.d.ts:41

___

### cliqueSigner

• `Optional` **cliqueSigner**: `Uint8Array`

Provide a clique signer's privateKey to seal this block.
Will throw if provided on a non-PoA chain.

#### Inherited from

BlockOptions.cliqueSigner

#### Defined in

block/dist/cjs/types.d.ts:58

___

### common

• `Optional` **common**: `Common`

A Common object defining the chain and the hardfork a block/block header belongs to.

Object will be internally copied so that tx behavior don't incidentally
change on future HF changes.

Default: Common object set to `mainnet` and the HF currently defined as the default
hardfork in the Common class.

Current default hardfork: `merge`

#### Inherited from

BlockOptions.common

#### Defined in

block/dist/cjs/types.d.ts:22

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

#### Inherited from

BlockOptions.freeze

#### Defined in

block/dist/cjs/types.d.ts:53

___

### putBlockIntoBlockchain

• `Optional` **putBlockIntoBlockchain**: `boolean`

Whether to put the block into the vm's blockchain after building it.
This is useful for completing a full cycle when building a block so
the only next step is to build again, however it may not be desired
if the block is being emulated or may be discarded as to not affect
the underlying blockchain.

Default: true

#### Defined in

[vm/src/types.ts:171](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L171)

___

### setHardfork

• `Optional` **setHardfork**: `boolean` \| `BigIntLike`

Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number
for older Hfs.

Additionally it is possible to pass in a specific TD value to support live-Merge-HF
transitions. Note that this should only be needed in very rare and specific scenarios.

Default: `false` (HF is set to whatever default HF is set by the Common instance)

#### Inherited from

BlockOptions.setHardfork

#### Defined in

block/dist/cjs/types.d.ts:32

___

### skipConsensusFormatValidation

• `Optional` **skipConsensusFormatValidation**: `boolean`

Skip consensus format validation checks on header if set. Defaults to false.

#### Inherited from

BlockOptions.skipConsensusFormatValidation

#### Defined in

block/dist/cjs/types.d.ts:62
