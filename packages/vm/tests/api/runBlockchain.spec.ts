import tape from 'tape'
import { BN } from 'ethereumjs-util'
import { Block } from '@ethereumjs/block'
import Common from '@ethereumjs/common'
import Blockchain from '@ethereumjs/blockchain'
import { setupVM } from './utils'

const level = require('level-mem')

Error.stackTraceLimit = 100

tape('runBlockchain', (t) => {
  const blockchainDB = level()
  const common = new Common({ chain: 'goerli', hardfork: 'chainstart' })

  t.test('should run without a blockchain parameter', async (st) => {
    const vm = setupVM({ common })
    st.doesNotThrow(async function () {
      await vm.runBlockchain()
      st.end()
    })
  })

  t.test('should run without blocks', async (st) => {
    const vm = setupVM({ common })
    st.doesNotThrow(async function () {
      await vm.runBlockchain()
      st.end()
    })
  })

  t.test('should run with genesis block', async (st) => {
    try {
      const genesisBlock = Block.genesis(undefined, { common })

      const blockchain = await Blockchain.create({
        db: blockchainDB,
        common,
        validateBlocks: false,
        validateConsensus: false,
        genesisBlock,
      })
      const vm = setupVM({ genesisBlock, blockchain })

      st.ok(blockchain.meta.genesis, 'genesis should be set for blockchain')

      // @ts-ignore
      await vm.runBlockchain()
      st.end()
    } catch (e) {
      st.end(e)
    }
  })

  t.test('should run with valid and invalid blocks', async (st) => {
    const blockchainDB = level()

    const common = new Common({ chain: 'mainnet', hardfork: 'chainstart' })
    const genesisBlock = Block.genesis(undefined, { common })
    const blockchain = new Blockchain({
      db: blockchainDB,
      common,
      validateBlocks: false,
      validateConsensus: false,
      genesisBlock,
    })

    const vm = setupVM({ genesisBlock, blockchain })

    // Produce error on the third time runBlock is called
    let runBlockInvocations = 0
    ;(<any>vm).runBlock = () =>
      new Promise((resolve, reject) => {
        runBlockInvocations++
        if (runBlockInvocations === 3) {
          return reject(new Error('test'))
        }
        resolve({})
      })

    const b1 = createBlock(genesisBlock, 1, { common })
    const b2 = createBlock(b1, 2, { common })
    const b3 = createBlock(b2, 3, { common })

    await blockchain.putBlock(b1)
    await blockchain.putBlock(b2)
    await blockchain.putBlock(b3)

    let head = await blockchain.getHead()
    st.deepEqual(head.hash(), b3.hash(), 'block3 should be the current head')

    try {
      await vm.runBlockchain()
      st.fail('should have returned error')
    } catch (e) {
      st.equal(e.message, 'test')

      head = await blockchain.getHead()
      st.deepEqual(head.hash(), b2.hash(), 'should have removed invalid block from head')

      st.end()
    }
  })
})

function createBlock(parent: Block | undefined, n = 0, opts = {}) {
  if (!parent) {
    return Block.genesis(undefined, opts)
  }

  const blockData = {
    header: {
      number: n,
      parentHash: parent.hash(),
      difficulty: new BN(0xfffffff),
      stateRoot: parent.header.stateRoot,
    },
  }
  return Block.fromBlockData(blockData, opts)
}
