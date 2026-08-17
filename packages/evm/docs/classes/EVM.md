[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / EVM

# Class: EVM

Defined in: [evm.ts:167](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L167)

The EVM (Ethereum Virtual Machine) is responsible for executing EVM bytecode, processing transactions, and managing state changes. It handles both contract calls and contract creation operations.

An EVM instance can be created with the constructor method:

- [createEVM](../functions/createEVM.md)

## Implements

- [`EVMInterface`](../interfaces/EVMInterface.md)

## Constructors

### Constructor

> **new EVM**(`opts`): `EVM`

Defined in: [evm.ts:340](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L340)

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

Defined in: [evm.ts:215](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L215)

***

### allowUnlimitedInitCodeSize

> `readonly` **allowUnlimitedInitCodeSize**: `boolean`

Defined in: [evm.ts:216](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L216)

***

### binaryAccessWitness?

> `optional` **binaryAccessWitness**: [`BinaryTreeAccessWitness`](BinaryTreeAccessWitness.md)

Defined in: [evm.ts:208](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L208)

***

### blockchain

> **blockchain**: [`EVMMockBlockchainInterface`](../interfaces/EVMMockBlockchainInterface.md)

Defined in: [evm.ts:206](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L206)

***

### blockLevelAccessList?

> `readonly` `optional` **blockLevelAccessList**: `BlockLevelAccessList`

Defined in: [evm.ts:223](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L223)

Accumulated block access list when EIP-7928 is active.

#### Remarks

Experimental (Amsterdam): may change on patch releases.

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`blockLevelAccessList`](../interfaces/EVMInterface.md#blocklevelaccesslist)

***

### common

> `readonly` **common**: `Common`

Defined in: [evm.ts:202](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L202)

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`common`](../interfaces/EVMInterface.md#common)

***

### createdAccountIntrinsicStateGas

> **createdAccountIntrinsicStateGas**: `Map`\<`` `0x${string}` ``, `bigint`\>

Defined in: [evm.ts:288](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L288)

EIP-8037 (v7): intrinsic state-gas tracking for depth=0 creation
transactions. The intrinsic stateBytesPerNewAccount * costPerStateByte
is paid up-front in runTx and isn't part of stateGasCreate. On a same-tx
SELFDESTRUCT of the freshly-created contract, runTx refunds the STATE
dimension only (decrement execution_state_gas_used) — the reservoir is
NOT credited, so the user still pays the gross intrinsic. This realizes
the v7 spec note "tx doesn't over charge for an account that never
persists" at the block_state_gas_used level.

***

### createdAccountStateGas

> **createdAccountStateGas**: `Map`\<`` `0x${string}` ``, `bigint`\>

Defined in: [evm.ts:277](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L277)

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

### eip7928CallPostTargetOog

> **eip7928CallPostTargetOog**: `boolean` = `false`

Defined in: [evm.ts:249](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L249)

EIP-7928 CALL post-state OOG: set while handling post-target access failure so
`runTx` drains the state-gas reservoir and the sender pays the full tx gas limit.

#### Remarks

Experimental (Amsterdam): may change on patch releases.

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`eip7928CallPostTargetOog`](../interfaces/EVMInterface.md#eip7928callposttargetoog)

***

### events

> `readonly` **events**: `EventEmitter`\<`EVMEvent`\>

Defined in: [evm.ts:203](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L203)

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`events`](../interfaces/EVMInterface.md#events)

***

### executionStateGasUsed

> **executionStateGasUsed**: `bigint` = `BIGINT_0`

Defined in: [evm.ts:242](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L242)

EIP-8037 cumulative state-gas used by the current transaction.

#### Remarks

Experimental (Amsterdam): may change on patch releases.

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`executionStateGasUsed`](../interfaces/EVMInterface.md#executionstategasused)

***

### journal

> **journal**: `Journal`

Defined in: [evm.ts:207](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L207)

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`journal`](../interfaces/EVMInterface.md#journal)

***

### stateGasReservoir

> **stateGasReservoir**: `bigint` = `BIGINT_0`

Defined in: [evm.ts:236](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L236)

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

Defined in: [evm.ts:205](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L205)

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`stateManager`](../interfaces/EVMInterface.md#statemanager)

***

### systemBinaryAccessWitness?

> `optional` **systemBinaryAccessWitness**: [`BinaryTreeAccessWitness`](BinaryTreeAccessWitness.md)

Defined in: [evm.ts:209](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L209)

***

### transientStorage

> `readonly` **transientStorage**: `TransientStorage`

Defined in: [evm.ts:211](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L211)

## Accessors

### opcodes

#### Get Signature

> **get** **opcodes**(): `OpcodeList`

Defined in: [evm.ts:309](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L309)

##### Returns

`OpcodeList`

***

### precompiles

#### Get Signature

> **get** **precompiles**(): `Map`\<`string`, [`PrecompileFunc`](../interfaces/PrecompileFunc.md)\>

Defined in: [evm.ts:305](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L305)

##### Returns

`Map`\<`string`, [`PrecompileFunc`](../interfaces/PrecompileFunc.md)\>

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`precompiles`](../interfaces/EVMInterface.md#precompiles)

## Methods

### clearPerformanceLogs()

> **clearPerformanceLogs**(): `void`

Defined in: [evm.ts:1638](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L1638)

#### Returns

`void`

***

### getActiveOpcodes()

> **getActiveOpcodes**(): `OpcodeList`

Defined in: [evm.ts:434](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L434)

Returns a list with the currently activated opcodes
available for EVM execution

#### Returns

`OpcodeList`

***

### getPerformanceLogs()

> **getPerformanceLogs**(): `object`

Defined in: [evm.ts:1634](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L1634)

#### Returns

`object`

##### opcodes

> **opcodes**: [`EVMPerformanceLogOutput`](../type-aliases/EVMPerformanceLogOutput.md)[]

##### precompiles

> **precompiles**: [`EVMPerformanceLogOutput`](../type-aliases/EVMPerformanceLogOutput.md)[]

***

### getPrecompile()

> **getPrecompile**(`address`): [`PrecompileFunc`](../interfaces/PrecompileFunc.md) \| `undefined`

Defined in: [evm.ts:1479](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L1479)

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

`` `0x${string}` `` | `Address`

#### Returns

[`PrecompileFunc`](../interfaces/PrecompileFunc.md) \| `undefined`

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`getPrecompile`](../interfaces/EVMInterface.md#getprecompile)

***

### runCall()

> **runCall**(`opts`): `Promise`\<[`EVMResult`](../interfaces/EVMResult.md)\>

Defined in: [evm.ts:1209](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L1209)

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

Defined in: [evm.ts:1442](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L1442)

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

Defined in: [evm.ts:1620](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L1620)

This method copies the EVM, current HF and EIP settings
and returns a new EVM instance.

Note: this is only a shallow copy and both EVM instances
will point to the same underlying state DB.

#### Returns

`EVM`

EVM
