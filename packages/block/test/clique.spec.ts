import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { Address, hexStringToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { BlockHeader } from '../src/header.js'

describe('[Header]: Clique PoA Functionality', () => {
  const common = new Common({ chain: Chain.Rinkeby, hardfork: Hardfork.Chainstart })

  it('Header Data', () => {
    let header = BlockHeader.fromHeaderData({ number: 1 })
    assert.throws(
      () => {
        header.cliqueIsEpochTransition()
      },
      undefined,
      undefined,
      'cliqueIsEpochTransition() -> should throw on PoW networks'
    )

    header = BlockHeader.fromHeaderData({ extraData: new Uint8Array(97) }, { common })
    assert.ok(
      header.cliqueIsEpochTransition(),
      'cliqueIsEpochTransition() -> should indicate an epoch transition for the genesis block'
    )

    header = BlockHeader.fromHeaderData({ number: 1, extraData: new Uint8Array(97) }, { common })
    assert.notOk(
      header.cliqueIsEpochTransition(),
      'cliqueIsEpochTransition() -> should correctly identify a non-epoch block'
    )
    assert.deepEqual(
      header.cliqueExtraVanity(),
      new Uint8Array(32),
      'cliqueExtraVanity() -> should return correct extra vanity value'
    )
    assert.deepEqual(
      header.cliqueExtraSeal(),
      new Uint8Array(65),
      'cliqueExtraSeal() -> should return correct extra seal value'
    )
    assert.throws(
      () => {
        header.cliqueEpochTransitionSigners()
      },
      undefined,
      undefined,
      'cliqueEpochTransitionSigners() -> should throw on non-epch block'
    )

    header = BlockHeader.fromHeaderData(
      { number: 60000, extraData: new Uint8Array(137) },
      { common }
    )
    assert.ok(
      header.cliqueIsEpochTransition(),
      'cliqueIsEpochTransition() -> should correctly identify an epoch block'
    )
    assert.deepEqual(
      header.cliqueExtraVanity(),
      new Uint8Array(32),
      'cliqueExtraVanity() -> should return correct extra vanity value'
    )
    assert.deepEqual(
      header.cliqueExtraSeal(),
      new Uint8Array(65),
      'cliqueExtraSeal() -> should return correct extra seal value'
    )
    const msg =
      'cliqueEpochTransitionSigners() -> should return the correct epoch transition signer list on epoch block'
    assert.deepEqual(header.cliqueEpochTransitionSigners(), [Address.zero(), Address.zero()], msg)
  })

  type Signer = {
    address: Address
    privateKey: Uint8Array
    publicKey: Uint8Array
  }

  const A: Signer = {
    address: new Address(hexStringToBytes('0b90087d864e82a284dca15923f3776de6bb016f')),
    privateKey: hexStringToBytes(
      '64bf9cc30328b0e42387b3c82c614e6386259136235e20c1357bd11cdee86993'
    ),
    publicKey: hexStringToBytes(
      '40b2ebdf4b53206d2d3d3d59e7e2f13b1ea68305aec71d5d24cefe7f24ecae886d241f9267f04702d7f693655eb7b4aa23f30dcd0c3c5f2b970aad7c8a828195'
    ),
  }

  it('Signing', () => {
    const cliqueSigner = A.privateKey

    let header = BlockHeader.fromHeaderData(
      { number: 1, extraData: new Uint8Array(97) },
      { common, freeze: false, cliqueSigner }
    )

    assert.equal(header.extraData.length, 97)
    assert.ok(header.cliqueVerifySignature([A.address]), 'should verify signature')
    assert.ok(header.cliqueSigner().equals(A.address), 'should recover the correct signer address')

    header = BlockHeader.fromHeaderData({ extraData: new Uint8Array(97) }, { common })
    assert.ok(
      header.cliqueSigner().equals(Address.zero()),
      'should return zero address on default block'
    )
  })
})
