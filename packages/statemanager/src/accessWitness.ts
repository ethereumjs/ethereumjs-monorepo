import {
  BIGINT_0,
  VERKLE_BALANCE_LEAF_KEY,
  VERKLE_CODE_HASH_LEAF_KEY,
  VERKLE_CODE_OFFSET,
  VERKLE_CODE_SIZE_LEAF_KEY,
  VERKLE_HEADER_STORAGE_OFFSET,
  VERKLE_MAIN_STORAGE_OFFSET,
  VERKLE_NODE_WIDTH,
  VERKLE_NONCE_LEAF_KEY,
  VERKLE_VERSION_LEAF_KEY,
  bytesToBigInt,
  bytesToHex,
  getVerkleKey,
  getVerkleStem,
  getVerkleTreeIndicesForCodeChunk,
  hexToBytes,
  intToBytes,
} from '@ethereumjs/util'
import debugDefault from 'debug'

import type { AccessEventFlags, AccessWitnessInterface } from '@ethereumjs/common'
import type { Address, PrefixedHexString, VerkleCrypto } from '@ethereumjs/util'

const debug = debugDefault('statemanager:verkle:aw')

/**
 * Tree key constants.
 */
const WitnessBranchReadCost = BigInt(1900)
const WitnessChunkReadCost = BigInt(200)
const WitnessBranchWriteCost = BigInt(3000)
const WitnessChunkWriteCost = BigInt(500)
const WitnessChunkFillCost = BigInt(6200)

// read is a default access event if stem or chunk is present
type StemAccessEvent = { write?: boolean }
// chunk fill access event is not being charged right now in kaustinen but will be rectified
// in upcoming iterations
type ChunkAccessEvent = StemAccessEvent & { fill?: boolean }

// Since stem is pedersen hashed, it is useful to maintain the reverse relationship
type StemMeta = { address: Address; treeIndex: number | bigint }
type RawAccessedState = {
  address: Address
  treeIndex: number | bigint
  chunkIndex: number
  chunkKey: PrefixedHexString
}

export enum AccessedStateType {
  Version = 'version',
  Balance = 'balance',
  Nonce = 'nonce',
  CodeHash = 'codeHash',
  CodeSize = 'codeSize',
  Code = 'code',
  Storage = 'storage',
}

type AccessedState =
  | { type: Exclude<AccessedStateType, AccessedStateType.Code | AccessedStateType.Storage> }
  | { type: AccessedStateType.Code; codeOffset: number }
  | { type: AccessedStateType.Storage; slot: bigint }
export type AccessedStateWithAddress = AccessedState & {
  address: Address
  chunkKey: PrefixedHexString
}

export class AccessWitness implements AccessWitnessInterface {
  stems: Map<PrefixedHexString, StemAccessEvent & StemMeta>
  chunks: Map<PrefixedHexString, ChunkAccessEvent>
  verkleCrypto: VerkleCrypto
  constructor(
    opts: {
      verkleCrypto?: VerkleCrypto
      stems?: Map<PrefixedHexString, StemAccessEvent & StemMeta>
      chunks?: Map<PrefixedHexString, ChunkAccessEvent>
    } = {}
  ) {
    if (opts.verkleCrypto === undefined) {
      throw new Error('verkle crypto required')
    }
    this.verkleCrypto = opts.verkleCrypto
    this.stems = opts.stems ?? new Map<PrefixedHexString, StemAccessEvent & StemMeta>()
    this.chunks = opts.chunks ?? new Map<PrefixedHexString, ChunkAccessEvent>()
  }

  touchAndChargeProofOfAbsence(address: Address): bigint {
    let gas = BIGINT_0

    gas += this.touchAddressOnReadAndComputeGas(address, 0, VERKLE_VERSION_LEAF_KEY)
    gas += this.touchAddressOnReadAndComputeGas(address, 0, VERKLE_BALANCE_LEAF_KEY)
    gas += this.touchAddressOnReadAndComputeGas(address, 0, VERKLE_CODE_SIZE_LEAF_KEY)
    gas += this.touchAddressOnReadAndComputeGas(address, 0, VERKLE_CODE_HASH_LEAF_KEY)
    gas += this.touchAddressOnReadAndComputeGas(address, 0, VERKLE_NONCE_LEAF_KEY)

    return gas
  }

