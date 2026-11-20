import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { assert, describe, it } from 'vitest'

import { networkGenesisHash } from '../src/net/genesisStatus.ts'
import { SnapPivotStore } from '../src/persist/snapStore.ts'

describe('[Ethy/Persist]: shadow SNAP pivot prep', () => {
  it('prepareShadowPivotFromHeader writes pivot.json without active flip', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'shadow-snap-'))
    const store = SnapPivotStore.open({
      dataDir: root,
      network: 'sepolia',
      chainId: 11155111n,
      genesisHash: networkGenesisHash('sepolia'),
      enabled: true,
    })
    const stateRoot = new Uint8Array(32).fill(0x44)
    store.activatePivot({
      blockNumber: 50n,
      blockHash: new Uint8Array(32).fill(1),
      stateRoot: new Uint8Array(32).fill(0x11),
    })
    const prior = store.activePivotStateRoot()
    const hex = store.prepareShadowPivotFromHeader({
      blockNumber: 1024n,
      blockHash: new Uint8Array(32).fill(2),
      stateRoot,
    })
    assert.equal(store.activePivotStateRoot(), prior)
    assert.isTrue(store.shadowPivotHasPivotMeta(hex))
    store.setShadowPersistRoot(hex)
    store.appendVerifiedRange(
      0,
      [
        {
          accountHash: new Uint8Array(32).fill(0xaa),
          binaryAccount: new Uint8Array(104).fill(1),
        },
      ],
      [],
    )
    assert.equal(store.shadowPersistTarget(), hex)
    fs.rmSync(root, { recursive: true, force: true })
  })
})
