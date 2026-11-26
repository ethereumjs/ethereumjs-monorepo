import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { EthyMessageCodes } from '@ethereumjs/devp2p'
import { RLP } from '@ethereumjs/rlp'
import { createFlatStateManager } from '@ethereumjs/statemanager'
import { bigIntToUnpaddedBytes, intToUnpaddedBytes } from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { assert, describe, it } from 'vitest'

import { networkGenesisHash } from '../src/net/genesisStatus.ts'
import { SnapPivotStore } from '../src/persist/snapStore.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import { EthyCodeStorageSynchronizer } from '../src/sync/ethyCodeStorageSync.ts'

describe('custodyEthySync', () => {
  it('EthyCodeStorageSynchronizer persists verified code from PROVEN_STORAGE_OR_CODE', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'custody-code-'))
    const spine = createSpine('sepolia', 11155111n)
    const root = new Uint8Array(32).fill(0x11)
    const tmp = SnapPivotStore.open({
      dataDir: dir,
      network: 'sepolia',
      chainId: 11155111n,
      genesisHash: networkGenesisHash('sepolia'),
      enabled: true,
    })
    tmp.activatePivot({ blockNumber: 1n, blockHash: new Uint8Array(32), stateRoot: root })
    const stateManager = createFlatStateManager()
    const code = new Uint8Array([0x60, 0x00, 0x60, 0x00, 0xfd])
    const codeHash = keccak_256(code)
    const bucket = codeHash[0]! >> 4
    spine.custodyBuckets = [bucket]

    const client = {
      setSharedCodeDir: () => {},
      setEthyStorageDir: () => {},
      sendEthyMessage: () => {},
    }

    let notedBucket: number | undefined
    const sync = new EthyCodeStorageSynchronizer({
      spine,
      client: client as never,
      stateManager,
      snapStore: tmp,
      buckets: [bucket],
      onCodeBatchForBucket: (idx) => {
        notedBucket = idx
      },
    })
    sync.start()
    const peerId = `0x${'aa'.repeat(32)}`
    sync.requestCode(peerId, 42n, codeHash)

    const reply = RLP.encode([
      bigIntToUnpaddedBytes(42n),
      intToUnpaddedBytes(0),
      [[codeHash, code]],
    ] as never)
    sync.handleEthyResponse(peerId, EthyMessageCodes.PROVEN_STORAGE_OR_CODE, reply)

    assert.isTrue(tmp.hasPersistedCode(codeHash))
    assert.equal(notedBucket, bucket)
    sync.stop()
    fs.rmSync(dir, { recursive: true, force: true })
  })
})
