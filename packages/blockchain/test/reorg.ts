import Common from '@ethereumjs/common'
import { Block } from '@ethereumjs/block'
import { BN } from 'ethereumjs-util'
import tape from 'tape'
import Blockchain from '../src'
import { generateConsecutiveBlock } from './util'

const genesisBlock = Block.fromBlockData({
  header: {
    number: new BN(0),
    difficulty: new BN(0x020000),
    gasLimit: new BN(8000000),
  },
})

tape('reorg tests', (t) => {
  t.test(
    'should correctly reorg the chain if the total difficulty is higher on a lower block number than the current head block',
    async (st) => {
      const common = new Common({ chain: 'mainnet', hardfork: 'muirGlacier' })
      const blockchain = new Blockchain({ validateBlocks: true, validatePow: false, common })
      await blockchain.putBlock(genesisBlock, true)

      const blocks_lowTD: Block[] = []
      const blocks_highTD: Block[] = []

      blocks_lowTD.push(generateConsecutiveBlock(genesisBlock, 0))

      const TD_Low = new BN(genesisBlock.header.difficulty).add(
        new BN(blocks_lowTD[0].header.difficulty)
      )
      const TD_High = new BN(genesisBlock.header.difficulty)

      // Keep generating blocks until the Total Difficulty (TD) of the High TD chain is higher than the TD of the Low TD chain
      // This means that the block number of the high TD chain is 1 lower than the low TD chain

      while (TD_High.cmp(TD_Low) == -1) {
        blocks_lowTD.push(generateConsecutiveBlock(blocks_lowTD[blocks_lowTD.length - 1], 0))
        blocks_highTD.push(
          generateConsecutiveBlock(blocks_highTD[blocks_highTD.length - 1] || genesisBlock, 1)
        )

        TD_Low.iadd(new BN(blocks_lowTD[blocks_lowTD.length - 1].header.difficulty))
        TD_High.iadd(new BN(blocks_highTD[blocks_highTD.length - 1].header.difficulty))
      }

      // sanity check
      const lowTDBlock = blocks_lowTD[blocks_lowTD.length - 1]
      const highTDBlock = blocks_highTD[blocks_highTD.length - 1]

      const number_lowTD = new BN(lowTDBlock.header.number)
      const number_highTD = new BN(highTDBlock.header.number)

      // ensure that the block number is indeed higher on the low TD chain
      t.ok(number_lowTD.cmp(number_highTD) == 1)

      await blockchain.putBlocks(blocks_lowTD)

      const head_lowTD = await blockchain.getHead()

      await blockchain.putBlocks(blocks_highTD)

      const head_highTD = await blockchain.getHead()

      t.ok(head_lowTD.hash().equals(lowTDBlock.hash()))
      t.ok(head_highTD.hash().equals(highTDBlock.hash()))
      st.end()
    }
  )
})
