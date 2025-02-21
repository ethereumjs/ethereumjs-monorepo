@ethereumjs/evm

# @ethereumjs/evm

## Table of contents

### Enumerations

- [EVMErrorMessage](enums/EVMErrorMessage.md)

### Classes

- [EvmError](classes/EvmError.md)
- [Message](classes/Message.md)

### Interfaces

- [EVMInterface](interfaces/EVMInterface.md)
- [EVMOpts](interfaces/EVMOpts.md)
- [EVMResult](interfaces/EVMResult.md)
- [EVMRunCallOpts](interfaces/EVMRunCallOpts.md)
- [EVMRunCodeOpts](interfaces/EVMRunCodeOpts.md)
- [ExecResult](interfaces/ExecResult.md)
- [InterpreterStep](interfaces/InterpreterStep.md)
- [PrecompileInput](interfaces/PrecompileInput.md)
- [bn128](interfaces/bn128.md)

### Type Aliases

- [Log](README.md#log)

### Variables

- [EOF](README.md#eof)

### Functions

- [getActivePrecompiles](README.md#getactiveprecompiles)
- [getOpcodesForHF](README.md#getopcodesforhf)

## Type Aliases

### Log

Ƭ **Log**: [address: Uint8Array, topics: Uint8Array[], data: Uint8Array]

Log that the contract emits.

#### Defined in

[types.ts:337](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/types.ts#L337)

## Variables

### EOF

• `Const` **EOF**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `FORMAT` | `number` |
| `MAGIC` | `number` |
| `VERSION` | `number` |
| `codeAnalysis` | (`container`: `Uint8Array`) => `undefined` \| { `code`: `number` = 0; `data`: `number` = 0 } |
| `validOpcodes` | (`code`: `Uint8Array`) => `boolean` |

#### Defined in

[eof.ts:105](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/eof.ts#L105)

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

[precompiles/index.ts:167](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/precompiles/index.ts#L167)

___

### getOpcodesForHF

▸ **getOpcodesForHF**(`common`, `customOpcodes?`): `OpcodeContext`

Get suitable opcodes for the required hardfork.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `common` | `Common` | {Common} Ethereumjs Common metadata object. |
| `customOpcodes?` | `CustomOpcode`[] | List with custom opcodes (see EVM `customOpcodes` option description). |

#### Returns

`OpcodeContext`

Opcodes dictionary object.

#### Defined in

[opcodes/codes.ts:368](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/opcodes/codes.ts#L368)
