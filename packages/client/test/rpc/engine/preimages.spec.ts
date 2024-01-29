import { Block, BlockHeader } from '@ethereumjs/block'
import { TransactionFactory } from '@ethereumjs/tx'
import {
  Withdrawal,
  bytesToHex,
  hexToBytes,
  intToBytes,
  intToHex,
  setLengthRight,
} from '@ethereumjs/util'
import * as td from 'testdouble'
import { assert, describe, it } from 'vitest'

import { blockToExecutionPayload } from '../../../src/rpc/modules/index.js'
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
  const withdrawals = Array.from({ length: 8 }, (_v, i) => {
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
  }
) {
  const { transactions, parentHash, blockNumber, stateRoot, receiptTrie } = runData
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
  }
  const blockData = { header: headerData, transactions, withdrawals }
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
  const { server, chain, common } = await setupChain(unschedulePragueJson, 'post-merge', {
    engine: true,
  })
  ;(chain.blockchain as any).validateHeader = () => {}

  const rpc = getRpcClient(server)
  it('genesis should be correctly setup', async () => {
    const res = await rpc.request('eth_getBlockByNumber', ['0x0', false])

    const block0 = res.result
    assert.equal(block0.hash, genesisBlockHash)
    assert.equal(block0.stateRoot, genesisStateRoot)
  })

  const testCases = [
    {
      name: 'block 1 no txs',
      blockData: {
        transactions: [],
        blockNumber: '0x01',
        stateRoot: '0xa7a1687c948aa6466cbb91d9dae6ad1fac5f7c789f392912bfdb34d492e1dc7d',
        receiptTrie: '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      },
    },
  ] as const

  let parentHash = genesisBlockHash
  for (const testCase of testCases) {
    const { name, blockData } = testCase
    it(`run ${name}`, async () => {
      const { blockHash } = await runBlock({ common, rpc }, { ...blockData, parentHash })
      parentHash = blockHash
    })
  }

  it(`reset TD`, () => {
    server.close()
    BlockHeader.prototype['_consensusFormatValidation'] = originalValidate
    td.reset()
  })
})
