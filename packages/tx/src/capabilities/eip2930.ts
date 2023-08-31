import { RLP } from '@ethereumjs/rlp'
import { concatBytes, hexToBytes } from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak.js'

import { BaseTransaction } from '../baseTransaction.js'
import { type TypedTransaction } from '../types.js'
import { AccessLists } from '../util.js'

import type { Transaction, TransactionType } from '../types.js'

type TypedTransactionEIP2930 = Exclude<TypedTransaction, Transaction[TransactionType.Legacy]>

/**
 * The amount of gas paid for the data in this tx
 */
export function getDataFee(tx: TypedTransactionEIP2930): bigint {
  if (tx['cache'].dataFee && tx['cache'].dataFee.hardfork === tx.common.hardfork()) {
    return tx['cache'].dataFee.value
  }

  let cost = BaseTransaction.prototype.getDataFee.bind(tx)()
  cost += BigInt(AccessLists.getDataFeeEIP2930(tx.accessList, tx.common))

  if (Object.isFrozen(tx)) {
    tx['cache'].dataFee = {
      value: cost,
      hardfork: tx.common.hardfork(),
    }
  }

  return cost
}

export function getHashedMessageToSign(tx: TypedTransactionEIP2930): Uint8Array {
  return keccak256(tx.getMessageToSign())
}

export function serialize(tx: TypedTransactionEIP2930): Uint8Array {
  const base = tx.raw()
  const txTypeBytes = hexToBytes('0x' + tx.type.toString(16).padStart(2, '0'))
  return concatBytes(txTypeBytes, RLP.encode(base))
}
