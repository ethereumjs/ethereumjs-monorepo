import { readFileSync } from 'fs'
import { assert, describe, it } from 'vitest'

import { TransitionTool } from '../../t8n/t8ntool.ts'

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { MerkleStateManager } from '@ethereumjs/statemanager'
import { createTx } from '@ethereumjs/tx'
import {
  Account,
  type PrefixedHexString,
  createAddressFromPrivateKey,
  hexToBytes,
  randomBytes,
} from '@ethereumjs/util'

import { createVM, runTx } from '../../../src/index.ts'
import { stepTraceJSON, summaryTraceJSON } from '../../t8n/helpers.ts'
import type { T8NOptions } from '../../t8n/types.ts'
const t8nDir = 'test/t8n/testdata/'

const args: T8NOptions = {
  state: {
    fork: 'shanghai',
    reward: BigInt(0),
    chainid: BigInt(1),
  },
  input: {
    alloc: `${t8nDir}input/alloc.json`,
    txs: `${t8nDir}input/txs.json`,
    env: `${t8nDir}input/env.json`,
  },
  output: {
    basedir: t8nDir,
    result: `output/resultTEST.json`,
    alloc: `output/allocTEST.json`,
  },
  log: false,
  trace: false,
}

// This test is generated using `execution-spec-tests` commit 88cab2521322191b2ec7ef7d548740c0b0a264fc, running:
// fill -k test_push0_contracts[fork_Shanghai-blockchain_test-key_sstore] --fork Shanghai tests/shanghai/eip3855_push0 --evm-bin=<ETHEREUMJS_T8NTOOL_LAUNCHER.sh>

// The test will run the TransitionTool using the inputs, and then compare if the output matches

