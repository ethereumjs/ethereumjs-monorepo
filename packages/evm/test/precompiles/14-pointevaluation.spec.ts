import { Common, Hardfork } from '@ethereumjs/common'
import { computeVersionedHash, initKZG } from '@ethereumjs/tx'
import { bigIntToBuffer, bufferToBigInt, unpadBuffer } from '@ethereumjs/util'
import * as kzg from 'c-kzg'
import * as tape from 'tape'

import { EVM, getActivePrecompiles } from '../../src'
import { BLS_MODULUS } from '../../src/precompiles/14-kzg-point-evaluation'
import { getEEI } from '../utils'

import type { PrecompileInput } from '../../src/precompiles'

initKZG(kzg)

tape('Precompiles: point evaluation', async (t) => {
  const genesisJSON = require('../../../client/test/testdata/geth-genesis/eip4844.json')
  const common = Common.fromGethGenesis(genesisJSON, {
    chain: 'custom',
    hardfork: Hardfork.ShardingForkDev,
  })
  const eei = await getEEI()
  const evm = await EVM.create({ common, eei })
  const addressStr = '0000000000000000000000000000000000000014'
  const pointEvaluation = getActivePrecompiles(common).get(addressStr)!

  const testCase = {
    Proof: Buffer.from(
      '8ad6f539bc7280de6af4c95e7cef39bb6873f18c46ee5eb67299324ee7c6e6da71be2dbd5e2cbafbae4b2d60b40a808c',
      'hex'
    ),
    Commitment: Buffer.from(
      'abb6bcbe313530ce7779abdf633d5a3594a41fbad9a79f4a9b46b89c0cfe78f6a15948dec92c4404aedac8b5e7dd6059',
      'hex'
    ),
    InputPoint: Buffer.from(
      '0120000000000000000000000000000000000000000000000000000000000000',
      'hex'
    ),
    ClaimedValue: Buffer.from(
      '48cdd065593bd932707001e88674108ade9dd71d2e849e9a55fa71b70f06690f',
      'hex'
    ),
  }
  const versionedHash = computeVersionedHash(testCase.Commitment, 1)

  const opts: PrecompileInput = {
    data: Buffer.concat([
      versionedHash,
      testCase.InputPoint,
      testCase.ClaimedValue,
      testCase.Commitment,
      testCase.Proof,
    ]),
    gasLimit: 0xfffffffffn,
    _EVM: evm,
    _common: common,
  }

  let res = await pointEvaluation(opts)
  t.equal(
    bufferToBigInt(unpadBuffer(res.returnValue.slice(32))),
    BLS_MODULUS,
    'point evaluation precompile returned expected output'
  )

  const optsWithBigNumbers: PrecompileInput = {
    data: Buffer.concat([
      versionedHash,
      testCase.InputPoint,
      bigIntToBuffer(BLS_MODULUS + 5n),
      testCase.Commitment,
      testCase.Proof,
    ]),
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
    data: Buffer.concat([
      Buffer.concat([Uint8Array.from([0]), versionedHash.slice(1)]),
      testCase.InputPoint,
      testCase.ClaimedValue,
      testCase.Commitment,
      testCase.Proof,
    ]),
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
})
