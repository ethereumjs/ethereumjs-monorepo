[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / EVM

# Class: EVM

Defined in: [evm.ts:171](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L171)

The EVM (Ethereum Virtual Machine) is responsible for executing EVM bytecode, processing transactions, and managing state changes. It handles both contract calls and contract creation operations.

An EVM instance can be created with the constructor method:

- [createEVM](../functions/createEVM.md)

## Implements

- [`EVMInterface`](../interfaces/EVMInterface.md)

## Constructors

### Constructor

> **new EVM**(`opts`): `EVM`

Defined in: [evm.ts:356](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L356)

Creates new EVM object

#### Parameters

##### opts

[`EVMOpts`](../interfaces/EVMOpts.md)

The EVM options

#### Returns

`EVM`

#### Deprecated

The direct usage of this constructor is replaced since
non-finalized async initialization lead to side effects. Please
use the async [createEVM](../functions/createEVM.md) constructor instead (same API).

## Properties

### allowUnlimitedContractSize

> `readonly` **allowUnlimitedContractSize**: `boolean`

Defined in: [evm.ts:219](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L219)

***

### allowUnlimitedInitCodeSize

> `readonly` **allowUnlimitedInitCodeSize**: `boolean`

Defined in: [evm.ts:220](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L220)

***

### binaryAccessWitness?

> `optional` **binaryAccessWitness?**: [`BinaryTreeAccessWitness`](BinaryTreeAccessWitness.md)

Defined in: [evm.ts:212](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L212)

***

### blockchain

> **blockchain**: [`EVMMockBlockchainInterface`](../interfaces/EVMMockBlockchainInterface.md)

Defined in: [evm.ts:210](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L210)

***

### blockLevelAccessList?

> `readonly` `optional` **blockLevelAccessList?**: `BlockLevelAccessList`

Defined in: [evm.ts:227](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L227)

Accumulated block access list when EIP-7928 is active.

#### Remarks

Experimental (Amsterdam): may change on patch releases.

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`blockLevelAccessList`](../interfaces/EVMInterface.md#blocklevelaccesslist)

***

### common

> `readonly` **common**: `Common`

Defined in: [evm.ts:206](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L206)

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`common`](../interfaces/EVMInterface.md#common)

***

### createdAccountIntrinsicStateGas

> **createdAccountIntrinsicStateGas**: `Map`\<`` `0x${string}` ``, `bigint`\>

Defined in: [evm.ts:304](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L304)

EIP-8037 (v7): previously tracked intrinsic new-account state gas for
depth=0 creation txs. New-account state gas is now charged at access
(same map as inner CREATE: `createdAccountStateGas`). Kept for API
compatibility; reset per tx, not written on the v7 path.

***

### createdAccountStateGas

> **createdAccountStateGas**: `Map`\<`` `0x${string}` ``, `bigint`\>

Defined in: [evm.ts:297](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L297)

EIP-8037 SELFDESTRUCT deferred refund support.
Per-address record of the state-gas charged for account creation
(stateBytesPerNewAccount × costPerStateByte) plus code deposit
(L × costPerStateByte) at successful CREATE/CREATE2 frame exit.
Reset at the start of each tx and consulted by runTx to refund
state-gas for accounts that were both created and SELFDESTRUCTed
in the same tx (per EIP-6780 + EIP-8037).
Storage-slot state-gas is not tracked here yet; that is a separate
follow-up.

***

### createTxTargetAlive

> **createTxTargetAlive**: `boolean` = `false`

Defined in: [evm.ts:269](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L269)

EIP-8037: whether the target account of a top-level creation transaction
was already alive (EIP-161 non-empty) before creation. runTx refunds the
intrinsic new-account state gas when this is true or the creation failed.

#### Remarks

Experimental (Amsterdam): may change on patch releases.

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`createTxTargetAlive`](../interfaces/EVMInterface.md#createtxtargetalive)

***

### eip2780PrepOog

> **eip2780PrepOog**: `boolean` = `false`

Defined in: [evm.ts:261](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L261)

EIP-2780 / EIP-8037: set when a top-frame access charge (new-account
state or 7702 delegation resolution) OOGs before opcodes run. runTx uses this to
revert 7702 delegations applied in the prepare region.

#### Remarks

Experimental (Amsterdam): may change on patch releases.

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`eip2780PrepOog`](../interfaces/EVMInterface.md#eip2780prepoog)

***

### eip7928CallPostTargetOog

> **eip7928CallPostTargetOog**: `boolean` = `false`

Defined in: [evm.ts:253](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L253)

EIP-7928 CALL post-state OOG: set while handling post-target access failure so
`runTx` drains the state-gas reservoir and the sender pays the full tx gas limit.

#### Remarks

Experimental (Amsterdam): may change on patch releases.

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`eip7928CallPostTargetOog`](../interfaces/EVMInterface.md#eip7928callposttargetoog)

***

### events

> `readonly` **events**: `EventEmitter`\<`EVMEvent`\>

Defined in: [evm.ts:207](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L207)

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`events`](../interfaces/EVMInterface.md#events)

***

### executionStateGasUsed

> **executionStateGasUsed**: `bigint` = `BIGINT_0`

Defined in: [evm.ts:246](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L246)

EIP-8037 cumulative state-gas used by the current transaction.

#### Remarks

Experimental (Amsterdam): may change on patch releases.

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`executionStateGasUsed`](../interfaces/EVMInterface.md#executionstategasused)

***

### journal

> **journal**: `Journal`

Defined in: [evm.ts:211](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L211)

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`journal`](../interfaces/EVMInterface.md#journal)

***

### stateGasReservoir

> **stateGasReservoir**: `bigint` = `BIGINT_0`

Defined in: [evm.ts:240](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L240)

EIP-8037 transaction-level state-gas reservoir.
Holds gas paid by the user that exceeds the EIP-7825 regular-gas budget
and is reserved exclusively for state-creation charges. State-gas charges
draw from `stateGasReservoir` first; once exhausted, they fall through to
the regular `gasLeft`. Refunds (revert / exceptional halt / SELFDESTRUCT
of same-tx-created accounts) refill it.
Initialized by `runTx` at the start of each transaction; `0` when EIP-8037 is inactive.

#### Remarks

Experimental (Amsterdam): may change on patch releases.

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`stateGasReservoir`](../interfaces/EVMInterface.md#stategasreservoir)

***

### stateManager

> **stateManager**: `StateManagerInterface`

Defined in: [evm.ts:209](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L209)

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`stateManager`](../interfaces/EVMInterface.md#statemanager)

***

### systemBinaryAccessWitness?

> `optional` **systemBinaryAccessWitness?**: [`BinaryTreeAccessWitness`](BinaryTreeAccessWitness.md)

Defined in: [evm.ts:213](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L213)

***

### transientStorage

> `readonly` **transientStorage**: `TransientStorage`

Defined in: [evm.ts:215](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L215)

## Accessors

### opcodes

#### Get Signature

> **get** **opcodes**(): `OpcodeList`

Defined in: [evm.ts:325](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L325)

##### Returns

`OpcodeList`

***

### precompiles

#### Get Signature

> **get** **precompiles**(): `Map`\<`string`, [`PrecompileFunc`](../interfaces/PrecompileFunc.md)\>

Defined in: [evm.ts:321](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L321)

##### Returns

`Map`\<`string`, [`PrecompileFunc`](../interfaces/PrecompileFunc.md)\>

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`precompiles`](../interfaces/EVMInterface.md#precompiles)

## Methods

### clearPerformanceLogs()

> **clearPerformanceLogs**(): `void`

Defined in: [evm.ts:1740](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L1740)

#### Returns

`void`

***

### getActiveOpcodes()

> **getActiveOpcodes**(): `OpcodeList`

Defined in: [evm.ts:450](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L450)

Returns a list with the currently activated opcodes
available for EVM execution

#### Returns

`OpcodeList`

***

### getPerformanceLogs()

> **getPerformanceLogs**(): `object`

Defined in: [evm.ts:1736](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L1736)

#### Returns

`object`

##### opcodes

> **opcodes**: [`EVMPerformanceLogOutput`](../type-aliases/EVMPerformanceLogOutput.md)[]

##### precompiles

> **precompiles**: [`EVMPerformanceLogOutput`](../type-aliases/EVMPerformanceLogOutput.md)[]

***

### getPrecompile()

> **getPrecompile**(`address`): [`PrecompileFunc`](../interfaces/PrecompileFunc.md) \| `undefined`

Defined in: [evm.ts:1583](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L1583)

Returns the precompile function registered at the given address,
or `undefined` if no precompile is active there.

Accepts either an `Address` instance or a `0x`-prefixed hex string.

```ts
const evm = await createEVM({
  customPrecompiles: [{ address: '0x000000000000000000000000000000000000ff01', function: myFn }],
})
const fn = evm.getPrecompile('0x000000000000000000000000000000000000ff01')
```

#### Parameters

##### address

`` `0x${string}` `` \| `Address`

#### Returns

[`PrecompileFunc`](../interfaces/PrecompileFunc.md) \| `undefined`

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`getPrecompile`](../interfaces/EVMInterface.md#getprecompile)

***

### runCall()

> **runCall**(`opts`): `Promise`\<[`EVMResult`](../interfaces/EVMResult.md)\>

Defined in: [evm.ts:1328](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L1328)

Executes an EVM message, determining whether it's a call or create
based on the `to` address. It checkpoints the state and reverts changes
if an exception happens during the message execution.

#### Parameters

##### opts

[`EVMRunCallOpts`](../interfaces/EVMRunCallOpts.md)

#### Returns

`Promise`\<[`EVMResult`](../interfaces/EVMResult.md)\>

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`runCall`](../interfaces/EVMInterface.md#runcall)

***

### runCode()

> **runCode**(`opts`): `Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

Defined in: [evm.ts:1546](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L1546)

Bound to the global VM and therefore
shouldn't be used directly from the evm class

#### Parameters

##### opts

[`EVMRunCodeOpts`](../interfaces/EVMRunCodeOpts.md)

#### Returns

`Promise`\<[`ExecResult`](../interfaces/ExecResult.md)\>

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`runCode`](../interfaces/EVMInterface.md#runcode)

***

### shallowCopy()

> **shallowCopy**(): `EVM`

Defined in: [evm.ts:1722](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L1722)

This method copies the EVM, current HF and EIP settings
and returns a new EVM instance.

Note: this is only a shallow copy and both EVM instances
will point to the same underlying state DB.

#### Returns

`EVM`
