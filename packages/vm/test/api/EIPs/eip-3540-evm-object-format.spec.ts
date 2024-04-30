import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { EOF } from '@ethereumjs/evm'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { Account, Address, concatBytes, hexToBytes, privateToAddress } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { VM } from '../../../src/vm'

import type { PrefixedHexString } from '@ethereumjs/util'

const pkey = hexToBytes(`0x${'20'.repeat(32)}`)
const GWEI = BigInt('1000000000')
const sender = new Address(privateToAddress(pkey))

async function runTx(vm: VM, data: PrefixedHexString, nonce: number) {
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
      EOF.codeAnalysis(concatBytes(eofHeader, Uint8Array.from([0x01, 0x00, 0x01, 0x00, 0x00])))
        ?.code! > 0,
      'valid code section'
    )
    assert.ok(
      EOF.codeAnalysis(
        concatBytes(
          eofHeader,
          Uint8Array.from([0x01, 0x00, 0x01, 0x02, 0x00, 0x01, 0x00, 0x00, 0xaa])
        )
      )?.data! > 0,
      'valid data section'
    )
    assert.ok(
      !(
        EOF.codeAnalysis(
          concatBytes(eofHeader, Uint8Array.from([0x01, 0x00, 0x01, 0x00, 0x00, 0x00]))
        ) !== undefined
      ),
      'invalid container length (too long)'
    )
    assert.ok(
      !(
        EOF.codeAnalysis(concatBytes(eofHeader, Uint8Array.from([0x01, 0x00, 0x01, 0x00]))) !==
        undefined
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

    let res = await runTx(vm, '0x67ef0001010001000060005260086018f3', 0)
    assert.ok(res.code.length > 0, 'code section with no data section')

    res = await runTx(vm, '0x6BEF00010100010200010000AA600052600C6014F3', 1)
    assert.ok(res.code.length > 0, 'code section with data section')
  })

  it('invalid EOF format / contract creation', async () => {
    const vm = await VM.create({ common })
    await vm.stateManager.putAccount(sender, new Account())
    const account = await vm.stateManager.getAccount(sender)
    const balance = GWEI * BigInt(21000) * BigInt(10000000)
    account!.balance = balance
    await vm.stateManager.putAccount(sender, account!)

    let res = await runTx(vm, '0x60EF60005360016000F3', 0)
    assert.ok(res.code.length === 0, 'no magic')

    res = await runTx(
      vm,
      '0x7FEF0000000000000000000000000000000000000000000000000000000000000060005260206000F3',
      1
    )
    assert.ok(res.code.length === 0, 'invalid header')

    res = await runTx(
      vm,
      '0x7FEF0002000000000000000000000000000000000000000000000000000000000060005260206000F3',
      2
    )
    assert.ok(res.code.length === 0, 'valid header but invalid EOF version')

    res = await runTx(
      vm,
      '0x7FEF0001000000000000000000000000000000000000000000000000000000000060005260206000F3',
      3
    )
    assert.ok(res.code.length === 0, 'valid header and version but no code section')

    res = await runTx(
      vm,
      '0x7FEF0001030000000000000000000000000000000000000000000000000000000060005260206000F3',
      4
    )
    assert.ok(res.code.length === 0, 'valid header and version but unknown section type')

    res = await runTx(
      vm,
      '0x7FEF0001010002006000DEADBEEF0000000000000000000000000000000000000060005260206000F3',
      5
    )
    assert.ok(res.code.length === 0, 'code section with trailing bytes')
  })
})

function generateEOFCode(code: string): PrefixedHexString {
  const len = (code.length / 2).toString(16).padStart(4, '0')
  return `0xEF000101${len}00${code}`
}

function generateInvalidEOFCode(code: string): PrefixedHexString {
  const len = (code.length / 2 + 1).toString(16).padStart(4, '0') // len will be 1 too long
  return `0xEF000101${len}00${code}`
}

const offset = '13'
const CREATEDeploy = `0x60${offset}380360${offset}60003960${offset}380360006000F000`

const create2offset = '15'
const CREATE2Deploy = `0x600060${create2offset}380360${create2offset}60003960${create2offset}380360006000F500`

function deployCreateCode(initcode: string): PrefixedHexString {
  return `${CREATEDeploy}${initcode}` as PrefixedHexString
}

function deployCreate2Code(initcode: string): PrefixedHexString {
  return `${CREATE2Deploy}${initcode}` as PrefixedHexString
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

    const res = await runTx(vm, generateEOFCode('60016001F3'), 0)

    const res2 = await runTx(vm, generateInvalidEOFCode('60016001F3'), 1)
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

    const res = await runTx(vm, deployCreateCode(generateEOFCode('60016001F3').substring(2)), 0)

    const res2 = await runTx(
      vm,
      deployCreateCode(generateInvalidEOFCode('60016001F3').substring(2)),
      1
    )

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

    const res = await runTx(vm, deployCreate2Code(generateEOFCode('60016001F3').substring(2)), 0)

    const res2 = await runTx(
      vm,
      deployCreate2Code(generateInvalidEOFCode('60016001F3').substring(2)),
      1
    )
    assert.ok(
      res.result.totalGasSpent > res2.result.totalGasSpent,
      'invalid initcode did not consume all gas'
    )
  })
})
