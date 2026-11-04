import { EthereumJSErrorWithoutCode } from '@ethereumjs/util'

import type { Common } from '@ethereumjs/common'

/** Generalized index of `BeaconBlockBody.execution_payload` (Capella..Osaka). */
export const EXECUTION_PAYLOAD_GINDEX = 25
/** Generalized index of `execution_block_hash` in `BeaconBlockBody` (Amsterdam / EIP-7732 ePBS). */
export const AMSTERDAM_EXECUTION_BLOCK_HASH_GINDEX = 2856

export type ProofLayout = {
  currentSyncCommitteeGindex: number
  nextSyncCommitteeGindex: number
  finalizedRootGindex: number
  executionPayloadGindex: number
}

const PRE_ELECTRA: ProofLayout = {
  currentSyncCommitteeGindex: 54,
  nextSyncCommitteeGindex: 55,
  finalizedRootGindex: 105,
  executionPayloadGindex: EXECUTION_PAYLOAD_GINDEX,
}

const ELECTRA_AND_LATER: ProofLayout = {
  currentSyncCommitteeGindex: 86,
  nextSyncCommitteeGindex: 87,
  finalizedRootGindex: 169,
  executionPayloadGindex: EXECUTION_PAYLOAD_GINDEX,
}

const AMSTERDAM_AND_LATER: ProofLayout = {
  currentSyncCommitteeGindex: 2945,
  nextSyncCommitteeGindex: 2946,
  finalizedRootGindex: 735,
  executionPayloadGindex: AMSTERDAM_EXECUTION_BLOCK_HASH_GINDEX,
}

function electraActivationEpoch(common: Common): number {
  const forks = common.beaconLightClient()?.forks
  if (forks === undefined) {
    throw EthereumJSErrorWithoutCode('beaconLightClient config not available for this chain')
  }
  const row = forks.find((f) => f.name === 'electra')
  if (row === undefined) {
    throw EthereumJSErrorWithoutCode('electra fork not listed in beaconLightClient forks')
  }
  return row.epoch
}

export function amsterdamActivationEpoch(common: Common): number {
  const forks = common.beaconLightClient()?.forks
  const row = forks?.find((f) => f.name === 'amsterdam')
  return row?.epoch ?? Number.MAX_SAFE_INTEGER
}

/** Fork-aware generalized indices for light-client Merkle proofs. */
export function proofLayoutAtEpoch(common: Common, epoch: number): ProofLayout {
  if (epoch >= amsterdamActivationEpoch(common)) {
    return AMSTERDAM_AND_LATER
  }
  if (epoch >= electraActivationEpoch(common)) {
    return ELECTRA_AND_LATER
  }
  return PRE_ELECTRA
}

export function epochAtSlot(slot: number, common: Common): number {
  const slotsPerEpoch = common.beaconLightClient()?.slotsPerEpoch
  if (slotsPerEpoch === undefined) {
    throw EthereumJSErrorWithoutCode('beaconLightClient config not available for this chain')
  }
  return Math.floor(slot / slotsPerEpoch)
}

export function capellaActivationEpoch(common: Common): number {
  const forks = common.beaconLightClient()?.forks
  const row = forks?.find((f) => f.name === 'capella')
  return row?.epoch ?? Number.MAX_SAFE_INTEGER
}
