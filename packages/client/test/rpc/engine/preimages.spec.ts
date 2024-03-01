import { Block, BlockHeader } from '@ethereumjs/block'
import { TransactionFactory } from '@ethereumjs/tx'
import {
  Withdrawal,
  bytesToHex,
  equalsBytes,
  hexToBytes,
  intToBytes,
  intToHex,
  setLengthRight,
} from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak.js'
import * as td from 'testdouble'
import { assert, describe, it } from 'vitest'

import { blockToExecutionPayload } from '../../../src/rpc/modules/index.js'
import blocks from '../../testdata/blocks/kaustinen2.json'
import genesisJSON from '../../testdata/geth-genesis/kaustinen2.json'
import { getRpcClient, setupChain } from '../helpers.js'

import type { Common } from '@ethereumjs/common'
import type { PrefixedHexString } from '@ethereumjs/util'
import type { HttpClient } from 'jayson/promise'

const genesisStateRoot = '0x78026f1e4f2ff57c340634f844f47cb241beef4c965be86a483c855793e4b07d'
const genesisBlockHash = '0x76a519ccb8a2b12d733ad7d88e2d5f4a11d6dc6ca320edccd3b8a3e9081ca1b3'

const originalValidate = (BlockHeader as any).prototype._consensusFormatValidation
BlockHeader.prototype['_consensusFormatValidation'] = () => {} //stub

async function genBlockWithdrawals(blockNumber: number) {
  // if block 1, bundle 0 withdrawals
  const withdrawals =
    blockNumber === 1
      ? []
      : Array.from({ length: 8 }, (_v, i) => {
          const withdrawalIndex = blockNumber * 16 + i

          // just return a withdrawal based on withdrawalIndex
          return {
            index: intToHex(withdrawalIndex),
            validatorIndex: intToHex(withdrawalIndex),
            address: bytesToHex(setLengthRight(intToBytes(withdrawalIndex), 20)),
            amount: intToHex(withdrawalIndex),
          }
        })
  const withdrawalsRoot = bytesToHex(
    await Block.genWithdrawalsTrieRoot(withdrawals.map(Withdrawal.fromWithdrawalData))
  )

  return { withdrawals, withdrawalsRoot }
}

async function runBlock(
  { common, rpc }: { common: Common; rpc: HttpClient },
  runData: {
    parentHash: PrefixedHexString
    transactions: PrefixedHexString[]
    blockNumber: PrefixedHexString
    stateRoot: PrefixedHexString
    receiptTrie: PrefixedHexString
    gasUsed: PrefixedHexString
    coinbase: PrefixedHexString
  }
) {
  const { transactions, parentHash, blockNumber, stateRoot, receiptTrie, gasUsed, coinbase } =
    runData
  const txs = []
  for (const [index, serializedTx] of transactions.entries()) {
    try {
      const tx = TransactionFactory.fromSerializedData(hexToBytes(serializedTx), {
        common,
      })
      txs.push(tx)
    } catch (error) {
      const validationError = `Invalid tx at index ${index}: ${error}`
      throw validationError
    }
  }
  const transactionsTrie = bytesToHex(await Block.genTransactionsTrieRoot(txs))

  const { withdrawals, withdrawalsRoot } = await genBlockWithdrawals(Number(blockNumber))

  const headerData = {
    parentHash,
    number: blockNumber,
    withdrawalsRoot,
    transactionsTrie,
    stateRoot,
    receiptTrie,
    gasUsed,
    coinbase,
  }
  const blockData = { header: headerData, transactions: txs, withdrawals }
  const executeBlock = Block.fromBlockData(blockData, { common })
  const executePayload = blockToExecutionPayload(executeBlock, BigInt(0)).executionPayload
  const res = await rpc.request('engine_newPayloadV2', [executePayload])
  assert.equal(res.result.status, 'VALID', 'valid status should be received')
  return executePayload
}

