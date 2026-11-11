import { localVerifiedBlock } from '../spine/chainHead.ts'
import type { EthySpine } from '../spine/types.ts'

export function headBlockNumber(spine: EthySpine): bigint {
  return localVerifiedBlock(spine) ?? spine.pivotBlockNumber ?? 0n
}
