import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { CLRequestType, bytesToHex, createCLRequest, hexToBytes } from '@ethereumjs/util'
import { sha256 } from '@noble/hashes/sha2.js'

import { createBlock, genRequestsRoot } from '../src'

// Enable EIP-7685 to support CLRequests
const common = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun, eips: [7685] })

// Create examples of the three CLRequest types
const createExampleRequests = () => {
  // Create a deposit request (type 0)
  const depositData = hexToBytes(
    '0x00ac842878bb70009552a4cfcad801d6e659c50bd50d7d03306790cb455ce7363c5b6972f0159d170f625a99b2064dbefc010000000000000000000000818ccb1c4eda80270b04d6df822b1e72dd83c3030040597307000000a747f75c72d0cf0d2b52504c7385b516f0523e2f0842416399f42b4aee5c6384a5674f6426b1cc3d0827886fa9b909e616f5c9f61f986013ed2b9bf37071cbae951136265b549f44e3c8e26233c0433e9124b7fd0dc86e82f9fedfc0a179d7690000000000000000',
  )
  const depositRequest = createCLRequest(depositData)

  // Create a withdrawal request (type 1)
  const withdrawalData = hexToBytes(
    '0x01000000000000000000000000000000000000000001000000000000000000000de0b6b3a7640000',
  )
  const withdrawalRequest = createCLRequest(withdrawalData)

  // Create a consolidation request (type 2)
  const consolidationData = hexToBytes('0x020000000100000000000000000000000000000000000001')
  const consolidationRequest = createCLRequest(consolidationData)

  // CLRequests must be sorted by type (Deposit=0, Withdrawal=1, Consolidation=2)
  return [depositRequest, withdrawalRequest, consolidationRequest]
}

// Generate a block with CLRequests
function createBlockWithCLRequests() {
  const requests = createExampleRequests()
  console.log(`Created ${requests.length} CLRequests:`)

  for (const req of requests) {
    console.log(
      `- Type: ${req.type} (${Object.keys(CLRequestType).find(
        (k) => CLRequestType[k as keyof typeof CLRequestType] === req.type,
      )})`,
    )
  }

  // Generate the requestsHash by hashing all the CLRequests
  const requestsHash = genRequestsRoot(requests, sha256)
  console.log(`Generated requestsHash: 0x${bytesToHex(requestsHash)}`)

  // Create a block with the CLRequests hash
  const block = createBlock({ header: { requestsHash } }, { common })
  console.log(`Created block hash: 0x${bytesToHex(block.hash())}`)

  return block
}

// Execute
createBlockWithCLRequests()
