import { Block } from '@ethereumjs/block'
import { Blockchain } from '@ethereumjs/blockchain'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { decode } from '@ethereumjs/rlp'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import {
  Account,
  Address,
  GWEI_TO_WEI,
  KECCAK256_RLP,
  Withdrawal,
  parseGethGenesisState,
  zeros,
} from '@ethereumjs/util'
import { bytesToHex, hexToBytes, toHex } from 'ethereum-cryptography/utils'
import { assert, describe, it } from 'vitest'

import genesisJSON = require('../../../../client/test/testdata/geth-genesis/withdrawals.json')
import { VM } from '../../../src/vm'

import type { WithdrawalBytes, WithdrawalData } from '@ethereumjs/util'

const common = new Common({
  chain: Chain.Mainnet,
  hardfork: Hardfork.Paris,
  eips: [4895],
})

const pkey = hexToBytes('20'.repeat(32))
const gethWithdrawals8BlockRlp =
  'f903e1f90213a0fe950635b1bd2a416ff6283b0bbd30176e1b1125ad06fa729da9f3f4c1c61710a01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d4934794aa00000000000000000000000000000000000000a07f7510a0cb6203f456e34ec3e2ce30d6c5590ded42c10a9cf3f24784119c5afba056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421a056e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421b901000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080018401c9c380802f80a0ff0000000000000000000000000000000000000000000000000000000000000088000000000000000007a0b695b29ec7ee934ef6a68838b13729f2d49fffe26718de16a1a9ed94a4d7d06dc0c0f901c6da8082ffff94000000000000000000000000000000000000000080f83b0183010000940100000000000000000000000000000000000000a00100000000000000000000000000000000000000000000000000000000000000f83b0283010001940200000000000000000000000000000000000000a00200000000000000000000000000000000000000000000000000000000000000f83b0383010002940300000000000000000000000000000000000000a00300000000000000000000000000000000000000000000000000000000000000f83b0483010003940400000000000000000000000000000000000000a00400000000000000000000000000000000000000000000000000000000000000f83b0583010004940500000000000000000000000000000000000000a00500000000000000000000000000000000000000000000000000000000000000f83b0683010005940600000000000000000000000000000000000000a00600000000000000000000000000000000000000000000000000000000000000f83b0783010006940700000000000000000000000000000000000000a00700000000000000000000000000000000000000000000000000000000000000'

