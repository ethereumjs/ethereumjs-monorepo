import { EthereumJSErrorWithoutCode } from '@ethereumjs/util'

export type EOFError = (typeof EOFError)[keyof typeof EOFError]

export const EOFError = {
  OUT_OF_BOUNDS: 'Trying to read out of bounds',
  VERIFY_UINT: 'Uint does not match expected value ',
  VERIFY_BYTES: 'Bytes do not match expected value',
  FORMAT: 'err: invalid format',
  MAGIC: 'err: invalid magic',
  VERSION: 'err: invalid eof version',
  KIND_TYPE: 'err: expected kind types',
  KIND_CODE: 'err: expected kind code',
  KIND_DATA: 'err: expected kind data',
  TERMINATOR: 'err: expected terminator',
  TYPE_SIZE: 'missing type size',
  INVALID_TYPE_SIZE: 'err: type section size invalid',
  CODE_SIZE: 'missing code size',
  CODE_SECTION_SIZE: 'code section should be at least one byte',
  INVALID_CODE_SIZE: 'code size does not match type size',
  DATA_SIZE: 'missing data size',
  CONTAINER_SIZE: 'missing container size',
  CONTAINER_SECTION_SIZE:
    'container section should at least contain one section and at most 255 sections',
  TYPE_SECTIONS: 'err: mismatch of code sections count and type signatures',
  INPUTS: 'expected inputs',
  OUTPUTS: 'expected outputs',
  MAX_INPUTS: 'inputs exceeds 127, the maximum, got: ',
  MAX_OUTPUTS: 'outputs exceeds 127, the maximum, got: ',
  CODE0_INPUTS: 'first code section should have 0 inputs',
  CODE0_OUTPUTS: 'first code section should have 0x80 (terminating section) outputs',
  MAX_STACK_HEIGHT: 'expected maxStackHeight',
  MAX_STACK_HEIGHT_LIMIT: 'stack height limit of 1024 exceeded: ',
  MIN_CODE_SECTIONS: 'should have at least 1 code section',
  MAX_CODE_SECTIONS: 'can have at most 1024 code sections',
  CODE_SECTION: 'expected a code section',
  DATA_SECTION: 'Expected data section',
  CONTAINER_SECTION: 'expected a container section',
  CONTAINER_SECTION_MIN: 'container section should be at least 1 byte',
  INVALID_EOF_CREATE_TARGET: 'EOFCREATE targets an undefined container',
  INVALID_RETURN_CONTRACT_TARGET: 'RETURNCONTRACT targets an undefined container',
  CONTAINER_DOUBLE_TYPE: 'Container is targeted by both EOFCREATE and RETURNCONTRACT',
  UNREACHABLE_CONTAINER_SECTIONS: 'Unreachable containers (by both EOFCREATE and RETURNCONTRACT)',
  CONTAINER_TYPE_ERROR:
    'Container contains opcodes which this mode (deployment mode / init code / runtime mode) cannot have',
  DANGLING_BYTES: 'got dangling bytes in body',
  INVALID_OPCODE: 'invalid opcode',
  INVALID_TERMINATOR: 'invalid terminating opcode',
  OPCODE_INTERMEDIATES_OOB: 'invalid opcode: intermediates out-of-bounds',
  INVALID_RJUMP: 'invalid rjump* target',
  INVALID_CALL_TARGET: 'invalid callf/jumpf target',
  INVALID_CALLF_RETURNING: 'invalid callf: calls to non-returning function',
  INVALID_STACK_HEIGHT: 'invalid stack height',
  INVALID_JUMPF: 'invalid jumpf target (output count)',
  INVALID_RETURNING_SECTION: 'invalid returning code section: section is not returning',
  RETURNING_NO_RETURN: 'invalid section: section should return but has no RETF/JUMP to return',
  RJUMPV_TABLE_SIZE0: 'invalid RJUMPV: table size 0',
  UNREACHABLE_CODE_SECTIONS: 'unreachable code sections',
  UNREACHABLE_CODE: 'unreachable code (by forward jumps)',
  DATALOADN_OOB: 'DATALOADN reading out of bounds',
  MAX_STACK_HEIGHT_VIOLATION: 'Max stack height does not match the reported max stack height',
  STACK_UNDERFLOW: 'Stack underflow',
  STACK_OVERFLOW: 'Stack overflow',
  UNSTABLE_STACK: 'Unstable stack (can reach stack under/overflow by jumps)',
  RETF_NO_RETURN: 'Trying to return to undefined function',
  RETURN_STACK_OVERFLOW: 'Return stack overflow',
  INVALID_EXTCALL_TARGET: 'invalid extcall target: address > 20 bytes',
  INVALID_RETURN_CONTRACT_DATA_SIZE: 'invalid RETURNCONTRACT: data size lower than expected',
  INVALID_EOF_FORMAT: 'invalid EOF format',
} as const

