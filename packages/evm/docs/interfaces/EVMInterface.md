[@ethereumjs/evm](../README.md) / EVMInterface

# Interface: EVMInterface

API of the EVM

## Table of contents

### Properties

- [eei](EVMInterface.md#eei)
- [precompiles](EVMInterface.md#precompiles)

### Methods

- [copy](EVMInterface.md#copy)
- [runCall](EVMInterface.md#runcall)
- [runCode](EVMInterface.md#runcode)

## Properties

### eei

• **eei**: [`EEIInterface`](EEIInterface.md)

#### Defined in

[packages/evm/src/types.ts:17](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L17)

___

### precompiles

• **precompiles**: `Map`<`string`, `any`\>

#### Defined in

[packages/evm/src/types.ts:15](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L15)

## Methods

### copy

▸ **copy**(): [`EVMInterface`](EVMInterface.md)

#### Returns

[`EVMInterface`](EVMInterface.md)

#### Defined in

[packages/evm/src/types.ts:16](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L16)

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

[packages/evm/src/types.ts:13](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L13)

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

[packages/evm/src/types.ts:14](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L14)
