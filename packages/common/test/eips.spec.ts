import { assert, describe, it } from 'vitest'

import { Chain, Common, Hardfork } from '../src/index.js'

describe('[Common/EIPs]: Initialization / Chain params', () => {
  it('Correct initialization', () => {
    let eips = [2537, 2929]
    const c = new Common({ chain: Chain.Mainnet, eips })
    assert.equal(c.eips(), eips, 'should initialize with supported EIP')

    eips = [2718, 2929, 2930]
    let f = () => {
      new Common({ chain: Chain.Mainnet, eips, hardfork: Hardfork.Istanbul })
    }
    assert.doesNotThrow(f, 'Should not throw when initializing with a consistent EIP list')

    eips = [2930]
    const msg =
      'should throw when initializing with an EIP with required EIPs not being activated along'
    f = () => {
      new Common({ chain: Chain.Mainnet, eips, hardfork: Hardfork.Istanbul })
    }
    assert.throws(f, undefined, undefined, msg)
  })

  it('Initialization errors', () => {
    const UNSUPPORTED_EIP = 1000000
    const eips = [UNSUPPORTED_EIP]
    const msg = 'should throw on an unsupported EIP'
    const f = () => {
      new Common({ chain: Chain.Mainnet, eips })
    }
    assert.throws(f, /not supported$/, undefined, msg)

    /*
    // Manual test since no test triggering EIP config available
    // TODO: recheck on addition of new EIP configs
    // To run manually change minimumHardfork in EIP2537 config to petersburg
    eips = [ 2537, ]
    msg = 'should throw on not meeting minimum hardfork requirements'
    f = () => {
      new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Byzantium, eips })
    }
    assert.throws(f, /minimumHardfork/, undefined, msg)
    */
  })

  it('isActivatedEIP()', () => {
    let c = new Common({ chain: Chain.Rinkeby, hardfork: Hardfork.Istanbul })
    assert.equal(c.isActivatedEIP(2315), false, 'istanbul, eips: [] -> false (EIP-2315)')
    c = new Common({ chain: Chain.Rinkeby, hardfork: Hardfork.Istanbul, eips: [2315] })
    assert.equal(c.isActivatedEIP(2315), true, 'istanbul, eips: [2315] -> true (EIP-2315)')
    c = new Common({ chain: Chain.Rinkeby, hardfork: Hardfork.Berlin })
    assert.equal(c.isActivatedEIP(2929), true, 'berlin, eips: [] -> true (EIP-2929)')
    assert.equal(c.isActivatedEIP(2315), false, 'berlin, eips: [] -> true (EIP-2315)')
    assert.equal(c.isActivatedEIP(2537), false, 'berlin, eips: [] -> false (EIP-2537)')
  })

  it('eipBlock', () => {
    const c = new Common({ chain: Chain.Mainnet })

    let msg = 'should return correct value'
    assert.ok(c.eipBlock(1559)! === 12965000n, msg)

    msg = 'should return null for unscheduled eip'
    assert.equal(c.eipBlock(0), null, msg)
  })
})
