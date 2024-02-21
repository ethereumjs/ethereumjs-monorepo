import { Block } from '@ethereumjs/block'
import { Hardfork } from '@ethereumjs/common'
import { hexToBytes } from '@ethereumjs/util'

import { Status } from '../types'

import { validHash } from './generic'

import type { Chain } from '../../../../blockchain'
import type { ChainCache, PayloadStatusV1 } from '../types'
import type { ExecutionPayload } from '@ethereumjs/block'

/**
 * Returns a block from a payload.
 * If errors, returns {@link PayloadStatusV1}
 */
export const assembleBlock = async (
  payload: ExecutionPayload,
  chain: Chain,
  chainCache: ChainCache
): Promise<{ block?: Block; error?: PayloadStatusV1 }> => {
  const { blockNumber, timestamp } = payload
  const { config } = chain
  const common = config.chainCommon.copy()

  // This is a post merge block, so set its common accordingly
  // Can't use setHardfork flag, as the transactions will need to be deserialized
  // first before the header can be constucted with their roots
  const ttd = common.hardforkTTD(Hardfork.Paris)
  common.setHardforkBy({ blockNumber, td: ttd !== null ? ttd : undefined, timestamp })

  try {
    const block = await Block.fromExecutionPayload(payload, { common })
    // TODO: validateData is also called in applyBlock while runBlock, may be it can be optimized
    // by removing/skipping block data validation from there
    await block.validateData()
    return { block }
  } catch (error) {
    const validationError = `Error assembling block from payload: ${error}`
    config.logger.error(validationError)
    const latestValidHash = await validHash(hexToBytes(payload.parentHash), chain, chainCache)
    const response = {
      status: `${error}`.includes('Invalid blockHash') ? Status.INVALID_BLOCK_HASH : Status.INVALID,
      latestValidHash,
      validationError,
    }
    return { error: response }
  }
}
