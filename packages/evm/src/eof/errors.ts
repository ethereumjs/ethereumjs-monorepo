export enum EOFError {
  // Stream Reader
  OutOfBounds = 'Trying to read out of bounds',
  VerifyUint = 'Uint does not match expected value ',
  VerifyBytes = 'Bytes do not match expected value',

  // Section Markers
  MAGIC = `header should start with magic bytes: 0xEF00`,
  VERSION = `Version should be 1`,
  KIND_TYPE = `type section marker 0x01 expected`,
  KIND_CODE = `code section marker 0x02 expected`,
  KIND_DATA = `data section marker 0x03 expected`,
  TERMINATOR = `terminator 0x00 expected`,

  // Section Sizes
  TypeSize = `missing type size`,
  InvalidTypeSize = `invalid type size: should be at least 4 and should be a multiple of 4. got: `,
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

export function validationError(type: EOFError, ...args: any) {
  switch (type) {
    case EOFError.OutOfBounds: {
      throw new Error(EOFError.OutOfBounds + ` at pos: ${args[0]}: ${args[1]}`)
    }
    case EOFError.VerifyBytes: {
      throw new Error(EOFError.VerifyBytes + ` at pos: ${args[0]}: ${args[1]}`)
    }
    case EOFError.VerifyUint: {
      throw new Error(EOFError.VerifyUint + `at pos: ${args[0]}: ${args[1]}`)
    }
    case EOFError.TypeSize: {
      throw new Error(EOFError.TypeSize + args[0])
    }
    case EOFError.InvalidTypeSize: {
      throw new Error(EOFError.InvalidTypeSize + args[0])
    }
    case EOFError.InvalidCodeSize: {
      throw new Error(EOFError.InvalidCodeSize + args[0])
    }
    case EOFError.Inputs: {
      return `${EOFError.Inputs} - typeSection ${args[0]}`
    }
    case EOFError.Outputs: {
      return `${EOFError.Outputs} - typeSection ${args[0]}`
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
      return `expected code: codeSection ${args[0]}: `
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
  }
}
