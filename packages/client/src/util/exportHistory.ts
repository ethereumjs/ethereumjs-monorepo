import { formatEra1 } from '@ethereumjs/era'
import { RLP } from '@ethereumjs/rlp'
import { writeFileSync } from 'fs'

import { DBKey } from './metaDBManager.js'

import type { EthereumClient } from '../index.js'
import type { Block } from '@ethereumjs/block'

export async function getEpochBlockRecords(
  blocks: Block[],
  blockReceipts: Uint8Array[],
  td: bigint,
) {
  const blockTuples: {
    header: Uint8Array
    body: Uint8Array
    receipts: Uint8Array
    totalDifficulty: bigint
  }[] = []
  const headerRecords: {
    blockHash: Uint8Array
    totalDifficulty: bigint
  }[] = []
  for (const [i, block] of blocks.entries()) {
    td += block.header.difficulty
    headerRecords.push({
      blockHash: block.hash(),
      totalDifficulty: td,
    })
    const receipts = blockReceipts[i]

    const body = [
      block.transactions.map((tx) => tx.serialize()),
      block.uncleHeaders.map((uh) => uh.raw()),
    ]
    if (block.withdrawals) {
      body.push(block.withdrawals.map((w) => w.raw()))
    }
    blockTuples.push({
      header: block.header.serialize(),
      body: RLP.encode(body),
      receipts,
      totalDifficulty: td,
    })
  }
  return {
    headerRecords,
    blockTuples,
    totalDifficulty: td,
  }
}

export async function exportEpochAsEra1(client: EthereumClient, epoch: number, td: bigint) {
  const epochBlocks = await client.chain.getBlocks(BigInt(epoch) * 8192n, 8192)
  const epochReceipts = []
  for (const b of epochBlocks) {
    const receipts =
      (await client.service.execution.receiptsManager?.get(DBKey.Receipts, b.hash())) ??
      RLP.encode([])
    epochReceipts.push(receipts)
  }

  const { headerRecords, blockTuples, totalDifficulty } = await getEpochBlockRecords(
    epochBlocks,
    epochReceipts,
    td,
  )
  const era1 = await formatEra1(blockTuples, headerRecords, epoch)
  return { era1, totalDifficulty }
}

export async function exportHistoryAsEra1(client: EthereumClient, outputDir: string = '.') {
  const epochs = Math.floor(Number(client.chain.blocks.height) / 8192)
  let td = 0n
  for (let i = 0; i < epochs; i++) {
    const { era1, totalDifficulty } = await exportEpochAsEra1(client, i, td)
    td = totalDifficulty
    writeFileSync(`${outputDir}/epoch-${i}.era1`, era1)
  }
  return epochs
}
