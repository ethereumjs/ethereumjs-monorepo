import { Common, Hardfork } from '@ethereumjs/common'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import {
  bigIntToBytes,
  bytesToBigInt,
  computeVersionedHash,
  concatBytesNoTypeCheck,
  initKZG,
  unpadBytes,
} from '@ethereumjs/util'
import * as kzg from 'c-kzg'
import { hexToBytes } from 'ethereum-cryptography/utils'
import * as tape from 'tape'

import { EVM, getActivePrecompiles } from '../../src'

import type { PrecompileInput } from '../../src'

const BLS_MODULUS = BigInt(
  '52435875175126190479447740508185965837690552500527637822603658699938581184513'
)
const isBrowser = new Function('try {return this===window;}catch(e){ return false;}')

tape('Precompiles: point evaluation', async (t) => {
  if (isBrowser() === true) {
    t.end()
  } else {
    initKZG(kzg, __dirname + '/../../../client/lib/trustedSetups/devnet4.txt')
    const genesisJSON = require('../../../client/test/testdata/geth-genesis/eip4844.json')
    const common = Common.fromGethGenesis(genesisJSON, {
      chain: 'custom',
      hardfork: Hardfork.Cancun,
    })
    const evm = await EVM.create({
      common,
      stateManager: new DefaultStateManager(),
    })
    const addressStr = '0000000000000000000000000000000000000014'
    const pointEvaluation = getActivePrecompiles(common).get(addressStr)!

    const testCase = {
      Proof: hexToBytes(
        '8ad6f539bc7280de6af4c95e7cef39bb6873f18c46ee5eb67299324ee7c6e6da71be2dbd5e2cbafbae4b2d60b40a808c'
      ),
      Commitment: hexToBytes(
        'abb6bcbe313530ce7779abdf633d5a3594a41fbad9a79f4a9b46b89c0cfe78f6a15948dec92c4404aedac8b5e7dd6059'
      ),
      InputPoint: hexToBytes('0120000000000000000000000000000000000000000000000000000000000000'),
      ClaimedValue: hexToBytes('48cdd065593bd932707001e88674108ade9dd71d2e849e9a55fa71b70f06690f'),
    }
    const versionedHash = computeVersionedHash(testCase.Commitment, 1)

    const opts: PrecompileInput = {
      data: concatBytesNoTypeCheck(
        versionedHash,
        testCase.InputPoint,
        testCase.ClaimedValue,
        testCase.Commitment,
        testCase.Proof
      ),
      gasLimit: 0xfffffffffn,
      _EVM: evm,
      _common: common,
    }

    let res = await pointEvaluation(opts)
    t.equal(
      bytesToBigInt(unpadBytes(res.returnValue.slice(32))),
      BLS_MODULUS,
      'point evaluation precompile returned expected output'
    )

    const optsWithBigNumbers: PrecompileInput = {
      data: concatBytesNoTypeCheck(
        versionedHash,
        testCase.InputPoint,
        bigIntToBytes(BLS_MODULUS + 5n),
        testCase.Commitment,
        testCase.Proof
      ),
      gasLimit: 0xfffffffffn,
      _EVM: evm,
      _common: common,
    }

    res = await pointEvaluation(optsWithBigNumbers)
    t.equal(
      res.exceptionError?.error,
      'point greater than BLS modulus',
      'point evaluation precompile throws when points are too big'
    )

    const optsWithInvalidCommitment: PrecompileInput = {
      data: concatBytesNoTypeCheck(
        concatBytesNoTypeCheck(Uint8Array.from([0]), versionedHash.slice(1)),
        testCase.InputPoint,
        testCase.ClaimedValue,
        testCase.Commitment,
        testCase.Proof
      ),
      gasLimit: 0xfffffffffn,
      _EVM: evm,
      _common: common,
    }

    res = await pointEvaluation(optsWithInvalidCommitment)
    t.equal(
      res.exceptionError?.error,
      'kzg commitment does not match versioned hash',
      'precompile throws when commitment doesnt match versioned hash'
    )
    t.end()
  }
})
