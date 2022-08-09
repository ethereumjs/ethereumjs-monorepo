@ethereumjs/evm

# @ethereumjs/evm

## Table of contents

### Enumerations

- [EvmErrorMessage](enums/EvmErrorMessage.md)

### Classes

- [EvmError](classes/EvmError.md)
- [Message](classes/Message.md)

### Interfaces

- [EEIInterface](interfaces/EEIInterface.md)
- [EVMInterface](interfaces/EVMInterface.md)
- [EVMResult](interfaces/EVMResult.md)
- [EVMStateAccess](interfaces/EVMStateAccess.md)
- [ExecResult](interfaces/ExecResult.md)
- [InterpreterStep](interfaces/InterpreterStep.md)

### Type Aliases

- [Log](README.md#log)

### Functions

- [getActivePrecompiles](README.md#getactiveprecompiles)

## Type Aliases

### Log

Ƭ **Log**: [address: Buffer, topics: Buffer[], data: Buffer]

Log that the contract emits.

#### Defined in

[packages/evm/src/types.ts:224](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L224)

## Functions

### getActivePrecompiles

▸ **getActivePrecompiles**(`common`, `customPrecompiles?`): `Map`<`string`, `PrecompileFunc`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `common` | `Common` |
| `customPrecompiles?` | `CustomPrecompile`[] |

#### Returns

`Map`<`string`, `PrecompileFunc`\>

#### Defined in

[packages/evm/src/precompiles/index.ts:175](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/index.ts#L175)
