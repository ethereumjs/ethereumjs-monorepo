import { RLP } from '@ethereumjs/rlp'
import { balSimpleJSON } from '@ethereumjs/testdata'
import type { BALJSONBlockAccessList, PrefixedHexString } from '@ethereumjs/util'
import {
  KECCAK256_NULL,
  bytesToUnprefixedHex,
  createAccount,
  createAddressFromString,
  equalsBytes,
  hexToBigInt,
  hexToBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { assert, describe, it } from 'vitest'

import {
  FlatStateManager,
  MerkleStateManager,
  SimpleStateManager,
  consumeBAL,
  consumeBALBatch,
  mergeBALs,
} from '../src/index.ts'

describe('[StateManager/consumeBAL]: apply block access list', () => {
  it('consumeBAL() applies balance and storage changes from balSimpleJSON', async () => {
    const sm = new MerkleStateManager()
    const bal = balSimpleJSON.filter(
      (entry) =>
        entry.balanceChanges.length > 0 ||
        entry.storageChanges.length > 0 ||
        entry.nonceChanges.length > 0,
    ) as BALJSONBlockAccessList

    await consumeBAL(sm, bal)

    const balanceAddr = createAddressFromString('0x2adc25665018aa1fe0e6bc666dac8fc2697ff9ba')
    const balanceAccount = await sm.getAccount(balanceAddr)
    assert.strictEqual(balanceAccount?.balance, hexToBigInt('0x01ec30'))

    const storageAddr = createAddressFromString('0x0000f90827f1c53a10cb7a02335b175320002935')
    const storage = await sm.getStorage(storageAddr, setLengthLeft(hexToBytes('0x00'), 32))
    const expectedStorage = setLengthLeft(
      hexToBytes('0x372103e56664908ceaa2479eae7f3e852363b920a2ee7a19559b0a2035ba3d21'),
      32,
    )
    assert.isTrue(equalsBytes(storage, expectedStorage))
  })

  it('consumeBAL() deletes empty EIP-161 accounts on SimpleStateManager', async () => {
    const sm = new SimpleStateManager()
    const address = createAddressFromString('0x000000000000000000000000000000000000dead')
    await sm.putAccount(address, createAccount({ balance: 1n }))

    await consumeBAL(sm, [
      {
        address: address.toString() as PrefixedHexString,
        nonceChanges: [],
        balanceChanges: [{ blockAccessIndex: '0x00', postBalance: '0x00' }],
        codeChanges: [],
        storageChanges: [],
        storageReads: [],
      },
    ])

    assert.isUndefined(await sm.getAccount(address))
  })

  it('FlatStateManager.consumeBAL() applies balance and storage changes from balSimpleJSON', async () => {
    const sm = new FlatStateManager()
    const bal = balSimpleJSON.filter(
      (entry) =>
        entry.balanceChanges.length > 0 ||
        entry.storageChanges.length > 0 ||
        entry.nonceChanges.length > 0,
    ) as BALJSONBlockAccessList

    await sm.consumeBAL(bal)

    const balanceAddr = createAddressFromString('0x2adc25665018aa1fe0e6bc666dac8fc2697ff9ba')
    const balanceAccount = await sm.getAccount(balanceAddr)
    assert.strictEqual(balanceAccount?.balance, hexToBigInt('0x01ec30'))
  })

  it('FlatStateManager.consumeBAL() deletes empty EIP-161 accounts', async () => {
    const sm = new FlatStateManager()
    const address = createAddressFromString('0x000000000000000000000000000000000000dead')
    await sm.putAccount(address, createAccount({ balance: 1n }))

    await consumeBAL(sm, [
      {
        address: address.toString() as PrefixedHexString,
        nonceChanges: [],
        balanceChanges: [{ blockAccessIndex: '0x00', postBalance: '0x00' }],
        codeChanges: [],
        storageChanges: [],
        storageReads: [],
      },
    ])

    assert.isUndefined(await sm.getAccount(address))
  })

  it('consumeBAL() skips accounts when shouldApplyAccount returns false', async () => {
    const sm = new FlatStateManager()
    const balanceAddr = createAddressFromString('0x2adc25665018aa1fe0e6bc666dac8fc2697ff9ba')
    const otherAddr = createAddressFromString('0x0000f90827f1c53a10cb7a02335b175320002935')
    const bal = balSimpleJSON.filter(
      (entry) =>
        entry.balanceChanges.length > 0 ||
        entry.storageChanges.length > 0 ||
        entry.nonceChanges.length > 0,
    ) as BALJSONBlockAccessList

    await sm.consumeBAL(bal, {
      shouldApplyAccount: (addr) => addr.equals(balanceAddr),
    })

    assert.isDefined(await sm.getAccount(balanceAddr))
    const skippedStorage = await sm.getStorage(otherAddr, setLengthLeft(hexToBytes('0x00'), 32))
    assert.strictEqual(skippedStorage.length, 0)
  })

  it('FlatStateManager.consumeBAL() does not pin read-only BAL touches', async () => {
    const sm = new FlatStateManager({ maxResidentAccounts: 1 })
    const mutated = createAddressFromString('0x2adc25665018aa1fe0e6bc666dac8fc2697ff9ba')
    const readOnly = createAddressFromString('0x0000000000000000000000000000000000000001')
    await sm.putAccount(readOnly, createAccount({ balance: 1n }))
    await sm.putAccount(mutated, createAccount({ balance: 1n }))

    await sm.consumeBAL([
      {
        address: readOnly.toString() as PrefixedHexString,
        nonceChanges: [],
        balanceChanges: [],
        codeChanges: [],
        storageChanges: [],
        storageReads: [],
      },
      {
        address: mutated.toString() as PrefixedHexString,
        nonceChanges: [],
        balanceChanges: [{ blockAccessIndex: '0x00', postBalance: '0x02' }],
        codeChanges: [],
        storageChanges: [],
        storageReads: [],
      },
    ])

    assert.strictEqual((await sm.getAccount(mutated))?.balance, 2n)
    assert.isDefined(await sm.getAccount(readOnly))
  })

  it('mergeBALs() keeps the latest post-value per field across two blocks', () => {
    const addr = '0x00000000000000000000000000000000000000aa' as PrefixedHexString
    const slot = '0x01' as PrefixedHexString
    const merged = mergeBALs([
      [
        {
          address: addr,
          balanceChanges: [{ blockAccessIndex: '0x00', postBalance: '0x01' }],
          nonceChanges: [],
          codeChanges: [],
          storageChanges: [
            {
              slot,
              slotChanges: [{ blockAccessIndex: '0x00', postValue: '0x0a' }],
            },
          ],
          storageReads: [],
        },
      ],
      [
        {
          address: addr,
          balanceChanges: [{ blockAccessIndex: '0x00', postBalance: '0x02' }],
          nonceChanges: [],
          codeChanges: [],
          storageChanges: [
            {
              slot,
              slotChanges: [{ blockAccessIndex: '0x00', postValue: '0x0b' }],
            },
          ],
          storageReads: [],
        },
      ],
    ])
    assert.equal(merged.length, 1)
    assert.equal(merged[0]!.balanceChanges[0]!.postBalance, '0x02')
    assert.equal(merged[0]!.storageChanges[0]!.slotChanges[0]!.postValue, '0x0b')
  })

  it('mergeBALs() clears storage on mid-batch EIP-161 empty touch', () => {
    const addr = '0x00000000000000000000000000000000000000bb' as PrefixedHexString
    const slot = '0x02' as PrefixedHexString
    const merged = mergeBALs([
      [
        {
          address: addr,
          balanceChanges: [{ blockAccessIndex: '0x00', postBalance: '0x01' }],
          nonceChanges: [],
          codeChanges: [],
          storageChanges: [
            {
              slot,
              slotChanges: [{ blockAccessIndex: '0x00', postValue: '0x0c' }],
            },
          ],
          storageReads: [],
        },
      ],
      [
        {
          address: addr,
          balanceChanges: [{ blockAccessIndex: '0x00', postBalance: '0x00' }],
          nonceChanges: [{ blockAccessIndex: '0x00', postNonce: '0x00' }],
          codeChanges: [],
          storageChanges: [],
          storageReads: [],
        },
      ],
    ])
    assert.equal(merged.length, 1)
    assert.equal(merged[0]!.balanceChanges[0]!.postBalance, '0x00')
    assert.equal(merged[0]!.storageChanges.length, 0)
  })

  it('mergeBALs() preserves storage writes when a subsequent block has a read-only touch or balance-only zero', () => {
    const addr = '0x00000000000000000000000000000000000000cc' as PrefixedHexString
    const slot = '0x05' as PrefixedHexString
    const merged = mergeBALs([
      [
        {
          address: addr,
          balanceChanges: [],
          nonceChanges: [],
          codeChanges: [],
          storageChanges: [
            {
              slot,
              slotChanges: [{ blockAccessIndex: '0x00', postValue: '0x42' }],
            },
          ],
          storageReads: [],
        },
      ],
      [
        {
          address: addr,
          balanceChanges: [],
          nonceChanges: [],
          codeChanges: [],
          storageChanges: [],
          storageReads: [slot],
        },
      ],
    ])
    assert.equal(merged.length, 1)
    assert.equal(merged[0]!.storageChanges.length, 1)
    assert.equal(merged[0]!.storageChanges[0]!.slotChanges[0]!.postValue, '0x42')
  })

  it('consumeBALBatch() matches sequential consumeBAL on MerkleStateManager', async () => {
    const addr = '0x2adc25665018aa1fe0e6bc666dac8fc2697ff9ba' as PrefixedHexString
    const balA: BALJSONBlockAccessList = [
      {
        address: addr,
        balanceChanges: [{ blockAccessIndex: '0x00', postBalance: '0x01ec30' }],
        nonceChanges: [],
        codeChanges: [],
        storageChanges: [],
        storageReads: [],
      },
    ]
    const balB: BALJSONBlockAccessList = balSimpleJSON.filter(
      (entry) => entry.storageChanges.length > 0,
    ) as BALJSONBlockAccessList

    const seq = new MerkleStateManager()
    await seq.consumeBAL(balA)
    await seq.consumeBAL(balB)

    const batch = new MerkleStateManager()
    await consumeBALBatch(batch, [balA, balB])

    const balanceAddr = createAddressFromString(addr)
    assert.strictEqual(
      (await seq.getAccount(balanceAddr))?.balance,
      (await batch.getAccount(balanceAddr))?.balance,
    )
    const storageAddr = createAddressFromString('0x0000f90827f1c53a10cb7a02335b175320002935')
    const seqStorage = await seq.getStorage(storageAddr, setLengthLeft(hexToBytes('0x00'), 32))
    const batchStorage = await batch.getStorage(storageAddr, setLengthLeft(hexToBytes('0x00'), 32))
    assert.isTrue(equalsBytes(seqStorage, batchStorage))
  })

  it('MerkleStateManager.consumeBAL() throws when expected state root does not match', async () => {
    const sm = new MerkleStateManager()
    const wrongRoot = hexToBytes(('0x' + '11'.repeat(32)) as PrefixedHexString)

    try {
      await sm.consumeBAL([], wrongRoot)
      assert.fail('should throw on state root mismatch')
    } catch (e: unknown) {
      assert.match((e as Error).message, /Expected state root/)
    }
  })

  it('FlatStateManager.consumeBALBatch() clears codeHash to KECCAK256_NULL on empty codeChanges (EIP-7702) and deletes zeroed storage slots', async () => {
    const sm = new FlatStateManager()
    const address = createAddressFromString('0x0000000000000000000000000000000000007702')
    const slotKey = setLengthLeft(hexToBytes('0x07'), 32)
    const setRlp = RLP.encode([
      [
        address.bytes,
        [[slotKey, [[new Uint8Array([1]), hexToBytes('0x42')]]]],
        [],
        [[new Uint8Array([1]), hexToBytes('0x0a')]],
        [[new Uint8Array([1]), hexToBytes('0x01')]],
        [[new Uint8Array([1]), hexToBytes('0xef0100112233')]],
      ],
    ])
    await sm.consumeBAL(setRlp)
    const afterSet = await sm.getAccount(address)
    assert.isDefined(afterSet)
    assert.isFalse(equalsBytes(afterSet!.codeHash, KECCAK256_NULL))
    assert.isTrue(
      equalsBytes(await sm.getStorage(address, slotKey), setLengthLeft(hexToBytes('0x42'), 32)),
    )

    const clearRlp = RLP.encode([
      [
        address.bytes,
        [[slotKey, [[new Uint8Array([1]), new Uint8Array(0)]]]],
        [],
        [],
        [],
        [[new Uint8Array([1]), new Uint8Array(0)]],
      ],
    ])
    await sm.consumeBALBatch([setRlp, clearRlp])
    const afterClear = await sm.getAccount(address)
    assert.isDefined(afterClear)
    assert.isTrue(equalsBytes(afterClear!.codeHash, KECCAK256_NULL))
    assert.equal((await sm.getStorage(address, slotKey)).length, 0)
  })

  it('FlatStateManager.consumeBALBatch() skips storage-only cold lookups and preserves hydrated cold misses', async () => {
    const lookedUp: string[] = []
    const sm = new FlatStateManager({
      coldAccountLookup: () => undefined,
      coldAccountBatchLookup: async (hashes) => {
        const out = new Map<string, Uint8Array | undefined>()
        for (const h of hashes) {
          const hex = bytesToUnprefixedHex(h)
          lookedUp.push(hex)
          out.set(hex, undefined)
        }
        return out
      },
    })
    const mutatedAddr = createAddressFromString('0x0000000000000000000000000000000000000011')
    const storageOnlyAddr = createAddressFromString('0x0000000000000000000000000000000000000022')
    const preHydratedAddr = createAddressFromString('0x0000000000000000000000000000000000000033')
    const preHydratedHash = keccak_256(preHydratedAddr.bytes)
    sm.hydrateColdAccountsBatch(new Map([[bytesToUnprefixedHex(preHydratedHash), undefined]]))

    await sm.consumeBAL([
      {
        address: mutatedAddr.toString() as PrefixedHexString,
        balanceChanges: [{ blockAccessIndex: '0x00', postBalance: '0x01' }],
        nonceChanges: [],
        codeChanges: [],
        storageChanges: [],
        storageReads: [],
      },
      {
        address: storageOnlyAddr.toString() as PrefixedHexString,
        balanceChanges: [],
        nonceChanges: [],
        codeChanges: [],
        storageChanges: [
          {
            slot: '0x01' as PrefixedHexString,
            slotChanges: [{ blockAccessIndex: '0x00', postValue: '0x99' }],
          },
        ],
        storageReads: [],
      },
      {
        address: preHydratedAddr.toString() as PrefixedHexString,
        balanceChanges: [{ blockAccessIndex: '0x00', postBalance: '0x02' }],
        nonceChanges: [],
        codeChanges: [],
        storageChanges: [],
        storageReads: [],
      },
    ])

    assert.deepEqual(lookedUp, [bytesToUnprefixedHex(keccak_256(mutatedAddr.bytes))])
  })
})
