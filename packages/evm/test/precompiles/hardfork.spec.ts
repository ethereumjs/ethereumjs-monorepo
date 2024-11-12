import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { Address, createZeroAddress, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createEVM, getActivePrecompiles } from '../../src/index.js'

describe('Precompiles: hardfork availability', () => {
  it('Test BN254PAIRING availability', async () => {
    const ecpairAddressStr = '0000000000000000000000000000000000000008'
    const ecpairAddress = new Address(hexToBytes(`0x${ecpairAddressStr}`))

    // ECPAIR was introduced in Byzantium; check if available from Byzantium.
    const commonByzantium = new Common({
      chain: Mainnet,
      hardfork: Hardfork.Byzantium,
    })

    let bn254pairing = getActivePrecompiles(commonByzantium).get(ecpairAddressStr)

    if (bn254pairing) {
      assert.ok(true, 'BN254PAIRING available in petersburg')
    } else {
      assert.fail('BN254PAIRING is not available in petersburg while it should be available')
    }

    let evm = await createEVM({
      common: commonByzantium,
    })
    let result = await evm.runCall({
      caller: createZeroAddress(),
      gasLimit: BigInt(0xffffffffff),
      to: ecpairAddress,
      value: BigInt(0),
    })

    assert.equal(result.execResult.executionGasUsed, BigInt(100000)) // check that we are using gas (if address would contain no code we use 0 gas)

    // Check if ECPAIR is available in future hard forks.
    const commonPetersburg = new Common({
      chain: Mainnet,
      hardfork: Hardfork.Petersburg,
    })
    bn254pairing = getActivePrecompiles(commonPetersburg).get(ecpairAddressStr)!
    if (bn254pairing === undefined) {
      assert.fail('BN254PAIRING is not available in petersburg while it should be available')
    } else {
      assert.ok(true, 'BN254PAIRING available in petersburg')
    }

    evm = await createEVM({
      common: commonPetersburg,
    })
    result = await evm.runCall({
      caller: createZeroAddress(),
      gasLimit: BigInt(0xffffffffff),
      to: ecpairAddress,
      value: BigInt(0),
    })

    assert.equal(result.execResult.executionGasUsed, BigInt(100000))

    // Check if ECPAIR is not available in Homestead.
    const commonHomestead = new Common({
      chain: Mainnet,
      hardfork: Hardfork.Homestead,
    })
    bn254pairing = getActivePrecompiles(commonHomestead).get(ecpairAddressStr)!

    if (bn254pairing !== undefined) {
      assert.fail('BN254PAIRING is available in homestead while it should not be available')
    } else {
      assert.ok(true, 'BN254PAIRING not available in homestead')
    }

    evm = await createEVM({
      common: commonHomestead,
    })

    result = await evm.runCall({
      caller: createZeroAddress(),
      gasLimit: BigInt(0xffffffffff),
      to: ecpairAddress,
      value: BigInt(0),
    })

    assert.equal(result.execResult.executionGasUsed, BigInt(0)) // check that we use no gas, because we are calling into an address without code.
  })
})
