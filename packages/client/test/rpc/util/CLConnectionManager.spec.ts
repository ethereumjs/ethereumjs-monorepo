import tape from 'tape'
import { Config } from '../../../lib'
import { CLConnectionManager } from '../../../lib/rpc/util/CLConnectionManager'

tape('[CLConnectionManager]: Public method tests', (t) => {
  const config = new Config()
  const connMan = new CLConnectionManager({ config: config })
  connMan.start()
  t.ok(connMan.running, 'connection manager should start')
  connMan.stop()
  t.ok(!connMan.running, 'connection manager should stop')
  t.end()
})
