import Blockchain from 'ethereumjs-blockchain'
import { toBuffer } from 'ethereumjs-util'
import { Block } from '../src/block'
import { BlockHeader } from '../src/header'

export const setupBlockchain = async (): Promise<[Blockchain, Block]> => {
  return new Promise((resolve, reject) => {
    const blockchain = new Blockchain({
      validateBlocks: true,
      validatePow: false,
      chain: 'ropsten',
    })
    const genesisBlock = new Block(undefined, { chain: 'ropsten' })
    genesisBlock.setGenesisParams()

    blockchain.putGenesis(genesisBlock, (err?: Error) => {
      if (err) {
        return reject(err)
      }
      const nextBlock = new Block(
        {
          header: new BlockHeader({
            number: 1,
            parentHash: genesisBlock.header.hash(),
            gasLimit: genesisBlock.header.gasLimit,
            timestamp: Date.now(),
          }),
        },
        { chain: 'ropsten' },
      )
      nextBlock.header.difficulty = toBuffer(nextBlock.header.canonicalDifficulty(genesisBlock))

      blockchain.putBlock(nextBlock, async (err?: Error) => {
        if (err) {
          return reject(err)
        }
        resolve([blockchain, nextBlock])
      })
    })
  })
}
