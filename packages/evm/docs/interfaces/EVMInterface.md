[@ethereumjs/evm](../README.md) / EVMInterface

# Interface: EVMInterface

## Table of contents

### Properties

- [events](EVMInterface.md#events)
- [journal](EVMInterface.md#journal)
- [precompiles](EVMInterface.md#precompiles)
- [stateManager](EVMInterface.md#statemanager)

### Methods

- [runCall](EVMInterface.md#runcall)
- [runCode](EVMInterface.md#runcode)

## Properties

### events

• `Optional` **events**: `AsyncEventEmitter`<`EVMEvents`\>

#### Defined in

[types.ts:163](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L163)

___

### journal

• **journal**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `accessList?` | `Map`<`string`, `Set`<`string`\>\> |
| `preimages?` | `Map`<`string`, `Uint8Array`\> |
| `addAlwaysWarmAddress` | (`address`: `string`, `addToAccessList?`: `boolean`) => `void` |
| `addAlwaysWarmSlot` | (`address`: `string`, `slot`: `string`, `addToAccessList?`: `boolean`) => `void` |
| `checkpoint` | () => `Promise`<`void`\> |
| `cleanJournal` | () => `void` |
| `cleanup` | () => `Promise`<`void`\> |
| `commit` | () => `Promise`<`void`\> |
| `deleteAccount` | (`address`: `Address`) => `Promise`<`void`\> |
| `putAccount` | (`address`: `Address`, `account`: `Account`) => `Promise`<`void`\> |
| `revert` | () => `Promise`<`void`\> |
| `startReportingAccessList` | () => `void` |
| `startReportingPreimages?` | () => `void` |

#### Defined in

[types.ts:144](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L144)

___

### precompiles

• **precompiles**: `Map`<`string`, `PrecompileFunc`\>

#### Defined in

[types.ts:160](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L160)

___

### stateManager

• **stateManager**: `EVMStateManagerInterface`

#### Defined in

[types.ts:159](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L159)

## Methods

### runCall

▸ **runCall**(`opts`): `Promise`<[`EVMResult`](EVMResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`EVMRunCallOpts`](EVMRunCallOpts.md) |

#### Returns

`Promise`<[`EVMResult`](EVMResult.md)\>

#### Defined in

[types.ts:161](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L161)

___

### runCode

▸ **runCode**(`opts`): `Promise`<[`ExecResult`](ExecResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`EVMRunCodeOpts`](EVMRunCodeOpts.md) |

#### Returns

`Promise`<[`ExecResult`](ExecResult.md)\>

#### Defined in

[types.ts:162](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L162)
