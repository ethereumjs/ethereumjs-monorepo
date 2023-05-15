import { Block } from '@ethereumjs/block'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import { AccessListEIP2930Transaction, FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import {
  Account,
  bytesToHex,
  concatBytes,
  hexStringToBytes,
  privateToAddress,
} from '@ethereumjs/util'
import * as tape from 'tape'

import { Config } from '../../lib/config'
import { getLogger } from '../../lib/logging'
import { PeerPool } from '../../lib/net/peerpool'
import { TxPool } from '../../lib/service/txpool'

const setup = () => {
  const config = new Config({
    transports: [],
    accountCache: 10000,
    storageCache: 1000,
    logger: getLogger({ loglevel: 'info' }),
  })
  const service: any = {
    chain: {
      headers: { height: BigInt(0) },
      getCanonicalHeadHeader: () => ({ height: BigInt(0) }),
    },
    execution: {
      vm: {
        stateManager: {
          getAccount: () => new Account(BigInt(0), BigInt('50000000000000000000')),
          setStateRoot: async (_root: Uint8Array) => {},
        },
        copy: () => service.execution.vm,
      },
    },
  }
  const pool = new TxPool({ config, service })
  return { pool }
}

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })
const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })

const handleTxs = async (
  txs: any[],
  failMessage: string,
  stateManager?: DefaultStateManager,
  pool?: TxPool
) => {
  if (pool === undefined) {
    pool = setup().pool
  }
  try {
    if (stateManager !== undefined) {
      ;(<any>pool).service.execution.vm.stateManager = stateManager
      ;(<any>pool).service.execution.vm.stateManager.setStateRoot = async (_root: Uint8Array) => {}
    }

    pool.open()
    pool.start()
    const peer: any = {
      eth: {
        getPooledTransactions: () => {
          return [null, txs]
        },
      },
    }
    const peerPool = new PeerPool({ config })

    const validTxs = txs.slice(0, txs.length - 1)

    await pool.handleAnnouncedTxHashes(
      validTxs.map((e) => e.hash()),
      peer,
      peerPool
    )

    await pool.add(txs[txs.length - 1])

    pool.stop()
    pool.close()
    return true
  } catch (e: any) {
    pool.stop()
    pool.close()

    // Return false if the error message contains the fail message
    return !(e.message as string).includes(failMessage)
  }
}

