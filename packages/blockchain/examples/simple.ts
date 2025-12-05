import { createBlock } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { bytesToHex } from '@ethereumjs/util'

const main = async () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.London })
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
    { common },
  )
  const block2 = createBlock(
    {
      header: {
        number: 2n,
        parentHash: block.header.hash(),
        difficulty: block.header.difficulty + 1n,
      },
    },
    { common },
  )
  console.log(`Block 1: ${bytesToHex(block.hash())}`)
  console.log(`Block 2: ${bytesToHex(block2.hash())}`)
  // See @ethereumjs/block for more details on how to create a block

  // We iterate over the blocks in the chain to the current head (block 2)
  await blockchain.iterator('i', (block) => {
    const blockNumber = block.header.number.toString()
    const blockHash = bytesToHex(block.hash())
    console.log(`Block ${blockNumber}: ${blockHash}`)
  })

  //  Block 1: 0xf6673384492391fc85b76c2a3628eb1600896c51eb813a61cf44867d981eca58
  //  Block 2: 0x751f498d2156ffb678eec7286a39b0c7cef7abde9183ed2073aa61cef316a417
}
void main()