export type SimpleErrors = (typeof SimpleErrors)[keyof typeof SimpleErrors]

export const SimpleErrors = {
  MIN_CONTAINER_SIZE: 'err: container size less than minimum valid size',
  INVALID_CONTAINER_SIZE: 'err: invalid container size',
  TYPE_SIZE: 'err: type section size invalid',
  CODE0_MSH: 'err: computed max stack height for code section 0 does not match expect',
  UNDERFLOW: 'err: stack underflow',
  CODE0_IO: 'err: input and output of first code section must be 0',
  VERIFY_UINT: 'Uint does not match expected value ',
  VERIFY_BYTES: 'Bytes do not match expected value',
  INVALID_TYPE_SIZE: 'err: type section invalid',
  CODE_SIZE: 'missing code size',
  CODE_SECTION_SIZE: 'code section should be at least one byte',
  INVALID_CODE_SIZE: 'code size does not match type size',
  DATA_SIZE: 'missing data size',
  TYPE_SECTIONS: 'need to have a type section for each code section',
  INPUTS: 'expected inputs',
  OUTPUTS: 'expected outputs',
  MAX_INPUTS: 'inputs exceeds 127, the maximum, got: ',
  MAX_OUTPUTS: 'outputs exceeds 127, the maximum, got: ',
  CODE0_INPUTS: 'first code section should have 0 inputs',
  CODE0_OUTPUTS: 'first code section should have 0 outputs',
  MAX_STACK_HEIGHT: 'expected maxStackHeight',
  MAX_STACK_HEIGHT_LIMIT: 'stack height limit of 1024 exceeded: ',
  MIN_CODE_SECTIONS: 'should have at least 1 code section',
  MAX_CODE_SECTIONS: 'can have at most 1024 code sections',
  CODE_SECTION: 'expected a code section',
  DATA_SECTION: 'Expected data section',
  DANGLING_BYTES: 'got dangling bytes in body',
} as const

