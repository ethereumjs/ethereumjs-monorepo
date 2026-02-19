import { assert, describe, it } from 'vitest'

import {
  type BALJSONBlockAccessList,
  BlockLevelAccessList,
  createBlockLevelAccessList,
  createBlockLevelAccessListFromJSON,
  createBlockLevelAccessListFromRLP,
} from '../src/bal.ts'
import { bytesToHex, hexToBytes } from '../src/bytes.ts'
import { KECCAK256_RLP_ARRAY_S } from '../src/constants.ts'
import bal_2c_empty from './testdata/bal/bal_2c_empty.json' with { type: 'json' }
import bal_2c_simple from './testdata/bal/bal_2c_simple.json' with { type: 'json' }
import bal_2c_with_code from './testdata/bal/bal_2c_with_code.json' with { type: 'json' }

// ====================================================================
// Tests for Proposal 2c: Decoupled Access Map + State Diff
// ====================================================================

describe('Basic initialization', () => {
  it('should create an empty access list', () => {
    const bal = createBlockLevelAccessList()
    assert.isNotNull(bal)
    assert.equal(bal.accessMap.length, 0)
    assert.equal(bal.stateDiff.size, 0)
    assert.equal(bal.currentPhase, 0)
  })

  it('empty BAL should hash to keccak256 of RLP-encoded empty list', () => {
    const bal = createBlockLevelAccessList()
    const json = bal.toJSON()
    assert.deepEqual(json, { accessMap: [], stateDiff: [] })
  })
})