describe(`valid verkle network setup`, async () => {
  // unschedule verkle
  const unschedulePragueJson = {
    ...genesisJSON,
    config: { ...genesisJSON.config, pragueTime: undefined },
  }
  const { server, chain, common, execution } = await setupChain(
    unschedulePragueJson,
    'post-merge',
    {
      engine: true,
      savePreimages: true,
    }
  )
  ;(chain.blockchain as any).validateHeader = () => {}

  const rpc = getRpcClient(server)
  it('genesis should be correctly setup', async () => {
    const res = await rpc.request('eth_getBlockByNumber', ['0x0', false])

    const block0 = res.result
    assert.equal(block0.hash, genesisBlockHash)
    assert.equal(block0.stateRoot, genesisStateRoot)
  })

  // build some testcases uses some transactions from kaustinen2 which have
  // normal txs, contract fail, contract success tx, although kaustinen2
  // is verkle, but we run the tests in the merkle (pre-verkle) setup
  //
  // withdrawals are generated and bundled using genBlockWithdrawals util
  // and for block1 are coded to return no withdrawals
  //
  // third consideration is for feerecipient which are added here as random
  // coinbase addrs
  const testCases = [
    {
      name: 'block 1 no txs',
      blockData: {
        transactions: [] as string[],
        blockNumber: '0x01',
        stateRoot: '0x78026f1e4f2ff57c340634f844f47cb241beef4c965be86a483c855793e4b07d',
        receiptTrie: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
        gasUsed: '0x0',
        coinbase: '0x78026f1e4f2ff57c340634f844f47cb241beef4c',
      },
      preimages: [
        // coinbase
        '0x78026f1e4f2ff57c340634f844f47cb241beef4c',
        // no withdrawals
        // no tx accesses
      ],
    },
    {
      name: 'block 2 having kaustinen2 block 12 txs',
      blockData: {
        transactions: blocks.block12.execute.transactions,
        blockNumber: '0x02',
        stateRoot: '0xa86d54279c8faebed72e112310b29115d3600e8cc6ff2a2e4466a788b8776ad9',
        receiptTrie: '0xd95b673818fa493deec414e01e610d97ee287c9421c8eff4102b1647c1a184e4',
        gasUsed: '0xa410',
        coinbase: '0x9da2abca45e494476a21c49982619ee038b68556',
      },
      // add preimages for addresses accessed in txs
      preimages: [
        // coinbase
        '0x9da2abca45e494476a21c49982619ee038b68556',
        // withdrawals
        '0x2000000000000000000000000000000000000000',
        '0x2100000000000000000000000000000000000000',
        '0x2200000000000000000000000000000000000000',
        '0x2300000000000000000000000000000000000000',
        '0x2400000000000000000000000000000000000000',
        '0x2500000000000000000000000000000000000000',
        '0x2600000000000000000000000000000000000000',
        '0x2700000000000000000000000000000000000000',
        // txs
        '0x7e454a14b8e7528465eef86f0dc1da4f235d9d79',
        '0x6177843db3138ae69679a54b95cf345ed759450d',
        '0x687704db07e902e9a8b3754031d168d46e3d586e',
      ],
    },
    {
      name: 'block 3 no txs with just withdrawals but zero coinbase',
      blockData: {
        transactions: [] as string[],
        blockNumber: '0x03',
        stateRoot: '0xe4538f9d7531eb76e82edf7480e4578bc2be5f454ab02db4d9db6187dfa1f9ca',
        receiptTrie: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
        gasUsed: '0x0',
        coinbase: '0x0000000000000000000000000000000000000000',
      },
      preimages: [
        // coinbase
        '0x0000000000000000000000000000000000000000',
        // withdrawals,
        '0x3000000000000000000000000000000000000000',
        '0x3100000000000000000000000000000000000000',
        '0x3200000000000000000000000000000000000000',
        '0x3300000000000000000000000000000000000000',
        '0x3400000000000000000000000000000000000000',
        '0x3500000000000000000000000000000000000000',
        '0x3600000000000000000000000000000000000000',
        '0x3700000000000000000000000000000000000000',
        // no txs
      ],
    },
    {
      name: 'block 4 with kaustinen block13 txs and withdrawals',
      blockData: {
        transactions: blocks.block13.execute.transactions,
        blockNumber: '0x04',
        stateRoot: '0x57e675e1d6b2ab5d65601e81658de1468afad77752a271a48364dcefda856614',
        receiptTrie: '0x6a0be0e8208f625225e43681258eb9901ed753e2656f0cd6c0a3971fada5f190',
        gasUsed: '0x3c138',
        coinbase: '0xa874386cdb13f6cb3b974d1097b25116e67fc21e',
      },
      preimages: [
        // coinbase
        '0xa874386cdb13f6cb3b974d1097b25116e67fc21e',
        // withdrawals
        '0x4000000000000000000000000000000000000000',
        '0x4100000000000000000000000000000000000000',
        '0x4200000000000000000000000000000000000000',
        '0x4300000000000000000000000000000000000000',
        '0x4400000000000000000000000000000000000000',
        '0x4500000000000000000000000000000000000000',
        '0x4600000000000000000000000000000000000000',
        '0x4700000000000000000000000000000000000000',
        // txs
        '0x687704db07e902e9a8b3754031d168d46e3d586e',
        '0xdfd66120239099c0a9ad623a5af2b26ea6b4fb8d',
        '0xbbbbde4ca27f83fc18aa108170547ff57675936a',
        '0x6177843db3138ae69679a54b95cf345ed759450d',
        '0x2971704d406f9efef2f4a36ea2a40aa994922fb9',
        '0xad692144cd452a8a85bf683b2a80bb22aab2f9ed',
      ],
    },
  ] as const

  let parentHash = genesisBlockHash
  for (const testCase of testCases) {
    const { name, blockData, preimages } = testCase
    it(`run ${name}`, async () => {
      const { blockHash } = await runBlock({ common, rpc }, { ...blockData, parentHash })
      // check the preimages are in  the preimage manager
      for (const preimage of preimages) {
        const preimageBytes = hexToBytes(preimage)
        const savedPreimage = await execution.preimagesManager!.getPreimage(
          keccak256(preimageBytes)
        )
        assert.isNotNull(savedPreimage, `Missing preimage for ${preimage}`)
        assert.ok(
          savedPreimage !== null && equalsBytes(savedPreimage, preimageBytes),
          `Incorrect preimage for ${preimage}`
        )
      }
      parentHash = blockHash
    })
  }

  it(`reset TD`, () => {
    server.close()
    BlockHeader.prototype['_consensusFormatValidation'] = originalValidate
    td.reset()
  })
})
