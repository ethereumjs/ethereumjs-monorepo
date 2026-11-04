import { Common } from '@ethereumjs/common'
import { EthereumJSErrorWithoutCode, equalsBytes, hexToBytes } from '@ethereumjs/util'
import { sha256 as nobleSha256 } from '@noble/hashes/sha2.js'

import { verifySyncCommitteeSignature } from './bls.ts'
import { computeSigningRoot, computeSyncCommitteeDomain } from './domain.ts'
import {
  gindexToMerklePosition,
  isValidNormalizedMerkleBranch,
  merkleRootFromZeroBranch,
} from './merkle.ts'
import { capellaActivationEpoch, epochAtSlot, proofLayoutAtEpoch } from './proofLayout.ts'
import {
  hashTreeRootBeaconBlockHeader,
  hashTreeRootExecutionPayloadHeader,
  hashTreeRootSyncCommittee,
} from './ssz.ts'

import type { Sha256Fn } from './ssz.ts'
import type {
  ApplyUpdateResult,
  LightClientBootstrap,
  LightClientFinalityUpdate,
  LightClientHeader,
  LightClientOptimisticUpdate,
  LightClientUpdate,
  SyncCommittee,
  VerifiedExecutionHead,
} from './types.ts'

const SUPERMAJORITY = Math.ceil((512 * 2) / 3)

export type BeaconLightClientOpts = {
  common: Common
  sha256?: Sha256Fn
  verifyAggregate?: (
    signature: Uint8Array,
    message: Uint8Array,
    publicKeys: Uint8Array[],
  ) => boolean
}

export type ApplyContext = {
  /** Current slot for timing checks (defaults to `signatureSlot + 1`). */
  currentSlot?: number
}

function resolveSha256(common: Common, override?: Sha256Fn): Sha256Fn {
  return override ?? common.customCrypto.sha256 ?? ((msg) => nobleSha256(msg))
}

function genesisValidatorsRootBytes(common: Common): Uint8Array {
  const root = common.beaconLightClient()?.genesisValidatorsRoot
  if (root === undefined) {
    throw EthereumJSErrorWithoutCode('beaconLightClient config not available for this chain')
  }
  return hexToBytes(root)
}

export function emptyLightClientHeader(): LightClientHeader {
  const zero = new Uint8Array(32)
  return {
    beacon: {
      slot: 0,
      proposerIndex: 0,
      parentRoot: zero,
      stateRoot: zero,
      bodyRoot: zero,
    },
  }
}

export function emptySyncCommittee(): SyncCommittee {
  const zero = new Uint8Array(48)
  return {
    publicKeys: Array.from({ length: 512 }, () => new Uint8Array(48)),
    aggregatePubkey: new Uint8Array(48),
  }
}

function isSyncCommitteeEmpty(committee: SyncCommittee): boolean {
  if (!equalsBytes(committee.aggregatePubkey, new Uint8Array(48))) return false
  return committee.publicKeys.every((pk) => equalsBytes(pk, new Uint8Array(48)))
}

function executionForkLabel(common: Common, slot: number): 'capella' | 'deneb' {
  const epoch = epochAtSlot(slot, common)
  const denebEpoch = common.beaconLightClient()?.forks.find((f) => f.name === 'deneb')?.epoch ?? 0
  return epoch >= denebEpoch ? 'deneb' : 'capella'
}

