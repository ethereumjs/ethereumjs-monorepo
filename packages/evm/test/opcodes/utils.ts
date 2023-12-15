import { Chain, Common, Hardfork } from '@ethereumjs/common'
import {
  BIGINT_0,
  bytesToHex,
  bytesToUnprefixedHex,
  equalsBytes,
  hexToBytes,
  setLengthLeft,
  toBytes,
} from '@ethereumjs/util'
import { assert } from 'vitest'

import { EVM } from '../../src/index.js'
import { eipOpcodes, hardforkOpcodes, opcodes } from '../../src/opcodes/codes.js'

const allHardforks = Object.keys(Hardfork)

export type Expected = string | 'fails' | number | bigint
export type InputStackItems = (number | bigint | Uint8Array)[]
export type TestReturnType = 'topStack' | 'memory' | 'none'
export type OpcodeTests = {
  [opcodeName: string]: {
    stack: InputStackItems
    expected: Expected
    name?: string
  }[]
}

type OpcodeTestOpts = {
  hardforks?: Hardfork[]
  testName?: string
  opcodeName: string
  expected: Expected
  expectedReturnType: TestReturnType
  input: InputStackItems
  gasLimit?: bigint
}

const defaultOpcodeTestOpts = {
  hardforks: [Hardfork.Shanghai],
  gasLimit: BigInt(30_000_000),
}

type TestOpts = {
  hardforks?: Hardfork[] | 'all'
  testName: string
  testCode: string
  profile?: boolean
  profileOpcode?: string | false
  gasLimit?: bigint
}

const defaultTestOpts: Partial<TestOpts> = {
  hardforks: [Hardfork.Shanghai],
  profile: false,
  profileOpcode: false,
  gasLimit: BigInt(30_000_00),
}

function removeHexPrefix(input: string) {
  while (input.startsWith('0x')) {
    input = input.slice(2)
  }
  return input
}

export function getOpcodeByte(name: string) {
  for (const opNumber in opcodes) {
    const opcode = opcodes[opNumber]
    if (opcode.name === name) {
      return parseInt(opNumber).toString(16).padStart(2, '0')
    }
  }
  for (const entry of hardforkOpcodes) {
    for (const opNumber in entry.opcodes) {
      const opcode = entry.opcodes[opNumber]
      if (opcode.name === name) {
        return parseInt(opNumber).toString(16).padStart(2, '0')
      }
    }
  }
  for (const entry of eipOpcodes) {
    for (const opNumber in entry.opcodes) {
      const opcode = entry.opcodes[opNumber]
      if (opcode.name === name) {
        return parseInt(opNumber).toString(16).padStart(2, '0')
      }
    }
  }
  throw new Error(`Opcode ${name} not found`)
}

/**
 * Setups stack items in the EVM
 * @param stack Stack items to push. The first item of the stack is the topmost item of the resulting stack
 * @returns Hex string output to setup this stack
 */
export function initStack(stack: (number | bigint | Uint8Array)[]) {
  stack = stack.map((e) => {
    if (typeof e === 'number') {
      return BigInt(e)
    } else {
      return e
    }
  })
  let output = ''
  for (const entry of stack.reverse()) {
    if (entry === BIGINT_0) {
      output += '6000'
    } else {
      const bytes = toBytes(entry)
      if (bytes.length === 0) {
        output += '6000'
      } else {
        if (bytes.length > 32) {
          throw new Error(
            `Cannot push item, bytes length of ${bytes.length} larger than max of 32 bytes`
          )
        }
        output += (0x60 + bytes.length - 1).toString(16)
        output += bytesToUnprefixedHex(bytes)
      }
    }
  }
  return output
}

// String to return the topmost stack item from the current frame
export const returnStackItem = '60005260206000F3'

// String to return the contents of memory
export const returnMemory = '596000F3'

/**
 * Returns code which loops forever
 */
export function makeLoopCode(input: string) {
  return '0x5B' + removeHexPrefix(input) + '600056'
}

export function createBytecode(input: string[]) {
  return '0x' + input.join('')
}

export function createOpcodeTest(
  input: InputStackItems,
  opcodeName: string,
  returnType: TestReturnType = 'topStack'
) {
  const opcode = getOpcodeByte(opcodeName)
  const inputStack = initStack(<(bigint | Uint8Array)[]>input)
  let returnCode = ''
  switch (returnType) {
    case 'topStack':
      returnCode = returnStackItem
      break
    case 'memory':
      returnCode = returnMemory
      break
  }
  return createBytecode([inputStack, opcode, returnCode])
}

export async function runTest(opts: TestOpts) {
  opts = {
    ...defaultTestOpts,
    ...opts,
  }
  const { hardforks, testCode, gasLimit } = <Required<TestOpts>>opts

  const hfs = hardforks === 'all' ? allHardforks : hardforks
  for (const hf of hfs) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: hf })
    const evm = new EVM({
      common,
    })
    await evm.runCode({
      code: hexToBytes(testCode),
      gasLimit,
    })
  }
}

export function getOpcodeTestName(opcodeName: string, stack: InputStackItems, testName?: string) {
  if (testName === undefined) {
    return `${opcodeName}: ${stack.join()}`
  } else {
    return `${opcodeName}: ${testName}`
  }
}

export async function runOpcodeTest(opts: OpcodeTestOpts) {
  opts = {
    ...defaultOpcodeTestOpts,
    ...opts,
  }
  const { hardforks, gasLimit, expected, input, expectedReturnType, opcodeName } = <
    Required<OpcodeTestOpts>
  >opts
  const code = createOpcodeTest(input, opcodeName, expectedReturnType)
  for (const hf of hardforks) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: hf })
    const evm = new EVM({
      common,
    })
    const result = await evm.runCode({
      code: hexToBytes(code),
      gasLimit,
    })
    if (expected === 'fails') {
      if (result.exceptionError !== undefined) {
        assert.fail(`Test ${opts.testName} should throw, but did not throw`)
      }
    } else {
      let expectedReturn: Uint8Array
      if (opts.expected === 0 || opts.expected === BigInt(0)) {
        if (expectedReturnType === 'topStack') {
          expectedReturn = new Uint8Array(32)
        } else {
          expectedReturn = new Uint8Array()
        }
      } else {
        expectedReturn = toBytes(opts.expected)
      }
      expectedReturn = setLengthLeft(expectedReturn, Math.ceil(expectedReturn.length / 32) * 32)
      assert.ok(
        equalsBytes(result.returnValue, expectedReturn),
        `Test ${getOpcodeTestName(
          opcodeName,
          input,
          opts.testName
        )} failed. Output expected: ${bytesToHex(expectedReturn)}, got ${bytesToHex(
          result.returnValue
        )}, hardfork: ${hf}, input code: ${code}`
      )
    }
  }
}
