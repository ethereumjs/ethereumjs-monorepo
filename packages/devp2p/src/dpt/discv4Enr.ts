import { RLP } from '@ethereumjs/rlp'
import { concatBytes, intToBytes, utf8ToBytes } from '@ethereumjs/util'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import { keccak_256 } from '@noble/hashes/sha3.js'

import { ipToBytes } from '../util.ts'

/** EIP-778 node record as an RLP list, for a discv4 ENRResponse (packet type 0x06). */
export function discv4ENRList(
  privateKey: Uint8Array,
  endpoint: { address: string; udpPort: number; tcpPort: number },
): Uint8Array[] {
  const seq = intToBytes(1)
  const port = (value: number) => Uint8Array.from([(value >>> 8) & 0xff, value & 0xff])
  const pairs = [
    utf8ToBytes('id'),
    utf8ToBytes('v4'),
    utf8ToBytes('ip'),
    ipToBytes(endpoint.address),
    utf8ToBytes('secp256k1'),
    secp256k1.getPublicKey(privateKey, true),
    utf8ToBytes('tcp'),
    port(endpoint.tcpPort),
    utf8ToBytes('udp'),
    port(endpoint.udpPort),
  ]
  const content = RLP.encode([seq, ...pairs])
  const sigBytes = secp256k1.sign(keccak_256(content), privateKey, {
    format: 'recovered',
    prehash: false,
    lowS: true,
  })
  const signature = concatBytes(sigBytes.subarray(1), Uint8Array.from([sigBytes[0]!]))
  return [signature, seq, ...pairs]
}

/** Read the advertised TCP port from a discv4 ENRResponse record list. */
export function tcpPortFromDiscv4Enr(record: Uint8Array[]): number | undefined {
  for (let i = 2; i + 1 < record.length; i += 2) {
    const key = new TextDecoder().decode(record[i]!)
    if (key === 'tcp' && record[i + 1]!.length >= 2) {
      const b = record[i + 1]!
      return (b[0]! << 8) | b[1]!
    }
  }
  return undefined
}
