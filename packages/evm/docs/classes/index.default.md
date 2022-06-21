[@ethereumjs/3vm](../README.md) / [Exports](../modules.md) / [index](../modules/index.md) / default

# Class: default

[index](../modules/index.md).default

Execution engine which can be used to run a blockchain, individual
blocks, individual transactions, or snippets of EVM bytecode.

This class is an AsyncEventEmitter, please consult the README to learn how to use it.

___
### getActiveOpcodes

▸ **getActiveOpcodes**(): `OpcodeList`

Returns a list with the currently activated opcodes
available for VM execution

#### Returns

`OpcodeList`

#### Defined in

[index.ts:379](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/index.ts#L379)

___

### runCall

▸ **runCall**(`opts`): `Promise`<`EVMResult`\>

runs a call (or create) operation.

This method modifies the state.

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`RunCallOpts`](../interfaces/runCall.RunCallOpts.md) |

#### Returns

`Promise`<`EVMResult`\>

#### Defined in

[index.ts:339](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/index.ts#L339)

___

### runCode

▸ **runCode**(`opts`): `Promise`<`ExecResult`\>

Runs EVM code.

This method modifies the state.

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`RunCodeOpts`](../interfaces/runCode.RunCodeOpts.md) |

#### Returns

`Promise`<`ExecResult`\>

#### Defined in

[index.ts:351](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/index.ts#L351)

___

### runTx

▸ **runTx**(`opts`): `Promise`<[`RunTxResult`](../interfaces/runTx.RunTxResult.md)\>

Process a transaction. Run the vm. Transfers eth. Checks balances.

This method modifies the state. If an error is thrown, the modifications are reverted, except
when the error is thrown from an event handler. In the latter case the state may or may not be
reverted.

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`RunTxOpts`](../interfaces/runTx.RunTxOpts.md) |

#### Returns

`Promise`<[`RunTxResult`](../interfaces/runTx.RunTxResult.md)\>

#### Defined in

[index.ts:327](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/index.ts#L327)

___
