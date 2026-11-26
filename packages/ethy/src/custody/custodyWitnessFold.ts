import type { BALInput } from '@ethereumjs/util'
import { bytesToUnprefixedHex } from '@ethereumjs/util'

import { ethyKeccak256 } from '../crypto/keccak.ts'
import type { EthySpine } from '../spine/types.ts'
import type { WitnessFoldContext } from '../staty/witnessFold.ts'
import type { StatyWriteIndex } from '../staty/writeIndex.ts'
import { onboardingBalStartBlock } from '../sync/blockCalendar.ts'

export function buildWitnessFoldContext(
  spine: EthySpine,
  writeIndex: StatyWriteIndex,
): WitnessFoldContext {
  const latest = Number(spine.lastVerifiedBlockNumber ?? spine.pivotBlockNumber ?? 0n)
  const earliest = Number(
    spine.balWindow.length > 0
      ? spine.balWindow[0]!.blockNumber
      : onboardingBalStartBlock(BigInt(latest)),
  )
  const balByBlock = new Map<number, BALInput>()
  for (const row of spine.balWindow) {
    if (row.balJson !== undefined) {
      balByBlock.set(Number(row.blockNumber), row.balJson)
    }
  }
  return {
    localBalEarliestBlock: earliest,
    latestVerifiedBlock: latest,
    stateRootAt: (block) => {
      if (spine.pivotBlockNumber !== undefined && block === Number(spine.pivotBlockNumber)) {
        return spine.pivotStateRoot
      }
      const hit = spine.balWindow.find((r) => r.blockNumber === BigInt(block))
      return hit !== undefined ? spine.pivotStateRoot : undefined
    },
    readVerifiedBal: (block) => balByBlock.get(block),
    writeIndex,
    keccak256: ethyKeccak256,
  }
}

export function accountHashHex(accountHash: Uint8Array): string {
  return bytesToUnprefixedHex(accountHash)
}
