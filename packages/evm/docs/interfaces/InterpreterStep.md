[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / InterpreterStep

# Interface: InterpreterStep

Defined in: [interpreter.ts:175](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L175)

Payload emitted on each EVM `step` event during bytecode execution.

## Properties

### account

> **account**: `Account`

Defined in: [interpreter.ts:189](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L189)

***

### address

> **address**: [`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

Defined in: [interpreter.ts:190](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L190)

***

### codeAddress

> **codeAddress**: [`Address`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/util/docs/classes/Address.md)

Defined in: [interpreter.ts:193](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L193)

***

### depth

> **depth**: `number`

Defined in: [interpreter.ts:181](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L181)

***

### error?

> `optional` **error?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [interpreter.ts:195](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L195)

***

### gasLeft

> **gasLeft**: `bigint`

Defined in: [interpreter.ts:176](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L176)

***

### gasRefund

> **gasRefund**: `bigint`

Defined in: [interpreter.ts:177](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L177)

***

### immediate?

> `optional` **immediate?**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [interpreter.ts:194](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L194)

***

### memory

> **memory**: `Uint8Array`

Defined in: [interpreter.ts:191](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L191)

***

### memoryWordCount

> **memoryWordCount**: `bigint`

Defined in: [interpreter.ts:192](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L192)

***

### opcode

> **opcode**: `object`

Defined in: [interpreter.ts:182](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L182)

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

Defined in: [interpreter.ts:180](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L180)

***

### stack

> **stack**: `bigint`[]

Defined in: [interpreter.ts:179](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L179)

***

### stateManager

> **stateManager**: [`StateManagerInterface`](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/common/docs/interfaces/StateManagerInterface.md)

Defined in: [interpreter.ts:178](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L178)

***

### storage?

> `optional` **storage?**: \[`` `0x${string}` ``, `` `0x${string}` ``\][]

Defined in: [interpreter.ts:196](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L196)
