import { createBlock } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { bytesToHex } from '@ethereumjs/util'

const main = async () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Prague })
  const blockchain = await createBlockchain({
    validateBlocks: false,
    validateConsensus: false,
    common,
  })

  const block1 = createBlock(
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
        parentHash: block1.header.hash(),
        difficulty: block1.header.difficulty + 1n,
      },
    },
    { common, setHardfork: true },
  )
  await blockchain.putBlock(block1)
  await blockchain.putBlock(block2)

  const byNumber = await blockchain.getBlock(2n)
  const byHash = await blockchain.getBlock(block2.hash())

  console.log(`Block ${byNumber.header.number} hash: ${bytesToHex(byNumber.hash())}`)
  console.log(`Lookup by hash matches: ${bytesToHex(byHash.hash()) === bytesToHex(block2.hash())}`)
}

void main()
