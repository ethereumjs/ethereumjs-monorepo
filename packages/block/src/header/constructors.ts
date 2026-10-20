import type { Common } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import {
  BIGINT_0,
  EthereumJSErrorWithoutCode,
  TypeOutput,
  bigIntToBytes,
  equalsBytes,
  toType,
} from '@ethereumjs/util'

import { generateCliqueBlockExtraData } from '../consensus/clique.ts'
import { numberToHex, valuesArrayToHeaderData } from '../helpers.ts'
import { BlockHeader } from '../index.ts'

import type { BlockHeaderBytes, BlockOptions, HeaderData, JSONRPCBlock } from '../types.ts'

/** Resolve fork on a copy of `common` from raw header fields (for RLP length rules). */
function commonAtHeader(values: BlockHeaderBytes, opts: BlockOptions): Common | undefined {
  if (opts.common === undefined || opts.setHardfork !== true) {
    return opts.common
  }
  const headerData = valuesArrayToHeaderData(values)
  const common = opts.common.copy()
  common.setHardforkBy({
    blockNumber: toType(headerData.number, TypeOutput.BigInt) ?? BIGINT_0,
    timestamp: toType(headerData.timestamp, TypeOutput.BigInt) ?? BIGINT_0,
  })
  return common
}

/**
 * When trailing EIP header fields are omitted, `valuesArrayToHeaderData` mis-assigns
 * the last present field (e.g. slotNumber bytes read as blockAccessListHash).
 */
function reconcileHeaderDataFromRlpLength(
  values: BlockHeaderBytes,
  headerData: HeaderData,
  common: Common | undefined,
): HeaderData {
  if (common === undefined) {
    return headerData
  }
  const has7928 = common.isActivatedEIP(7928)
  const has7843 = common.isActivatedEIP(7843)
  if (has7928 && has7843 && values.length === 22) {
    const trailing = values[21] as Uint8Array | undefined
    if (trailing !== undefined && trailing.length < 32) {
      return {
        ...headerData,
        blockAccessListHash: undefined,
        slotNumber: trailing,
      }
    }
    if (trailing !== undefined && trailing.length === 32) {
      return {
        ...headerData,
        blockAccessListHash: trailing,
        slotNumber: undefined,
      }
    }
  }
  if (has7928 && !has7843 && values.length === 21) {
    return { ...headerData, blockAccessListHash: undefined }
  }
  if (has7843 && !has7928 && values.length === 21) {
    return { ...headerData, slotNumber: values[20] }
  }
  return headerData
}

/**
 * Instantiate a block header from {@link HeaderData}.
 *
 * @throws If header field validation fails in the {@link BlockHeader} constructor
 */
export function createBlockHeader(headerData: HeaderData = {}, opts: BlockOptions = {}) {
  return new BlockHeader(headerData, opts)
}

/**
 * Instantiate a block header from RLP-encoded field values.
 *
 * @throws If the values array length is out of range (15–23 fields)
 * @throws If required EIP fields are missing for the active hardfork
 * @throws If header field validation fails in the {@link BlockHeader} constructor
 */
export function createBlockHeaderFromBytesArray(values: BlockHeaderBytes, opts: BlockOptions = {}) {
  const commonAtHeaderFields = commonAtHeader(values, opts)
  let headerData = valuesArrayToHeaderData(values)
  headerData = reconcileHeaderDataFromRlpLength(values, headerData, commonAtHeaderFields)
  const { number, baseFeePerGas, excessBlobGas, blobGasUsed, parentBeaconBlockRoot, requestsHash } =
    headerData
  const header = createBlockHeader(headerData, opts)
  if (header.common.isActivatedEIP(1559) && baseFeePerGas === undefined) {
    const eip1559ActivationBlock = bigIntToBytes(header.common.eipBlock(1559)!)
    if (
      eip1559ActivationBlock !== undefined &&
      equalsBytes(eip1559ActivationBlock, number as Uint8Array)
    ) {
      throw EthereumJSErrorWithoutCode('invalid header. baseFeePerGas should be provided')
    }
  }
  if (header.common.isActivatedEIP(4844)) {
    if (excessBlobGas === undefined) {
      throw EthereumJSErrorWithoutCode('invalid header. excessBlobGas should be provided')
    } else if (blobGasUsed === undefined) {
      throw EthereumJSErrorWithoutCode('invalid header. blobGasUsed should be provided')
    }
  }
  if (header.common.isActivatedEIP(4788) && parentBeaconBlockRoot === undefined) {
    throw EthereumJSErrorWithoutCode('invalid header. parentBeaconBlockRoot should be provided')
  }

  if (header.common.isActivatedEIP(7685) && requestsHash === undefined) {
    throw EthereumJSErrorWithoutCode('invalid header. requestsHash should be provided')
  }
  if (header.common.isActivatedEIP(7843) && headerData.slotNumber === undefined) {
    throw EthereumJSErrorWithoutCode('invalid header. slotNumber should be provided')
  }
  return header
}

