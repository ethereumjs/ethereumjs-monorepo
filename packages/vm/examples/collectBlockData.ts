import * as fs from 'node:fs'
import * as path from 'node:path'
/**
 * Temporary batch data collection script.
 * Collects block JSON + pre-state for a range of blocks, saving after each.
 *
 * Usage: npx tsx examples/collectBlockData.ts <providerUrl> <startBlock> <endBlock>
 */
import { createBlockFromRPC } from '@ethereumjs/block'
import { Common, Mainnet } from '@ethereumjs/common'
import { RPCStateManager } from '@ethereumjs/statemanager'
import { bytesToHex, fetchFromProvider, intToHex } from '@ethereumjs/util'
import { createVM, runBlock } from '@ethereumjs/vm'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'

import type { Address } from '@ethereumjs/util'

/**
 * Wraps a function with retry logic for transient RPC failures (timeouts, etc.).
 */
function withRetry<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  maxRetries = 3,
  label = '',
): T {
  return (async (...args: any[]) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn(...args)
      } catch (err: any) {
        const isTimeout =
          err?.name === 'TimeoutError' ||
          err?.name === 'AbortError' ||
          err?.message?.includes('timeout')
        if (isTimeout && attempt < maxRetries) {
          console.log(`    Retry ${attempt}/${maxRetries} (${label}: ${err.name})...`)
          await new Promise((r) => setTimeout(r, 2000 * attempt))
          continue
        }
        throw err
      }
    }
  }) as T
}

const main = async () => {
  const providerUrl = process.argv[2]
  const startBlock = process.argv[3] !== undefined ? BigInt(process.argv[3]) : undefined
  const endBlock = process.argv[4] !== undefined ? BigInt(process.argv[4]) : undefined

  if (providerUrl === undefined || startBlock === undefined || endBlock === undefined) {
    console.log('Usage: npx tsx collectBlockData.ts <providerUrl> <startBlock> <endBlock>')
    process.exit(1)
  }

  const kzg = new microEthKZG(trustedSetup)
  const common = new Common({ chain: Mainnet, customCrypto: { kzg } })
  const outDir = path.resolve(import.meta.dirname, 'data')

  for (let blockNumber = startBlock; blockNumber <= endBlock; blockNumber++) {
    console.log(`\n${'='.repeat(60)}`)
    console.log(
      `Block ${blockNumber} (${Number(blockNumber - startBlock) + 1}/${Number(endBlock - startBlock) + 1})`,
    )
    console.log('='.repeat(60))

    // 1. Fetch raw block JSON
    console.log(`Fetching block ${blockNumber}...`)
    const blockJSON = await fetchFromProvider(
      providerUrl,
      { method: 'eth_getBlockByNumber', params: [intToHex(Number(blockNumber)), true] },
      { timeout: 120_000 },
    )

    const block = createBlockFromRPC(blockJSON, [], { common, setHardfork: true })
    console.log(`  ${block.transactions.length} txs, hardfork=${block.common.hardfork()}`)

    // 2. Set up RPC state manager with monkey-patched methods + retry logic
    const stateManager = new RPCStateManager({
      provider: providerUrl,
      blockTag: blockNumber - 1n,
      common,
    })

    const collectedAccounts: Record<string, { nonce: string; balance: string } | null> = {}
    const collectedCode: Record<string, string> = {}
    const collectedStorage: Record<string, Record<string, string>> = {}

    const origGetAccount = withRetry(stateManager.getAccount.bind(stateManager), 3, 'getAccount')
    stateManager.getAccount = async (address: Address) => {
      const result = await origGetAccount(address)
      const addr = address.toString().toLowerCase()
      if (!(addr in collectedAccounts)) {
        collectedAccounts[addr] = result
          ? { nonce: `0x${result.nonce.toString(16)}`, balance: `0x${result.balance.toString(16)}` }
          : null
      }
      return result
    }

    const origGetCode = withRetry(stateManager.getCode.bind(stateManager), 3, 'getCode')
    stateManager.getCode = async (address: Address) => {
      const result = await origGetCode(address)
      const addr = address.toString().toLowerCase()
      if (!(addr in collectedCode)) {
        collectedCode[addr] = bytesToHex(result)
      }
      return result
    }

    const origGetStorage = withRetry(stateManager.getStorage.bind(stateManager), 3, 'getStorage')
    stateManager.getStorage = async (address: Address, key: Uint8Array) => {
      const result = await origGetStorage(address, key)
      const addr = address.toString().toLowerCase()
      const slot = bytesToHex(key)
      if (!(addr in collectedStorage)) {
        collectedStorage[addr] = {}
      }
      if (!(slot in collectedStorage[addr])) {
        collectedStorage[addr][slot] = bytesToHex(result)
      }
      return result
    }

    // 3. Run the block
    const vm = await createVM({ common, stateManager, setHardfork: true })
    console.log(`Running block...`)
    const startTime = performance.now()

    const result = await runBlock(vm, {
      block,
      generate: true,
      skipHeaderValidation: true,
      skipBlockValidation: true,
    })

    const elapsed = ((performance.now() - startTime) / 1000).toFixed(1)
    const match = result.gasUsed === block.header.gasUsed

    console.log(`  Completed in ${elapsed}s`)
    console.log(
      `  Gas used: ${result.gasUsed} (expected: ${block.header.gasUsed}) ${match ? '✓' : '✗ MISMATCH'}`,
    )

    // 4. Save data (even on gas mismatch, for later debugging)
    const accountCount = Object.keys(collectedAccounts).length
    const codeCount = Object.values(collectedCode).filter((c) => c !== '0x').length
    const storageSlotCount = Object.values(collectedStorage).reduce(
      (sum, slots) => sum + Object.keys(slots).length,
      0,
    )
    console.log(
      `  State: ${accountCount} accounts, ${codeCount} contracts, ${storageSlotCount} storage slots`,
    )

    fs.writeFileSync(path.join(outDir, `block${blockNumber}.json`), JSON.stringify(blockJSON))
    fs.writeFileSync(
      path.join(outDir, `block${blockNumber}State.json`),
      JSON.stringify({
        accounts: collectedAccounts,
        code: collectedCode,
        storage: collectedStorage,
      }),
    )
    console.log(`  ✓ Saved to examples/data/`)

    if (!match) {
      console.log(`  WARNING: Gas mismatch on block ${blockNumber}, continuing...`)
    }
  }

  console.log(`\nAll ${Number(endBlock - startBlock) + 1} blocks collected successfully!`)
}

void main()
