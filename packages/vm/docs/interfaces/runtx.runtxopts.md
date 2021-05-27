[@ethereumjs/vm](../README.md) / [runTx](../modules/runtx.md) / RunTxOpts

# Interface: RunTxOpts

[runTx](../modules/runtx.md).RunTxOpts

Options for the `runTx` method.

## Table of contents

### Properties

- [block](runtx.runtxopts.md#block)
- [cliqueBeneficiary](runtx.runtxopts.md#cliquebeneficiary)
- [reportAccessList](runtx.runtxopts.md#reportaccesslist)
- [skipBalance](runtx.runtxopts.md#skipbalance)
- [skipBlockGasLimitValidation](runtx.runtxopts.md#skipblockgaslimitvalidation)
- [skipNonce](runtx.runtxopts.md#skipnonce)
- [tx](runtx.runtxopts.md#tx)

## Properties

### block

• `Optional` **block**: *Block*

The `@ethereumjs/block` the `tx` belongs to.
If omitted, a default blank block will be used.
To obtain an accurate `TxReceipt`, please pass a block
with the header field `gasUsed` set to the value
prior to this tx being run.

Defined in: [runTx.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L38)

___

### cliqueBeneficiary

• `Optional` **cliqueBeneficiary**: *Address*

Optional clique Address: if the consensus algorithm is on clique,
and this parameter is provided, use this as the beneficiary of transaction fees
If it is not provided and the consensus algorithm is clique, instead
get it from the block using `cliqueSigner()`

Defined in: [runTx.ts:76](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L76)

___

### reportAccessList

• `Optional` **reportAccessList**: *boolean*

If true, adds a generated EIP-2930 access list
to the `RunTxResult` returned.

Option works with all tx types. EIP-2929 needs to
be activated (included in `berlin` HF).

Note: if this option is used with a custom `StateManager` implementation
the `generateAccessList()` method must be implemented.

Defined in: [runTx.ts:68](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L68)

___

### skipBalance

• `Optional` **skipBalance**: *boolean*

If true, skips the balance check

Defined in: [runTx.ts:50](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L50)

___

### skipBlockGasLimitValidation

• `Optional` **skipBlockGasLimitValidation**: *boolean*

If true, skips the validation of the tx's gas limit
agains the block's gas limit.

Defined in: [runTx.ts:56](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L56)

___

### skipNonce

• `Optional` **skipNonce**: *boolean*

If true, skips the nonce check

Defined in: [runTx.ts:46](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L46)

___

### tx

• **tx**: TypedTransaction

An `@ethereumjs/tx` to run

Defined in: [runTx.ts:42](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/lib/runTx.ts#L42)
