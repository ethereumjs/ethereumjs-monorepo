import { RLP } from '@ethereumjs/rlp'
import { balSimpleRLP } from '@ethereumjs/testdata'
import { assert, describe, it } from 'vitest'
import {
  compactBinaryToJSON,
  createBlockLevelAccessListFromRLP,
  decodeBALToBinary,
  extractBALMutatedAddresses,
  hashBlockAccessListRLP,
  mergeBALsBinary,
  validateBlockAccessListHashFromRLP,
} from '../../src/bal/index.ts'
import { hexToBytes } from '../../src/bytes.ts'

describe('[Util/BAL]: binary wire helpers', () => {
  it('hashBlockAccessListRLP() matches createBlockLevelAccessListFromRLP().hash()', () => {
    const rlp = hexToBytes(balSimpleRLP)
    const bal = createBlockLevelAccessListFromRLP(rlp)
    assert.deepEqual(hashBlockAccessListRLP(rlp), bal.hash())
    validateBlockAccessListHashFromRLP(rlp, bal.hash())
  })

  it('custom keccak256Fn is used for wire hash', () => {
    const rlp = hexToBytes(balSimpleRLP)
    let called = 0
    const stub = (data: Uint8Array) => {
      called++
      return new Uint8Array(32).fill(called as number)
    }
    hashBlockAccessListRLP(rlp, stub)
    assert.equal(called, 1)
  })

  it('mutating BlockLevelAccessList drops wire cache', () => {
    const rlp = hexToBytes(balSimpleRLP)
    const bal = createBlockLevelAccessListFromRLP(rlp)
    assert.deepEqual(bal.serialize(), rlp)
    bal.addStorageRead('0x0000000000000000000000000000000000000001', hexToBytes('0x01'))
    assert.notDeepEqual(bal.serialize(), rlp)
  })
})

describe('[Util/BAL]: mergeBALsBinary', () => {
  const addr = '0x00000000000000000000000000000000000000aa'
  const slot = '0x0000000000000000000000000000000000000000000000000000000000000001'

  it('keeps the latest post-value per field across two blocks', () => {
    const merged = mergeBALsBinary([
      [
        {
          address: addr,
          balanceChanges: [{ blockAccessIndex: '0x00', postBalance: '0x64' }],
          nonceChanges: [],
          codeChanges: [],
          storageChanges: [
            {
              slot,
              slotChanges: [{ blockAccessIndex: '0x00', postValue: '0x01' }],
            },
          ],
          storageReads: [],
        },
      ],
      [
        {
          address: addr,
          balanceChanges: [{ blockAccessIndex: '0x00', postBalance: '0xc8' }],
          nonceChanges: [],
          codeChanges: [],
          storageChanges: [
            {
              slot,
              slotChanges: [{ blockAccessIndex: '0x00', postValue: '0x02' }],
            },
          ],
          storageReads: [],
        },
      ],
    ])
    assert.equal(merged.length, 1)
    assert.equal(merged[0]!.storageChanges.length, 1)
  })

  it('extractBALMutatedAddresses() deduplicates across inputs', () => {
    const addresses = extractBALMutatedAddresses([
      [
        {
          address: addr,
          balanceChanges: [{ blockAccessIndex: '0x00', postBalance: '0x01' }],
          nonceChanges: [],
          codeChanges: [],
          storageChanges: [],
          storageReads: [],
        },
      ],
      [
        {
          address: addr,
          balanceChanges: [{ blockAccessIndex: '0x00', postBalance: '0x02' }],
          nonceChanges: [],
          codeChanges: [],
          storageChanges: [],
          storageReads: [],
        },
      ],
    ])
    assert.equal(addresses.length, 1)
  })

  it('preserves empty codeChanges (EIP-7702 delegation clear) across RLP, JSON, and merge', () => {
    const addrBytes = hexToBytes(addr)
    const setCodeRlp = RLP.encode([
      [addrBytes, [], [], [], [], [[new Uint8Array([1]), hexToBytes('0xef0100112233')]]],
    ])
    const clearCodeRlp = RLP.encode([
      [addrBytes, [], [], [], [], [[new Uint8Array([1]), new Uint8Array(0)]]],
    ])

    const decodedClear = decodeBALToBinary(clearCodeRlp)
    assert.equal(decodedClear.length, 1)
    assert.isDefined(decodedClear[0]!.code)
    assert.equal(decodedClear[0]!.code!.length, 0)

    const mergedRlp = mergeBALsBinary([setCodeRlp, clearCodeRlp])
    assert.equal(mergedRlp.length, 1)
    assert.isDefined(mergedRlp[0]!.code)
    assert.equal(mergedRlp[0]!.code!.length, 0)

    const jsonBack = compactBinaryToJSON(mergedRlp)
    assert.equal(jsonBack[0]!.codeChanges.length, 1)
    assert.equal(jsonBack[0]!.codeChanges[0]!.newCode, '0x')

    const mergedJSON = mergeBALsBinary([
      [
        {
          address: addr,
          balanceChanges: [],
          nonceChanges: [],
          codeChanges: [{ blockAccessIndex: '0x01', newCode: '0xef0100112233' }],
          storageChanges: [],
          storageReads: [],
        },
      ],
      [
        {
          address: addr,
          balanceChanges: [],
          nonceChanges: [],
          codeChanges: [{ blockAccessIndex: '0x01', newCode: '0x' }],
          storageChanges: [],
          storageReads: [],
        },
      ],
    ])
    assert.isDefined(mergedJSON[0]!.code)
    assert.equal(mergedJSON[0]!.code!.length, 0)
  })
})
