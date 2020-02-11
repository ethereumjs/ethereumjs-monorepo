import tape = require('tape')
import Common from 'ethereumjs-common'
import Blockchain from 'ethereumjs-blockchain'
import * as utils from 'ethereumjs-util'
import { rlp } from 'ethereumjs-util'
import { BlockHeader } from '../src/header'
import { Block } from '../src/block'

tape('[Block]: Header functions', function(t) {
  t.test('should create with default constructor', function(st) {
    function compareDefaultHeader(st: tape.Test, header: BlockHeader) {
      st.deepEqual(header.parentHash, utils.zeros(32))
      st.equal(header.uncleHash.toString('hex'), utils.KECCAK256_RLP_ARRAY_S)
      st.deepEqual(header.coinbase, utils.zeros(20))
      st.deepEqual(header.stateRoot, utils.zeros(32))
      st.equal(header.transactionsTrie.toString('hex'), utils.KECCAK256_RLP_S)
      st.equal(header.receiptTrie.toString('hex'), utils.KECCAK256_RLP_S)
      st.deepEqual(header.bloom, utils.zeros(256))
      st.deepEqual(header.difficulty, Buffer.from([]))
      st.deepEqual(header.number, utils.toBuffer(1150000))
      st.deepEqual(header.gasLimit, Buffer.from('ffffffffffffff', 'hex'))
      st.deepEqual(header.gasUsed, Buffer.from([]))
      st.deepEqual(header.timestamp, Buffer.from([]))
      st.deepEqual(header.extraData, Buffer.from([]))
      st.deepEqual(header.mixHash, utils.zeros(32))
      st.deepEqual(header.nonce, utils.zeros(8))
    }

    let header = new BlockHeader()
    compareDefaultHeader(st, header)

    const block = new Block()
    header = block.header
    compareDefaultHeader(st, header)

    st.end()
  })

  t.test('should test header initialization', function(st) {
    const header1 = new BlockHeader(undefined, { chain: 'ropsten' })
    const common = new Common('ropsten')
    const header2 = new BlockHeader(undefined, { common: common })
    header1.setGenesisParams()
    header2.setGenesisParams()
    st.strictEqual(
      header1.hash().toString('hex'),
      header2.hash().toString('hex'),
      'header hashes match',
    )

    st.throws(
      function() {
        new BlockHeader(undefined, { chain: 'ropsten', common: common })
      },
      /not allowed!$/,
      'should throw on initialization with chain and common parameter',
    ) // eslint-disable-line
    st.end()
  })

  t.test('should test validateGasLimit', function(st) {
    const testData = require('./testdata/bcBlockGasLimitTest.json').tests
    const bcBlockGasLimigTestData = testData.BlockGasLimit2p63m1

    Object.keys(bcBlockGasLimigTestData).forEach(key => {
      const parentBlock = new Block(rlp.decode(bcBlockGasLimigTestData[key].genesisRLP))
      const block = new Block(rlp.decode(bcBlockGasLimigTestData[key].blocks[0].rlp))
      st.equal(block.header.validateGasLimit(parentBlock), true)
    })

    st.end()
  })

  t.test('should test isGenesis', function(st) {
    const header = new BlockHeader()
    st.equal(header.isGenesis(), false)
    header.number = Buffer.from([])
    st.equal(header.isGenesis(), true)
    st.end()
  })

  const testDataGenesis = require('./testdata/genesishashestest.json').test
  t.test('should test genesis hashes (mainnet default)', function(st) {
    const header = new BlockHeader()
    header.setGenesisParams()
    st.strictEqual(
      header.hash().toString('hex'),
      testDataGenesis.genesis_hash,
      'genesis hash match',
    )
    st.end()
  })

  t.test('should test genesis parameters (ropsten)', function(st) {
    const genesisHeader = new BlockHeader(undefined, { chain: 'ropsten' })
    genesisHeader.setGenesisParams()
    const ropstenStateRoot = '217b0bbcfb72e2d57e28f33cb361b9983513177755dc3f33ce3e7022ed62b77b'
    st.strictEqual(
      genesisHeader.stateRoot.toString('hex'),
      ropstenStateRoot,
      'genesis stateRoot match',
    )
    st.end()
  })

  t.test('should validate a genesis block header', st => {
    const blockchain = new Blockchain({ chain: 'ropsten' })
    const genesisHeader = new BlockHeader(undefined, { chain: 'ropsten' })
    genesisHeader.setGenesisParams()
    st.ok(genesisHeader.validate(blockchain))
    st.end()
  })

  const setupBlockchain = async (): Promise<[Blockchain, Block]> => {
    return new Promise((resolve, reject) => {
      const blockchain = new Blockchain({
        validateBlocks: true,
        validatePow: false,
        chain: 'ropsten',
      })
      const genesisBlock = new Block(undefined, { chain: 'ropsten' })
      genesisBlock.setGenesisParams()

      blockchain.putGenesis(genesisBlock, (err?: Error) => {
        if (err) {
          return reject(err)
        }
        const nextBlock = new Block(
          {
            header: new BlockHeader({
              number: 1,
              parentHash: genesisBlock.header.hash(),
              gasLimit: genesisBlock.header.gasLimit,
              timestamp: Date.now(),
            }),
          },
          { chain: 'ropsten' },
        )
        nextBlock.header.difficulty = utils.toBuffer(
          nextBlock.header.canonicalDifficulty(genesisBlock),
        )

        blockchain.putBlock(nextBlock, async (err?: Error) => {
          if (err) {
            return reject(err)
          }
          resolve([blockchain, nextBlock])
        })
      })
    })
  }

  t.test('should validate a valid block header', async st => {
    const [blockchain, lastBlock] = await setupBlockchain()
    const nextBlock = new BlockHeader(
      {
        number: 2,
        parentHash: lastBlock.header.hash(),
        gasLimit: lastBlock.header.gasLimit,
        timestamp: Date.now(),
        extraData: Buffer.from('abc'),
      },
      { chain: 'ropsten' },
    )
    nextBlock.difficulty = utils.toBuffer(nextBlock.canonicalDifficulty(lastBlock))
    try {
      await nextBlock.validate(blockchain)
      st.ok(true)
      st.end()
    } catch (error) {
      st.fail(error)
      st.end()
    }
  })

  t.test('should not validate a block header with invalid difficulty', async st => {
    const [blockchain, lastBlock] = await setupBlockchain()
    const nextBlock = new BlockHeader(
      {
        number: 2,
        parentHash: lastBlock.header.hash(),
        gasLimit: lastBlock.header.gasLimit,
        timestamp: Date.now(),
        extraData: Buffer.from('abc'),
      },
      { chain: 'ropsten' },
    )
    // difficulty purposefully not set to throw invalid difficulty
    try {
      await nextBlock.validate(blockchain)
      st.fail('should not validate')
      st.end()
    } catch (error) {
      st.ok(true)
      st.end()
    }
  })

  t.test('should not validate a block header with invalid gas limit', async st => {
    const [blockchain, lastBlock] = await setupBlockchain()
    const nextBlock = new BlockHeader(
      {
        number: 2,
        parentHash: lastBlock.header.hash(),
        timestamp: Date.now(),
        extraData: Buffer.from('abc'),
      },
      { chain: 'ropsten' },
    )
    nextBlock.difficulty = utils.toBuffer(nextBlock.canonicalDifficulty(lastBlock))
    // gas limit purposefully not set to throw invalid difficulty
    try {
      await nextBlock.validate(blockchain)
      st.fail('should not validate')
      st.end()
    } catch (error) {
      st.ok(true)
      st.end()
    }
  })

  t.test('should not validate a block header with invalid height', async st => {
    const [blockchain, lastBlock] = await setupBlockchain()
    const nextBlock = new BlockHeader(
      {
        number: utils.toBuffer(100),
        parentHash: lastBlock.header.hash(),
        gasLimit: lastBlock.header.gasLimit,
        timestamp: Date.now(),
        extraData: Buffer.from('abc'),
      },
      { chain: 'ropsten' },
    )
    nextBlock.difficulty = utils.toBuffer(nextBlock.canonicalDifficulty(lastBlock))
    try {
      await nextBlock.validate(blockchain)
      st.fail('should not validate')
      st.end()
    } catch (error) {
      st.ok(true)
      st.end()
    }
  })

  t.test('should not validate a block header with invalid timestamp', async st => {
    const [blockchain, lastBlock] = await setupBlockchain()
    const nextBlock = new BlockHeader(
      {
        number: 2,
        parentHash: lastBlock.header.hash(),
        gasLimit: lastBlock.header.gasLimit,
        extraData: Buffer.from('abc'),
      },
      { chain: 'ropsten' },
    )
    nextBlock.difficulty = utils.toBuffer(nextBlock.canonicalDifficulty(lastBlock))
    // timestamp purposefully not set to throw invalid timestamp
    try {
      await nextBlock.validate(blockchain)
      st.fail('should not validate')
      st.end()
    } catch (error) {
      st.ok(true)
      st.end()
    }
  })

  t.test('should not validate a block header with invalid parent', async st => {
    const [blockchain, lastBlock] = await setupBlockchain()
    const nextBlock = new BlockHeader(
      {
        number: 2,
        gasLimit: lastBlock.header.gasLimit,
        timestamp: Date.now(),
        extraData: Buffer.from('abc'),
      },
      { chain: 'ropsten' },
    )
    nextBlock.difficulty = utils.toBuffer(nextBlock.canonicalDifficulty(lastBlock))
    // parentHash set to a random invalid parent hash
    nextBlock.parentHash = utils.toBuffer(
      '0xc596cb892b649b4917da8c6b78611346d55daf7bcf4375da86a2d98810888e84',
    )
    try {
      await nextBlock.validate(blockchain)
      st.fail('should not validate')
      st.end()
    } catch (error) {
      st.ok(true)
      st.end()
    }
  })

  t.test('should not validate a header with invalid amount of extra data', async st => {
    const [blockchain, lastBlock] = await setupBlockchain()
    const nextBlock = new BlockHeader(
      {
        number: 2,
        parentHash: lastBlock.header.hash(),
        gasLimit: lastBlock.header.gasLimit,
        timestamp: Date.now(),
        extraData: Buffer.from('abc'),
      },
      { chain: 'ropsten' },
    )
    nextBlock.difficulty = utils.toBuffer(nextBlock.canonicalDifficulty(lastBlock))
    nextBlock.extraData = Buffer.from('a'.repeat(1000))
    try {
      await nextBlock.validate(blockchain)
      st.fail('should not validate')
      st.end()
    } catch (error) {
      st.ok(true)
      st.end()
    }
  })
})
