import { assert, describe, it } from 'vitest'

import { Chain, Common, Hardfork } from '../src/index.js'

import { paramsTest } from './data/paramsTest.js'

describe('[Common]: Parameter instantion / params option / Updates', () => {
  it('Param option', () => {
    const c = new Common({ chain: Chain.Mainnet, params: paramsTest })
    let msg = 'Should also work with parameters passed with params option'
    assert.equal(c.param('ecAddGas'), BigInt(150), msg)

    const params = {
      1679: {
        ecAddGas: 250,
      },
    }
    c.updateParams(params)
    msg = 'Should update parameter on updateParams() and properly rebuild cache'
    assert.equal(c.param('ecAddGas'), BigInt(250), msg)

    c.resetParams(params)
    msg = 'Should reset all parameters on resetParams() and properly rebuild cache'
    assert.equal(c.param('ecAddGas'), BigInt(250), msg)
    assert.throws(() => {
      c.param('ecMulGas'), BigInt(250)
    })

    msg = 'Should not side-manipulate the original params file during updating internally'
    assert.equal(paramsTest['1679']['ecAddGas'], 150)
  })
})

describe('[Common]: Parameter access for param(), paramByHardfork()', () => {
  it('Basic usage', () => {
    const c = new Common({ chain: Chain.Mainnet, params: paramsTest, eips: [2537] })
    let msg = 'Should return correct value when HF directly provided'
    assert.equal(c.paramByHardfork('ecAddGas', 'byzantium'), BigInt(500), msg)

    msg = 'Should return correct value for HF set in class'
    c.setHardfork(Hardfork.Byzantium)
    assert.equal(c.param('ecAddGas'), BigInt(500), msg)
    c.setHardfork(Hardfork.Istanbul)
    assert.equal(c.param('ecAddGas'), BigInt(150), msg)
    c.setHardfork(Hardfork.MuirGlacier)
    assert.equal(c.param('ecAddGas'), BigInt(150), msg)

    assert.throws(() => {
      c.paramByHardfork('notexistingvalue', 'byzantium')
    })

    /*
    // Manual test since no test triggering EIP config available
    // TODO: recheck on addition of new EIP configs
    // To run please manually add an "ecAdd" entry with value 12345 to EIP2537 config
    // and uncomment the test
    msg = 'EIP config should take precedence over HF config'
    assert.equal(c.param('ecAddGas'), 12345, msg)
    */
  })

  it('Error cases for param(), paramByHardfork()', () => {
    const c = new Common({ chain: Chain.Mainnet, params: paramsTest })

    c.setHardfork(Hardfork.Byzantium)
    assert.equal(
      c.param('ecAddGas'),
      BigInt(500),
      'Should return correct value for HF set in class',
    )
  })

  it('Parameter updates', () => {
    const c = new Common({ chain: Chain.Mainnet, params: paramsTest })

    let msg = 'Should return correct value for chain start'
    assert.equal(c.paramByHardfork('minerReward', 'chainstart'), BigInt(5000000000000000000), msg)

    msg = 'Should reflect HF update changes'
    assert.equal(c.paramByHardfork('minerReward', 'byzantium'), BigInt(3000000000000000000), msg)

    msg = 'Should return updated sstore gas prices for constantinople'
    assert.equal(c.paramByHardfork('netSstoreNoopGas', 'constantinople'), BigInt(200), msg)

    msg = 'Should nullify SSTORE related values for petersburg'
    assert.equal(c.paramByHardfork('netSstoreNoopGas', 'petersburg'), BigInt(0), msg)
  })

  it('Access by block number, paramByBlock()', () => {
    const c = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Byzantium, params: paramsTest })
    let msg = 'Should correctly translate block numbers into HF states (updated value)'
    assert.equal(c.paramByBlock('minerReward', 4370000), BigInt(3000000000000000000), msg)

    msg = 'Should correctly translate block numbers into HF states (original value)'
    assert.equal(c.paramByBlock('minerReward', 4369999), BigInt(5000000000000000000), msg)

    msg = 'Should correctly translate total difficulty into HF states'
    const td = BigInt('1196768507891266117779')
    assert.equal(c.paramByBlock('minerReward', 4370000, td), BigInt(3000000000000000000), msg)
  })

  it('Access on copied Common instances', () => {
    const c = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Shanghai, params: paramsTest })
    let msg = 'Should correctly access param with param() on original Common'
    assert.equal(c.param('minerReward'), BigInt(2000000000000000000), msg)

    const cCopy = c.copy()
    cCopy.setHardfork(Hardfork.Chainstart)

    msg = 'Should correctly access param with param() on copied Common with hardfork changed'
    assert.equal(cCopy.param('minerReward'), BigInt(5000000000000000000), msg)

    msg =
      'Should correctly access param with param() on original Common after copy and HF change on copied Common'
    assert.equal(c.param('minerReward'), BigInt(2000000000000000000), msg)
  })

  it('EIP param access, paramByEIP()', () => {
    const c = new Common({ chain: Chain.Mainnet, params: paramsTest })

    assert.throws(() => {
      c.paramByEIP('notexistingvalue', 1559)
    })
    assert.throws(() => {
      c.paramByEIP('notexistingvalue', 2537)
    })

    const UNSUPPORTED_EIP = 1000000
    const f = function () {
      c.paramByEIP('Bls12381G1AddGas', UNSUPPORTED_EIP)
    }
    let msg = 'Should throw for using paramByEIP() with an unsupported EIP'
    assert.throws(f, /not supported$/, undefined, msg)

    msg = 'Should return Bls12381G1AddGas gas price for EIP2537'
    assert.equal(c.paramByEIP('Bls12381G1AddGas', 2537), BigInt(500), msg)
  })
})
