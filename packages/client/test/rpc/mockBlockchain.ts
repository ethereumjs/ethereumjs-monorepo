import { Block } from '@ethereumjs/block'
import { bufferToHex } from 'ethereumjs-util'

export function mockBlockchain(options: any = {}) {
  const txHash = Buffer.from(
    '0be3065cf288b071ccff922c1c601e2e5628d488b66e781c260ecee36054a2dc',
    'hex'
  )
  const block = {
    transactions: options.transactions ?? [
      {
        hash: () => {
          return txHash
        },
      },
    ],
    toJSON: () => ({
      number: options.number ?? 444444,
      hash: options.hash ?? '0x910abca1728c53e8d6df870dd7af5352e974357dc58205dea1676be17ba6becf',
      transactions: options.transactions ?? [{ hash: bufferToHex(txHash) }],
    }),
  }
  return {
    getBlock: async (_data: any) => {
      return block
    },
    getLatestHeader: () => {
      return Block.fromBlockData().header
    },
  }
}
