import { Block } from '@ethereumjs/block'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { Address, BN } from 'ethereumjs-util'
import tape from 'tape'
import Blockchain from '../src'
import testnet from './testdata/testnet.json'

tape('Proof of Stake [Initialization]', async (t) => {
  const common = new Common({ chain: testnet, hardfork: Hardfork.Chainstart })
  const blockchain = await Blockchain.create({ 
    validateBlocks: true,
    validateConsensus: false,
    common,
    hardforkByHeadBlockNumber: true
   })
  const genesisHeader = await blockchain.getLatestHeader()

  t.equal(
    genesisHeader.hash().toString('hex'),
    'd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
    'genesis hash matches'
  )
  await buildChain(blockchain, common, 15)
  t.end()
})

const buildChain = async (blockchain: Blockchain, common: Common, height: number) => {
  const blocks: Block[] = []
  const mergeBlockNumber = common.hardforkBlockBN('merge')!.toNumber()
  const genesis = Block.genesis({}, { common }) 
  blocks.push(genesis)
  for (let number = 1; number < height; number++) {
    const block = Block.fromBlockData(
      {
        header: {
          number: number,
          difficulty:
            number >= mergeBlockNumber ? 0 : blocks[number - 1].header.difficulty.add(new BN(1)),
          parentHash: blocks[number - 1].hash(),
          timestamp: blocks[number - 1].header.timestamp.addn(1),
          gasLimit: new BN(5000)
        },
      },
      {
        calcDifficultyFromHeader: blocks[number-1].header,
        common,
      }
    )
    blocks.push(block)
    await blockchain.putBlock(block);
  }
}
