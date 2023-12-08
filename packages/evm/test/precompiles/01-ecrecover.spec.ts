import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { bytesToHex, hexToBytes } from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak.js'
import { assert, describe, it } from 'vitest'

import { EVM, getActivePrecompiles } from '../../src/index.js'

const prefix = '\x19Ethereum Signed Message:\n32'
const _hash = '852daa74cc3c31fe64542bb9b8764cfb91cc30f9acf9389071ffb44a9eefde46'
const _v = '000000000000000000000000000000000000000000000000000000000000001b'
const _r = 'b814eaab5953337fed2cf504a5b887cddd65a54b7429d7b191ff1331ca0726b1'
const _s = '264de2660d307112075c15f08ba9c25c9a0cc6f8119aff3e7efb0a942773abb0'
const address = '0xa6fb229e9b0a4e4ef52ea6991adcfc59207c7711'

describe('Precompiles: ECADD', () => {
  it('ECADD', async () => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Petersburg })
    const evm = new EVM({
      common,
    })
    const addressStr = '0000000000000000000000000000000000000001'
    const ECRECOVER = getActivePrecompiles(common).get(addressStr)!

    const prefixedMessage = keccak256(hexToBytes(`0x${prefix}${_hash}`))
    const data = hexToBytes(`0x${prefixedMessage}${_v}${_r}${_s}`)
    const result = await ECRECOVER({
      data,
      gasLimit: BigInt(0xffff),
      common,
      _EVM: evm,
    })

    assert.deepEqual(bytesToHex(result.returnValue), address, 'should use petersburg gas costs')
  })
})
