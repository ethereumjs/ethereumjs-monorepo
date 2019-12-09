import * as tape from 'tape'
import Common from '../src/'

tape('[Common]: Hardfork logic', function(t: tape.Test) {
  t.test('Hardfork access', function(st: tape.Test) {
    const supportedHardforks = [
      'chainstart',
      'homestead',
      'dao',
      'tangerineWhistle',
      'spuriousDragon',
      'byzantium',
      'constantinople',
      'petersburg',
      'istanbul',
    ]
    let c

    for (const hardfork of supportedHardforks) {
      c = new Common('mainnet', hardfork)
      st.equal(c.hardfork(), hardfork, hardfork)
    }

    st.end()
  })

  t.test('hardforkBlock()', function(st: tape.Test) {
    let c = new Common('ropsten')
    let msg = 'should return the correct HF change block for byzantium (provided)'
    st.equal(c.hardforkBlock('byzantium'), 1700000, msg)

    c = new Common('ropsten', 'byzantium')
    msg = 'should return the correct HF change block for byzantium (set)'
    st.equal(c.hardforkBlock(), 1700000, msg)

    c = new Common('ropsten', 'istanbul')
    msg = 'should return the correct HF change block for istanbul (set)'
    st.equal(c.hardforkBlock(), 6485846, msg)

    st.end()
  })

  t.test('isHardforkBlock()', function(st: tape.Test) {
    let c = new Common('ropsten')
    let msg = 'should return true for HF change block for byzantium (provided)'
    st.equal(c.isHardforkBlock(1700000, 'byzantium'), true, msg)

    msg = 'should return false for another block for byzantium (provided)'
    st.equal(c.isHardforkBlock(1700001, 'byzantium'), false, msg)

    c = new Common('ropsten', 'byzantium')
    msg = 'should return true for HF change block for byzantium (set)'
    st.equal(c.isHardforkBlock(1700000), true, msg)

    msg = 'should return false for another block for byzantium (set)'
    st.equal(c.isHardforkBlock(1700001), false, msg)

    st.end()
  })

  t.test('activeHardforks()', function(st: tape.Test) {
    let c = new Common('ropsten')
    let msg = 'should return 9 active hardforks for Ropsten'
    st.equal(c.activeHardforks().length, 9, msg)

    msg = 'should return the correct HF data for Ropsten'
    st.equal(c.activeHardforks()[3]['name'], 'spuriousDragon', msg)

    msg = 'should return 3 active hardforks for Ropsten up to block 9'
    st.equal(c.activeHardforks(9).length, 3, msg)

    msg = 'should return 4 active hardforks for Ropsten up to block 10'
    st.equal(c.activeHardforks(10).length, 4, msg)

    c = new Common('ropsten', null, ['spuriousDragon', 'byzantium', 'constantinople'])
    msg = 'should return 3 active HFs when restricted to supported HFs'
    st.equal(c.activeHardforks(null, { onlySupported: true }).length, 3, msg)

    c = new Common('ropsten', null, ['spuriousDragon', 'byzantium', 'dao'])
    msg = 'should return 2 active HFs when restricted to supported HFs'
    st.equal(c.activeHardforks(null, { onlySupported: true }).length, 2, msg)

    c = new Common('mainnet')
    msg = 'should return 10 active HFs for mainnet'
    st.equal(c.activeHardforks().length, 10, msg)

    c = new Common('rinkeby')
    msg = 'should return 8 active HFs for rinkeby'
    st.equal(c.activeHardforks().length, 8, msg)

    c = new Common('goerli')
    msg = 'should return 9 active HFs for goerli'
    st.equal(c.activeHardforks().length, 9, msg)

    st.end()
  })

  t.test('activeHardfork()', function(st: tape.Test) {
    let c = new Common('ropsten')
    let msg = 'should return muirGlacier as latest active HF for Ropsten'
    st.equal(c.activeHardfork(), 'muirGlacier', msg)

    msg = 'should return spuriousDragon as latest active HF for Ropsten for block 10'
    st.equal(c.activeHardfork(10), 'spuriousDragon', msg)

    c = new Common('ropsten', null, ['tangerineWhistle', 'spuriousDragon'])
    msg = 'should return spuriousDragon as latest active HF for Ropsten with limited supported HFs'
    st.equal(c.activeHardfork(null, { onlySupported: true }), 'spuriousDragon', msg)

    c = new Common('rinkeby')
    msg = 'should return Istanbul as latest active HF for Rinkeby'
    st.equal(c.activeHardfork(), 'istanbul', msg)

    st.end()
  })

  t.test('hardforkIsActiveOnBlock() / activeOnBlock()', function(st: tape.Test) {
    let c = new Common('ropsten')
    let msg = 'Ropsten, byzantium (provided), 1700000 -> true'
    st.equal(c.hardforkIsActiveOnBlock('byzantium', 1700000), true, msg)

    msg = 'Ropsten, byzantium (provided), 1700005 -> true'
    st.equal(c.hardforkIsActiveOnBlock('byzantium', 1700005), true, msg)

    msg = 'Ropsten, byzantium (provided), 1699999 -> false'
    st.equal(c.hardforkIsActiveOnBlock('byzantium', 1699999), false, msg)

    c = new Common('ropsten', 'byzantium')
    msg = 'Ropsten, byzantium (set), 1700000 -> true'
    st.equal(c.hardforkIsActiveOnBlock(null, 1700000), true, msg)

    msg = 'Ropsten, byzantium (set), 1700000 -> true (alias function)'
    st.equal(c.activeOnBlock(1700000), true, msg)

    msg = 'Ropsten, byzantium (set), 1700005 -> true'
    st.equal(c.hardforkIsActiveOnBlock(null, 1700005), true, msg)

    msg = 'Ropsten, byzantium (set), 1699999 -> false'
    st.equal(c.hardforkIsActiveOnBlock(null, 1699999), false, msg)

    st.end()
  })

  t.test('hardforkGteHardfork()', function(st: tape.Test) {
    let c = new Common('ropsten')
    let msg = 'Ropsten, constantinople >= byzantium (provided) -> true'
    st.equal(c.hardforkGteHardfork('constantinople', 'byzantium'), true, msg)

    msg = 'Ropsten, dao >= chainstart (provided), onlyActive -> false'
    st.equal(
      c.hardforkGteHardfork('dao', 'chainstart', {
        onlyActive: true,
      }),
      false,
      msg,
    )

    msg = 'Ropsten, byzantium >= byzantium (provided) -> true'
    st.equal(c.hardforkGteHardfork('byzantium', 'byzantium'), true, msg)

    msg = 'Ropsten, spuriousDragon >= byzantium (provided) -> false'
    st.equal(c.hardforkGteHardfork('spuriousDragon', 'byzantium'), false, msg)

    c = new Common('ropsten', 'byzantium')
    msg = 'Ropsten, byzantium (set) >= spuriousDragon -> true'
    st.equal(c.hardforkGteHardfork(null, 'spuriousDragon'), true, msg)

    msg = 'Ropsten, byzantium (set) >= spuriousDragon -> true (alias function)'
    st.equal(c.gteHardfork('spuriousDragon'), true, msg)

    msg = 'Ropsten, byzantium (set) >= spuriousDragon, onlyActive -> true'
    st.equal(c.hardforkGteHardfork(null, 'spuriousDragon', { onlyActive: true }), true, msg)

    msg = 'Ropsten, byzantium (set) >= byzantium -> true'
    st.equal(c.hardforkGteHardfork(null, 'byzantium'), true, msg)

    msg = 'Ropsten, byzantium (set) >= constantinople -> false'
    st.equal(c.hardforkGteHardfork(null, 'constantinople'), false, msg)

    st.end()
  })

  t.test('hardforkGteHardfork() ropsten', function(st: tape.Test) {
    const c = new Common('ropsten')
    const msg = 'ropsten, spuriousDragon >= muirGlacier (provided) -> false'
    st.equal(c.hardforkGteHardfork('spuriousDragon', 'muirGlacier'), false, msg)

    st.end()
  })

  t.test('hardforkIsActiveOnChain()', function(st: tape.Test) {
    let c = new Common('ropsten')
    let msg = 'should return true for byzantium (provided) on Ropsten'
    st.equal(c.hardforkIsActiveOnChain('byzantium'), true, msg)

    msg = 'should return false for dao (provided) on Ropsten'
    st.equal(c.hardforkIsActiveOnChain('dao'), false, msg)

    msg = 'should return true for petersburg (provided) on Ropsten'
    st.equal(c.hardforkIsActiveOnChain('petersburg'), true, msg)

    msg = 'should return false for a non-existing HF (provided) on Ropsten'
    st.equal(c.hardforkIsActiveOnChain('notexistinghardfork'), false, msg)

    let f = function() {
      c.hardforkIsActiveOnChain('spuriousDragon', { onlySupported: true })
    }
    msg = 'should not throw with unsupported Hf (provided) and onlySupported set to false'
    st.doesNotThrow(f, /unsupported hardfork$/, msg)

    c = new Common('ropsten', 'byzantium')
    msg = 'should return true for byzantium (set) on Ropsten'
    st.equal(c.hardforkIsActiveOnChain(), true, msg)

    c = new Common('ropsten', null, ['byzantium', 'constantinople'])
    f = function() {
      c.hardforkIsActiveOnChain('spuriousDragon', { onlySupported: true })
    }
    msg = 'should throw with unsupported Hf and onlySupported set to true'
    st.throws(f, /not set as supported in supportedHardforks$/, msg)

    st.end()
  })

  t.test('consensus()/finality()', function(st: tape.Test) {
    const c = new Common('mainnet')
    st.equal(c.consensus('byzantium'), 'pow', 'should return pow for byzantium consensus')
    st.equal(c.consensus('constantinople'), 'pow', 'should return pow for constantinople consensus')
    st.equal(c.finality('byzantium'), null, 'should return null for byzantium finality')

    st.comment('-----------------------------------------------------------------')
    st.end()
  })
})