tape('[TxPool]', async (t) => {
  const ogStateManagerSetStateRoot = DefaultStateManager.prototype.setStateRoot
  DefaultStateManager.prototype.setStateRoot = (): any => {}

  const A = {
    address: hexStringToBytes('0b90087d864e82a284dca15923f3776de6bb016f'),
    privateKey: hexStringToBytes(
      '64bf9cc30328b0e42387b3c82c614e6386259136235e20c1357bd11cdee86993'
    ),
  }

  const B = {
    address: hexStringToBytes('6f62d8382bf2587361db73ceca28be91b2acb6df'),
    privateKey: hexStringToBytes(
      '2a6e9ad5a6a8e4f17149b8bc7128bf090566a11dbd63c30e5a0ee9f161309cd6'
    ),
  }

  const createTx = (from = A, to = B, nonce = 0, value = 1, feeBump = 0) => {
    const txData = {
      nonce,
      maxFeePerGas: 1000000000,
      maxPriorityFeePerGas: 1000000000,
      gasLimit: 100000,
      to: to.address,
      value,
    }
    txData.maxFeePerGas += (txData.maxFeePerGas * feeBump) / 100
    txData.maxPriorityFeePerGas += (txData.maxPriorityFeePerGas * feeBump) / 100
    const tx = FeeMarketEIP1559Transaction.fromTxData(txData, { common })
    const signedTx = tx.sign(from.privateKey)
    return signedTx
  }

  const txA01 = createTx() // A -> B, nonce: 0, value: 1
  const txA02 = createTx(A, B, 0, 2, 10) // A -> B, nonce: 0, value: 2 (different hash)
  const txA02_Underpriced = createTx(A, B, 0, 2, 9) // A -> B, nonce: 0, gas price is too low to replace txn
  const txB01 = createTx(B, A) // B -> A, nonce: 0, value: 1
  const txB02 = createTx(B, A, 1, 5) // B -> A, nonce: 1, value: 5

  t.test('should initialize correctly', (t) => {
    const { pool } = setup()
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
    const { pool } = setup()

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
    const { pool } = setup()

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
        request: () => {
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
        request: () => {
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
      bytesToHex(txA01.hash()),
      'new known tx hashes entry for announcing peer'
    )

    const txs = pool.getByHash([txA01.hash()])
    t.equal(txs.length, 1, 'should get correct number of txs by hash')
    t.equal(
      bytesToHex(txs[0].serialize()),
      bytesToHex(txA01.serialize()),
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
    const { pool } = setup()
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
      hashes.push(hexStringToBytes(i.toString().padStart(64, '0'))) // '0000000000000000000000000000000000000000000000000000000000000001',...
    }

    await pool.handleAnnouncedTxHashes(hashes, peer as any, peerPool)
    pool.stop()
    pool.close()
  })

  t.test('announcedTxHashes() -> add two txs (different sender)', async (t) => {
    const { pool } = setup()

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
    const { pool } = setup()

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
    const address = bytesToHex(A.address)
    const poolContent = pool.pool.get(address)!
    t.equal(poolContent.length, 1, 'only one tx')
    t.deepEqual(poolContent[0].tx.hash(), txA02.hash(), 'only later-added tx')
    pool.stop()
    pool.close()
  })

  t.test('announcedTxHashes() -> reject underpriced txn (same sender and nonce)', async (t) => {
    const { pool } = setup()

    pool.open()
    pool.start()
    const txs = [txA01]
    const peer: any = {
      eth: {
        getPooledTransactions: () => {
          return [null, txs]
        },
      },
    }
    const peerPool = new PeerPool({ config })
    let sentToPeer2 = 0
    const peer2: any = {
      id: '2',
      eth: {
        request: (methodName: string) => {
          sentToPeer2++
          // throw the error on methodName so as to be handy
          throw Error(methodName)
        },
      },
    }
    peerPool.add(peer2)

    await pool.handleAnnouncedTxHashes([txA01.hash()], peer, peerPool)

    try {
      await pool.add(txA02_Underpriced)
      t.fail('should fail adding underpriced txn to txpool')
    } catch (e: any) {
      t.ok(
        e.message.includes('replacement gas too low'),
        'successfully failed adding underpriced txn'
      )
      const poolObject = pool['handled'].get(bytesToHex(txA02_Underpriced.hash()))
      t.equal(poolObject?.error, e, 'should have an errored poolObject')
      const poolTxs = pool.getByHash([txA02_Underpriced.hash()])
      t.equal(poolTxs.length, 0, `should not be added in pool`)
    }
    t.equal(pool.pool.size, 1, 'pool size 1')
    t.equal(sentToPeer2, 1, 'broadcast attempt to the peer')
    t.equal((pool as any).knownByPeer.get(peer2.id).length, 1, 'known send objects')
    t.equal(
      (pool as any).knownByPeer.get(peer2.id)[0]?.error?.message,
      'NewPooledTransactionHashes',
      'should have errored sendObject for NewPooledTransactionHashes broadcast'
    )
    const address = bytesToHex(A.address)
    const poolContent = pool.pool.get(address)!
    t.equal(poolContent.length, 1, 'only one tx')
    t.deepEqual(poolContent[0].tx.hash(), txA01.hash(), 'only later-added tx')
    // Another attempt to add tx which should not be broadcased to peer2
    await pool.handleAnnouncedTxHashes([txA01.hash()], peer, peerPool)
    t.equal(sentToPeer2, 1, 'no new broadcast attempt to the peer')
    // Just to enhance logging coverage, assign peerPool for stats collection
    pool['service'].pool = peerPool
    pool._logPoolStats()
    pool.stop()
    pool.close()
  })

  t.test(
    'announcedTxHashes() -> reject underpriced txn (same sender and nonce) in handleAnnouncedTxHashes',
    async (t) => {
      const { pool } = setup()

      pool.open()
      pool.start()
      const txs = [txA01, txA02_Underpriced]
      const peer: any = {
        eth: {
          getPooledTransactions: () => {
            return [null, txs]
          },
        },
      }
      const peerPool = new PeerPool({ config })

      await pool.handleAnnouncedTxHashes([txA01.hash(), txA02_Underpriced.hash()], peer, peerPool)

      t.equal(pool.pool.size, 1, 'pool size 1')
      const address = bytesToHex(A.address)
      const poolContent = pool.pool.get(address)!
      t.equal(poolContent.length, 1, 'only one tx')
      t.deepEqual(poolContent[0].tx.hash(), txA01.hash(), 'only later-added tx')
      pool.stop()
      pool.close()
    }
  )

  t.test('announcedTxHashes() -> reject if pool is full', async (t) => {
    // Setup 5001 txs
    const txs = []
    for (let account = 0; account < 51; account++) {
      const pkey = concatBytes(
        hexStringToBytes('aa'.repeat(31)),
        hexStringToBytes(account.toString(16).padStart(2, '0'))
      )
      const from = {
        address: privateToAddress(pkey),
        privateKey: pkey,
      }
      for (let tx = 0; tx < 100; tx++) {
        const txn = createTx(from, B, tx)
        txs.push(txn)
        if (txs.length > 5000) {
          break
        }
      }
      if (txs.length > 5000) {
        break
      }
    }
    t.notOk(await handleTxs(txs, 'pool is full'), 'successfully rejected too many txs')
  })

  t.test('announcedTxHashes() -> reject if account tries to send more than 100 txs', async (t) => {
    // Setup 101 txs
    const txs = []

    for (let tx = 0; tx < 101; tx++) {
      const txn = createTx(A, B, tx)
      txs.push(txn)
    }

    t.notOk(
      await handleTxs(txs, 'already have max amount of txs for this account'),
      'successfully rejected too many txs from same account'
    )
  })

  t.test('announcedTxHashes() -> reject unsigned txs', async (t) => {
    const txs = []

    txs.push(
      FeeMarketEIP1559Transaction.fromTxData({
        maxFeePerGas: 1000000000,
        maxPriorityFeePerGas: 1000000000,
      })
    )

    t.notOk(
      await handleTxs(txs, 'Cannot call hash method if transaction is not signed'),
      'successfully rejected unsigned tx'
    )
  })

  t.test('announcedTxHashes() -> reject txs with invalid nonce', async (t) => {
    const txs = []

    txs.push(
      FeeMarketEIP1559Transaction.fromTxData({
        maxFeePerGas: 1000000000,
        maxPriorityFeePerGas: 1000000000,
        nonce: 0,
      }).sign(A.privateKey)
    )

    t.notOk(
      await handleTxs(txs, 'tx nonce too low', {
        getAccount: () => new Account(BigInt(1), BigInt('50000000000000000000')),
      } as any),
      'successfully rejected tx with invalid nonce'
    )
  })

  t.test('announcedTxHashes() -> reject txs with too much data', async (t) => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Paris })

    const txs = []
    txs.push(
      FeeMarketEIP1559Transaction.fromTxData(
        {
          maxFeePerGas: 1000000000,
          maxPriorityFeePerGas: 1000000000,
          nonce: 0,
          data: '0x' + '00'.repeat(128 * 1024 + 1),
        },
        { common }
      ).sign(A.privateKey)
    )

    t.notOk(
      await handleTxs(txs, 'exceeds the max data size', {
        getAccount: () => new Account(BigInt(0), BigInt('50000000000000000000000')),
      } as any),
      'successfully rejected tx with too much data'
    )
  })

  t.test('announcedTxHashes() -> account cannot pay the fees', async (t) => {
    const txs = []

    txs.push(
      FeeMarketEIP1559Transaction.fromTxData({
        maxFeePerGas: 1000000000,
        maxPriorityFeePerGas: 1000000000,
        gasLimit: 21000,
        nonce: 0,
      }).sign(A.privateKey)
    )

    t.notOk(
      await handleTxs(txs, 'insufficient balance', {
        getAccount: () => new Account(BigInt(0), BigInt('0')),
      } as any),
      'successfully rejected account with too low balance'
    )
  })

  t.test('announcedTxHashes() -> reject txs which cannot pay base fee', async (t) => {
    const txs = []

    txs.push(
      FeeMarketEIP1559Transaction.fromTxData({
        maxFeePerGas: 1000000000,
        maxPriorityFeePerGas: 1000000000,
        nonce: 0,
      }).sign(A.privateKey)
    )

    const { pool } = setup()

    ;(<any>pool).service.chain.getCanonicalHeadHeader = () => ({
      baseFeePerGas: BigInt(3000000000),
    })

    t.notOk(
      await handleTxs(txs, 'not within 50% range of current basefee', undefined, pool),
      'successfully rejected tx with too low gas price'
    )
  })

  t.test(
    'announcedTxHashes() -> reject txs which have gas limit higher than block gas limit',
    async (t) => {
      const txs = []

      txs.push(
        FeeMarketEIP1559Transaction.fromTxData({
          maxFeePerGas: 1000000000,
          maxPriorityFeePerGas: 1000000000,
          nonce: 0,
          gasLimit: 21000,
        }).sign(A.privateKey)
      )

      const { pool } = setup()

      ;(<any>pool).service.chain.getCanonicalHeadHeader = () => ({
        gasLimit: BigInt(5000),
      })

      t.notOk(
        await handleTxs(txs, 'exceeds last block gas limit', undefined, pool),
        'successfully rejected tx which has gas limit higher than block gas limit'
      )
    }
  )

  t.test('announcedTxHashes() -> reject txs which are already in pool', async (t) => {
    const txs = []

    txs.push(
      FeeMarketEIP1559Transaction.fromTxData({
        maxFeePerGas: 1000000000,
        maxPriorityFeePerGas: 1000000000,
      }).sign(A.privateKey)
    )

    txs.push(txs[0])

    const { pool } = setup()

    t.notOk(
      await handleTxs(txs, 'this transaction is already in the TxPool', undefined, pool),
      'successfully rejected tx which is already in pool'
    )
  })

  t.test('announcedTxHashes() -> reject txs with too low gas price', async (t) => {
    const txs = []

    txs.push(
      FeeMarketEIP1559Transaction.fromTxData({
        maxFeePerGas: 10000000,
        maxPriorityFeePerGas: 10000000,
        nonce: 0,
      }).sign(A.privateKey)
    )

    t.notOk(
      await handleTxs(txs, 'does not pay the minimum gas price of'),
      'successfully rejected tx with too low gas price'
    )
  })

  t.test(
    'announcedTxHashes() -> reject txs with too low gas price (AccessListTransaction)',
    async (t) => {
      const txs = []

      txs.push(
        AccessListEIP2930Transaction.fromTxData({
          gasPrice: 10000000,
          nonce: 0,
        }).sign(A.privateKey)
      )

      t.notOk(
        await handleTxs(txs, 'does not pay the minimum gas price of'),
        'successfully rejected tx with too low gas price'
      )
    }
  )

  t.test(
    'announcedTxHashes() -> reject txs with too low gas price (invalid tx type)',
    async (t) => {
      const txs = []

      const tx = AccessListEIP2930Transaction.fromTxData(
        {
          gasPrice: 1000000000 - 1,
          nonce: 0,
        },
        {
          freeze: false,
        }
      ).sign(A.privateKey)

      Object.defineProperty(tx, 'type', { get: () => 5 })

      txs.push(tx)

      t.notOk(await handleTxs(txs, ''), 'successfully rejected tx with invalid tx type')
    }
  )

  t.test('announcedTxs()', async (t) => {
    const { pool } = setup()

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
    const address = bytesToHex(A.address)
    const poolContent = pool.pool.get(address)!
    t.equal(poolContent.length, 1, 'one tx')
    t.deepEqual(poolContent[0].tx.hash(), txA01.hash(), 'correct tx')
    pool.stop()
    pool.close()
  })

  t.test('newBlocks() -> should remove included txs', async (t) => {
    const { pool } = setup()

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
    const address = bytesToHex(B.address)
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
    const { pool } = setup()

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
    poolObj.added = Date.now() - pool.POOLED_STORAGE_TIME_LIMIT * 1000 * 60 - 1
    pool.pool.set(address, [poolObj])

    const knownByPeerObj1 = (pool as any).knownByPeer.get(peer.id)[0]
    const knownByPeerObj2 = (pool as any).knownByPeer.get(peer.id)[1]
    knownByPeerObj1.added = Date.now() - pool.POOLED_STORAGE_TIME_LIMIT * 1000 * 60 - 1
    ;(pool as any).knownByPeer.set(peer.id, [knownByPeerObj1, knownByPeerObj2])

    const hash = bytesToHex(txB01.hash())
    const handledObj = (pool as any).handled.get(hash)
    handledObj.added = Date.now() - pool.HANDLED_CLEANUP_TIME_LIMIT * 1000 * 60 - 1
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
  DefaultStateManager.prototype.setStateRoot = ogStateManagerSetStateRoot
})