export function validationErrorMsg(type: EOFError, ...args: any) {
  switch (type) {
    case EOFError.OUT_OF_BOUNDS: {
      return EOFError.OUT_OF_BOUNDS + ` at pos: ${args[0]}: ${args[1]}`
    }
    case EOFError.VERIFY_BYTES: {
      return EOFError.VERIFY_BYTES + ` at pos: ${args[0]}: ${args[1]}`
    }
    case EOFError.VERIFY_UINT: {
      return EOFError.VERIFY_UINT + `at pos: ${args[0]}: ${args[1]}`
    }
    case EOFError.TYPE_SIZE: {
      return EOFError.TYPE_SIZE + args[0]
    }
    case EOFError.INVALID_TYPE_SIZE: {
      return EOFError.INVALID_TYPE_SIZE + args[0]
    }
    case EOFError.INVALID_CODE_SIZE: {
      return EOFError.INVALID_CODE_SIZE + args[0]
    }
    case EOFError.INPUTS: {
      return `${EOFError.INPUTS} - typeSection ${args[0]}`
    }
    case EOFError.OUTPUTS: {
      return `${EOFError.OUTPUTS} - typeSection ${args[0]}`
    }
    case EOFError.CODE0_INPUTS: {
      return `first code section should have 0 inputs`
    }
    case EOFError.CODE0_OUTPUTS: {
      return `first code section should have 0 outputs`
    }
    case EOFError.MAX_INPUTS: {
      return EOFError.MAX_INPUTS + `${args[1]} - code section ${args[0]}`
    }
    case EOFError.MAX_OUTPUTS: {
      return EOFError.MAX_OUTPUTS + `${args[1]} - code section ${args[0]}`
    }
    case EOFError.CODE_SECTION: {
      return `expected code: codeSection ${args[0]}: `
    }
    case EOFError.DATA_SECTION: {
      return EOFError.DATA_SECTION
    }
    case EOFError.MAX_STACK_HEIGHT: {
      return `${EOFError.MAX_STACK_HEIGHT} - typeSection ${args[0]}: `
    }
    case EOFError.MAX_STACK_HEIGHT_LIMIT: {
      return `${EOFError.MAX_STACK_HEIGHT_LIMIT}, got: ${args[1]} - typeSection ${args[0]}`
    }
    case EOFError.DANGLING_BYTES: {
      return EOFError.DANGLING_BYTES
    }
    default: {
      return type
    }
  }
}
export function validationError(type: EOFError, ...args: any): never {
  switch (type) {
    case EOFError.OUT_OF_BOUNDS: {
      const pos = args[0]
      if (pos === 0 || pos === 2 || pos === 3 || pos === 6) {
        throw EthereumJSErrorWithoutCode(args[1])
      }
      throw EthereumJSErrorWithoutCode(EOFError.OUT_OF_BOUNDS + ` `)
    }
    case EOFError.VERIFY_BYTES: {
      const pos = args[0]
      if (pos === 0 || pos === 2 || pos === 3 || pos === 6) {
        throw EthereumJSErrorWithoutCode(args[1])
      }
      throw EthereumJSErrorWithoutCode(EOFError.VERIFY_BYTES + ` at pos: ${args[0]}: ${args[1]}`)
    }
    case EOFError.VERIFY_UINT: {
      const pos = args[0]
      if (pos === 0 || pos === 2 || pos === 3 || pos === 6 || pos === 18) {
        throw EthereumJSErrorWithoutCode(args[1])
      }
      throw EthereumJSErrorWithoutCode(EOFError.VERIFY_UINT + `at pos: ${args[0]}: ${args[1]}`)
    }
    case EOFError.TYPE_SIZE: {
      throw EthereumJSErrorWithoutCode(EOFError.TYPE_SIZE + args[0])
    }
    case EOFError.TYPE_SECTIONS: {
      throw EthereumJSErrorWithoutCode(
        `${EOFError.TYPE_SECTIONS} (types ${args[0]} code ${args[1]})`,
      )
    }
    case EOFError.INVALID_TYPE_SIZE: {
      throw EthereumJSErrorWithoutCode(EOFError.INVALID_TYPE_SIZE)
    }
    case EOFError.INVALID_CODE_SIZE: {
      throw EthereumJSErrorWithoutCode(EOFError.INVALID_CODE_SIZE + args[0])
    }
    case EOFError.INPUTS: {
      throw EthereumJSErrorWithoutCode(`${EOFError.INPUTS} - typeSection ${args[0]}`)
    }
    case EOFError.OUTPUTS: {
      throw EthereumJSErrorWithoutCode(`${EOFError.OUTPUTS} - typeSection ${args[0]}`)
    }
    case EOFError.CODE0_INPUTS: {
      throw EthereumJSErrorWithoutCode(`first code section should have 0 inputs`)
    }
    case EOFError.CODE0_OUTPUTS: {
      throw EthereumJSErrorWithoutCode(`first code section should have 0 outputs`)
    }
    case EOFError.MAX_INPUTS: {
      throw EthereumJSErrorWithoutCode(EOFError.MAX_INPUTS + `${args[1]} - code section ${args[0]}`)
    }
    case EOFError.MAX_OUTPUTS: {
      throw EthereumJSErrorWithoutCode(
        EOFError.MAX_OUTPUTS + `${args[1]} - code section ${args[0]}`,
      )
    }
    case EOFError.CODE_SECTION: {
      throw EthereumJSErrorWithoutCode(`expected code: codeSection ${args[0]}: `)
    }
    case EOFError.DATA_SECTION: {
      throw EthereumJSErrorWithoutCode(EOFError.DATA_SECTION)
    }
    case EOFError.MAX_STACK_HEIGHT: {
      throw EthereumJSErrorWithoutCode(`${EOFError.MAX_STACK_HEIGHT} - typeSection ${args[0]}: `)
    }
    case EOFError.MAX_STACK_HEIGHT_LIMIT: {
      throw EthereumJSErrorWithoutCode(
        `${EOFError.MAX_STACK_HEIGHT_LIMIT}, got: ${args[1]} - typeSection ${args[0]}`,
      )
    }
    case EOFError.DANGLING_BYTES: {
      throw EthereumJSErrorWithoutCode(EOFError.DANGLING_BYTES)
    }
    default: {
      throw EthereumJSErrorWithoutCode(type)
    }
  }
}
