import { createBlock } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { bytesToHex, hexToBytes } from '@ethereumjs/util'

const main = async () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Shanghai })
  // Use the safe static constructor which awaits the init method
  const blockchain = await createBlockchain({
    common,
  })

  // We are using this to create minimal post merge blocks between shanghai and cancun in line with the
  // block hardfork configuration of mainnet
  const chainTTD = BigInt('58750000000000000000000')
  const shanghaiTimestamp = 1681338455

  // We use minimal data to provide a sequence of blocks (increasing number, difficulty, and then setting parent hash to previous block)
  const block1 = createBlock(
    {
      header: {
        // 15537393n is terminal block in mainnet config
        number: 15537393n + 500n,
        // Could be any parenthash other than 0x00..00 as we will set this block as a TRUSTED 4444 anchor
        // instead of genesis to build blockchain on top of. One could use any criteria to set a block
        // as trusted 4444 anchor
        parentHash: hexToBytes(`0x${'20'.repeat(32)}`),
        timestamp: shanghaiTimestamp + 12 * 500,
      },
    },
    { common, setHardfork: true },
  )
  const block2 = createBlock(
    {
      header: {
        number: block1.header.number + 1n,
        parentHash: block1.header.hash(),
        timestamp: shanghaiTimestamp + 12 * 501,
      },
    },
    { common, setHardfork: true },
  )
  const block3 = createBlock(
    {
      header: {
        number: block2.header.number + 1n,
        parentHash: block2.header.hash(),
        timestamp: shanghaiTimestamp + 12 * 502,
      },
    },
    { common, setHardfork: true },
  )

  let headBlock, blockByHash, blockByNumber
  headBlock = await blockchain.getCanonicalHeadBlock()
  console.log(
    `Blockchain ${blockchain.consensus.algorithm} Head: ${headBlock.header.number} ${bytesToHex(headBlock.hash())}`,
  )
  // Blockchain casper Head: 0 0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3

  // 1. We can put any post merge block as 4444 anchor by using TTD as parentTD
  // 2. For pre-merge blocks its prudent to supply correct parentTD so as to respect the
  //    hardfork configuration as well as to determine the canonicality of the chain on future putBlocks
  await blockchain.putBlock(block1, { parentTd: chainTTD })
  headBlock = await blockchain.getCanonicalHeadBlock()
  console.log(
    `Blockchain ${blockchain.consensus.algorithm} Head: ${headBlock.header.number} ${bytesToHex(headBlock.hash())}`,
  )
  // Blockchain casper Head: 15537893 0x26cb3bfda75027016c17d737fdabe56f412925311b42178a675da88a41bbb7e7

  await blockchain.putBlock(block2)
  headBlock = await blockchain.getCanonicalHeadBlock()
  console.log(
    `Blockchain ${blockchain.consensus.algorithm} Head: ${headBlock.header.number} ${bytesToHex(headBlock.hash())}`,
  )
  // Blockchain casper Head: 15537894 0x6c33728cd8aa21db683d94418fec1f7ee1cfdaa9b77781762ec832da40ec3a7c

  await blockchain.putBlock(block3)
  headBlock = await blockchain.getCanonicalHeadBlock()
  console.log(
    `Blockchain ${blockchain.consensus.algorithm} Head: ${headBlock.header.number} ${bytesToHex(headBlock.hash())}`,
  )
  // Blockchain casper Head: 15537895 0x4263ec367ce44e4092b79ea240f132250d0d341639afbaf8c0833fbdd6160d0f
}
void main()
