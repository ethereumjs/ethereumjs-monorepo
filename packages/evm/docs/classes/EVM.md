[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / EVM

# Class: EVM

Defined in: [evm.ts:133](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L133)

The EVM (Ethereum Virtual Machine) is responsible for executing EVM bytecode, processing transactions, and managing state changes. It handles both contract calls and contract creation operations.

An EVM instance can be created with the constructor method:

* [createEVM](../functions/createEVM.md)

## Implements

- [`EVMInterface`](../interfaces/EVMInterface.md)

## Constructors

### Constructor

> **new EVM**(`opts`): `EVM`

Defined in: [evm.ts:231](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L231)

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

Defined in: [evm.ts:178](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L178)

***

### allowUnlimitedInitCodeSize

> `readonly` **allowUnlimitedInitCodeSize**: `boolean`

Defined in: [evm.ts:179](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L179)

***

### binaryAccessWitness?

> `optional` **binaryAccessWitness**: [`BinaryTreeAccessWitness`](BinaryTreeAccessWitness.md)

Defined in: [evm.ts:171](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L171)

***

### blockchain

> **blockchain**: [`EVMMockBlockchainInterface`](../interfaces/EVMMockBlockchainInterface.md)

Defined in: [evm.ts:167](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L167)

***

### common

> `readonly` **common**: `Common`

Defined in: [evm.ts:163](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L163)

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`common`](../interfaces/EVMInterface.md#common)

***

### events

> `readonly` **events**: `EventEmitter`\<`EVMEvent`\>

Defined in: [evm.ts:164](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L164)

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`events`](../interfaces/EVMInterface.md#events)

***

### journal

> **journal**: `Journal`

Defined in: [evm.ts:168](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L168)

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`journal`](../interfaces/EVMInterface.md#journal)

***

### stateManager

> **stateManager**: `StateManagerInterface`

Defined in: [evm.ts:166](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L166)

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`stateManager`](../interfaces/EVMInterface.md#statemanager)

***

### systemBinaryAccessWitness?

> `optional` **systemBinaryAccessWitness**: [`BinaryTreeAccessWitness`](BinaryTreeAccessWitness.md)

Defined in: [evm.ts:172](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L172)

***

### systemVerkleAccessWitness?

> `optional` **systemVerkleAccessWitness**: [`VerkleAccessWitness`](VerkleAccessWitness.md)

Defined in: [evm.ts:170](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L170)

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`systemVerkleAccessWitness`](../interfaces/EVMInterface.md#systemverkleaccesswitness)

***

### transientStorage

> `readonly` **transientStorage**: `TransientStorage`

Defined in: [evm.ts:174](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L174)

***

### verkleAccessWitness?

> `optional` **verkleAccessWitness**: [`VerkleAccessWitness`](VerkleAccessWitness.md)

Defined in: [evm.ts:169](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L169)

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`verkleAccessWitness`](../interfaces/EVMInterface.md#verkleaccesswitness)

## Accessors

### opcodes

#### Get Signature

> **get** **opcodes**(): `OpcodeList`

Defined in: [evm.ts:200](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L200)

##### Returns

`OpcodeList`

***

### precompiles

#### Get Signature

> **get** **precompiles**(): `Map`\<`string`, `PrecompileFunc`\>

Defined in: [evm.ts:196](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L196)

##### Returns

`Map`\<`string`, `PrecompileFunc`\>

#### Implementation of

[`EVMInterface`](../interfaces/EVMInterface.md).[`precompiles`](../interfaces/EVMInterface.md#precompiles)

## Methods

### clearPerformanceLogs()

> **clearPerformanceLogs**(): `void`

Defined in: [evm.ts:1219](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L1219)

#### Returns

`void`

***

### getActiveOpcodes()

> **getActiveOpcodes**(): `OpcodeList`

Defined in: [evm.ts:321](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L321)

Returns a list with the currently activated opcodes
available for EVM execution

#### Returns

`OpcodeList`

***

### getPerformanceLogs()

> **getPerformanceLogs**(): `object`

Defined in: [evm.ts:1215](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L1215)

#### Returns

`object`

##### opcodes

> **opcodes**: [`EVMPerformanceLogOutput`](../type-aliases/EVMPerformanceLogOutput.md)[]

##### precompiles

> **precompiles**: [`EVMPerformanceLogOutput`](../type-aliases/EVMPerformanceLogOutput.md)[]

***

### getPrecompile()

> **getPrecompile**(`address`): `undefined` \| `PrecompileFunc`

Defined in: [evm.ts:1090](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L1090)

Returns code for precompile at the given address, or undefined
if no such precompile exists.

#### Parameters

##### address

`Address`

#### Returns

`undefined` \| `PrecompileFunc`

***

### runCall()

> **runCall**(`opts`): `Promise`\<[`EVMResult`](../interfaces/EVMResult.md)\>

Defined in: [evm.ts:911](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L911)

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

Defined in: [evm.ts:1062](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L1062)

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

Defined in: [evm.ts:1201](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/evm.ts#L1201)

This method copies the EVM, current HF and EIP settings
and returns a new EVM instance.

Note: this is only a shallow copy and both EVM instances
will point to the same underlying state DB.

#### Returns

`EVM`

EVM