describe('Access tracking (Rule 1: append-only)', () => {
  it('should track addresses in the current phase', () => {
    const bal = createBlockLevelAccessList()
    bal.setPhase(0)
    bal.trackAddress('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    bal.trackAddress('0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')

    assert.equal(bal.accessMap.length, 1)
    assert.equal(bal.accessMap[0].addresses.size, 2)
    assert.isTrue(bal.accessMap[0].addresses.has('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'))
    assert.isTrue(bal.accessMap[0].addresses.has('0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'))
  })

  it('should track addresses across multiple phases', () => {
    const bal = createBlockLevelAccessList()
    bal.setPhase(0)
    bal.trackAddress('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    bal.setPhase(1)
    bal.trackAddress('0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')
    bal.setPhase(2)
    bal.trackAddress('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    bal.trackAddress('0xcccccccccccccccccccccccccccccccccccccccc')

    assert.equal(bal.accessMap.length, 3)
    assert.equal(bal.accessMap[0].addresses.size, 1)
    assert.equal(bal.accessMap[1].addresses.size, 1)
    assert.equal(bal.accessMap[2].addresses.size, 2)
  })

  it('should deduplicate addresses within the same phase', () => {
    const bal = createBlockLevelAccessList()
    bal.setPhase(0)
    bal.trackAddress('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    bal.trackAddress('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    bal.trackAddress('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')

    assert.equal(bal.accessMap[0].addresses.size, 1)
  })

  it('should track storage slots', () => {
    const bal = createBlockLevelAccessList()
    bal.setPhase(0)
    bal.trackStorageSlot('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '0x01')
    bal.trackStorageSlot('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '0x02')

    const slots = bal.accessMap[0].storageSlots.get('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    assert.isNotNull(slots)
    assert.equal(slots!.size, 2)
    assert.isTrue(slots!.has('0x01'))
    assert.isTrue(slots!.has('0x02'))
  })

  it('should implicitly track the address when tracking a slot', () => {
    const bal = createBlockLevelAccessList()
    bal.setPhase(0)
    bal.trackStorageSlot('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '0x01')

    assert.isTrue(bal.accessMap[0].addresses.has('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'))
  })

  it('should accept Uint8Array storage keys', () => {
    const bal = createBlockLevelAccessList()
    bal.setPhase(0)
    bal.trackStorageSlot(
      '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      hexToBytes('0x0000000000000000000000000000000000000000000000000000000000000001'),
    )

    const slots = bal.accessMap[0].storageSlots.get('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    assert.isNotNull(slots)
    assert.isTrue(slots!.has('0x01'))
  })

  it('should filter out system address', () => {
    const bal = createBlockLevelAccessList()
    bal.setPhase(0)
    bal.trackAddress('0xfffffffffffffffffffffffffffffffffffffffe')
    bal.trackAddress('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')

    assert.equal(bal.accessMap[0].addresses.size, 1)
    assert.isFalse(bal.accessMap[0].addresses.has('0xfffffffffffffffffffffffffffffffffffffffe'))
  })

  it('should create empty intermediate phases when skipping', () => {
    const bal = createBlockLevelAccessList()
    bal.setPhase(3)
    bal.trackAddress('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')

    assert.equal(bal.accessMap.length, 4)
    assert.equal(bal.accessMap[0].addresses.size, 0)
    assert.equal(bal.accessMap[1].addresses.size, 0)
    assert.equal(bal.accessMap[2].addresses.size, 0)
    assert.equal(bal.accessMap[3].addresses.size, 1)
  })
})

describe('State diff (Rule 2: post-block comparison)', () => {
  it('should record storage diffs', () => {
    const bal = createBlockLevelAccessList()
    bal.setStorageDiff('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '0x01', hexToBytes('0xff'))

    const diff = bal.stateDiff.get('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    assert.isNotNull(diff)
    assert.equal(diff!.storageDiffs.size, 1)
    assert.deepEqual(bytesToHex(diff!.storageDiffs.get('0x01')!), '0xff')
  })

  it('should overwrite previous storage diff for same slot', () => {
    const bal = createBlockLevelAccessList()
    bal.setStorageDiff('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '0x01', hexToBytes('0xaa'))
    bal.setStorageDiff('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '0x01', hexToBytes('0xbb'))

    const diff = bal.stateDiff.get('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    assert.equal(diff!.storageDiffs.size, 1)
    assert.deepEqual(bytesToHex(diff!.storageDiffs.get('0x01')!), '0xbb')
  })

  it('should record balance diff', () => {
    const bal = createBlockLevelAccessList()
    bal.setBalanceDiff('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 1000n)

    const diff = bal.stateDiff.get('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    assert.equal(diff!.balance, '0x03e8')
  })

  it('should record nonce diff', () => {
    const bal = createBlockLevelAccessList()
    bal.setNonceDiff('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 5n)

    const diff = bal.stateDiff.get('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    assert.equal(diff!.nonce, '0x05')
  })

  it('should record code diff', () => {
    const bal = createBlockLevelAccessList()
    const code = hexToBytes('0x6080604052')
    bal.setCodeDiff('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', code)

    const diff = bal.stateDiff.get('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    assert.deepEqual(bytesToHex(diff!.code!), '0x6080604052')
  })

  it('should aggregate multiple fields for the same address', () => {
    const bal = createBlockLevelAccessList()
    bal.setBalanceDiff('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 100n)
    bal.setNonceDiff('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 1n)
    bal.setStorageDiff('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '0x01', hexToBytes('0xff'))

    const diff = bal.stateDiff.get('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    assert.equal(diff!.balance, '0x64')
    assert.equal(diff!.nonce, '0x01')
    assert.equal(diff!.storageDiffs.size, 1)
  })
})

describe('JSON', () => {
  it('should load from JSON (simple)', () => {
    const bal = createBlockLevelAccessListFromJSON(bal_2c_simple as BALJSONBlockAccessList)
    assert.isNotNull(bal)
    assert.equal(bal.accessMap.length, 3)
    assert.equal(bal.stateDiff.size, 6)
  })

  it('should load from JSON (with code)', () => {
    const bal = createBlockLevelAccessListFromJSON(bal_2c_with_code as BALJSONBlockAccessList)
    assert.isNotNull(bal)
    assert.equal(bal.accessMap.length, 2)

    const codeDiff = bal.stateDiff.get('0x0c7dcbd9e1c8f0cafb629cd4251570cd9c8c8ad2')
    assert.isNotNull(codeDiff)
    assert.isNotNull(codeDiff!.code)
    assert.equal(bytesToHex(codeDiff!.code!), '0xef0100bf0980440e98d1dc6ef4714a120302d7229671d9')
    assert.equal(codeDiff!.nonce, '0x01')
  })

  it('should load from JSON (empty block)', () => {
    const bal = createBlockLevelAccessListFromJSON(bal_2c_empty as BALJSONBlockAccessList)
    assert.isNotNull(bal)
    assert.equal(bal.accessMap.length, 1)
    assert.equal(bal.stateDiff.size, 1)
  })

  it('toJSON() roundtrip: JSON -> internal -> toJSON()', () => {
    let bal = createBlockLevelAccessListFromJSON(bal_2c_simple as BALJSONBlockAccessList)
    assert.deepEqual(bal.toJSON(), bal_2c_simple as BALJSONBlockAccessList)

    bal = createBlockLevelAccessListFromJSON(bal_2c_with_code as BALJSONBlockAccessList)
    assert.deepEqual(bal.toJSON(), bal_2c_with_code as BALJSONBlockAccessList)

    bal = createBlockLevelAccessListFromJSON(bal_2c_empty as BALJSONBlockAccessList)
    assert.deepEqual(bal.toJSON(), bal_2c_empty as BALJSONBlockAccessList)
  })

  it('should map JSON fields to internal types correctly', () => {
    const bal = createBlockLevelAccessListFromJSON(bal_2c_simple as BALJSONBlockAccessList)

    // Phase 0: system contracts with storage
    const phase0 = bal.accessMap[0]
    assert.isTrue(phase0.addresses.has('0x0000f90827f1c53a10cb7a02335b175320002935'))
    assert.isTrue(phase0.addresses.has('0x000f3df6d732807ef1319fb7b8bb8522d0beac02'))
    const systemSlots = phase0.storageSlots.get('0x000f3df6d732807ef1319fb7b8bb8522d0beac02')
    assert.isNotNull(systemSlots)
    assert.isTrue(systemSlots!.has('0x0c'))
    assert.isTrue(systemSlots!.has('0x200b'))

    // Phase 1: tx 1 addresses
    const phase1 = bal.accessMap[1]
    assert.isTrue(phase1.addresses.has('0xf5ffa27864bf419390eaa7c520b528a740c594de'))
    assert.isTrue(phase1.addresses.has('0x2adc25665018aa1fe0e6bc666dac8fc2697ff9ba'))

    // State diff: coinbase balance
    const coinbaseDiff = bal.stateDiff.get('0x2adc25665018aa1fe0e6bc666dac8fc2697ff9ba')
    assert.isNotNull(coinbaseDiff)
    assert.equal(coinbaseDiff!.balance, '0x01ec30')

    // State diff: sender nonce + balance
    const senderDiff = bal.stateDiff.get('0xf5ffa27864bf419390eaa7c520b528a740c594de')
    assert.isNotNull(senderDiff)
    assert.equal(senderDiff!.nonce, '0x01')
    assert.equal(senderDiff!.balance, '0x3635c9adc5de9ccba6')
  })

  it('toJSON() should produce sorted output', () => {
    const bal = createBlockLevelAccessList()
    bal.setPhase(0)
    // Add addresses in reverse order
    bal.trackAddress('0xcccccccccccccccccccccccccccccccccccccccc')
    bal.trackAddress('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    bal.trackAddress('0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')

    // Add state diffs in reverse order
    bal.setBalanceDiff('0xcccccccccccccccccccccccccccccccccccccccc', 300n)
    bal.setBalanceDiff('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 100n)

    const json = bal.toJSON()
    // Addresses within a phase should be sorted
    assert.deepEqual(json.accessMap[0].addresses, [
      '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
      '0xcccccccccccccccccccccccccccccccccccccccc',
    ])
    // State diff should be sorted by address
    assert.equal(json.stateDiff[0].address, '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    assert.equal(json.stateDiff[1].address, '0xcccccccccccccccccccccccccccccccccccccccc')
  })
})

describe('RLP serialization', () => {
  it('serialize() and fromRLP() should roundtrip (simple)', () => {
    const bal = createBlockLevelAccessListFromJSON(bal_2c_simple as BALJSONBlockAccessList)
    const rlp = bal.serialize()
    const restored = createBlockLevelAccessListFromRLP(rlp)
    assert.deepEqual(restored.toJSON(), bal.toJSON())
  })

  it('serialize() and fromRLP() should roundtrip (with code)', () => {
    const bal = createBlockLevelAccessListFromJSON(bal_2c_with_code as BALJSONBlockAccessList)
    const rlp = bal.serialize()
    const restored = createBlockLevelAccessListFromRLP(rlp)
    assert.deepEqual(restored.toJSON(), bal.toJSON())
  })

  it('serialize() and fromRLP() should roundtrip (empty)', () => {
    const bal = createBlockLevelAccessListFromJSON(bal_2c_empty as BALJSONBlockAccessList)
    const rlp = bal.serialize()
    const restored = createBlockLevelAccessListFromRLP(rlp)
    assert.deepEqual(restored.toJSON(), bal.toJSON())
  })

  it('hash should be deterministic', () => {
    const bal1 = createBlockLevelAccessListFromJSON(bal_2c_simple as BALJSONBlockAccessList)
    const bal2 = createBlockLevelAccessListFromJSON(bal_2c_simple as BALJSONBlockAccessList)
    assert.deepEqual(bytesToHex(bal1.hash()), bytesToHex(bal2.hash()))
  })

  it('different data should produce different hashes', () => {
    const bal1 = createBlockLevelAccessListFromJSON(bal_2c_simple as BALJSONBlockAccessList)
    const bal2 = createBlockLevelAccessListFromJSON(bal_2c_empty as BALJSONBlockAccessList)
    assert.notEqual(bytesToHex(bal1.hash()), bytesToHex(bal2.hash()))
  })

  it('serialize() -> fromRLP() -> serialize() should produce identical bytes', () => {
    const bal = createBlockLevelAccessListFromJSON(bal_2c_simple as BALJSONBlockAccessList)
    const rlp1 = bal.serialize()
    const restored = createBlockLevelAccessListFromRLP(rlp1)
    const rlp2 = restored.serialize()
    assert.deepEqual(bytesToHex(rlp1), bytesToHex(rlp2))
  })
})

describe('Programmatic construction', () => {
  it('should build a BAL programmatically and match JSON roundtrip', () => {
    const bal = createBlockLevelAccessList()

    // Phase 0: system contracts
    bal.setPhase(0)
    bal.trackStorageSlot('0x000f3df6d732807ef1319fb7b8bb8522d0beac02', '0x0c')

    // Phase 1: a simple transfer
    bal.setPhase(1)
    bal.trackAddress('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    bal.trackAddress('0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')

    // State diffs
    bal.setStorageDiff('0x000f3df6d732807ef1319fb7b8bb8522d0beac02', '0x0c', hexToBytes('0x0c'))
    bal.setBalanceDiff('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 900n)
    bal.setBalanceDiff('0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', 1100n)
    bal.setNonceDiff('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 1n)

    // Roundtrip through JSON
    const json = bal.toJSON()
    const restored = createBlockLevelAccessListFromJSON(json)
    assert.deepEqual(restored.toJSON(), json)

    // Roundtrip through RLP
    const rlp = bal.serialize()
    const restored2 = createBlockLevelAccessListFromRLP(rlp)
    assert.deepEqual(restored2.toJSON(), json)
  })

  it('should handle zero-value storage diff', () => {
    const bal = createBlockLevelAccessList()
    bal.setStorageDiff('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '0x01', hexToBytes('0x00'))

    const json = bal.toJSON()
    // Zero value is stripped to empty bytes by stripLeadingZeros
    assert.equal(json.stateDiff[0].storageDiffs[0].value, '0x')

    // RLP roundtrip should preserve the zero value
    const rlp = bal.serialize()
    const restored = createBlockLevelAccessListFromRLP(rlp)
    assert.deepEqual(restored.toJSON(), json)
  })

  it('should handle zero balance diff', () => {
    const bal = createBlockLevelAccessList()
    bal.setBalanceDiff('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 0n)

    const diff = bal.stateDiff.get('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    assert.isNotNull(diff)
    assert.equal(diff!.balance, '0x')
  })

  it('should handle multiple storage slots per address in access map', () => {
    const bal = createBlockLevelAccessList()
    bal.setPhase(0)
    bal.trackStorageSlot('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '0x01')
    bal.trackStorageSlot('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '0x02')
    bal.trackStorageSlot('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '0x03')

    const json = bal.toJSON()
    assert.equal(json.accessMap[0].storageSlots[0].slots.length, 3)

    // RLP roundtrip
    const rlp = bal.serialize()
    const restored = createBlockLevelAccessListFromRLP(rlp)
    assert.deepEqual(restored.toJSON(), json)
  })

  it('should handle addresses appearing in access map but not state diff', () => {
    const bal = createBlockLevelAccessList()
    bal.setPhase(0)
    bal.trackAddress('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    // No state diff for this address

    const json = bal.toJSON()
    assert.equal(json.accessMap[0].addresses.length, 1)
    assert.equal(json.stateDiff.length, 0)
  })

  it('should handle addresses appearing in state diff but not access map', () => {
    const bal = createBlockLevelAccessList()
    // Only state diff, no access tracking
    bal.setBalanceDiff('0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 100n)

    const json = bal.toJSON()
    assert.equal(json.accessMap.length, 0)
    assert.equal(json.stateDiff.length, 1)
  })
})

describe('Complete block scenario', () => {
  it('should model a complete block lifecycle', () => {
    const bal = createBlockLevelAccessList()

    // Phase 0: pre-execution (beacon root + block hash system contracts)
    bal.setPhase(0)
    const beaconRoot = '0x000f3df6d732807ef1319fb7b8bb8522d0beac02'
    const blockHash = '0x0000f90827f1c53a10cb7a02335b175320002935'
    bal.trackStorageSlot(beaconRoot, '0x0c')
    bal.trackStorageSlot(beaconRoot, '0x200b')
    bal.trackStorageSlot(blockHash, '0x')

    // Phase 1: tx 1 (Alice sends 10 to Bob)
    bal.setPhase(1)
    const alice = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    const bob = '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
    const coinbase = '0x2adc25665018aa1fe0e6bc666dac8fc2697ff9ba'
    bal.trackAddress(alice)
    bal.trackAddress(bob)
    bal.trackAddress(coinbase)

    // Phase 2: tx 2 (Charlie stores a value)
    bal.setPhase(2)
    const charlie = '0xcccccccccccccccccccccccccccccccccccccccc'
    const contract = '0xdddddddddddddddddddddddddddddddddddddd'
    bal.trackAddress(charlie)
    bal.trackAddress(coinbase)
    bal.trackStorageSlot(contract, '0x01')

    // State diffs (post-block final values)
    bal.setStorageDiff(beaconRoot, '0x0c', hexToBytes('0x0c'))
    bal.setStorageDiff(beaconRoot, '0x200b', hexToBytes('0xdeadbeef'))
    bal.setStorageDiff(
      blockHash,
      '0x',
      hexToBytes('0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'),
    )
    bal.setStorageDiff(contract, '0x01', hexToBytes('0x42'))
    bal.setBalanceDiff(alice, 999990n)
    bal.setNonceDiff(alice, 1n)
    bal.setBalanceDiff(bob, 10n)
    bal.setBalanceDiff(coinbase, 50n)
    bal.setBalanceDiff(charlie, 999950n)
    bal.setNonceDiff(charlie, 1n)

    // Verify structure
    const json = bal.toJSON()
    assert.equal(json.accessMap.length, 3)
    assert.equal(json.accessMap[0].addresses.length, 2) // beaconRoot, blockHash
    assert.equal(json.accessMap[0].storageSlots.length, 2)
    assert.equal(json.accessMap[1].addresses.length, 3) // alice, bob, coinbase
    assert.equal(json.accessMap[2].addresses.length, 3) // charlie, coinbase, contract

    assert.equal(json.stateDiff.length, 7) // all addresses with state changes
    assert.equal(json.stateDiff[0].address, blockHash) // sorted
    assert.equal(json.stateDiff[1].address, beaconRoot)

    // Full roundtrips
    const rlp = bal.serialize()
    const fromRlp = createBlockLevelAccessListFromRLP(rlp)
    assert.deepEqual(fromRlp.toJSON(), json)

    const fromJson = createBlockLevelAccessListFromJSON(json)
    assert.deepEqual(fromJson.toJSON(), json)
    assert.deepEqual(bytesToHex(fromJson.serialize()), bytesToHex(rlp))
  })
})
