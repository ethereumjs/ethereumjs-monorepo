import tape from 'tape'
import { Chain } from '../../../lib/blockchain'
import { Config } from '../../../lib/config'
import { SnapProtocol } from '../../../lib/net/protocol'

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

  // t.test('verify that GetAccountRange handler encodes/decodes correctly', (t) => {
  //   const config = new Config({ transports: [] })
  //   const chain = new Chain({ config })
  //   const p = new SnapProtocol({ config, chain })

  //   const root = new Buffer(1)
  //   const origin = new Buffer(1)
  //   const limit = new Buffer(1024)
  //   const bytes = BN(1024)
  //   const res = p.decode(p.messages.filter((message) => message.name === 'GetAccountRange')[0], [

  //   ])
  //   const res2 = p.encode(p.messages.filter((message) => message.name === 'GetAccountRange')[0], [
  //     block,
  //     td,
  //   ])
  //   t.deepEquals(res[0].hash(), block.hash(), 'correctly decoded block')
  //   t.ok(new BN(res2[1]).eq(td), 'correctly encoded td')
  //   t.end()
  // })
})
