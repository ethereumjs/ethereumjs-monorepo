import { DBOp, DBTarget } from './operation'
import BN from 'bn.js'
import { rlp } from 'ethereumjs-util'
import { Block, BlockHeader } from '@ethereumjs/block'
import { bufBE8 } from './constants'

/*
    This extra helper file is an interface between blockchain / operation.ts 
    It also handles the right encoding of the keys, so this does not have to happen in index.ts anymore.
*/

function DBSetTD(TD: BN, blockNumber: BN, blockHash: Buffer): DBOp {
  return DBOp.set(DBTarget.TotalDifficulty, rlp.encode(TD), {
    blockNumber,
    blockHash,
  })
}

/*
    This method accepts either a BlockHeader or a Block and returns a list of DatabaseOperation
    This always consists of a Set Header operation
    It could also consist of a set body operation: this only happens if the body is not empty (it has transactions/uncles), or it is the genesis block
    If the block is empty, we do not have to save it; the DB will assume that if the Header exists, but no block body, then the block was empty.
*/
function DBSetBlockOrHeader(blockBody: Block | BlockHeader): DBOp[] {
  const header: BlockHeader = blockBody instanceof Block ? blockBody.header : blockBody
  const dbOps = []

  const blockNumber = header.number
  const blockHash = header.hash()

  const headerValue = header.serialize()
  dbOps.push(
    DBOp.set(DBTarget.Header, headerValue, {
      blockNumber,
      blockHash,
    })
  )

  const isGenesis = header.number.eqn(0)

  if (
    isGenesis ||
    (blockBody instanceof Block && (blockBody.transactions.length || blockBody.uncleHeaders.length))
  ) {
    const bodyValue = rlp.encode(blockBody.raw().slice(1))
    dbOps.push(
      DBOp.set(DBTarget.Body, bodyValue, {
        blockNumber,
        blockHash,
      })
    )
  }

  return dbOps
}

function DBSetHashToNumber(blockHash: Buffer, blockNumber: BN): DBOp {
  const blockNumber8Byte = bufBE8(blockNumber)
  return DBOp.set(DBTarget.HashToNumber, blockNumber8Byte, {
    blockHash,
  })
}

function DBSaveLookups(blockHash: Buffer, blockNumber: BN): DBOp[] {
  const ops = []
  ops.push(DBOp.set(DBTarget.NumberToHash, blockHash, { blockNumber }))

  const blockNumber8Bytes = bufBE8(blockNumber)
  ops.push(
    DBOp.set(DBTarget.HashToNumber, blockNumber8Bytes, {
      blockHash,
    })
  )
  return ops
}

export { DBOp, DBSetTD, DBSetBlockOrHeader, DBSetHashToNumber, DBSaveLookups }
