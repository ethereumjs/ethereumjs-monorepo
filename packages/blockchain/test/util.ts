import { Block, BlockHeader } from '@ethereumjs/block'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { MapDB, toBytes } from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { bytesToHex, equalsBytes, hexToBytes, utf8ToBytes } from 'ethereum-cryptography/utils'

import { Blockchain } from '../src'

import type { DB } from '@ethereumjs/util'

export const generateBlocks = (numberOfBlocks: number, existingBlocks?: Block[]): Block[] => {
  const blocks = existingBlocks ? existingBlocks : []

  const gasLimit = 8000000
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
  const opts = { common }

  if (blocks.length === 0) {
    const genesis = Block.fromBlockData({ header: { gasLimit } }, opts)
    blocks.push(genesis)
  }

  for (let i = blocks.length; i < numberOfBlocks; i++) {
    const lastBlock = blocks[i - 1]
    const blockData = {
      header: {
        number: i,
        parentHash: lastBlock.hash(),
        gasLimit,
        timestamp: lastBlock.header.timestamp + BigInt(1),
      },
    }
    const block = Block.fromBlockData(blockData, {
      common,
      calcDifficultyFromHeader: lastBlock.header,
    })
    blocks.push(block)
  }

  return blocks
}

export const generateBlockchain = async (numberOfBlocks: number, genesis?: Block): Promise<any> => {
  const existingBlocks: Block[] = genesis ? [genesis] : []
  const blocks = generateBlocks(numberOfBlocks, existingBlocks)

  const blockchain = await Blockchain.create({
    validateBlocks: true,
    validateConsensus: false,
    genesisBlock: genesis ?? blocks[0],
  })
  try {
    await blockchain.putBlocks(blocks.slice(1))
  } catch (error: any) {
    return { error }
  }

  return {
    blockchain,
    blocks,
    error: null,
  }
}
/**
 *
 * @param parentBlock parent block to generate the consecutive block on top of
 * @param difficultyChangeFactor this integer can be any value, but will only return unique blocks between [-99, 1] (this is due to difficulty calculation). 1 will increase the difficulty, 0 will keep the difficulty constant any any negative number will decrease the difficulty
 */

export const generateConsecutiveBlock = (
  parentBlock: Block,
  difficultyChangeFactor: number,
  gasLimit: bigint = BigInt(8000000)
): Block => {
  if (difficultyChangeFactor > 1) {
    difficultyChangeFactor = 1
  }
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.MuirGlacier })
  const tmpHeader = BlockHeader.fromHeaderData(
    {
      number: parentBlock.header.number + BigInt(1),
      timestamp: parentBlock.header.timestamp + BigInt(10 + -difficultyChangeFactor * 9),
    },
    { common }
  )
  const header = BlockHeader.fromHeaderData(
    {
      number: parentBlock.header.number + BigInt(1),
      parentHash: parentBlock.hash(),
      gasLimit,
      timestamp: parentBlock.header.timestamp + BigInt(10 + -difficultyChangeFactor * 9),
      difficulty: tmpHeader.ethashCanonicalDifficulty(parentBlock.header),
    },
    {
      common,
      calcDifficultyFromHeader: parentBlock.header,
    }
  )

  const block = new Block(header, undefined, undefined, undefined, { common })

  return block
}

export const isConsecutive = (blocks: Block[]) => {
  return !blocks.some((block: Block, index: number) => {
    if (index === 0) {
      return false
    }
    const { parentHash } = block.header
    const lastBlockHash = blocks[index - 1].hash()
    return !equalsBytes(parentHash, lastBlockHash)
  })
}

export const createTestDB = async (): Promise<
  [DB<string | Uint8Array, string | Uint8Array>, Block]
> => {
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
  const genesis = Block.fromBlockData({ header: { number: 0 } }, { common })
  const db = new MapDB<any, any>()

  await db.batch([
    {
      type: 'put',
      key: hexToBytes('6800000000000000006e'),
      value: genesis.hash(),
    },
    {
      type: 'put',
      key: hexToBytes('48d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3'),
      value: hexToBytes('00'),
    },
    {
      type: 'put',
      key: 'LastHeader',
      value: genesis.hash(),
    },
    {
      type: 'put',
      key: 'LastBlock',
      value: genesis.hash(),
    },
    {
      type: 'put',
      key: hexToBytes(
        '680000000000000000d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3'
      ),
      value: genesis.header.serialize(),
    },
    {
      type: 'put',
      key: hexToBytes(
        '680000000000000000d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa374'
      ),
      value: RLP.encode(toBytes(17179869184)),
    },
    {
      type: 'put',
      key: hexToBytes(
        '620000000000000000d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3'
      ),
      value: RLP.encode(genesis.raw().slice(1)),
    },
    {
      type: 'put',
      key: 'heads',
      value: { head0: bytesToHex(Uint8Array.from([171, 205])) },
    },
  ])
  return [db as any, genesis]
}

/**
 * This helper function creates a valid block (except the PoW) with the ability to add uncles. Returns a Block.
 * @param parentBlock - The Parent block to build upon
 * @param extraData - Extra data graffiti in order to create equal blocks (like block number) but with different hashes
 * @param uncles - Optional, an array of uncle headers. Automatically calculates the uncleHash.
 */
function createBlock(
  parentBlock: Block,
  extraData: string,
  uncles?: BlockHeader[],
  common?: Common
): Block {
  uncles = uncles ?? []
  common = common ?? new Common({ chain: Chain.Mainnet })

  if (extraData.length > 32) {
    throw new Error('extra data graffiti must be 32 bytes or less')
  }

  const number = parentBlock.header.number + BigInt(1)
  const timestamp = parentBlock.header.timestamp + BigInt(1)

  const uncleHash = keccak256(RLP.encode(uncles.map((uh) => uh.raw())))

  const londonHfBlock = common.hardforkBlock(Hardfork.London)
  const baseFeePerGas =
    typeof londonHfBlock === 'bigint' && number > londonHfBlock
      ? parentBlock.header.calcNextBaseFee()
      : undefined

  return Block.fromBlockData(
    {
      header: {
        number,
        parentHash: parentBlock.hash(),
        timestamp,
        gasLimit: parentBlock.header.gasLimit,
        extraData: utf8ToBytes(extraData),
        uncleHash,
        baseFeePerGas,
      },
      uncleHeaders: uncles,
    },
    {
      common,
      calcDifficultyFromHeader: parentBlock.header,
    }
  )
}

export { createBlock }
