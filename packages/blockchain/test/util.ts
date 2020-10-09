import { rlp, toBuffer, bufferToInt } from 'ethereumjs-util'
import BN = require('bn.js')
import Blockchain from '../src'

const util = require('util')
import { Block } from '@ethereumjs/block'
import Common from '@ethereumjs/common'
const level = require('level-mem')

export const generateBlockchain = async (
  numberOfBlocks: number,
  genesisBlock?: Block,
): Promise<any> => {
  const blockchain = new Blockchain({ validateBlocks: true, validatePow: false })
  const existingBlocks: Block[] = genesisBlock ? [genesisBlock] : []
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

export const generateBlocks = (numberOfBlocks: number, existingBlocks?: Block[]): Block[] => {
  const blocks = existingBlocks ? existingBlocks : []
  if (blocks.length === 0) {
    const genesisBlock = Block.fromBlockData(
      { header: { gasLimit: 8000000 } },
      { initWithGenesisHeader: true },
    )
    blocks.push(genesisBlock)
  }
  const common = new Common({ chain: 'mainnet', hardfork: 'chainstart' })
  for (let i = blocks.length; i < numberOfBlocks; i++) {
    const block = Object.create(Block.fromBlockData(undefined, { common }))
    block.header.number = new BN(i)
    block.header.parentHash = blocks[i - 1].hash()
    block.header.difficulty = block.header.canonicalDifficulty(blocks[i - 1])
    block.header.gasLimit = new BN(8000000)
    block.header.timestamp = blocks[i - 1].header.timestamp.addn(1)
    blocks.push(block)
  }
  return blocks
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
  const genesis = Block.fromBlockData(undefined, { initWithGenesisHeader: true })
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
        'hex',
      ),
      keyEncoding: 'binary',
      valueEncoding: 'binary',
      value: genesis.header.serialize(),
    },
    {
      type: 'put',
      key: Buffer.from(
        '680000000000000000d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa374',
        'hex',
      ),
      keyEncoding: 'binary',
      valueEncoding: 'binary',
      value: rlp.encode(new BN(17179869184).toBuffer()),
    },
    {
      type: 'put',
      key: Buffer.from(
        '620000000000000000d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
        'hex',
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
