import { createBlock } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { Common, Hardfork } from '@ethereumjs/common'
import { bytesToHex } from '@ethereumjs/util'

const main = async () => {
  const common = new Common({ chain: 'mainnet', hardfork: Hardfork.London })
  // Use the safe static constructor which awaits the init method
  const blockchain = await createBlockchain({
    validateBlocks: false, // Skipping validation so we can make a simple chain without having to provide complete blocks
    validateConsensus: false,
    common,
  })

  // We use minimal data to provide a sequence of blocks (increasing number, difficulty, and then setting parent hash to previous block)
  const block = createBlock(
    {
      header: {
        number: 1n,
        parentHash: blockchain.genesisBlock.hash(),
        difficulty: blockchain.genesisBlock.header.difficulty + 1n,
      },
    },
    { common, setHardfork: true },
  )
  const block2 = createBlock(
    {
      header: {
        number: 2n,
        parentHash: block.header.hash(),
        difficulty: block.header.difficulty + 1n,
      },
    },
    { common, setHardfork: true },
  )
  // See @ethereumjs/block for more details on how to create a block
  await blockchain.putBlock(block)
  await blockchain.putBlock(block2)

  // We iterate over the blocks in the chain to the current head (block 2)
  await blockchain.iterator('i', (block) => {
    const blockNumber = block.header.number.toString()
    const blockHash = bytesToHex(block.hash())
    console.log(`Block ${blockNumber}: ${blockHash}`)
  })

  // Block 1: 0xa1a061528d74ba81f560e1ebc4f29d6b58171fc13b72b876cdffe6e43b01bdc5
  // Block 2: 0x5583be91cf9fb14f5dbeb03ad56e8cef19d1728f267c35a25ba5a355a528f602
}
void main()
