import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { ERROR } from '@ethereumjs/evm/dist/exceptions'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { Address, privateToAddress } from '@ethereumjs/util'
import * as tape from 'tape'

import { VM } from '../../../src/vm'
const pkey = Buffer.from('20'.repeat(32), 'hex')
const GWEI = BigInt('1000000000')
const sender = new Address(privateToAddress(pkey))

async function runTx(vm: VM, data: string, nonce: number) {
  const tx = FeeMarketEIP1559Transaction.fromTxData({
    data,
    gasLimit: 1000000,
    maxFeePerGas: 7,
    nonce,
  }).sign(pkey)
  const result = await vm.runTx({ tx })
  const created = result.createdAddress
  const code = created ? await vm.stateManager.getContractCode(created!) : undefined
  return { result, code }
}

function getEOFCode(
  code: string,
  codeSizes: number[],
  codeInputOutputs: [number, number, number?][]
) {
  if (codeInputOutputs.length !== codeSizes.length) {
    throw new Error('each code should have input/output fields')
  }
  const typeSize = (codeSizes.length * 4).toString(16).padStart(4, '0')
  const codeSize = codeSizes.length.toString(16).padStart(4, '0')
  let str = '0xEF0001'
  str += '01' + typeSize
  str += '02' + codeSize
  for (const codeSize of codeSizes) {
    str += codeSize.toString(16).padStart(4, '0')
  }
  str += '030000' // Data section
  str += '00'
  for (const codeInputOutput of codeInputOutputs) {
    const input = codeInputOutput[0]
    const output = codeInputOutput[1]
    str += input.toString(16).padStart(2, '0')
    str += output.toString(16).padStart(2, '0')
    if (codeInputOutput[2] !== undefined) {
      str += codeInputOutput[2].toString(16).padStart(4, '0')
    } else {
      str += '0000' // max stack height
    }
  }
  str += code
  // no data section
  return str
}

function createEOFCode(functions: [string, number, number][]) {
  let code = ''
  const codeSizes = []
  const codeInputOutputs: [number, number][] = []
  for (const func of functions) {
    code += func[0]
    codeSizes.push(func[0].length / 2)
    codeInputOutputs.push([func[1], func[2]])
  }
  return getEOFCode(code, codeSizes, codeInputOutputs)
}

function callFunc(func: number) {
  return 'B0' + func.toString(16).padStart(4, '0')
}

type eipTestCase = {
  code: [string, number, number][]
  expect: string
  name: string
}

tape('EIP 4750 tests', (t) => {
  const common = new Common({
    chain: Chain.Mainnet,
    hardfork: Hardfork.London,
    eips: [3540, 5450, 3860, 5450, 4200, 4750, 3670],
  })

  t.test('test CALLF errors', async (st) => {
    const vm = await VM.create({ common })
    const account = await vm.stateManager.getAccount(sender)
    const balance = GWEI * BigInt(21000) * BigInt(10000000)
    account.balance = balance
    await vm.stateManager.putAccount(sender, account)
    let nonce = 0

    const cases: [string, number[], [number, number, number?][], string][] = [
      ['B00000', [3], [[0, 0]], ERROR.CALLF_RETURN_STACK_FULL],
    ]

    for (const testCase of cases) {
      const code = getEOFCode(testCase[0], testCase[1], testCase[2])
      const { result } = await runTx(vm, code, nonce++)
      st.equal(
        result.execResult.exceptionError?.error,
        testCase[3],
        'EIP 4750: ' + testCase[0] + ' failed: ' + testCase[3]
      )
    }
  })

  t.test('test CALLF/RETF execution', async (st) => {
    const vm = await VM.create({ common })
    const account = await vm.stateManager.getAccount(sender)
    const balance = GWEI * BigInt(21000) * BigInt(10000000)
    account.balance = balance
    await vm.stateManager.putAccount(sender, account)
    let nonce = 0

    // ADD RETF
    const codeAdd: [string, number, number] = ['01B1', 2, 1]
    // function which has output 5
    const output5: [string, number, number] = ['6005B1', 0, 1]

    const test = createEOFCode([
      [callFunc(2) + callFunc(2) + callFunc(1) + '60005500', 0, 0],
      codeAdd,
      output5,
    ])

    const cases: eipTestCase[] = [
      {
        code: [[callFunc(2) + callFunc(2) + callFunc(1) + '60005500', 0, 0], codeAdd, output5],
        expect: '0a', // 10
        name: 'simple add test',
      },
      {
        code: [[callFunc(1) + callFunc(1) + callFunc(2) + '60005500', 0, 0], output5, codeAdd],
        expect: '0a', // 10
        name: 'simple add test (functions now in different order)',
      },
    ]

    for (const testCase of cases) {
      const code = createEOFCode(testCase.code)
      const { result } = await runTx(vm, test, nonce++)
      const value = await vm.stateManager.getContractStorage(
        result.createdAddress!,
        Buffer.from('00'.repeat(32), 'hex')
      )
      st.equals(value.toString('hex'), testCase.expect, testCase.name)
    }
  })
})
