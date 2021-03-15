import tape from 'tape'
import Common from '../src/'
import testnet from './data/testnet.json'
import testnet2 from './data/testnet2.json'
import testnet3 from './data/testnet3.json'

tape('[Common]: Custom chains', function (t: tape.Test) {
  t.test(
    'chain -> object: should provide correct access to private network chain parameters',
    function (st: tape.Test) {
      const c = new Common({ chain: testnet, hardfork: 'byzantium' })
      st.equal(c.chainName(), 'testnet', 'should initialize with chain name')
      st.equal(c.chainId(), 12345, 'should return correct chain Id')
      st.ok(c.chainIdBN().eqn(12345), 'should return correct chain Id')
      st.equal(c.networkId(), 12345, 'should return correct network Id')
      st.ok(c.networkIdBN().eqn(12345), 'should return correct network Id')
      st.equal(
        c.genesis().hash,
        '0xaa00000000000000000000000000000000000000000000000000000000000000',
        'should return correct genesis hash'
      )
      st.equal(c.hardforks()[3]['block'], 3, 'should return correct hardfork data')
      st.equal(c.bootstrapNodes()[1].ip, '10.0.0.2', 'should return a bootstrap node array')

      st.end()
    }
  )

  t.test(
    'chain -> object: should handle custom chain parameters with missing field',
    function (st: tape.Test) {
      const chainParams = Object.assign({}, testnet)
      delete (chainParams as any)['hardforks']
      st.throws(
        function () {
          new Common({ chain: chainParams })
        },
        /Missing required/,
        'should throw an exception on missing parameter'
      ) // eslint-disable-line no-new

      st.end()
    }
  )

  t.test('forCustomChain()', function (st: tape.Test) {
    const mainnetCommon = new Common({ chain: 'mainnet' })

    const customChainParams = { name: 'custom', chainId: 123, networkId: 678 }
    const customChainCommon = Common.forCustomChain('mainnet', customChainParams, 'byzantium')

    // From custom chain params
    st.equal(customChainCommon.chainName(), customChainParams.name)
    st.equal(customChainCommon.chainId(), customChainParams.chainId)
    st.ok(customChainCommon.chainIdBN().eqn(customChainParams.chainId))
    st.equal(customChainCommon.networkId(), customChainParams.networkId)
    st.ok(customChainCommon.networkIdBN().eqn(customChainParams.networkId))

    // Fallback params from mainnet
    st.equal(customChainCommon.genesis(), mainnetCommon.genesis())
    st.equal(customChainCommon.bootstrapNodes(), mainnetCommon.bootstrapNodes())
    st.equal(customChainCommon.hardforks(), mainnetCommon.hardforks())

    // Set only to this Common
    st.equal(customChainCommon.hardfork(), 'byzantium')

    st.end()
  })

  t.test('customChains parameter: initialization exception', (st) => {
    st.throws(
      function () {
        new Common({ chain: testnet, customChains: [testnet] })
      },
      /Chain must be a string or number when initialized with customChains passed in/,
      'should throw an exception on wrong initialization'
    ) // eslint-disable-line no-new

    st.end()
  })

  t.test('customChains parameter: initialization', (st) => {
    let c = new Common({ chain: 'mainnet', hardfork: 'byzantium', customChains: [testnet] })
    st.equal(c.chainName(), 'mainnet', 'customChains, chain set to supported chain')
    st.equal(c.hardforkBlock(), 4370000, 'customChains, chain set to supported chain')

    c.setChain('testnet')
    st.equal(c.chainName(), 'testnet', 'customChains, chain switched to custom chain')
    st.equal(c.hardforkBlock(), 4, 'customChains, chain switched to custom chain')

    c = new Common({ chain: 'testnet', hardfork: 'byzantium', customChains: [testnet] })
    st.equal(c.chainName(), 'testnet', 'customChains, chain initialized with custom chain')
    st.equal(c.hardforkBlock(), 4, 'customChains, chain initialized with custom chain')

    const customChains = [testnet, testnet2, testnet3]
    c = new Common({ chain: 'testnet2', hardfork: 'istanbul', customChains })
    st.equal(c.chainName(), 'testnet2', 'customChains, chain initialized with custom chain')
    st.equal(c.hardforkBlock(), 10, 'customChains, chain initialized with custom chain')

    st.end()
  })
})
