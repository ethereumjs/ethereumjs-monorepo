export enum EOFError {
  // Stream Reader
  OutOfBounds = 'Trying to read out of bounds',
  VerifyUint = 'Uint does not match expected value ',
  VerifyBytes = 'Bytes do not match expected value',

  // Section Markers
  MAGIC = 'err: invalid magic',
  VERSION = `err: invalid eof version`,
  KIND_TYPE = `err: expected kind types`,
  KIND_CODE = `err: expected kind code`,
  KIND_DATA = `err: expected kind data`,
  TERMINATOR = `err: expected terminator`,

  // Section Sizes
  TypeSize = `missing type size`,
  InvalidTypeSize = `err: type section size invalid`,
  CodeSize = `missing code size`,
  CodeSectionSize = `code section should be at least one byte`,
  InvalidCodeSize = `code size does not match type size`,
  DataSize = `missing data size`,
  ContainerSize = 'container size less than minimum valid size',

  // Type Section
  TypeSections = `err: mismatch of code sections count and type signatures`,
  Inputs = 'expected inputs',
  Outputs = 'expected outputs',
  MaxInputs = 'inputs exceeds 127, the maximum, got: ',
  MaxOutputs = 'outputs exceeds 127, the maximum, got: ',
  Code0Inputs = 'first code section should have 0 inputs',
  Code0Outputs = 'first code section should have 0 outputs',
  MaxStackHeight = `expected maxStackHeight`,
  MaxStackHeightLimit = `stack height limit of 1024 exceeded: `,

  // Code/Data Section
  MinCodeSections = `should have at least 1 code section`,
  MaxCodeSections = `can have at most 1024 code sections`,
  CodeSection = `expected a code section`,
  DataSection = `Expected data section`,

  // Dangling Bytes
  DanglingBytes = 'got dangling bytes in body',
}

export enum SimpleErrors {
  minContainerSize = 'err: container size less than minimum valid size',
  invalidContainerSize = 'err: invalid container size',
  typeSize = 'err: type section size invalid',
  code0msh = 'err: computed max stack height for code section 0 does not match expect',
  underflow = 'err: stack underflow',
  code0IO = 'err: input and output of first code section must be 0',

  // Stream Reader
  // OutOfBounds = 'err: relative offset out-of-bounds: ',
  VerifyUint = 'Uint does not match expected value ',
  VerifyBytes = 'Bytes do not match expected value',

  // Section Sizes
  TypeSize = `missing type size`,
  InvalidTypeSize = `err: type section invalid`,
  CodeSize = `missing code size`,
  CodeSectionSize = `code section should be at least one byte`,
  InvalidCodeSize = `code size does not match type size`,
  DataSize = `missing data size`,

  // Type Section
  TypeSections = `need to have a type section for each code section`,
  Inputs = 'expected inputs',
  Outputs = 'expected outputs',
  MaxInputs = 'inputs exceeds 127, the maximum, got: ',
  MaxOutputs = 'outputs exceeds 127, the maximum, got: ',
  Code0Inputs = 'first code section should have 0 inputs',
  Code0Outputs = 'first code section should have 0 outputs',
  MaxStackHeight = `expected maxStackHeight`,
  MaxStackHeightLimit = `stack height limit of 1024 exceeded: `,

  // Code/Data Section
  MinCodeSections = `should have at least 1 code section`,
  MaxCodeSections = `can have at most 1024 code sections`,
  CodeSection = `expected a code section`,
  DataSection = `Expected data section`,

  // Dangling Bytes
  DanglingBytes = 'got dangling bytes in body',
}

