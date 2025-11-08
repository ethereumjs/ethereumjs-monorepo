[**@ethereumjs/tx**](../README.md)

***

[@ethereumjs/tx](../README.md) / TxOptions

# Interface: TxOptions

Defined in: [types.ts:59](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L59)

The options for initializing a [Transaction](Transaction.md).

## Properties

### allowUnlimitedInitCodeSize?

> `optional` **allowUnlimitedInitCodeSize**: `boolean`

Defined in: [types.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L105)

Allows unlimited contract code-size init while debugging. This (partially) disables EIP-3860.
Gas cost for initcode size analysis will still be charged. Use with caution.

***

### common?

> `optional` **common**: `Common`

Defined in: [types.ts:70](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L70)

A Common object defining the chain and hardfork for the transaction.

Object will be internally copied so that tx behavior don't incidentally
change on future HF changes.

Default: Common object set to `mainnet` and the default hardfork as defined in the Common class.

Current default hardfork: `istanbul`

***

### freeze?

> `optional` **freeze**: `boolean`

Defined in: [types.ts:99](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L99)

A transaction object by default gets frozen along initialization. This gives you
strong additional security guarantees on the consistency of the tx parameters.
It also enables tx hash caching when the `hash()` method is called multiple times.

If you need to deactivate the tx freeze - e.g. because you want to subclass tx and
add additional properties - it is strongly encouraged that you do the freeze yourself
within your code instead.

Default: true

***

### params?

> `optional` **params**: `ParamsDict`

Defined in: [types.ts:87](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/tx/src/types.ts#L87)

Tx parameters sorted by EIP can be found in the exported `paramsTx` dictionary,
which is internally passed to the associated `@ethereumjs/common` instance which
manages parameter selection based on the hardfork and EIP settings.

This option allows providing a custom set of parameters. Note that parameters
get fully overwritten, so you need to extend the default parameter dict
to provide the full parameter set.

It is recommended to deep-clone the params object for this to avoid side effects:

```ts
const params = JSON.parse(JSON.stringify(paramsTx))
params['1']['txGas'] = 30000 // 21000
```
