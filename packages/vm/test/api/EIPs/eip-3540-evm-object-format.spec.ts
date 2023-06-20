import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { EOF } from '@ethereumjs/evm'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { Account, Address, concatBytesNoTypeCheck, privateToAddress } from '@ethereumjs/util'
import { hexToBytes } from 'ethereum-cryptography/utils'
import { assert, describe, it } from 'vitest'

import { VM } from '../../../src/vm'

const pkey = hexToBytes('20'.repeat(32))
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

describe('EIP 3540 tests', () => {
  const common = new Common({
    chain: Chain.Mainnet,
    hardfork: Hardfork.London,
    eips: [3540],
  })

  it('EOF > codeAnalysis() tests', async () => {
    const eofHeader = Uint8Array.from([EOF.FORMAT, EOF.MAGIC, EOF.VERSION])
    assert.ok(
      EOF.codeAnalysis(
        concatBytesNoTypeCheck(eofHeader, Uint8Array.from([0x01, 0x00, 0x01, 0x00, 0x00]))
      )?.code! > 0,
      'valid code section'
    )
    assert.ok(
      EOF.codeAnalysis(
        concatBytesNoTypeCheck(
          eofHeader,
          Uint8Array.from([0x01, 0x00, 0x01, 0x02, 0x00, 0x01, 0x00, 0x00, 0xaa])
        )
      )?.data! > 0,
      'valid data section'
    )
    assert.ok(
      !(
        EOF.codeAnalysis(
          concatBytesNoTypeCheck(eofHeader, Uint8Array.from([0x01, 0x00, 0x01, 0x00, 0x00, 0x00]))
        ) !== undefined
      ),
      'invalid container length (too long)'
    )
    assert.ok(
      !(
        EOF.codeAnalysis(
          concatBytesNoTypeCheck(eofHeader, Uint8Array.from([0x01, 0x00, 0x01, 0x00]))
        ) !== undefined
      ),
      'invalid container length (too short)'
    )
  })

  it('valid EOF format / contract creation', async () => {
    const common = new Common({
      chain: Chain.Mainnet,
      hardfork: Hardfork.London,
      eips: [3540],
    })
    const vm = await VM.create({ common })
    await vm.stateManager.putAccount(sender, new Account())
    const account = await vm.stateManager.getAccount(sender)
    const balance = GWEI * BigInt(21000) * BigInt(10000000)
    account!.balance = balance
    await vm.stateManager.putAccount(sender, account!)

    let data = '0x67' + 'EF0001' + '01000100' + '00' + '60005260086018F3'
    let res = await runTx(vm, data, 0)
    assert.ok(res.code.length > 0, 'code section with no data section')

    data = '0x6B' + 'EF0001' + '01000102000100' + '00' + 'AA' + '600052600C6014F3'
    res = await runTx(vm, data, 1)
    assert.ok(res.code.length > 0, 'code section with data section')
  })

  it('invalid EOF format / contract creation', async () => {
    const vm = await VM.create({ common })
    await vm.stateManager.putAccount(sender, new Account())
    const account = await vm.stateManager.getAccount(sender)
    const balance = GWEI * BigInt(21000) * BigInt(10000000)
    account!.balance = balance
    await vm.stateManager.putAccount(sender, account!)

    let data = '0x60EF60005360016000F3'
    let res = await runTx(vm, data, 0)
    assert.ok(res.code.length === 0, 'no magic')

    data = '0x7FEF0000000000000000000000000000000000000000000000000000000000000060005260206000F3'
    res = await runTx(vm, data, 1)
    assert.ok(res.code.length === 0, 'invalid header')

    data = '0x7FEF0002000000000000000000000000000000000000000000000000000000000060005260206000F3'
    res = await runTx(vm, data, 2)
    assert.ok(res.code.length === 0, 'valid header but invalid EOF version')

    data = '0x7FEF0001000000000000000000000000000000000000000000000000000000000060005260206000F3'
    res = await runTx(vm, data, 3)
    assert.ok(res.code.length === 0, 'valid header and version but no code section')

    data = '0x7FEF0001030000000000000000000000000000000000000000000000000000000060005260206000F3'
    res = await runTx(vm, data, 4)
    assert.ok(res.code.length === 0, 'valid header and version but unknown section type')

    data = '0x7FEF0001010002006000DEADBEEF0000000000000000000000000000000000000060005260206000F3'
    res = await runTx(vm, data, 5)
    assert.ok(res.code.length === 0, 'code section with trailing bytes')
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

describe('ensure invalid EOF initcode in EIP-3540 does not consume all gas', () => {
  it('case: tx', async () => {
    const common = new Common({
      chain: Chain.Mainnet,
      hardfork: Hardfork.London,
      eips: [3540],
    })
    const vm = await VM.create({ common })
    await vm.stateManager.putAccount(sender, new Account())
    const account = await vm.stateManager.getAccount(sender)
    const balance = GWEI * BigInt(21000) * BigInt(10000000)
    account!.balance = balance
    await vm.stateManager.putAccount(sender, account!)

    let data = generateEOFCode('60016001F3')
    const res = await runTx(vm, data, 0)

    data = generateInvalidEOFCode('60016001F3')
    const res2 = await runTx(vm, data, 1)
    assert.ok(
      res.result.totalGasSpent > res2.result.totalGasSpent,
      'invalid initcode did not consume all gas'
    )
  })

  it('case: create', async () => {
    const common = new Common({
      chain: Chain.Mainnet,
      hardfork: Hardfork.London,
      eips: [3540],
    })
    const vm = await VM.create({ common })
    await vm.stateManager.putAccount(sender, new Account())
    const account = await vm.stateManager.getAccount(sender)
    const balance = GWEI * BigInt(21000) * BigInt(10000000)
    account!.balance = balance
    await vm.stateManager.putAccount(sender, account!)

    let data = deployCreateCode(generateEOFCode('60016001F3').substring(2))
    const res = await runTx(vm, data, 0)

    data = deployCreateCode(generateInvalidEOFCode('60016001F3').substring(2))
    const res2 = await runTx(vm, data, 1)

    assert.ok(
      res.result.totalGasSpent > res2.result.totalGasSpent,
      'invalid initcode did not consume all gas'
    )
  })

  it('case: create2', async () => {
    const common = new Common({
      chain: Chain.Mainnet,
      hardfork: Hardfork.London,
      eips: [3540],
    })
    const vm = await VM.create({ common })
    await vm.stateManager.putAccount(sender, new Account())
    const account = await vm.stateManager.getAccount(sender)
    const balance = GWEI * BigInt(21000) * BigInt(10000000)
    account!.balance = balance
    await vm.stateManager.putAccount(sender, account!)

    let data = deployCreate2Code(generateEOFCode('60016001F3').substring(2))
    const res = await runTx(vm, data, 0)

    data = deployCreate2Code(generateInvalidEOFCode('60016001F3').substring(2))
    const res2 = await runTx(vm, data, 1)
    assert.ok(
      res.result.totalGasSpent > res2.result.totalGasSpent,
      'invalid initcode did not consume all gas'
    )
  })
})