function assertValidLightClientHeader(header: LightClientHeader, common: Common, sha256: Sha256Fn) {
  const slot = header.beacon.slot
  const epoch = epochAtSlot(slot, common)
  if (epoch < capellaActivationEpoch(common)) {
    if (header.execution !== undefined || (header.executionBranch?.length ?? 0) > 0) {
      throw EthereumJSErrorWithoutCode('pre-Capella header must not carry execution payload')
    }
    return
  }
  if (header.execution === undefined || header.executionBranch === undefined) {
    throw EthereumJSErrorWithoutCode('Capella+ light client header requires execution fields')
  }
  const execRoot = hashTreeRootExecutionPayloadHeader(
    header.execution,
    executionForkLabel(common, slot),
    sha256,
  )
  const layout = proofLayoutAtEpoch(common, epoch)
  const { depth, index } = gindexToMerklePosition(layout.executionPayloadGindex)
  if (
    !isValidNormalizedMerkleBranch(
      execRoot,
      header.executionBranch,
      layout.executionPayloadGindex,
      header.beacon.bodyRoot,
      sha256,
    )
  ) {
    throw EthereumJSErrorWithoutCode('invalid execution_payload Merkle branch')
  }
  // depth/index used for clarity in errors; branch check uses gindex normalization
  if (header.executionBranch.length > depth + 1) {
    throw EthereumJSErrorWithoutCode('execution branch too long')
  }
  void index
}

function verifiedExecutionFromHeader(
  header: LightClientHeader,
  participantCount: number,
  sha256: Sha256Fn,
): VerifiedExecutionHead | undefined {
  if (header.execution === undefined) return undefined
  return {
    slot: header.beacon.slot,
    beaconBlockRoot: hashTreeRootBeaconBlockHeader(header.beacon, sha256),
    blockNumber: header.execution.blockNumber,
    blockHash: header.execution.blockHash,
    stateRoot: header.execution.stateRoot,
    parentHash: header.execution.parentHash,
    timestamp: header.execution.timestamp,
    participantCount,
  }
}

/**
 * Ethereum consensus light-client store and verifier (offline; no REST transport).
 */
export class BeaconLightClient {
  public readonly common: Common
  private readonly sha256: Sha256Fn
  private readonly verifyAggregate?: BeaconLightClientOpts['verifyAggregate']

  private finalizedHeader!: LightClientHeader
  private optimisticHeader!: LightClientHeader
  private currentSyncCommittee!: SyncCommittee
  private nextSyncCommittee!: SyncCommittee
  private lastParticipantCount = 0

  constructor(opts: BeaconLightClientOpts) {
    if (opts.common.beaconLightClient() === undefined) {
      throw EthereumJSErrorWithoutCode('beaconLightClient config not available for this chain')
    }
    this.common = opts.common
    this.sha256 = resolveSha256(opts.common, opts.sha256)
    this.verifyAggregate = opts.verifyAggregate
  }

  /**
   * Factory for {@link BeaconLightClient}.
   */
  static create(opts: BeaconLightClientOpts): BeaconLightClient {
    return new BeaconLightClient(opts)
  }

  bootstrap(bootstrap: LightClientBootstrap, expectedBlockRoot?: Uint8Array): LightClientHeader {
    assertValidLightClientHeader(bootstrap.header, this.common, this.sha256)
    const headerRoot = hashTreeRootBeaconBlockHeader(bootstrap.header.beacon, this.sha256)
    if (expectedBlockRoot !== undefined && !equalsBytes(headerRoot, expectedBlockRoot)) {
      throw EthereumJSErrorWithoutCode('bootstrap header root mismatch')
    }
    const epoch = epochAtSlot(bootstrap.header.beacon.slot, this.common)
    const layout = proofLayoutAtEpoch(this.common, epoch)
    const committeeRoot = hashTreeRootSyncCommittee(bootstrap.currentSyncCommittee, this.sha256)
    if (
      !isValidNormalizedMerkleBranch(
        committeeRoot,
        bootstrap.currentSyncCommitteeBranch,
        layout.currentSyncCommitteeGindex,
        bootstrap.header.beacon.stateRoot,
        this.sha256,
      )
    ) {
      throw EthereumJSErrorWithoutCode('invalid current_sync_committee Merkle branch')
    }

    this.finalizedHeader = bootstrap.header
    this.optimisticHeader = bootstrap.header
    this.currentSyncCommittee = bootstrap.currentSyncCommittee
    this.nextSyncCommittee = emptySyncCommittee()
    this.lastParticipantCount = 0
    return bootstrap.header
  }