/**
 * Instantiate a block header from RLP-serialized bytes.
 *
 * @throws If RLP decode result is not an array
 * @throws If decoded values fail {@link createBlockHeaderFromBytesArray} checks
 */
export function createBlockHeaderFromRLP(
  serializedHeaderData: Uint8Array,
  opts: BlockOptions = {},
) {
  const values = RLP.decode(serializedHeaderData)
  if (!Array.isArray(values)) {
    throw EthereumJSErrorWithoutCode('Invalid serialized header input. Must be array')
  }
  return createBlockHeaderFromBytesArray(values as Uint8Array[], opts)
}

/**
 * Creates a Clique block header with the seal applied during instantiation.
 * @param headerData Header fields for the Clique block
 * @param cliqueSigner Private key bytes used to sign the header
 * @param opts {@link BlockOptions}
 * @returns A sealed {@link BlockHeader}
 */
export function createSealedCliqueBlockHeader(
  headerData: HeaderData = {},
  cliqueSigner: Uint8Array,
  opts: BlockOptions = {},
): BlockHeader {
  const sealedCliqueBlockHeader = new BlockHeader(headerData, {
    ...opts,
    ...{ skipConsensusFormatValidation: true },
  })
  ;(sealedCliqueBlockHeader.extraData as any) = generateCliqueBlockExtraData(
    sealedCliqueBlockHeader,
    cliqueSigner,
  )
  if (opts.skipConsensusFormatValidation === false)
    // We need to validate the consensus format here since we skipped it when constructing the block header
    sealedCliqueBlockHeader['_consensusFormatValidation']()
  return sealedCliqueBlockHeader
}

/**
 * Instantiate a block header from JSON-RPC block fields.
 *
 * @param blockParams - `eth_getBlockByNumber` / `eth_getBlockByHash` response
 */
export function createBlockHeaderFromRPC(blockParams: JSONRPCBlock, options?: BlockOptions) {
  const {
    parentHash,
    sha3Uncles,
    miner,
    stateRoot,
    transactionsRoot,
    receiptsRoot,
    logsBloom,
    difficulty,
    number,
    gasLimit,
    gasUsed,
    timestamp,
    extraData,
    mixHash,
    nonce,
    baseFeePerGas,
    withdrawalsRoot,
    blobGasUsed,
    excessBlobGas,
    parentBeaconBlockRoot,
    requestsHash,
    blockAccessListHash,
    slotNumber,
  } = blockParams

  const blockHeader = new BlockHeader(
    {
      parentHash,
      uncleHash: sha3Uncles,
      coinbase: miner,
      stateRoot,
      transactionsTrie: transactionsRoot,
      receiptTrie: receiptsRoot,
      logsBloom,
      difficulty: numberToHex(difficulty),
      number,
      gasLimit,
      gasUsed,
      timestamp,
      extraData,
      mixHash,
      nonce,
      baseFeePerGas,
      withdrawalsRoot,
      blobGasUsed,
      excessBlobGas,
      parentBeaconBlockRoot,
      requestsHash,
      blockAccessListHash,
      slotNumber,
    },
    options,
  )

  return blockHeader
}
