import { createBlock, genRequestsRoot } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { bytesToHex, createCLRequest, hexToBytes } from '@ethereumjs/util'
import { sha256 } from '@noble/hashes/sha2.js'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Prague })

const depositData = hexToBytes(
  '0x00ac842878bb70009552a4cfcad801d6e659c50bd50d7d03306790cb455ce7363c5b6972f0159d170f625a99b2064dbefc010000000000000000000000818ccb1c4eda80270b04d6df822b1e72dd83c3030040597307000000a747f75c72d0cf0d2b52504c7385b516f0523e2f0842416399f42b4aee5c6384a5674f6426b1cc3d0827886fa9b909e616f5c9f61f986013ed2b9bf37071cbae951136265b549f44e3c8e26233c0433e9124b7fd0dc86e82f9fedfc0a179d7690000000000000000',
)
const withdrawalData = hexToBytes(
  '0x01000000000000000000000000000000000000000001000000000000000000000de0b6b3a7640000',
)
const consolidationData = hexToBytes('0x020000000100000000000000000000000000000000000001')

// Requests must be sorted by type (Deposit=0, Withdrawal=1, Consolidation=2)
const requests = [
  createCLRequest(depositData),
  createCLRequest(withdrawalData),
  createCLRequest(consolidationData),
]

const requestsHash = genRequestsRoot(requests, sha256)
const block = createBlock({ header: { requestsHash } }, { common })

console.log(`Created ${requests.length} CL requests`)
console.log(`requestsHash: ${bytesToHex(requestsHash)}`)
console.log(`Block hash: ${bytesToHex(block.hash())}`)
