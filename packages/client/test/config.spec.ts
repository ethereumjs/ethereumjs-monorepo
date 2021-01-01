import tape from 'tape-catch'
import { Config } from '../lib/config'
const os = require('os')

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
    t.equal(
      config.getChainDataDirectory(),
      `${os.homedir()}/Library/Ethereum/ethereumjs/mainnet/chain`
    )
    t.end()
  })

  t.test('getStateDataDirectory() default directory', (t) => {
    const config = new Config()
    t.equal(
      config.getStateDataDirectory(),
      `${os.homedir()}/Library/Ethereum/ethereumjs/mainnet/state`
    )
    t.end()
  })
})
