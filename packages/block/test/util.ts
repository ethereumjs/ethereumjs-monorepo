import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { bufArrToArr } from '@ethereumjs/util'
import RLP from 'rlp'
import { Block, BlockHeader } from '../src'

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

  const uncleHash = keccak256(RLP.encode(bufArrToArr(uncles.map((uh) => uh.raw()))))

  const londonHfBlock = common.hardforkBlock(Hardfork.London)
  const baseFeePerGas =
    londonHfBlock && number > londonHfBlock ? parentBlock.header.calcNextBaseFee() : undefined

  return Block.fromBlockData(
    {
      header: {
        number,
        parentHash: parentBlock.hash(),
        timestamp,
        gasLimit: parentBlock.header.gasLimit,
        extraData: Buffer.from(extraData),
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
