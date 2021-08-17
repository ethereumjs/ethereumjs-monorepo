import { Block } from '@ethereumjs/block'
import Common, { Hardfork } from '@ethereumjs/common'
import { BN } from 'ethereumjs-util'
import tape from 'tape'
import Blockchain from '../src'
import testnet from './testdata/testnet.json'

const buildChain = async (blockchain: Blockchain, common: Common, height: number) => {
  const blocks: Block[] = []
  const londonBlockNumber = common.hardforkBlockBN('london')!.toNumber()
  const mergeBlockNumber = common.hardforkBlockBN('merge')!.toNumber()
  const genesis = Block.genesis({}, { common })
  const londonCommon = new Common({ chain: testnet, eips: [2930, 1559], hardfork: Hardfork.London })
  const initialBaseFee = new BN(londonCommon.param('gasConfig', 'initialBaseFee'))
  blocks.push(genesis)

  // ADD blocks up to London fork
// let chainHeight = height > londonBlockNumber ? londonBlockNumber : height
  for (let number = 1; number < height; number++) {
    const block = Block.fromBlockData(
      {
        header: {
          number: number,
          parentHash: blocks[number - 1].hash(),
          timestamp: blocks[number - 1].header.timestamp.addn(1),
          gasLimit: new BN(5000),
        },
      },
      {
        calcDifficultyFromHeader: blocks[number - 1].header,
        common,
      }
    )
    blocks.push(block)
    await blockchain.putBlock(block)
  }
/*
  if (londonBlockNumber > height) return
  // Add blocks from London fork to Merge fork
  chainHeight = height > mergeBlockNumber ? mergeBlockNumber : height
  for (let number = londonBlockNumber; number < chainHeight; number++) {
    const block = Block.fromBlockData(
      {
        header: {
          number: number,
          difficulty:
            number >= mergeBlockNumber ? 0 : blocks[number - 1].header.difficulty.add(new BN(1)),
          parentHash: blocks[number - 1].hash(),
          timestamp: blocks[number - 1].header.timestamp.addn(1),
          baseFeePerGas:
            number === londonBlockNumber
              ? initialBaseFee
              : blocks[number - 1].header.calcNextBaseFee(),
          gasLimit: new BN(10000),
        },
      },
      {
        calcDifficultyFromHeader: blocks[number - 1].header,
        common: londonCommon,
      }
    )
    blocks.push(block)
    await blockchain.putBlock(block)
  }

  if (mergeBlockNumber > height) return
  // Add blocks from Merge Fork block to total height
  londonCommon.setHardforkByBlockNumber(new BN(mergeBlockNumber))
  for (let number = mergeBlockNumber; number <= height; number++) {
    const block = Block.fromBlockData(
      {
        header: {
          number: number,
          difficulty: 0,
          parentHash: blocks[number - 1].hash(),
          timestamp: blocks[number - 1].header.timestamp.addn(1),
          baseFeePerGas: blocks[number - 1].header.calcNextBaseFee(),
          gasLimit: new BN(10000),
        },
      },
      {
        common: londonCommon,
      }
    )
    blocks.push(block)
    await blockchain.putBlock(block)
  }*/
}

tape('Proof of Stake - assembling a blockchain', async (t) => {
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
  t.end()
/*
  const shortBlockChain = await Blockchain.create({
    validateBlocks: true,
    validateConsensus: false,
    common,
    hardforkByHeadBlockNumber: true,
  })

  await buildChain(shortBlockChain, common, 6)

  const latestShortHeader = await shortBlockChain.getLatestHeader()
  common.setHardforkByBlockNumber(11)
  const posBlock = Block.fromBlockData(
    {
      header: {
        number: latestShortHeader.number.toNumber() + 1,
        difficulty: 0,
        parentHash: (await shortBlockChain.getLatestHeader()).hash(),
        timestamp: latestShortHeader.timestamp.addn(1),
   //     baseFeePerGas: latestShortHeader.calcNextBaseFee(),
        gasLimit: new BN(5000),
      },
    },
    {
      common: common,
    }
  )
  try {
    await shortBlockChain.putBlock(posBlock)
  }
  catch (err) {
    console.log(err)
  }*/
})
