[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / EVMInterface

# Interface: EVMInterface

Defined in: [types.ts:158](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L158)

## Properties

### binaryTreeAccessWitness?

> `optional` **binaryTreeAccessWitness**: [`BinaryTreeAccessWitness`](../classes/BinaryTreeAccessWitness.md)

Defined in: [types.ts:180](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L180)

***

### common

> **common**: `Common`

Defined in: [types.ts:159](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L159)

***

### events?

> `optional` **events**: `EventEmitter`\<`EVMEvent`, `any`\>

Defined in: [types.ts:179](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L179)

***

### journal

> **journal**: `object`

Defined in: [types.ts:160](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L160)

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

> **precompiles**: `Map`\<`string`, `PrecompileFunc`\>

Defined in: [types.ts:176](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L176)

***

### stateManager

> **stateManager**: `StateManagerInterface`

Defined in: [types.ts:175](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L175)

***

### systemBinaryTreeAccessWitness?

> `optional` **systemBinaryTreeAccessWitness**: [`BinaryTreeAccessWitness`](../classes/BinaryTreeAccessWitness.md)

Defined in: [types.ts:181](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L181)

## Methods

### runCall()

> **runCall**(`opts`): `Promise`\<[`EVMResult`](EVMResult.md)\>

Defined in: [types.ts:177](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L177)

#### Parameters

##### opts

[`EVMRunCallOpts`](EVMRunCallOpts.md)

#### Returns

`Promise`\<[`EVMResult`](EVMResult.md)\>

***

### runCode()

> **runCode**(`opts`): `Promise`\<[`ExecResult`](ExecResult.md)\>

Defined in: [types.ts:178](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L178)

#### Parameters

##### opts

[`EVMRunCodeOpts`](EVMRunCodeOpts.md)

#### Returns

`Promise`\<[`ExecResult`](ExecResult.md)\>
