import { createBlockTuples, formatEra1 } from '@ethereumjs/era'
import { RLP } from '@ethereumjs/rlp'
import { writeFileSync } from 'fs'

import { DBKey } from './metaDBManager.js'

import type { EthereumClient } from '../index.js'

export async function exportEpochAsEra1(client: EthereumClient, epoch: number, td: bigint) {
  const epochBlocks = await client.chain.getBlocks(BigInt(epoch) * 8192n, 8192)
  const epochReceipts = []
  for (const b of epochBlocks) {
    const receipts =
      (await client.service.execution.receiptsManager?.get(DBKey.Receipts, b.hash())) ??
      RLP.encode([])
    epochReceipts.push(receipts)
  }

  const { headerRecords, blockTuples, totalDifficulty } = await createBlockTuples(
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
