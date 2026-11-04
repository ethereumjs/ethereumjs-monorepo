import { assert, describe, it } from 'vitest'

import {
  createBeaconLightClient,
  emptyLightClientHeader,
  emptySyncCommittee,
} from '../src/index.ts'

import {
  buildBootstrap,
  buildTestSyncCommittee,
  sha256,
  signAttestedHeader,
  testCommon,
} from './fixtures/syntheticCommittee.ts'

describe('[BeaconLight]: BeaconLightClient lifecycle', () => {
  it('bootstrap through period update, finality, and optimistic paths', () => {
    const bootstrap = buildBootstrap(8192)
    const { secretKeys } = buildTestSyncCommittee()
    const client = createBeaconLightClient({ common: testCommon })
    client.bootstrap(bootstrap)

    const attested = {
      ...bootstrap.header,
      beacon: { ...bootstrap.header.beacon, slot: bootstrap.header.beacon.slot + 32 },
    }
    const participant = Array.from({ length: 342 }, (_, i) => i)
    const syncAggregate = signAttestedHeader(
      attested,
      attested.beacon.slot + 1,
      participant,
      secretKeys,
    )

    const finalized = {
      ...bootstrap.header,
      beacon: { ...bootstrap.header.beacon, slot: bootstrap.header.beacon.slot + 16 },
    }
    const finalityBranch: Uint8Array[] = []

    const updateResult = client.applyUpdate({
      attestedHeader: attested,
      nextSyncCommittee: emptySyncCommittee(),
      nextSyncCommitteeBranch: [],
      finalizedHeader: emptyLightClientHeader(),
      finalityBranch,
      syncAggregate,
      signatureSlot: attested.beacon.slot + 1,
    })
    assert.ok(updateResult.optimisticUpdated || updateResult.finalizedUpdated)

    const finAggregate = signAttestedHeader(
      attested,
      attested.beacon.slot + 2,
      participant,
      secretKeys,
    )
    const fin = client.applyFinalityUpdate({
      attestedHeader: attested,
      finalizedHeader: finalized,
      finalityBranch,
      syncAggregate: finAggregate,
      signatureSlot: attested.beacon.slot + 2,
    })
    assert.ok(fin.finalizedUpdated || fin.optimisticUpdated)

    const attestedLater = {
      ...attested,
      beacon: { ...attested.beacon, slot: attested.beacon.slot + 32 },
    }
    const optAggregate = signAttestedHeader(
      attestedLater,
      attestedLater.beacon.slot + 1,
      participant,
      secretKeys,
    )
    const opt = client.applyOptimisticUpdate({
      attestedHeader: attestedLater,
      syncAggregate: optAggregate,
      signatureSlot: attestedLater.beacon.slot + 1,
    })
    assert.ok(opt.optimisticUpdated)

    const head = client.getHeadExecution()
    assert.ok(head !== undefined)
    assert.equal(head!.blockNumber, 42)
  }, 60_000)

  it('rejects forged execution state root and insufficient participation', () => {
    const bootstrap = buildBootstrap(50_000)
    const { secretKeys } = buildTestSyncCommittee()
    const client = createBeaconLightClient({ common: testCommon })
    client.bootstrap(bootstrap)

    const badHeader = {
      ...bootstrap.header,
      beacon: { ...bootstrap.header.beacon, slot: bootstrap.header.beacon.slot + 32 },
      execution: {
        ...bootstrap.header.execution!,
        stateRoot: (() => {
          const r = new Uint8Array(bootstrap.header.execution!.stateRoot)
          r[0] ^= 0xff
          return r
        })(),
      },
    }

    const syncAggregate = signAttestedHeader(
      badHeader,
      badHeader.beacon.slot + 1,
      Array.from({ length: 342 }, (_, i) => i),
      secretKeys,
    )

    assert.throws(() =>
      client.applyUpdate({
        attestedHeader: badHeader,
        nextSyncCommittee: buildTestSyncCommittee().committee,
        nextSyncCommitteeBranch: [],
        finalizedHeader: emptyLightClientHeader(),
        finalityBranch: [],
        syncAggregate,
        signatureSlot: badHeader.beacon.slot + 1,
      }),
    )

    const goodHeader = bootstrap.header
    const weakAggregate = signAttestedHeader(
      goodHeader,
      goodHeader.beacon.slot + 1,
      Array.from({ length: 341 }, (_, i) => i),
      secretKeys,
    )
    assert.throws(() =>
      client.applyUpdate({
        attestedHeader: goodHeader,
        nextSyncCommittee: buildTestSyncCommittee().committee,
        nextSyncCommitteeBranch: [],
        finalizedHeader: goodHeader,
        finalityBranch: [],
        syncAggregate: weakAggregate,
        signatureSlot: goodHeader.beacon.slot + 1,
      }),
    )
  }, 60_000)
})
