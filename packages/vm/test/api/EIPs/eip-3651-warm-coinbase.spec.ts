import { Block } from '@ethereumjs/block'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { LegacyTransaction } from '@ethereumjs/tx'
import { Account, Address, privateToAddress } from '@ethereumjs/util'
import { hexToBytes } from 'ethereum-cryptography/utils'
import { assert, describe, it } from 'vitest'

import { VM } from '../../../src/vm'
const pkey = hexToBytes('20'.repeat(32))
const GWEI = BigInt(1000000000)
const sender = new Address(privateToAddress(pkey))

const coinbase = new Address(hexToBytes('ff'.repeat(20)))

const common = new Common({
  chain: Chain.Mainnet,
  hardfork: Hardfork.London,
  eips: [3651],
})

const block = Block.fromBlockData(
  {
    header: {
      baseFeePerGas: 7,
      coinbase,
    },
  },
  { common }
)

const code = hexToBytes('60008080806001415AF100')
const contractAddress = new Address(hexToBytes('ee'.repeat(20)))

async function getVM(common: Common) {
  const vm = await VM.create({ common })
  await vm.stateManager.putAccount(sender, new Account())
  const account = await vm.stateManager.getAccount(sender)
  const balance = GWEI * BigInt(21000) * BigInt(10000000)
  account!.balance = balance
  await vm.stateManager.putAccount(sender, account!)

  await vm.stateManager.putContractCode(contractAddress, code)
  return vm
}

describe('EIP 3651 tests', () => {
  it('invalid contract code transactions', async () => {
    const vm = await getVM(common)

    const tx = LegacyTransaction.fromTxData({
      to: contractAddress,
      value: 1,
      gasLimit: 1000000,
      gasPrice: 10,
    }).sign(pkey)

    const result = await vm.runTx({
      block,
      tx,
      skipHardForkValidation: true,
    })

    const vm2 = await getVM(
      new Common({
        chain: Chain.Mainnet,
        hardfork: Hardfork.London,
      })
    )

    const result2 = await vm2.runTx({ block, tx, skipHardForkValidation: true })
    const expectedDiff =
      common.param('gasPrices', 'coldaccountaccess')! -
      common.param('gasPrices', 'warmstorageread')!
    assert.equal(
      result2.totalGasSpent - result.totalGasSpent,
      expectedDiff,
      'gas difference is correct'
    )
  })
})
