import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { FeeMarket1559Tx } from '@ethereumjs/tx'
import { Address, Units, hexToBytes, privateToAddress } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createVM, runTx } from '../../../src/index.ts'

import type { InterpreterStep } from '@ethereumjs/evm'
import type { TypedTransaction } from '@ethereumjs/tx'

const common = new Common({
  eips: [1559, 2718, 2930, 3198],
  chain: Mainnet,
  hardfork: Hardfork.London,
})

// Small hack to hack in the activation block number
// (Otherwise there would be need for a custom chain only for testing purposes)
common.hardforkBlock = function (hardfork: Hardfork | undefined) {
  if (hardfork === Hardfork.London) {
    return BigInt(1)
  } else if (hardfork === Hardfork.Dao) {
    // Avoid DAO HF side-effects
    return BigInt(99)
  }
  return BigInt(0)
}

const coinbase = new Address(hexToBytes(`0x${'11'.repeat(20)}`))
const pkey = hexToBytes(`0x${'20'.repeat(32)}`)
const sender = new Address(privateToAddress(pkey))

/**
 * Creates an EIP1559 block
 * @param baseFee - base fee of the block
 * @param transaction - the transaction in the block
 */
function makeBlock(baseFee: bigint, transaction: TypedTransaction) {
  const signed = transaction.sign(pkey)
  const json = signed.toJSON()

  const block = createBlock(
    {
      header: {
        number: BigInt(1),
        coinbase,
        baseFeePerGas: baseFee,
        gasLimit: 500000,
      },
      transactions: [json],
    },
    { common },
  )
  return block
}

describe('EIP3198 tests', () => {
  it('test EIP3198 gas fee and correct value', async () => {
    // Initial base fee for EIP1559
    const fee = BigInt(1000000000)
    const tx = new FeeMarket1559Tx(
      {
        maxFeePerGas: Units.gwei(5),
        maxPriorityFeePerGas: Units.gwei(2),
        to: undefined, // Create contract
        gasLimit: BigInt(210000),
        data: '0x4800',
      },
      {
        common,
      },
    )
    const block = makeBlock(fee, tx)
    const vm = await createVM({ common })
    await vm.stateManager.modifyAccountFields(sender, { balance: Units.ether(1) })

    // Track stack

    let stack: bigint[] = []
    const handler = (iStep: InterpreterStep) => {
      if (iStep.opcode.name === 'STOP') {
        stack = iStep.stack
      }
    }
    vm.evm.events!.on('step', handler)

    const results = await runTx(vm, {
      tx: block.transactions[0],
      block,
    })
    const txBaseFee = block.transactions[0].getIntrinsicGas()
    const gasUsed = results.totalGasSpent - txBaseFee
    assert.strictEqual(gasUsed, BigInt(2), 'gas used correct')
    assert.strictEqual(stack[0], fee, 'right item pushed on stack')
    vm.evm.events!.removeListener('step', handler)
  })
})
