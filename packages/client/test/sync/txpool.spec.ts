import tape from 'tape-catch'
import Common from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { Block } from '@ethereumjs/block'
import { TxPool } from '../../lib/sync/txpool'
import { Config } from '../../lib/config'

tape('[TxPool]', async (t) => {
  const common = new Common({ chain: 'mainnet', hardfork: 'london' })
  const config = new Config({ transports: [], loglevel: 'error' })

  const A = {
    address: Buffer.from('0b90087d864e82a284dca15923f3776de6bb016f', 'hex'),
    privateKey: Buffer.from(
      '64bf9cc30328b0e42387b3c82c614e6386259136235e20c1357bd11cdee86993',
      'hex'
    ),
  }

  const B = {
    address: Buffer.from('6f62d8382bf2587361db73ceca28be91b2acb6df', 'hex'),
    privateKey: Buffer.from(
      '2a6e9ad5a6a8e4f17149b8bc7128bf090566a11dbd63c30e5a0ee9f161309cd6',
      'hex'
    ),
  }

  const createTx = (from = A, to = B, nonce = 0, value = 1) => {
    const txData = {
      nonce,
      maxFeePerGas: 1000000000,
      maxInclusionFeePerGas: 100000000,
      gasLimit: 100000,
      to: to.address,
      value,
    }
    const tx = FeeMarketEIP1559Transaction.fromTxData(txData, { common })
    const signedTx = tx.sign(from.privateKey)
    return signedTx
  }

  const txA01 = createTx() // A -> B, nonce: 0, value: 1
  const txA02 = createTx(A, B, 0, 2) // A -> B, nonce: 0, value: 2 (different hash)
  const txB01 = createTx(B, A) // B -> A, nonce: 0
  const txB02 = createTx(B, A, 1, 5) // B -> A, nonce: 1

  t.test('should initialize correctly', (t) => {
    const config = new Config({ transports: [], loglevel: 'error' })
    const pool = new TxPool({ config })
    t.equal(pool.pool.size, 0, 'pool empty')
    t.notOk((pool as any).opened, 'pool not opened yet')
    pool.open()
    t.ok((pool as any).opened, 'pool opened')
    pool.start()
    t.ok((pool as any).running, 'pool running')
    pool.stop()
    t.notOk((pool as any).running, 'pool not running anymore')
    pool.close()
    t.notOk((pool as any).opened, 'pool not opened anymore')
    t.end()
  })

  t.test('should open/close', async (t) => {
    t.plan(3)
    const config = new Config({ transports: [], loglevel: 'error' })
    const pool = new TxPool({ config })

    pool.open()
    pool.start()
    t.ok((pool as any).opened, 'pool opened')
    t.equals(pool.open(), false, 'already opened')
    pool.stop()
    pool.close()
    t.notOk((pool as any).opened, 'closed')
    t.end()
  })

  t.test('announcedTxHashes() -> add single tx', async (t) => {
    const pool = new TxPool({ config })

    pool.open()
    pool.start()
    const peer: any = {
      eth: {
        getPooledTransactions: () => {
          return [null, [txA01.serialize()]]
        },
      },
    }
    await pool.includeAnnouncedTxs([txA01.hash()], peer)
    t.equal(pool.pool.size, 1, 'pool size 1')
    t.equal((pool as any).pending.length, 0, 'cleared pending txs')
    t.equal((pool as any).handled.size, 1, 'added to handled txs')

    pool.pool.clear()
    await pool.includeAnnouncedTxs([txA01.hash()], peer)
    t.equal(pool.pool.size, 0, 'should not add a once handled tx')

    pool.stop()
    pool.close()
    t.end()
  })

  t.test('announcedTxHashes() -> TX_RETRIEVAL_LIMIT', async (t) => {
    const pool = new TxPool({ config })
    const TX_RETRIEVAL_LIMIT: number = (pool as any).TX_RETRIEVAL_LIMIT

    pool.open()
    pool.start()
    const peer = {
      eth: {
        getPooledTransactions: (res: any) => {
          t.equal(res['hashes'].length, TX_RETRIEVAL_LIMIT, 'should limit to TX_RETRIEVAL_LIMIT')
          return [null, []]
        },
      },
    }
    const hashes = []
    for (let i = 1; i <= TX_RETRIEVAL_LIMIT + 1; i++) {
      // One more than TX_RETRIEVAL_LIMIT
      hashes.push(Buffer.from(i.toString().padStart(64, '0'), 'hex')) // '0000000000000000000000000000000000000000000000000000000000000001',...
    }

    await pool.includeAnnouncedTxs(hashes, peer as any)
    pool.stop()
    pool.close()
    t.end()
  })

  t.test('announcedTxHashes() -> add two txs (different sender)', async (t) => {
    const pool = new TxPool({ config })

    pool.open()
    pool.start()
    const peer: any = {
      eth: {
        getPooledTransactions: () => {
          return [null, [txA01.serialize(), txB01.serialize()]]
        },
      },
    }
    await pool.includeAnnouncedTxs([txA01.hash(), txB01.hash()], peer)
    t.equal(pool.pool.size, 2, 'pool size 2')
    pool.stop()
    pool.close()
    t.end()
  })

  t.test('announcedTxHashes() -> add two txs (same sender and nonce)', async (t) => {
    const config = new Config({ transports: [], loglevel: 'error' })
    const pool = new TxPool({ config })

    pool.open()
    pool.start()
    const peer: any = {
      eth: {
        getPooledTransactions: () => {
          return [null, [txA01.serialize(), txA02.serialize()]]
        },
      },
    }
    await pool.includeAnnouncedTxs([txA01.hash(), txA02.hash()], peer)
    t.equal(pool.pool.size, 1, 'pool size 1')
    const address = `0x${A.address.toString('hex')}`
    const poolContent = pool.pool.get(address)!
    t.equal(poolContent.length, 1, 'only one tx')
    t.deepEqual(poolContent[0].tx.hash(), txA02.hash(), 'only later-added tx')
    pool.stop()
    pool.close()
    t.end()
  })

  t.test('newBlocks() -> should remove included txs', async (t) => {
    const config = new Config({ transports: [], loglevel: 'error' })
    const pool = new TxPool({ config })

    pool.open()
    pool.start()
    let peer: any = {
      eth: {
        getPooledTransactions: () => {
          return [null, [txA01.serialize()]]
        },
      },
    }
    await pool.includeAnnouncedTxs([txA01.hash()], peer)
    t.equal(pool.pool.size, 1, 'pool size 1')

    // Craft block with tx not in pool
    let block = Block.fromBlockData({ transactions: [txA02] }, { common })
    pool.removeNewBlockTxs([block])
    t.equal(pool.pool.size, 1, 'pool size 1')

    // Craft block with tx in pool
    block = Block.fromBlockData({ transactions: [txA01] }, { common })
    pool.removeNewBlockTxs([block])
    t.equal(pool.pool.size, 0, 'pool should be empty')

    peer = {
      eth: {
        getPooledTransactions: () => {
          return [null, [txB01.serialize(), txB02.serialize()]]
        },
      },
    }
    await pool.includeAnnouncedTxs([txB01.hash(), txB02.hash()], peer)
    t.equal(pool.pool.size, 1, 'pool size 1')
    const address = `0x${B.address.toString('hex')}`
    let poolContent = pool.pool.get(address)!
    t.equal(poolContent.length, 2, 'two txs')

    // Craft block with tx not in pool
    block = Block.fromBlockData({ transactions: [txA02] }, { common })
    pool.removeNewBlockTxs([block])
    t.equal(pool.pool.size, 1, 'pool size 1')
    poolContent = pool.pool.get(address)!
    t.equal(poolContent.length, 2, 'two txs')

    // Craft block with tx in pool
    block = Block.fromBlockData({ transactions: [txB01] }, { common })
    pool.removeNewBlockTxs([block])
    poolContent = pool.pool.get(address)!
    t.equal(poolContent.length, 1, 'only one tx')

    // Craft block with tx in pool
    block = Block.fromBlockData({ transactions: [txB02] }, { common })
    pool.removeNewBlockTxs([block])
    t.equal(pool.pool.size, 0, 'pool size 0')

    pool.stop()
    pool.close()
    t.end()
  })

  t.test('cleanup()', async (t) => {
    const pool = new TxPool({ config })

    pool.open()
    pool.start()
    const peer: any = {
      eth: {
        getPooledTransactions: () => {
          return [null, [txA01.serialize(), txB01.serialize()]]
        },
      },
    }
    await pool.includeAnnouncedTxs([txA01.hash(), txB01.hash()], peer)
    t.equal(pool.pool.size, 2, 'pool size 2')
    t.equal((pool as any).handled.size, 2, 'handled size 2')

    pool.cleanup()
    t.equal(
      pool.pool.size,
      2,
      'should not remove txs from pool (POOLED_STORAGE_TIME_LIMIT within range)'
    )
    t.equal(
      (pool as any).handled.size,
      2,
      'should not remove txs from handled (HANDLED_CLEANUP_TIME_LIMIT within range)'
    )

    const address = txB01.getSenderAddress().toString()
    const poolObj = pool.pool.get(address)![0]
    poolObj.added = Date.now() - pool.POOLED_STORAGE_TIME_LIMIT * 60 - 1
    pool.pool.set(address, [poolObj])

    const hash = txB01.hash().toString('hex')
    const handledObj = (pool as any).handled.get(hash)
    handledObj.added = Date.now() - pool.HANDLED_CLEANUP_TIME_LIMIT * 60 - 1
    ;(pool as any).handled.set(hash, handledObj)

    pool.cleanup()
    t.equal(
      pool.pool.size,
      1,
      'should remove txs from pool (POOLED_STORAGE_TIME_LIMIT before range)'
    )
    t.equal(
      (pool as any).handled.size,
      1,
      'should remove txs from handled (HANDLED_CLEANUP_TIME_LIMIT before range)'
    )

    pool.stop()
    pool.close()
    t.end()
  })
})
