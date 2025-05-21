import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { AccessList2930Tx, FeeMarket1559Tx, LegacyTx } from '@ethereumjs/tx'
import {
  Account,
  Address,
  Units,
  bigIntToBytes,
  createZeroAddress,
  hexToBytes,
  privateToAddress,
  setLengthLeft,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createVM, runTx } from '../../../src/index.ts'

import type { TransactionType, TypedTransaction } from '@ethereumjs/tx'

const common = new Common({
  eips: [1559, 2718, 2930],
  chain: Mainnet,
  hardfork: Hardfork.London,
})

// Small hack to hack in the activation block number
// (Otherwise there would be need for a custom chain only for testing purposes)
common.hardforkBlock = function (hardfork: string | undefined) {
  if (hardfork === 'london') {
    return BigInt(1)
  } else if (hardfork === 'dao') {
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
 * @param txType - the txType to use
 */
function makeBlock(baseFee: bigint, transaction: TypedTransaction, txType: TransactionType) {
  const signed = transaction.sign(pkey)
  const json = signed.toJSON()
  // @ts-expect-error -- Manually assigning type
  json.type = txType
  const block = createBlock(
    {
      header: {
        number: BigInt(1),
        coinbase,
        baseFeePerGas: baseFee,
        gasLimit: BigInt(500000),
      },
      transactions: [json],
    },
    { common },
  )
  return block
}

describe('EIP1559 tests', () => {
  it('test EIP1559 with all transaction types', async () => {
    const tx = new FeeMarket1559Tx(
      {
        maxFeePerGas: Units.gwei(5),
        maxPriorityFeePerGas: Units.gwei(2),
        to: createZeroAddress(),
        gasLimit: 21000,
      },
      {
        common,
      },
    )
    const block = makeBlock(Units.gwei(1), tx, 2)
    const vm = await createVM({ common })
    await vm.stateManager.putAccount(sender, new Account())
    let account = await vm.stateManager.getAccount(sender)
    const balance = Units.gwei(210000)
    account!.balance = balance
    await vm.stateManager.putAccount(sender, account!)
    const results = await runTx(vm, {
      tx: block.transactions[0],
      block,
    })

    // Situation:
    // Base fee is 1 GWEI
    // User is willing to pay at most 5 GWEI in the entire transaction
    // It is also willing to tip the miner 2 GWEI (at most)
    // Thus, miner should get 21000*2 GWei, and the 21000*1 GWei is burned

    let expectedCost = Units.gwei(21000) * BigInt(3)
    let expectedMinerBalance = Units.gwei(21000) * BigInt(2)
    let expectedAccountBalance = balance - expectedCost

    let miner = await vm.stateManager.getAccount(coinbase)

    assert.strictEqual(miner!.balance, expectedMinerBalance, 'miner balance correct')
    account = await vm.stateManager.getAccount(sender)
    assert.strictEqual(account!.balance, expectedAccountBalance, 'account balance correct')
    assert.strictEqual(results.amountSpent, expectedCost, 'reported cost correct')

    const tx2 = new AccessList2930Tx(
      {
        gasLimit: 21000,
        gasPrice: Units.gwei(5),
        to: createZeroAddress(),
      },
      { common },
    )
    const block2 = makeBlock(Units.gwei(1), tx2, 1)
    await vm.stateManager.modifyAccountFields(sender, { balance })
    await vm.stateManager.modifyAccountFields(coinbase, { balance: BigInt(0) })
    const results2 = await runTx(vm, {
      tx: block2.transactions[0],
      block: block2,
      skipNonce: true,
    })

    expectedCost = Units.gwei(21000) * BigInt(5)
    expectedMinerBalance = Units.gwei(21000) * BigInt(4)
    expectedAccountBalance = balance - expectedCost

    miner = await vm.stateManager.getAccount(coinbase)

    assert.strictEqual(miner!.balance, expectedMinerBalance, 'miner balance correct')
    account = await vm.stateManager.getAccount(sender)
    assert.strictEqual(account!.balance, expectedAccountBalance, 'account balance correct')
    assert.strictEqual(results2.amountSpent, expectedCost, 'reported cost correct')

    const tx3 = new LegacyTx(
      {
        gasLimit: 21000,
        gasPrice: Units.gwei(5),
        to: createZeroAddress(),
      },
      { common },
    )
    const block3 = makeBlock(Units.gwei(1), tx3, 0)
    await vm.stateManager.modifyAccountFields(sender, { balance })
    await vm.stateManager.modifyAccountFields(coinbase, { balance: BigInt(0) })
    const results3 = await runTx(vm, {
      tx: block3.transactions[0],
      block: block3,
      skipNonce: true,
    })

    expectedCost = Units.gwei(21000) * BigInt(5)
    expectedMinerBalance = Units.gwei(21000) * BigInt(4)
    expectedAccountBalance = balance - expectedCost

    miner = await vm.stateManager.getAccount(coinbase)

    assert.strictEqual(miner!.balance, expectedMinerBalance, 'miner balance correct')
    account = await vm.stateManager.getAccount(sender)
    assert.strictEqual(account!.balance, expectedAccountBalance, 'account balance correct')
    assert.strictEqual(results3.amountSpent, expectedCost, 'reported cost correct')
  })

  it('gasPrice uses the effective gas price', async () => {
    const contractAddress = new Address(hexToBytes(`0x${'20'.repeat(20)}`))
    const tx = new FeeMarket1559Tx(
      {
        maxFeePerGas: Units.gwei(5),
        maxPriorityFeePerGas: Units.gwei(2),
        to: contractAddress,
        gasLimit: 210000,
      },
      {
        common,
      },
    )
    const block = makeBlock(Units.gwei(1), tx, 2)
    const vm = await createVM({ common })
    const balance = Units.gwei(210000) * BigInt(10)
    await vm.stateManager.modifyAccountFields(sender, { balance })

    /**
     * GASPRICE
     * PUSH 0
     * MSTORE
     * PUSH 20
     * PUSH 0
     * RETURN
     */

    // (This code returns the reported GASPRICE)
    const code = hexToBytes('0x3A60005260206000F3')
    await vm.stateManager.putCode(contractAddress, code)

    const result = await runTx(vm, { tx: block.transactions[0], block })
    const returnValue = result.execResult.returnValue

    const expectedCost = Units.gwei(3)
    const expectedReturn = setLengthLeft(bigIntToBytes(expectedCost), 32)

    assert.deepEqual(returnValue, expectedReturn)
  })
})
