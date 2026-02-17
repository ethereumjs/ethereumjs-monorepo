import * as fs from 'node:fs'
import * as path from 'node:path'
/**
 * Offline mainnet block replay.
 * Loads pre-captured block JSON and state data, populates a MerkleStateManager,
 * and runs the block entirely offline (no RPC calls needed).
 *
 * Usage: npx tsx examples/runMainnetBlock.ts <blockNumber>
 * Example: npx tsx examples/runMainnetBlock.ts 24476000
 *
 * Data files are expected at:
 *   examples/data/block<blockNumber>.json
 *   examples/data/block<blockNumber>State.json
 */
import { createBlockFromRPC } from '@ethereumjs/block'
import { Common, Mainnet } from '@ethereumjs/common'
import { MerkleStateManager } from '@ethereumjs/statemanager'
import {
  Account,
  bytesToHex,
  createAddressFromString,
  hexToBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import { createVM, runBlock } from '@ethereumjs/vm'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'

interface StateData {
  accounts: Record<string, { nonce: string; balance: string } | null>
  code: Record<string, string>
  storage: Record<string, Record<string, string>>
}

const main = async () => {
  let blockNumber: bigint | undefined
  try {
    blockNumber = process.argv[2] !== undefined ? BigInt(process.argv[2]) : undefined
  } catch {
    // argument is not a valid block number
  }

  if (blockNumber === undefined) {
    console.log('Example skipped (no block number provided)')
    console.log('Usage: npx tsx examples/runMainnetBlock.ts <blockNumber>')
    return
  }

  const dataDir = path.resolve(import.meta.dirname, 'data')
  const blockFile = path.join(dataDir, `block${blockNumber}.json`)
  const stateFile = path.join(dataDir, `block${blockNumber}State.json`)

  if (!fs.existsSync(blockFile) || !fs.existsSync(stateFile)) {
    console.log(`Data files not found for block ${blockNumber}`)
    console.log(`  Expected: ${blockFile}`)
    console.log(`  Expected: ${stateFile}`)
    return
  }

  // 1. Load block JSON and state data
  console.log(`Loading data for block ${blockNumber}...`)
  const blockJSON = JSON.parse(fs.readFileSync(blockFile, 'utf8'))
  const stateData: StateData = JSON.parse(fs.readFileSync(stateFile, 'utf8'))

  // 2. Set up Common with KZG
  const kzg = new microEthKZG(trustedSetup)
  const common = new Common({ chain: Mainnet, customCrypto: { kzg } })

  // 3. Create MerkleStateManager and populate with collected pre-state
  console.log('Populating state manager...')
  const stateManager = new MerkleStateManager({ common })

  await stateManager.checkpoint()

  // Load accounts first (must exist before storage/code can be set)
  for (const [addrHex, accountData] of Object.entries(stateData.accounts)) {
    if (accountData === null) continue
    const address = createAddressFromString(addrHex)
    const account = new Account(BigInt(accountData.nonce), BigInt(accountData.balance))
    await stateManager.putAccount(address, account)
  }

  // Load storage slots (skip addresses with explicitly null accounts — they don't exist
  // at pre-state, so their storage is empty by default and was only captured because the
  // VM queried it during execution after creating the account)
  for (const [addrHex, slots] of Object.entries(stateData.storage)) {
    if (stateData.accounts[addrHex] === null) continue
    const address = createAddressFromString(addrHex)
    for (const [keyHex, valueHex] of Object.entries(slots)) {
      const key = setLengthLeft(hexToBytes(keyHex as `0x${string}`), 32)
      const value = hexToBytes(valueHex as `0x${string}`)
      if (value.length > 0) {
        await stateManager.putStorage(address, key, value)
      }
    }
  }

  // Load code (skip addresses with explicitly null accounts — code was deployed during execution)
  for (const [addrHex, codeHex] of Object.entries(stateData.code)) {
    if (codeHex === '0x' || codeHex === '') continue
    if (stateData.accounts[addrHex] === null) continue
    const address = createAddressFromString(addrHex)
    await stateManager.putCode(address, hexToBytes(codeHex as `0x${string}`))
  }

  // Re-set account nonce/balance after putCode/putStorage
  // (putCode and putStorage may create accounts with default nonce/balance)
  for (const [addrHex, accountData] of Object.entries(stateData.accounts)) {
    if (accountData === null) continue
    const address = createAddressFromString(addrHex)
    const existing = await stateManager.getAccount(address)
    if (existing !== undefined) {
      existing.nonce = BigInt(accountData.nonce)
      existing.balance = BigInt(accountData.balance)
      await stateManager.putAccount(address, existing)
    }
  }

  await stateManager.commit()

  const accountCount = Object.values(stateData.accounts).filter((a) => a !== null).length
  const codeCount = Object.values(stateData.code).filter((c) => c !== '0x' && c !== '').length
  const storageSlotCount = Object.values(stateData.storage).reduce(
    (sum, slots) => sum + Object.keys(slots).length,
    0,
  )
  console.log(
    `  Loaded ${accountCount} accounts, ${codeCount} contracts, ${storageSlotCount} storage slots`,
  )

  // 4. Create block from saved JSON
  const block = createBlockFromRPC(blockJSON, [], { common, setHardfork: true })
  console.log(
    `Block ${block.header.number}: ${block.transactions.length} txs, hardfork=${block.common.hardfork()}`,
  )

  // 5. Create VM and run the block
  const vm = await createVM({ common, stateManager, setHardfork: true })

  console.log(`\nRunning block ${block.header.number} (${block.transactions.length} txs)...`)
  const startTime = performance.now()

  const result = await runBlock(vm, {
    block,
    generate: true,
    skipHeaderValidation: true,
    skipBlockValidation: true,
  })

  const elapsed = ((performance.now() - startTime) / 1000).toFixed(1)

  // 6. Display and validate results
  console.log(`\nBlock execution completed in ${elapsed}s`)
  console.log(`  Tx results:     ${result.results.length}`)
  console.log(`  Receipts root:  ${bytesToHex(result.receiptsRoot)}`)

  console.log(`\n  Gas used:       ${result.gasUsed} (expected: ${block.header.gasUsed})`)
  if (result.gasUsed === block.header.gasUsed) {
    console.log(`  ✓ Gas used MATCHES expected block header value`)
  } else {
    console.log(`  ✗ Gas used MISMATCH`)
    process.exit(1)
  }
}

void main()