describe('test runner config tests', () => {
  it('should run t8ntool with inputs and report the expected output', async () => {
    await TransitionTool.run(args)
    const expectedResult = JSON.parse(readFileSync(`${t8nDir}output/result.json`).toString())
    const expectedAlloc = JSON.parse(readFileSync(`${t8nDir}output/alloc.json`).toString())
    const reportedResult = JSON.parse(readFileSync(`${t8nDir}output/resultTEST.json`).toString())
    const reportedAlloc = JSON.parse(readFileSync(`${t8nDir}output/allocTEST.json`).toString())
    assert.deepStrictEqual(reportedResult, expectedResult, 'result matches expected result')
    assert.deepStrictEqual(reportedAlloc, expectedAlloc, 'alloc matches expected alloc')
  })
})
describe('trace tests', async () => {
  it('should produce a valid step trace for a legacy contract', async () => {
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun })
    const sm = new MerkleStateManager({ common })
    const vm = await createVM({ common, stateManager: sm })
    const bytecode = hexToBytes('0x604260005260206000F3') // PUSH1 0x42 PUSH1 0x00 MSTORE PUSH1 0x20 PUSH1 0x00 RETURN
    const contractAddress = createAddressFromPrivateKey(randomBytes(32))
    await vm.stateManager.putAccount(contractAddress)
    await vm.stateManager.putCode(contractAddress, bytecode)
    const trace: string[] = []
    vm.evm.events!.on('step', (step) => {
      trace.push(JSON.stringify(stepTraceJSON(step, true)))
    })
    vm.events!.on('afterTx', async (event) => {
      trace.push(JSON.stringify(await summaryTraceJSON(event, vm)))
    })
    const tx = await createTx({
      to: contractAddress,
      data: bytecode,
      gasLimit: 0xffffffff,
      gasPrice: 0xf,
    }).sign(randomBytes(32))
    await runTx(vm, { tx, skipBalance: true, skipBlockGasLimitValidation: true, skipNonce: true })
    assert.strictEqual(trace.length, 7, 'trace length is 7')
    assert.strictEqual(JSON.parse(trace[6]).gasUsed, 21154)
  })
  it('should produce a trace of the correct length', async () => {
    const common = new Common({
      hardfork: Hardfork.Prague,
      chain: Mainnet,
      eips: [663, 3540, 3670, 4200, 4750, 5450, 6206, 7069, 7480, 7620, 7692, 7698],
    })
    const sm = new MerkleStateManager({ common })
    const vm = await createVM({ common, stateManager: sm })
    const code = hexToBytes('0xef000101000402000100030400010000800001305000ef')

    const pk = randomBytes(32)
    const caller = createAddressFromPrivateKey(pk) // caller address
    const contractAddress = createAddressFromPrivateKey(randomBytes(32)) // contract address

    await vm.stateManager.putCode(contractAddress, code)
    await vm.stateManager.putAccount(caller, new Account(BigInt(0), BigInt(0x11111111)))

    const tx = await createTx({
      gasLimit: BigInt(0xffff),
      gasPrice: 0x7,
      to: contractAddress,
    }).sign(pk)
    const trace: string[] = []
    vm.evm.events!.on('step', (step) => {
      trace.push(JSON.stringify(stepTraceJSON(step, true)))
    })
    vm.events!.on('afterTx', async (event) => {
      trace.push(JSON.stringify(await summaryTraceJSON(event, vm)))
    })
    const result = await runTx(vm, {
      tx,
      skipBalance: true,
      skipNonce: true,
      skipBlockGasLimitValidation: true,
    })
    assert.strictEqual(result.execResult.executionGasUsed, BigInt(4))
    assert.strictEqual(trace.length, 4)
  })
  it('should execute an EOF contract with 2 code sections linked by CALLF', async () => {
    const common = new Common({
      hardfork: Hardfork.Prague,
      chain: Mainnet,
      eips: [663, 3540, 3670, 4200, 4750, 5450, 6206, 7069, 7480, 7620, 7692, 7698],
    })
    const sm = new MerkleStateManager({ common })
    const vm = await createVM({ common, stateManager: sm })

    // EOF bytecode structure breakdown:
    // 'ef0001' - Magic (0xEF) and Version (0x0001)
    //
    // Header section with section declarations:
    // '01' - Type section (0x01)
    // '0008' - Type section length (8 bytes)
    // '02' - Code section (0x02)
    // '0002' - 2 code sections
    // '0008' - Code section 0 length (8 bytes)
    // '0003' - Code section 1 length (3 bytes)
    // '04' - Data section (0x04)
    // '0000' - Data section length (0 bytes)
    // '00' - Header terminator
    //
    // Type section for code sections:
    // '00' - Section 0: 0 inputs
    // '80' - Section 0: 0 outputs (non-returning function)
    // '0001' - Section 0: max stack height 1
    // '00' - Section 1: 0 inputs
    // '00' - Section 1: 0 outputs
    // '0001' - Section 1: max stack height 1
    //
    // Code section 0:
    // '30' - ADDRESS (0x30) - Push the contract's address to the stack
    // '50' - POP (0x50) - Remove the address from the stack
    // 'e3' - CALLF (0xE3) - Call code section 1 (0001 is the immediate value)
    // '6001' - PUSH1 1 (0x60) - Push value 1 to the stack (this will be executed after RETF)
    // '00' - STOP (0x00) - End execution
    //
    // Code section 1:
    // '30' - ADDRESS (0x30) - Push the contract's address to the stack
    // '50' - POP (0x50) - Remove the address from the stack
    // 'e4' - RETF (0xE4) - Return from function call to section 0, resuming after CALLF
    const code = hexToBytes(
      ('0xef0001' +
        '010008' +
        '02' +
        '000200080003' +
        '040000' +
        '00' +
        '0080000100000001' +
        '3050e30001600100' +
        '3050e4') as PrefixedHexString,
    )

    const pk = randomBytes(32)
    const caller = createAddressFromPrivateKey(pk)
    const contractAddress = createAddressFromPrivateKey(randomBytes(32))

    await vm.stateManager.putCode(contractAddress, code)
    await vm.stateManager.putAccount(caller, new Account(BigInt(0), BigInt(0x11111111)))

    const tx = await createTx({
      gasLimit: BigInt(0xffff),
      gasPrice: 0x7,
      to: contractAddress,
    }).sign(pk)

    const trace: string[] = []
    vm.evm.events!.on('step', (step) => {
      trace.push(JSON.stringify(stepTraceJSON(step, true)))
    })
    vm.events!.on('afterTx', async (event) => {
      trace.push(JSON.stringify(await summaryTraceJSON(event, vm)))
    })

    const result = await runTx(vm, {
      tx,
      skipBalance: true,
      skipNonce: true,
      skipBlockGasLimitValidation: true,
    })

    // Expected execution flow:
    // 1. ADDRESS in code section 0
    // 2. POP in code section 0
    // 3. CALLF to code section 1
    // 4. ADDRESS in code section 1
    // 5. POP in code section 1
    // 6. RETF back to code section 0 (returns to the instruction after CALLF)
    // 7. PUSH1 in code section 0
    // 8. STOP in code section 0
    // Plus the summary trace
    assert.strictEqual(trace.length, 9, 'trace length should be 9')

    // The execution should use exactly 19 gas (one for each opcode executed)
    assert.strictEqual(result.execResult.executionGasUsed, BigInt(19))
    const immediate = JSON.parse(trace[2]).immediate
    assert.strictEqual(immediate, '0x0001') // Verifies that CALLF immediate matches
  })
})
