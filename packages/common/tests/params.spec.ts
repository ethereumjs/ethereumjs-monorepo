import tape from 'tape'
import Common, { Chain, Hardfork } from '../src/'

tape('[Common]: Parameter access for param(), paramByHardfork()', function (t: tape.Test) {
  t.test('Basic usage', function (st: tape.Test) {
    const c = new Common({ chain: Chain.Mainnet, eips: [2537] })
    let msg = 'Should return correct value when HF directly provided'
    st.equal(c.paramByHardfork('gasPrices', 'ecAdd', 'byzantium'), BigInt(500), msg)

    msg = 'Should return correct value for HF set in class'
    c.setHardfork(Hardfork.Byzantium)
    st.equal(c.param('gasPrices', 'ecAdd'), BigInt(500), msg)
    c.setHardfork(Hardfork.Istanbul)
    st.equal(c.param('gasPrices', 'ecAdd'), BigInt(150), msg)
    c.setHardfork(Hardfork.MuirGlacier)
    st.equal(c.param('gasPrices', 'ecAdd'), BigInt(150), msg)

    msg = 'Should throw for non-existing value'
    st.throws(() => c.param('gasPrices', 'notexistingvalue'), msg)
    st.throws(() => c.paramByHardfork('gasPrices', 'notexistingvalue', 'byzantium'), msg)

    /*
    // Manual test since no test triggering EIP config available
    // TODO: recheck on addition of new EIP configs
    // To run please manually add an "ecAdd" entry with value 12345 to EIP2537 config
    // and uncomment the test
    msg = 'EIP config should take precedence over HF config'
    st.equal(c.param('gasPrices', 'ecAdd'), 12345, msg)
    */

    st.end()
  })

  t.test('Error cases for param(), paramByHardfork()', function (st: tape.Test) {
    const c = new Common({ chain: Chain.Mainnet })

    const f = function () {
      c.paramByHardfork('gasPrizes', 'ecAdd', 'byzantium')
    }
    const msg = 'Should throw when called with non-existing topic'
    st.throws(f, /Topic gasPrizes not defined$/, msg)

    c.setHardfork(Hardfork.Byzantium)
    st.equal(
      c.param('gasPrices', 'ecAdd'),
      BigInt(500),
      'Should return correct value for HF set in class'
    )

    st.end()
  })

  t.test('Parameter updates', function (st: tape.Test) {
    const c = new Common({ chain: Chain.Mainnet })

    let msg = 'Should return correct value for chain start'
    st.equal(
      c.paramByHardfork('pow', 'minerReward', 'chainstart'),
      BigInt(5000000000000000000),
      msg
    )

    msg = 'Should reflect HF update changes'
    st.equal(c.paramByHardfork('pow', 'minerReward', 'byzantium'), BigInt(3000000000000000000), msg)

    msg = 'Should return updated sstore gas prices for constantinople'
    st.equal(c.paramByHardfork('gasPrices', 'netSstoreNoopGas', 'constantinople'), BigInt(200), msg)

    msg = 'Should nullify SSTORE related values for petersburg'
    st.throws(() => c.paramByHardfork('gasPrices', 'netSstoreNoopGas', 'petersburg'), msg)

    st.end()
  })

  t.test('Access by block number, paramByBlock()', function (st: tape.Test) {
    const c = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Byzantium })
    let msg = 'Should correctly translate block numbers into HF states (updated value)'
    st.equal(c.paramByBlock('pow', 'minerReward', 4370000), BigInt(3000000000000000000), msg)

    msg = 'Should correctly translate block numbers into HF states (original value)'
    st.equal(c.paramByBlock('pow', 'minerReward', 4369999), BigInt(5000000000000000000), msg)

    msg = 'Should correctly translate total difficulty into HF states'
    const td = BigInt('1196768507891266117779')
    st.equal(c.paramByBlock('pow', 'minerReward', 4370000, td), BigInt(3000000000000000000), msg)

    st.comment('-----------------------------------------------------------------')
    st.end()
  })

  t.test('EIP param access, paramByEIP()', function (st: tape.Test) {
    const c = new Common({ chain: Chain.Mainnet })

    let msg = 'Should return null for non-existing value'
    st.throws(() => c.paramByEIP('gasPrices', 'notexistingvalue', 2537), msg)

    const UNSUPPORTED_EIP = 1000000
    let f = function () {
      c.paramByEIP('gasPrices', 'Bls12381G1AddGas', UNSUPPORTED_EIP)
    }
    msg = 'Should throw for using paramByEIP() with an unsupported EIP'
    st.throws(f, /not supported$/, msg)

    f = function () {
      c.paramByEIP('notExistingTopic', 'Bls12381G1AddGas', 2537)
    }
    msg = 'Should throw for using paramByEIP() with a not existing topic'
    st.throws(f, /not defined$/, msg)

    msg = 'Should return Bls12381G1AddGas gas price for EIP2537'
    st.equal(c.paramByEIP('gasPrices', 'Bls12381G1AddGas', 2537), BigInt(600), msg)
    st.end()
  })

  t.test('returns the right block delay for EIP3554', function (st) {
    for (const fork of [Hardfork.MuirGlacier, Hardfork.Berlin]) {
      const c = new Common({ chain: Chain.Mainnet, hardfork: fork })
      let delay = c.param('pow', 'difficultyBombDelay')
      st.equal(delay, BigInt(9000000))
      c.setEIPs([3554])
      delay = c.param('pow', 'difficultyBombDelay')
      st.equal(delay, BigInt(9500000))
    }
    st.end()
  })
})
