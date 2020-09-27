import Common from '@ethereumjs/common'
import { Block, BlockHeader } from '@ethereumjs/block'
import { BN, toBuffer, bufferToInt } from 'ethereumjs-util'
import * as test from 'tape'
import Blockchain from '../src'
import { generateBlocks, generateConsecutiveBlock } from './util'
import * as testData from './testdata.json'

const level = require('level-mem')

const genesis = generateBlocks(1)[0]
genesis.header.difficulty = Buffer.from('02000', 'hex') // minimum difficulty

test('reorg tests', (t) => {
  t.test(
    'should correctly reorg the chain if the total difficulty is higher on a lower block number than the current head block',
    async (st) => {
      const common = new Common({ chain: 'mainnet', hardfork: 'muirGlacier' })
      const blockchain = new Blockchain({ validateBlocks: true, validatePow: false, common })
      await blockchain.putBlock(genesis, true)

      let blocks_lowTD: Block[] = []
      let blocks_highTD: Block[] = []

      blocks_lowTD.push(generateConsecutiveBlock(genesis, 0))

      let TD_Low = new BN(genesis.header.difficulty).add(new BN(blocks_lowTD[0].header.difficulty))
      let TD_High = new BN(genesis.header.difficulty)

      // Keep generating blocks until the Total Difficulty (TD) of the High TD chain is higher than the TD of the Low TD chain
      // This means that the block number of the high TD chain is 1 lower than the low TD chain

      while (TD_High.cmp(TD_Low) == -1) {
        blocks_lowTD.push(generateConsecutiveBlock(blocks_lowTD[blocks_lowTD.length - 1], 0))
        blocks_highTD.push(
          generateConsecutiveBlock(blocks_highTD[blocks_highTD.length - 1] || genesis, 1),
        )

        TD_Low.iadd(new BN(blocks_lowTD[blocks_lowTD.length - 1].header.difficulty))
        TD_High.iadd(new BN(blocks_highTD[blocks_highTD.length - 1].header.difficulty))
      }

      // sanity check
      const lowTDBlock = blocks_lowTD[blocks_lowTD.length - 1]
      const highTDBlock = blocks_highTD[blocks_highTD.length - 1]

      let number_lowTD = new BN(lowTDBlock.header.number)
      let number_highTD = new BN(highTDBlock.header.number)

      // ensure that the block number is indeed higher on the low TD chain
      t.ok(number_lowTD.cmp(number_highTD) == 1)

      await blockchain.putBlocks(blocks_lowTD)

      let head_lowTD = await blockchain.getHead()

      await blockchain.putBlocks(blocks_highTD)

      let head_highTD = await blockchain.getHead()

      t.ok(head_lowTD.hash().equals(lowTDBlock.hash()))
      t.ok(head_highTD.hash().equals(highTDBlock.hash()))
      st.end()
    },
  )
})
