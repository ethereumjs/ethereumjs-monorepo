import { Common, Hardfork } from '@ethereumjs/common'
import {
  bytesToBigInt,
  computeVersionedHash,
  concatBytes,
  hexToBytes,
  initKZG,
  unpadBytes,
} from '@ethereumjs/util'
import * as kzg from 'c-kzg'
import { assert, describe, it } from 'vitest'

import { EVM, getActivePrecompiles } from '../../src/index.js'

import type { PrecompileInput } from '../../src/index.js'

const BLS_MODULUS = BigInt(
  '52435875175126190479447740508185965837690552500527637822603658699938581184513'
)
const isBrowser = new Function('try {return this===window;}catch(e){ return false;}')

describe('Precompiles: point evaluation', () => {
  it('should work', async () => {
    if (isBrowser() === false) {
      try {
        initKZG(kzg, __dirname + '/../../../client/src/trustedSetups/devnet6.txt')
        // eslint-disable-next-line
      } catch {}

      const genesisJSON = require('../../../client/test/testdata/geth-genesis/eip4844.json')
      const common = Common.fromGethGenesis(genesisJSON, {
        chain: 'custom',
        hardfork: Hardfork.Cancun,
      })
      const evm = await new EVM({
        common,
      })
      const addressStr = '000000000000000000000000000000000000000a'
      const pointEvaluation = getActivePrecompiles(common).get(addressStr)!

      const testCase = {
        Proof: hexToBytes(
          '0x8ad6f539bc7280de6af4c95e7cef39bb6873f18c46ee5eb67299324ee7c6e6da71be2dbd5e2cbafbae4b2d60b40a808c'
        ),
        Commitment: hexToBytes(
          '0xabb6bcbe313530ce7779abdf633d5a3594a41fbad9a79f4a9b46b89c0cfe78f6a15948dec92c4404aedac8b5e7dd6059'
        ),
        InputPoint: hexToBytes(
          '0x0000000000000000000000000000000000000000000000000000000000002001'
        ),
        ClaimedValue: hexToBytes(
          '0x0f69060fb771fa559a9e842e1dd79dde8a107486e801707032d93b5965d0cd48'
        ),
      }
      const versionedHash = computeVersionedHash(testCase.Commitment, 1)

      const opts: PrecompileInput = {
        data: concatBytes(
          versionedHash,
          testCase.InputPoint,
          testCase.ClaimedValue,
          testCase.Commitment,
          testCase.Proof
        ),
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
          testCase.InputPoint,
          testCase.ClaimedValue,
          testCase.Commitment,
          testCase.Proof
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
    }
  })
})
