import { addHexPrefix, bufferToInt, toBuffer } from 'ethereumjs-util'
import { SecureTrie as Trie } from 'merkle-patricia-tree'
import { Block } from '@ethereumjs/block'
import Blockchain from '@ethereumjs/blockchain'
import tape = require('tape')
import { setupPreConditions, verifyPostConditions } from './util'

const level = require('level')
const levelMem = require('level-mem')

export default async function runBlockchainTest(options: any, testData: any, t: tape.Test) {
  // ensure that the test data is the right fork data
  if (testData.network != options.forkConfigTestSuite) {
    t.comment('skipping test: no data available for ' + options.forkConfigTestSuite)
    return
  }

  if (testData.lastblockhash.substr(0, 2) === '0x') {
    // fix for BlockchainTests/GeneralStateTests/stRandom/*
    testData.lastblockhash = testData.lastblockhash.substr(2)
  }

  const blockchainDB = levelMem()
  const cacheDB = level('./.cachedb')
  const state = new Trie()
  const hardfork = options.forkConfigVM

  let validatePow = false
  // Only run with block validation when sealEngine present in test file
  // and being set to Ethash PoW validation
  if (testData.sealEngine && testData.sealEngine === 'Ethash') {
    validatePow = true
  }

  let eips = []
  if (hardfork == 'berlin') {
    // currently, the BLS tests run on the Berlin network, but our VM does not activate EIP2537
    // if you run the Berlin HF
    eips = [2537]
  }

  const { common } = options
  common.setHardforkByBlockNumber(0)

  const blockchain = new Blockchain({
    db: blockchainDB,
    common,
    validateBlocks: true,
    validatePow,
  })

  if (validatePow) {
    ;(blockchain.ethash as any).cacheDB = cacheDB
  }

  let VM
  if (options.dist) {
    VM = require('../dist').default
  } else {
    VM = require('../lib').default
  }

  const vm = new VM({
    state,
    blockchain,
    common,
  })

  // create and add genesis block
  const blockData = { header: formatBlockHeader(testData.genesisBlockHeader) }
  const genesisBlock = new Block(blockData, { common })

  // set up pre-state
  await setupPreConditions(vm.stateManager._trie, testData)

  t.ok(vm.stateManager._trie.root.equals(genesisBlock.header.stateRoot), 'correct pre stateRoot')

  if (testData.genesisRLP) {
    const rlp = toBuffer(testData.genesisRLP)
    t.ok(genesisBlock.serialize().equals(rlp), 'correct genesis RLP')
  }

  await blockchain.putGenesis(genesisBlock)

  async function handleError(error: string | undefined, expectException: string) {
    if (expectException) {
      t.pass(`Expected exception ${expectException}`)
    } else {
      console.log(error)
      t.fail(error)
    }
  }

  let currentFork = common.hardfork()
  let currentBlock = 0
  let lastBlock = 0
  for (const raw of testData.blocks) {
    lastBlock = currentBlock
    const paramFork = `expectException${options.forkConfigTestSuite}`
    // Two naming conventions in ethereum/tests to indicate "exception occurs on all HFs" semantics
    // Last checked: ethereumjs-testing v1.3.1 (2020-05-11)
    const paramAll1 = 'expectExceptionALL'
    const paramAll2 = 'expectException'
    const expectException = raw[paramFork]
      ? raw[paramFork]
      : raw[paramAll1] || raw[paramAll2] || raw.blockHeader == undefined

    // here we convert the rlp to block only to extract the number
    // we have to do this again later because the common might run on a new hardfork
    try {
      const block = new Block(Buffer.from(raw.rlp.slice(2), 'hex'), {
        common,
      })
      currentBlock = bufferToInt(block.header.number)
    } catch (e) {
      handleError(e, expectException)
      continue
    }

    if (currentBlock < lastBlock) {
      // "re-org": rollback the blockchain to currentBlock (i.e. delete that block number in the blockchain plus the children)
      t.fail('re-orgs are not supported by the test suite')
      return
    }

    try {
      // check if we should update common.
      let newFork = common.setHardforkByBlockNumber(currentBlock)
      if (newFork != currentFork) {
        currentFork = newFork
        vm._updateOpcodes()
      }

      const block = new Block(Buffer.from(raw.rlp.slice(2), 'hex'), {
        common,
      })
      await blockchain.putBlock(block)

      // This is a trick to avoid generating the canonical genesis
      // state. Generating the genesis state is not needed because
      // blockchain tests come with their own `pre` world state.
      // TODO: Add option to `runBlockchain` not to generate genesis state.
      vm._common.genesis().stateRoot = vm.stateManager._trie.root
      await vm.runBlockchain()
      const headBlock = await vm.blockchain.getHead()

      // if the test fails, then block.header is the prej because
      // vm.runBlock has a check that prevents the actual postState from being
      // imported if it is not equal to the expected postState. it is useful
      // for debugging to skip this, so that verifyPostConditions will compare
      // testData.postState to the actual postState, rather than to the preState.
      if (!options.debug) {
        // make sure the state is set before checking post conditions
        vm.stateManager._trie.root = headBlock.header.stateRoot
      }

      if (options.debug) {
        await verifyPostConditions(state, testData.postState, t)
      }

      await cacheDB.close()

      if (expectException) {
        t.fail('expected exception but test did not throw an exception: ' + expectException)
        return
      }
    } catch (error) {
      // caught an error, reduce block number
      currentBlock--
      await handleError(error, expectException)
    }
  }
  t.equal(
    (blockchain.meta as any).rawHead.toString('hex'),
    testData.lastblockhash,
    'correct last header block',
  )
  await cacheDB.close()
}

function formatBlockHeader(data: any) {
  const r: any = {}
  const keys = Object.keys(data)
  keys.forEach(function (key) {
    r[key] = addHexPrefix(data[key])
  })
  return r
}
