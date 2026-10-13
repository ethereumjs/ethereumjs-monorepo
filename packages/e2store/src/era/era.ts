import { EthereumJSErrorWithoutCode, bytesToHex, equalsBytes } from '@ethereumjs/util'
import * as ssz from 'micro-eth-signer/ssz.js'

import { EraTypes, parseEntry, readEntry } from '../index.ts'

import type { SlotIndex } from '../index.ts'

/**
 * Parses the trailing {@link SlotIndex} record from an era file byte string.
 *
 * @param bytes Full era buffer; the index is read from the end.
 * @throws If the trailing entry is not a SlotIndex type.
 */
export const readSlotIndex = (bytes: Uint8Array): SlotIndex => {
  const recordEnd = bytes.length
  const countBytes = bytes.slice(recordEnd - 8)
  const count = Number(new DataView(countBytes.buffer).getBigInt64(0, true))
  const recordStart = recordEnd - (8 * count + 24)
  const slotIndexEntry = readEntry(bytes.subarray(recordStart, recordEnd))
  if (equalsBytes(slotIndexEntry.type, EraTypes.SlotIndex) === false) {
    throw EthereumJSErrorWithoutCode(`expected SlotIndex type, got ${slotIndexEntry.type}`)
  }

  const startSlot = Number(
    new DataView(slotIndexEntry.data.slice(0, 8).buffer).getBigInt64(0, true),
  )
  const slotOffsets = []

  for (let i = 0; i < count; i++) {
    const slotEntry = slotIndexEntry.data.subarray((i + 1) * 8, (i + 2) * 8)
    let slotOffset = Number(new DataView(slotEntry.slice(0, 8).buffer).getBigInt64(0, true))
    if (slotOffset === -1 * recordStart) slotOffset = 0 // If offset is the same as the block record start, this is a skipped slot
    slotOffsets.push(slotOffset)
  }
  return {
    startSlot,
    recordStart,
    slotOffsets,
  }
}

/**
 * Extracts state and optional block {@link SlotIndex} records from a serialized era file.
 *
 * @returns Block index is `undefined` when `startSlot === 0` (state-only era).
 */
export const getEraIndexes = (
  eraContents: Uint8Array,
): { stateSlotIndex: SlotIndex; blockSlotIndex: SlotIndex | undefined } => {
  const stateSlotIndex = readSlotIndex(eraContents)
  let blockSlotIndex = undefined
  if (stateSlotIndex.startSlot > 0) {
    blockSlotIndex = readSlotIndex(eraContents.slice(0, stateSlotIndex.recordStart))
  }
  return { stateSlotIndex, blockSlotIndex }
}

/**
 * Reads and SSZ-decodes the compressed beacon state snapshot from an era file.
 *
 * Fork-specific SSZ types are selected from the state slot number.
 * @throws If the state entry is missing or not CompressedBeaconState.
 */
export const readBeaconState = async (eraData: Uint8Array) => {
  const indices = getEraIndexes(eraData)
  const stateEntry = readEntry(
    eraData.slice(indices.stateSlotIndex.recordStart + indices.stateSlotIndex.slotOffsets[0]),
  )
  const data = await parseEntry(stateEntry)
  if (equalsBytes(stateEntry.type, EraTypes.CompressedBeaconState) === false) {
    throw EthereumJSErrorWithoutCode(`expected CompressedBeaconState type, got ${stateEntry.type}`)
  }
  const stateSlot = indices.stateSlotIndex.startSlot
  // TODO: Add a helper to identify the fork programmatically so the right types can be selected based on fork number rather
  // than hardcoded as below
  if (stateSlot < ssz.ForkSlots.Altair) return ssz.Phase0BeaconState.decode(data.data as Uint8Array)
  else if (stateSlot < ssz.ForkSlots.Bellatrix)
    return ssz.AltairBeaconState.decode(data.data as Uint8Array)
  else if (stateSlot < ssz.ForkSlots.Capella)
    return ssz.BellatrixBeaconState.decode(data.data as Uint8Array)
  else if (stateSlot < ssz.ForkSlots.Deneb)
    return ssz.CapellaBeaconState.decode(data.data as Uint8Array)
  else return ssz.ETH2_TYPES.BeaconState.decode(data.data as Uint8Array)
}

/**
 * Reads and SSZ-decodes one signed beacon block from an era file by slot offset index.
 *
 * @param offset Index into the block slot index (not the consensus slot number).
 * @throws If the block entry is missing or not CompressedSignedBeaconBlockType.
 */
export const readBeaconBlock = async (eraData: Uint8Array, offset: number) => {
  const indices = getEraIndexes(eraData)
  const blockEntry = readEntry(
    eraData.slice(
      indices.blockSlotIndex!.recordStart + indices.blockSlotIndex!.slotOffsets[offset],
    ),
  )

  const data = await parseEntry(blockEntry)
  if (equalsBytes(blockEntry.type, EraTypes.CompressedSignedBeaconBlockType) === false) {
    throw EthereumJSErrorWithoutCode(
      `expected CompressedSignedBeaconBlockType type, got ${bytesToHex(blockEntry.type)}`,
    )
  }

  const slot = indices.blockSlotIndex!.startSlot + offset
  if (slot < ssz.ForkSlots.Altair)
    return ssz.Phase0SignedBeaconBlock.decode(data.data as Uint8Array)
  else if (slot < ssz.ForkSlots.Bellatrix)
    return ssz.AltairSignedBeaconBlock.decode(data.data as Uint8Array)
  else if (slot < ssz.ForkSlots.Capella)
    return ssz.BellatrixSignedBeaconBlock.decode(data.data as Uint8Array)
  else if (slot < ssz.ForkSlots.Deneb)
    return ssz.CapellaSignedBeaconBlock.decode(data.data as Uint8Array)
  else return ssz.ETH2_TYPES.SignedBeaconBlock.decode(data.data as Uint8Array)
}

/**
 * Async generator over non-empty signed beacon blocks in an era file.
 *
 * Skips slots whose offset is zero (empty slot placeholders).
 */
export async function* readBlocksFromEra(eraFile: Uint8Array) {
  const indices = getEraIndexes(eraFile)
  const maxBlocks = indices.blockSlotIndex?.slotOffsets.length
  if (maxBlocks === undefined) {
    // Return early if no blocks are present
    return
  }

  for (let x = 0; x < maxBlocks; x++) {
    if (indices.blockSlotIndex!.slotOffsets[x] === 0) continue // skip empty slots
    const block = await readBeaconBlock(eraFile, x)
    yield block
  }
}