  touchAndChargeMessageCall(address: Address): bigint {
    let gas = BIGINT_0

    gas += this.touchAddressOnReadAndComputeGas(address, 0, VERKLE_VERSION_LEAF_KEY)
    gas += this.touchAddressOnReadAndComputeGas(address, 0, VERKLE_CODE_SIZE_LEAF_KEY)

    return gas
  }

  touchAndChargeValueTransfer(caller: Address, target: Address): bigint {
    let gas = BIGINT_0

    gas += this.touchAddressOnWriteAndComputeGas(caller, 0, VERKLE_BALANCE_LEAF_KEY)
    gas += this.touchAddressOnWriteAndComputeGas(target, 0, VERKLE_BALANCE_LEAF_KEY)

    return gas
  }

  touchAndChargeContractCreateInit(address: Address): bigint {
    let gas = BIGINT_0

    gas += this.touchAddressOnWriteAndComputeGas(address, 0, VERKLE_VERSION_LEAF_KEY)
    gas += this.touchAddressOnWriteAndComputeGas(address, 0, VERKLE_NONCE_LEAF_KEY)

    return gas
  }

  touchAndChargeContractCreateCompleted(address: Address): bigint {
    let gas = BIGINT_0

    gas += this.touchAddressOnWriteAndComputeGas(address, 0, VERKLE_VERSION_LEAF_KEY)
    gas += this.touchAddressOnWriteAndComputeGas(address, 0, VERKLE_BALANCE_LEAF_KEY)
    gas += this.touchAddressOnWriteAndComputeGas(address, 0, VERKLE_CODE_SIZE_LEAF_KEY)
    gas += this.touchAddressOnWriteAndComputeGas(address, 0, VERKLE_CODE_HASH_LEAF_KEY)
    gas += this.touchAddressOnWriteAndComputeGas(address, 0, VERKLE_NONCE_LEAF_KEY)

    return gas
  }

  touchTxOriginAndComputeGas(origin: Address): bigint {
    let gas = BIGINT_0

    gas += this.touchAddressOnReadAndComputeGas(origin, 0, VERKLE_VERSION_LEAF_KEY)
    gas += this.touchAddressOnReadAndComputeGas(origin, 0, VERKLE_CODE_SIZE_LEAF_KEY)
    gas += this.touchAddressOnReadAndComputeGas(origin, 0, VERKLE_CODE_HASH_LEAF_KEY)

    gas += this.touchAddressOnWriteAndComputeGas(origin, 0, VERKLE_NONCE_LEAF_KEY)
    gas += this.touchAddressOnWriteAndComputeGas(origin, 0, VERKLE_BALANCE_LEAF_KEY)

    return gas
  }

  touchTxTargetAndComputeGas(target: Address, { sendsValue }: { sendsValue?: boolean } = {}) {
    let gas = BIGINT_0

    gas += this.touchAddressOnReadAndComputeGas(target, 0, VERKLE_VERSION_LEAF_KEY)
    gas += this.touchAddressOnReadAndComputeGas(target, 0, VERKLE_CODE_SIZE_LEAF_KEY)
    gas += this.touchAddressOnReadAndComputeGas(target, 0, VERKLE_CODE_HASH_LEAF_KEY)
    gas += this.touchAddressOnReadAndComputeGas(target, 0, VERKLE_NONCE_LEAF_KEY)

    if (sendsValue === true) {
      gas += this.touchAddressOnWriteAndComputeGas(target, 0, VERKLE_BALANCE_LEAF_KEY)
    } else {
      gas += this.touchAddressOnReadAndComputeGas(target, 0, VERKLE_BALANCE_LEAF_KEY)
    }

    return gas
  }

  touchCodeChunksRangeOnReadAndChargeGas(contact: Address, startPc: number, endPc: number): bigint {
    let gas = BIGINT_0
    for (let chunkNum = Math.floor(startPc / 31); chunkNum <= Math.floor(endPc / 31); chunkNum++) {
      const { treeIndex, subIndex } = getVerkleTreeIndicesForCodeChunk(chunkNum)
      gas += this.touchAddressOnReadAndComputeGas(contact, treeIndex, subIndex)
    }
    return gas
  }

