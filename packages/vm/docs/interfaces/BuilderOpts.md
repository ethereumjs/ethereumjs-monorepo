[**@ethereumjs/vm**](../README.md)

***

[@ethereumjs/vm](../README.md) / BuilderOpts

# Interface: BuilderOpts

Defined in: [vm/src/types.ts:192](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L192)

Options for the block builder.

## Extends

- `BlockOptions`

## Properties

### calcDifficultyFromHeader?

> `optional` **calcDifficultyFromHeader**: `BlockHeader`

Defined in: block/dist/esm/types.d.ts:55

If a preceding BlockHeader (usually the parent header) is given the preceding
header will be used to calculate the difficulty for this block and the calculated
difficulty takes precedence over a provided static `difficulty` value.

Note that this option has no effect on networks other than PoW/Ethash networks
(respectively also deactivates on the Merge HF switching to PoS/Casper).

#### Inherited from

`BlockOptions.calcDifficultyFromHeader`

***

### cliqueSigner?

> `optional` **cliqueSigner**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [vm/src/types.ts:207](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L207)

Provide a clique signer's privateKey to seal this block.
Will throw if provided on a non-PoA chain.

***

### common?

> `optional` **common**: `Common`

Defined in: block/dist/esm/types.d.ts:22

A Common object defining the chain and the hardfork a block/block header belongs to.

Object will be internally copied so that tx behavior don't incidentally
change on future HF changes.

Default: Common object set to `mainnet` and the HF currently defined as the default
hardfork in the Common class.

Current default hardfork: `merge`

#### Inherited from

`BlockOptions.common`

***

### freeze?

> `optional` **freeze**: `boolean`

Defined in: block/dist/esm/types.d.ts:67

A block object by default gets frozen along initialization. This gives you
strong additional security guarantees on the consistency of the block parameters.
It also enables block hash caching when the `hash()` method is called multiple times.

If you need to deactivate the block freeze - e.g. because you want to subclass block and
add additional properties - it is strongly encouraged that you do the freeze yourself
within your code instead.

Default: true

#### Inherited from

`BlockOptions.freeze`

***

### params?

> `optional` **params**: `ParamsDict`

Defined in: block/dist/esm/types.d.ts:46

Block parameters sorted by EIP can be found in the exported `paramsBlock` dictionary,
which is internally passed to the associated `@ethereumjs/common` instance which
manages parameter selection based on the hardfork and EIP settings.

This option allows providing a custom set of parameters. Note that parameters
get fully overwritten, so you need to extend the default parameter dict
to provide the full parameter set.

It is recommended to deep-clone the params object for this to avoid side effects:

```ts
const params = JSON.parse(JSON.stringify(paramsBlock))
params['1']['minGasLimit'] = 3000 // 5000
```

#### Inherited from

`BlockOptions.params`

***

### putBlockIntoBlockchain?

> `optional` **putBlockIntoBlockchain**: `boolean`

Defined in: [vm/src/types.ts:202](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/types.ts#L202)

Whether to put the block into the vm's blockchain after building it.
This is useful for completing a full cycle when building a block so
the only next step is to build again, however it may not be desired
if the block is being emulated or may be discarded as to not affect
the underlying blockchain.

Default: true

***

### setHardfork?

> `optional` **setHardfork**: `boolean`

Defined in: block/dist/esm/types.d.ts:29

Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number
for older Hfs.

Default: `false` (HF is set to whatever default HF is set by the Common instance)

#### Inherited from

`BlockOptions.setHardfork`

***

### skipConsensusFormatValidation?

> `optional` **skipConsensusFormatValidation**: `boolean`

Defined in: block/dist/esm/types.d.ts:71

Skip consensus format validation checks on header if set. Defaults to false.

#### Inherited from

`BlockOptions.skipConsensusFormatValidation`
