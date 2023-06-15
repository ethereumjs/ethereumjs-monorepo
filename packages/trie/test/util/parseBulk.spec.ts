import { bytesToPrefixedHexString, hexStringToBytes } from '@ethereumjs/util'
import debug from 'debug'
import * as tape from 'tape'

import {
  LeafNode,
  Trie,
  bytesToNibbles,
  insertBatch,
  nibblestoBytes,
  parseBulk,
  partitionByCommonPrefix,
} from '../../src'

import * as bulkJSON from './bulkEntries.json'
import * as bulkInput from './bulkInput.json'

import type { BulkNodeInput } from '../../src'

/**
 * Checks if in a karma test runner.
 * @returns boolean whether running in karma
 */
export function isRunningInKarma(): boolean {
  // eslint-disable-next-line no-undef
  return typeof (<any>globalThis).window !== 'undefined' && (<any>globalThis).window.__karma__
}

const _bulkInput: [number[], string][] = bulkInput as [number[], string][]
const _bulkJSON: [string, string][] = bulkJSON as [string, string][]
const _bulkEntries: [number[], Uint8Array][] = _bulkJSON.map(([key, value]) => [
  bytesToNibbles(hexStringToBytes(key)),
  hexStringToBytes(value),
])
const bulkMap = Object.fromEntries(_bulkJSON)
const jsonKeys = _bulkJSON.map(([k, _]) => JSON.stringify(bytesToNibbles(hexStringToBytes(k))))
tape('partitionByCommonPrefix', (t) => {
  const partitions = partitionByCommonPrefix(_bulkInput)
  const total = partitions.reduce((acc, partition) => acc + partition.length, 0)
  t.ok(total >= _bulkInput.length, `partitions include ${total} / ${_bulkInput.length} entries`)
  const bulk = parseBulk(_bulkInput)
  t.equal(
    bulk.length,
    _bulkInput.length,
    `parseBulk has ${bulk.length} / ${_bulkInput.length} entries`
  )
  for (const [i, partition] of partitions.entries()) {
    t.pass(`partition ${i} has ${partition.length} entries`)
  }
  for (const [i, partition] of bulk.entries()) {
    t.pass(`bulk_part ${i} has ${partition.length} entries`)
  }
  const bulkStr = bulk.map(([k, _v]) => {
    return [[k.slice(0, -1), k.slice(-1)[0]], _v]
  })
  for (const [i, [str, _v]] of bulkStr.entries()) {
    const fullNib = (str as any).flat(2)
    const fullHex = bytesToPrefixedHexString(nibblestoBytes(fullNib))
    const value = bulkMap[fullHex]
    const keyIdx = jsonKeys.indexOf(JSON.stringify(fullNib))
    t.equal(
      JSON.stringify(fullNib),
      jsonKeys[keyIdx],
      `[${i}]: should have the same nibbles: ${jsonKeys[keyIdx]}`
    )
    t.equal(
      fullHex,
      _bulkJSON[keyIdx][0],
      `[${i}]: should have the same hex: ${_bulkJSON[keyIdx][0]}`
    )
    t.equal(
      value,
      _bulkJSON[keyIdx][1],
      `[${i}]: should have the same value: ${_bulkJSON[keyIdx][1]}`
    )
  }

  t.end()
})

tape('bulkInsert and insertBatch', async (t) => {
  if (isRunningInKarma()) {
    t.skip('Skipping bulkInsert and insertBatch tests in karma')
    return
  }
  const sample = _bulkJSON
  /**
   * This makes the test take much longer, but can be enabled to ensure that bulkInsert and batchInsert are working
  const control_start = Date.now()
  const control = new Trie({})
  for (const [i, [key, value]] of sample.entries()) {
    control.debug.extend(`BULK TEST`).extend(`[${i + 1} / ${sample.length}]`)(`${key}`)
    await control.put(hexStringToBytes(key), hexStringToBytes(value))
  }
  const control_end = Date.now()
  */
  const bulkInsertInput: [number[], string][] = sample.map(([key, value]) => {
    return [bytesToNibbles(hexStringToBytes(key)), value]
  })
  const bulk_start = Date.now()
  const test = new Trie({})
  await test.bulkInsert(bulkInsertInput)
  const bulk_end = Date.now()
  t.pass(`bulkInsert completed in ${(bulk_end - bulk_start) / 1000} seconds`)
  const batch_start = Date.now()
  const batchInsert = parseBulk(
    sample.map(([key, value]) => [bytesToNibbles(hexStringToBytes(key)), value])
  )
  const batchLeaves: BulkNodeInput = batchInsert.map(([nibbleArrays, value]) => {
    const key = nibbleArrays.pop()!
    const newNode = new LeafNode({ key, value: hexStringToBytes(value) })
    const pathNibbles = nibbleArrays.flat()
    return {
      newNode,
      pathNibbles,
    }
  })
  const batchTrie = await insertBatch(batchLeaves, false, debug('BULKTEST'))
  const batch_end = Date.now()
  t.pass(`batchInsert completed in ${(batch_end - batch_start) / 1000} seconds`)
  for (const key of Object.keys(bulkMap)) {
    const retrieved = await batchTrie.get(hexStringToBytes(key))
    if (!retrieved) {
      t.fail(`batchTrie should have a value for ${key}`)
      continue
    }
    t.equal(
      bytesToPrefixedHexString(retrieved),
      bulkMap[key],
      `batchTrie should have the same value for ${key}`
    )
  }

  // t.equal(
  //   bytesToPrefixedHexString(test.root()),
  //   bytesToPrefixedHexString(control.root()),
  //   'do they have the same root hash'
  // )
  t.equal(
    bytesToPrefixedHexString(batchTrie.root()),
    bytesToPrefixedHexString(test.root()),
    'do they have the same root hash'
  )
  t.pass(`{
    control: {(control_end - control_start) / 1000},
    bulkInsert: ${(bulk_end - bulk_start) / 1000},
    batchInsert: ${(batch_end - batch_start) / 1000},
  }`)
})
