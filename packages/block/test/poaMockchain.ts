import { Address } from 'ethereumjs-util'
import { Block, Blockchain } from '../src'

// Helper class to setup a mock Blockchain

export class PoaMockchain implements Blockchain {
  private HashMap: { [key: string]: Block } = {}
  public consensus = {
    cliqueActiveSigners() {
      const signer = new Address(Buffer.from('0b90087d864e82a284dca15923f3776de6bb016f', 'hex'))
      return [signer]
    },
  }
  async getBlock(hash: Buffer) {
    return this.HashMap[hash.toString('hex')]
  }
  async putBlock(block: Block) {
    this.HashMap[block.hash().toString('hex')] = block
  }
}
