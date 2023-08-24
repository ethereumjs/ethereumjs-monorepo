import { Block } from '@ethereumjs/block'
import { Chain, Chain, Common, Common, Hardfork, Hardfork } from '@ethereumjs/common'
import {
  Address,
  KeyEncoding,
  ValueEncoding,
  bytesToHex,
  concatBytes,
  hexToBytes,
} from '@ethereumjs/util'
import * as lmdb from 'lmdb'
import { assert, assert, describe, describe, it, it } from 'vitest'

import { Blockchain, Blockchain } from '../../src/index.js'
import { createBlock } from '../util.js'

import type { BatchDBOp, DB, DBObject, EncodingOpts } from '@ethereumjs/util'

class LMDB<
  TKey extends Uint8Array | string = Uint8Array | string,
  TValue extends Uint8Array | string | DBObject = Uint8Array | string | DBObject
> implements DB<TKey, TValue>
{
  private path
  private database

  constructor(path?: string) {
    this.path = path ?? './'
    this.database = lmdb.open({
      compression: true,
      name: '@ethereumjs/trie',
      path: this.path,
    })
  }

  /**
   * @inheritDoc
   */
  async get(key: TKey, opts?: EncodingOpts): Promise<TValue | undefined> {
    let value

    console.log('inside get')
    console.log(key)

    try {
      value = await this.database.get(key)
      if (value === null) return undefined
    } catch (error: any) {
      // https://github.com/Level/abstract-level/blob/915ad1317694d0ce8c580b5ab85d81e1e78a3137/abstract-level.js#L309
      // This should be `true` if the error came from LevelDB
      // so we can check for `NOT true` to identify any non-404 errors
      if (error.notFound !== true) {
        throw error
      }
    }
    // eslint-disable-next-line
    if (value instanceof Buffer) value = Uint8Array.from(value)

    return value as TValue
  }

  /**
   * @inheritDoc
   */
  async put(key: TKey, val: TValue, opts?: {}): Promise<void> {
    await this.database.put(key, val)
  }

  /**
   * @inheritDoc
   */
  async del(key: TKey): Promise<void> {
    await this.database.remove(key)
  }

  /**
   * @inheritDoc
   */
  async batch(opStack: BatchDBOp<TKey, TValue>[]): Promise<void> {
    const levelOps = []
    for (const op of opStack) {
      levelOps.push({ ...op })
    }

    // TODO: Investigate why as any is necessary
    await this.database.batch(levelOps as any)
  }

  // not implemented
  shallowCopy(): DB<TKey, TValue> {
    // @ts-ignore
    return
  }

  async open() {}
}

describe('[Blockchain]: Block validation tests', () => {
  it('should throw if an uncle is included before', async () => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
    console.log('dbg0')
    const blockchain = await Blockchain.create({ common, validateConsensus: false, db: new LMDB() })
    console.log('dbg1')
    const genesis = blockchain.genesisBlock

    const uncleBlock = createBlock(genesis, 'uncle', [], common)

    const block1 = createBlock(genesis, 'block1', [], common)
    const block2 = createBlock(block1, 'block2', [uncleBlock.header], common)
    const block3 = createBlock(block2, 'block3', [uncleBlock.header], common)

    await blockchain.putBlock(uncleBlock)
    await blockchain.putBlock(block1)
    await blockchain.putBlock(block2)

    try {
      await blockchain.putBlock(block3)
      assert.fail('cannot reach this')
    } catch (e: any) {
      assert.ok(
        e.message.includes('uncle is already included'),
        'block throws if uncle is already included'
      )
    }
  })
})
