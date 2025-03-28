import { DBOp } from '@ethereumjs/blockchain'
import { type BatchDBOp, type DelBatch, concatBytes, intToBytes } from '@ethereumjs/util'
import { Level } from 'level'
import { DBKey } from './metaDBManager.ts'

export const DBTarget = {
  NumberToHash: 4,
  Body: 6,
  Header: 7,
  Receipts: 8,
} as const

async function initDBs(dataDir: string, chain: string) {
  const chainDir = `${dataDir}/${chain}`

  // Chain DB
  const chainDataDir = `${chainDir}/chain`
  const chainDB = new Level<string | Uint8Array, string | Uint8Array>(chainDataDir)
  await chainDB.open()

  // Meta DB (receipts, logs, indexes, skeleton chain)
  const metaDataDir = `${chainDir}/meta`
  const metaDB = new Level<string | Uint8Array, string | Uint8Array>(metaDataDir)
  await metaDB.open()

  return { chainDB, metaDB }
}

export async function purgeHistory(
  dataDir: string,
  chain: string = 'mainnet',
  before: bigint = 15537393n,
  headers: boolean = false,
) {
  const { chainDB, metaDB } = await initDBs(dataDir, chain)

  const dbOps: DBOp[] = []
  const metaDBOps: {
    type: 'del'
    key: Uint8Array
  }[] = []
  let blockNumber = before
  while (blockNumber > 0n) {
    const blockHashDBOp = DBOp.get(DBTarget.NumberToHash, { blockNumber })
    const blockHash = await chainDB.get(blockHashDBOp.baseDBOp.key, {
      keyEncoding: blockHashDBOp.baseDBOp.keyEncoding,
      valueEncoding: blockHashDBOp.baseDBOp.valueEncoding,
    })

    if (!(blockHash instanceof Uint8Array)) {
      blockNumber--
      continue
    }
    dbOps.push(DBOp.del(DBTarget.Body, { blockHash, blockNumber }))
    if (headers) {
      dbOps.push(DBOp.del(DBTarget.Header, { blockHash, blockNumber }))
    }
    const receiptsKey = concatBytes(intToBytes(DBKey.Receipts), blockHash)
    metaDBOps.push({
      type: 'del',
      key: receiptsKey,
    })
    blockNumber--
  }
  const convertedOps: BatchDBOp[] = dbOps.map((op) => {
    const convertedOp = {
      key: op.baseDBOp.key,
      type: 'del',
      opts: {
        keyEncoding: op.baseDBOp.keyEncoding,
      },
    }
    return convertedOp as DelBatch
  })

  await chainDB.batch(convertedOps)
  await metaDB.batch(metaDBOps, { keyEncoding: 'view' })
}
