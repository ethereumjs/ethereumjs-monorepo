import * as tape from 'tape'

import { Account, bigIntToBuffer } from '@ethereumjs/util'
import { Chain } from '../../../lib/blockchain'
import { Config } from '../../../lib/config'
import { SnapProtocol } from '../../../lib/net/protocol'

(BigInt.prototype as any).toJSON = function () {return this.toString();};

tape('[SnapProtocol]', (t) => {
  t.test('should get properties', (t) => {
    const config = new Config({ transports: [] })
    const chain = new Chain({ config })
    const p = new SnapProtocol({ config, chain })
    t.ok(typeof p.name === 'string', 'get name')
    t.ok(Array.isArray(p.versions), 'get versions')
    t.ok(Array.isArray(p.messages), 'get messages')
    t.end()
  })

  t.test('should open correctly', async (t) => {
    const config = new Config({ transports: [] })
    const chain = new Chain({ config })
    const p = new SnapProtocol({ config, chain })
    await p.open()
    t.ok(p.opened, 'opened is true')
    t.notOk(await p.open(), 'repeat open')
    t.end()
  })

  t.test('verify that GetAccountRange handler encodes/decodes correctly', (t) => {
    const config = new Config({ transports: [] })
    const chain = new Chain({ config })
    const p = new SnapProtocol({ config, chain })
    const root = {
      number: BigInt(4),
      stateRoot: Buffer.from([]),
    }
    const reqId = BigInt(1)
    const origin = Buffer.from(
      '0000000000000000000000000000000000000000000000000000000000000000',
      'hex'
    )
    const limit = Buffer.from(
      '0000000000000000000000000f00000000000000000000000000000000000010',
      'hex'
    )
    const bytes = BigInt(5000000)

    const res = p.decode(p.messages.filter((message) => message.name === 'GetAccountRange')[0], [
      reqId,
      root,
      origin,
      limit,
      bytes,
    ])
    const res2 = p.encode(p.messages.filter((message) => message.name === 'GetAccountRange')[0], {
      reqId: reqId,
      root: root,
      origin: origin,
      limit: limit,
      bytes: bytes,
    })

    t.ok(JSON.stringify(res.reqId) === JSON.stringify(reqId), 'correctly decoded reqId')
    t.ok(JSON.stringify(res.root) === JSON.stringify(root), 'correctly decoded root')
    t.ok(JSON.stringify(res.origin) === JSON.stringify(origin), 'correctly decoded origin')
    t.ok(JSON.stringify(res.limit) === JSON.stringify(limit), 'correctly decoded limit')
    t.ok(JSON.stringify(res.bytes) === JSON.stringify(bytes), 'correctly decoded bytes')
    t.ok(res)

    t.ok(JSON.stringify(res2[0]) === JSON.stringify(bigIntToBuffer(BigInt(1))), 'correctly encoded reqId')
    t.ok(JSON.stringify(res2[1]) === JSON.stringify(root), 'correctly encoded root')
    t.ok(JSON.stringify(res2[2]) === JSON.stringify(origin), 'correctly encoded origin')
    t.ok(JSON.stringify(res2[3]) === JSON.stringify(limit), 'correctly encoded limit')
    t.ok(JSON.stringify(res2[4]) === JSON.stringify(bytes), 'correctly encoded bytes')
    t.ok(res2)
    t.end()
  })

  t.test('verify that GetStorageRanges handler encodes/decodes correctly', (t) => {
    const config = new Config({ transports: [] })
    const chain = new Chain({ config })
    const p = new SnapProtocol({ config, chain })
    const root = {
      number: BigInt(4),
      stateRoot: Buffer.from([]),
      hash: () => {
        return Buffer.from([])
      },
    }
    const reqId = BigInt(1)
    const origin = Buffer.from(
      '0000000000000000000000000000000000000000000000000000000000000000',
      'hex'
    )
    const limit = Buffer.from(
      '0000000000000000000000000f00000000000000000000000000000000000010',
      'hex'
    )
    const bytes = BigInt(5000000)
    const accounts = [
      new Account(BigInt(0), BigInt('40000000000100000')),
      new Account(BigInt(2), BigInt('40000000000200000')),
    ]

    const res = p.decode(p.messages.filter((message) => message.name === 'GetStorageRanges')[0], [
      reqId,
      root,
      accounts,
      origin,
      limit,
      bytes,
    ])
    const res2 = p.encode(p.messages.filter((message) => message.name === 'GetStorageRanges')[0], {
      reqId: reqId,
      root: root,
      accounts: accounts,
      origin: origin,
      limit: limit,
      bytes: bytes,
    })

    t.ok(JSON.stringify(res.reqId) === JSON.stringify(reqId), 'correctly decoded reqId')
    t.ok(JSON.stringify(res.root) === JSON.stringify(root), 'correctly decoded root')
    t.ok(JSON.stringify(res.accounts) === JSON.stringify(accounts), 'correctly decoded accounts')
    t.ok(JSON.stringify(res.origin) === JSON.stringify(origin), 'correctly decoded origin')
    t.ok(JSON.stringify(res.limit) === JSON.stringify(limit), 'correctly decoded limit')
    t.ok(JSON.stringify(res.bytes) === JSON.stringify(bytes), 'correctly decoded bytes')
    t.ok(res)

    t.ok(JSON.stringify(res2[0]) === JSON.stringify(bigIntToBuffer(BigInt(1))), 'correctly encoded reqId')
    t.ok(JSON.stringify(res2[1]) === JSON.stringify(root), 'correctly encoded root')
    t.ok(JSON.stringify(res2[2]) === JSON.stringify(accounts), 'correctly encoded accounts')
    t.ok(JSON.stringify(res2[3]) === JSON.stringify(origin), 'correctly encoded origin')
    t.ok(JSON.stringify(res2[4]) === JSON.stringify(limit), 'correctly encoded limit')
    t.ok(JSON.stringify(res2[5]) === JSON.stringify(bigIntToBuffer(bytes)), 'correctly encoded bytes')
    t.ok(res2)
    t.end()
  })

  t.test('verify that GetByteCodes handler encodes/decodes correctly', (t) => {
    const config = new Config({ transports: [] })
    const chain = new Chain({ config })
    const p = new SnapProtocol({ config, chain })
    const reqId = BigInt(1)
    const hashes = Buffer.from(
      '0000000000000000000000000f00000000000000000000000000000000000010',
      'hex'
    )
    const bytes = BigInt(5000000)

    const res = p.decode(p.messages.filter((message) => message.name === 'GetByteCodes')[0], [
      reqId,
      hashes,
      bytes,
    ])
    const res2 = p.encode(p.messages.filter((message) => message.name === 'GetByteCodes')[0], {
      reqId: reqId,
      hashes: hashes,
      bytes: bytes,
    })

    t.ok(JSON.stringify(res.reqId) === JSON.stringify(reqId), 'correctly decoded reqId')
    t.ok(JSON.stringify(res.hashes) === JSON.stringify(hashes), 'correctly decoded hashes')
    t.ok(JSON.stringify(res.bytes) === JSON.stringify(bytes), 'correctly decoded bytes')
    t.ok(res)

    t.ok(JSON.stringify(res2[0]) === JSON.stringify(bigIntToBuffer(BigInt(1))), 'correctly encoded reqId')
    t.ok(JSON.stringify(res2[1]) === JSON.stringify(hashes), 'correctly encoded hashes')
    t.ok(JSON.stringify(res2[2]) === JSON.stringify(bigIntToBuffer(bytes)), 'correctly encoded bytes')
    t.ok(res2)
    t.end()
  })
})