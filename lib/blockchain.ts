import * as util from 'ethereumjs-util'
import BN = require('bn.js')

/**
 * This can be removed once
 * [this PR](https://github.com/ethereumjs/ethereumjs-block/pull/72/files) gets merged, released,
 * and ethereumjs-block is updated here.
 */
export type Block = any

export interface Blockchain {
  /**
   * Adds a block to the blockchain.
   *
   * @param block - The block to be added to the blockchain.
   * @param cb - The callback. It is given two parameters `err` and the saved `block`
   * @param isGenesis - True if block is the genesis block.
   */
  putBlock(block: Block, cb: any, isGenesis?: boolean): void

  /**
   * Returns a block by its hash.
   */
  getBlock(hash: Buffer | BN, cb: (err: Error | null, block?: Block) => void): void

  /**
   * Iterates through blocks starting at the specified iterator head and calls the onBlock function
   * on each block.
   *
   * @param name - Name of the state root head
   * @param onBlock - Function called on each block with params (block, reorg, cb)
   * @param cb - A callback function
   */
  iterator(name: string, onBlock: any, cb: any): void

  /**
   * Deletes a block from the blockchain. All child blocks in the chain are deleted and any
   * encountered heads are set to the parent block.
   *
   * @param blockHash - The hash of the block to be deleted
   * @param cb - A callback.
   */
  delBlock(blockHash: Buffer, cb: any): void

  /**
   * This method is only here for backwards compatibility. It can be removed once
   * [this PR](https://github.com/ethereumjs/ethereumjs-block/pull/72/files) gets merged, released,
   * and ethereumjs-block is updated here.
   *
   * The method should just call `cb` with `null` as first argument.
   */
  getDetails(_: string, cb: any): void
}

export class MockBlockchain implements Blockchain {
  private readonly _blocks: Block[] = []
  private readonly _blockNumberByHash: Map<string, number> = new Map()

  putBlock(block: any, cb: any): void {
    const blockNumber = util.bufferToInt(block.header.number)

    if (this._blocks.length !== blockNumber) {
      cb(new Error('Invalid block number'))
      return
    }

    this._blocks.push(block)
    this._blockNumberByHash.set(util.bufferToHex(block.hash()), blockNumber)

    cb(null, block)
  }

  delBlock(blockHash: Buffer, cb: any): void {
    const blockNumber = this._blockNumberByHash.get(util.bufferToHex(blockHash))

    if (blockNumber === undefined) {
      cb(new Error('Block not found'))
      return
    }

    for (let n = blockNumber; n < this._blocks.length; n++) {
      const block = this._blocks[n]

      this._blockNumberByHash.delete(util.bufferToHex(block.hash()))
    }

    this._blocks.splice(blockNumber)
    cb(null)
  }

  getBlock(hashOrBlockNumber: Buffer | BN, cb: (err: Error | null, block?: Block) => void): void {
    let blockNumber: number

    if (BN.isBN(hashOrBlockNumber)) {
      blockNumber = hashOrBlockNumber.toNumber()
    } else {
      const hash = util.bufferToHex(hashOrBlockNumber)

      if (!this._blockNumberByHash.has(hash)) {
        cb(new Error('Block not found'))
        return
      }

      blockNumber = this._blockNumberByHash.get(hash)!
    }

    cb(null, this._blocks[blockNumber])
  }

  iterator(name: string, onBlock: any, cb: any): void {
    let n = 0

    const iterate = (err?: Error | null) => {
      if (err) {
        cb(err)
        return
      }

      if (n >= this._blocks.length) {
        cb(null)
        return
      }

      onBlock(this._blocks[n], false, (err?: Error | null) => {
        n += 1
        iterate(err)
      })
    }

    iterate(null)
  }

  getDetails(_: string, cb: any): void {
    cb(null)
  }
}
