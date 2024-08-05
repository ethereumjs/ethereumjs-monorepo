import { createBlock } from '@ethereumjs/block'
import { createLegacyTx } from '@ethereumjs/tx'
import { equalsBytes, toBytes } from '@ethereumjs/util'

import { dummy } from './helpers.js'

import type { LegacyTransaction } from '@ethereumjs/tx'

export function mockBlockchain(options: any = {}) {
  const number = options.number ?? '0x444444'
  const blockHash =
    options.hash ?? '0x910abca1728c53e8d6df870dd7af5352e974357dc58205dea1676be17ba6becf'
  const transactions = options.transactions ?? [createLegacyTx({}).sign(dummy.privKey)]
  const block = {
    hash: () => toBytes(blockHash),
    serialize: () => createBlock({ header: { number }, transactions }).serialize(),
    header: {
      number: BigInt(number),
      hash: () => toBytes(blockHash),
    },
    toJSON: () => ({
      ...createBlock({ header: { number } }).toJSON(),
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
      return createBlock().header
    },
    getIteratorHead: () => {
      return block
    },
    getTotalDifficulty: () => {
      return number
    },
    genesisBlock: block,
    shallowCopy() {
      return this
    },
  }
}
