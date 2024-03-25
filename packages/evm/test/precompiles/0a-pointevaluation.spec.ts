import { Common, Hardfork } from '@ethereumjs/common'
import {
  bytesToBigInt,
  computeVersionedHash,
  concatBytes,
  hexToBytes,
  unpadBytes,
} from '@ethereumjs/util'
import { loadKZG } from 'kzg-wasm'
import { assert, describe, it } from 'vitest'

import { EVM, getActivePrecompiles } from '../../src/index.js'

import type { PrecompileInput } from '../../src/index.js'

const BLS_MODULUS = BigInt(
  '52435875175126190479447740508185965837690552500527637822603658699938581184513'
)

describe('Precompiles: point evaluation', () => {
  it('should work', async () => {
    const genesisJSON = await import('../../../client/test/testdata/geth-genesis/eip4844.json')

    const kzg = await loadKZG()

    const common = Common.fromGethGenesis(genesisJSON, {
      chain: 'custom',
      hardfork: Hardfork.Cancun,
      customCrypto: { kzg },
    })

    const evm = await EVM.create({
      common,
    })
    const addressStr = '000000000000000000000000000000000000000a'
    const pointEvaluation = getActivePrecompiles(common).get(addressStr)!

    const testCase = {
      commitment: hexToBytes(
        '0xc00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
      ),
      z: hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000002'),
      y: hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000000'),
      proof: hexToBytes(
        '0xc00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
      ),
    }
    const versionedHash = computeVersionedHash(testCase.commitment, 1)

    const opts: PrecompileInput = {
      data: concatBytes(versionedHash, testCase.z, testCase.y, testCase.commitment, testCase.proof),
      gasLimit: 0xfffffffffn,
      _EVM: evm,
      common,
    }

    let res = await pointEvaluation(opts)
    assert.equal(
      bytesToBigInt(unpadBytes(res.returnValue.slice(32))),
      BLS_MODULUS,
      'point evaluation precompile returned expected output'
    )

    const optsWithInvalidCommitment: PrecompileInput = {
      data: concatBytes(
        concatBytes(Uint8Array.from([0]), versionedHash.slice(1)),
        testCase.z,
        testCase.y,
        testCase.commitment,
        testCase.proof
      ),
      gasLimit: 0xfffffffffn,
      _EVM: evm,
      common,
    }

    res = await pointEvaluation(optsWithInvalidCommitment)
    assert.ok(
      res.exceptionError?.error.match('kzg commitment does not match versioned hash'),
      'precompile throws when commitment does not match versioned hash'
    )
  })
})
