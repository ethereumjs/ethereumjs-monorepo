import tape from 'tape'
import Common, { Chain, ConsensusAlgorithm, ConsensusType, Hardfork } from '../src/'
import { BN } from 'ethereumjs-util'

tape('[Common/Chains]: Initialization / Chain params', function (t: tape.Test) {
  t.test('Should initialize with chain provided', function (st: tape.Test) {
    let c = new Common({ chain: 'mainnet' })
    st.equal(c.chainName(), 'mainnet', 'should initialize with chain name')
    st.equal(c.chainId(), 1, 'should return correct chain Id')
    st.ok(c.chainIdBN().eqn(1), 'should return correct chain Id')
    st.equal(c.networkId(), 1, 'should return correct network Id')
    st.ok(c.networkIdBN().eqn(1), 'should return correct network Id')
    st.equal(c.hardfork(), 'istanbul', 'should set hardfork to current default hardfork')
    st.equal(
      c.hardfork(),
      c.DEFAULT_HARDFORK,
      'should set hardfork to hardfork set as DEFAULT_HARDFORK'
    )
    st.equal(c._isSupportedHardfork('constantinople'), true, 'should not restrict supported HFs')

    c = new Common({ chain: 1 })
    st.equal(c.chainName(), 'mainnet', 'should initialize with chain Id')

    st.end()
  })

  t.test('Should initialize with chain provided by Chain enum', function (st: tape.Test) {
    const c = new Common({ chain: Chain.Mainnet })
    st.equal(c.chainName(), 'mainnet', 'should initialize with chain name')
    st.equal(c.chainId(), 1, 'should return correct chain Id')
    st.ok(c.chainIdBN().eqn(1), 'should return correct chain Id')
    st.equal(c.networkId(), 1, 'should return correct network Id')
    st.ok(c.networkIdBN().eqn(1), 'should return correct network Id')
    st.equal(c.hardfork(), 'istanbul', 'should set hardfork to current default hardfork')
    st.equal(
      c.hardfork(),
      c.DEFAULT_HARDFORK,
      'should set hardfork to hardfork set as DEFAULT_HARDFORK'
    )
    st.equal(c._isSupportedHardfork('constantinople'), true, 'should not restrict supported HFs')

    st.end()
  })

  t.test('Should initialize with chain and hardfork provided', function (st: tape.Test) {
    const c = new Common({ chain: 'mainnet', hardfork: 'byzantium' })
    st.equal(c.hardfork(), 'byzantium', 'should return correct hardfork name')

    st.end()
  })

  t.test(
    'Should initialize with chain and hardfork provided by Chain and Hardfork enums',
    function (st: tape.Test) {
      const c = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Byzantium })
      st.equal(c.hardfork(), 'byzantium', 'should return correct hardfork name')

      st.end()
    }
  )

  t.test('Should initialize with supportedHardforks provided', function (st: tape.Test) {
    const c = new Common({
      chain: 'mainnet',
      hardfork: 'byzantium',
      supportedHardforks: ['byzantium', 'constantinople'],
    })
    st.equal(c._isSupportedHardfork('byzantium'), true, 'should return true for supported HF')
    const msg = 'should return false for unsupported HF'
    st.equal(c._isSupportedHardfork('spuriousDragon'), false, msg)

    st.end()
  })

  t.test('Should handle initialization errors', function (st: tape.Test) {
    let f = function () {
      new Common({ chain: 'chainnotexisting' })
    }
    let msg = 'should throw an exception on non-existing chain'
    st.throws(f, /not supported$/, msg) // eslint-disable-line no-new

    f = function () {
      new Common({ chain: 'mainnet', hardfork: 'hardforknotexisting' })
    }
    msg = 'should throw an exception on non-existing hardfork'
    st.throws(f, /not supported$/, msg) // eslint-disable-line no-new

    f = function () {
      new Common({
        chain: 'mainnet',
        hardfork: 'spuriousDragon',
        supportedHardforks: ['byzantium', 'constantinople'],
      })
    }
    msg = 'should throw an exception on conflicting active/supported HF params'
    st.throws(f, /supportedHardforks$/, msg) // eslint-disable-line no-new

    st.end()
  })

  t.test('Should provide correct access to chain parameters', function (st: tape.Test) {
    let c = new Common({ chain: 'mainnet', hardfork: 'chainstart' })
    let hash = '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3'
    st.equal(c.genesis().hash, hash, 'should return correct genesis hash')
    st.equal(c.hardforks()[3]['block'], 2463000, 'should return correct hardfork data')
    st.equal(typeof c.bootstrapNodes()[0].port, 'number', 'should return a port as number')
    st.equal(c.consensusType(), ConsensusType.ProofOfWork, 'should return correct consensus type')
    st.equal(
      c.consensusAlgorithm(),
      ConsensusAlgorithm.Ethash,
      'should return correct consensus algorithm'
    )
    st.deepEqual(c.consensusConfig(), {}, 'should return empty dictionary for consensus config')

    c = new Common({ chain: 'rinkeby', hardfork: 'chainstart' })
    hash = '0x6341fd3daf94b748c72ced5a5b26028f2474f5f00d824504e4fa37a75767e177'
    st.equal(c.genesis().hash, hash, 'should return correct genesis hash')
    st.equal(c.hardforks()[3]['block'], 3, 'should return correct hardfork data')
    st.equal(typeof c.bootstrapNodes()[0].port, 'number', 'should return a port as number')
    st.equal(
      c.consensusType(),
      ConsensusType.ProofOfAuthority,
      'should return correct consensus type'
    )
    st.equal(
      c.consensusAlgorithm(),
      ConsensusAlgorithm.Clique,
      'should return correct consensus algorithm'
    )
    st.equal(c.consensusConfig().epoch, 30000, 'should return correct consensus config parameters')
    st.end()
  })

  t.test('Should provide the bootnode information in a uniform way', function (st: tape.Test) {
    const configs = ['mainnet', 'ropsten', 'rinkeby', 'goerli']
    for (const network of configs) {
      const c = new Common({ chain: network })
      const bootnode = c.bootstrapNodes()[0]
      st.equal(typeof bootnode.ip, 'string', 'returns the ip as string')
      st.equal(typeof bootnode.port, 'number', 'returns the port as number')
      st.equal(typeof bootnode.id, 'string', 'returns the id as string')
      st.equal(
        typeof bootnode.location,
        'string',
        'returns the location as string (empty string if unavailable)'
      )
      st.equal(
        typeof bootnode.comment,
        'string',
        'returns a comment as string (empty string if unavailable)'
      )
    }
    st.end()
  })

  t.test('Should provide DNS network information in a uniform way', function (st: tape.Test) {
    const configs = ['mainnet', 'ropsten', 'rinkeby', 'goerli']
    for (const network of configs) {
      const c = new Common({ chain: network })
      const dnsNetworks = c.dnsNetworks()
      st.ok(Array.isArray(dnsNetworks), 'is an array')
      st.equal(typeof dnsNetworks[0], 'string', 'returns the DNS ENR url as a string')
    }
    st.end()
  })

  t.test(
    'genesis() -> should be able to access data for all chains provided',
    function (st: tape.Test) {
      const c = new Common({ chain: 'mainnet' })
      let hash = '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3'
      st.equal(c.genesis().hash, hash, 'mainnet')
      c.setChain('ropsten')
      hash = '0x41941023680923e0fe4d74a34bdac8141f2540e3ae90623718e47d66d1ca4a2d'
      st.equal(c.genesis().hash, hash, 'ropsten')
      c.setChain('rinkeby')
      hash = '0x6341fd3daf94b748c72ced5a5b26028f2474f5f00d824504e4fa37a75767e177'
      st.equal(c.genesis().hash, hash, 'rinkeby')
      c.setChain('kovan')
      hash = '0xa3c565fc15c7478862d50ccd6561e3c06b24cc509bf388941c25ea985ce32cb9'
      st.equal(c.genesis().hash, hash, 'kovan')
      c.setChain('goerli')
      hash = '0xbf7e331f7f7c1dd2e05159666b3bf8bc7a8a3a9eb1d518969eab529dd9b88c1a'
      st.equal(c.genesis().hash, hash, 'goerli')

      st.end()
    }
  )

  t.test(
    'genesisState() -> should be able to access data for all chains provided',
    function (st: tape.Test) {
      const c = new Common({ chain: 'mainnet' })
      let address = '0x000d836201318ec6899a67540690382780743280'
      let value = '0xad78ebc5ac6200000'
      st.equal(c.genesisState()[address], value, 'mainnet')

      c.setChain('goerli')
      address = '0x0000000000000000000000000000000000000000'
      value = '0x1'
      st.equal(c.genesisState()[address], value, 'goerli')

      c.setChain('kovan')
      address = '0x0000000000000000000000000000000000000001'
      value = '0x1'
      st.equal(c.genesisState()[address], value, 'kovan')

      c.setChain('rinkeby')
      address = '0x0000000000000000000000000000000000000000'
      value = '0x1'
      st.equal(c.genesisState()[address], value, 'rinkeby')

      c.setChain('ropsten')
      address = '0x0000000000000000000000000000000000000000'
      value = '0x1'
      st.equal(c.genesisState()[address], value, 'ropsten')

      st.end()
    }
  )
})

tape('[Common]: isSupportedChainId static method', function (t: tape.Test) {
  t.test('Should return true for supported chainId', function (st: tape.Test) {
    st.equal(Common.isSupportedChainId(new BN(1)), true, 'returns true')
    st.end()
  })

  t.test('Should return false for unsupported chainId', function (st: tape.Test) {
    st.equal(Common.isSupportedChainId(new BN(0)), false, 'returns false')
    st.end()
  })
})
