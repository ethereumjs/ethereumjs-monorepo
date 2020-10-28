import tape from 'tape-catch'
import { Config } from '../lib/config'
const { defaultLogger } = require('../lib/logging')
defaultLogger.silent = true

tape('[Config]', (t) => {
  t.test('Initialization with default parameters', (t) => {
    const config = new Config()
    t.equal(config.maxPeers, 25)
    t.end()
  })

  t.test('Initialization with parameters passed', (t) => {
    const config = new Config({ maxPeers: 10 })
    t.equal(config.maxPeers, 10)
    t.end()
  })

  t.test('Singleton usage', (t) => {
    const config = new Config({ maxPeers: 10 })
    const config2 = new Config()

    t.ok(config === config2, 'should return the same singleton object reference')
    t.equal(config.maxPeers, 10)
    t.equal(config2.maxPeers, 10, 'should provide correct access to parameters passed')
    t.end()
  })
})
