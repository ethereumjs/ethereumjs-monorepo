const tape = require('tape')
const Common = require('../index.js')

tape('[Common]: Initialization / Chain params', function (t) {
  t.test('Should initialize with chain provided', function (st) {
    let c = new Common('mainnet')
    st.equal(c.chainName(), 'mainnet', 'should initialize with chain name')
    st.equal(c.chainId(), 1, 'should return correct chain Id')
    st.equal(c.networkId(), 1, 'should return correct network Id')
    st.equal(c.hardfork(), null, 'should set hardfork to null')
    st.equal(c._isSupportedHardfork('constantinople'), true, 'should not restrict supported HFs')

    c = new Common(1)
    st.equal(c.chainName(), 'mainnet', 'should initialize with chain Id')

    st.end()
  })

  t.test('Should initialize with chain and hardfork provided', function (st) {
    let c = new Common('mainnet', 'byzantium')
    st.equal(c.hardfork(), 'byzantium', 'should return correct hardfork name')

    st.end()
  })

  t.test('Should initialize with supportedHardforks provided', function (st) {
    let c = new Common('mainnet', 'byzantium', ['byzantium', 'constantinople'])
    st.equal(c._isSupportedHardfork('byzantium'), true, 'should return true for supported HF')
    st.equal(c._isSupportedHardfork('spuriousDragon'), false, 'should return false for unsupported HF')

    st.end()
  })

  t.test('Should handle initialization errors', function (st) {
    st.throws(function () { new Common('chainnotexisting') }, /not supported$/, 'should throw an exception on non-existing chain') // eslint-disable-line no-new
    st.throws(function () { new Common('mainnet', 'hardforknotexisting') }, /not supported$/, 'should throw an exception on non-existing hardfork') // eslint-disable-line no-new
    st.throws(function () { new Common('mainnet', 'spuriousDragon', ['byzantium', 'constantinople']) }, /supportedHardforks$/, 'should throw an exception on conflicting active/supported HF params') // eslint-disable-line no-new

    st.end()
  })

  t.test('Should provide correct access to chain parameters', function (st) {
    let c = new Common('mainnet')
    st.equal(c.genesis().hash, '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3', 'should return correct genesis hash')
    st.equal(c.hardforks()[3]['block'], 2463000, 'should return correct hardfork data')
    st.equal(c.bootstrapNodes()[0].port, 30303, 'should return a bootstrap node array')

    st.end()
  })

  t.test('Should be able to access data for all chains provided', function (st) {
    let c = new Common('mainnet')
    st.equal(c.genesis().hash, '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3', 'mainnet')
    c.setChain('ropsten')
    st.equal(c.genesis().hash, '0x41941023680923e0fe4d74a34bdac8141f2540e3ae90623718e47d66d1ca4a2d', 'ropsten')
    c.setChain('rinkeby')
    st.equal(c.genesis().hash, '0x6341fd3daf94b748c72ced5a5b26028f2474f5f00d824504e4fa37a75767e177', 'rinkeby')
    c.setChain('kovan')
    st.equal(c.genesis().hash, '0xa3c565fc15c7478862d50ccd6561e3c06b24cc509bf388941c25ea985ce32cb9', 'kovan')

    st.end()
  })
})
