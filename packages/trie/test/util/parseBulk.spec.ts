import { bytesToPrefixedHexString, hexStringToBytes } from '@ethereumjs/util'
import * as tape from 'tape'

import { bytesToNibbles, nibblestoBytes, parseBulk, partitionByCommonPrefix } from '../../src'

import * as bulkJSON from './bulkEntries.json'
import * as bulkInput from './bulkInput.json'

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
