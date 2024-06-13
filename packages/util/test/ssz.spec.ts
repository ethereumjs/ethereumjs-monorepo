import { assert, describe, it } from 'vitest'

import { ssz } from '../src/index.js'

const eip1559SszJson = {
  payload: {
    type: '2',
    chain_id: '1',
    nonce: '0',
    max_fees_per_gas: { regular: '100' },
    gas: '30000000',
    to: '0x00000000219ab540356cbb839cbe05303d7705fa',
    value: '32000000000000000000',
    input:
      '0x22895118000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000001208cd4e5a69709cf8ee5b1b73d6efbf3f33bcac92fb7e4ce62b2467542fb50a72d0000000000000000000000000000000000000000000000000000000000000030ac842878bb70009552a4cfcad801d6e659c50bd50d7d03306790cb455ce7363c5b6972f0159d170f625a99b2064dbefc000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020010000000000000000000000818ccb1c4eda80270b04d6df822b1e72dd83c3030000000000000000000000000000000000000000000000000000000000000060a747f75c72d0cf0d2b52504c7385b516f0523e2f0842416399f42b4aee5c6384a5674f6426b1cc3d0827886fa9b909e616f5c9f61f986013ed2b9bf37071cbae951136265b549f44e3c8e26233c0433e9124b7fd0dc86e82f9fedfc0a179d769',
    access_list: [],
    max_priority_fees_per_gas: { regular: '0' },
  },
  signature: {
    from: '0x610adc49ecd66cbf176a8247ebd59096c031bd9f',
    ecdsa_signature:
      '0x5f8397122e00d9cdea67c83ec99a4694af24c3d6f25c4dde8f2fa4277d85c96754b2ea7851948fe99288049edfd8ca53c4aee79043e91afb513de0664822277900',
  },
}

describe('profile<>stable tx container', function () {
  it(`EIP 1559 tx profile<>stable conversion`, () => {
    const profileSszValue = ssz.Eip1559Transaction.fromJson(eip1559SszJson)
    const profileSszBytes = ssz.Eip1559Transaction.serialize(profileSszValue)

    const stableTx = ssz.Transaction.deserialize(profileSszBytes)
    const stableTxJson = ssz.Transaction.toJson(stableTx)

    assert.deepEqual(stableTxJson, eip1559SszJson, 'the transaction jsons should match')
  })
})
