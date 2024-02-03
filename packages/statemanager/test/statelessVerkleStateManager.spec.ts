import { Block } from '@ethereumjs/block'
import { Common } from '@ethereumjs/common'
import { Address, bytesToHex } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { StatelessVerkleStateManager } from '../src/index.js'

import * as testnetVerkleKaustinen from './testdata/testnetVerkleKaustinen.json'
import * as verkleBlockJSON from './testdata/verkleKaustinenBlock.json'

describe('StatelessVerkleStateManager: Kaustinen Verkle Block', () => {
  const common = Common.fromGethGenesis(testnetVerkleKaustinen, {
    chain: 'customChain',
    eips: [6800],
  })
  const block = Block.fromBlockData(verkleBlockJSON, { common })

  it('initPreState()', async () => {
    const stateManager = new StatelessVerkleStateManager()
    stateManager.initVerkleExecutionWitness(block.header.number, block.executionWitness)

    assert.ok(Object.keys(stateManager['_state']).length !== 0, 'should initialize with state')
  })

  it('getAccount()', async () => {
    const stateManager = new StatelessVerkleStateManager({ common })
    stateManager.initVerkleExecutionWitness(block.header.number, block.executionWitness)

    const account = await stateManager.getAccount(
      Address.fromString('0x9791ded6e5d3d5dafca71bb7bb2a14187d17e32e')
    )

    assert.equal(account.balance, 99765345920194942688594n, 'should have correct balance')
    assert.equal(account.nonce, 3963257n, 'should have correct nonce')
    assert.equal(
      bytesToHex(account.storageRoot),
      '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',
      'should have correct storageRoot'
    )
    assert.equal(
      bytesToHex(account.codeHash),
      '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
      'should have correct codeHash'
    )
  })
})
