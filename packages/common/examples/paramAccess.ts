import { Common, Hardfork, Mainnet } from '@ethereumjs/common'

// Hardfork-local params (defined on the BPO hardfork schedule)
const bpo = new Common({ chain: Mainnet, hardfork: Hardfork.Bpo1 })
console.log(`BPO target blob count: ${bpo.param('target')}`)

// Downstream packages ship default EIP param sets; inject manually on standalone Common
const common = new Common({ chain: Mainnet, hardfork: Hardfork.London })
common.updateParams({ 1559: { initialBaseFee: 1_000_000_000 } })
console.log(`London initialBaseFee: ${common.param('initialBaseFee')}`)

// paramByBlock() picks the hardfork active at a block (then reads the param)
console.log(`HF at block 12_965_000: ${common.getHardforkBy({ blockNumber: 12_965_000n })}`)
console.log(
  `initialBaseFee at block 12_965_000: ${common.paramByBlock('initialBaseFee', 12_965_000n)}`,
)
