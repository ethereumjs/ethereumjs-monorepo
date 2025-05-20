import { goerliChainConfig } from '@ethereumjs/testdata'
import { assert, describe, it } from 'vitest'

import {
  Common,
  ConsensusAlgorithm,
  ConsensusType,
  Hardfork,
  Mainnet,
  getPresetChainConfig,
} from '../src/index.ts'

import type { ChainConfig } from '../src/index.ts'

describe('[Common/Chains]: Initialization / Chain params', () => {
  it('Should initialize with chain provided', () => {
    const c = new Common({ chain: Mainnet })
    assert.strictEqual(c.chainName(), 'mainnet', 'should initialize with chain name')
    assert.strictEqual(c.chainId(), BigInt(1), 'should return correct chain Id')
    assert.strictEqual(
      c.hardfork(),
      Hardfork.Prague,
      'should set hardfork to current default hardfork',
    )
    assert.strictEqual(
      c.hardfork(),
      c.DEFAULT_HARDFORK,
      'should set hardfork to hardfork set as DEFAULT_HARDFORK',
    )
  })

  it('Deep copied common object should have parameters that are independent of the original copy', async () => {
    let chainConfig: ChainConfig
    let c: Common
    const setCommon = async () => {
      chainConfig = JSON.parse(JSON.stringify(Mainnet))
      c = new Common({ chain: chainConfig })
      assert.strictEqual(c.chainName(), 'mainnet', 'should initialize with chain name')
      assert.strictEqual(c.chainId(), BigInt(1), 'should return correct chain Id')
    }

    const resetCommon = async () => {
      // modify chain config
      const cCopy = c.copy()
      chainConfig.chainId = 2
      chainConfig.name = 'testnet'
      assert.strictEqual(cCopy.chainName(), 'mainnet', 'should return original chain name')
      assert.strictEqual(cCopy.chainId(), BigInt(1), 'should return original chain Id')
    }

    await setCommon()
    await resetCommon()
  })

  it('Should initialize with chain provided by chain name or network Id', () => {
    let chain = getPresetChainConfig('mainnet')
    let c = new Common({ chain })
    assert.strictEqual(c.chainName(), 'mainnet')
    chain = getPresetChainConfig(123)
    c = new Common({ chain })
    assert.strictEqual(c.chainName(), 'mainnet')
  })

  it('Should initialize with chain and hardfork provided', () => {
    const c = new Common({ chain: Mainnet, hardfork: 'byzantium' })
    assert.strictEqual(c.hardfork(), 'byzantium', 'should return correct hardfork name')
  })

  it('Should initialize with chain and hardfork provided by Chain and Hardfork enums', () => {
    const c = new Common({ chain: Mainnet, hardfork: Hardfork.Byzantium })
    assert.strictEqual(c.hardfork(), 'byzantium', 'should return correct hardfork name')
  })

  it('Should handle initialization errors', () => {
    const f = function () {
      new Common({ chain: Mainnet, hardfork: 'hardforkNotExisting' })
    }
    const msg = 'should throw an exception on non-existing hardfork'
    assert.throws(f, /not supported$/, undefined, msg)
  })

  it('Should provide correct access to chain parameters', () => {
    let c = new Common({ chain: Mainnet, hardfork: 'tangerineWhistle' })
    assert.strictEqual(c.hardforks()[3]['block'], 2463000, 'should return correct hardfork data')
    assert.strictEqual(
      typeof c.bootstrapNodes()[0].port,
      'number',
      'should return a port as number',
    )
    assert.strictEqual(
      c.consensusType(),
      ConsensusType.ProofOfWork,
      'should return correct consensus type',
    )
    assert.strictEqual(
      c.consensusAlgorithm(),
      ConsensusAlgorithm.Ethash,
      'should return correct consensus algorithm',
    )
    assert.deepEqual(c.consensusConfig(), {}, 'should return empty dictionary for consensus config')

    c = new Common({ chain: goerliChainConfig, hardfork: 'spuriousDragon' })
    assert.strictEqual(c.hardforks()[3]['block'], 0, 'should return correct hardfork data')
    assert.strictEqual(
      typeof c.bootstrapNodes()[0].port,
      'number',
      'should return a port as number',
    )
    assert.strictEqual(
      c.consensusType(),
      ConsensusType.ProofOfAuthority,
      'should return correct consensus type',
    )
    assert.strictEqual(
      c.consensusAlgorithm(),
      ConsensusAlgorithm.Clique,
      'should return correct consensus algorithm',
    )
    assert.strictEqual(
      c.consensusConfig().epoch,
      30000,
      'should return correct consensus config parameters',
    )
  })

  it('Should provide the bootnode information in a uniform way', () => {
    const configs = [Mainnet, goerliChainConfig]
    for (const network of configs) {
      const c = new Common({ chain: network })
      const bootnode = c.bootstrapNodes()[0]
      assert.strictEqual(typeof bootnode.ip, 'string', 'returns the ip as string')
      assert.strictEqual(typeof bootnode.port, 'number', 'returns the port as number')
      assert.strictEqual(typeof bootnode.id, 'string', 'returns the id as string')
      assert.strictEqual(
        typeof bootnode.location,
        'string',
        'returns the location as string (empty string if unavailable)',
      )
      assert.strictEqual(
        typeof bootnode.comment,
        'string',
        'returns a comment as string (empty string if unavailable)',
      )
    }
  })

  it('Should provide DNS network information in a uniform way', () => {
    const configs = [Mainnet, goerliChainConfig]
    for (const network of configs) {
      const c = new Common({ chain: network })
      const dnsNetworks = c.dnsNetworks()
      assert.isArray(dnsNetworks, 'is an array')
      assert.strictEqual(typeof dnsNetworks[0], 'string', 'returns the DNS ENR url as a string')
    }
  })
})

describe('[Common]: copy() listener tests', () => {
  it('Should work', () => {
    const common = new Common({ chain: Mainnet })
    // Add two listeners
    common.events.on('hardforkChanged', () => {})
    common.events.on('hardforkChanged', () => {})
    const commonCopy = common.copy()
    assert.strictEqual(
      common.events.listenerCount('hardforkChanged'),
      2,
      'original common instance should have two listeners',
    )
    assert.strictEqual(
      commonCopy.events.listenerCount('hardforkChanged'),
      0,
      'copied common instance should have zero listeners',
    )
  })
})
