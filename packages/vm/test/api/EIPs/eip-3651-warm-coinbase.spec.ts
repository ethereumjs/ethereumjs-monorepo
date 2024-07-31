import { createBlock } from '@ethereumjs/block'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import { Account, Address, hexToBytes, privateToAddress } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { VM, runTx } from '../../../src/index.js'
const pkey = hexToBytes(`0x${'20'.repeat(32)}`)
const GWEI = BigInt(1000000000)
const sender = new Address(privateToAddress(pkey))

const coinbase = new Address(hexToBytes(`0x${'ff'.repeat(20)}`))

const common = new Common({
  chain: Chain.Mainnet,
  hardfork: Hardfork.London,
  eips: [3651],
})

const block = createBlock(
  {
    header: {
      baseFeePerGas: 7,
      coinbase,
    },
  },
  { common },
)

const code = hexToBytes('0x60008080806001415AF100')
const contractAddress = new Address(hexToBytes(`0x${'ee'.repeat(20)}`))

async function getVM(common: Common) {
  const vm = await VM.create({ common })
  await vm.stateManager.putAccount(sender, new Account())
  const account = await vm.stateManager.getAccount(sender)
  const balance = GWEI * BigInt(21000) * BigInt(10000000)
  account!.balance = balance
  await vm.stateManager.putAccount(sender, account!)

  await vm.stateManager.putCode(contractAddress, code)
  return vm
}

describe('EIP 3651 tests', () => {
  it('invalid contract code transactions', async () => {
    const vm = await getVM(common)

    const tx = createLegacyTx({
      to: contractAddress,
      value: 1,
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(pkey)

    const result = await runTx(vm, {
      block,
      tx,
      skipHardForkValidation: true,
    })

    const vm2 = await getVM(
      new Common({
        chain: Chain.Mainnet,
        hardfork: Hardfork.London,
      }),
    )

    const result2 = await runTx(vm2, { block, tx, skipHardForkValidation: true })
    const expectedDiff = common.param('coldaccountaccessGas')! - common.param('warmstoragereadGas')!
    assert.equal(
      result2.totalGasSpent - result.totalGasSpent,
      expectedDiff,
      'gas difference is correct',
    )
  })
})
