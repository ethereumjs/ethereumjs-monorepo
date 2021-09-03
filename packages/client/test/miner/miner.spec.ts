import tape from 'tape-catch'
import Common, { Chain as CommonChain, Hardfork } from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction, Transaction } from '@ethereumjs/tx'
import { Block } from '@ethereumjs/block'
import { Account, Address, BN } from 'ethereumjs-util'
import { Config } from '../../lib/config'
import { FullSynchronizer } from '../../lib/sync/fullsync'
import { Miner } from '../../lib/miner'

tape('[Miner]', async (t) => {
  class PeerPool {
    open() {}
    close() {}
  }
  class Chain {
    open() {}
    close() {}
    update() {}
  }

  const A = {
    address: new Address(Buffer.from('0b90087d864e82a284dca15923f3776de6bb016f', 'hex')),
    privateKey: Buffer.from(
      '64bf9cc30328b0e42387b3c82c614e6386259136235e20c1357bd11cdee86993',
      'hex'
    ),
  }

  const B = {
    address: new Address(Buffer.from('6f62d8382bf2587361db73ceca28be91b2acb6df', 'hex')),
    privateKey: Buffer.from(
      '2a6e9ad5a6a8e4f17149b8bc7128bf090566a11dbd63c30e5a0ee9f161309cd6',
      'hex'
    ),
  }

  const common = new Common({ chain: CommonChain.Rinkeby, hardfork: Hardfork.Berlin })
  const accounts: [Address, Buffer][] = [[A.address, A.privateKey]]
  const config = new Config({ transports: [], loglevel: 'error', accounts, mine: true, common })
  config.events.setMaxListeners(50)

  const createTx = (
    from = A,
    to = B,
    nonce = 0,
    value = 1,
    gasPrice = 1000000000,
    gasLimit = 100000
  ) => {
    const txData = {
      nonce,
      gasPrice,
      gasLimit,
      to: to.address,
      value,
    }
    const tx = Transaction.fromTxData(txData, { common })
    const signedTx = tx.sign(from.privateKey)
    return signedTx
  }

  const txA01 = createTx() // A -> B, nonce: 0, value: 1, normal gasPrice
  const txA02 = createTx(A, B, 1, 1, 2000000000) // A -> B, nonce: 1, value: 1, 2x gasPrice
  const txA03 = createTx(A, B, 2, 1, 3000000000) // A -> B, nonce: 2, value: 1, 3x gasPrice
  const txB01 = createTx(B, A, 0, 1, 2500000000) // B -> A, nonce: 0, value: 1, 2.5x gasPrice

  t.test('should initialize correctly', (t) => {
    const pool = new PeerPool() as any
    const chain = new Chain() as any
    const synchronizer = new FullSynchronizer({
      config,
      pool,
      chain,
    })
    const miner = new Miner({ config, synchronizer })
    t.notOk(miner.running)
    t.end()
  })

  t.test('should start/stop', async (t) => {
    const pool = new PeerPool() as any
    const chain = new Chain() as any
    const synchronizer = new FullSynchronizer({
      config,
      pool,
      chain,
    })
    let miner = new Miner({ config, synchronizer })
    t.notOk(miner.running)
    miner.start()
    t.ok(miner.running)
    miner.stop()
    t.notOk(miner.running)

    // Should not start when config.mine=false
    const configMineFalse = new Config({ transports: [], loglevel: 'error', accounts, mine: false })
    miner = new Miner({ config: configMineFalse, synchronizer })
    miner.start()
    t.notOk(miner.running, 'miner should not start when config.mine=false')
    t.end()
  })

  t.test('assembleBlocks() -> with a single tx', async (t) => {
    const pool = new PeerPool() as any
    const chain = new Chain() as any
    const synchronizer = new FullSynchronizer({
      config,
      pool,
      chain,
    })
    const miner = new Miner({ config, synchronizer })
    const { txPool } = synchronizer
    const { vm } = synchronizer.execution
    txPool.start()
    miner.start()

    // add balance to account
    await vm.stateManager.putAccount(A.address, new Account(new BN(0), new BN('200000000000001'))) // this line can be replaced with modifyAccountFields() when #1369 is available

    // add a block to skip generateCanonicalGenesis() in assembleBlock()
    await vm.runBlock({ block: Block.fromBlockData({}, { common }), generate: true })

    // add tx
    txPool.add(txA01)

    // disable consensus to skip PoA block signer validation
    ;(vm.blockchain as any)._validateConsensus = false

    chain.putBlocks = (blocks: Block[]) => {
      t.equal(blocks[0].transactions.length, 1, 'new block should include tx')
      miner.stop()
      txPool.stop()
      t.end()
    }
    ;(miner as any).queueNextAssembly(0)
  })

  t.test(
    'assembleBlocks() -> with multiple txs, properly ordered by gasPrice and nonce',
    async (t) => {
      const pool = new PeerPool() as any
      const chain = new Chain() as any
      const synchronizer = new FullSynchronizer({
        config,
        pool,
        chain,
      })
      const miner = new Miner({ config, synchronizer })
      const { txPool } = synchronizer
      const { vm } = synchronizer.execution
      txPool.start()
      miner.start()

      // add balance to accounts
      await vm.stateManager.putAccount(A.address, new Account(new BN(0), new BN('400000000000001'))) // these two lines can be replaced with modifyAccountFields() when #1369 is available
      await vm.stateManager.putAccount(B.address, new Account(new BN(0), new BN('400000000000001')))

      // add a block to skip generateCanonicalGenesis() in assembleBlock()
      await vm.runBlock({ block: Block.fromBlockData({}, { common }), generate: true })

      // add txs
      txPool.add(txA01)
      txPool.add(txA02)
      txPool.add(txA03)
      txPool.add(txB01)

      // disable consensus to skip PoA block signer validation
      ;(vm.blockchain as any)._validateConsensus = false

      chain.putBlocks = (blocks: Block[]) => {
        const msg = 'txs in block should be properly ordered by gasPrice and nonce'
        const expectedOrder = [txB01, txA01, txA02, txA03]
        for (const [index, tx] of expectedOrder.entries()) {
          t.ok(blocks[0].transactions[index].hash().equals(tx.hash()), msg)
        }
        miner.stop()
        txPool.stop()
        t.end()
      }
      ;(miner as any).queueNextAssembly(0)
    }
  )

  t.test('assembleBlocks() -> should not include tx under the baseFee', async (t) => {
    const customChainParams = { hardforks: [{ name: 'london', block: 0 }] }
    const common = Common.forCustomChain(CommonChain.Rinkeby, customChainParams, Hardfork.London)
    const config = new Config({ transports: [], loglevel: 'error', accounts, mine: true, common })
    const pool = new PeerPool() as any
    const chain = new Chain() as any
    const synchronizer = new FullSynchronizer({
      config,
      pool,
      chain,
    })
    const miner = new Miner({ config, synchronizer })
    const { txPool } = synchronizer
    const { vm } = synchronizer.execution
    txPool.start()
    miner.start()

    // the default block baseFee will be 7
    // add tx with maxFeePerGas of 6
    const tx = FeeMarketEIP1559Transaction.fromTxData(
      { to: B.address, maxFeePerGas: 6 },
      { common }
    ).sign(A.privateKey)
    txPool.add(tx)

    // disable consensus to skip PoA block signer validation
    ;(vm.blockchain as any)._validateConsensus = false
    vm.blockchain.putBlock = async () => {}

    chain.putBlocks = (blocks: Block[]) => {
      t.equal(blocks[0].transactions.length, 0, 'should not include tx')
      miner.stop()
      txPool.stop()
      t.end()
    }
    ;(miner as any).queueNextAssembly(0)
  })

  t.test("assembleBlocks() -> should stop assembling a block after it's full", async (t) => {
    const pool = new PeerPool() as any
    const chain = new Chain() as any
    const synchronizer = new FullSynchronizer({
      config,
      pool,
      chain,
    })
    const miner = new Miner({ config, synchronizer })
    const { txPool } = synchronizer
    const { vm } = synchronizer.execution
    txPool.start()
    miner.start()

    // add balance to accounts
    await vm.stateManager.putAccount(A.address, new Account(new BN(0), new BN('200000000000001'))) // this line can be replaced with modifyAccountFields() when #1369 is available

    // add a block to skip generateCanonicalGenesis() in assembleBlock()
    await vm.runBlock({ block: Block.fromBlockData({}, { common }), generate: true })

    // add txs
    const { gasLimit } = (await vm.blockchain.getLatestBlock()).header
    const data = '0xfe' // INVALID opcode, consumes all gas
    const tx1FillsBlockGasLimit = Transaction.fromTxData(
      { gasLimit: gasLimit.subn(1), data },
      { common }
    ).sign(A.privateKey)
    const tx2ExceedsBlockGasLimit = Transaction.fromTxData(
      { gasLimit: 21000, to: B.address, nonce: 1 },
      { common }
    ).sign(A.privateKey)
    txPool.add(tx1FillsBlockGasLimit)
    txPool.add(tx2ExceedsBlockGasLimit)

    // disable consensus to skip PoA block signer validation
    ;(vm.blockchain as any)._validateConsensus = false

    chain.putBlocks = (blocks: Block[]) => {
      t.equal(blocks[0].transactions.length, 1, 'only one tx should be included')
      miner.stop()
      txPool.stop()
      t.end()
    }
    ;(miner as any).queueNextAssembly(0)
  })
})
