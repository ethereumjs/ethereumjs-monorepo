[**@ethereumjs/evm**](../README.md)

***

[@ethereumjs/evm](../README.md) / EVMError

# Class: EVMError

Defined in: [errors.ts:36](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/errors.ts#L36)

## Constructors

### Constructor

> **new EVMError**(`error`): `EVMError`

Defined in: [errors.ts:41](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/errors.ts#L41)

#### Parameters

##### error

`EVMErrorType`

#### Returns

`EVMError`

## Properties

### error

> **error**: `EVMErrorType`

Defined in: [errors.ts:37](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/errors.ts#L37)

***

### errorType

> **errorType**: `string`

Defined in: [errors.ts:38](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/errors.ts#L38)

***

### errorMessages

> `static` **errorMessages**: `Record`\<`"INVALID_OPCODE"` \| `"STACK_UNDERFLOW"` \| `"STACK_OVERFLOW"` \| `"STOP"` \| `"REVERT"` \| `"OUT_OF_GAS"` \| `"CODESTORE_OUT_OF_GAS"` \| `"CODESIZE_EXCEEDS_MAXIMUM"` \| `"INVALID_JUMP"` \| `"OUT_OF_RANGE"` \| `"STATIC_STATE_CHANGE"` \| `"INTERNAL_ERROR"` \| `"CREATE_COLLISION"` \| `"REFUND_EXHAUSTED"` \| `"VALUE_OVERFLOW"` \| `"INSUFFICIENT_BALANCE"` \| `"INVALID_BYTECODE_RESULT"` \| `"INITCODE_SIZE_VIOLATION"` \| `"INVALID_INPUT_LENGTH"` \| `"INVALID_EOF_FORMAT"` \| `"BLS_12_381_INVALID_INPUT_LENGTH"` \| `"BLS_12_381_POINT_NOT_ON_CURVE"` \| `"BLS_12_381_INPUT_EMPTY"` \| `"BLS_12_381_FP_NOT_IN_FIELD"` \| `"BN254_FP_NOT_IN_FIELD"` \| `"INVALID_COMMITMENT"` \| `"INVALID_INPUTS"` \| `"INVALID_PROOF"`, `EVMErrorType`\> = `EVMErrorMessages`

Defined in: [errors.ts:39](https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/evm/src/errors.ts#L39)