  touchCodeChunksRangeOnWriteAndChargeGas(
    contact: Address,
    startPc: number,
    endPc: number
  ): bigint {
    let gas = BIGINT_0
    for (let chunkNum = Math.floor(startPc / 31); chunkNum <= Math.floor(endPc / 31); chunkNum++) {
      const { treeIndex, subIndex } = getVerkleTreeIndicesForCodeChunk(chunkNum)
      gas += this.touchAddressOnWriteAndComputeGas(contact, treeIndex, subIndex)
    }
    return gas
  }

  touchAddressOnWriteAndComputeGas(
    address: Address,
    treeIndex: number | bigint,
    subIndex: number | Uint8Array
  ): bigint {
    return this.touchAddressAndChargeGas(address, treeIndex, subIndex, { isWrite: true })
  }

  touchAddressOnReadAndComputeGas(
    address: Address,
    treeIndex: number | bigint,
    subIndex: number | Uint8Array
  ): bigint {
    return this.touchAddressAndChargeGas(address, treeIndex, subIndex, { isWrite: false })
  }

  touchAddressAndChargeGas(
    address: Address,
    treeIndex: number | bigint,
    subIndex: number | Uint8Array,
    { isWrite }: { isWrite?: boolean }
  ): bigint {
    let gas = BIGINT_0

    const { stemRead, stemWrite, chunkRead, chunkWrite, chunkFill } = this.touchAddress(
      address,
      treeIndex,
      subIndex,
      { isWrite }
    )

    if (stemRead === true) {
      gas += WitnessBranchReadCost
    }
    if (stemWrite === true) {
      gas += WitnessBranchWriteCost
    }

    if (chunkRead === true) {
      gas += WitnessChunkReadCost
    }
    if (chunkWrite === true) {
      gas += WitnessChunkWriteCost
    }
    if (chunkFill === true) {
      gas += WitnessChunkFillCost
    }

    debug(
      `touchAddressAndChargeGas=${gas} address=${address} treeIndex=${treeIndex} subIndex=${subIndex}`
    )

    return gas
  }

  touchAddress(
    address: Address,
    treeIndex: number | bigint,
    subIndex: number | Uint8Array,
    { isWrite }: { isWrite?: boolean } = {}
  ): AccessEventFlags {
    let stemRead = false,
      stemWrite = false,
      chunkRead = false,
      chunkWrite = false
    // currently there are no gas charges for setting the chunk for the first time
    // i.e. no fill cost is charged right now
    const chunkFill = false

    const accessedStemKey = getVerkleStem(this.verkleCrypto, address, treeIndex)
    const accessedStemHex = bytesToHex(accessedStemKey)
    let accessedStem = this.stems.get(accessedStemHex)
    if (accessedStem === undefined) {
      stemRead = true
      accessedStem = { address, treeIndex }
      this.stems.set(accessedStemHex, accessedStem)
    }

    const accessedChunkKey = getVerkleKey(
      accessedStemKey,
      typeof subIndex === 'number' ? intToBytes(subIndex) : subIndex
    )
    const accessedChunkKeyHex = bytesToHex(accessedChunkKey)
    let accessedChunk = this.chunks.get(accessedChunkKeyHex)
    if (accessedChunk === undefined) {
      chunkRead = true
      accessedChunk = {}
      this.chunks.set(accessedChunkKeyHex, accessedChunk)
    }

    if (isWrite === true) {
      if (accessedStem.write !== true) {
        stemWrite = true
        // this would also directly modify in the map
        accessedStem.write = true
      }

      if (accessedChunk.write !== true) {
        chunkWrite = true
        // this would also directly modify in the map
        accessedChunk.write = true
      }
    }

    debug(
      `${accessedChunkKeyHex}: isWrite=${isWrite} for steamRead=${stemRead} stemWrite=${stemWrite} chunkRead=${chunkRead} chunkWrite=${chunkWrite} chunkFill=${chunkFill}`
    )
    return { stemRead, stemWrite, chunkRead, chunkWrite, chunkFill }
  }

  /**Create a shallow copy, could clone some caches in future for optimizations */
  shallowCopy(): AccessWitness {
    return new AccessWitness({ verkleCrypto: this.verkleCrypto })
  }

