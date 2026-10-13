import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { hexToBytes } from '@ethereumjs/util'
import * as mcl from 'mcl-wasm'
import { assert, describe, it } from 'vitest'

import { EVMError } from '../../src/errors.ts'
import { MCLBLS, createEVM } from '../../src/index.ts'
import { precompile0f } from '../../src/precompiles/0f-bls12-pairing.ts'

import type { PrecompileInput } from '../../src/index.ts'

describe('Precompiles: bls12-381 pairing check', () => {
  it('should normalize a non-EVMError thrown by the underlying bls library to revert', async () => {
    await mcl.init(mcl.BLS12_381)
    const realBls = new MCLBLS(mcl)
    // Delegate every method to the real MCLBLS instance except pairingCheck,
    // which we force to throw a plain (non-EVMError) value -- this is the
    // scenario the fix normalizes; the real library only ever throws
    // EVMError for the fixtures in eip-2537-bls.spec.ts, so that suite
    // passing doesn't actually exercise this path.
    const bls = Object.assign(Object.create(realBls), {
      pairingCheck: () => {
        throw new Error('unexpected wasm failure')
      },
    })

    const common = new Common({ chain: Mainnet, hardfork: Hardfork.Berlin, eips: [2537] })
    const evm = await createEVM({ common, bls })

    // A structurally valid single G1/G2 pair (passes the precompile's own
    // length/leading-zero-byte checks) taken from pairing_check_bls.json --
    // the content doesn't matter since pairingCheck is mocked to throw
    // unconditionally, but it must clear the pre-checks to reach it.
    const validPairInput = hexToBytes(
      '0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb80000000000000000000000000000000013e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e000000000000000000000000000000000ce5d527727d6e118cc9cdc6da2e351aadfd9baa8cbdd3a76d429a695160d12c923ac9cc3baca289e193548608b82801000000000000000000000000000000000606c4a02ea734cc32acd2b02bc28b99cb3e287e85a763af267492ab572e99ab3f370d275cec1da1aaa9075ff05f79be',
    )

    const opts: PrecompileInput = {
      data: validPairInput,
      gasLimit: 5000000n,
      common,
      _EVM: evm,
    }

    const res = await precompile0f(opts)
    assert.strictEqual(res.exceptionError?.error, EVMError.errorMessages.REVERT)
  })
})
