import { EthereumJSErrorWithoutCode, bytesToHex, equalsBytes } from '@ethereumjs/util'
import * as ssz from 'micro-eth-signer/ssz'

import { EraTypes, parseEntry, readEntry } from '../index.ts'

import type { SlotIndex } from '../index.ts'

/**
 * Reads a Slot Index from the end of a bytestring representing an era file
 * @param bytes a Uint8Array bytestring representing a {@link SlotIndex} plus any arbitrary prefixed data
 * @returns a deserialized {@link SlotIndex}
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
 * Reads a an era file and extracts the State and Block slot indices
 * @param eraContents a bytestring representing a serialized era file
 * @returns a dictionary containing the State and Block Slot Indices (if present)
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
 *
 * @param eraData a bytestring representing an era file
 * @returns a BeaconState object of the type corresponding to the fork the state snapshot occurred at
 * @throws if BeaconState cannot be found
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
 *
 * @param eraData a bytestring representing an era file
 * @returns a decompressed SignedBeaconBlock object of the same time as returned by {@link ssz.ETH2_TYPES.SignedBeaconBlock}
 * @throws if SignedBeaconBlock is not found when reading an entry
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
 * Reads a an era file and yields a stream of decompressed SignedBeaconBlocks
 * @param eraFile Uint8Array a serialized era file
 * @returns a stream of decompressed SignedBeaconBlocks or undefined if no blocks are present
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
