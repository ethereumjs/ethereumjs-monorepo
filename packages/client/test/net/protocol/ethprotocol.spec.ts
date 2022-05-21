import tape from 'tape'
import { Block } from '@ethereumjs/block'
import Common, { Hardfork } from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { BN } from 'ethereumjs-util'
import { Chain } from '../../../lib/blockchain/chain'
import { Config } from '../../../lib/config'
import { EthProtocol } from '../../../lib/net/protocol'

tape('[EthProtocol]', (t) => {
  t.test('should get properties', (t) => {
    const config = new Config({ transports: [] })
    const chain = new Chain({ config })
    const p = new EthProtocol({ config, chain })
    t.ok(typeof p.name === 'string', 'get name')
    t.ok(Array.isArray(p.versions), 'get versions')
    t.ok(Array.isArray(p.messages), 'get messages')
    t.end()
  })

  t.test('should open correctly', async (t) => {
    const config = new Config({ transports: [] })
    const chain = new Chain({ config })
    const p = new EthProtocol({ config, chain })
    await p.open()
    t.ok(p.opened, 'opened is true')
    t.notOk(await p.open(), 'repeat open')
    t.end()
  })

  t.test('should encode/decode status', (t) => {
    const config = new Config({ transports: [] })
    const chain = new Chain({ config })
    const p = new EthProtocol({ config, chain })
    Object.defineProperty(chain, 'networkId', {
      get: () => {
        return new BN(1)
      },
    })
    Object.defineProperty(chain, 'blocks', {
      get: () => {
        return {
          td: new BN(100),
          latest: { hash: () => '0xaa', header: { number: new BN(10) } },
        }
      },
    })
    Object.defineProperty(chain, 'genesis', {
      get: () => {
        return { hash: '0xbb' }
      },
    })
    t.deepEquals(
      p.encodeStatus(),
      {
        networkId: Buffer.from('01', 'hex'),
        td: Buffer.from('64', 'hex'),
        bestHash: '0xaa',
        genesisHash: '0xbb',
      },
      'encode status'
    )
    const status = p.decodeStatus({
      networkId: [0x01],
      td: Buffer.from('64', 'hex'),
      bestHash: '0xaa',
      genesisHash: '0xbb',
    })
    t.ok(
      status.networkId.eqn(1) &&
        status.td.eqn(100) &&
        status.bestHash === '0xaa' &&
        status.genesisHash === '0xbb',
      'decode status'
    )
    t.end()
  })

  t.test('verify that NewBlock handler encodes/decodes correctly', (t) => {
    const config = new Config({ transports: [] })
    const chain = new Chain({ config })
    const p = new EthProtocol({ config, chain })
    const td = new BN(100)
    const block = Block.fromBlockData({})
    const res = p.decode(p.messages.filter((message) => message.name === 'NewBlock')[0], [
      block.raw(),
      td.toBuffer(),
    ])
    const res2 = p.encode(p.messages.filter((message) => message.name === 'NewBlock')[0], [
      block,
      td,
    ])
    t.deepEquals(res[0].hash(), block.hash(), 'correctly decoded block')
    t.ok(new BN(res2[1]).eq(td), 'correctly encoded td')
    t.end()
  })

  t.test('verify that GetReceipts handler encodes/decodes correctly', (t) => {
    const config = new Config({ transports: [] })
    const chain = new Chain({ config })
    const p = new EthProtocol({ config, chain })
    const block = Block.fromBlockData({})
    const res = p.decode(p.messages.filter((message) => message.name === 'GetReceipts')[0], [
      new BN(1),
      [block.hash()],
    ])
    const res2 = p.encode(p.messages.filter((message) => message.name === 'GetReceipts')[0], {
      reqId: new BN(1),
      hashes: [block.hash()],
    })
    t.ok(res.reqId.eqn(1), 'correctly decoded reqId')
    t.ok(res.hashes[0].equals(block.hash()), 'correctly decoded blockHash')
    t.ok(new BN(res2[0]).eqn(1), 'correctly encoded reqId')
    t.ok(res2[1][0].equals(block.hash()), 'correctly encoded blockHash')
    t.end()
  })

  t.test('verify that PooledTransactions handler encodes correctly', (t) => {
    const config = new Config({
      transports: [],
      common: new Common({ chain: Config.CHAIN_DEFAULT, hardfork: Hardfork.London }),
    })
    const chain = new Chain({ config })
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
      reqId: new BN(1),
      txs: [tx],
    })
    t.ok(new BN(res[0]).eqn(1), 'correctly encoded reqId')
    t.deepEqual(res[1][0], tx.serialize(), 'EIP1559 transaction correctly encoded')
    t.end()
  })

  t.test('verify that Receipts encode/decode correctly', (t) => {
    const config = new Config({
      transports: [],
      common: new Common({ chain: Config.CHAIN_DEFAULT, hardfork: Hardfork.London }),
    })
    const chain = new Chain({ config })
    const p = new EthProtocol({ config, chain })
    const receipts = [
      {
        status: 1 as 0 | 1,
        gasUsed: new BN(100).toArrayLike(Buffer),
        bitvector: Buffer.alloc(256),
        logs: [[Buffer.alloc(20), [Buffer.alloc(32), Buffer.alloc(32, 1)], Buffer.alloc(10)]],
        txType: 2,
      },
      {
        status: 0 as 0 | 1,
        gasUsed: new BN(1000).toArrayLike(Buffer),
        bitvector: Buffer.alloc(256, 1),
        logs: [[Buffer.alloc(20, 1), [Buffer.alloc(32, 1), Buffer.alloc(32, 1)], Buffer.alloc(10)]],
        txType: 0,
      },
    ]

    // encode
    let res = p.encode(p.messages.filter((message) => message.name === 'Receipts')[0], {
      reqId: new BN(1),
      receipts,
    })
    t.ok(new BN(res[0]).eqn(1), 'correctly encoded reqId')
    const expectedSerializedReceipts = [
      Buffer.from(
        '02f9016d0164b9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f866f864940000000000000000000000000000000000000000f842a00000000000000000000000000000000000000000000000000000000000000000a001010101010101010101010101010101010101010101010101010101010101018a00000000000000000000',
        'hex'
      ),
      Buffer.from(
        'f9016f808203e8b9010001010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101f866f864940101010101010101010101010101010101010101f842a00101010101010101010101010101010101010101010101010101010101010101a001010101010101010101010101010101010101010101010101010101010101018a00000000000000000000',
        'hex'
      ),
    ]
    t.deepEqual(res[1], expectedSerializedReceipts, 'correctly encoded receipts')

    // decode the encoded result and match to the original receipts (without tx type)
    res = p.decode(p.messages.filter((message) => message.name === 'Receipts')[0], res)
    t.ok(new BN(res[0]).eqn(1), 'correctly decoded reqId')
    const receiptsWithoutTxType = receipts.map((r: any) => {
      delete r.txType
      return r
    })
    t.deepEqual(res[1], receiptsWithoutTxType, 'receipts correctly decoded')
    t.end()
  })
})
