import { Hardfork } from '@ethereumjs/common'
import { type PrefixedHexString, bytesToHex, randomBytes, utf8ToBytes } from '@ethereumjs/util'
import { p256 } from '@noble/curves/p256'
import { sha256 } from 'ethereum-cryptography/sha256.js'
import { runPrecompile } from './util.ts'

const main = async () => {
  // P256VERIFY precompile (address 0x100)
  // Demonstrates signing SHA-256("ethereumjs-evm-p256verify-example") with a private key
  //
  // Input format (see EIP-7951):
  // - 32 bytes: msgHash
  // - 32 bytes: r
  // - 32 bytes: s
  // - 32 bytes: qx (public key x)
  // - 32 bytes: qy (public key y)

  const message = 'ethereumjs-evm-p256verify-example'
  const messageHash = sha256(utf8ToBytes(message))

  const privateKey = randomBytes(32)
  const publicKey = p256.ProjectivePoint.fromPrivateKey(privateKey).toAffine()

  const signature = p256.sign(messageHash, privateKey)

  const padHex = (value: bigint) => value.toString(16).padStart(64, '0')

  const msgHashHex = bytesToHex(messageHash)
  const rHex = padHex(signature.r)
  const sHex = padHex(signature.s)
  const qxHex = padHex(publicKey.x)
  const qyHex = padHex(publicKey.y)

  const data: PrefixedHexString = `${msgHashHex}${rHex}${sHex}${qxHex}${qyHex}`

  // Valid signature: returns 0x0000000000000000000000000000000000000000000000000000000000000001
  await runPrecompile('P256VERIFY', '0x100', data, Hardfork.Osaka)

  // Signature verification fails: returns 0x (0 bytes)
  const randomMsgHash = bytesToHex(randomBytes(32))
  const badData: PrefixedHexString = `${randomMsgHash}${rHex}${sHex}${qxHex}${qyHex}`
  await runPrecompile('P256VERIFY', '0x100', badData, Hardfork.Osaka)
}

void main()
