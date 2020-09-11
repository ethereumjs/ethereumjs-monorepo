import * as tape from 'tape'
import Common from '../src/'

tape('[Common]: Initialization / Chain params', function (t: tape.Test) {
  t.test('Correct initialization', function (st: tape.Test) {
    const eips = ['EIP2537']
    const c = new Common({ chain: 'mainnet', eips })
    st.equal(c.eips(), eips, 'should initialize with supported EIP')
    st.end()
  })

  t.test('Initialization errors', function (st: tape.Test) {
    let eips = ['NOT_SUPPORTED_EIP']
    let msg = 'should throw on not supported EIP'
    let f = () => {
      new Common({ chain: 'mainnet', eips })
    }
    st.throws(f, /not supported$/, msg)

    /*
    // Manual test since no test triggering EIP config available
    // TODO: recheck on addition of new EIP configs
    // To run manually change minimumHardfork in EIP2537 config to petersburg
    eips = [ 'EIP2537', ]
    msg = 'should throw on not meeting minimum hardfork requirements'
    f = () => {
      new Common({ chain: 'mainnet', hardfork: 'byzantium', eips })
    }
    st.throws(f, /minimumHardfork/, msg)
    */

    st.end()
  })
})
