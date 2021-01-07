import tape from 'tape'
import Common from '../src/'
import testnet from './data/testnet.json'

tape('[Common]: Custom chains', function (t: tape.Test) {
  t.test(
    'chain -> object: should provide correct access to private network chain parameters',
    function (st: tape.Test) {
      const c = new Common({ chain: testnet, hardfork: 'byzantium' })
      st.equal(c.chainName(), 'testnet', 'should initialize with chain name')
      st.equal(c.chainId(), 12345, 'should return correct chain Id')
      st.equal(c.networkId(), 12345, 'should return correct network Id')
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

      st.comment('-----------------------------------------------------------------')
      st.end()
    }
  )

  t.test('customChains parameter: ', (st) => {
    const c = new Common({ chain: testnet, hardfork: 'byzantium' })
    st.equal(c.chainName(), 'testnet', 'should initialize with chain name')
    st.equal(c.chainId(), 12345, 'should return correct chain Id')
    st.equal(c.networkId(), 12345, 'should return correct network Id')
    st.equal(
      c.genesis().hash,
      '0xaa00000000000000000000000000000000000000000000000000000000000000',
      'should return correct genesis hash'
    )
    st.equal(c.hardforks()[3]['block'], 3, 'should return correct hardfork data')
    st.equal(c.bootstrapNodes()[1].ip, '10.0.0.2', 'should return a bootstrap node array')

    st.end()
  })
})
