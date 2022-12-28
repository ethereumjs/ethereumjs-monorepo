import { Chain, Common, Hardfork } from '@ethereumjs/common'
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

function getInt16Str(int16: number) {
  const buf = Buffer.alloc(2)
  buf.writeInt16BE(int16)
  return buf.toString('hex')
}

function getRJUMPVCode(int16list: number[]) {
  if (int16list.length > 255) {
    throw new Error('does not fit')
  }
  let str = '5E' + int16list.length.toString(16).padStart(2, '0')
  for (const i of int16list) {
    str += getInt16Str(i)
  }
  return str
}

function getEOFCode(code: string) {
  // Assume: only one section
  const str =
    '0xEF0001010004020001' +
    (code.length / 2).toString(16).padStart(4, '0') +
    '03000000' +
    '00000000' +
    code
  return str
}

tape('EIP 3670 tests', (t) => {
  const common = new Common({
    chain: Chain.Mainnet,
    hardfork: Hardfork.London,
    eips: [3540, 5450, 3860, 5450, 4200, 4750, 3670],
  })

  t.test('valid eip-4200 eof code', async (st) => {
    const vm = await VM.create({ common })
    const account = await vm.stateManager.getAccount(sender)
    const balance = GWEI * BigInt(21000) * BigInt(10000000)
    account.balance = balance
    await vm.stateManager.putAccount(sender, account)
    let nonce = 0

    // Note: valid cases all have a format where the final opcode should be STOP
    // There is only one STOP opcode in the code, which thus means that code
    // arrived at the designated (wanted) stop opcode
    // Note: this also verifies that these EOF codes are correct (otherwise code will not run)
    const validCases = [
      // RJUMP
      // RJUMP, jump to JUMPDEST (0x5B)
      [getEOFCode('5B5C' + getInt16Str(1) + '5B5B00'), 'RJUMP to JUMPDEST, +1'],
      [getEOFCode('5B5C' + getInt16Str(0) + '5B5B00'), 'RJUMP to JUMPDEST, 0'],
      // Note: need to jump over `JUMPDEST STOP`, otherwise an infinite loop is created
      [
        getEOFCode('5C' + getInt16Str(2) + '5B005C' + getInt16Str(-5) + '5B5B00'),
        'RJUMP to JUMPDEST, -5',
      ],
      // RJUMP, jump to not-JUMPDEST (0x5B) (use `ADDRESS` (0x30) as dummy (valid) opcode)
      [getEOFCode('305C' + getInt16Str(1) + '303000'), 'RJUMP to another opcode than JUMPDEST, +1'],
      [getEOFCode('305C' + getInt16Str(0) + '303000'), 'RJUMP to another opcode than JUMPDEST, 0'],
      // Note: need to jump over `JUMPDEST STOP`, otherwise an infinite loop is created
      [
        getEOFCode('5C' + getInt16Str(2) + '30005C' + getInt16Str(-5) + '5B5B00'),
        'RJUMP to another opcode than JUMPDEST, -5',
      ],
      // RJUMPI
      // RJUMPI, jump to JUMPDEST (0x5B)
      [getEOFCode('5B60015D' + getInt16Str(1) + '5B5B00'), 'RJUMPI to JUMPDEST, +1'],
      [getEOFCode('5B60015D' + getInt16Str(0) + '5B5B00'), 'RJUMPI to JUMPDEST, 0'],
      // Note: need to jump over `JUMPDEST STOP`, otherwise an infinite loop is created
      [
        getEOFCode('5C' + getInt16Str(2) + '5B0060015D' + getInt16Str(-7) + '5B5B00'),
        'RJUMPI to JUMPDEST, -7',
      ],
      // RJUMPI, jump to JUMPDEST (0x5B)
      [getEOFCode('3060015D' + getInt16Str(1) + '303000'), 'RJUMPI to ADDRESS, +1'],
      [getEOFCode('3060015D' + getInt16Str(0) + '303000'), 'RJUMPI to ADDRESS, 0'],
      // Note: need to jump over `JUMPDEST STOP`, otherwise an infinite loop is created
      [
        getEOFCode('5C' + getInt16Str(2) + '300060015D' + getInt16Str(-7) + '303000'),
        'RJUMPI to ADDRESS, -7',
      ],
      // RJUMPI: 0 is pushed on stack, so code will just continue after RJUMPI
      [getEOFCode('60005D' + getInt16Str(1) + '006000FE'), 'RJUMPI, 0 is pushed on stack'],
      // RJUMPV to JUMPDEST (0x5B)
      [getEOFCode('60005B' + getRJUMPVCode([1]) + '5B5B00'), 'RJUMPV to JUMPDEST, +1'],
      [getEOFCode('60005B' + getRJUMPVCode([0]) + '5B5B00'), 'RJUMPV to JUMPDEST, 0'],
      [
        getEOFCode('5C' + getInt16Str(2) + '5B0060005B' + getRJUMPVCode([-9]) + '5B5B00'),
        'RJUMPV to JUMPDEST, -8',
      ],
      // To ADDRESS (0x30)
      [getEOFCode('600030' + getRJUMPVCode([1]) + '303000'), 'RJUMPV to ADDRESS, +1'],
      [getEOFCode('600030' + getRJUMPVCode([0]) + '303000'), 'RJUMPV to ADDRESS, 0'],
      [
        getEOFCode('5C' + getInt16Str(2) + '3000600030' + getRJUMPVCode([-9]) + '303000'),
        'RJUMPV to ADDRESS, -8',
      ],
      [getEOFCode('6001' + getRJUMPVCode([1]) + '00FE'), 'RJUMPV with case > count'],
      [getEOFCode('61FFFF' + getRJUMPVCode([1]) + '00FE'), 'RJUMPV with case > 255'],
    ]

    let lastOpcode = ''
    vm.evm.events!.on('step', (e) => {
      lastOpcode = e.opcode.name
    })

    for (const validCase of validCases) {
      const { result } = await runTx(vm, validCase[0], nonce++)
      st.ok(result.execResult.exceptionError === undefined && lastOpcode === 'STOP', validCase[1])
      break
    }

    // RJUMPV test for cases between 2 and 255 cases
    // It tests random indices for each of these table sizes
    // Includes SSTOREs so we are sure we jump to the right location
    for (let jumptableSize = 2; jumptableSize <= 255; jumptableSize++) {
      let eCode = ''
      const arr: number[] = []
      for (let i = 0; i < jumptableSize; i++) {
        arr.push(i * 6)
      }
      eCode += getRJUMPVCode(arr)
      for (let i = 0; i < jumptableSize; i++) {
        const index = i.toString(16).padStart(2, '0')
        // PUSH index PUSH 0 SSTORE STOP
        eCode += '60' + index + '60005500'
      }
      for (let jumptableIndex = 0; jumptableIndex < jumptableSize; ) {
        const jumpCase = jumptableIndex.toString(16).padStart(2, '0')
        const code = '60' + jumpCase + eCode
        const { result } = await runTx(vm, getEOFCode(code), nonce++)
        const value = await vm.stateManager.getContractStorage(
          result.createdAddress!,
          Buffer.from('00'.repeat(32), 'hex')
        )
        const expected = jumptableIndex === 0 ? '' : jumptableIndex.toString(16).padStart(2, '0')
        st.ok(
          value.toString('hex') === expected,
          'rjumpv size ' + jumptableSize + ' index ' + jumptableIndex + ' valid'
        )
        jumptableIndex += Math.ceil(Math.random() * 30)
      }
    }
  })

  t.test('eip-4200 is invalid opcode in legacy bytecode', async (st) => {
    const vm = await VM.create({ common })
    const account = await vm.stateManager.getAccount(sender)
    const balance = GWEI * BigInt(21000) * BigInt(10000000)
    account.balance = balance
    await vm.stateManager.putAccount(sender, account)
    let nonce = 0

    const codes = [
      ['0x5C000000', 'RJUMP'],
      ['0x60015D000000', 'RJUMPI'],
      ['0x6000' + getRJUMPVCode([0]) + '00', 'RJUMPV'],
    ]

    for (const code of codes) {
      const { result } = await runTx(vm, code[0], nonce++)
      st.ok(result.execResult.exceptionError!.error === 'invalid opcode', code[1])
    }
  })
  t.test('eip-4200 invalid eof format tests', async (st) => {
    const vm = await VM.create({ common })
    const account = await vm.stateManager.getAccount(sender)
    const balance = GWEI * BigInt(21000) * BigInt(10000000)
    account.balance = balance
    await vm.stateManager.putAccount(sender, account)
    let nonce = 0

    const codes = [
      ['5C00', 'truncated RJUMP'],
      ['5D00', 'truncated RJUMPI'],
      ['5E0100', 'truncated RJUMPV (count 1)'],
      ['5E02000000', 'truncated RJUMPV (count 2)'],
      ['5C' + getInt16Str(2) + '5B005C' + getInt16Str(-5), 'RJUMP as final instruction'],
      ['5C' + getInt16Str(2) + '5B0060015D' + getInt16Str(-7), 'RJUMPI as final instruction'],
      ['5C' + getInt16Str(2) + '5B0060005B' + getRJUMPVCode([-9]), 'RJUMPV as final instruction'],
      ['5C' + getInt16Str(1) + '00', 'RJUMP targets code outside container'],
      ['60015D' + getInt16Str(1) + '00', 'RJUMPI targets code outside container'],
      ['6000' + getRJUMPVCode([1]) + '00', 'RJUMPV targets code outside container'],
      ['5C' + getInt16Str(-4) + '00', 'RJUMP targets code outside container (negative target))'],
      [
        '60015D' + getInt16Str(-6) + '00',
        'RJUMPI targets code outside container (negative target)',
      ],
      [
        '6000' + getRJUMPVCode([-9]) + '00',
        'RJUMPV targets code outside container (negative target)',
      ],
      ['5C' + getInt16Str(1) + '600000', 'RJUMP targets PUSH data'],
      ['60015D' + getInt16Str(1) + '600000', 'RJUMPI targets PUSH data'],
      ['6000' + getRJUMPVCode([1]) + '600000', 'RJUMPV targets PUSH data'],
      ['5C' + getInt16Str(1) + '5C000000', 'RJUMP targets RJUMP immediate'],
      ['5C' + getInt16Str(1) + '5D000000', 'RJUMP targets RJUMPI immediate'],
      ['5C' + getInt16Str(1) + getRJUMPVCode([0]) + '00', 'RJUMP targets RJUMPV immediate'],
      ['5D' + getInt16Str(1) + '5C000000', 'RJUMPI targets RJUMP immediate'],
      ['5D' + getInt16Str(1) + '5D000000', 'RJUMPI targets RJUMPI immediate'],
      ['5D' + getInt16Str(1) + getRJUMPVCode([0]) + '00', 'RJUMPI targets RJUMPV immediate'],
      [getRJUMPVCode([1]) + '5C000000', 'RJUMPV targets RJUMP immediate'],
      [getRJUMPVCode([1]) + '5D000000', 'RJUMPV targets RJUMPI immediate'],
      [getRJUMPVCode([1]) + getRJUMPVCode([0]) + '00', 'RJUMPV targets RJUMPV immediate'],
      ['5E000000', 'RJUMPV with count 0'],
    ]

    for (const code of codes) {
      const { result } = await runTx(vm, getEOFCode(code[0]), nonce++)
      st.ok(result.execResult.exceptionError!.error === 'invalid EOF format', code[1])
    }
  })
})
