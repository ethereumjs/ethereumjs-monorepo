import { assert, describe, it } from 'vitest'

import { advertisedForkHash, chainConfigForNetwork } from '../src/net/chainHardfork.ts'
import { p2pHandshakeStatusFields } from '../src/net/genesisStatus.ts'

function assertGenesisHash(hex: string, network: string): void {
  assert.match(hex, /^0x[0-9a-f]{64}$/, network)
}

describe('[Ethy/Net]: genesis STATUS', () => {
  it('advertises genesis-only block range on Sepolia until a servable window exists', () => {
    const status = p2pHandshakeStatusFields('sepolia')
    assert.equal(status.earliestBlock, '0x00')
    assert.equal(status.latestBlock, '0x00')
    assert.equal(status.bestHash, status.genesisHash)
  })

  it('advertises the 32-byte Sepolia genesis hash Geth checks', () => {
    const genesis = p2pHandshakeStatusFields('sepolia').genesisHash
    assert.equal(genesis, '0x25a5cc106eea7138acab33231d7160d69cb777ee0c2c553fcddf5138993e6dd9')
    assertGenesisHash(genesis, 'sepolia')
    assert.equal(advertisedForkHash(chainConfigForNetwork('sepolia'), 'bpo2'), '0x268956b6')
    assert.equal(advertisedForkHash(chainConfigForNetwork('sepolia'), 'amsterdam'), '0x6c1d9423')
  })

  it('advertises genesis-only block range on mainnet', () => {
    const status = p2pHandshakeStatusFields('mainnet')
    assert.equal(status.earliestBlock, '0x00')
    assert.equal(status.latestBlock, '0x00')
    assert.equal(status.bestHash, status.genesisHash)
  })

  it('advertises 32-byte Hoodi and Holesky genesis hashes', () => {
    for (const network of ['hoodi', 'holesky', 'mainnet'] as const) {
      assertGenesisHash(p2pHandshakeStatusFields(network).genesisHash, network)
    }
    assert.equal(
      p2pHandshakeStatusFields('hoodi').genesisHash,
      '0xbbe312868b376a3001692a646dd2d7d1e4406380dfd86b98aa8a34d1557c971b',
    )
    assert.equal(
      p2pHandshakeStatusFields('holesky').genesisHash,
      '0xb5f7f912443c940f21fd611f12828d75b534364ed9e95ca4e307729a4661bde4',
    )
  })
})
