[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / InterpreterStep

# Interface: InterpreterStep

Defined in: [interpreter.ts:181](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L181)

Payload emitted on each EVM `step` event during bytecode execution.

## Properties

### account

> **account**: `Account`

Defined in: [interpreter.ts:195](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L195)

***

### address

> **address**: `Address`

Defined in: [interpreter.ts:196](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L196)

***

### codeAddress

> **codeAddress**: `Address`

Defined in: [interpreter.ts:199](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L199)

***

### depth

> **depth**: `number`

Defined in: [interpreter.ts:187](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L187)

***

### eofFunctionDepth?

> `optional` **eofFunctionDepth?**: `number`

Defined in: [interpreter.ts:202](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L202)

***

### eofSection?

> `optional` **eofSection?**: `number`

Defined in: [interpreter.ts:200](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L200)

***

### error?

> `optional` **error?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [interpreter.ts:203](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L203)

***

### gasLeft

> **gasLeft**: `bigint`

Defined in: [interpreter.ts:182](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L182)

***

### gasRefund

> **gasRefund**: `bigint`

Defined in: [interpreter.ts:183](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L183)

***

### immediate?

> `optional` **immediate?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [interpreter.ts:201](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L201)

***

### memory

> **memory**: `Uint8Array`

Defined in: [interpreter.ts:197](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L197)

***

### memoryWordCount

> **memoryWordCount**: `bigint`

Defined in: [interpreter.ts:198](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L198)

***

### opcode

> **opcode**: `object`

Defined in: [interpreter.ts:188](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L188)

#### code

> **code**: `number`

#### dynamicFee?

> `optional` **dynamicFee?**: `bigint`

#### fee

> **fee**: `number`

#### isAsync

> **isAsync**: `boolean`

#### name

> **name**: `string`

***

### pc

> **pc**: `number`

Defined in: [interpreter.ts:186](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L186)

***

### stack

> **stack**: `bigint`[]

Defined in: [interpreter.ts:185](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L185)

***

### stateManager

> **stateManager**: `StateManagerInterface`

Defined in: [interpreter.ts:184](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L184)

***

### storage?

> `optional` **storage?**: \[`` `0x${string}` ``, `` `0x${string}` ``\][]

Defined in: [interpreter.ts:204](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L204)
