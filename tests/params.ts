import * as tape from 'tape'
import Common from '../src/'

tape('[Common]: Parameter access', function(t: tape.Test) {
  t.test('Basic usage', function(st: tape.Test) {
    const c = new Common('mainnet')
    let msg = 'Should return correct value when HF directly provided'
    st.equal(c.param('gasPrices', 'ecAdd', 'byzantium'), 500, msg)

    c.setHardfork('byzantium')
    msg = 'Should return correct value for HF set in class'
    st.equal(c.param('gasPrices', 'ecAdd'), 500, msg)

    st.end()
  })

  t.test('Error cases', function(st: tape.Test) {
    let c = new Common('mainnet')
    let f = function() {
      c.param('gasPrices', 'ecAdd')
    }
    let msg = 'Should throw when no hardfork set or provided'
    st.throws(f, /neither a hardfork set nor provided by param$/, msg)

    f = function() {
      c.param('gasPrizes', 'ecAdd', 'byzantium')
    }
    msg = 'Should throw when called with non-existing topic'
    st.throws(f, /Topic gasPrizes not defined$/, msg)

    f = function() {
      c.param('gasPrices', 'notexistingvalue', 'byzantium')
    }
    msg = 'Should throw when called with non-existing value'
    st.throws(f, /value for notexistingvalue not found$/, msg)

    c.setHardfork('byzantium')
    st.equal(c.param('gasPrices', 'ecAdd'), 500, 'Should return correct value for HF set in class')

    c = new Common('mainnet', 'byzantium', ['byzantium', 'constantinople'])
    f = function() {
      c.param('gasPrices', 'expByte', 'spuriousDragon')
    }
    msg = 'Should throw when calling param() with an unsupported hardfork'
    st.throws(f, /supportedHardforks$/, msg)

    f = function() {
      c.paramByBlock('gasPrices', 'expByte', 0)
    }
    msg = 'Should throw when calling paramByBlock() with an unsupported hardfork'
    st.throws(f, /supportedHardforks$/, msg)

    st.end()
  })

  t.test('Parameter updates', function(st: tape.Test) {
    const c = new Common('mainnet')
    const f = function() {
      c.param('gasPrices', 'ecAdd', 'spuriousDragon')
    }
    let msg = 'Should throw for a value set on a later HF'
    st.throws(f, /value for ecAdd not found$/, msg)

    msg = 'Should return correct value for chain start'
    st.equal(c.param('pow', 'minerReward', 'chainstart'), '5000000000000000000', msg)

    msg = 'Should reflect HF update changes'
    st.equal(c.param('pow', 'minerReward', 'byzantium'), '3000000000000000000', msg)

    msg = 'Should return updated sstore gas prices for constantinople'
    st.equal(c.param('gasPrices', 'netSstoreNoopGas', 'constantinople'), 200, msg)

    msg = 'Should nullify SSTORE related values for petersburg'
    st.equal(c.param('gasPrices', 'netSstoreNoopGas', 'petersburg'), null, msg)

    st.end()
  })

  t.test('Access by block number, paramByBlock()', function(st: tape.Test) {
    const c = new Common('mainnet', 'byzantium')
    let msg = 'Should correctly translate block numbers into HF states (updated value)'
    st.equal(c.paramByBlock('pow', 'minerReward', 4370000), '3000000000000000000', msg)

    msg = 'Should correctly translate block numbers into HF states (original value)'
    st.equal(c.paramByBlock('pow', 'minerReward', 4369999), '5000000000000000000', msg)

    st.comment('-----------------------------------------------------------------')
    st.end()
  })

  t.test('Custom chain usage', function(st: tape.Test) {
    const mainnetCommon = new Common('mainnet')

    const customChainParams = { name: 'custom', chainId: 123, networkId: 678 }
    const customChainCommon = Common.forCustomChain('mainnet', customChainParams, 'byzantium')

    // From custom chain params
    st.equal(customChainCommon.chainName(), customChainParams.name)
    st.equal(customChainCommon.chainId(), customChainParams.chainId)
    st.equal(customChainCommon.networkId(), customChainParams.networkId)

    // Fallback params from mainnet
    st.equal(customChainCommon.genesis(), mainnetCommon.genesis())
    st.equal(customChainCommon.bootstrapNodes(), mainnetCommon.bootstrapNodes())
    st.equal(customChainCommon.hardforks(), mainnetCommon.hardforks())

    // Set only to this Common
    st.equal(customChainCommon.hardfork(), 'byzantium')

    st.end()
  })
})
