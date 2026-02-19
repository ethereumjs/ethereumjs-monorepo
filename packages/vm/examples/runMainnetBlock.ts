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
 *
 * Known issues:
 *   Block 24476002: VM gas mismatch (17945809 vs expected 18980393).
 *   Block 24476006: VM gas mismatch (59807084 vs expected 59826984).
 *   Block 24476007: VM gas mismatch (1986185 vs expected 3544160).
 *   Block 24476008: VM gas mismatch (44711077 vs expected 44733384).
 *     Data files are saved for debugging but the offline replay will fail.
 *     These mismatches also reproduce with the plain RPC script (runBlockWithRPC.ts),
 *     so this is a VM execution bug, not a data collection issue.
 */
import { createBlockFromRPC } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
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

const runSingleBlock = async (blockNumber: bigint) => {
  const dataDir = path.resolve(import.meta.dirname, 'data')
  const blockFile = path.join(dataDir, `block${blockNumber}.json`)
  const stateFile = path.join(dataDir, `block${blockNumber}State.json`)

  if (!fs.existsSync(blockFile) || !fs.existsSync(stateFile)) {
    console.log(`Data files not found for block ${blockNumber}`)
    console.log(`  Expected: ${blockFile}`)
    console.log(`  Expected: ${stateFile}`)
    return undefined
  }

  // 1. Load block JSON and state data
  console.log(`Loading data for block ${blockNumber}...`)
  const blockJSON = JSON.parse(fs.readFileSync(blockFile, 'utf8'))
  const stateData: StateData = JSON.parse(fs.readFileSync(stateFile, 'utf8'))

  // 2. Set up Common with KZG
  const kzg = new microEthKZG(trustedSetup)
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam, customCrypto: { kzg } })

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
  const block = createBlockFromRPC(blockJSON, [], { common })
  console.log(
    `Block ${block.header.number}: ${block.transactions.length} txs, hardfork=${block.common.hardfork()}`,
  )

  // 5. Create VM and run the block
  const vm = await createVM({ common, stateManager })

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
    console.log(`  ✗ Gas used MISMATCH (continuing anyway)`)
  }

  return result
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
    console.log('       npx tsx examples/runMainnetBlock.ts <startBlock> <endBlock>')
    return
  }

  const endBlockNumber = process.argv[3] !== undefined ? BigInt(process.argv[3]) : blockNumber

  const outputDir = path.resolve(import.meta.dirname, 'data', 'bals')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  for (let bn = blockNumber; bn <= endBlockNumber; bn++) {
    console.log(`\n${'='.repeat(80)}`)
    console.log(`Processing block ${bn}`)
    console.log(`${'='.repeat(80)}\n`)

    const result = await runSingleBlock(bn)
    if (result === undefined) {
      console.log(`  Skipping block ${bn} (no data files)\n`)
      continue
    }

    const bal = result.blockLevelAccessList
    if (bal === undefined) {
      console.log(`  No BAL generated for block ${bn} (EIP-7928 not active?)\n`)
      continue
    }

    // Save JSON
    const jsonFile = path.join(outputDir, `bal${bn}JSON.json`)
    const jsonOutput = JSON.stringify(bal.toJSON(), null, 2)
    fs.writeFileSync(jsonFile, jsonOutput)

    // Save RLP (hex-encoded bytes)
    const rlpFile = path.join(outputDir, `bal${bn}RLP.txt`)
    const rlpOutput = bytesToHex(bal.serialize())
    fs.writeFileSync(rlpFile, rlpOutput)

    const rlpBytes = bal.serialize()
    const json = bal.toJSON()
    const uniqueAddresses = new Set<string>()
    for (const phase of json.accessMap) {
      for (const addr of phase.addresses) uniqueAddresses.add(addr)
    }
    console.log(
      `\n  BAL: ${uniqueAddresses.size} addresses, ${json.stateDiff.length} state diffs, ${json.accessMap.length} phases, RLP size: ${rlpBytes.length} bytes`,
    )
    console.log(`  BAL hash: ${bytesToHex(bal.hash())}`)
    console.log(`  Saved: ${jsonFile}`)
    console.log(`  Saved: ${rlpFile}`)
  }
}

void main()
