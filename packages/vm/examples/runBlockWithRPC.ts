import { createBlockFromJSONRPCProvider } from '@ethereumjs/block'
import { Common, Mainnet } from '@ethereumjs/common'
import { RPCStateManager } from '@ethereumjs/statemanager'
import { bytesToHex } from '@ethereumjs/util'
import { createVM, runBlock } from '@ethereumjs/vm'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'

const main = async () => {
  const providerUrl = process.argv[2]
  let blockNumber: bigint | undefined
  try {
    blockNumber = process.argv[3] !== undefined ? BigInt(process.argv[3]) : undefined
  } catch {
    // argument is not a valid block number
  }

  if (providerUrl === undefined || blockNumber === undefined) {
    console.log('Example skipped (real-world RPC scenario)')
    console.log('Usage: npx tsx runBlockWithRPC.ts <providerUrl> <blockNumber>')
    return
  }

  const kzg = new microEthKZG(trustedSetup)
  const common = new Common({ chain: Mainnet, customCrypto: { kzg } })

  // 1. Fetch block from RPC
  console.log(`Fetching block ${blockNumber} from ${providerUrl}...`)
  const block = await createBlockFromJSONRPCProvider(providerUrl, blockNumber, {
    common,
    setHardfork: true,
  })

  console.log(`Block ${block.header.number} fetched successfully`)
  console.log(`  Hash:         ${bytesToHex(block.hash())}`)
  console.log(`  Parent hash:  ${bytesToHex(block.header.parentHash)}`)
  console.log(`  State root:   ${bytesToHex(block.header.stateRoot)}`)
  console.log(`  Transactions: ${block.transactions.length}`)
  console.log(`  Gas used:     ${block.header.gasUsed}`)
  console.log(`  Hardfork:     ${block.common.hardfork()}`)

  // 2. Set up RPC state manager pointing to the parent block (pre-state)
  const stateManager = new RPCStateManager({
    provider: providerUrl,
    blockTag: blockNumber - 1n,
    common,
  })

  // 3. Create VM with the RPC state manager
  const vm = await createVM({ common, stateManager, setHardfork: true })

  // 4. Run the block
  console.log(`\nRunning block ${blockNumber} (${block.transactions.length} txs)...`)
  const startTime = performance.now()

  const result = await runBlock(vm, {
    block,
    generate: true,
    skipHeaderValidation: true,
    skipBlockValidation: true,
  })

  const elapsed = ((performance.now() - startTime) / 1000).toFixed(1)

  // 5. Display results
  console.log(`\nBlock execution completed in ${elapsed}s`)
  console.log(`  Tx results:     ${result.results.length}`)
  console.log(`  Receipts root:  ${bytesToHex(result.receiptsRoot)}`)

  console.log(`\n  Gas used:       ${result.gasUsed} (expected: ${block.header.gasUsed})`)
  if (result.gasUsed === block.header.gasUsed) {
    console.log(`  Gas used MATCHES expected block header value`)
  } else {
    console.log(`  Gas used MISMATCH`)
  }

  // Note: State root comparison is informational only.
  // RPCStateManager cannot produce valid Merkle state roots since it
  // doesn't maintain a local trie -- it fetches state on demand via RPC.
  console.log(`\n  Computed state root: ${bytesToHex(result.stateRoot)}`)
  console.log(`  Expected state root: ${bytesToHex(block.header.stateRoot)}`)
  console.log(`  (State root comparison is not meaningful with RPCStateManager,`)
  console.log(`   which does not maintain a local Merkle trie)`)
}

void main()
