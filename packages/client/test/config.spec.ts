import { Chain, Common } from '@ethereumjs/common'
import { assert, describe, it } from 'vitest'

import { Config, DataDirectory } from '../src/config'

describe('[Config]', () => {
  it('Initialization with default parameters', () => {
    const config = new Config()
    assert.equal(config.maxPeers, 25)
  })

  it('Initialization with parameters passed', () => {
    const config = new Config({ maxPeers: 10, accountCache: 10000, storageCache: 1000 })
    assert.equal(config.maxPeers, 10)
  })

  it('Chain data default directory', () => {
    const config = new Config()
    assert.equal(config.getDataDirectory(DataDirectory.Chain), './datadir/mainnet/chain')
  })

  it('State data default directory', () => {
    const config = new Config()
    assert.equal(config.getDataDirectory(DataDirectory.State), './datadir/mainnet/state')
  })

  it('Meta data default directory', () => {
    const config = new Config()
    assert.equal(config.getDataDirectory(DataDirectory.Meta), './datadir/mainnet/meta')
  })

  it('peer discovery default mainnet setting', () => {
    const common = new Common({ chain: Chain.Mainnet })
    const config = new Config({ common, accountCache: 10000, storageCache: 1000 })
    assert.equal(config.discDns, false, 'disables DNS peer discovery for mainnet')
    assert.equal(config.discV4, true, 'enables DNS peer discovery for mainnet')
  })

  it('peer discovery default testnet settings', () => {
    let config

    for (const chain of [Chain.Rinkeby, Chain.Goerli, Chain.Ropsten]) {
      const common = new Common({ chain })
      config = new Config({ common })
      assert.equal(config.discDns, true, `enables DNS peer discovery for ${chain}`)
      assert.equal(config.discV4, false, `disables V4 peer discovery for ${chain}`)
    }
  })

  it('--discDns=true/false', () => {
    let common, config, chain

    chain = Chain.Mainnet
    common = new Common({ chain })
    config = new Config({ common, discDns: true })
    assert.equal(config.discDns, true, `default discDns setting can be overridden to true`)

    chain = Chain.Rinkeby
    common = new Common({ chain })
    config = new Config({ common, discDns: false })
    assert.equal(config.discDns, false, `default discDns setting can be overridden to false`)
  })

  it('--discV4=true/false', () => {
    let common, config, chain

    chain = Chain.Mainnet
    common = new Common({ chain })
    config = new Config({ common, discV4: false })
    assert.equal(config.discDns, false, `default discV4 setting can be overridden to false`)

    chain = Chain.Rinkeby
    common = new Common({ chain })
    config = new Config({ common, discV4: true })
    assert.equal(config.discDns, true, `default discV4 setting can be overridden to true`)
  })
})
