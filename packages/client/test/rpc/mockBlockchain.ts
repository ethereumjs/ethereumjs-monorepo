import { Block } from '@ethereumjs/block'
import { bufferToHex, toBuffer } from 'ethereumjs-util'

export function mockBlockchain(options: any = {}) {
  const number = options.number ?? '0x444444'
  const blockHash =
    options.hash ?? '0x910abca1728c53e8d6df870dd7af5352e974357dc58205dea1676be17ba6becf'
  const txHash = Buffer.from(
    '0be3065cf288b071ccff922c1c601e2e5628d488b66e781c260ecee36054a2dc',
    'hex'
  )
  const block = {
    hash: () => toBuffer(blockHash),
    header: {
      number: BigInt(number),
    },
    toJSON: () => ({
      ...Block.fromBlockData({ header: { number } }).toJSON(),
      hash: options.hash ?? blockHash,
      transactions: options.transactions ?? [{ hash: bufferToHex(txHash) }],
    }),
    transactions: options.transactions ?? [
      {
        hash: () => {
          return txHash
        },
      },
    ],
    uncleHeaders: [],
  }
  return {
    blocks: { latest: block },
    getBlock: async (val: any) => {
      if (Buffer.isBuffer(val) && val.equals(Buffer.alloc(32))) {
        throw Error
      }
      return block
    },
    getCanonicalHeadHeader: () => {
      return Block.fromBlockData().header
    },
    genesisBlock: () => block,
  }
}
