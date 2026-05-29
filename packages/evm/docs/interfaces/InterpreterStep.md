[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / InterpreterStep

# Interface: InterpreterStep

Defined in: [interpreter.ts:135](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L135)

## Properties

### account

> **account**: `Account`

Defined in: [interpreter.ts:149](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L149)

***

### address

> **address**: `Address`

Defined in: [interpreter.ts:150](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L150)

***

### codeAddress

> **codeAddress**: `Address`

Defined in: [interpreter.ts:153](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L153)

***

### depth

> **depth**: `number`

Defined in: [interpreter.ts:141](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L141)

***

### eofFunctionDepth?

> `optional` **eofFunctionDepth**: `number`

Defined in: [interpreter.ts:156](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L156)

***

### eofSection?

> `optional` **eofSection**: `number`

Defined in: [interpreter.ts:154](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L154)

***

### error?

> `optional` **error**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [interpreter.ts:157](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L157)

***

### gasLeft

> **gasLeft**: `bigint`

Defined in: [interpreter.ts:136](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L136)

***

### gasRefund

> **gasRefund**: `bigint`

Defined in: [interpreter.ts:137](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L137)

***

### immediate?

> `optional` **immediate**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [interpreter.ts:155](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L155)

***

### memory

> **memory**: `Uint8Array`

Defined in: [interpreter.ts:151](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L151)

***

### memoryWordCount

> **memoryWordCount**: `bigint`

Defined in: [interpreter.ts:152](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L152)

***

### opcode

> **opcode**: `object`

Defined in: [interpreter.ts:142](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L142)

#### code

> **code**: `number`

#### dynamicFee?

> `optional` **dynamicFee**: `bigint`

#### fee

> **fee**: `number`

#### isAsync

> **isAsync**: `boolean`

#### name

> **name**: `string`

***

### pc

> **pc**: `number`

Defined in: [interpreter.ts:140](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L140)

***

### stack

> **stack**: `bigint`[]

Defined in: [interpreter.ts:139](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L139)

***

### stateManager

> **stateManager**: `StateManagerInterface`

Defined in: [interpreter.ts:138](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L138)

***

### storage?

> `optional` **storage**: \[`` `0x${string}` ``, `` `0x${string}` ``\][]

Defined in: [interpreter.ts:158](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L158)
