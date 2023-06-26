import { Block } from '@ethereumjs/block'
import { Common, Hardfork } from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction, TransactionFactory, TransactionType } from '@ethereumjs/tx'
import { bigIntToBytes, bytesToBigInt, hexStringToBytes, randomBytes } from '@ethereumjs/util'
import * as tape from 'tape'

import { Chain } from '../../../src/blockchain/chain'
import { Config } from '../../../src/config'
import { EthProtocol } from '../../../src/net/protocol'

tape('[EthProtocol]', (t) => {
  t.test('should get properties', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const p = new EthProtocol({ config, chain })
    t.ok(typeof p.name === 'string', 'get name')
    t.ok(Array.isArray(p.versions), 'get versions')
    t.ok(Array.isArray(p.messages), 'get messages')
    t.end()
  })

  t.test('should open correctly', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const p = new EthProtocol({ config, chain })
    await p.open()
    t.ok(p.opened, 'opened is true')
    t.notOk(await p.open(), 'repeat open')
    t.end()
  })

  t.test('should encode/decode status', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const p = new EthProtocol({ config, chain })
    Object.defineProperty(chain, 'networkId', {
      get: () => {
        return BigInt(1)
      },
    })
    Object.defineProperty(chain, 'blocks', {
      get: () => {
        return {
          td: BigInt(100),
          latest: { hash: () => '0xaa', header: { number: BigInt(10) } },
        }
      },
    })
    Object.defineProperty(chain, 'genesis', {
      get: () => {
        return { hash: () => '0xbb' }
      },
    })
    t.deepEquals(
      p.encodeStatus(),
      {
        networkId: hexStringToBytes('01'),
        td: hexStringToBytes('64'),
        bestHash: '0xaa',
        genesisHash: '0xbb',
        latestBlock: hexStringToBytes('0a'),
      },
      'encode status'
    )
    const status = p.decodeStatus({
      networkId: [0x01],
      td: hexStringToBytes('64'),
      bestHash: '0xaa',
      genesisHash: '0xbb',
    })
    t.ok(
      status.networkId === BigInt(1) &&
        status.td === BigInt(100) &&
        status.bestHash === '0xaa' &&
        status.genesisHash === '0xbb',
      'decode status'
    )
    t.end()
  })

  t.test('verify that NewBlock handler encodes/decodes correctly', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const p = new EthProtocol({ config, chain })
    const td = BigInt(100)
    const block = Block.fromBlockData({}, { common: config.chainCommon })
    const res = p.decode(p.messages.filter((message) => message.name === 'NewBlock')[0], [
      block.raw(),
      bigIntToBytes(td),
    ])
    const res2 = p.encode(p.messages.filter((message) => message.name === 'NewBlock')[0], [
      block,
      td,
    ])
    t.deepEquals(res[0].hash(), block.hash(), 'correctly decoded block')
    t.equal(bytesToBigInt(res2[1]), td, 'correctly encoded td')
    t.end()
  })

  t.test('verify that GetReceipts handler encodes/decodes correctly', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const p = new EthProtocol({ config, chain })
    const block = Block.fromBlockData({})
    const res = p.decode(p.messages.filter((message) => message.name === 'GetReceipts')[0], [
      bigIntToBytes(1n),
      [block.hash()],
    ])
    const res2 = p.encode(p.messages.filter((message) => message.name === 'GetReceipts')[0], {
      reqId: BigInt(1),
      hashes: [block.hash()],
    })
    t.equal(res.reqId, BigInt(1), 'correctly decoded reqId')
    t.deepEquals(res.hashes[0], block.hash(), 'correctly decoded blockHash')
    t.equal(bytesToBigInt(res2[0]), BigInt(1), 'correctly encoded reqId')
    t.deepEquals(res2[1][0], block.hash(), 'correctly encoded blockHash')
    t.end()
  })

  t.test('verify that PooledTransactions handler encodes correctly', async (t) => {
    const config = new Config({
      transports: [],
      common: new Common({ chain: Config.CHAIN_DEFAULT, hardfork: Hardfork.London }),
      accountCache: 10000,
      storageCache: 1000,
    })
    const chain = await Chain.create({ config })
    const p = new EthProtocol({ config, chain })
    const tx = FeeMarketEIP1559Transaction.fromTxData(
      {
        maxFeePerGas: 10,
        maxPriorityFeePerGas: 8,
        gasLimit: 100,
        value: 6,
      },
      { common: config.chainCommon }
    )
    const res = p.encode(p.messages.filter((message) => message.name === 'PooledTransactions')[0], {
      reqId: BigInt(1),
      txs: [tx],
    })
    t.equal(bytesToBigInt(res[0]), BigInt(1), 'correctly encoded reqId')
    t.deepEqual(res[1][0], tx.serialize(), 'EIP1559 transaction correctly encoded')
    t.end()
  })

  t.test('verify that Receipts encode/decode correctly', async (t) => {
    const config = new Config({
      transports: [],
      common: new Common({ chain: Config.CHAIN_DEFAULT, hardfork: Hardfork.London }),
      accountCache: 10000,
      storageCache: 1000,
    })
    const chain = await Chain.create({ config })
    const p = new EthProtocol({ config, chain })
    const receipts = [
      {
        status: 1 as 0 | 1,
        cumulativeBlockGasUsed: BigInt(100),
        bitvector: new Uint8Array(256),
        logs: [
          [
            new Uint8Array(20),
            [new Uint8Array(32), new Uint8Array(32).fill(1)],
            new Uint8Array(10),
          ],
        ],
        txType: TransactionType.FeeMarketEIP1559,
      },
      {
        status: 0 as 0 | 1,
        cumulativeBlockGasUsed: BigInt(1000),
        bitvector: new Uint8Array(256).fill(1),
        logs: [
          [
            new Uint8Array(20).fill(1),
            [new Uint8Array(32).fill(1), new Uint8Array(32).fill(1)],
            new Uint8Array(10),
          ],
        ],
        txType: TransactionType.Legacy,
      },
    ]

    // encode
    let res = p.encode(p.messages.filter((message) => message.name === 'Receipts')[0], {
      reqId: BigInt(1),
      receipts,
    })
    t.equal(bytesToBigInt(res[0]), BigInt(1), 'correctly encoded reqId')
    const expectedSerializedReceipts = [
      hexStringToBytes(
        '02f9016d0164b9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f866f864940000000000000000000000000000000000000000f842a00000000000000000000000000000000000000000000000000000000000000000a001010101010101010101010101010101010101010101010101010101010101018a00000000000000000000'
      ),
      hexStringToBytes(
        'f9016f808203e8b9010001010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101f866f864940101010101010101010101010101010101010101f842a00101010101010101010101010101010101010101010101010101010101010101a001010101010101010101010101010101010101010101010101010101010101018a00000000000000000000'
      ),
    ]
    t.deepEqual(res[1], expectedSerializedReceipts, 'correctly encoded receipts')

    // decode the encoded result and match to the original receipts (without tx type)
    res = p.decode(p.messages.filter((message) => message.name === 'Receipts')[0], res)
    t.equal(BigInt(res[0]), BigInt(1), 'correctly decoded reqId')
    const receiptsWithoutTxType = receipts.map((r: any) => {
      delete r.txType
      return r
    })
    t.deepEqual(res[1], receiptsWithoutTxType, 'receipts correctly decoded')
    t.end()
  })

  t.test('verify that Transactions handler encodes/decodes correctly', async (st) => {
    const config = new Config({
      transports: [],
      common: new Common({
        chain: Config.CHAIN_DEFAULT,
        hardfork: Hardfork.Paris,
        eips: [4895, 4844],
      }),
      accountCache: 10000,
      storageCache: 1000,
    })
    config.synchronized = true
    const chain = await Chain.create({ config })
    const p = new EthProtocol({ config, chain })

    const legacyTx = TransactionFactory.fromTxData({ type: 0 })
    const eip2929Tx = TransactionFactory.fromTxData({ type: 1 })
    const eip1559Tx = TransactionFactory.fromTxData({ type: 2 })
    const blobTx = TransactionFactory.fromTxData({ type: 3 }, { common: config.chainCommon })
    const res = p.encode(p.messages.filter((message) => message.name === 'Transactions')[0], [
      legacyTx,
      eip2929Tx,
      eip1559Tx,
      blobTx,
    ])
    st.deepEqual(res[0], legacyTx.serialize(), 'legacy tx correctly encoded')
    st.deepEqual(res[1], eip2929Tx.serialize(), 'EIP29292 tx correctly encoded')
    st.deepEqual(res[2], eip1559Tx.serialize(), 'EIP1559 tx correctly encoded')

    const decoded = p.decode(
      p.messages.filter((message) => message.name === 'Transactions')[0],
      res
    )
    st.deepEqual(decoded[0].type, legacyTx.type, 'decoded legacy tx correctly')
    st.deepEqual(decoded[1].type, eip2929Tx.type, 'decoded eip2929 tx correctly')
    st.deepEqual(decoded[2].type, eip1559Tx.type, 'decoded EIP1559 tx correctly')
    st.equal(decoded.length, 3, 'should not include blob transaction')
    st.end()
  })

  t.test('verify that NewPooledTransactionHashes encodes/decodes correctly', async (st) => {
    const config = new Config({
      transports: [],
      common: new Common({ chain: Config.CHAIN_DEFAULT, hardfork: Hardfork.London }),
      accountCache: 10000,
      storageCache: 1000,
    })
    const chain = await Chain.create({ config })
    const p = new EthProtocol({ config, chain })
    const fakeHash = randomBytes(32)
    const res = p.encode(
      p.messages.filter((message) => message.name === 'NewPooledTransactionHashes')[0],
      [fakeHash]
    )
    st.deepEqual(res[0], fakeHash, 'encoded hash correctly')

    const decoded = p.decode(
      p.messages.filter((message) => message.name === 'NewPooledTransactionHashes')[0],
      res
    )

    st.deepEqual(decoded[0], fakeHash, 'decoded hash correctly')
    st.end()
  })
})
