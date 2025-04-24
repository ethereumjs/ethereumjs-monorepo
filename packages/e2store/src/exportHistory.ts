import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { DBOp } from '@ethereumjs/blockchain'
import { RLP } from '@ethereumjs/rlp'
import { bytesToBigInt, concatBytes, intToBytes } from '@ethereumjs/util'
import { Level } from 'level'

import { formatEra1 } from './era1/index.ts'

import type { BlockBodyBytes } from '@ethereumjs/block'

type DatabaseKey = {
  blockNumber?: bigint
  blockHash?: Uint8Array
}

export type DBTarget = (typeof DBTarget)[keyof typeof DBTarget]

export const DBTarget = {
  NumberToHash: 4,
  TotalDifficulty: 5,
  Body: 6,
  Header: 7,
} as const

export type DBKey = (typeof DBKey)[keyof typeof DBKey]

export const DBKey = {
  Receipts: 0,
} as const

type BlockDB = Level<string | Uint8Array, string | Uint8Array>

async function dbGet(DB: BlockDB, dbOperationTarget: DBTarget, key?: DatabaseKey): Promise<any> {
  const dbGetOperation = DBOp.get(dbOperationTarget, key)
  return DB.get(dbGetOperation.baseDBOp.key, {
    keyEncoding: dbGetOperation.baseDBOp.keyEncoding,
    valueEncoding: dbGetOperation.baseDBOp.valueEncoding,
  })
}

export async function numberToHash(DB: BlockDB, number: bigint): Promise<Uint8Array> {
  const hash = await dbGet(DB, DBTarget.NumberToHash, { blockNumber: number })
  return hash
}

export async function getHeader(DB: BlockDB, hash: Uint8Array, number: bigint) {
  const header = await dbGet(DB, DBTarget.Header, { blockHash: hash, blockNumber: number })
  return header as Uint8Array
}

/**
 * Fetches body of a block given its hash and number.
 */
export async function getBody(
  DB: BlockDB,
  blockHash: Uint8Array,
  blockNumber: bigint,
): Promise<BlockBodyBytes | undefined> {
  const body = await dbGet(DB, DBTarget.Body, { blockHash, blockNumber })
  return body !== undefined ? (RLP.decode(body) as BlockBodyBytes) : undefined
}

export async function getTotalDifficulty(DB: BlockDB, hash: Uint8Array, number: bigint) {
  const td = await dbGet(DB, DBTarget.TotalDifficulty, { blockHash: hash, blockNumber: number })
  return bytesToBigInt(RLP.decode(td) as Uint8Array)
}

export async function getBlock(DB: BlockDB, number: bigint) {
  const hash = await numberToHash(DB, number)
  const header = await getHeader(DB, hash, number)
  let body: BlockBodyBytes | undefined | Uint8Array = await getBody(DB, hash, number)
  if (body === undefined) {
    body = [[], [], []] as BlockBodyBytes
  }
  body = RLP.encode(body)
  return { header, body }
}

export async function getBlockReceipts(DB: BlockDB, blockHash: Uint8Array): Promise<Uint8Array> {
  const dbKey = concatBytes(intToBytes(DBKey.Receipts), blockHash)
  const receipts = await DB.get(dbKey)
  return (receipts ?? RLP.encode([])) as Uint8Array
}

export async function getBlockTuple(chainDB: BlockDB, metaDB: BlockDB, number: bigint) {
  const blockHash = await numberToHash(chainDB, number)
  const { header, body } = await getBlock(chainDB, number)
  const totalDifficulty = await getTotalDifficulty(chainDB, blockHash, number)
  const receipts = await getBlockReceipts(metaDB, blockHash)
  return { blockHash, header, body, totalDifficulty, receipts }
}

export async function getBlocks(chainDB: BlockDB, metaDB: BlockDB, start: bigint, number: number) {
  const blocks: {
    blockHash: Uint8Array
    header: Uint8Array
    body: Uint8Array
    totalDifficulty: bigint
    receipts: Uint8Array
  }[] = []
  for (let i = 0; i < number; i++) {
    const { blockHash, header, body, totalDifficulty, receipts } = await getBlockTuple(
      chainDB,
      metaDB,
      start + BigInt(i),
    )
    blocks.push({ blockHash, header, body, totalDifficulty, receipts })
  }
  return blocks
}

async function getEpoch(chainDB: BlockDB, metaDB: BlockDB, index: number) {
  const blocks = await getBlocks(chainDB, metaDB, BigInt(index * 8192), 8192)
  const headerRecords = blocks.map((block) => {
    return {
      blockHash: block.blockHash,
      totalDifficulty: block.totalDifficulty,
    }
  })
  const blockTuples = blocks.map((block) => {
    return {
      header: block.header,
      body: block.body,
      receipts: block.receipts,
      totalDifficulty: block.totalDifficulty,
    }
  })
  return { blockTuples, headerRecords }
}

function initDBs(dataDir: string, chain: string) {
  const chainDir = `${dataDir}/${chain}`
  // Chain DB
  const chainDataDir = `${chainDir}/chain`
  const chainDB = new Level<string | Uint8Array, string | Uint8Array>(chainDataDir)

  // Meta DB (receipts, logs, indexes, skeleton chain)
  const metaDataDir = `${chainDir}/meta`
  const metaDB = new Level<string | Uint8Array, string | Uint8Array>(metaDataDir)

  return { chainDB, metaDB }
}

export async function exportEpochAsEra1(
  epoch: number,
  dataDir: string,
  outputDir: string = dataDir,
  chain = 'mainnet',
) {
  const { chainDB, metaDB } = initDBs(dataDir, chain)
  await chainDB.open()
  await metaDB.open()
  const { blockTuples, headerRecords } = await getEpoch(chainDB, metaDB, epoch)
  const era1 = await formatEra1(blockTuples, headerRecords, epoch)

  // Create era1 directory if it doesn't exist
  const era1Dir = `${outputDir}/era1`
  if (!existsSync(era1Dir)) {
    mkdirSync(era1Dir, { recursive: true })
  }

  writeFileSync(`${era1Dir}/epoch-${epoch}.era1`, era1)
}
