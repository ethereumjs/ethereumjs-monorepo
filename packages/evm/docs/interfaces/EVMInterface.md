[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / EVMInterface

# Interface: EVMInterface

Defined in: [types.ts:181](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L181)

Public EVM surface used by [@ethereumjs/vm!VM](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/docs/classes/VM.md) and stand-alone callers.

## Properties

### binaryTreeAccessWitness?

> `optional` **binaryTreeAccessWitness?**: [`BinaryTreeAccessWitness`](../classes/BinaryTreeAccessWitness.md)

Defined in: [types.ts:204](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L204)

***

### blockLevelAccessList?

> `optional` **blockLevelAccessList?**: `BlockLevelAccessList`

Defined in: [types.ts:211](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L211)

Accumulated block access list when EIP-7928 is active.

#### Remarks

Experimental (Amsterdam): may change on patch releases.

***

### common

> **common**: [`Common`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/classes/Common.md)

Defined in: [types.ts:182](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L182)

***

### createTxTargetAlive?

> `optional` **createTxTargetAlive?**: `boolean`

Defined in: [types.ts:246](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L246)

EIP-8037: whether the target account of a top-level creation transaction
was already alive (EIP-161 non-empty) before creation; `runTx` refunds
the intrinsic new-account state gas when true or the creation failed.
Optional for custom EVMInterface implementations.

#### Remarks

Experimental (Amsterdam): may change on patch releases.

***

### eip2780PrepOog?

> `optional` **eip2780PrepOog?**: `boolean`

Defined in: [types.ts:237](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L237)

EIP-2780 / EIP-8037: set when a top-frame access charge OOGs before opcodes.
runTx reverts prepare-region 7702 delegations when this is true.

#### Remarks

Experimental (Amsterdam): may change on patch releases.

***

### eip7928CallPostTargetOog?

> `optional` **eip7928CallPostTargetOog?**: `boolean`

Defined in: [types.ts:230](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L230)

EIP-7928: set during CALL post-target OOG so `runTx` can drain the state-gas reservoir
on exceptional halt. Optional for custom EVMInterface implementations.

#### Remarks

Experimental (Amsterdam): may change on patch releases.

***

### events?

> `optional` **events?**: `EventEmitter`\<`EVMEvent`, `any`\>

Defined in: [types.ts:203](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L203)

***

### executionStateGasUsed

> **executionStateGasUsed**: `bigint`

Defined in: [types.ts:223](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L223)

EIP-8037 per-tx cumulative state-gas used.

#### Remarks

Experimental (Amsterdam): may change on patch releases.

***

### journal

> **journal**: `object`

Defined in: [types.ts:183](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L183)

#### accessList?

> `optional` **accessList?**: `Map`\<`string`, `Set`\<`string`\>\>

#### preimages?

> `optional` **preimages?**: `Map`\<`` `0x${string}` ``, `Uint8Array`\<`ArrayBufferLike`\>\>

#### addAlwaysWarmAddress()

> **addAlwaysWarmAddress**(`address`, `addToAccessList?`): `void`

##### Parameters

###### address

`string`

###### addToAccessList?

`boolean`

##### Returns

`void`

#### addAlwaysWarmSlot()

> **addAlwaysWarmSlot**(`address`, `slot`, `addToAccessList?`): `void`

##### Parameters

###### address

`string`

###### slot

`string`

###### addToAccessList?

`boolean`

##### Returns

`void`

#### checkpoint()

> **checkpoint**(): `Promise`\<`void`\>

##### Returns

`Promise`\<`void`\>

#### cleanJournal()

> **cleanJournal**(): `void`

##### Returns

`void`

#### cleanup()

> **cleanup**(): `Promise`\<`void`\>

##### Returns

`Promise`\<`void`\>

#### commit()

> **commit**(): `Promise`\<`void`\>

##### Returns

`Promise`\<`void`\>

#### deleteAccount()

> **deleteAccount**(`address`): `Promise`\<`void`\>

##### Parameters

###### address

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

##### Returns

`Promise`\<`void`\>

#### putAccount()

> **putAccount**(`address`, `account`): `Promise`\<`void`\>

##### Parameters

###### address

[`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

###### account

`Account`

##### Returns

`Promise`\<`void`\>

#### revert()

> **revert**(): `Promise`\<`void`\>

##### Returns

`Promise`\<`void`\>

#### startReportingAccessList()

> **startReportingAccessList**(): `void`

##### Returns

`void`

#### startReportingPreimages()?

> `optional` **startReportingPreimages**(): `void`

##### Returns

`void`

***

### precompiles

> **precompiles**: `Map`\<`string`, [`PrecompileFunc`](PrecompileFunc.md)\>

Defined in: [types.ts:199](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L199)

***

### stateGasReservoir

> **stateGasReservoir**: `bigint`

Defined in: [types.ts:217](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L217)

EIP-8037 per-tx state-gas reservoir (set by `runTx`, read/written by opcodes).

#### Remarks

Experimental (Amsterdam): may change on patch releases.

***

### stateManager

> **stateManager**: [`StateManagerInterface`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/interfaces/StateManagerInterface.md)

Defined in: [types.ts:198](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L198)

***

### systemBinaryTreeAccessWitness?

> `optional` **systemBinaryTreeAccessWitness?**: [`BinaryTreeAccessWitness`](../classes/BinaryTreeAccessWitness.md)

Defined in: [types.ts:205](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L205)

## Methods

### getPrecompile()?

> `optional` **getPrecompile**(`address`): [`PrecompileFunc`](PrecompileFunc.md) \| `undefined`

Defined in: [types.ts:200](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L200)

#### Parameters

##### address

`` `0x${string}` `` \| [`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

#### Returns

[`PrecompileFunc`](PrecompileFunc.md) \| `undefined`

***

### runCall()

> **runCall**(`opts`): `Promise`\<[`EVMResult`](EVMResult.md)\>

Defined in: [types.ts:201](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L201)

#### Parameters

##### opts

[`EVMRunCallOpts`](EVMRunCallOpts.md)

#### Returns

`Promise`\<[`EVMResult`](EVMResult.md)\>

***

### runCode()

> **runCode**(`opts`): `Promise`\<[`ExecResult`](ExecResult.md)\>

Defined in: [types.ts:202](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L202)

#### Parameters

##### opts

[`EVMRunCodeOpts`](EVMRunCodeOpts.md)

#### Returns

`Promise`\<[`ExecResult`](ExecResult.md)\>
