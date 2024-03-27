import { bytesToHex } from '@ethereumjs/util'

import type { ExecutionPayloadBodyV1 } from '../types'
import type { Block } from '@ethereumjs/block'

export const getPayloadBody = (block: Block): ExecutionPayloadBodyV1 => {
  const transactions = block.transactions.map((tx) => bytesToHex(tx.serialize()))
  const withdrawals = block.withdrawals?.map((wt) => wt.toJSON()) ?? null
  const deposits = block.deposits?.map((d) => d.toJSON()) ?? null

  return {
    transactions,
    withdrawals,
    deposits,
  }
}
