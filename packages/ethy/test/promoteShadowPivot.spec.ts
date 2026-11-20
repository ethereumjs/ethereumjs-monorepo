import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { assert, describe, it } from 'vitest'

import { bytesToHex, hexToBytes } from '@ethereumjs/util'

import { networkGenesisHash } from '../src/net/genesisStatus.ts'
import { copyBalTailRange } from '../src/persist/balTailArchive.ts'
import { SnapPivotStore } from '../src/persist/snapStore.ts'

describe('[Ethy/Persist]: shadow pivot promotion', () => {
  it('promoteShadowPivotToActive flips active.json', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'shadow-flip-'))
    const store = SnapPivotStore.open({
      dataDir: root,
      network: 'sepolia',
      chainId: 11155111n,
      genesisHash: networkGenesisHash('sepolia'),
      enabled: true,
    })
    const rootA = hexToBytes(`0x${'aa'.repeat(32)}`)
    const rootB = hexToBytes(`0x${'bb'.repeat(32)}`)
    store.activatePivot({
      blockNumber: 100n,
      blockHash: new Uint8Array(32).fill(1),
      stateRoot: rootA,
    })
    const hexA = bytesToHex(rootA)
    const hexB = bytesToHex(rootB)
    store.beginShadowPivot(hexB)
    const pivotPath = path.join(store.pivotDirForRoot(hexB), 'pivot.json')
    fs.writeFileSync(
      pivotPath,
      JSON.stringify({
        blockNumber: '200',
        blockHash: bytesToHex(new Uint8Array(32).fill(2)),
        stateRoot: hexB,
        anchoredAt: Date.now(),
      }),
    )
    copyBalTailRange(store.pivotDirForRoot(hexA), store.pivotDirForRoot(hexB), 101n, 101n)
    assert.equal(store.promoteShadowPivotToActive(hexB), true)
    assert.equal(store.activePivotStateRoot()?.toLowerCase(), hexB.toLowerCase())
    assert.isTrue(fs.existsSync(store.pivotDirForRoot(hexA)))
    fs.rmSync(root, { recursive: true, force: true })
  })
})
