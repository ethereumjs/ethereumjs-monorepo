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
  const magic = '0xEF000101'
  const len = code.length / 2
  const lenHex = len.toString(16)
  return magic + lenHex.padStart(4, '0') + '00' + code
}

tape('EIP 3670 tests', (t) => {
  const common = new Common({
    chain: Chain.Mainnet,
    hardfork: Hardfork.London,
    eips: [3540, 3670, 4200],
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
      // RJUMP, jump to JUMPDEST
      [getEOFCode('5B5C' + getInt16Str(1) + '5B5B00'), 'RJUMP to JUMPDEST, +1'],
      [getEOFCode('5B5C' + getInt16Str(0) + '5B5B00'), 'RJUMP to JUMPDEST, 0'],
      // Note: need to jump over `JUMPDEST STOP`, otherwise an infinite loop is created
      [
        getEOFCode('5C' + getInt16Str(2) + '5B005C' + getInt16Str(-5) + '5B5B00'),
        'RJUMP to JUMPDEST, -5',
      ],
      // RJUMP, jump to not-JUMPDEST (use `ADDRESS` (0x30) as dummy (valid) opcode)
      [getEOFCode('305C' + getInt16Str(1) + '303000'), 'RJUMP to another opcode than JUMPDEST, +1'],
      [getEOFCode('305C' + getInt16Str(0) + '303000'), 'RJUMP to another opcode than JUMPDEST, 0'],
      // Note: need to jump over `JUMPDEST STOP`, otherwise an infinite loop is created
      [
        getEOFCode('5C' + getInt16Str(2) + '30005C' + getInt16Str(-5) + '5B5B00'),
        'RJUMP to another opcode than JUMPDEST, -5',
      ],
      // RJUMPI
      // RJUMPI, jump to JUMPDEST
      [getEOFCode('5B60015D' + getInt16Str(1) + '5B5B00'), 'RJUMPI to JUMPDEST, +1'],
      [getEOFCode('5B60015D' + getInt16Str(0) + '5B5B00'), 'RJUMPI to JUMPDEST, 0'],
      // Note: need to jump over `JUMPDEST STOP`, otherwise an infinite loop is created
      [
        getEOFCode('5C' + getInt16Str(2) + '5B0060015D' + getInt16Str(-7) + '5B5B00'),
        'RJUMPI to JUMPDEST, -7',
      ],
      // RJUMPI, jump to JUMPDEST
      [getEOFCode('3060015D' + getInt16Str(1) + '303000'), 'RJUMPI to ADDRESS, +1'],
      [getEOFCode('3060015D' + getInt16Str(0) + '303000'), 'RJUMPI to ADDRESS, 0'],
      // Note: need to jump over `JUMPDEST STOP`, otherwise an infinite loop is created
      [
        getEOFCode('5C' + getInt16Str(2) + '300060015D' + getInt16Str(-7) + '303000'),
        'RJUMPI to ADDRESS, -7',
      ],
      // RJUMPI: 0 is pushed on stack, so code will just continue after RJUMPI
      [getEOFCode('60005D' + getInt16Str(1) + '006000FE'), 'RJUMPI, 0 is pushed on stack'],
      // RJUMPV
      [getEOFCode('60005B' + getRJUMPVCode([1]) + '5B5B00'), 'RJUMPV to JUMPDEST, +1'],
    ]

    let lastOpcode = ''
    vm.evm.events!.on('step', (e) => {
      console.log(e.opcode.name)
      lastOpcode = e.opcode.name
    })

    for (const validCase of validCases) {
      const { result } = await runTx(vm, validCase[0], nonce++)
      st.ok(result.execResult.exceptionError === undefined && lastOpcode === 'STOP', validCase[1])
    }
  })
})
