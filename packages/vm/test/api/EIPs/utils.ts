import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { Address, privateToAddress } from '@ethereumjs/util'

import { VM } from '../../../src/vm'

import type { TypeSection } from '@ethereumjs/evm/src/eof/container'

const pkey = Buffer.from('20'.repeat(32), 'hex')
const GWEI = BigInt('1000000000')
const sender = new Address(privateToAddress(pkey))
const balance = GWEI * BigInt(21000) * BigInt(10000000)

async function setUpVM(eips: number[]): Promise<VM> {
  const common = new Common({
    chain: Chain.Mainnet,
    hardfork: Hardfork.London,
    eips,
  })
  const vm = await VM.create({ common })
  const account = await vm.stateManager.getAccount(sender)
  account.balance = balance
  await vm.stateManager.putAccount(sender, account)
  return vm
}

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

function getEOFCode(code: string, codeSizes: number[], typeHeaders: TypeSection[]) {
  if (typeHeaders.length !== codeSizes.length) {
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
  for (const code of typeHeaders) {
    const input = code.inputs
    const output = code.outputs
    str += input.toString(16).padStart(2, '0')
    str += output.toString(16).padStart(2, '0')
    if (code.maxStackHeight !== undefined) {
      str += code.maxStackHeight.toString(16).padStart(4, '0')
    } else {
      str += '0000' // max stack height
    }
  }
  str += code
  // no data section
  return str
}

/**
 * Create valid EOF container
 * @param functions This is a list of functions. The first index is a hex string of the function code
 *                  The second index is the amount of inputs. The third index is the amount of outputs.
 *                  The last index (optional, defaults to 0) is the max stack height of this function
 * @returns
 */
function createEOFCode(functions: evmFunction[]) {
  let code = ''
  const codeSizes = []
  const typeHeaders: TypeSection[] = []
  for (const func of functions) {
    code += func.function
    codeSizes.push(func.function.length / 2)
    typeHeaders.push({
      inputs: func.inputs,
      outputs: func.outputs,
      maxStackHeight: func.maxStackHeight ?? 0,
    })
  }
  return getEOFCode(code, codeSizes, typeHeaders)
}

function callFunc(func: number) {
  return 'B0' + func.toString(16).padStart(4, '0')
}

export type evmFunction = {
  function: string
  inputs: number
  outputs: number
  maxStackHeight?: number
}

export interface IeipTestCase {
  code: evmFunction[]
  expect: string
  name: string
}

export type eipTestCase = {
  code: evmFunction[]
  expect: string
  name: string
}

export const eip_util = {
  setUpVM,
  callFunc,
  createEOFCode,
  getEOFCode,
  runTx,
  pkey,
}
