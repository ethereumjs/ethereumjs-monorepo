import { Common, Hardfork } from '@ethereumjs/common'
import { Address, createZeroAddress, hexToBytes } from '@ethereumjs/util'
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

import { goerliChainConfig } from '@ethereumjs/testdata'

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

  type Signer = {
    address: Address
    privateKey: Uint8Array
    publicKey: Uint8Array
  }

  const A: Signer = {
    address: new Address(hexToBytes('0x0b90087d864e82a284dca15923f3776de6bb016f')),
    privateKey: hexToBytes('0x64bf9cc30328b0e42387b3c82c614e6386259136235e20c1357bd11cdee86993'),
    publicKey: hexToBytes(
      '0x40b2ebdf4b53206d2d3d3d59e7e2f13b1ea68305aec71d5d24cefe7f24ecae886d241f9267f04702d7f693655eb7b4aa23f30dcd0c3c5f2b970aad7c8a828195',
    ),
  }

  it('Signing', () => {
    const cliqueSignerKey = A.privateKey

    let header = createSealedCliqueBlockHeader(
      { number: 1, extraData: new Uint8Array(97) },
      cliqueSignerKey,
      { common, freeze: false },
    )

    assert.strictEqual(header.extraData.length, 97)
    assert.isTrue(cliqueVerifySignature(header, [A.address]), 'should verify signature')
    assert.isTrue(
      cliqueSigner(header).equals(A.address),
      'should recover the correct signer address',
    )

    header = createBlockHeader({ extraData: new Uint8Array(97) }, { common })
    assert.isTrue(
      cliqueSigner(header).equals(createZeroAddress()),
      'should return zero address on default block',
    )
  })
})
