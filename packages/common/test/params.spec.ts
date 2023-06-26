import { assert, describe, it } from 'vitest'

import { Chain, Common, Hardfork } from '../src/index.js'

describe('[Common]: Parameter access for param(), paramByHardfork()', () => {
  it('Basic usage', () => {
    const c = new Common({ chain: Chain.Mainnet, eips: [2537] })
    let msg = 'Should return correct value when HF directly provided'
    assert.equal(c.paramByHardfork('gasPrices', 'ecAdd', 'byzantium'), BigInt(500), msg)

    msg = 'Should return correct value for HF set in class'
    c.setHardfork(Hardfork.Byzantium)
    assert.equal(c.param('gasPrices', 'ecAdd'), BigInt(500), msg)
    c.setHardfork(Hardfork.Istanbul)
    assert.equal(c.param('gasPrices', 'ecAdd'), BigInt(150), msg)
    c.setHardfork(Hardfork.MuirGlacier)
    assert.equal(c.param('gasPrices', 'ecAdd'), BigInt(150), msg)

    msg = 'Should return 0n for non-existing value'
    assert.equal(c.param('gasPrices', 'notexistingvalue'), BigInt(0), msg)
    assert.equal(c.paramByHardfork('gasPrices', 'notexistingvalue', 'byzantium'), BigInt(0), msg)

    /*
    // Manual test since no test triggering EIP config available
    // TODO: recheck on addition of new EIP configs
    // To run please manually add an "ecAdd" entry with value 12345 to EIP2537 config
    // and uncomment the test
    msg = 'EIP config should take precedence over HF config'
    assert.equal(c.param('gasPrices', 'ecAdd'), 12345, msg)
    */
  })

  it('Error cases for param(), paramByHardfork()', () => {
    const c = new Common({ chain: Chain.Mainnet })

    const f = function () {
      c.paramByHardfork('gasPrizes', 'ecAdd', 'byzantium')
    }
    const msg = 'Should throw when called with non-existing topic'
    assert.throws(f, /Topic gasPrizes not defined$/, undefined, msg)

    c.setHardfork(Hardfork.Byzantium)
    assert.equal(
      c.param('gasPrices', 'ecAdd'),
      BigInt(500),
      'Should return correct value for HF set in class'
    )
  })

  it('Parameter updates', () => {
    const c = new Common({ chain: Chain.Mainnet })

    let msg = 'Should return correct value for chain start'
    assert.equal(
      c.paramByHardfork('pow', 'minerReward', 'chainstart'),
      BigInt(5000000000000000000),
      msg
    )

    msg = 'Should reflect HF update changes'
    assert.equal(
      c.paramByHardfork('pow', 'minerReward', 'byzantium'),
      BigInt(3000000000000000000),
      msg
    )

    msg = 'Should return updated sstore gas prices for constantinople'
    assert.equal(
      c.paramByHardfork('gasPrices', 'netSstoreNoopGas', 'constantinople'),
      BigInt(200),
      msg
    )

    msg = 'Should nullify SSTORE related values for petersburg'
    assert.equal(c.paramByHardfork('gasPrices', 'netSstoreNoopGas', 'petersburg'), BigInt(0), msg)
  })

  it('Access by block number, paramByBlock()', () => {
    const c = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Byzantium })
    let msg = 'Should correctly translate block numbers into HF states (updated value)'
    assert.equal(c.paramByBlock('pow', 'minerReward', 4370000), BigInt(3000000000000000000), msg)

    msg = 'Should correctly translate block numbers into HF states (original value)'
    assert.equal(c.paramByBlock('pow', 'minerReward', 4369999), BigInt(5000000000000000000), msg)

    msg = 'Should correctly translate total difficulty into HF states'
    const td = BigInt('1196768507891266117779')
    assert.equal(
      c.paramByBlock('pow', 'minerReward', 4370000, td),
      BigInt(3000000000000000000),
      msg
    )
  })

  it('EIP param access, paramByEIP()', () => {
    const c = new Common({ chain: Chain.Mainnet })

    let msg = 'Should return undefined for non-existing value'
    assert.equal(c.paramByEIP('gasPrices', 'notexistingvalue', 2537), undefined, msg)

    const UNSUPPORTED_EIP = 1000000
    let f = function () {
      c.paramByEIP('gasPrices', 'Bls12381G1AddGas', UNSUPPORTED_EIP)
    }
    msg = 'Should throw for using paramByEIP() with an unsupported EIP'
    assert.throws(f, /not supported$/, undefined, msg)

    f = function () {
      c.paramByEIP('notExistingTopic', 'Bls12381G1AddGas', 2537)
    }
    msg = 'Should throw for using paramByEIP() with a not existing topic'
    assert.throws(f, /not defined$/, undefined, msg)

    msg = 'Should return Bls12381G1AddGas gas price for EIP2537'
    assert.equal(c.paramByEIP('gasPrices', 'Bls12381G1AddGas', 2537), BigInt(600), msg)
  })

  it('returns the right block delay for EIP3554', () => {
    for (const fork of [Hardfork.MuirGlacier, Hardfork.Berlin]) {
      const c = new Common({ chain: Chain.Mainnet, hardfork: fork })
      let delay = c.param('pow', 'difficultyBombDelay')
      assert.equal(delay, BigInt(9000000))
      c.setEIPs([3554])
      delay = c.param('pow', 'difficultyBombDelay')
      assert.equal(delay, BigInt(9500000))
    }
  })
})
