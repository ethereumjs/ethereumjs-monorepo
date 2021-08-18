import tape from 'tape'
import { Block } from '@ethereumjs/block'
import Common, { Hardfork } from '@ethereumjs/common'
import { BN } from 'ethereumjs-util'
import Blockchain from '../src'
import testnet from './testdata/testnet.json'

const buildChain = async (blockchain: Blockchain, common: Common, height: number) => {
  const blocks: Block[] = []
  const londonBlockNumber = common.hardforkBlockBN('london')!.toNumber()
  const genesis = Block.genesis({}, { common })
  blocks.push(genesis)

  for (let number = 1; number <= height; number++) {
    let baseFeePerGas = new BN(0)
    if (number === londonBlockNumber) {
      baseFeePerGas = new BN(1000000000)
    } else if (number > londonBlockNumber) {
      baseFeePerGas = blocks[number - 1].header.calcNextBaseFee()
    }
    const block = Block.fromBlockData(
      {
        header: {
          number: number,
          parentHash: blocks[number - 1].hash(),
          timestamp: blocks[number - 1].header.timestamp.addn(1),
          gasLimit: number >= londonBlockNumber ? new BN(10000) : new BN(5000),
          baseFeePerGas: number >= londonBlockNumber ? baseFeePerGas : undefined,
        },
      },
      {
        calcDifficultyFromHeader: blocks[number - 1].header,
        common,
        hardforkByBlockNumber: true,
      }
    )
    blocks.push(block)
    await blockchain.putBlock(block)
  }
}

tape('Proof of Stake - inserting blocks into blockchain', async (t) => {
  const common = new Common({ chain: testnet, hardfork: Hardfork.Chainstart })
  const blockchain = await Blockchain.create({
    validateBlocks: true,
    validateConsensus: false,
    common,
    hardforkByHeadBlockNumber: true,
  })
  const genesisHeader = await blockchain.getLatestHeader()

  t.equal(
    genesisHeader.hash().toString('hex'),
    'd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
    'genesis hash matches'
  )
  await buildChain(blockchain, common, 15)

  const latestHeader = await blockchain.getLatestHeader()
  t.equals(latestHeader.number.toNumber(), 15, 'blockchain is at correct height')

  const powBlock = Block.fromBlockData({
    header: {
      number: 16,
      difficulty: new BN(1),
      parentHash: latestHeader.hash(),
      timestamp: latestHeader.timestamp.addn(1),
      gasLimit: new BN(10000),
    },
  })
  try {
    await blockchain.putBlock(powBlock)
    t.fail('should throw when inserting PoW block')
  } catch (err) {
    t.equals(err.message, 'invalid difficulty', 'should throw with invalid difficulty message')
    t.end()
  }
})
