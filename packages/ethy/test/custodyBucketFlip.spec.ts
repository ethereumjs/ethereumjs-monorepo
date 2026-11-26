import type { Devp2pWorkerClient } from '@ethereumjs/devp2p'
import { createFlatStateManager } from '@ethereumjs/statemanager'
import { Account, BINARY_ACCOUNT_SIZE } from '@ethereumjs/util'
import { assert, describe, it, vi } from 'vitest'

import { noteCustodyPlaneComplete } from '../src/custody/custodyBucketFlip.ts'
import { accountMissFromRlpOrBinary } from '../src/custody/custodyStateResolver.ts'
import { createSpine } from '../src/spine/createSpine.ts'

describe('custodyBucketFlip', () => {
  it('accountMissFromRlpOrBinary returns 136-byte binary slab', () => {
    const acc = new Account()
    acc.nonce = 3n
    const rlp = acc.serialize()
    const bin = accountMissFromRlpOrBinary(rlp)
    assert.notEqual(bin, 'empty')
    if (bin !== 'empty' && bin !== undefined) {
      assert.equal(bin.length, BINARY_ACCOUNT_SIZE)
    }
  })

  it('noteCustodyPlaneComplete does not close bucket until all planes complete', () => {
    const spine = createSpine('sepolia', 11155111n)
    spine.lastVerifiedBlockNumber = 100n
    const sm = createFlatStateManager({ closedBucketsMask: 0 })
    const client = { setEthyStatus: vi.fn() } as unknown as Devp2pWorkerClient
    const store = {
      updateCustodyPlane: vi.fn(),
      getCustodyMeta: () => ({
        custodyPlanes: { '0': { accounts: true, code: false, storage: false } },
      }),
      closedBucketsMaskFromPlanes: () => 0,
    }
    noteCustodyPlaneComplete({
      snapStore: store as never,
      stateManager: sm,
      spine,
      client,
      bucketIndex: 0,
      plane: 'accounts',
      headBlock: 100n,
    })
    assert.equal(store.updateCustodyPlane.mock.calls.length, 1)
    assert.isUndefined(spine.ethyStorageBucketsBitmask)
  })
})
