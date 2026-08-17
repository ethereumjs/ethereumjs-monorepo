[**@ethereumjs/block**](../README.md)

***

[@ethereumjs/block](../README.md) / BlockOptions

# Interface: BlockOptions

Defined in: [types.ts:20](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L20)

An object to set to which blockchain the blocks and their headers belong. This could be specified
using a Common object, or `chain` and `hardfork`. Defaults to mainnet without specifying a
hardfork.

## Properties

### calcDifficultyFromHeader?

> `optional` **calcDifficultyFromHeader**: [`BlockHeader`](../classes/BlockHeader.md)

Defined in: [types.ts:65](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L65)

If a preceding [BlockHeader](../classes/BlockHeader.md) (usually the parent header) is given the preceding
header will be used to calculate the difficulty for this block and the calculated
difficulty takes precedence over a provided static `difficulty` value.

Note that this option has no effect on networks other than PoW/Ethash networks
(respectively also deactivates on the Merge HF switching to PoS/Casper).

***

### common?

> `optional` **common**: `Common`

Defined in: [types.ts:32](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L32)

A Common object defining the chain and the hardfork a block/block header belongs to.

Object will be internally copied so that tx behavior don't incidentally
change on future HF changes.

Default: Common object set to `mainnet` and the HF currently defined as the default
hardfork in the Common class.

Current default hardfork: `merge`

***

### freeze?

> `optional` **freeze**: `boolean`

Defined in: [types.ts:77](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L77)

A block object by default gets frozen along initialization. This gives you
strong additional security guarantees on the consistency of the block parameters.
It also enables block hash caching when the `hash()` method is called multiple times.

If you need to deactivate the block freeze - e.g. because you want to subclass block and
add additional properties - it is strongly encouraged that you do the freeze yourself
within your code instead.

Default: true

***

### params?

> `optional` **params**: `ParamsDict`

Defined in: [types.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L56)

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

***

### setHardfork?

> `optional` **setHardfork**: `boolean`

Defined in: [types.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L39)

Set the hardfork either by timestamp (for HFs from Shanghai onwards) or by block number
for older Hfs.

Default: `false` (HF is set to whatever default HF is set by the Common instance)

***

### skipConsensusFormatValidation?

> `optional` **skipConsensusFormatValidation**: `boolean`

Defined in: [types.ts:81](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/block/src/types.ts#L81)

Skip consensus format validation checks on header if set. Defaults to false.
