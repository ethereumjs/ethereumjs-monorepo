import { Block, BlockHeader } from '@ethereumjs/block'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { bufArrToArr } from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { bytesToHex } from 'ethereum-cryptography/utils'
import RLP from 'rlp'
import * as tape from 'tape'

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
      if (e.message.includes('invalid difficulty block header number=1 '))
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

  t.test('EIP1559 base fee tests', async (st) => {
    const common = new Common({
      eips: [1559],
      chain: Chain.Mainnet,
      hardfork: Hardfork.London,
    })

    const blockchain = await Blockchain.create({ common, validateConsensus: false })
    const genesis = blockchain.genesisBlock

    // Small hack to hack in the activation block number
    // (Otherwise there would be need for a custom chain only for testing purposes)
    common.hardforkBlock = function (hardfork: string | undefined) {
      if (hardfork === 'london') {
        return BigInt(1)
      } else if (hardfork === 'dao') {
        // Avoid DAO HF side-effects
        return BigInt(99)
      }
      return BigInt(0)
    }

    const header = BlockHeader.fromHeaderData(
      {
        number: BigInt(1),
        parentHash: genesis.hash(),
        gasLimit: genesis.header.gasLimit * BigInt(2), // Special case on EIP-1559 transition block
        timestamp: BigInt(1),
        baseFeePerGas: BigInt(1000000000),
      },
      {
        calcDifficultyFromHeader: genesis.header,
        common,
        freeze: false,
      }
    )

    const block = Block.fromBlockData({ header }, { common })
    await blockchain.putBlock(block)
    try {
      const header = BlockHeader.fromHeaderData(
        {
          number: BigInt(2),
          parentHash: block.hash(),
          gasLimit: block.header.gasLimit,
          timestamp: BigInt(10),
          baseFeePerGas: BigInt(1000),
        },
        {
          calcDifficultyFromHeader: block.header,
          common,
        }
      )
      const block2 = Block.fromBlockData({ header }, { common })
      await blockchain.putBlock(block2)
    } catch (e: any) {
      const expectedError = 'Invalid block: base fee not correct'
      st.ok(e.message.includes(expectedError), 'should throw when base fee is not correct')
    }
  })

  t.test(
    'should select the right hardfork for uncles at a hardfork transition',
    async function (st) {
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
       * London block has legacy uncles, where hardforkByBlockNumber set to false (this should not throw)
       *    In this situation, the london block creates a london uncle, but this london uncle should be
       *    a berlin block, and therefore has no base fee. Since common will report london as active hardfork,
       *    evaluation of uncle header will initialize base fee to 7 per default header constructor rules for
       *    london blocks
       * It is tested that common does not change
       */

      const common = new Common({ chain: Chain.Mainnet })
      common.hardforkBlock = function (hardfork: string | undefined) {
        if (hardfork === 'london') {
          return BigInt(4)
        } else if (hardfork === 'dao') {
          // Avoid DAO HF side-effects
          return BigInt(99)
        }
        return BigInt(0)
      }

      const blockchain = await Blockchain.create({
        common,
        validateConsensus: false,
        validateBlocks: false,
      })

      common.setHardfork(Hardfork.Berlin)

      const mainnetForkBlock = common.hardforkBlock(Hardfork.London)
      const rootBlock = Block.fromBlockData(
        {
          header: {
            parentHash: blockchain.genesisBlock.hash(),
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
      st.pass('able to put pre-london block in chain with pre-london uncles')
      common.setHardfork(Hardfork.London)
      const forkBlock = createBlock(preForkBlock, 'forkBlock', [], common)
      await blockchain.putBlock(forkBlock)
      st.equal(common.hardfork(), Hardfork.London, 'validation did not change common hardfork')

      const forkBlockHeaderData = forkBlock.header.toJSON()
      const uncleHeaderData = unclePreFork.header.toJSON()

      uncleHeaderData.extraData = '0xffff'
      const uncleHeader = BlockHeader.fromHeaderData(uncleHeaderData, {
        common: new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Berlin }),
      })

      forkBlockHeaderData.uncleHash =
        '0x' + bytesToHex(keccak256(RLP.encode(bufArrToArr([uncleHeader.raw()]))))

      const forkBlock_ValidCommon = Block.fromBlockData(
        {
          header: forkBlockHeaderData,
          uncleHeaders: [uncleHeaderData],
        },
        {
          common,
        }
      )

      st.ok(
        forkBlock_ValidCommon.uncleHeaders[0].hash().equals(uncleHeader.hash()),
        'successfully validated a pre-london uncle on a london block'
      )
      st.equal(common.hardfork(), Hardfork.London, 'validation did not change common hardfork')

      st.doesNotThrow(
        () =>
          Block.fromBlockData(
            {
              header: forkBlockHeaderData,
              uncleHeaders: [uncleHeaderData],
            },
            {
              common,
              hardforkByBlockNumber: false,
            }
          ),
        'should create block even with pre-London uncle and common evaluated with london since uncle is given default base fee'
      )
      st.equal(common.hardfork(), Hardfork.London, 'validation did not change common hardfork')
    }
  )
})