  applyUpdate(update: LightClientUpdate, ctx: ApplyContext = {}): ApplyUpdateResult {
    this.validateUpdateLike(update, ctx)
    const { participantCount, validSig } = this.verifyAggregateOnAttested(update)
    if (!validSig || participantCount < SUPERMAJORITY) {
      throw EthereumJSErrorWithoutCode('insufficient sync committee participation')
    }

    let periodAdvanced = false
    let finalizedUpdated = false
    let optimisticUpdated = false

    const storePeriod = this.common.syncCommitteePeriodAtSlot(this.finalizedHeader.beacon.slot)
    const updateFinalizedPeriod = this.common.syncCommitteePeriodAtSlot(
      update.finalizedHeader.beacon.slot,
    )

    const hasNextCommitteePayload = update.nextSyncCommitteeBranch.length > 0
    if (hasNextCommitteePayload) {
      const epoch = epochAtSlot(update.attestedHeader.beacon.slot, this.common)
      const layout = proofLayoutAtEpoch(this.common, epoch)
      const nextRoot = hashTreeRootSyncCommittee(update.nextSyncCommittee, this.sha256)
      if (
        !isValidNormalizedMerkleBranch(
          nextRoot,
          update.nextSyncCommitteeBranch,
          layout.nextSyncCommitteeGindex,
          update.attestedHeader.beacon.stateRoot,
          this.sha256,
        )
      ) {
        throw EthereumJSErrorWithoutCode('invalid next_sync_committee Merkle branch')
      }
    }

    if (isSyncCommitteeEmpty(this.nextSyncCommittee) && hasNextCommitteePayload) {
      this.nextSyncCommittee = update.nextSyncCommittee
    } else if (updateFinalizedPeriod === storePeriod + 1) {
      this.currentSyncCommittee = this.nextSyncCommittee
      this.nextSyncCommittee = update.nextSyncCommittee
      periodAdvanced = true
    }

    if (
      update.attestedHeader.beacon.slot > this.optimisticHeader.beacon.slot &&
      participantCount > 0
    ) {
      this.optimisticHeader = update.attestedHeader
      optimisticUpdated = true
    }

    if (
      update.finalizedHeader.beacon.slot > 0 &&
      update.finalizedHeader.beacon.slot > this.finalizedHeader.beacon.slot
    ) {
      this.finalizedHeader = update.finalizedHeader
      if (this.finalizedHeader.beacon.slot > this.optimisticHeader.beacon.slot) {
        this.optimisticHeader = this.finalizedHeader
      }
      finalizedUpdated = true
    }

    this.lastParticipantCount = participantCount
    return { periodAdvanced, finalizedUpdated, optimisticUpdated }
  }

  applyFinalityUpdate(
    update: LightClientFinalityUpdate,
    ctx: ApplyContext = {},
  ): ApplyUpdateResult {
    return this.applyUpdate(
      {
        attestedHeader: update.attestedHeader,
        nextSyncCommittee: emptySyncCommittee(),
        nextSyncCommitteeBranch: [],
        finalizedHeader: update.finalizedHeader,
        finalityBranch: update.finalityBranch,
        syncAggregate: update.syncAggregate,
        signatureSlot: update.signatureSlot,
      },
      ctx,
    )
  }

  applyOptimisticUpdate(
    update: LightClientOptimisticUpdate,
    ctx: ApplyContext = {},
  ): ApplyUpdateResult {
    return this.applyUpdate(
      {
        attestedHeader: update.attestedHeader,
        nextSyncCommittee: emptySyncCommittee(),
        nextSyncCommitteeBranch: [],
        finalizedHeader: emptyLightClientHeader(),
        finalityBranch: [],
        syncAggregate: update.syncAggregate,
        signatureSlot: update.signatureSlot,
      },
      ctx,
    )
  }

