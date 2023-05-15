import * as tape from 'tape'

import { Chain, Common, ConsensusAlgorithm, ConsensusType, Hardfork } from '../src'

tape('[Common/Chains]: Initialization / Chain params', function (t: tape.Test) {
  t.test('Should initialize with chain provided', function (st: tape.Test) {
    let c = new Common({ chain: 'mainnet' })
    st.equal(c.chainName(), 'mainnet', 'should initialize with chain name')
    st.equal(c.chainId(), BigInt(1), 'should return correct chain Id')
    st.equal(c.networkId(), BigInt(1), 'should return correct network Id')
    st.equal(c.hardfork(), Hardfork.Shanghai, 'should set hardfork to current default hardfork')
    st.equal(
      c.hardfork(),
      c.DEFAULT_HARDFORK,
      'should set hardfork to hardfork set as DEFAULT_HARDFORK'
    )

    c = new Common({ chain: 1 })
    st.equal(c.chainName(), 'mainnet', 'should initialize with chain Id')

    st.end()
  })

  t.test('Should initialize with chain provided by Chain enum', function (st: tape.Test) {
    const c = new Common({ chain: Chain.Mainnet })
    st.equal(c.chainName(), 'mainnet', 'should initialize with chain name')
    st.equal(c.chainId(), BigInt(1), 'should return correct chain Id')
    st.equal(c.networkId(), BigInt(1), 'should return correct network Id')
    st.equal(c.hardfork(), Hardfork.Shanghai, 'should set hardfork to current default hardfork')
    st.equal(
      c.hardfork(),
      c.DEFAULT_HARDFORK,
      'should set hardfork to hardfork set as DEFAULT_HARDFORK'
    )

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

    st.end()
  })

  t.test('Should provide correct access to chain parameters', function (st: tape.Test) {
    let c = new Common({ chain: 'mainnet', hardfork: 'chainstart' })
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
})

tape('[Common]: isSupportedChainId static method', function (t: tape.Test) {
  t.test('Should return true for supported chainId', function (st: tape.Test) {
    st.equal(Common.isSupportedChainId(BigInt(1)), true, 'returns true')
    st.end()
  })

  t.test('Should return false for unsupported chainId', function (st: tape.Test) {
    st.equal(Common.isSupportedChainId(BigInt(0)), false, 'returns false')
    st.end()
  })
})

tape('[Common]: copy() listener tests', (t) => {
  const common = new Common({ chain: 'mainnet' })
  // Add two listeners
  common.on('hardforkChanged', () => {})
  common.on('hardforkChanged', () => {})
  const commonCopy = common.copy()
  t.equal(
    common.listenerCount('hardforkChanged'),
    2,
    'original common instance should have two listeners'
  )
  t.equal(
    commonCopy.listenerCount('hardforkChanged'),
    0,
    'copied common instance should have zero listeners'
  )
  t.end()
})
