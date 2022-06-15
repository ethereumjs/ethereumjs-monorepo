import { Block } from '@ethereumjs/block'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import tape from 'tape'

import Blockchain from '../src'
import { createBlock } from './util'

tape('[Blockchain]: Block validation tests', (t) => {
  t.test('should throw if an uncle is included before', async function (st) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const blockchain = await Blockchain.create({ common, validateConsensus: false })

    const genesis = blockchain.genesisBlock

    const uncleBlock = createBlock(genesis, 'uncle', [], common)

    const block1 = createBlock(genesis, 'block1', [], common)
    const block2 = createBlock(block1, 'block2', [uncleBlock.header], common)
    const block3 = createBlock(block2, 'block3', [uncleBlock.header], common)

    await blockchain.putBlock(uncleBlock)
    await blockchain.putBlock(block1)
    await blockchain.putBlock(block2)

    try {
      await blockchain.putBlock(block3)
      st.fail('cannot reach this')
    } catch (e: any) {
      st.pass('block throws if uncle is already included')
    }
  })

  t.test(
    'should throw if the uncle parent block is not part of the canonical chain',
    async function (st) {
      const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
      const blockchain = await Blockchain.create({ common, validateConsensus: false })

      const genesis = blockchain.genesisBlock

      const emptyBlock = Block.fromBlockData({ header: { number: BigInt(1) } }, { common })

      const uncleBlock = createBlock(emptyBlock, 'uncle', [], common)
      const block1 = createBlock(genesis, 'block1', [], common)
      const block2 = createBlock(block1, 'block2', [], common)
      const block3 = createBlock(block2, 'block3', [uncleBlock.header], common)
      await blockchain.putBlock(block1)
      await blockchain.putBlock(block2)

      try {
        await blockchain.putBlock(block3)
        st.fail('cannot reach this')
      } catch (e: any) {
        st.pass('block throws if uncle parent hash is not part of the canonical chain')
      }
    }
  )

  t.test('should throw if the uncle is too old', async function (st) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const blockchain = await Blockchain.create({ common, validateConsensus: false })

    const genesis = blockchain.genesisBlock

    const uncleBlock = createBlock(genesis, 'uncle', [], common)

    let lastBlock = genesis
    for (let i = 0; i < 7; i++) {
      const block = createBlock(lastBlock, 'block' + i.toString(), [], common)
      await blockchain.putBlock(block)
      lastBlock = block
    }

    const blockWithUnclesTooOld = createBlock(
      lastBlock,
      'too-old-uncle',
      [uncleBlock.header],
      common
    )

    try {
      await blockchain.putBlock(blockWithUnclesTooOld)
      st.fail('cannot reach this')
    } catch (e: any) {
      if (e.message.includes('uncle block has a parent that is too old'))
        st.pass('block throws uncle is too old')
      else st.fail(`threw with wrong error ${e.message}`)
    }
  })

  t.test('should throw if uncle is too young', async function (st) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const blockchain = await Blockchain.create({ common, validateConsensus: false })

    const genesis = blockchain.genesisBlock

    const uncleBlock = createBlock(genesis, 'uncle', [], common)
    const block1 = createBlock(genesis, 'block1', [uncleBlock.header], common)

    await blockchain.putBlock(uncleBlock)

    try {
      await blockchain.putBlock(block1)
      st.fail('cannot reach this')
    } catch (e: any) {
      if (e.message.includes('uncle block has a parent that is too old or too young'))
        st.pass('block throws uncle is too young')
      else st.fail(`threw with wrong error ${e.message}`)
    }
  })

  t.test('should throw if the uncle header is invalid', async function (st) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const blockchain = await Blockchain.create({ common, validateConsensus: false })

    const genesis = blockchain.genesisBlock

    const uncleBlock = Block.fromBlockData(
      {
        header: {
          number: genesis.header.number + BigInt(1),
          parentHash: genesis.hash(),
          timestamp: genesis.header.timestamp + BigInt(1),
          gasLimit: BigInt(5000),
        },
      },
      { common }
    )

    const block1 = createBlock(genesis, 'block1', [], common)
    const block2 = createBlock(block1, 'block2', [uncleBlock.header], common)

    await blockchain.putBlock(block1)

    try {
      await blockchain.putBlock(block2)
      st.fail('cannot reach this')
    } catch (e: any) {
      if (e.message.includes('invalid difficulty (block header number=1'))
        st.pass('block throws when uncle header is invalid')
      else st.fail(`threw with wrong error ${e.message}`)
    }
  })

  t.test('throws if uncle is a canonical block', async function (st) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const blockchain = await Blockchain.create({ common, validateConsensus: false })

    const genesis = blockchain.genesisBlock

    const block1 = createBlock(genesis, 'block1', [], common)
    const block2 = createBlock(block1, 'block2', [block1.header], common)

    await blockchain.putBlock(block1)

    try {
      await blockchain.putBlock(block2)

      st.fail('cannot reach this')
    } catch (e: any) {
      if (e.message.includes('The uncle is a canonical block'))
        st.pass('block throws if an uncle is a canonical block')
      else st.fail(`threw with wrong error ${e.message}`)
    }
  })

  t.test('successfully validates uncles', async function (st) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    const blockchain = await Blockchain.create({ common, validateConsensus: false })

    const genesis = blockchain.genesisBlock

    const uncleBlock = createBlock(genesis, 'uncle', [], common)
    await blockchain.putBlock(uncleBlock)

    const block1 = createBlock(genesis, 'block1', [], common)
    const block2 = createBlock(block1, 'block2', [uncleBlock.header], common)

    await blockchain.putBlock(block1)
    await blockchain.putBlock(block2)

    st.pass('uncle blocks validated succesfully')
  })
  /*  TODO Figure out how to recreate this with a custom chain -- if needed
  t.test(
    'should select the right hardfork for uncles at a hardfork transition',
    async function (st) {*/
  /**
   * This test creates a chain around mainnet fork blocks:
   *      berlin         london
   *                |     |-> u <---|
   * @ -> @ -> @ ---|---> @ -> @ -> @
   * |-> u <---|               | -> @
   *    ^----------------------------
   * @ = block
   * u = uncle block
   *
   * There are 3 pre-fork blocks, with 1 pre-fork uncle
   * There are 3 blocks after the fork, with 1 uncle after the fork
   *
   * The following situations are tested:
   * Pre-fork block can have legacy uncles
   * London block has london uncles
   * London block has legacy uncles
   * London block has legacy uncles, where hardforkByBlockNumber set to false (this should throw)
   *    In this situation, the london block creates a london uncle, but this london uncle should be
   *    a berlin block, and therefore has no base fee. But, since common is still london, base fee
   *    is expected
   * It is tested that common does not change
   */
  /*   const common = new Common({ chain: Chain.Mainnet })

      const blockchain = await Blockchain.create({ common, validateConsensus: false })

      common.setHardfork(Hardfork.Berlin)

      const mainnetForkBlock = common.hardforkBlock(Hardfork.London)
      const rootBlock = Block.fromBlockData(
        {
          header: {
            number: mainnetForkBlock! - BigInt(3),
            gasLimit: BigInt(5000),
          },
        },
        { common }
      )

      await blockchain.putBlock(rootBlock)

      const unclePreFork = createBlock(rootBlock, 'unclePreFork', [], common)
      const canonicalBlock = createBlock(rootBlock, 'canonicalBlock', [], common)
      await blockchain.putBlock(canonicalBlock)
      const preForkBlock = createBlock(
        canonicalBlock,
        'preForkBlock',
        [unclePreFork.header],
        common
      )
      await blockchain.putBlock(preForkBlock)
      common.setHardfork(Hardfork.London)
      const forkBlock = createBlock(preForkBlock, 'forkBlock', [], common)
      await blockchain.putBlock(forkBlock)
      const uncleFork = createBlock(forkBlock, 'uncleFork', [], common)
      const canonicalBlock2 = createBlock(forkBlock, 'canonicalBlock2', [], common)
      const forkBlock2 = createBlock(canonicalBlock2, 'forkBlock2', [uncleFork.header], common)
      await blockchain.putBlock(canonicalBlock2)
      await blockchain.putBlock(forkBlock)
      //  await preForkBlock.validate(blockchain)

      st.equal(common.hardfork(), Hardfork.London, 'validation did not change common hardfork')
      // await forkBlock2.validate(blockchain)

      st.equal(common.hardfork(), Hardfork.London, 'validation did not change common hardfork')

      const forkBlock2HeaderData = forkBlock2.header.toJSON()
      const uncleHeaderData = unclePreFork.header.toJSON()

      uncleHeaderData.extraData = '0xffff'
      const uncleHeader = BlockHeader.fromHeaderData(uncleHeaderData, {
        common: new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Berlin }),
      })

      forkBlock2HeaderData.uncleHash =
        '0x' + bytesToHex(keccak256(RLP.encode(bufArrToArr([uncleHeader.raw()]))))

      const forkBlock_ValidCommon = Block.fromBlockData(
        {
          header: forkBlock2HeaderData,
          uncleHeaders: [uncleHeaderData],
        },
        {
          common,
        }
      )

      //    await forkBlock_ValidCommon.validate(blockchain)

      st.pass('successfully validated a pre-london uncle on a london block')
      st.equal(common.hardfork(), Hardfork.London, 'validation did not change common hardfork')

      const forkBlock_InvalidCommon = Block.fromBlockData(
        {
          header: forkBlock2HeaderData,
          uncleHeaders: [uncleHeaderData],
        },
        {
          common,
          hardforkByBlockNumber: false,
        }
      )

      try {
        //    await forkBlock_InvalidCommon.validate(blockchain)
        st.fail('cannot reach this')
      } catch (e: any) {
        st.ok(
          e.message.includes('with EIP1559 being activated'),
          'explicitly set hardforkByBlockNumber to false, pre-london block interpreted as london block and succesfully failed'
        )
      }

      st.equal(common.hardfork(), Hardfork.London, 'validation did not change common hardfork')
    }
  )*/
})
