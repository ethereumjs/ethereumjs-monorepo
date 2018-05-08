const tape = require('tape')
const Common = require('../index.js')

tape('[Common]: Hardfork logic', function (t) {
  t.test('Hardfork access', function (st) {
    let supportedHardforks = [
      'chainstart',
      'homestead',
      'dao',
      'tangerineWhistle',
      'spuriousDragon',
      'byzantium',
      'constantinople',
      'hybridCasper'
    ]
    let c

    for (let hardfork of supportedHardforks) {
      c = new Common('mainnet', hardfork)
      st.equal(c.hardfork(), hardfork, hardfork)
    }

    st.end()
  })

  t.test('isHardforkBlock()', function (st) {
    let c = new Common('ropsten')
    st.equal(c.isHardforkBlock('byzantium', 1700000), true, 'should return true for HF change block')
    st.equal(c.isHardforkBlock('byzantium', 1700001), false, 'should return false for another block')

    st.end()
  })

  t.test('hardforkBlock()', function (st) {
    let c = new Common('ropsten')
    st.equal(c.hardforkBlock('byzantium'), 1700000, 'should return the correct HF change block')

    st.end()
  })

  t.test('activeHardforks()', function (st) {
    let c = new Common('ropsten')
    st.equal(c.activeHardforks().length, 5, 'should return 5 active hardforks for Ropsten')
    st.equal(c.activeHardforks()[3]['name'], 'spuriousDragon', 'should return the correct HF data for Ropsten')
    st.equal(c.activeHardforks(9).length, 3, 'should return 3 active hardforks for Ropsten up to block 9')
    st.equal(c.activeHardforks(10).length, 4, 'should return 4 active hardforks for Ropsten up to block 10')

    st.end()
  })

  t.test('hardforkIsActiveOnChain()', function (st) {
    let c = new Common('ropsten')
    st.equal(c.hardforkIsActiveOnChain('byzantium'), true, 'should return true for byzantium on Ropsten')
    st.equal(c.hardforkIsActiveOnChain('dao'), false, 'should return false for dao on Ropsten')
    st.equal(c.hardforkIsActiveOnChain('hybridCasper'), false, 'should return false for hybridCasper on Ropsten')
    st.equal(c.hardforkIsActiveOnChain('notexistinghardfork'), false, 'should return false for a non-existing HF on Ropsten')

    st.end()
  })

  t.test('hardforkIsActiveOnBlock()', function (st) {
    let c = new Common('ropsten')
    st.equal(c.hardforkIsActiveOnBlock('byzantium', 1700000), true, 'Ropsten, byzantium, 1700000 -> true')
    st.equal(c.hardforkIsActiveOnBlock('byzantium', 1700005), true, 'Ropsten, byzantium, 1700005 -> true')
    st.equal(c.hardforkIsActiveOnBlock('byzantium', 1699999), false, 'Ropsten, byzantium, 1699999 -> false')

    st.end()
  })
})
