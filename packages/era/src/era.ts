import { equalsBytes } from '@ethereumjs/util'
import * as ssz from 'micro-eth-signer/ssz'

import {
  AltairBeaconState,
  BellatrixBeaconState,
  EraTypes,
  parseEntry,
  readEntry,
} from './index.js'

import type { SlotIndex } from './index.js'

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
    throw new Error(`expected SlotIndex type, got ${slotIndexEntry.type}`)
  }

  const startSlot = Number(
    new DataView(slotIndexEntry.data.slice(0, 8).buffer).getBigInt64(0, true),
  )
  const slotOffsets = []

  for (let i = 0; i < count; i++) {
    const slotEntry = slotIndexEntry.data.subarray((i + 1) * 8, (i + 2) * 8)
    const slotOffset = Number(new DataView(slotEntry.slice(0, 8).buffer).getBigInt64(0, true))
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
 * @returns a BeaconState object of the same time as returned by {@link ssz.ETH2_TYPES.BeaconState}
 * @throws if BeaconState cannot be found
 */
export const readBeaconState = async (eraData: Uint8Array, fork: string) => {
  const indices = getEraIndexes(eraData)
  const stateEntry = readEntry(
    eraData.slice(indices.stateSlotIndex.recordStart + indices.stateSlotIndex.slotOffsets[0]),
  )
  const data = await parseEntry(stateEntry)
  if (equalsBytes(stateEntry.type, EraTypes.CompressedBeaconState) === false) {
    throw new Error(`expected CompressedBeaconState type, got ${stateEntry.type}`)
  }
  switch (fork) {
    case 'bellatrix':
      return BellatrixBeaconState.decode(data.data as Uint8Array)
    case 'altair':
      return AltairBeaconState.decode(data.data as Uint8Array)
    default:
      return ssz.ETH2_TYPES.BeaconState.decode(data.data as Uint8Array)
  }
}

/**
 *
 * @param eraData a bytestring representing an era file
 * @returns a decompressed SignedBeaconBlock object of the same time as returned by {@link ssz.ETH2_TYPES.SignedBeaconBlock}
 * @throws if SignedBeaconBlock cannot be found
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
    throw new Error(`expected CompressedSignedBeaconBlockType type, got ${blockEntry.type}`)
  }
  return ssz.ETH2_TYPES.SignedBeaconBlock.decode(data.data as Uint8Array)
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
    try {
      const block = await readBeaconBlock(eraFile, x)
      yield block
    } catch {
      // noop - we skip empty slots
    }
  }
}
