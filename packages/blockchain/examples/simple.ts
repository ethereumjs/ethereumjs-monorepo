import { Block } from '@ethereumjs/block'
import { Blockchain } from '@ethereumjs/blockchain'
import { Common, Hardfork } from '@ethereumjs/common'
import { bytesToHex } from '@ethereumjs/util'

const main = async () => {
  const common = new Common({ chain: 'mainnet', hardfork: Hardfork.London })
  // Use the safe static constructor which awaits the init method
  const blockchain = await Blockchain.create({ validateBlocks: false, validateConsensus: false })

  const block = Block.fromBlockData(
    { header: { number: 1n, parentHash: blockchain.genesisBlock.hash() } },
    { common }
  )
  const block2 = Block.fromBlockData(
    { header: { number: 2n, parentHash: block.header.hash() } },
    { common }
  )
  // See @ethereumjs/block on how to create a block
  await blockchain.putBlock(block)
  await blockchain.putBlock(block2)
  await blockchain.iterator('i', (block) => {
    const blockNumber = block.header.number.toString()
    const blockHash = bytesToHex(block.hash())
    console.log(`Block ${blockNumber}: ${blockHash}`)
  })
}
main()
