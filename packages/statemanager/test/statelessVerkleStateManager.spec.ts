import { createBlock } from '@ethereumjs/block'
import { createCommonFromGethGenesis } from '@ethereumjs/common'
import { verkleKaustinen6Block72Data, verkleKaustinenGethGenesis } from '@ethereumjs/testdata'
import { createTxFromRLP } from '@ethereumjs/tx'
import {
  Address,
  VerkleLeafType,
  bytesToHex,
  createAccount,
  createAddressFromString,
  decodeVerkleLeafBasicData,
  getVerkleKey,
  getVerkleStem,
  hexToBytes,
  randomBytes,
} from '@ethereumjs/util'
import * as verkle from 'micro-eth-signer/verkle'
import { assert, describe, it, test } from 'vitest'

import { CacheType, Caches, StatelessVerkleStateManager } from '../src/index.ts'

describe('StatelessVerkleStateManager: Kaustinen Verkle Block', () => {
  const common = createCommonFromGethGenesis(verkleKaustinenGethGenesis, {
    chain: 'customChain',
    eips: [2935, 4895, 6800],
    customCrypto: { verkle },
  })

  const decodedTxs = verkleKaustinen6Block72Data.transactions.map((tx) =>
    createTxFromRLP(hexToBytes(tx), { common }),
  )
  const block = createBlock(
    { ...verkleKaustinen6Block72Data, transactions: decodedTxs },
    {
      common,
    },
  )

  it('initPreState()', async () => {
    common.customCrypto.verkle = verkle
    const stateManager = new StatelessVerkleStateManager({ common })
    stateManager.initVerkleExecutionWitness(block.header.number, block.executionWitness)

    assert.isTrue(Object.keys(stateManager['_state']).length !== 0, 'should initialize with state')
  })

  // TODO: Turn back on once we have kaustinen7 data
  it.skip('getAccount()', async () => {
    common.customCrypto.verkle = verkle
    const stateManager = new StatelessVerkleStateManager({ common })
    stateManager.initVerkleExecutionWitness(block.header.number, block.executionWitness)

    const account = await stateManager.getAccount(
      createAddressFromString('0x6177843db3138ae69679a54b95cf345ed759450d'),
    )

    assert.strictEqual(account!.balance, 288610978528114322n, 'should have correct balance')
    assert.strictEqual(account!.nonce, 300n, 'should have correct nonce')
    assert.strictEqual(account!._storageRoot, null, 'stateroot should have not been set')
    assert.strictEqual(
      bytesToHex(account!.codeHash),
      '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
      'should have correct codeHash',
    )
  })

  it('put/delete/modify account', async () => {
    common.customCrypto.verkle = verkle
    const stateManager = new StatelessVerkleStateManager({
      common,
      caches: new Caches(),
    })
    stateManager.initVerkleExecutionWitness(block.header.number, block.executionWitness)

    const address = new Address(randomBytes(20))

    try {
      await stateManager.getAccount(address)
      assert.fail('should throw on getting account that is not found in witness')
    } catch (e: any) {
      assert.strictEqual(
        e.message.slice(0, 25),
        'No witness bundled for ad',
        'should throw on getting account that does not exist in cache and witness',
      )
    }

    const account = createAccount({
      nonce: BigInt(2),
    })

    await stateManager.putAccount(address, account)
    assert.deepEqual(
      await stateManager.getAccount(address),
      account,
      'should return correct account',
    )

    await stateManager.modifyAccountFields(address, {
      nonce: BigInt(3),
    })
    account.nonce = BigInt(3)
    assert.deepEqual(
      await stateManager.getAccount(address),
      account,
      'should return correct account',
    )

    await stateManager.deleteAccount(address)

    assert.isUndefined(
      await stateManager.getAccount(address),
      'should return undefined for deleted account',
    )
  })

  it('getKey function', async () => {
    common.customCrypto.verkle = verkle
    const stateManager = new StatelessVerkleStateManager({ common })
    stateManager.initVerkleExecutionWitness(block.header.number, block.executionWitness)

    const address = createAddressFromString('0x6177843db3138ae69679a54b95cf345ed759450d')
    const stem = getVerkleStem(stateManager.verkleCrypto, address, 0n)

    const basicDataKey = getVerkleKey(stem, VerkleLeafType.BasicData)
    const codeHashKey = getVerkleKey(stem, VerkleLeafType.CodeHash)

    const basicDataRaw = stateManager['_state'][bytesToHex(basicDataKey)]

    const basicData = decodeVerkleLeafBasicData(hexToBytes(basicDataRaw!))

    const codeHash = stateManager['_state'][bytesToHex(codeHashKey)]

    const account = await stateManager.getAccount(address)

    assert.strictEqual(account!.balance, basicData.balance, 'should have correct balance')
    assert.strictEqual(account!.nonce, basicData.nonce, 'should have correct nonce')
    assert.strictEqual(bytesToHex(account!.codeHash), codeHash, 'should have correct codeHash')
  })

  it(`copy()`, async () => {
    common.customCrypto.verkle = verkle
    const stateManager = new StatelessVerkleStateManager({
      caches: new Caches({
        account: {
          type: CacheType.ORDERED_MAP,
        },
        storage: {
          type: CacheType.ORDERED_MAP,
        },
      }),
      common,
    })
    stateManager.initVerkleExecutionWitness(block.header.number, block.executionWitness)

    const stateManagerCopy = stateManager.shallowCopy()

    assert.strictEqual(
      stateManagerCopy['_caches']?.settings.account.type,
      CacheType.ORDERED_MAP,
      'should switch to ORDERED_MAP account cache on copy()',
    )
    assert.strictEqual(
      stateManagerCopy['_caches']?.settings.storage.type,
      CacheType.ORDERED_MAP,
      'should switch to ORDERED_MAP storage cache on copy()',
    )
  })

  // TODO contract storage functions not yet completely implemented
  test.skip('get/put/clear contract storage', async () => {
    common.customCrypto.verkle = verkle
    const stateManager = new StatelessVerkleStateManager({ common })
    stateManager.initVerkleExecutionWitness(block.header.number, block.executionWitness)

    const contractAddress = createAddressFromString('0x4242424242424242424242424242424242424242')
    const storageKey = '0x0000000000000000000000000000000000000000000000000000000000000022'
    const storageValue = '0xf5a5fd42d16a20302798ef6ed309979b43003d2320d9f0e8ea9831a92759fb4b'
    await stateManager.putStorage(contractAddress, hexToBytes(storageKey), hexToBytes(storageValue))
    let contractStorage = await stateManager.getStorage(contractAddress, hexToBytes(storageKey))

    assert.strictEqual(bytesToHex(contractStorage), storageValue)

    await stateManager.clearStorage(contractAddress)
    contractStorage = await stateManager.getStorage(contractAddress, hexToBytes(storageKey))

    assert.strictEqual(bytesToHex(contractStorage), bytesToHex(new Uint8Array()))
  })
})
