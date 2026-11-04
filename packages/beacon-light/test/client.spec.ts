import { assert, describe, it } from 'vitest'

import {
  ZERO_HASHES,
  createBeaconLightClient,
  emptyLightClientHeader,
  emptySyncCommittee,
  gindexToMerklePosition,
  hashTreeRootBeaconBlockHeader,
  hashTreeRootSyncCommittee,
  proofLayoutAtEpoch,
  stateRootForMerkleLeaf,
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
    const { committee, secretKeys } = buildTestSyncCommittee()
    const client = createBeaconLightClient({ common: testCommon })
    client.bootstrap(bootstrap)

    const layout = proofLayoutAtEpoch(testCommon, Math.floor(8192 / 32))
    const nextRoot = hashTreeRootSyncCommittee(committee, sha256)
    const nextBranch = ZERO_HASHES.slice(
      0,
      gindexToMerklePosition(layout.nextSyncCommitteeGindex).depth,
    )
    const attestedWithNext = {
      ...bootstrap.header,
      beacon: {
        ...bootstrap.header.beacon,
        slot: bootstrap.header.beacon.slot + 32,
        stateRoot: stateRootForMerkleLeaf(nextRoot, layout.nextSyncCommitteeGindex, sha256),
      },
    }
    const participant = Array.from({ length: 342 }, (_, i) => i)
    const syncAggregate = signAttestedHeader(
      attestedWithNext,
      attestedWithNext.beacon.slot + 1,
      participant,
      secretKeys,
    )

    const updateResult = client.applyUpdate({
      attestedHeader: attestedWithNext,
      nextSyncCommittee: committee,
      nextSyncCommitteeBranch: nextBranch,
      finalizedHeader: emptyLightClientHeader(),
      finalityBranch: [],
      syncAggregate,
      signatureSlot: attestedWithNext.beacon.slot + 1,
    })
    assert.ok(updateResult.optimisticUpdated)
    assert.equal(updateResult.periodAdvanced, false)

    // Advance finalizedHeader into the next Sync Committee period (slot 16384 = period 2)
    const finalizedNextPeriod = {
      ...bootstrap.header,
      beacon: { ...bootstrap.header.beacon, slot: 16384 },
    }
    const finalizedRoot = hashTreeRootBeaconBlockHeader(finalizedNextPeriod.beacon, sha256)
    const finalityDepth = gindexToMerklePosition(layout.finalizedRootGindex).depth
    const finalityBranch = ZERO_HASHES.slice(0, finalityDepth)
    const attestedForFinality = {
      ...bootstrap.header,
      beacon: {
        ...bootstrap.header.beacon,
        slot: 16400,
        stateRoot: stateRootForMerkleLeaf(finalizedRoot, layout.finalizedRootGindex, sha256),
      },
    }
    const finAggregate = signAttestedHeader(
      attestedForFinality,
      attestedForFinality.beacon.slot + 1,
      participant,
      secretKeys,
    )
    const fin = client.applyFinalityUpdate({
      attestedHeader: attestedForFinality,
      finalizedHeader: finalizedNextPeriod,
      finalityBranch,
      syncAggregate: finAggregate,
      signatureSlot: attestedForFinality.beacon.slot + 1,
    })
    assert.ok(fin.finalizedUpdated)
    assert.ok(fin.periodAdvanced)
    assert.equal(client.getFinalizedExecution()?.slot, 16384)

    const attestedLater = {
      ...attestedForFinality,
      beacon: { ...attestedForFinality.beacon, slot: attestedForFinality.beacon.slot + 32 },
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

  it('rejects forged execution state root, empty finality branch, and insufficient participation', () => {
    const bootstrap = buildBootstrap(50_000)
    const { committee, secretKeys } = buildTestSyncCommittee()
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
        nextSyncCommittee: emptySyncCommittee(),
        nextSyncCommitteeBranch: [],
        finalizedHeader: emptyLightClientHeader(),
        finalityBranch: [],
        syncAggregate,
        signatureSlot: badHeader.beacon.slot + 1,
      }),
    )

    // Non-empty finalizedHeader with empty finalityBranch must be rejected
    const goodAttested = {
      ...bootstrap.header,
      beacon: { ...bootstrap.header.beacon, slot: bootstrap.header.beacon.slot + 32 },
    }
    const validAggregate = signAttestedHeader(
      goodAttested,
      goodAttested.beacon.slot + 1,
      Array.from({ length: 342 }, (_, i) => i),
      secretKeys,
    )
    assert.throws(() =>
      client.applyFinalityUpdate({
        attestedHeader: goodAttested,
        finalizedHeader: bootstrap.header,
        finalityBranch: [],
        syncAggregate: validAggregate,
        signatureSlot: goodAttested.beacon.slot + 1,
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
        nextSyncCommittee: committee,
        nextSyncCommitteeBranch: [],
        finalizedHeader: emptyLightClientHeader(),
        finalityBranch: [],
        syncAggregate: weakAggregate,
        signatureSlot: goodHeader.beacon.slot + 1,
      }),
    )
  }, 60_000)
})
