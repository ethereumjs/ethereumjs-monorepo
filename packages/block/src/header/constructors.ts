import { RLP } from '@ethereumjs/rlp'
import { bigIntToBytes, equalsBytes } from '@ethereumjs/util'

import { generateCliqueBlockExtraData } from '../consensus/clique.js'
import { valuesArrayToHeaderData } from '../helpers.js'
import { BlockHeader } from '../index.js'

import type { BlockHeaderBytes, BlockOptions, HeaderData } from '../types.js'

/**
 * Static constructor to create a block header from a header data dictionary
 *
 * @param headerData
 * @param opts
 */
export function createBlockHeader(headerData: HeaderData = {}, opts: BlockOptions = {}) {
  return new BlockHeader(headerData, opts)
}

/**
 * Static constructor to create a block header from an array of Bytes values
 *
 * @param values
 * @param opts
 */
export function createBlockHeaderFromValuesArray(
  values: BlockHeaderBytes,
  opts: BlockOptions = {},
) {
  const headerData = valuesArrayToHeaderData(values)
  const { number, baseFeePerGas, excessBlobGas, blobGasUsed, parentBeaconBlockRoot, requestsRoot } =
    headerData
  const header = createBlockHeader(headerData, opts)
  if (header.common.isActivatedEIP(1559) && baseFeePerGas === undefined) {
    const eip1559ActivationBlock = bigIntToBytes(header.common.eipBlock(1559)!)
    if (
      eip1559ActivationBlock !== undefined &&
      equalsBytes(eip1559ActivationBlock, number as Uint8Array)
    ) {
      throw new Error('invalid header. baseFeePerGas should be provided')
    }
  }
  if (header.common.isActivatedEIP(4844)) {
    if (excessBlobGas === undefined) {
      throw new Error('invalid header. excessBlobGas should be provided')
    } else if (blobGasUsed === undefined) {
      throw new Error('invalid header. blobGasUsed should be provided')
    }
  }
  if (header.common.isActivatedEIP(4788) && parentBeaconBlockRoot === undefined) {
    throw new Error('invalid header. parentBeaconBlockRoot should be provided')
  }

  if (header.common.isActivatedEIP(7685) && requestsRoot === undefined) {
    throw new Error('invalid header. requestsRoot should be provided')
  }
  return header
}

/**
 * Static constructor to create a block header from a RLP-serialized header
 *
 * @param serializedHeaderData
 * @param opts
 */
export function createBlockHeaderFromRLP(
  serializedHeaderData: Uint8Array,
  opts: BlockOptions = {},
) {
  const values = RLP.decode(serializedHeaderData)
  if (!Array.isArray(values)) {
    throw new Error('Invalid serialized header input. Must be array')
  }
  return createBlockHeaderFromValuesArray(values as Uint8Array[], opts)
}

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
