import { bytesToHex } from '@ethereumjs/util'

import type { Block } from '@ethereumjs/block'
import type { ExecutionPayloadBodyV1 } from '../types.ts'

export const getPayloadBody = (block: Block): ExecutionPayloadBodyV1 => {
  const transactions = block.transactions.map((tx) => bytesToHex(tx.serialize()))
  const withdrawals = block.withdrawals?.map((wt) => wt.toJSON()) ?? null

  return {
    transactions,
    withdrawals,
  }
}
