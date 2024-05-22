export enum ERROR {
  OUT_OF_GAS = 'out of gas',
  CODESTORE_OUT_OF_GAS = 'code store out of gas',
  CODESIZE_EXCEEDS_MAXIMUM = 'code size to deposit exceeds maximum code size',
  STACK_UNDERFLOW = 'stack underflow',
  STACK_OVERFLOW = 'stack overflow',
  INVALID_JUMP = 'invalid JUMP',
  INVALID_OPCODE = 'invalid opcode',
  OUT_OF_RANGE = 'value out of range',
  REVERT = 'revert',
  STATIC_STATE_CHANGE = 'static state change',
  INTERNAL_ERROR = 'internal error',
  CREATE_COLLISION = 'create collision',
  STOP = 'stop',
  REFUND_EXHAUSTED = 'refund exhausted',
  VALUE_OVERFLOW = 'value overflow',
  INSUFFICIENT_BALANCE = 'insufficient balance',
  INVALID_BEGINSUB = 'invalid BEGINSUB',
  INVALID_RETURNSUB = 'invalid RETURNSUB',
  INVALID_JUMPSUB = 'invalid JUMPSUB',
  INVALID_BYTECODE_RESULT = 'invalid bytecode deployed',
  INVALID_EOF_FORMAT = 'invalid EOF format',
  INITCODE_SIZE_VIOLATION = 'initcode exceeds max initcode size',
  INVALID_INPUT_LENGTH = 'invalid input length',

  AUTHCALL_UNSET = 'attempting to AUTHCALL without AUTH set',

  // BLS errors
  BLS_12_381_INVALID_INPUT_LENGTH = 'invalid input length',
  BLS_12_381_POINT_NOT_ON_CURVE = 'point not on curve',
  BLS_12_381_INPUT_EMPTY = 'input is empty',
  BLS_12_381_FP_NOT_IN_FIELD = 'fp point not in field',

  // Point Evaluation Errors
  INVALID_COMMITMENT = 'kzg commitment does not match versioned hash',
  INVALID_INPUTS = 'kzg inputs invalid',
  INVALID_PROOF = 'kzg proof invalid',

  // EOF
  INVALID_EOF_MAGIC = 'invalid EOF magic',
  INVALID_EOF_VERSION = 'invalid EOF version',

  INVALID_KIND_TYPE = 'invalid EOF KIND_TYPE',
  INVALID_TYPE_COUNT = 'invalid EOF Type count',

  INVALID_HEADER_SIZE = 'invalid EOF header size',

  INVALID_KIND_CODE = 'invalid EOF KIND_CODE',
  INVALID_CODE_COUNT = 'invalid EOF Code count',
  INVALID_CODE_COUNT_TYPES = 'invalid EOF Code count, should be Type count divided by 4',
  INVALID_CODE_SIZE = 'invalid EOF Code size',

  INVALID_KIND_DATA = 'invalid EOF KIND_DATA',

  INVALID_TERMINATOR_BYTE = 'invalid EOF: invalid header terminator byte',

  INVALID_CONTAINER_COUNT = 'invalid EOF Container count',
  INVALID_CONTAINER_SIZE = 'invalid EOF Container size',

  INVALID_EOF_INPUTS = 'invalid EOF type section: too much inputs',
  INVALID_EOF_OUTPUTS = 'invalid EOF type section: too much outputs',
  INVALID_EOF_MAX_STACK_HEIGHT = 'invalid EOF type section: too high max stack height',

  INVALID_EOF_CODE_OPCODE_UNDEFINED = 'invalid EOF bytecode: undefined opcode found',

  INVALID_EOF_DATA_SECTION_SIZE = 'invalid EOF data section size: data section too large',

  INVALID_EOF_FIRST_CODE_SECTION_TYPE = 'invalid EOF: first code section must have 0 inputs and should have 0x80 (non-returning) outputs',

  INVALID_EOF_FINAL_SECTION_OPCODE = 'invalid EOF: code section does not have a valid final (terminating) instruction opcode',
}

export class EvmError {
  error: ERROR
  errorType: string

  constructor(error: ERROR) {
    this.error = error
    this.errorType = 'EvmError'
  }
}
