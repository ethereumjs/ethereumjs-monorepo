import tape from 'tape'
import Common from '../src/'

tape('[Common]: Initialization / Chain params', function (t: tape.Test) {
  t.test('Correct initialization', function (st: tape.Test) {
    let eips = [2537, 2929]
    const c = new Common({ chain: 'mainnet', eips })
    st.equal(c.eips(), eips, 'should initialize with supported EIP')

    eips = [2718, 2929, 2930]
    new Common({ chain: 'mainnet', eips, hardfork: 'istanbul' })
    st.pass('Should not throw when initializing with a consistent EIP list')

    eips = [2930]
    const msg =
      'should throw when initializing with an EIP with required EIPs not being activated along'
    const f = () => {
      new Common({ chain: 'mainnet', eips, hardfork: 'istanbul' })
    }
    st.throws(f, msg)

    st.end()
  })

  t.test('Initialization errors', function (st: tape.Test) {
    const UNSUPPORTED_EIP = 1000000
    const eips = [UNSUPPORTED_EIP]
    const msg = 'should throw on an unsupported EIP'
    const f = () => {
      new Common({ chain: 'mainnet', eips })
    }
    st.throws(f, /not supported$/, msg)

    /*
    // Manual test since no test triggering EIP config available
    // TODO: recheck on addition of new EIP configs
    // To run manually change minimumHardfork in EIP2537 config to petersburg
    eips = [ 2537, ]
    msg = 'should throw on not meeting minimum hardfork requirements'
    f = () => {
      new Common({ chain: 'mainnet', hardfork: 'byzantium', eips })
    }
    st.throws(f, /minimumHardfork/, msg)
    */

    st.end()
  })

  t.test('isActivatedEIP()', function (st) {
    let c = new Common({ chain: 'rinkeby', hardfork: 'istanbul' })
    st.equal(c.isActivatedEIP(2315), false, 'istanbul, eips: [] -> false (EIP-2315)')
    c = new Common({ chain: 'rinkeby', hardfork: 'istanbul', eips: [2315] })
    st.equal(c.isActivatedEIP(2315), true, 'istanbul, eips: [2315] -> true (EIP-2315)')
    c = new Common({ chain: 'rinkeby', hardfork: 'berlin' })
    st.equal(c.isActivatedEIP(2929), true, 'berlin, eips: [] -> true (EIP-2929)')
    st.equal(c.isActivatedEIP(2315), false, 'berlin, eips: [] -> true (EIP-2315)')
    st.equal(c.isActivatedEIP(2537), false, 'berlin, eips: [] -> false (EIP-2537)')

    st.end()
  })

  t.test('returns the right block delay for EIP3554', function (st) {
    for (const fork of ['muirGlacier', 'berlin']) {
      const c = new Common({ chain: 'mainnet', hardfork: fork })
      let delay = c.param('pow', 'difficultyBombDelay')
      st.equal(delay, 9000000)
      c.setEIPs([3554])
      delay = c.param('pow', 'difficultyBombDelay')
      st.equal(delay, 9500000)
    }
  })

  t.test('getEIPActivationBlockNumber()', function (st) {
    const common = new Common({ chain: 'mainnet' })
    const activationBlock = common.getEIPActivationBlockNumber(2930)
    st.ok(activationBlock!.eqn(12244000))
    st.end()
  })
})
