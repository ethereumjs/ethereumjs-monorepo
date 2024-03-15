import { Block } from '@ethereumjs/block'
import { Common, Chain as CommonChain, Hardfork } from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction, TransactionFactory, TransactionType } from '@ethereumjs/tx'
import { Address, bigIntToBytes, bytesToBigInt, hexToBytes, randomBytes } from '@ethereumjs/util'
import { loadKZG } from 'kzg-wasm'
import { assert, describe, it } from 'vitest'

import { Chain } from '../../../src/blockchain/chain'
import { Config } from '../../../src/config'
import { EthProtocol } from '../../../src/net/protocol'

describe('[EthProtocol]', () => {
  it('should get properties', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const p = new EthProtocol({ config, chain })
    assert.ok(typeof p.name === 'string', 'get name')
    assert.ok(Array.isArray(p.versions), 'get versions')
    assert.ok(Array.isArray(p.messages), 'get messages')
  })

  it('should open correctly', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const chain = await Chain.create({ config })
    const p = new EthProtocol({ config, chain })
    await p.open()
    assert.ok(p.opened, 'opened is true')
    assert.notOk(await p.open(), 'repeat open')
  })

  it('should encode/decode status', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
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
    assert.deepEqual(
      p.encodeStatus(),
      {
        networkId: hexToBytes('0x01'),
        td: hexToBytes('0x64'),
        bestHash: '0xaa',
        genesisHash: '0xbb',
        latestBlock: hexToBytes('0x0a'),
      },
      'encode status'
    )
    const status = p.decodeStatus({
      networkId: [0x01],
      td: hexToBytes('0x64'),
      bestHash: '0xaa',
      genesisHash: '0xbb',
    })
    assert.ok(
      status.networkId === BigInt(1) &&
        status.td === BigInt(100) &&
        status.bestHash === '0xaa' &&
        status.genesisHash === '0xbb',
      'decode status'
    )
  })

  it('verify that NewBlock handler encodes/decodes correctly', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
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
    assert.deepEqual(res[0].hash(), block.hash(), 'correctly decoded block')
    assert.equal(bytesToBigInt(res2[1]), td, 'correctly encoded td')
  })

  it('verify that GetReceipts handler encodes/decodes correctly', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
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
    assert.equal(res.reqId, BigInt(1), 'correctly decoded reqId')
    assert.deepEqual(res.hashes[0], block.hash(), 'correctly decoded blockHash')
    assert.equal(bytesToBigInt(res2[0]), BigInt(1), 'correctly encoded reqId')
    assert.deepEqual(res2[1][0], block.hash(), 'correctly encoded blockHash')
  })

  it('verify that PooledTransactions handler encodes correctly', async () => {
    const config = new Config({
      accountCache: 10000,
      storageCache: 1000,
    })
    const chain = await Chain.create({ config })
    const p = new EthProtocol({ config, chain })

    chain.config.chainCommon.setHardfork(Hardfork.London)
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
    assert.equal(bytesToBigInt(res[0]), BigInt(1), 'correctly encoded reqId')
    assert.deepEqual(res[1][0], tx.serialize(), 'EIP1559 transaction correctly encoded')
  })

  it('verify that Receipts encode/decode correctly', async () => {
    const config = new Config({
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
    assert.equal(bytesToBigInt(res[0]), BigInt(1), 'correctly encoded reqId')
    const expectedSerializedReceipts = [
      hexToBytes(
        '0x02f9016d0164b9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f866f864940000000000000000000000000000000000000000f842a00000000000000000000000000000000000000000000000000000000000000000a001010101010101010101010101010101010101010101010101010101010101018a00000000000000000000'
      ),
      hexToBytes(
        '0xf9016f808203e8b9010001010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101f866f864940101010101010101010101010101010101010101f842a00101010101010101010101010101010101010101010101010101010101010101a001010101010101010101010101010101010101010101010101010101010101018a00000000000000000000'
      ),
    ]
    assert.deepEqual(res[1], expectedSerializedReceipts, 'correctly encoded receipts')

    // decode the encoded result and match to the original receipts (without tx type)
    res = p.decode(p.messages.filter((message) => message.name === 'Receipts')[0], res)
    assert.equal(BigInt(res[0]), BigInt(1), 'correctly decoded reqId')
    const receiptsWithoutTxType = receipts.map((r: any) => {
      delete r.txType
      return r
    })
    assert.deepEqual(res[1], receiptsWithoutTxType, 'receipts correctly decoded')
  })

  it('verify that Transactions handler encodes/decodes correctly', async () => {
    const kzg = await loadKZG()
    const config = new Config({
      common: new Common({
        chain: CommonChain.Holesky,
        hardfork: Hardfork.Paris,
        eips: [4895, 4844],
        customCrypto: {
          kzg,
        },
      }),
      accountCache: 10000,
      storageCache: 1000,
    })
    config.synchronized = true
    const chain = await Chain.create({ config })
    const p = new EthProtocol({ config, chain })

    const legacyTx = TransactionFactory.fromTxData({ type: 0 }, { common: config.chainCommon })
    const eip2929Tx = TransactionFactory.fromTxData({ type: 1 }, { common: config.chainCommon })
    const eip1559Tx = TransactionFactory.fromTxData({ type: 2 }, { common: config.chainCommon })
    const blobTx = TransactionFactory.fromTxData(
      { type: 3, to: Address.zero(), blobVersionedHashes: [hexToBytes('0x01' + '00'.repeat(31))] },
      { common: config.chainCommon }
    )
    const res = p.encode(p.messages.filter((message) => message.name === 'Transactions')[0], [
      legacyTx,
      eip2929Tx,
      eip1559Tx,
      blobTx,
    ])
    assert.deepEqual(res[0], legacyTx.serialize(), 'legacy tx correctly encoded')
    assert.deepEqual(res[1], eip2929Tx.serialize(), 'EIP29292 tx correctly encoded')
    assert.deepEqual(res[2], eip1559Tx.serialize(), 'EIP1559 tx correctly encoded')

    const decoded = p.decode(
      p.messages.filter((message) => message.name === 'Transactions')[0],
      res
    )
    assert.deepEqual(decoded[0].type, legacyTx.type, 'decoded legacy tx correctly')
    assert.deepEqual(decoded[1].type, eip2929Tx.type, 'decoded eip2929 tx correctly')
    assert.deepEqual(decoded[2].type, eip1559Tx.type, 'decoded EIP1559 tx correctly')
    assert.equal(decoded.length, 3, 'should not include blob transaction')
  })

  it('verify that NewPooledTransactionHashes encodes/decodes correctly', async () => {
    const config = new Config({
      common: new Common({ chain: Config.CHAIN_DEFAULT, hardfork: Hardfork.London }),
      accountCache: 10000,
      storageCache: 1000,
    })
    const chain = await Chain.create({ config })
    const p = new EthProtocol({ config, chain })
    const fakeTx = TransactionFactory.fromTxData({}).sign(randomBytes(32))
    const fakeHash = fakeTx.hash()
    const encoded = p.encode(
      p.messages.filter((message) => message.name === 'NewPooledTransactionHashes')[0],
      [fakeHash]
    )

    const encodedEth68 = p.encode(
      p.messages.filter((message) => message.name === 'NewPooledTransactionHashes')[0],
      [[fakeTx.type], [fakeTx.serialize().byteLength], [fakeHash]]
    )
    assert.deepEqual(encoded[0], fakeHash, 'encoded hash correctly with pre-eth/68 format')
    assert.deepEqual(encodedEth68[2][0], fakeHash, 'encoded hash correctly with eth/68 format')

    const decoded = p.decode(
      p.messages.filter((message) => message.name === 'NewPooledTransactionHashes')[0],
      encoded
    )
    const decodedEth68 = p.decode(
      p.messages.filter((message) => message.name === 'NewPooledTransactionHashes')[0],
      encodedEth68
    )
    assert.deepEqual(decoded[0], fakeHash, 'decoded hash correctly with pre-eth/68 format')
    assert.deepEqual(decodedEth68[2][0], fakeHash, 'decoded hash correctly with eth/68 format')
  })
})
