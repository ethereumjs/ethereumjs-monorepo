const ERROR = {
  OUT_OF_GAS: 'out of gas',
  STACK_UNDERFLOW: 'stack underflow',
  STACK_OVERFLOW: 'stack overflow',
  INVALID_JUMP: 'invalid JUMP',
  INVALID_OPCODE: 'invalid opcode',
  OUT_OF_RANGE: 'value out of range',
  REVERT: 'revert',
  STATIC_STATE_CHANGE: 'static state change',
  INTERNAL_ERROR: 'internal error'
}

function getExceptionType (statusCode) {
  switch (statusCode) {
    case 'EVMC_OUT_OF_GAS':
    {
      return ERROR.OUT_OF_GAS
    }
    case 'EVMC_STACK_UNDERFLOW':
    {
      return ERROR.STACK_UNDERFLOW
    }
    case 'EVMC_STACK_OVERFLOW':
    {
      return ERROR.STACK_OVERFLOW
    }
    case 'EVMC_BAD_JUMP_DESTINATION':
    {
      return ERROR.INVALID_JUMP
    }
    case 'EVMC_INVALID_INSTRUCTION':
    {
      return ERROR.INVALID_OPCODE
    }
    case 'EVMC_UNDEFINED_INSTRUCTION':
    {
      return ERROR.INVALID_OPCODE
    }
    case 'EVMC_FAILURE':
    {
      return ERROR.OUT_OF_RANGE
    }
    case 'EVMC_REVERT':
    {
      return ERROR.REVERT
    }
    case 'EVMC_STATIC_MODE_VIOLATION':
    {
      return ERROR.STATIC_STATE_CHANGE
    }
    case 'EVMC_INTERNAL_ERROR':
    {
      return ERROR.INTERNAL_ERROR
    }
    default:
    {
      console.log('Warning: KEVM returned the \'', statusCode, '\' but it is not supported in the current ganache version. Returning \'revert\' instead.')
      return ERROR.INTERNAL_ERROR
    }
  }
}

function VmError (error) {
  this.error = error
  this.errorType = 'VmError'
}

module.exports = {
  ERROR: ERROR,
  VmError: VmError,
  getExceptionType: getExceptionType
}
