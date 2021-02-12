import tape from 'tape-catch'
import { Config } from '../lib/config'
import Common from '@ethereumjs/common'

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

  t.test('peer discovery default mainnet setting', (t) => {
    const common = new Common({ chain: 'mainnet' })
    const config = new Config({ common })
    t.equal(config.discDns, false, 'disables DNS peer discovery for mainnet')
    t.equal(config.discV4, true, 'enables DNS peer discovery for mainnet')
    t.end()
  })

  t.test('peer discovery default testnet settings', (t) => {
    let config

    for (const chain of ['rinkeby', 'goerli', 'ropsten']) {
      const common = new Common({ chain })
      config = new Config({ common })
      t.equal(config.discDns, true, `enables DNS peer discovery for ${chain}`)
      t.equal(config.discV4, false, `disables V4 peer discovery for ${chain}`)
    }
    t.end()
  })

  t.test('--discDns=true/false', (t) => {
    let common, config, chain

    chain = 'mainnet'
    common = new Common({ chain })
    config = new Config({ common, discDns: true })
    t.equal(config.discDns, true, `default discDns setting can be overridden to true`)

    chain = 'rinkeby'
    common = new Common({ chain })
    config = new Config({ common, discDns: false })
    t.equal(config.discDns, false, `default discDns setting can be overridden to false`)
    t.end()
  })

  t.test('--discV4=true/false', (t) => {
    let common, config, chain

    chain = 'mainnet'
    common = new Common({ chain })
    config = new Config({ common, discV4: false })
    t.equal(config.discDns, false, `default discV4 setting can be overridden to false`)

    chain = 'rinkeby'
    common = new Common({ chain })
    config = new Config({ common, discV4: true })
    t.equal(config.discDns, true, `default discV4 setting can be overridden to true`)
    t.end()
  })
})