describe('EIP4895 tests', () => {
  it('EIP4895: withdrawals execute as expected', async () => {
    const vm = await VM.create({ common })
    const withdrawals = <WithdrawalData[]>[]
    const addresses = ['20'.repeat(20), '30'.repeat(20), '40'.repeat(20)]
    const amounts = [BigInt(1000), BigInt(3000), BigInt(5000)]

    /*
      Setup a contract at the second withdrawal address with code:
        PUSH 2
        PUSH 0
        SSTORE
      If code is ran, this stores "2" at slot "0". Check if withdrawal operations do not invoke this code
    */
    const withdrawalCheckAddress = new Address(hexToBytes('fe'.repeat(20)))
    const withdrawalCode = hexToBytes('6002600055')

    await vm.stateManager.putContractCode(withdrawalCheckAddress, withdrawalCode)

    const contractAddress = new Address(hexToBytes('ff'.repeat(20)))

    /*
        PUSH <addresses[0]>
        BALANCE // Retrieve balance of addresses[0]
        PUSH 0
        MSTORE // Store balance in memory at pos 0
        PUSH 20
        PUSH 0
        RETURN // Return the balance
    */
    const contract = '73' + addresses[0] + '3160005260206000F3'
    await vm.stateManager.putContractCode(contractAddress, hexToBytes(contract))

    const transaction = FeeMarketEIP1559Transaction.fromTxData({
      to: contractAddress,
      maxFeePerGas: BigInt(7),
      maxPriorityFeePerGas: BigInt(0),
      gasLimit: BigInt(50000),
    }).sign(pkey)

    await vm.stateManager.putAccount(transaction.getSenderAddress(), new Account())
    const account = await vm.stateManager.getAccount(transaction.getSenderAddress())
    account!.balance = BigInt(1000000)
    await vm.stateManager.putAccount(transaction.getSenderAddress(), account!)

    let index = 0
    for (let i = 0; i < addresses.length; i++) {
      // Just assign any number to validatorIndex as its just for CL convenience
      withdrawals.push({
        index,
        validatorIndex: index,
        address: new Address(hexToBytes(addresses[i])),
        amount: amounts[i],
      })
      index++
    }
    const block = Block.fromBlockData(
      {
        header: {
          baseFeePerGas: BigInt(7),
          withdrawalsRoot: hexToBytes(
            '267414525d22e2be123b619719b92c561f31e0cdd40959148230f5713aecd6b8'
          ),
          transactionsTrie: hexToBytes(
            '9a744e8acc2886e5809ff013e3b71bf8ec97f9941cafbd7730834fc8f76391ba'
          ),
        },
        transactions: [transaction],
        withdrawals,
      },
      { common: vm._common }
    )

    let result: Uint8Array
    vm.events.on('afterTx', (e) => {
      result = e.execResult.returnValue
    })

    await vm.runBlock({ block, generate: true })

    for (let i = 0; i < addresses.length; i++) {
      const address = new Address(hexToBytes(addresses[i]))
      const amount = amounts[i]
      const balance = (await vm.stateManager.getAccount(address))!.balance
      assert.equal(BigInt(amount) * GWEI_TO_WEI, balance, 'balance ok')
    }

    assert.deepEqual(zeros(32), result!, 'withdrawals happen after transactions')

    const slotValue = await vm.stateManager.getContractStorage(withdrawalCheckAddress, zeros(32))
    assert.deepEqual(zeros(0), slotValue, 'withdrawals do not invoke code')
  })

  it('EIP4895: state updation should exclude 0 amount updates', async () => {
    const vm = await VM.create({ common })

    await vm.stateManager.generateCanonicalGenesis(parseGethGenesisState(genesisJSON))
    const preState = toHex(await vm.stateManager.getStateRoot())
    assert.equal(
      preState,
      'ca3149fa9e37db08d1cd49c9061db1002ef1cd58db2210f2115c8c989b2bdf45',
      'preState should be correct'
    )

    const gethBlockBufferArray = decode(hexToBytes(gethWithdrawals8BlockRlp))
    const withdrawals = (gethBlockBufferArray[3] as WithdrawalBytes[]).map((wa) =>
      Withdrawal.fromValuesArray(wa)
    )
    assert.equal(withdrawals[0].amount, BigInt(0), 'withdrawal 0 should have 0 amount')
    let block: Block
    let postState: string

    // construct a block with just the 0th withdrawal should have no effect on state
    block = Block.fromBlockData(
      {
        header: {
          baseFeePerGas: BigInt(7),
          withdrawalsRoot: await Block.genWithdrawalsTrieRoot(withdrawals.slice(0, 1)),
          transactionsTrie: KECCAK256_RLP,
        },
        transactions: [],
        withdrawals: withdrawals.slice(0, 1),
      },
      { common: vm._common }
    )
    postState = toHex(await vm.stateManager.getStateRoot())

    await vm.runBlock({ block, generate: true })
    assert.equal(
      postState,
      'ca3149fa9e37db08d1cd49c9061db1002ef1cd58db2210f2115c8c989b2bdf45',
      'post state should not change'
    )

    // construct a block with all the withdrawals
    block = Block.fromBlockData(
      {
        header: {
          baseFeePerGas: BigInt(7),
          withdrawalsRoot: await Block.genWithdrawalsTrieRoot(withdrawals),
          transactionsTrie: KECCAK256_RLP,
        },
        transactions: [],
        withdrawals,
      },
      { common: vm._common }
    )
    await vm.runBlock({ block, generate: true })
    postState = toHex(await vm.stateManager.getStateRoot())
    assert.equal(
      postState,
      '23eadd91fca55c0e14034e4d63b2b3ed43f2e807b6bf4d276b784ac245e7fa3f',
      'post state should match'
    )
  })

  it('should build a block correctly with withdrawals', async () => {
    const common = Common.fromGethGenesis(genesisJSON, { chain: 'custom' })
    common.setHardfork(Hardfork.Shanghai)
    const genesisState = parseGethGenesisState(genesisJSON)
    const blockchain = await Blockchain.create({
      common,
      validateBlocks: false,
      validateConsensus: false,
      genesisState,
      hardforkByHeadBlockNumber: true,
    })
    const genesisBlock = blockchain.genesisBlock
    assert.equal(
      bytesToHex(genesisBlock.header.stateRoot),
      'ca3149fa9e37db08d1cd49c9061db1002ef1cd58db2210f2115c8c989b2bdf45',
      'correct state root should be generated'
    )
    const vm = await VM.create({ common, blockchain })
    await vm.stateManager.generateCanonicalGenesis(parseGethGenesisState(genesisJSON))
    const vmCopy = await vm.copy()

    const gethBlockBufferArray = decode(hexToBytes(gethWithdrawals8BlockRlp))
    const withdrawals = (gethBlockBufferArray[3] as WithdrawalBytes[]).map((wa) =>
      Withdrawal.fromValuesArray(wa)
    )
    const td = await blockchain.getTotalDifficulty(genesisBlock.hash())

    const blockBuilder = await vm.buildBlock({
      parentBlock: genesisBlock,
      withdrawals,
      blockOpts: {
        calcDifficultyFromHeader: genesisBlock.header,
        freeze: false,
        setHardfork: td,
      },
    })

    const block = await blockBuilder.build()

    assert.equal(
      bytesToHex(block.header.stateRoot),
      '23eadd91fca55c0e14034e4d63b2b3ed43f2e807b6bf4d276b784ac245e7fa3f',
      'correct state root should be generated'
    )

    // block should successfully execute with VM.runBlock and have same outputs
    const result = await vmCopy.runBlock({ block })
    assert.equal(result.gasUsed, block.header.gasUsed)
    assert.deepEqual(result.receiptsRoot, block.header.receiptTrie)
    assert.deepEqual(result.stateRoot, block.header.stateRoot)
    assert.deepEqual(result.logsBloom, block.header.logsBloom)
  })
})
