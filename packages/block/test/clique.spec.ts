import tape from 'tape'
import Common from '@ethereumjs/common'
import { BlockHeader } from '../src/header'
import { ecsign, intToBuffer } from 'ethereumjs-util'

tape('[Header]: Clique PoA Functionality', function (t) {
  const common = new Common({ chain: 'rinkeby', hardfork: 'chainstart' })

  t.test('Header Data', function (st) {
    let header = BlockHeader.fromHeaderData({ number: 1 })
    st.throws(() => {
      header.cliqueIsEpochTransition()
    }, 'cliqueIsEpochTransition() -> should throw on PoW networks')

    header = BlockHeader.genesis({}, { common })
    st.ok(
      header.cliqueIsEpochTransition(),
      'cliqueIsEpochTransition() -> should indicate an epoch transition for the genesis block'
    )

    header = BlockHeader.fromHeaderData({ number: 1, extraData: Buffer.alloc(97) }, { common })
    st.notOk(
      header.cliqueIsEpochTransition(),
      'cliqueIsEpochTransition() -> should correctly identify a non-epoch block'
    )
    st.deepEqual(
      header.cliqueExtraVanity(),
      Buffer.alloc(32),
      'cliqueExtraVanity() -> should return correct extra vanity value'
    )
    st.deepEqual(
      header.cliqueExtraSeal(),
      Buffer.alloc(65),
      'cliqueExtraSeal() -> should return correct extra seal value'
    )
    st.throws(() => {
      header.cliqueEpochTransitionSigners()
    }, 'cliqueEpochTransitionSigners() -> should throw on non-epch block')

    header = BlockHeader.fromHeaderData({ number: 60000, extraData: Buffer.alloc(137) }, { common })
    st.ok(
      header.cliqueIsEpochTransition(),
      'cliqueIsEpochTransition() -> should correctly identify an epoch block'
    )
    st.deepEqual(
      header.cliqueExtraVanity(),
      Buffer.alloc(32),
      'cliqueExtraVanity() -> should return correct extra vanity value'
    )
    st.deepEqual(
      header.cliqueExtraSeal(),
      Buffer.alloc(65),
      'cliqueExtraSeal() -> should return correct extra seal value'
    )
    const msg =
      'cliqueEpochTransitionSigners() -> should return the correct epoch transition signer list on epoch block'
    st.deepEqual(header.cliqueEpochTransitionSigners(), [Buffer.alloc(20), Buffer.alloc(20)], msg)

    st.end()
  })

  type Signer = {
    address: Buffer
    privateKey: Buffer
    publicKey: Buffer
  }

  const A: Signer = {
    address: Buffer.from('0b90087d864e82a284dca15923f3776de6bb016f', 'hex'),
    privateKey: Buffer.from(
      '64bf9cc30328b0e42387b3c82c614e6386259136235e20c1357bd11cdee86993',
      'hex'
    ),
    publicKey: Buffer.from(
      '40b2ebdf4b53206d2d3d3d59e7e2f13b1ea68305aec71d5d24cefe7f24ecae886d241f9267f04702d7f693655eb7b4aa23f30dcd0c3c5f2b970aad7c8a828195',
      'hex'
    ),
  }

  t.test('Signing', function (st) {
    const header = BlockHeader.fromHeaderData(
      { number: 1, extraData: Buffer.alloc(97) },
      { common, freeze: false }
    )
    const signature = ecsign(header.hash(), A.privateKey)
    const signatureB = Buffer.concat([signature.r, signature.s, intToBuffer(signature.v - 27)])
    header.extraData = Buffer.concat([header.cliqueExtraVanity(), signatureB])

    st.equal(header.extraData.length, 97)
    st.deepEqual(header.cliqueVerifySignature([A.address]), true, 'should verify signature')
    st.deepEqual(
      header.cliqueSignatureToAddress().toBuffer(),
      A.address,
      'should recover the correct signer address'
    )

    st.end()
  })
})
