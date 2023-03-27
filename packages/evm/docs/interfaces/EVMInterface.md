[@ethereumjs/evm](../README.md) / EVMInterface

# Interface: EVMInterface

API of the EVM

## Table of contents

### Properties

- [eei](EVMInterface.md#eei)
- [events](EVMInterface.md#events)
- [precompiles](EVMInterface.md#precompiles)

### Methods

- [copy](EVMInterface.md#copy)
- [getActiveOpcodes](EVMInterface.md#getactiveopcodes)
- [runCall](EVMInterface.md#runcall)
- [runCode](EVMInterface.md#runcode)

## Properties

### eei

• **eei**: [`EEIInterface`](EEIInterface.md)

#### Defined in

[types.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L17)

___

### events

• `Optional` **events**: `AsyncEventEmitter`<`EVMEvents`\>

#### Defined in

[types.ts:18](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L18)

___

### precompiles

• **precompiles**: `Map`<`string`, `any`\>

#### Defined in

[types.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L15)

## Methods

### copy

▸ **copy**(): [`EVMInterface`](EVMInterface.md)

#### Returns

[`EVMInterface`](EVMInterface.md)

#### Defined in

[types.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L16)

___

### getActiveOpcodes

▸ `Optional` **getActiveOpcodes**(): `OpcodeList`

#### Returns

`OpcodeList`

#### Defined in

[types.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L14)

___

### runCall

▸ **runCall**(`opts`): `Promise`<[`EVMResult`](EVMResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `EVMRunCallOpts` |

#### Returns

`Promise`<[`EVMResult`](EVMResult.md)\>

#### Defined in

[types.ts:12](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L12)

___

### runCode

▸ `Optional` **runCode**(`opts`): `Promise`<[`ExecResult`](ExecResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | `EVMRunCodeOpts` |

#### Returns

`Promise`<[`ExecResult`](ExecResult.md)\>

#### Defined in

[types.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L13)
