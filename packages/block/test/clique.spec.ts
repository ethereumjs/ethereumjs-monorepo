import { Common, Hardfork } from '@ethereumjs/common'
import { createZeroAddress } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import {
  cliqueEpochTransitionSigners,
  cliqueExtraSeal,
  cliqueExtraVanity,
  cliqueIsEpochTransition,
  cliqueSigner,
  cliqueVerifySignature,
  createBlockHeader,
  createSealedCliqueBlockHeader,
} from '../src/index.ts'

import { SIGNER_A, goerliChainConfig } from '@ethereumjs/testdata'

describe('[Header]: Clique PoA Functionality', () => {
  const common = new Common({ chain: goerliChainConfig, hardfork: Hardfork.Chainstart })

  it('Header Data', () => {
    let header = createBlockHeader({ number: 1 })
    assert.throws(
      () => {
        cliqueIsEpochTransition(header)
      },
      undefined,
      undefined,
      'cliqueIsEpochTransition() -> should throw on PoW networks',
    )

    header = createBlockHeader({ extraData: new Uint8Array(97) }, { common })
    assert.isTrue(
      cliqueIsEpochTransition(header),
      'cliqueIsEpochTransition() -> should indicate an epoch transition for the genesis block',
    )

    header = createBlockHeader({ number: 1, extraData: new Uint8Array(97) }, { common })
    assert.isFalse(
      cliqueIsEpochTransition(header),
      'cliqueIsEpochTransition() -> should correctly identify a non-epoch block',
    )
    assert.deepEqual(
      cliqueExtraVanity(header),
      new Uint8Array(32),
      'cliqueExtraVanity() -> should return correct extra vanity value',
    )
    assert.deepEqual(
      cliqueExtraSeal(header),
      new Uint8Array(65),
      'cliqueExtraSeal() -> should return correct extra seal value',
    )
    assert.throws(
      () => {
        cliqueEpochTransitionSigners(header)
      },
      undefined,
      undefined,
      'cliqueEpochTransitionSigners() -> should throw on non-epoch block',
    )

    header = createBlockHeader({ number: 60000, extraData: new Uint8Array(137) }, { common })
    assert.isTrue(
      cliqueIsEpochTransition(header),
      'cliqueIsEpochTransition() -> should correctly identify an epoch block',
    )
    assert.deepEqual(
      cliqueExtraVanity(header),
      new Uint8Array(32),
      'cliqueExtraVanity() -> should return correct extra vanity value',
    )
    assert.deepEqual(
      cliqueExtraSeal(header),
      new Uint8Array(65),
      'cliqueExtraSeal() -> should return correct extra seal value',
    )
    const msg =
      'cliqueEpochTransitionSigners() -> should return the correct epoch transition signer list on epoch block'
    assert.deepEqual(
      cliqueEpochTransitionSigners(header),
      [createZeroAddress(), createZeroAddress()],
      msg,
    )
  })

  it('Signing', () => {
    const cliqueSignerKey = SIGNER_A.privateKey

    let header = createSealedCliqueBlockHeader(
      { number: 1, extraData: new Uint8Array(97) },
      cliqueSignerKey,
      { common, freeze: false },
    )

    assert.strictEqual(header.extraData.length, 97)
    assert.isTrue(cliqueVerifySignature(header, [SIGNER_A.address]), 'should verify signature')
    assert.isTrue(
      cliqueSigner(header).equals(SIGNER_A.address),
      'should recover the correct signer address',
    )

    header = createBlockHeader({ extraData: new Uint8Array(97) }, { common })
    assert.isTrue(
      cliqueSigner(header).equals(createZeroAddress()),
      'should return zero address on default block',
    )
  })
})
