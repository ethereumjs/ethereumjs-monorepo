import type { EthereumJSErrorLike } from '@ethereumjs/util'

export type EVMErrorType = (typeof EVMErrorMessage)[keyof typeof EVMErrorMessage]

export const EVMErrorTypeString = 'EVMError'

const EVMErrorMessage = {
  OUT_OF_GAS: 'out of gas',
  CODESTORE_OUT_OF_GAS: 'code store out of gas',
  CODESIZE_EXCEEDS_MAXIMUM: 'code size to deposit exceeds maximum code size',
  STACK_UNDERFLOW: 'stack underflow',
  STACK_OVERFLOW: 'stack overflow',
  INVALID_JUMP: 'invalid JUMP',
  INVALID_OPCODE: 'invalid opcode',
  OUT_OF_RANGE: 'value out of range',
  REVERT: 'revert',
  STATIC_STATE_CHANGE: 'static state change',
  INTERNAL_ERROR: 'internal error',
  CREATE_COLLISION: 'create collision',
  STOP: 'stop',
  REFUND_EXHAUSTED: 'refund exhausted',
  VALUE_OVERFLOW: 'value overflow',
  INSUFFICIENT_BALANCE: 'insufficient balance',
  INVALID_BYTECODE_RESULT: 'invalid bytecode deployed',
  INITCODE_SIZE_VIOLATION: 'initcode exceeds max initcode size',
  INVALID_INPUT_LENGTH: 'invalid input length',
  INVALID_EOF_FORMAT: 'invalid EOF format',
  BLS_12_381_INVALID_INPUT_LENGTH: 'invalid input length',
  BLS_12_381_POINT_NOT_ON_CURVE: 'point not on curve',
  BLS_12_381_INPUT_EMPTY: 'input is empty',
  BLS_12_381_FP_NOT_IN_FIELD: 'fp point not in field',
  BN254_FP_NOT_IN_FIELD: 'fp point not in field',
  INVALID_COMMITMENT: 'kzg commitment does not match versioned hash',
  INVALID_INPUTS: 'kzg inputs invalid',
  INVALID_PROOF: 'kzg proof invalid',
} as const

/**
 * Stable, machine-readable error codes mirroring the {@link EVMError.errorMessages} keys, namespaced
 * with an `EVM_` prefix (e.g. `EVM_OUT_OF_GAS`).
 *
 * These align `EVMError` with the monorepo-wide error taxonomy — every EthereumJS error exposes a
 * stable string `code` (see `EthereumJSErrorLike` in `@ethereumjs/util` and the "Error handling"
 * section of the repository `DEVELOPER.md`) — **without reparenting** `EVMError` onto the
 * `EthereumJSError` prototype chain, which would break `instanceof EVMError` checks downstream.
 */
export const EVMErrorCode = Object.fromEntries(
  Object.keys(EVMErrorMessage).map((key) => [key, `EVM_${key}`] as [string, string]),
) as Record<keyof typeof EVMErrorMessage, string>

export type EVMErrorCodeType = (typeof EVMErrorCode)[keyof typeof EVMErrorCode]

/** Fallback code used when a code cannot be derived from the error message. */
export const EVMErrorUnknownCode = 'EVM_UNKNOWN'

// Reverse map message-value -> code, used to derive a code from the (legacy) message-only
// constructor call. A few messages are shared by more than one key (e.g. the generic and the
// BLS-12-381 "invalid input length", or the BLS/BN254 "fp point not in field"); for those the code
// resolves to one representative key. Callers needing an exact code can pass it explicitly as the
// second constructor argument.
const messageToCode: Record<string, string> = {}
for (const key of Object.keys(EVMErrorMessage) as (keyof typeof EVMErrorMessage)[]) {
  messageToCode[EVMErrorMessage[key]] = EVMErrorCode[key]
}

/**
 * EVM execution error.
 *
 * Intentionally a standalone class (not extending `Error`, not on the `EthereumJSError` prototype
 * chain) so that `instanceof EVMError` remains a reliable check. It nonetheless conforms to the
 * shared {@link EthereumJSErrorLike} contract by exposing a stable `code`.
 */
export class EVMError implements EthereumJSErrorLike {
  error: EVMErrorType
  errorType: string
  /**
   * Stable, machine-readable error code (e.g. `EVM_OUT_OF_GAS`); see {@link EVMErrorCode}.
   * Satisfies {@link EthereumJSErrorLike}.
   */
  readonly code: string
  static errorMessages: Record<keyof typeof EVMErrorMessage, EVMErrorType> = EVMErrorMessage
  static errorCodes = EVMErrorCode

  constructor(error: EVMErrorType, code?: string) {
    this.error = error
    this.errorType = EVMErrorTypeString
    this.code = code ?? messageToCode[error] ?? EVMErrorUnknownCode
  }
}
