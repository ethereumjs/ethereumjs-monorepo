import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { assert, describe, it } from 'vitest'

import {
  appendBalTailBundle,
  readBalTailBundle,
  readBalTailManifest,
} from '../src/persist/balTailArchive.ts'

describe('[Ethy/Persist]: bal tail archive', () => {
  it('append and read round-trip', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'bal-tail-'))
    const header = new Uint8Array([0x01, 0x02])
    const bal = new Uint8Array([0xaa, 0xbb, 0xcc])
    appendBalTailBundle(root, 100n, header, bal)
    const got = readBalTailBundle(root, 100n)
    assert.deepEqual(got?.headerRlp, header)
    assert.deepEqual(got?.balRlp, bal)
    const man = readBalTailManifest(root)
    assert.deepEqual(man, { earliest: 100n, latest: 100n })
    fs.rmSync(root, { recursive: true, force: true })
  })
})
