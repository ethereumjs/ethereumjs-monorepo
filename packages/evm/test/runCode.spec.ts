import { DefaultStateManager } from '@ethereumjs/statemanager'
import { Account, Address } from '@ethereumjs/util'
import { hexToBytes } from 'ethereum-cryptography/utils'
import * as tape from 'tape'

import { EVM } from '../src'

const STOP = '00'
const JUMP = '56'
const JUMPDEST = '5b'
const PUSH1 = '60'

const testCases = [
  { code: [STOP, JUMPDEST, PUSH1, '05', JUMP, JUMPDEST], pc: 1, resultPC: 6 },
  {
    code: [STOP, JUMPDEST, PUSH1, '05', JUMP, JUMPDEST],
    pc: -1,
    error: 'Internal error: program counter not in range',
  },
  { code: [STOP], pc: 3, error: 'Internal error: program counter not in range' },
  { code: [STOP], resultPC: 1 },
]

tape('VM.runCode: initial program counter', async (t) => {
  const evm = await EVM.create({
    stateManager: new DefaultStateManager(),
  })

  for (const [i, testData] of testCases.entries()) {
    const runCodeArgs = {
      code: hexToBytes(testData.code.join('')),
      pc: testData.pc,
      gasLimit: BigInt(0xffff),
    }

    let err
    try {
      const result = await evm.runCode!(runCodeArgs)
      if (testData.resultPC !== undefined) {
        t.equal(
          result.runState?.programCounter,
          testData.resultPC,
          `should start the execution at the specified pc or 0, testCases[${i}]`
        )
      }
    } catch (e: any) {
      err = e
    }

    if (testData.error !== undefined) {
      err = err?.message ?? 'no error thrown'
      t.equal(err, testData.error, 'error message should match')
      err = false
    }

    t.assert(err === false || err === undefined)
  }
})

tape('VM.runCode: interpreter', (t) => {
  t.test('should return a EvmError as an exceptionError on the result', async (st) => {
    const evm = await EVM.create({
      stateManager: new DefaultStateManager(),
    })

    const INVALID_opcode = 'fe'
    const runCodeArgs = {
      code: hexToBytes(INVALID_opcode),
      gasLimit: BigInt(0xffff),
    }

    let result: any
    try {
      result = await evm.runCode!(runCodeArgs)
    } catch (e: any) {
      st.fail('should not throw error')
    }
    st.equal(result!.exceptionError!.errorType, 'EvmError')
    st.ok(result!.exceptionError!.error.includes('invalid opcode'))
    st.end()
  })

  t.test('should throw on non-EvmError', async (st) => {
    const evm = await EVM.create({
      stateManager: new DefaultStateManager(),
    })
    // NOTE: due to now throwing on `getContractStorage` if account does not exist
    // this now means that if `runCode` is called and the address it runs on (default: zero address)
    // does not exist, then if SSTORE/SLOAD is used, the runCode will immediately fail because StateManager now throws
    // TODO: is this behavior which we should fix? (Either in StateManager OR in runCode where we load the account first,
    // then re-put the account after (if account === undefined put empty account, such that the account exists))
    const address = Address.fromString(`0x${'00'.repeat(20)}`)
    await evm.stateManager.putAccount(address, new Account())
    evm.stateManager.putContractStorage = (..._args) => {
      throw new Error('Test')
    }

    const SSTORE = '55'
    const runCodeArgs = {
      code: hexToBytes([PUSH1, '01', PUSH1, '05', SSTORE].join('')),
      gasLimit: BigInt(0xffff),
    }

    try {
      await evm.runCode!(runCodeArgs)
      st.fail('should throw error')
    } catch (e: any) {
      st.ok(e.toString().includes('Test'), 'error thrown')
    }
    st.end()
  })
})

tape('VM.runCode: RunCodeOptions', (t) => {
  t.test('should throw on negative value args', async (st) => {
    const evm = await EVM.create({
      stateManager: new DefaultStateManager(),
    })

    const runCodeArgs = {
      value: BigInt(-10),
      gasLimit: BigInt(1000000),
    }

    try {
      await evm.runCode!(runCodeArgs)
      st.fail('should not accept a negative call value')
    } catch (err: any) {
      st.ok(err.message.includes('value field cannot be negative'), 'throws on negative call value')
    }

    st.end()
  })
})
