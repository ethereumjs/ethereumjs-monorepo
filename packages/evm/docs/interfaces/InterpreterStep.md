[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / InterpreterStep

# Interface: InterpreterStep

Defined in: [interpreter.ts:118](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L118)

## Properties

### account

> **account**: `Account`

Defined in: [interpreter.ts:132](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L132)

***

### address

> **address**: `Address`

Defined in: [interpreter.ts:133](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L133)

***

### codeAddress

> **codeAddress**: `Address`

Defined in: [interpreter.ts:136](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L136)

***

### depth

> **depth**: `number`

Defined in: [interpreter.ts:124](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L124)

***

### eofFunctionDepth?

> `optional` **eofFunctionDepth**: `number`

Defined in: [interpreter.ts:139](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L139)

***

### eofSection?

> `optional` **eofSection**: `number`

Defined in: [interpreter.ts:137](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L137)

***

### error?

> `optional` **error**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [interpreter.ts:140](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L140)

***

### gasLeft

> **gasLeft**: `bigint`

Defined in: [interpreter.ts:119](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L119)

***

### gasRefund

> **gasRefund**: `bigint`

Defined in: [interpreter.ts:120](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L120)

***

### immediate?

> `optional` **immediate**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [interpreter.ts:138](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L138)

***

### memory

> **memory**: `Uint8Array`

Defined in: [interpreter.ts:134](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L134)

***

### memoryWordCount

> **memoryWordCount**: `bigint`

Defined in: [interpreter.ts:135](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L135)

***

### opcode

> **opcode**: `object`

Defined in: [interpreter.ts:125](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L125)

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

Defined in: [interpreter.ts:123](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L123)

***

### stack

> **stack**: `bigint`[]

Defined in: [interpreter.ts:122](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L122)

***

### stateManager

> **stateManager**: `StateManagerInterface`

Defined in: [interpreter.ts:121](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L121)

***

### storage?

> `optional` **storage**: \[`` `0x${string}` ``, `` `0x${string}` ``\][]

Defined in: [interpreter.ts:141](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/interpreter.ts#L141)