  getHeadExecution(): VerifiedExecutionHead | undefined {
    return verifiedExecutionFromHeader(
      this.optimisticHeader,
      this.lastParticipantCount,
      this.sha256,
    )
  }

  getFinalizedExecution(): VerifiedExecutionHead | undefined {
    return verifiedExecutionFromHeader(this.finalizedHeader, this.lastParticipantCount, this.sha256)
  }

  private verifyAggregateOnAttested(update: {
    attestedHeader: LightClientHeader
    syncAggregate: LightClientUpdate['syncAggregate']
    signatureSlot: number
  }): { participantCount: number; validSig: boolean } {
    const storePeriod = this.common.syncCommitteePeriodAtSlot(this.finalizedHeader.beacon.slot)
    const signaturePeriod = this.common.syncCommitteePeriodAtSlot(update.signatureSlot)
    const committee =
      signaturePeriod === storePeriod ? this.currentSyncCommittee : this.nextSyncCommittee
    const forkSlot = Math.max(0, update.signatureSlot - 1)
    const forkEpoch = epochAtSlot(forkSlot, this.common)
    const forkVersion = this.common.forkVersionAtEpoch(forkEpoch)
    const domain = computeSyncCommitteeDomain(
      forkVersion,
      genesisValidatorsRootBytes(this.common),
      this.sha256,
    )
    const signingRoot = computeSigningRoot(
      hashTreeRootBeaconBlockHeader(update.attestedHeader.beacon, this.sha256),
      domain,
      this.sha256,
    )
    const result = verifySyncCommitteeSignature({
      publicKeys: committee.publicKeys,
      syncCommitteeBits: update.syncAggregate.syncCommitteeBits,
      signature: update.syncAggregate.signature,
      signingRoot,
      verifyAggregate: this.verifyAggregate,
    })
    return { participantCount: result.participantCount, validSig: result.valid }
  }

  private validateUpdateLike(update: LightClientUpdate, ctx: ApplyContext): void {
    assertValidLightClientHeader(update.attestedHeader, this.common, this.sha256)
    const currentSlot = ctx.currentSlot ?? update.signatureSlot + 1
    if (
      !(
        currentSlot >= update.signatureSlot &&
        update.signatureSlot > update.attestedHeader.beacon.slot &&
        update.attestedHeader.beacon.slot >= update.finalizedHeader.beacon.slot
      )
    ) {
      throw EthereumJSErrorWithoutCode('invalid light client update slot ordering')
    }

    const attestedEpoch = epochAtSlot(update.attestedHeader.beacon.slot, this.common)
    const layout = proofLayoutAtEpoch(this.common, attestedEpoch)

    if (update.finalityBranch.length > 0 && update.finalizedHeader.beacon.slot > 0) {
      assertValidLightClientHeader(update.finalizedHeader, this.common, this.sha256)
      const finalizedRoot = hashTreeRootBeaconBlockHeader(
        update.finalizedHeader.beacon,
        this.sha256,
      )
      if (
        !isValidNormalizedMerkleBranch(
          finalizedRoot,
          update.finalityBranch,
          layout.finalizedRootGindex,
          update.attestedHeader.beacon.stateRoot,
          this.sha256,
        )
      ) {
        throw EthereumJSErrorWithoutCode('invalid finality Merkle branch')
      }
    }
  }
}

/** Create a {@link BeaconLightClient} from chain config. */
export function createBeaconLightClient(opts: BeaconLightClientOpts): BeaconLightClient {
  return BeaconLightClient.create(opts)
}

/** @internal test helper: state root that proves `leaf` at `gindex` with zero siblings. */
export function stateRootForMerkleLeaf(
  leaf: Uint8Array,
  gindex: number,
  sha256: Sha256Fn = nobleSha256,
): Uint8Array {
  const { depth, index } = gindexToMerklePosition(gindex)
  return merkleRootFromZeroBranch(leaf, depth, index, sha256)
}
