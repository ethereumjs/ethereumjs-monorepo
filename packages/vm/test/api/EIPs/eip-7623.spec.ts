import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import { Account, Address, createZeroAddress, hexToBytes, privateToAddress } from '@ethereumjs/util'
import { describe, it } from 'vitest'

import { createVM, runTx } from '../../../src/index.js'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Prague })

const pkey = hexToBytes(`0x${'20'.repeat(32)}`)
const GWEI = BigInt(1000000000)
const sender = new Address(privateToAddress(pkey))

const coinbase = new Address(hexToBytes(`0x${'ff'.repeat(20)}`))

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
  const vm = await createVM({ common })
  await vm.stateManager.putAccount(sender, new Account())
  const account = await vm.stateManager.getAccount(sender)
  const balance = GWEI * BigInt(21000) * BigInt(10000000)
  account!.balance = balance
  await vm.stateManager.putAccount(sender, account!)

  await vm.stateManager.putCode(contractAddress, code)
  return vm
}

describe('EIP 7623 calldata cost increase tests', () => {
  it('charges floor gas', async () => {
    const vm = await getVM(common)

    const tx = createLegacyTx(
      {
        to: createZeroAddress(),
        data: new Uint8Array(100).fill(1),
        gasLimit: 1000000,
        gasPrice: 10,
      },
      { common },
    ).sign(pkey)

    const result = await runTx(vm, {
      block,
      tx,
      skipHardForkValidation: true,
    })

    const baseCost = tx.common.param('txGas')
    const floorCost = tx.common.param('totalCostFloorPerToken')

    const expected = baseCost + BigInt(tx.data.length) * BigInt(4) * floorCost
  })
  it('rejects transactions having a gas limit below the floor gas limit', () => {})
  it('correctly charges execution gas instead of floor gas when execution gas exceeds the floor gas', () => {})
})
