import tape from 'tape'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { Block } from '@ethereumjs/block'
import { PeerPool } from '../../lib/net/peerpool'
import { TxPool } from '../../lib/sync/txpool'
import { Config } from '../../lib/config'

tape('[TxPool]', async (t) => {
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })
  const config = new Config({ transports: [] })

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
  const txB01 = createTx(B, A) // B -> A, nonce: 0, value: 1
  const txB02 = createTx(B, A, 1, 5) // B -> A, nonce: 1, value: 5

  t.test('should initialize correctly', (t) => {
    const config = new Config({ transports: [] })
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
    const config = new Config({ transports: [] })
    const pool = new TxPool({ config })

    pool.open()
    pool.start()
    t.ok((pool as any).opened, 'pool opened')
    t.equals(pool.open(), false, 'already opened')
    pool.stop()
    pool.close()
    t.notOk((pool as any).opened, 'closed')
  })

  t.test('announcedTxHashes() -> add single tx / knownByPeer / getByHash()', async (t) => {
    // Safeguard that send() method from peer2 gets called
    t.plan(12)
    const pool = new TxPool({ config })

    pool.open()
    pool.start()
    const peer: any = {
      id: '1',
      eth: {
        getPooledTransactions: () => {
          return [null, [txA01]]
        },
        send: () => {
          t.fail('should not send to announcing peer')
        },
      },
    }
    let sentToPeer2 = 0
    const peer2: any = {
      id: '2',
      eth: {
        send: () => {
          sentToPeer2++
          t.equal(sentToPeer2, 1, 'should send once to non-announcing peer')
        },
      },
    }
    const peerPool = new PeerPool({ config })
    peerPool.add(peer)
    peerPool.add(peer2)

    await pool.handleAnnouncedTxHashes([txA01.hash()], peer, peerPool)
    t.equal(pool.pool.size, 1, 'pool size 1')
    t.equal((pool as any).pending.length, 0, 'cleared pending txs')
    t.equal((pool as any).handled.size, 1, 'added to handled txs')

    t.equal((pool as any).knownByPeer.size, 2, 'known tx hashes size 2 (entries for both peers)')
    t.equal((pool as any).knownByPeer.get(peer.id).length, 1, 'one tx added for peer 1')
    t.equal(
      (pool as any).knownByPeer.get(peer.id)[0].hash,
      txA01.hash().toString('hex'),
      'new known tx hashes entry for announcing peer'
    )

    const txs = pool.getByHash([txA01.hash()])
    t.equal(txs.length, 1, 'should get correct number of txs by hash')
    t.equal(
      txs[0].serialize().toString('hex'),
      txA01.serialize().toString('hex'),
      'should get correct tx by hash'
    )

    pool.pool.clear()
    await pool.handleAnnouncedTxHashes([txA01.hash()], peer, peerPool)
    t.equal(pool.pool.size, 0, 'should not add a once handled tx')
    t.equal(
      (pool as any).knownByPeer.get(peer.id).length,
      1,
      'should add tx only once to known tx hashes'
    )
    t.equal((pool as any).knownByPeer.size, 2, 'known tx hashes size 2 (entries for both peers)')

    pool.stop()
    pool.close()
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
    const peerPool = new PeerPool({ config })

    const hashes = []
    for (let i = 1; i <= TX_RETRIEVAL_LIMIT + 1; i++) {
      // One more than TX_RETRIEVAL_LIMIT
      hashes.push(Buffer.from(i.toString().padStart(64, '0'), 'hex')) // '0000000000000000000000000000000000000000000000000000000000000001',...
    }

    await pool.handleAnnouncedTxHashes(hashes, peer as any, peerPool)
    pool.stop()
    pool.close()
  })

  t.test('announcedTxHashes() -> add two txs (different sender)', async (t) => {
    const pool = new TxPool({ config })

    pool.open()
    pool.start()
    const peer: any = {
      eth: {
        getPooledTransactions: () => {
          return [null, [txA01, txB01]]
        },
      },
    }
    const peerPool = new PeerPool({ config })

    await pool.handleAnnouncedTxHashes([txA01.hash(), txB01.hash()], peer, peerPool)
    t.equal(pool.pool.size, 2, 'pool size 2')
    pool.stop()
    pool.close()
  })

  t.test('announcedTxHashes() -> add two txs (same sender and nonce)', async (t) => {
    const config = new Config({ transports: [] })
    const pool = new TxPool({ config })

    pool.open()
    pool.start()
    const peer: any = {
      eth: {
        getPooledTransactions: () => {
          return [null, [txA01, txA02]]
        },
      },
    }
    const peerPool = new PeerPool({ config })

    await pool.handleAnnouncedTxHashes([txA01.hash(), txA02.hash()], peer, peerPool)
    t.equal(pool.pool.size, 1, 'pool size 1')
    const address = A.address.toString('hex')
    const poolContent = pool.pool.get(address)!
    t.equal(poolContent.length, 1, 'only one tx')
    t.deepEqual(poolContent[0].tx.hash(), txA02.hash(), 'only later-added tx')
    pool.stop()
    pool.close()
  })

  t.test('announcedTxs()', async (t) => {
    const config = new Config({ transports: [] })
    const pool = new TxPool({ config })

    pool.open()
    pool.start()
    const peer: any = {
      eth: {
        send: () => {},
      },
    }
    const peerPool = new PeerPool({ config })

    await pool.handleAnnouncedTxs([txA01], peer, peerPool)
    t.equal(pool.pool.size, 1, 'pool size 1')
    const address = A.address.toString('hex')
    const poolContent = pool.pool.get(address)!
    t.equal(poolContent.length, 1, 'one tx')
    t.deepEqual(poolContent[0].tx.hash(), txA01.hash(), 'correct tx')
    pool.stop()
    pool.close()
  })

  t.test('newBlocks() -> should remove included txs', async (t) => {
    const config = new Config({ transports: [] })
    const pool = new TxPool({ config })

    pool.open()
    pool.start()
    let peer: any = {
      eth: {
        getPooledTransactions: () => {
          return [null, [txA01]]
        },
      },
    }
    const peerPool = new PeerPool({ config })

    await pool.handleAnnouncedTxHashes([txA01.hash()], peer, peerPool)
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
          return [null, [txB01, txB02]]
        },
      },
    }
    await pool.handleAnnouncedTxHashes([txB01.hash(), txB02.hash()], peer, peerPool)
    t.equal(pool.pool.size, 1, 'pool size 1')
    const address = B.address.toString('hex')
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
  })

  t.test('cleanup()', async (t) => {
    const pool = new TxPool({ config })

    pool.open()
    pool.start()
    const peer: any = {
      eth: {
        getPooledTransactions: () => {
          return [null, [txA01, txB01]]
        },
      },
      send: () => {},
    }
    const peerPool = new PeerPool({ config })
    peerPool.add(peer)

    await pool.handleAnnouncedTxHashes([txA01.hash(), txB01.hash()], peer, peerPool)
    t.equal(pool.pool.size, 2, 'pool size 2')
    t.equal((pool as any).handled.size, 2, 'handled size 2')
    t.equal((pool as any).knownByPeer.size, 1, 'known by peer size 1')
    t.equal((pool as any).knownByPeer.get(peer.id).length, 2, '2 known txs')

    pool.cleanup()
    t.equal(
      pool.pool.size,
      2,
      'should not remove txs from pool (POOLED_STORAGE_TIME_LIMIT within range)'
    )
    t.equal(
      (pool as any).knownByPeer.size,
      1,
      'should not remove txs from known by peer map (POOLED_STORAGE_TIME_LIMIT within range)'
    )
    t.equal(
      (pool as any).handled.size,
      2,
      'should not remove txs from handled (HANDLED_CLEANUP_TIME_LIMIT within range)'
    )

    const address = txB01.getSenderAddress().toString().slice(2)
    const poolObj = pool.pool.get(address)![0]
    poolObj.added = Date.now() - pool.POOLED_STORAGE_TIME_LIMIT * 60 - 1
    pool.pool.set(address, [poolObj])

    const knownByPeerObj1 = (pool as any).knownByPeer.get(peer.id)[0]
    const knownByPeerObj2 = (pool as any).knownByPeer.get(peer.id)[1]
    knownByPeerObj1.added = Date.now() - pool.POOLED_STORAGE_TIME_LIMIT * 60 - 1
    ;(pool as any).knownByPeer.set(peer.id, [knownByPeerObj1, knownByPeerObj2])

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
      (pool as any).knownByPeer.get(peer.id).length,
      1,
      'should remove one tx from known by peer map (POOLED_STORAGE_TIME_LIMIT before range)'
    )
    t.equal(
      (pool as any).handled.size,
      1,
      'should remove txs from handled (HANDLED_CLEANUP_TIME_LIMIT before range)'
    )

    pool.stop()
    pool.close()
  })
})
