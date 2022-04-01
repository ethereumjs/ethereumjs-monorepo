import { Block, Blockchain } from '../src'

// Helper class to setup a mock Blockchain

export class Mockchain implements Blockchain {
  private HashMap: { [key: string]: Block } = {}
  public consensus = {
    cliqueActiveSigners() {
      return []
    },
  }
  async getBlock(hash: Buffer) {
    return this.HashMap[hash.toString('hex')]
  }
  async putBlock(block: Block) {
    this.HashMap[block.hash().toString('hex')] = block
  }
}
