import { Block } from '@ethereumjs/block'
import { Common } from '@ethereumjs/common'
import { TransactionFactory } from '@ethereumjs/tx'
import {
  Account,
  Address,
  bytesToBigInt,
  bytesToHex,
  hexToBytes,
  randomBytes,
} from '@ethereumjs/util'
import { getStem } from '@ethereumjs/verkle'
import { loadVerkleCrypto } from 'verkle-cryptography-wasm'
import { assert, beforeAll, describe, it, test } from 'vitest'

import { CacheType, StatelessVerkleStateManager } from '../src/index.js'

import * as testnetVerkleKaustinen from './testdata/testnetVerkleKaustinen.json'
import * as verkleBlockJSON from './testdata/verkleKaustinenBlock.json'

import type { VerkleCrypto } from '@ethereumjs/verkle'

describe('StatelessVerkleStateManager: Kaustinen Verkle Block', () => {
  let verkleCrypto: VerkleCrypto
  beforeAll(async () => {
    verkleCrypto = await loadVerkleCrypto()
  })
  const common = Common.fromGethGenesis(testnetVerkleKaustinen, {
    chain: 'customChain',
    eips: [4895, 6800],
  })
  const decodedTxs = verkleBlockJSON.transactions.map((tx) =>
    TransactionFactory.fromSerializedData(hexToBytes(tx))
  )
  const block = Block.fromBlockData({ ...verkleBlockJSON, transactions: decodedTxs }, { common })

  it('initPreState()', async () => {
    const stateManager = await StatelessVerkleStateManager.create({ verkleCrypto })
    stateManager.initVerkleExecutionWitness(block.header.number, block.executionWitness)

    assert.ok(Object.keys(stateManager['_state']).length !== 0, 'should initialize with state')
  })

  it('getAccount()', async () => {
    const stateManager = await StatelessVerkleStateManager.create({ common, verkleCrypto })
    stateManager.initVerkleExecutionWitness(block.header.number, block.executionWitness)

    const account = await stateManager.getAccount(
      Address.fromString('0x6177843db3138ae69679a54b95cf345ed759450d')
    )

    assert.equal(account!.balance, 724462229558283876n, 'should have correct balance')
    assert.equal(account!.nonce, 700n, 'should have correct nonce')
    assert.equal(account!._storageRoot, null, 'stateroot should have not been set')
    assert.equal(
      bytesToHex(account!.codeHash),
      '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
      'should have correct codeHash'
    )
  })

  it('put/delete/modify account', async () => {
    const stateManager = await StatelessVerkleStateManager.create({ common, verkleCrypto })
    stateManager.initVerkleExecutionWitness(block.header.number, block.executionWitness)

    const address = new Address(randomBytes(20))

    try {
      await stateManager.getAccount(address)
      assert.fail('should throw on getting account that is not found in witness')
    } catch (e: any) {
      assert.equal(
        e.message.slice(0, 25),
        'No witness bundled for ad',
        'should throw on getting account that does not exist in cache and witness'
      )
    }

    const account = Account.fromAccountData({
      nonce: BigInt(2),
    })

    await stateManager.putAccount(address, account)
    assert.deepEqual(
      await stateManager.getAccount(address),
      account,
      'should return correct account'
    )

    await stateManager.modifyAccountFields(address, {
      nonce: BigInt(3),
    })
    account.nonce = BigInt(3)
    assert.deepEqual(
      await stateManager.getAccount(address),
      account,
      'should return correct account'
    )

    await stateManager.deleteAccount(address)

    assert.isUndefined(
      await stateManager.getAccount(address),
      'should return undefined for deleted account'
    )
  })

  it('getTreeKeyFor* functions', async () => {
    const stateManager = await StatelessVerkleStateManager.create({ common, verkleCrypto })
    stateManager.initVerkleExecutionWitness(block.header.number, block.executionWitness)

    const address = Address.fromString('0x6177843db3138ae69679a54b95cf345ed759450d')
    const stem = getStem(stateManager.verkleCrypto, address, 0n)

    const balanceKey = stateManager.getTreeKeyForBalance(stem)
    const nonceKey = stateManager.getTreeKeyForNonce(stem)
    const codeHashKey = stateManager.getTreeKeyForCodeHash(stem)

    const balanceRaw = stateManager['_state'][bytesToHex(balanceKey)]
    const nonceRaw = stateManager['_state'][bytesToHex(nonceKey)]
    const codeHash = stateManager['_state'][bytesToHex(codeHashKey)]

    const account = await stateManager.getAccount(address)

    assert.equal(
      account!.balance,
      bytesToBigInt(hexToBytes(balanceRaw!), true),
      'should have correct balance'
    )
    assert.equal(
      account!.nonce,
      bytesToBigInt(hexToBytes(nonceRaw!), true),
      'should have correct nonce'
    )
    assert.equal(bytesToHex(account!.codeHash), codeHash, 'should have correct codeHash')
  })

  it(`copy()`, async () => {
    const stateManager = new StatelessVerkleStateManager({
      accountCacheOpts: {
        type: CacheType.ORDERED_MAP,
      },
      storageCacheOpts: {
        type: CacheType.ORDERED_MAP,
      },
      common,
      verkleCrypto,
    })
    stateManager.initVerkleExecutionWitness(block.header.number, block.executionWitness)

    const stateManagerCopy = stateManager.shallowCopy() as StatelessVerkleStateManager

    assert.equal(
      (stateManagerCopy as any)['_accountCacheSettings'].type,
      CacheType.ORDERED_MAP,
      'should switch to ORDERED_MAP account cache on copy()'
    )
    assert.equal(
      (stateManagerCopy as any)['_storageCacheSettings'].type,
      CacheType.ORDERED_MAP,
      'should switch to ORDERED_MAP storage cache on copy()'
    )
  })

  // TODO contract storage functions not yet completely implemented
  test.skip('get/put/clear contract storage', async () => {
    const stateManager = await StatelessVerkleStateManager.create({ common, verkleCrypto })
    stateManager.initVerkleExecutionWitness(block.header.number, block.executionWitness)

    const contractAddress = Address.fromString('0x4242424242424242424242424242424242424242')
    const storageKey = '0x0000000000000000000000000000000000000000000000000000000000000022'
    const storageValue = '0xf5a5fd42d16a20302798ef6ed309979b43003d2320d9f0e8ea9831a92759fb4b'
    await stateManager.putContractStorage(
      contractAddress,
      hexToBytes(storageKey),
      hexToBytes(storageValue)
    )
    let contractStorage = await stateManager.getContractStorage(
      contractAddress,
      hexToBytes(storageKey)
    )

    assert.equal(bytesToHex(contractStorage), storageValue)

    await stateManager.clearContractStorage(contractAddress)
    contractStorage = await stateManager.getContractStorage(contractAddress, hexToBytes(storageKey))

    assert.equal(bytesToHex(contractStorage), bytesToHex(new Uint8Array()))
  })
})
