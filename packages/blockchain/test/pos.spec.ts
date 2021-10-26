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
        hardforkByTD: await blockchain.getTotalDifficulty(blocks[number - 1].hash()),
      }
    )
    blocks.push(block)
    await blockchain.putBlock(block)
  }
}

tape('Proof of Stake - inserting blocks into blockchain', async (t) => {
  const testnetOnlyTD = JSON.parse(JSON.stringify(testnet))
  testnetOnlyTD['hardforks'][11] = {
    name: 'merge',
    td: 1313600,
    block: null,
  }
  const scenarios = [
    {
      common: new Common({ chain: testnet, hardfork: Hardfork.Chainstart }),
    },
    {
      common: new Common({ chain: testnetOnlyTD, hardfork: Hardfork.Chainstart }),
    },
  ]

  for (const s of scenarios) {
    const blockchain = await Blockchain.create({
      validateBlocks: true,
      validateConsensus: false,
      common: s.common,
      hardforkByHeadBlockNumber: true,
    })
    const genesisHeader = await blockchain.getLatestHeader()

    t.equal(
      genesisHeader.hash().toString('hex'),
      'ac9c82e94824e583ab7972ee0f48b520912ffd5456ae4c62943852c3fb31876d',
      'genesis hash matches'
    )
    await buildChain(blockchain, s.common, 15)

    const latestHeader = await blockchain.getLatestHeader()
    t.equal(latestHeader.number.toNumber(), 15, 'blockchain is at correct height')

    t.equal(
      (blockchain as any)._common.hardfork(),
      'merge',
      'HF should have been correctly updated'
    )
    const td = await blockchain.getTotalDifficulty(latestHeader.hash())
    t.equal(
      td.toNumber(),
      1313601,
      'should have calculated the correct post-Merge total difficulty'
    )

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
    } catch (err: any) {
      t.ok(
        err.message.includes('invalid difficulty'),
        'should throw with invalid difficulty message'
      )
    }
  }
  t.end()
})
