import { createBlock } from '@ethereumjs/block'
import { createLegacyTx } from '@ethereumjs/tx'
import { type PrefixedHexString, equalsBytes, hexToBytes } from '@ethereumjs/util'

import { dummy } from './helpers.ts'

import type { JSONTx, LegacyTx, TypedTransaction } from '@ethereumjs/tx'

export function mockBlockchain(
  options: {
    number?: PrefixedHexString
    hash?: PrefixedHexString
    transactions?: TypedTransaction[] | JSONTx[]
  } = {},
) {
  const number: PrefixedHexString = options.number ?? '0x444444'
  const blockHash: PrefixedHexString =
    options.hash ?? '0x910abca1728c53e8d6df870dd7af5352e974357dc58205dea1676be17ba6becf'
  const transactions = options.transactions ?? [createLegacyTx({}).sign(dummy.privKey)]
  const block = {
    hash: () => hexToBytes(blockHash),
    serialize: () => createBlock({ header: { number }, transactions }).serialize(),
    header: {
      number: BigInt(number),
      hash: () => hexToBytes(blockHash),
    },
    toJSON: () => ({
      ...createBlock({ header: { number } }).toJSON(),
      hash: options.hash ?? blockHash,
      transactions: transactions.map((t) => (t as LegacyTx).toJSON()),
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