  merge(accessWitness: AccessWitness): void {
    for (const [chunkKey, chunkValue] of accessWitness.chunks.entries()) {
      const stemKey = chunkKey.slice(0, chunkKey.length - 2) as PrefixedHexString
      const stem = accessWitness.stems.get(stemKey)
      if (stem === undefined) {
        throw Error(`Internal error: missing stem for the chunkKey=${chunkKey}`)
      }

      const thisStem = this.stems.get(stemKey)
      if (thisStem === undefined) {
        this.stems.set(stemKey, stem)
      } else {
        thisStem.write = thisStem.write !== true ? stem.write : true
      }

      const thisChunk = this.chunks.get(chunkKey)
      if (thisChunk === undefined) {
        this.chunks.set(chunkKey, chunkValue)
      } else {
        thisChunk.write = thisChunk.write !== true ? chunkValue.write : true
        thisChunk.fill = thisChunk.fill !== true ? thisChunk.fill : true
      }
    }
  }

  *rawAccesses(): Generator<RawAccessedState> {
    for (const chunkKey of this.chunks.keys()) {
      // drop the last byte
      const stemKey = chunkKey.slice(0, chunkKey.length - 2) as PrefixedHexString
      const stem = this.stems.get(stemKey)
      if (stem === undefined) {
        throw Error(`Internal error: missing stem for the chunkKey=${chunkKey}`)
      }
      const { address, treeIndex } = stem
      const chunkIndex = Number(`0x${chunkKey.slice(chunkKey.length - 2)}`)
      const accessedState = { address, treeIndex, chunkIndex, chunkKey }
      yield accessedState
    }
  }

  *accesses(): Generator<AccessedStateWithAddress> {
    for (const rawAccess of this.rawAccesses()) {
      const { address, treeIndex, chunkIndex, chunkKey } = rawAccess
      const accessedState = decodeAccessedState(treeIndex, chunkIndex)
      yield { ...accessedState, address, chunkKey }
    }
  }
}

export function decodeAccessedState(treeIndex: number | bigint, chunkIndex: number): AccessedState {
  const position = BigInt(treeIndex) * BigInt(VERKLE_NODE_WIDTH) + BigInt(chunkIndex)
  switch (position) {
    case BigInt(0):
      return { type: AccessedStateType.Version }
    case BigInt(1):
      return { type: AccessedStateType.Balance }
    case BigInt(2):
      return { type: AccessedStateType.Nonce }
    case BigInt(3):
      return { type: AccessedStateType.CodeHash }
    case BigInt(4):
      return { type: AccessedStateType.CodeSize }
    default:
      if (position < VERKLE_HEADER_STORAGE_OFFSET) {
        throw Error(`No attribute yet stored >=5 and <${VERKLE_HEADER_STORAGE_OFFSET}`)
      }

      if (position >= VERKLE_HEADER_STORAGE_OFFSET && position < VERKLE_CODE_OFFSET) {
        const slot = position - BigInt(VERKLE_HEADER_STORAGE_OFFSET)
        return { type: AccessedStateType.Storage, slot }
      } else if (position >= VERKLE_CODE_OFFSET && position < VERKLE_MAIN_STORAGE_OFFSET) {
        const codeChunkIdx = Number(position) - VERKLE_CODE_OFFSET
        return { type: AccessedStateType.Code, codeOffset: codeChunkIdx * 31 }
      } else if (position >= VERKLE_MAIN_STORAGE_OFFSET) {
        const slot = BigInt(position - VERKLE_MAIN_STORAGE_OFFSET)
        return { type: AccessedStateType.Storage, slot }
      } else {
        throw Error(
          `Invalid treeIndex=${treeIndex} chunkIndex=${chunkIndex} for verkle tree access`
        )
      }
  }
}

export function decodeValue(type: AccessedStateType, value: PrefixedHexString | null): string {
  if (value === null) {
    return ''
  }

  switch (type) {
    case AccessedStateType.Version:
    case AccessedStateType.Balance:
    case AccessedStateType.Nonce:
    case AccessedStateType.CodeSize: {
      const decodedValue = bytesToBigInt(hexToBytes(value), true)
      return `${decodedValue}`
    }

    case AccessedStateType.CodeHash:
    case AccessedStateType.Code:
    case AccessedStateType.Storage: {
      return value
    }
  }
}
