/* eslint no-console: 0 */

import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { hexToBytes } from '@ethereumjs/util'

import { EVM } from '../../src/index.js'

import { testCases as arithmeticCases } from './arithmetic.spec.js'
import {
  createBytecode,
  createOpcodeTest,
  getOpcodeByte,
  getOpcodeTestName,
  makeLoopCode,
} from './utils.js'

const allTests = [arithmeticCases]

// Config
const hardfork = Hardfork.Shanghai
const GAS_LIMIT = BigInt(30_000_000) // 30M gas (mainnet max gas per block)
// End config

const GAS_TARGET = 30_000_000
const SECONDS = 12

const MGasPerSecondTarget = GAS_TARGET / SECONDS / 1e6

const common = new Common({ chain: Chain.Mainnet, hardfork })

const POP = getOpcodeByte('POP')

const profilerResults: {
  testName: string
  opcode: string
  mGasPerSecond: number
}[] = []

async function profile() {
  for (const testSet of allTests) {
    for (const opcodeName in testSet) {
      const tests = testSet[opcodeName]
      for (const test of tests) {
        const testName = getOpcodeTestName(opcodeName, test.stack, test.name)
        const code = makeLoopCode(
          createBytecode([createOpcodeTest(test.stack, opcodeName, 'none'), POP])
        )
        const evm = new EVM({ common, profiler: { enabled: true } })
        await evm.runCode({
          code: hexToBytes(code),
          gasLimit: GAS_LIMIT,
        })
        const logs = evm.getPerformanceLogs()
        console.log(testName)
        for (const item of logs.opcodes) {
          if (item.tag === opcodeName) {
            profilerResults.push({
              testName,
              opcode: opcodeName,
              mGasPerSecond: item.millionGasPerSecond,
            })
            break
          }
        }
        evm.clearPerformanceLogs()
      }
    }
  }
  const sorted = profilerResults.sort((a, b) => {
    return b.mGasPerSecond - a.mGasPerSecond
  })
  console.log()
  console.log('-------------------------------------------------------------------------')
  console.log(`Profiler report for hardfork ${hardfork}, gas limit: ${Number(GAS_LIMIT)}`)
  console.log(`Any MGas/s higher than ${MGasPerSecondTarget} is OK`)
  console.log('-------------------------------------------------------------------------')
  console.log()
  console.log('MGas/s'.padEnd(10, ' '), 'Opcode'.padEnd(12, ' '), 'Test name')
  console.log('-------------------------------------------------------------------------')

  for (const entry of sorted) {
    console.log(
      entry.mGasPerSecond.toString().padEnd(10, ' '),
      entry.opcode.padEnd(12, ' '),
      entry.testName
    )
  }
}

void profile()
