import { Block, BlockHeader } from '@ethereumjs/block'
import * as tape from 'tape'
import Blockchain, { Consensus } from '../src'
import Common from '@ethereumjs/common'

class fakeConsensus implements Consensus {
  genesisInit(_genesisBlock: Block): Promise<void> {
    return new Promise<void>((resolve) => resolve())
  }
  setup(): Promise<void> {
    return new Promise<void>((resolve) => resolve())
  }
  validateConsensus(_block: Block): Promise<void> {
    return new Promise<void>((resolve) => resolve())
  }
  validateDifficulty(_header: BlockHeader): Promise<void> {
    return new Promise<void>((resolve) => resolve())
  }
  newBlock(
    _block: Block,
    _commonAncestor?: BlockHeader | undefined,
    _ancientHeaders?: BlockHeader[] | undefined
  ): Promise<void> {
    return new Promise<void>((resolve) => resolve())
  }

  consensusAlgorithm() {
    return 'fakeConsensus'
  }
}

tape('Optional consensus parameter in blockchain constructor', async (t) => {
  const common = new Common({ chain: 'mainnet' })
  const consensus = new fakeConsensus()
  try {
    const blockchain = await Blockchain.create({ common, consensus })
    t.equals(
      (blockchain.consensus as fakeConsensus).consensusAlgorithm(),
      'fakeConsensus',
      'consensus contains new fake property'
    )
  } catch (err) {
    t.fail('blockchain should instantiate successfully')
  }

  t.end()
})
