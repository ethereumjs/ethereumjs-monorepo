import { BN, rlp } from 'ethereumjs-util'
import { Block } from '@ethereumjs/block'
import Common from '@ethereumjs/common'
import Blockchain from '../src'
const level = require('level-mem')

export const generateBlocks = (numberOfBlocks: number, existingBlocks?: Block[]): Block[] => {
  const blocks = existingBlocks ? existingBlocks : []

  const gasLimit = 8000000
  const common = new Common({ chain: 'mainnet', hardfork: 'chainstart' })
  const opts = { common }

  if (blocks.length === 0) {
    const genesis = Block.genesis({ header: { gasLimit } }, opts)
    blocks.push(genesis)
  }

  for (let i = blocks.length; i < numberOfBlocks; i++) {
    const lastBlock = blocks[i - 1]
    const blockData = {
      header: {
        number: i,
        parentHash: lastBlock.hash(),
        difficulty: lastBlock.canonicalDifficulty(lastBlock),
        gasLimit,
        timestamp: lastBlock.header.timestamp.addn(1),
      },
    }
    const block = Block.fromBlockData(blockData, opts)
    blocks.push(block)
  }

  return blocks
}

export const generateBlockchain = async (numberOfBlocks: number, genesis?: Block): Promise<any> => {
  const blockchain = new Blockchain({
    validateBlocks: true,
    validatePow: false,
  })
  const existingBlocks: Block[] = genesis ? [genesis] : []
  const blocks = generateBlocks(numberOfBlocks, existingBlocks)

  try {
    await blockchain.putGenesis(blocks[0])
    await blockchain.putBlocks(blocks.slice(1))
  } catch (error) {
    return { error }
  }

  return {
    blockchain,
    blocks,
    error: null,
  }
}

export const isConsecutive = (blocks: Block[]) => {
  return !blocks.some((block: Block, index: number) => {
    if (index === 0) {
      return false
    }
    const { parentHash } = block.header
    const lastBlockHash = blocks[index - 1].hash()
    return !parentHash.equals(lastBlockHash)
  })
}

export const createTestDB = async () => {
  const genesis = Block.genesis()
  const db = level()
  await db.batch([
    {
      type: 'put',
      key: Buffer.from('6800000000000000006e', 'hex'),
      keyEncoding: 'binary',
      valueEncoding: 'binary',
      value: genesis.hash(),
    },
    {
      type: 'put',
      key: Buffer.from('48d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3', 'hex'),
      keyEncoding: 'binary',
      valueEncoding: 'binary',
      value: Buffer.from('00', 'hex'),
    },
    {
      type: 'put',
      key: 'LastHeader',
      keyEncoding: 'binary',
      valueEncoding: 'binary',
      value: genesis.hash(),
    },
    {
      type: 'put',
      key: 'LastBlock',
      keyEncoding: 'binary',
      valueEncoding: 'binary',
      value: genesis.hash(),
    },
    {
      type: 'put',
      key: Buffer.from(
        '680000000000000000d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
        'hex'
      ),
      keyEncoding: 'binary',
      valueEncoding: 'binary',
      value: genesis.header.serialize(),
    },
    {
      type: 'put',
      key: Buffer.from(
        '680000000000000000d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa374',
        'hex'
      ),
      keyEncoding: 'binary',
      valueEncoding: 'binary',
      value: rlp.encode(new BN(17179869184).toBuffer()),
    },
    {
      type: 'put',
      key: Buffer.from(
        '620000000000000000d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
        'hex'
      ),
      keyEncoding: 'binary',
      valueEncoding: 'binary',
      value: rlp.encode(genesis.raw().slice(1)),
    },
    {
      type: 'put',
      key: 'heads',
      valueEncoding: 'json',
      value: { head0: { type: 'Buffer', data: [171, 205] } },
    },
  ])
  return [db, genesis]
}
