[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / EVMInterface

# Interface: EVMInterface

Defined in: [types.ts:160](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L160)

## Properties

### binaryTreeAccessWitness?

> `optional` **binaryTreeAccessWitness**: [`BinaryTreeAccessWitness`](../classes/BinaryTreeAccessWitness.md)

Defined in: [types.ts:183](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L183)

***

### blockLevelAccessList?

> `optional` **blockLevelAccessList**: `BlockLevelAccessList`

Defined in: [types.ts:190](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L190)

Accumulated block access list when EIP-7928 is active.

#### Remarks

Experimental (Amsterdam): may change on patch releases.

***

### common

> **common**: `Common`

Defined in: [types.ts:161](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L161)

***

### eip7928CallPostTargetOog?

> `optional` **eip7928CallPostTargetOog**: `boolean`

Defined in: [types.ts:209](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L209)

EIP-7928: set during CALL post-target OOG so `runTx` can drain the state-gas reservoir
on exceptional halt. Optional for custom EVMInterface implementations.

#### Remarks

Experimental (Amsterdam): may change on patch releases.

***

### events?

> `optional` **events**: `EventEmitter`\<`EVMEvent`, `any`\>

Defined in: [types.ts:182](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L182)

***

### executionStateGasUsed

> **executionStateGasUsed**: `bigint`

Defined in: [types.ts:202](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L202)

EIP-8037 per-tx cumulative state-gas used.

#### Remarks

Experimental (Amsterdam): may change on patch releases.

***

### journal

> **journal**: `object`

Defined in: [types.ts:162](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L162)

#### accessList?

> `optional` **accessList**: `Map`\<`string`, `Set`\<`string`\>\>

#### preimages?

> `optional` **preimages**: `Map`\<`` `0x${string}` ``, `Uint8Array`\<`ArrayBufferLike`\>\>

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

`Address`

##### Returns

`Promise`\<`void`\>

#### putAccount()

> **putAccount**(`address`, `account`): `Promise`\<`void`\>

##### Parameters

###### address

`Address`

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

Defined in: [types.ts:178](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L178)

***

### stateGasReservoir

> **stateGasReservoir**: `bigint`

Defined in: [types.ts:196](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L196)

EIP-8037 per-tx state-gas reservoir (set by `runTx`, read/written by opcodes).

#### Remarks

Experimental (Amsterdam): may change on patch releases.

***

### stateManager

> **stateManager**: `StateManagerInterface`

Defined in: [types.ts:177](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L177)

***

### systemBinaryTreeAccessWitness?

> `optional` **systemBinaryTreeAccessWitness**: [`BinaryTreeAccessWitness`](../classes/BinaryTreeAccessWitness.md)

Defined in: [types.ts:184](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L184)

## Methods

### getPrecompile()?

> `optional` **getPrecompile**(`address`): [`PrecompileFunc`](PrecompileFunc.md) \| `undefined`

Defined in: [types.ts:179](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L179)

#### Parameters

##### address

`` `0x${string}` `` | `Address`

#### Returns

[`PrecompileFunc`](PrecompileFunc.md) \| `undefined`

***

### runCall()

> **runCall**(`opts`): `Promise`\<[`EVMResult`](EVMResult.md)\>

Defined in: [types.ts:180](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L180)

#### Parameters

##### opts

[`EVMRunCallOpts`](EVMRunCallOpts.md)

#### Returns

`Promise`\<[`EVMResult`](EVMResult.md)\>

***

### runCode()

> **runCode**(`opts`): `Promise`\<[`ExecResult`](ExecResult.md)\>

Defined in: [types.ts:181](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L181)

#### Parameters

##### opts

[`EVMRunCodeOpts`](EVMRunCodeOpts.md)

#### Returns

`Promise`\<[`ExecResult`](ExecResult.md)\>
