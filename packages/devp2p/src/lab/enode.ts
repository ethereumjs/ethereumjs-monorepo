import { bytesToUnprefixedHex } from '@ethereumjs/util'
import { secp256k1 } from '@noble/curves/secp256k1.js'

import { pk2id } from '../util.ts'

export function privateKeyToEnode(
  privateKey: Uint8Array,
  host: string,
  tcpPort: number,
  udpPort?: number,
): string {
  const pub = secp256k1.getPublicKey(privateKey, false)
  const id = bytesToUnprefixedHex(pk2id(pub))
  const disc = udpPort ?? tcpPort
  return `enode://${id}@${host}:${tcpPort}?discport=${disc}`
}
