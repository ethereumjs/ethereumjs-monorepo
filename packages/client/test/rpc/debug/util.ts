import { Block, createBlock, createBlockHeader } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'

export const generateBlocks = (numberOfBlocks: number, existingBlocks?: Block[]): Block[] => {
  const blocks = existingBlocks ? existingBlocks : []

  const gasLimit = 8000000
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Chainstart })
  const opts = { common }

  if (blocks.length === 0) {
    const genesis = createBlock({ header: { gasLimit } }, opts)
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
    const block = createBlock(blockData, {
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

  const blockchain = await createBlockchain({
    validateBlocks: true,
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
  gasLimit: bigint = BigInt(8000000),
): Block => {
  if (difficultyChangeFactor > 1) {
    difficultyChangeFactor = 1
  }
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.MuirGlacier })
  const tmpHeader = createBlockHeader(
    {
      number: parentBlock.header.number + BigInt(1),
      timestamp: parentBlock.header.timestamp + BigInt(10 + -difficultyChangeFactor * 9),
    },
    { common },
  )
  const header = createBlockHeader(
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
    },
  )

  const block = new Block(header, undefined, undefined, undefined, { common }, undefined)

  return block
}
