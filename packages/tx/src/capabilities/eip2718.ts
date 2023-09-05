import { RLP } from '@ethereumjs/rlp'
import { concatBytes } from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak.js'

import { txTypeBytes } from '../util.js'

import { errorMsg } from './legacy.js'

import type { EIP2718CompatibleTxInterface, TypedTransaction } from '../types'
import type { Input } from '@ethereumjs/rlp'

export function getHashedMessageToSign(tx: EIP2718CompatibleTxInterface): Uint8Array {
  return keccak256(tx.getMessageToSign())
}

export function serialize(tx: EIP2718CompatibleTxInterface, base?: Input): Uint8Array {
  return concatBytes(txTypeBytes(tx.type), RLP.encode(base ?? tx.raw()))
}

export function validateYParity(tx: TypedTransaction) {
  const { v } = tx
  if (v !== undefined && v !== BigInt(0) && v !== BigInt(1)) {
    const msg = errorMsg(tx, 'The y-parity of the transaction should either be 0 or 1')
    throw new Error(msg)
  }
}
