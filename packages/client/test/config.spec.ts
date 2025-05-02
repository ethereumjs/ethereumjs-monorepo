import { Common, Mainnet } from '@ethereumjs/common'
import { goerliChainConfig } from '@ethereumjs/testdata'
import { assert, describe, it } from 'vitest'

import { Config, DataDirectory } from '../src/config.ts'

describe('[Config]', () => {
  it('Initialization with default parameters', () => {
    const config = new Config()
    assert.strictEqual(config.maxPeers, 25)
  })

  it('Initialization with parameters passed', () => {
    const config = new Config({ maxPeers: 10, accountCache: 10000, storageCache: 1000 })
    assert.strictEqual(config.maxPeers, 10)
  })

  it('Chain data default directory', () => {
    const config = new Config()
    assert.strictEqual(config.getDataDirectory(DataDirectory.Chain), './datadir/mainnet/chain')
  })

  it('State data default directory', () => {
    const config = new Config()
    assert.strictEqual(config.getDataDirectory(DataDirectory.State), './datadir/mainnet/state')
  })

  it('Meta data default directory', () => {
    const config = new Config()
    assert.strictEqual(config.getDataDirectory(DataDirectory.Meta), './datadir/mainnet/meta')
  })

  it('peer discovery default mainnet setting', () => {
    const common = new Common({ chain: Mainnet })
    const config = new Config({ common, accountCache: 10000, storageCache: 1000 })
    assert.strictEqual(config.discDns, false, 'disables DNS peer discovery for mainnet')
    assert.strictEqual(config.discV4, true, 'enables DNS peer discovery for mainnet')
  })

  it('--discDns=true/false', () => {
    let common, config

    common = new Common({ chain: Mainnet })
    config = new Config({ common, discDns: true })
    assert.strictEqual(config.discDns, true, `default discDns setting can be overridden to true`)

    common = new Common({ chain: goerliChainConfig })
    config = new Config({ common, discDns: false })
    assert.strictEqual(config.discDns, false, `default discDns setting can be overridden to false`)
  })

  it('--discV4=true/false', () => {
    let common, config

    common = new Common({ chain: Mainnet })
    config = new Config({ common, discV4: false })
    assert.strictEqual(config.discV4, false, `default discV4 setting can be overridden to false`)

    common = new Common({ chain: goerliChainConfig })
    config = new Config({ common, discV4: true })
    assert.strictEqual(config.discV4, true, `default discV4 setting can be overridden to true`)
  })
})
