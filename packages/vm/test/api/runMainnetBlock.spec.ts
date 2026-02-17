import * as fs from 'node:fs'
import * as path from 'node:path'
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
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'
import { assert, describe, it } from 'vitest'

import { createVM, runBlock } from '../../src/index.ts'

interface StateData {
  accounts: Record<string, { nonce: string; balance: string } | null>
  code: Record<string, string>
  storage: Record<string, Record<string, string>>
}

const testdataDir = path.resolve(import.meta.dirname, 'testdata', 'mainnet')

describe('run mainnet block offline', () => {
  it('should execute block 24476000 and produce correct gasUsed and receiptsRoot', async () => {
    // 1. Load block JSON and state data
    const blockJSON = JSON.parse(
      fs.readFileSync(path.join(testdataDir, 'block24476000.json'), 'utf8'),
    )
    const stateData: StateData = JSON.parse(
      fs.readFileSync(path.join(testdataDir, 'block24476000State.json'), 'utf8'),
    )

    // 2. Set up Common with KZG
    const kzg = new microEthKZG(trustedSetup)
    const common = new Common({ chain: Mainnet, customCrypto: { kzg } })

    // 3. Create MerkleStateManager and populate with collected pre-state
    const stateManager = new MerkleStateManager({ common })

    await stateManager.checkpoint()

    // Load accounts first (must exist before storage/code can be set)
    for (const [addrHex, accountData] of Object.entries(stateData.accounts)) {
      if (accountData === null) continue
      const address = createAddressFromString(addrHex)
      const account = new Account(BigInt(accountData.nonce), BigInt(accountData.balance))
      await stateManager.putAccount(address, account)
    }

    // Load storage slots
    for (const [addrHex, slots] of Object.entries(stateData.storage)) {
      const address = createAddressFromString(addrHex)
      for (const [keyHex, valueHex] of Object.entries(slots)) {
        const key = setLengthLeft(hexToBytes(keyHex as `0x${string}`), 32)
        const value = hexToBytes(valueHex as `0x${string}`)
        if (value.length > 0) {
          await stateManager.putStorage(address, key, value)
        }
      }
    }

    // Load code (putCode updates the account's codeHash internally)
    for (const [addrHex, codeHex] of Object.entries(stateData.code)) {
      if (codeHex === '0x' || codeHex === '') continue
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

    // 4. Create block from saved JSON
    const block = createBlockFromRPC(blockJSON, [], { common, setHardfork: true })
    assert.equal(block.header.number, BigInt(24476000), 'block number should be 24476000')
    assert.equal(block.transactions.length, 273, 'block should have 273 transactions')

    // 5. Create VM and run the block
    const vm = await createVM({ common, stateManager, setHardfork: true })

    const result = await runBlock(vm, {
      block,
      generate: true,
      skipHeaderValidation: true,
      skipBlockValidation: true,
    })

    // 6. Validate results
    assert.equal(result.gasUsed, block.header.gasUsed, 'gasUsed should match block header gasUsed')
    assert.equal(result.gasUsed, BigInt(24361706), 'gasUsed should be 24361706')

    assert.equal(
      bytesToHex(result.receiptsRoot),
      '0x9b20f82b040b718ae378b17a507d35736144f62c5b93ac6ceea16eed7c9d93f2',
      'receiptsRoot should match expected value',
    )

    assert.equal(
      result.results.length,
      273,
      'should have execution results for all 273 transactions',
    )
  }, 30_000)
})
