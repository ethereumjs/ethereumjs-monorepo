import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { createFlatStateManager } from '@ethereumjs/statemanager'
import { assert, describe, it } from 'vitest'

import { networkGenesisHash } from '../src/net/genesisStatus.ts'
import { decodeHealBundleRlp, encodeHealBundleRlp } from '../src/persist/healBundle.ts'
import { SnapPivotStore } from '../src/persist/snapStore.ts'
import { createSpine } from '../src/spine/createSpine.ts'

function tempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-heal-'))
}

describe('[Ethy/Persist]: heal bundles', () => {
  it('encode and decode heal bundle RLP round-trip', () => {
    const entry = {
      blockNumber: 101n,
      blockHash: new Uint8Array(32),
      stateRoot: new Uint8Array(32),
      headerRlp: new Uint8Array([0xc0]),
      balRlp: new Uint8Array([0xc1, 0x80]),
    }
    entry.blockHash[0] = 0xab
    const rlp = encodeHealBundleRlp(entry)
    const decoded = decodeHealBundleRlp(rlp)
    assert.isDefined(decoded)
    assert.equal(decoded!.blockNumber, 101n)
    assert.equal(decoded!.blockHash[0], 0xab)
  })

  it('loadIntoAsync restores contiguous unapplied heal bundles after pivot', async () => {
    const dir = tempDir()
    const root = new Uint8Array(32)
    root[31] = 0xee
    const store = SnapPivotStore.open({
      dataDir: dir,
      network: 'sepolia',
      chainId: 11155111n,
      genesisHash: networkGenesisHash('sepolia'),
      enabled: true,
    })
    store.activatePivot({
      blockNumber: 100n,
      blockHash: new Uint8Array(32),
      stateRoot: root,
    })
    store.appendHealBundle({
      blockNumber: 101n,
      blockHash: new Uint8Array(32),
      stateRoot: new Uint8Array(32),
      headerRlp: new Uint8Array([0x80]),
      balRlp: new Uint8Array([0x80]),
    })
    store.appendHealBundle({
      blockNumber: 102n,
      blockHash: new Uint8Array(32),
      stateRoot: new Uint8Array(32),
      headerRlp: new Uint8Array([0x80]),
      balRlp: new Uint8Array([0x80]),
    })
    const spine = createSpine('sepolia', 11155111n)
    const sm = createFlatStateManager()
    await store.loadIntoAsync(spine, sm)
    const blocks = store.takeRestoredHealBlocks()
    assert.equal(blocks.length, 2)
    assert.equal(blocks[0]!.blockNumber, 101n)
    assert.equal(blocks[1]!.blockNumber, 102n)
  })
})
