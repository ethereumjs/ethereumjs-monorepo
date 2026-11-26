import fs from 'node:fs'
import path from 'node:path'

import { RLP } from '@ethereumjs/rlp'
import { assert, describe, it } from 'vitest'

import { StatyStore } from '../../src/serve/statyStore.ts'

const MANIFEST_MAGIC = Buffer.from([0x53, 0x54, 0x59, 0x4d])

describe('StatyStore disk layout (WP-16b)', () => {
  it('reads Ethy-style manifest.rlp from epochs directory', () => {
    const root = path.join(process.cwd(), `.ci-staty-disk-${Date.now()}`)
    const store = new StatyStore()
    store.setDataDir(root)
    const epochDir = path.join(root, 'epochs', '42')
    fs.mkdirSync(epochDir, { recursive: true })
    const body = RLP.encode([
      42,
      10752,
      new Uint8Array(32).fill(9),
      32,
      [[0, 1, 2, 0, 100]],
    ] as unknown as Uint8Array[])
    fs.writeFileSync(
      path.join(epochDir, 'manifest.rlp'),
      Buffer.concat([MANIFEST_MAGIC, Buffer.from(body)]),
    )
    const manifest = store.manifestForEpoch(42n)
    assert.isDefined(manifest)
    assert.strictEqual(manifest?.epochNumber, 42n)
    assert.strictEqual(manifest?.anchorBlock, 10752n)
    fs.rmSync(root, { recursive: true, force: true })
  })
})
