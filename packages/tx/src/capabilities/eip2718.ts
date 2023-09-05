import { RLP } from '@ethereumjs/rlp'
import { concatBytes, hexToBytes } from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak.js'

import { errorMsg } from './legacy.js'

import type { EIP2718CompatibleTxInterface, TypedTransaction } from '../types'

export function getHashedMessageToSign(tx: EIP2718CompatibleTxInterface): Uint8Array {
  return keccak256(tx.getMessageToSign())
}

export function serialize(tx: EIP2718CompatibleTxInterface): Uint8Array {
  const base = tx.raw()
  const txTypeBytes = hexToBytes('0x' + tx.type.toString(16).padStart(2, '0'))
  return concatBytes(txTypeBytes, RLP.encode(base))
}

export function validateYParity(tx: TypedTransaction) {
  const { v } = tx
  if (v !== undefined && v !== BigInt(0) && v !== BigInt(1)) {
    const msg = errorMsg(tx, 'The y-parity of the transaction should either be 0 or 1')
    throw new Error(msg)
  }
}