export function validationErrorMsg(type: EOFError, ...args: any) {
  switch (type) {
    case EOFError.OutOfBounds: {
      return EOFError.OutOfBounds + ` at pos: ${args[0]}: ${args[1]}`
    }
    case EOFError.VerifyBytes: {
      return EOFError.VerifyBytes + ` at pos: ${args[0]}: ${args[1]}`
    }
    case EOFError.VerifyUint: {
      return EOFError.VerifyUint + `at pos: ${args[0]}: ${args[1]}`
    }
    case EOFError.TypeSize: {
      return EOFError.TypeSize + args[0]
    }
    case EOFError.InvalidTypeSize: {
      return EOFError.InvalidTypeSize + args[0]
    }
    case EOFError.InvalidCodeSize: {
      return EOFError.InvalidCodeSize + args[0]
    }
    case EOFError.Inputs: {
      return `${EOFError.Inputs} - typeSection ${args[0]}`
    }
    case EOFError.Outputs: {
      return `${EOFError.Outputs} - typeSection ${args[0]}`
    }
    case EOFError.Code0Inputs: {
      return `first code section should have 0 inputs`
    }
    case EOFError.Code0Outputs: {
      return `first code section should have 0 outputs`
    }
    case EOFError.MaxInputs: {
      return EOFError.MaxInputs + `${args[1]} - code section ${args[0]}`
    }
    case EOFError.MaxOutputs: {
      return EOFError.MaxOutputs + `${args[1]} - code section ${args[0]}`
    }
    case EOFError.CodeSection: {
      return `expected code: codeSection ${args[0]}: `
    }
    case EOFError.DataSection: {
      return EOFError.DataSection
    }
    case EOFError.MaxStackHeight: {
      return `${EOFError.MaxStackHeight} - typeSection ${args[0]}: `
    }
    case EOFError.MaxStackHeightLimit: {
      return `${EOFError.MaxStackHeightLimit}, got: ${args[1]} - typeSection ${args[0]}`
    }
    case EOFError.DanglingBytes: {
      return EOFError.DanglingBytes
    }
    default: {
      return type
    }
  }
}
export function validationError(type: EOFError, ...args: any) {
  switch (type) {
    case EOFError.OutOfBounds: {
      const pos = args[0]
      if (pos === 0 || pos === 2 || pos === 3 || pos === 6) {
        throw new Error(args[1])
      }
      throw new Error(EOFError.OutOfBounds + ` `)
    }
    case EOFError.VerifyBytes: {
      const pos = args[0]
      if (pos === 0 || pos === 2 || pos === 3 || pos === 6) {
        throw new Error(args[1])
      }
      throw new Error(EOFError.VerifyBytes + ` at pos: ${args[0]}: ${args[1]}`)
    }
    case EOFError.VerifyUint: {
      const pos = args[0]
      if (pos === 0 || pos === 2 || pos === 3 || pos === 6 || pos === 18) {
        throw new Error(args[1])
      }
      throw new Error(EOFError.VerifyUint + `at pos: ${args[0]}: ${args[1]}`)
    }
    case EOFError.TypeSize: {
      throw new Error(EOFError.TypeSize + args[0])
    }
    case EOFError.TypeSections: {
      throw new Error(`${EOFError.TypeSections} (types ${args[0]} code ${args[1]})`)
    }
    case EOFError.InvalidTypeSize: {
      throw new Error(EOFError.InvalidTypeSize)
    }
    case EOFError.InvalidCodeSize: {
      throw new Error(EOFError.InvalidCodeSize + args[0])
    }
    case EOFError.Inputs: {
      throw new Error(`${EOFError.Inputs} - typeSection ${args[0]}`)
    }
    case EOFError.Outputs: {
      throw new Error(`${EOFError.Outputs} - typeSection ${args[0]}`)
    }
    case EOFError.Code0Inputs: {
      throw new Error(`first code section should have 0 inputs`)
    }
    case EOFError.Code0Outputs: {
      throw new Error(`first code section should have 0 outputs`)
    }
    case EOFError.MaxInputs: {
      throw new Error(EOFError.MaxInputs + `${args[1]} - code section ${args[0]}`)
    }
    case EOFError.MaxOutputs: {
      throw new Error(EOFError.MaxOutputs + `${args[1]} - code section ${args[0]}`)
    }
    case EOFError.CodeSection: {
      throw new Error(`expected code: codeSection ${args[0]}: `)
    }
    case EOFError.DataSection: {
      throw new Error(EOFError.DataSection)
    }
    case EOFError.MaxStackHeight: {
      throw new Error(`${EOFError.MaxStackHeight} - typeSection ${args[0]}: `)
    }
    case EOFError.MaxStackHeightLimit: {
      throw new Error(`${EOFError.MaxStackHeightLimit}, got: ${args[1]} - typeSection ${args[0]}`)
    }
    case EOFError.DanglingBytes: {
      throw new Error(EOFError.DanglingBytes)
    }
    default: {
      throw new Error(type)
    }
  }
}
