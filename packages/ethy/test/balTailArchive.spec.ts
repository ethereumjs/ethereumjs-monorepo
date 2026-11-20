import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { assert, describe, it } from 'vitest'

import {
  appendBalTailBundle,
  copyBalTailRange,
  enforceBalTailRetention,
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
    const root2 = fs.mkdtempSync(path.join(os.tmpdir(), 'bal-tail-dst-'))
    copyBalTailRange(root, root2, 100n, 100n)
    const got2 = readBalTailBundle(root2, 100n)
    assert.deepEqual(got2?.balRlp, bal)
    fs.rmSync(root, { recursive: true, force: true })
    fs.rmSync(root2, { recursive: true, force: true })
  })

  it('enforceBalTailRetention drops oldest blocks', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'bal-tail-cap-'))
    const header = new Uint8Array([0x01])
    const bal = new Uint8Array([0x02])
    for (let b = 100n; b <= 103n; b += 1n) {
      appendBalTailBundle(root, b, header, bal)
    }
    enforceBalTailRetention(root, { maxBlocks: 2n, minEarliest: 100n })
    const man = readBalTailManifest(root)
    assert.deepEqual(man, { earliest: 102n, latest: 103n })
    assert.isUndefined(readBalTailBundle(root, 100n))
    assert.isDefined(readBalTailBundle(root, 103n))
    fs.rmSync(root, { recursive: true, force: true })
  })
})
