import { Common, Hardfork, Mainnet } from '@ethereumjs/common'

// Default-on via hardfork schedule (Prague ships EIP-7702)
const prague = new Common({ chain: Mainnet, hardfork: Hardfork.Prague })
console.log(`EIP-7702 on Prague: ${prague.isActivatedEIP(7702)}`)

// Opt-in before schedule: activate on an earlier hardfork via constructor `eips`
const early7702 = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun, eips: [7702] })
console.log(`EIP-7702 forced on Cancun: ${early7702.isActivatedEIP(7702)}`)

// Experimental Amsterdam fork (in development) — full bundle via Hardfork.Amsterdam
const amsterdam = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
console.log(`EIP-7928 BAL on Amsterdam: ${amsterdam.isActivatedEIP(7928)}`)
console.log(`EIP-7708 transfer logs: ${amsterdam.isActivatedEIP(7708)}`)
console.log(`EIP-8037 two-dimensional gas: ${amsterdam.isActivatedEIP(8037)}`)
console.log(`EIP-7843 SLOTNUM / slotNumber: ${amsterdam.isActivatedEIP(7843)}`)
