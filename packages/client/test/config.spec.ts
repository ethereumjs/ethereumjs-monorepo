import tape from 'tape-catch'
import { Config } from '../lib/config'

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

  t.test('getChainDataDirectory() default directory', (t) => {
    const config = new Config()
    t.equal(config.getChainDataDirectory(), './datadir/mainnet/chain')
    t.end()
  })

  t.test('getStateDataDirectory() default directory', (t) => {
    const config = new Config()
    t.equal(config.getStateDataDirectory(), './datadir/mainnet/state')
    t.end()
  })
})
