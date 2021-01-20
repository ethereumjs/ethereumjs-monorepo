import Common from '@ethereumjs/common'
import { Block } from '@ethereumjs/block'
import { BN } from 'ethereumjs-util'
import tape from 'tape'
import Blockchain from '../src'
import { generateConsecutiveBlock } from './util'

const genesis = Block.fromBlockData({
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
      const blockchain = new Blockchain({
        validateBlocks: true,
        validateConsensus: false,
        common,
        genesisBlock: genesis,
      })

      const blocks_lowTD: Block[] = []
      const blocks_highTD: Block[] = []

      blocks_lowTD.push(generateConsecutiveBlock(genesis, 0))

      const TD_Low = genesis.header.difficulty.add(blocks_lowTD[0].header.difficulty)
      const TD_High = genesis.header.difficulty.clone()

      // Keep generating blocks until the Total Difficulty (TD) of the High TD chain is higher than the TD of the Low TD chain
      // This means that the block number of the high TD chain is 1 lower than the low TD chain

      while (TD_High.cmp(TD_Low) == -1) {
        blocks_lowTD.push(generateConsecutiveBlock(blocks_lowTD[blocks_lowTD.length - 1], 0))
        blocks_highTD.push(
          generateConsecutiveBlock(blocks_highTD[blocks_highTD.length - 1] || genesis, 1)
        )

        TD_Low.iadd(blocks_lowTD[blocks_lowTD.length - 1].header.difficulty)
        TD_High.iadd(blocks_highTD[blocks_highTD.length - 1].header.difficulty)
      }

      // sanity check
      const lowTDBlock = blocks_lowTD[blocks_lowTD.length - 1]
      const highTDBlock = blocks_highTD[blocks_highTD.length - 1]

      const number_lowTD = lowTDBlock.header.number
      const number_highTD = highTDBlock.header.number

      // ensure that the block difficulty is higher on the highTD chain when compared to the low TD chain
      t.ok(
        number_lowTD.cmp(number_highTD) == 1,
        'low TD should have a lower TD than the reported high TD'
      )
      t.ok(
        blocks_lowTD[blocks_lowTD.length - 1].header.number.gt(
          blocks_highTD[blocks_highTD.length - 1].header.number
        ),
        'low TD block should have a higher number than high TD block'
      )

      await blockchain.putBlocks(blocks_lowTD)

      const head_lowTD = await blockchain.getHead()

      await blockchain.putBlocks(blocks_highTD)

      const head_highTD = await blockchain.getHead()

      t.ok(
        head_lowTD.hash().equals(lowTDBlock.hash()),
        'head on the low TD chain should equal the low TD block'
      )
      t.ok(
        head_highTD.hash().equals(highTDBlock.hash()),
        'head on the high TD chain should equal the high TD block'
      )

      st.end()
    }
  )
})
