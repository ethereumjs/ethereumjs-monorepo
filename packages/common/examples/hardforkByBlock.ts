import { Common, Hardfork, Mainnet } from '@ethereumjs/common'

const common = new Common({ chain: Mainnet })

// Pre-merge: block number alone determines the active hardfork
console.log(
  `HF at block 12_965_000 (London): ${common.getHardforkBy({ blockNumber: 12_965_000n })}`,
)
common.setHardforkBy({ blockNumber: 12_965_000n })
console.log(`After setHardforkBy: ${common.hardfork()}`)

// Post-merge: pass timestamp (and block number) for timestamp-based forks
common.setHardforkBy({ blockNumber: 19_000_000n, timestamp: 1_710_338_135n })
console.log(`HF at Cancun timestamp: ${common.hardfork()}`)

common.setHardforkBy({ blockNumber: 19_000_000n, timestamp: 1_746_612_311n })
console.log(`HF at Prague timestamp: ${common.hardfork()}`)
console.log(
  `Prague active on block 19M: ${common.hardforkIsActiveOnBlock(Hardfork.Prague, 19_000_000n)}`,
)
