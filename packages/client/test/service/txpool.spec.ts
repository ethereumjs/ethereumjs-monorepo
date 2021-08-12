import tape from 'tape-catch'
import { Config } from '../../lib/config'

tape('[TxPool]', async (t) => {
  const { TxPool } = await import('../../lib/service/txpool')

  t.test('should initialize correctly', (t) => {
    const config = new Config({ transports: [], loglevel: 'error' })
    const pool = new TxPool({ config })
    t.equal(pool.pool.size, 0, 'pool empty')
    t.notOk((pool as any).opened, 'pool not opened yet')
    t.end()
  })

  t.test('should open/close', async (t) => {
    t.plan(3)
    const config = new Config({ transports: [], loglevel: 'error' })
    const pool = new TxPool({ config })

    await pool.open()
    t.ok((pool as any).opened, 'pool opened')
    t.equals(await pool.open(), false, 'already opened')
    await pool.close()
    t.notOk((pool as any).opened, 'closed')
    t.end()
  })
})
