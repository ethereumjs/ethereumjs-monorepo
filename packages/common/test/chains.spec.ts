import { assert, describe, it } from 'vitest'

import { Chain, Common, ConsensusAlgorithm, ConsensusType, Hardfork } from '../src/index.js'

describe('[Common/Chains]: Initialization / Chain params', () => {
  it('Should initialize with chain provided', () => {
    let c = new Common({ chain: 'mainnet' })
    assert.equal(c.chainName(), 'mainnet', 'should initialize with chain name')
    assert.equal(c.chainId(), BigInt(1), 'should return correct chain Id')
    assert.equal(c.networkId(), BigInt(1), 'should return correct network Id')
    assert.equal(c.hardfork(), Hardfork.Shanghai, 'should set hardfork to current default hardfork')
    assert.equal(
      c.hardfork(),
      c.DEFAULT_HARDFORK,
      'should set hardfork to hardfork set as DEFAULT_HARDFORK'
    )

    c = new Common({ chain: 1 })
    assert.equal(c.chainName(), 'mainnet', 'should initialize with chain Id')
  })

  it('Should initialize with chain provided by Chain enum', () => {
    const c = new Common({ chain: Chain.Mainnet })
    assert.equal(c.chainName(), 'mainnet', 'should initialize with chain name')
    assert.equal(c.chainId(), BigInt(1), 'should return correct chain Id')
    assert.equal(c.networkId(), BigInt(1), 'should return correct network Id')
    assert.equal(c.hardfork(), Hardfork.Shanghai, 'should set hardfork to current default hardfork')
    assert.equal(
      c.hardfork(),
      c.DEFAULT_HARDFORK,
      'should set hardfork to hardfork set as DEFAULT_HARDFORK'
    )
  })

  it('Should initialize with chain and hardfork provided', () => {
    const c = new Common({ chain: 'mainnet', hardfork: 'byzantium' })
    assert.equal(c.hardfork(), 'byzantium', 'should return correct hardfork name')
  })

  it('Should initialize with chain and hardfork provided by Chain and Hardfork enums', () => {
    const c = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Byzantium })
    assert.equal(c.hardfork(), 'byzantium', 'should return correct hardfork name')
  })

  it('Should handle initialization errors', () => {
    let f = function () {
      new Common({ chain: 'chainnotexisting' })
    }
    let msg = 'should throw an exception on non-existing chain'
    assert.throws(f, /not supported$/, undefined, msg) // eslint-disable-line no-new

    f = function () {
      new Common({ chain: 'mainnet', hardfork: 'hardforknotexisting' })
    }
    msg = 'should throw an exception on non-existing hardfork'
    assert.throws(f, /not supported$/, undefined, msg) // eslint-disable-line no-new
  })

  it('Should provide correct access to chain parameters', () => {
    let c = new Common({ chain: 'mainnet', hardfork: 'chainstart' })
    assert.equal(c.hardforks()[3]['block'], 2463000, 'should return correct hardfork data')
    assert.equal(typeof c.bootstrapNodes()[0].port, 'number', 'should return a port as number')
    assert.equal(
      c.consensusType(),
      ConsensusType.ProofOfWork,
      'should return correct consensus type'
    )
    assert.equal(
      c.consensusAlgorithm(),
      ConsensusAlgorithm.Ethash,
      'should return correct consensus algorithm'
    )
    assert.deepEqual(c.consensusConfig(), {}, 'should return empty dictionary for consensus config')

    c = new Common({ chain: 'rinkeby', hardfork: 'chainstart' })
    assert.equal(c.hardforks()[3]['block'], 3, 'should return correct hardfork data')
    assert.equal(typeof c.bootstrapNodes()[0].port, 'number', 'should return a port as number')
    assert.equal(
      c.consensusType(),
      ConsensusType.ProofOfAuthority,
      'should return correct consensus type'
    )
    assert.equal(
      c.consensusAlgorithm(),
      ConsensusAlgorithm.Clique,
      'should return correct consensus algorithm'
    )
    assert.equal(
      c.consensusConfig().epoch,
      30000,
      'should return correct consensus config parameters'
    )
  })

  it('Should provide the bootnode information in a uniform way', () => {
    const configs = ['mainnet', 'ropsten', 'rinkeby', 'goerli']
    for (const network of configs) {
      const c = new Common({ chain: network })
      const bootnode = c.bootstrapNodes()[0]
      assert.equal(typeof bootnode.ip, 'string', 'returns the ip as string')
      assert.equal(typeof bootnode.port, 'number', 'returns the port as number')
      assert.equal(typeof bootnode.id, 'string', 'returns the id as string')
      assert.equal(
        typeof bootnode.location,
        'string',
        'returns the location as string (empty string if unavailable)'
      )
      assert.equal(
        typeof bootnode.comment,
        'string',
        'returns a comment as string (empty string if unavailable)'
      )
    }
  })

  it('Should provide DNS network information in a uniform way', () => {
    const configs = ['mainnet', 'ropsten', 'rinkeby', 'goerli']
    for (const network of configs) {
      const c = new Common({ chain: network })
      const dnsNetworks = c.dnsNetworks()
      assert.ok(Array.isArray(dnsNetworks), 'is an array')
      assert.equal(typeof dnsNetworks[0], 'string', 'returns the DNS ENR url as a string')
    }
  })
})

describe('[Common]: isSupportedChainId static method', () => {
  it('Should return true for supported chainId', () => {
    assert.equal(Common.isSupportedChainId(BigInt(1)), true, 'returns true')
  })

  it('Should return false for unsupported chainId', () => {
    assert.equal(Common.isSupportedChainId(BigInt(0)), false, 'returns false')
  })
})

describe('[Common]: copy() listener tests', () => {
  it('Should work', () => {
    const common = new Common({ chain: 'mainnet' })
    // Add two listeners
    common.on('hardforkChanged', () => {})
    common.on('hardforkChanged', () => {})
    const commonCopy = common.copy()
    assert.equal(
      common.listenerCount('hardforkChanged'),
      2,
      'original common instance should have two listeners'
    )
    assert.equal(
      commonCopy.listenerCount('hardforkChanged'),
      0,
      'copied common instance should have zero listeners'
    )
  })
})
