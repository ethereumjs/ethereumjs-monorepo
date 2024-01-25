import { Block } from '@ethereumjs/block'
import { Common } from '@ethereumjs/common'
import { Address, bytesToHex } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'
import { getStem } from '@ethereumjs/verkle'

import { StatelessVerkleStateManager } from '../src/index.js'

import * as testnetVerkleKaustinen from './testdata/testnetVerkleKaustinen.json'
import * as verkleBlockJSON from './testdata/verkleKaustinenBlock.json'
import { hexToBytes } from '@ethereumjs/util'
import { bytesToBigInt } from '@ethereumjs/util'
import { Account } from '@ethereumjs/util'
import { randomBytes } from '@ethereumjs/util'

describe('StatelessVerkleStateManager: Kaustinen Verkle Block', () => {
  const common = Common.fromGethGenesis(testnetVerkleKaustinen, {
    chain: 'customChain',
    eips: [6800],
  })
  const block = Block.fromBlockData(verkleBlockJSON, { common })

  it('initPreState()', async () => {
    const stateManager = new StatelessVerkleStateManager()
    stateManager.initVerkleExecutionWitness(block.executionWitness)

    assert.ok(Object.keys(stateManager['_state']).length !== 0, 'should initialize with state')
  })

  it('getAccount()', async () => {
    const stateManager = new StatelessVerkleStateManager({ common })
    stateManager.initVerkleExecutionWitness(block.executionWitness)

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

  it('putAccount()', async () => {
    const stateManager = new StatelessVerkleStateManager({ common })
    stateManager.initVerkleExecutionWitness(block.executionWitness)

    const address = Address.fromString(bytesToHex(randomBytes(20)))
    const account = new Account()
    await stateManager.putAccount(address, account)

    let check = await stateManager.getAccount(address)
    assert.deepEqual(check, account, 'should return correct account')

    await stateManager.deleteAccount(address)

    check = await stateManager.getAccount(address)
    assert.deepEqual(check, undefined, 'should return undefined for deleted account')
  })

  // let key = stateManager.getTreeKeyForVersion(stem)
  // console.log(key)

  // key = stateManager.getTreeKeyForCodeSize(stem)
  // console.log(key)

  // key = stateManager.getTreeKeyForCodeChunk(stem, 0)
  // console.log(key)

  it('getTreeKeyFor* functions', async () => {
    const stateManager = new StatelessVerkleStateManager({ common })
    stateManager.initVerkleExecutionWitness(block.executionWitness)

    const address = Address.fromString('0x9791ded6e5d3d5dafca71bb7bb2a14187d17e32e')
    const stem = getStem(address, 0)

    const balanceKey = stateManager.getTreeKeyForBalance(stem)
    const nonceKey = stateManager.getTreeKeyForNonce(stem)
    const codeHashKey = stateManager.getTreeKeyForCodeHash(stem)

    const balanceRaw = stateManager._state[bytesToHex(balanceKey)]
    const nonceRaw = stateManager._state[bytesToHex(nonceKey)]
    const codeHash = stateManager._state[bytesToHex(codeHashKey)]

    const account = await stateManager.getAccount(address)

    assert.equal(
      account.balance,
      bytesToBigInt(hexToBytes(balanceRaw), true),
      'should have correct balance'
    )
    assert.equal(
      account.nonce,
      bytesToBigInt(hexToBytes(nonceRaw), true),
      'should have correct nonce'
    )
    assert.equal(bytesToHex(account.codeHash), codeHash, 'should have correct codeHash')
  })

  // TODO need to execute block that touches 4242... address to have state available
  // it('getContractCode()', async () => {
  //   const stateManager = new StatelessVerkleStateManager({ common })
  //   stateManager.initVerkleExecutionWitness(block.executionWitness)

  //   const contractAddress = Address.fromString('0x4242424242424242424242424242424242424242')
  //   const contractCode = await stateManager.getContractCode(contractAddress)
  //   const expectedCode = testnetVerkleKaustinen.alloc['0x4242424242424242424242424242424242424242'].code

  //   assert.equal(bytesToHex(contractCode), expectedCode)
  // })

  // it('getContractStorage()', async () => {
  //   const stateManager = new StatelessVerkleStateManager({ common })
  //   stateManager.initVerkleExecutionWitness(block.executionWitness)

  //   const contractAddress = Address.fromString('0x4242424242424242424242424242424242424242')
  //   const storageKey = "0x0000000000000000000000000000000000000000000000000000000000000022"
  //   const contractStorage = await stateManager.getContractStorage(contractAddress, hexToBytes(storageKey))
  //   const expectedStorage = testnetVerkleKaustinen.alloc['0x4242424242424242424242424242424242424242']['storage'][storageKey]

  //   assert.equal(bytesToHex(contractStorage), expectedStorage)
  // })
})
