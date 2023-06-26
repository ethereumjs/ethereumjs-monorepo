import { Block } from '@ethereumjs/block'
import { LegacyTransaction } from '@ethereumjs/tx'
import { equalsBytes, toBytes } from '@ethereumjs/util'

import { dummy } from './helpers'

export function mockBlockchain(options: any = {}) {
  const number = options.number ?? '0x444444'
  const blockHash =
    options.hash ?? '0x910abca1728c53e8d6df870dd7af5352e974357dc58205dea1676be17ba6becf'
  const transactions = options.transactions ?? [
    LegacyTransaction.fromTxData({}).sign(dummy.privKey),
  ]
  const block = {
    hash: () => toBytes(blockHash),
    header: {
      number: BigInt(number),
    },
    toJSON: () => ({
      ...Block.fromBlockData({ header: { number } }).toJSON(),
      hash: options.hash ?? blockHash,
      transactions: transactions.map((t: LegacyTransaction) => t.toJSON()),
    }),
    transactions,
    uncleHeaders: [],
  }
  return {
    blocks: { latest: block },
    getBlock: async (val: any) => {
      if (val instanceof Uint8Array && equalsBytes(val, new Uint8Array(32))) {
        throw Error
      }
      return block
    },
    getCanonicalHeadHeader: () => {
      return Block.fromBlockData().header
    },
    genesisBlock: block,
    copy() {
      return this
    },
  }
}
