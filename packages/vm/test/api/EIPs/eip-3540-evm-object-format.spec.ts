import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { EOF } from '@ethereumjs/evm/dist/eof'
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
  const code = await vm.stateManager.getContractCode(created!)
  return { result, code }
}

/**
 * TODO add tests:
    Legacy init code
      Returns valid EOF1 code
      Returns invalid EOF1 code
    Valid EOF1 init code
      Returns legacy code (INVALID)
      Returns valid EOF1 code
      Returns invalid EOF1 code
    Invalid EOF1 init code
    

    These tests:
      On a create transaction, if either initcode or th created address is invalid, consume ALL gas
      On a CREATE(2) opcode, if either initcode or the returned data is invalid (i.e. it is legacy or invalid EOF) consume only execution gas
 */

tape('EIP 3540 tests', (t) => {
  const common = new Common({
    chain: Chain.Mainnet,
    hardfork: Hardfork.London,
    eips: [3540, 5450, 3860, 5450, 4200, 4750, 3670],
  })

  t.test('valid EOF format / contract creation', async (st) => {
    const vm = await VM.create({ common })
    const account = await vm.stateManager.getAccount(sender)
    const balance = GWEI * BigInt(21000) * BigInt(10000000)
    account.balance = balance
    await vm.stateManager.putAccount(sender, account)

    let data = '0x67' + 'EF0001' + '01000100' + '00' + '60005260086018F3'
    let res = await runTx(vm, data, 0)
    st.ok(res.code.length > 0, 'code section with no data section')

    data = '0x6B' + 'EF0001' + '01000102000100' + '00' + 'AA' + '600052600C6014F3'
    res = await runTx(vm, data, 1)
    st.ok(res.code.length > 0, 'code section with data section')
  })

  t.test('invalid EOF format / contract creation', async (st) => {
    const vm = await VM.create({ common })
    const account = await vm.stateManager.getAccount(sender)
    const balance = GWEI * BigInt(21000) * BigInt(10000000)
    account.balance = balance
    await vm.stateManager.putAccount(sender, account)

    let data = '0x60EF60005360016000F3'
    let res = await runTx(vm, data, 0)
    st.ok(res.code.length === 0, 'no magic')

    data = '0x7FEF0000000000000000000000000000000000000000000000000000000000000060005260206000F3'
    res = await runTx(vm, data, 1)
    st.ok(res.code.length === 0, 'invalid header')

    data = '0x7FEF0002000000000000000000000000000000000000000000000000000000000060005260206000F3'
    res = await runTx(vm, data, 2)
    st.ok(res.code.length === 0, 'valid header but invalid EOF version')

    data = '0x7FEF0001000000000000000000000000000000000000000000000000000000000060005260206000F3'
    res = await runTx(vm, data, 3)
    st.ok(res.code.length === 0, 'valid header and version but no code section')

    data = '0x7FEF0001030000000000000000000000000000000000000000000000000000000060005260206000F3'
    res = await runTx(vm, data, 4)
    st.ok(res.code.length === 0, 'valid header and version but unknown section type')

    data = '0x7FEF0001010002006000DEADBEEF0000000000000000000000000000000000000060005260206000F3'
    res = await runTx(vm, data, 5)
    st.ok(res.code.length === 0, 'code section with trailing bytes')
  })
})

function generateEOFCode(code: string) {
  const len = (code.length / 2).toString(16).padStart(4, '0')
  return '0xEF000101' + len + '00' + code
}

function generateInvalidEOFCode(code: string) {
  const len = (code.length / 2 + 1).toString(16).padStart(4, '0') // len will be 1 too long
  return '0xEF000101' + len + '00' + code
}

const offset = '13'
const CREATEDeploy = '0x60' + offset + '380360' + offset + '60003960' + offset + '380360006000F000'

const create2offset = '15'
const CREATE2Deploy =
  '0x600060' +
  create2offset +
  '380360' +
  create2offset +
  '60003960' +
  create2offset +
  '380360006000F500'

function deployCreateCode(initcode: string) {
  return CREATEDeploy + initcode
}

function deployCreate2Code(initcode: string) {
  return CREATE2Deploy + initcode
}

tape('ensure invalid EOF initcode in EIP-3540 does not consume all gas', (t) => {
  t.test('case: tx', async (st) => {
    const common = new Common({
      chain: Chain.Mainnet,
      hardfork: Hardfork.London,
      eips: [3540],
    })
    const vm = await VM.create({ common })
    const account = await vm.stateManager.getAccount(sender)
    const balance = GWEI * BigInt(21000) * BigInt(10000000)
    account.balance = balance
    await vm.stateManager.putAccount(sender, account)

    let data = generateEOFCode('60016001F3')
    const res = await runTx(vm, data, 0)

    data = generateInvalidEOFCode('60016001F3')
    const res2 = await runTx(vm, data, 1)
    st.ok(
      res.result.totalGasSpent > res2.result.totalGasSpent,
      'invalid initcode did not consume all gas'
    )
  })

  t.test('case: create', async (st) => {
    const common = new Common({
      chain: Chain.Mainnet,
      hardfork: Hardfork.London,
      eips: [3540],
    })
    const vm = await VM.create({ common })
    const account = await vm.stateManager.getAccount(sender)
    const balance = GWEI * BigInt(21000) * BigInt(10000000)
    account.balance = balance
    await vm.stateManager.putAccount(sender, account)

    let data = deployCreateCode(generateEOFCode('60016001F3').substring(2))
    const res = await runTx(vm, data, 0)

    data = deployCreateCode(generateInvalidEOFCode('60016001F3').substring(2))
    const res2 = await runTx(vm, data, 1)

    st.ok(
      res.result.totalGasSpent > res2.result.totalGasSpent,
      'invalid initcode did not consume all gas'
    )
  })

  t.test('case: create2', async (st) => {
    const common = new Common({
      chain: Chain.Mainnet,
      hardfork: Hardfork.London,
      eips: [3540],
    })
    const vm = await VM.create({ common })
    const account = await vm.stateManager.getAccount(sender)
    const balance = GWEI * BigInt(21000) * BigInt(10000000)
    account.balance = balance
    await vm.stateManager.putAccount(sender, account)

    let data = deployCreate2Code(generateEOFCode('60016001F3').substring(2))
    const res = await runTx(vm, data, 0)

    data = deployCreate2Code(generateInvalidEOFCode('60016001F3').substring(2))
    const res2 = await runTx(vm, data, 1)
    st.ok(
      res.result.totalGasSpent > res2.result.totalGasSpent,
      'invalid initcode did not consume all gas'
    )
  })
})
