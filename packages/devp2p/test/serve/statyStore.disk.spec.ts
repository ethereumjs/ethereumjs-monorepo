import fs from 'node:fs'
import path from 'node:path'

import { RLP } from '@ethereumjs/rlp'
import { bytesToUnprefixedHex } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { StatyStore } from '../../src/serve/statyStore.ts'

const MANIFEST_MAGIC = Buffer.from([0x53, 0x54, 0x59, 0x4d])
const PART_MAGIC = Buffer.from([0x53, 0x54, 0x59, 0x50])
const WITNESS_MAGIC = Buffer.from([0x53, 0x54, 0x59, 0x58])

describe('StatyStore disk layout (WP-16b)', () => {
  it('reads Ethy-style manifest, multi-byte part, and witness from disk', () => {
    const root = path.join(process.cwd(), `.ci-staty-disk-${Date.now()}`)
    const store = new StatyStore()
    store.setDataDir(root)
    const epochDir = path.join(root, 'epochs', '42')
    fs.mkdirSync(epochDir, { recursive: true })
    const anchorRoot = new Uint8Array(32).fill(9)
    const body = RLP.encode([
      42,
      10752,
      anchorRoot,
      32,
      [[0, 300, 1500, 4096, 65536]],
    ] as unknown as Uint8Array[])
    fs.writeFileSync(
      path.join(epochDir, 'manifest.rlp'),
      Buffer.concat([MANIFEST_MAGIC, Buffer.from(body)]),
    )
    const manifest = store.manifestForEpoch(42n)
    assert.isDefined(manifest)
    assert.strictEqual(manifest?.epochNumber, 42n)
    assert.strictEqual(manifest?.anchorBlock, 10752n)
    assert.strictEqual(manifest?.shards[0]?.partCount, 300)
    assert.strictEqual(manifest?.shards[0]?.accountCount, 1500)
    assert.strictEqual(manifest?.shards[0]?.slotCount, 4096)
    assert.strictEqual(manifest?.shards[0]?.totalBytes, 65536)

    const acctHash = new Uint8Array(32).fill(0x11)
    const partBody = RLP.encode([
      42,
      1,
      300,
      anchorRoot,
      [[acctHash, new Uint8Array(0)]],
      [],
      [],
    ] as unknown as Uint8Array[])
    fs.writeFileSync(
      path.join(epochDir, '1-300.rlp'),
      Buffer.concat([PART_MAGIC, Buffer.from([1, 300 >> 8, 300 & 0xff]), Buffer.from(partBody)]),
    )
    const part = store.partFor(42n, 1, 300)
    assert.isDefined(part)
    assert.strictEqual(part?.partIndex, 300)
    assert.strictEqual(part?.accounts.length, 1)

    const witnessDir = path.join(root, 'witnesses')
    fs.mkdirSync(witnessDir, { recursive: true })
    const witnessBody = RLP.encode([
      10800,
      anchorRoot,
      [[acctHash, new Uint8Array(0)]],
      [],
      [new Uint8Array([0xaa])],
    ] as unknown as Uint8Array[])
    fs.writeFileSync(
      path.join(witnessDir, `${bytesToUnprefixedHex(acctHash)}.rlp`),
      Buffer.concat([WITNESS_MAGIC, Buffer.from(witnessBody)]),
    )
    const groups = store.resolveWitnesses(10700n, 65536, [
      { accountHash: acctHash, slotHashes: [] },
    ])
    assert.strictEqual(groups.length, 1)
    assert.strictEqual(groups[0]?.anchorBlock, 10800n)

    fs.rmSync(root, { recursive: true, force: true })
  })
})
