import { RLP } from '@ethereumjs/rlp'
import { hexToBytes } from '@ethereumjs/util'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { describe, expect, it } from 'vitest'

import { discv4ENRList } from '../../src/dpt/discv4Enr.ts'

describe('[Devp2p/DPT]: discv4 ENR', () => {
  it('signs a v4 record the node key can verify', () => {
    const privateKey = hexToBytes(
      '0xb71c71a67e1177ad4e901695e1b4b9ee17ae16c6668d313eac2f96dbcda3f291',
    )
    const record = discv4ENRList(privateKey, {
      address: '127.0.0.1',
      udpPort: 30303,
      tcpPort: 30303,
    })
    const [signature, seq, ...pairs] = record
    const content = RLP.encode([seq, ...pairs])
    const sig = signature as Uint8Array
    const ok = secp256k1.verify(
      sig.subarray(0, 64),
      keccak_256(content),
      secp256k1.getPublicKey(privateKey, true),
      {
        lowS: false,
        prehash: false,
      },
    )
    expect(ok).toBe(true)
  })
})
