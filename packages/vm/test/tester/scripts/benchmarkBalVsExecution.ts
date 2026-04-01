import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { hrtime } from 'node:process'
import { parseArgs } from 'node:util'

import { createBlock, createBlockFromRLP } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import {
  bytesToHex,
  createAddressFromString,
  hexToBigInt,
  hexToBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'

import { consumeBal } from '../../src/consumeBal.ts'
import { createVM, runBlock } from '../../src/index.ts'
import { setupPreConditions } from '../util.ts'
import {
  type ExecutionSpecFixture,
  createCommonForFork,
  loadExecutionSpecFixtures,
} from './executionSpecTestLoader.ts'

const defaultFixturesPath = '../execution-spec-tests'
const SKIP_NETWORKS = new Set(['BPO1ToBPO2AtTime15k', 'BPO2ToBPO3AtTime15k', 'BPO3ToBPO4AtTime15k'])

type BenchmarkStats = {
  setupMs: number
  processMs: number
  validateMs: number
  totalMs: number
}

type FixtureBenchmarkResult = {
  fixture: ExecutionSpecFixture
  runBlock: BenchmarkStats
  consumeBal: BenchmarkStats
}

function msBetween(start: bigint, end: bigint) {
  return Number(end - start) / 1_000_000
}

function formatMs(value: number) {
  return value.toFixed(2)
}

function loadDirectBlockchainFixtures(filePath: string): ExecutionSpecFixture[] {
  const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, any>
  const fixtures: ExecutionSpecFixture[] = []

  for (const [id, data] of Object.entries(parsed)) {
    const fork = (data as any).network ?? (data as any).config?.network
    if (fork !== undefined) {
      fixtures.push({ id, fork, filePath, data })
    }
  }

  return fixtures
}

function resolveExplicitFixtureFile(fixturesPath: string, testFile: string | undefined) {
  if (testFile === undefined) {
    return undefined
  }

  const normalizedTestFile = testFile.endsWith('.json') ? testFile : `${testFile}.json`
  const candidates = path.isAbsolute(normalizedTestFile)
    ? [normalizedTestFile]
    : [path.join(fixturesPath, normalizedTestFile), path.resolve(normalizedTestFile)]

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate
    }
  }

  return undefined
}

function expectedFinalStateRoot(testData: any) {
  const lastBlock = testData.blocks.at(-1)
  const stateRoot = lastBlock?.blockHeader?.stateRoot ?? testData.genesisBlockHeader.stateRoot
  return hexToBytes(stateRoot)
}

async function createBenchmarkContext(fork: string, testData: any, kzg: microEthKZG) {
  const common = createCommonForFork(fork, testData, kzg)
  const genesisBlock = createBlock(
    { header: testData.genesisBlockHeader },
    { common, setHardfork: true },
  )
  const blockchain = await createBlockchain({
    common,
    genesisBlock,
  })
  const vm = await createVM({
    common,
    blockchain,
  })
  await setupPreConditions(vm.stateManager, testData)

  assert.deepEqual(
    await vm.stateManager.getStateRoot(),
    genesisBlock.header.stateRoot,
    'pre stateRoot mismatch',
  )
  assert.equal(
    bytesToHex(genesisBlock.hash()),
    testData.genesisBlockHeader.hash,
    'genesis hash mismatch',
  )

  return { blockchain, genesisBlock, vm }
}

async function validatePostState(vm: Awaited<ReturnType<typeof createVM>>, testData: any) {
  assert.deepEqual(
    await vm.stateManager.getStateRoot(),
    expectedFinalStateRoot(testData),
    'post stateRoot mismatch',
  )

  for (const address of Object.keys(testData.postState)) {
    const account = await vm.stateManager.getAccount(createAddressFromString(address))
    assert.ok(account !== undefined, `missing account in postState: ${address}`)
    const accountInfo = testData.postState[address]
    assert.equal(
      account.balance,
      hexToBigInt(accountInfo.balance),
      `balance mismatch for ${address}`,
    )
    assert.equal(account.nonce, hexToBigInt(accountInfo.nonce), `nonce mismatch for ${address}`)
    assert.deepEqual(
      account.codeHash,
      keccak_256(hexToBytes(accountInfo.code)),
      `code mismatch for ${address}`,
    )

    for (const [key, value] of Object.entries(accountInfo.storage)) {
      const keyBytes = setLengthLeft(hexToBytes(key as `0x${string}`), 32)
      const storage = await vm.stateManager.getStorage(createAddressFromString(address), keyBytes)
      assert.equal(bytesToHex(storage), value, `storage mismatch for ${address}:${key}`)
    }
  }
}

async function benchmarkRunBlock(
  fixture: ExecutionSpecFixture,
  kzg: microEthKZG,
): Promise<BenchmarkStats> {
  const totalStart = hrtime.bigint()
  const { blockchain, genesisBlock, vm } = await createBenchmarkContext(
    fixture.fork,
    fixture.data,
    kzg,
  )
  const afterSetup = hrtime.bigint()

  let parentBlock = genesisBlock
  for (const { rlp, expectException } of fixture.data.blocks) {
    assert.equal(
      expectException,
      undefined,
      `benchmark runner only supports successful blocks, got expectException=${expectException ?? 'undefined'}`,
    )
    const block = createBlockFromRLP(hexToBytes(rlp), {
      common: vm.common,
      setHardfork: true,
    })
    await runBlock(vm, {
      block,
      root: parentBlock.header.stateRoot,
      setHardfork: true,
    })
    await vm.blockchain.putBlock(block)
    parentBlock = block
  }
  const afterProcess = hrtime.bigint()

  const head = await blockchain.getCanonicalHeadBlock()
  assert.equal(bytesToHex(head.hash()), fixture.data.lastblockhash, 'lastblockhash mismatch')
  await validatePostState(vm, fixture.data)
  const afterValidate = hrtime.bigint()

  return {
    setupMs: msBetween(totalStart, afterSetup),
    processMs: msBetween(afterSetup, afterProcess),
    validateMs: msBetween(afterProcess, afterValidate),
    totalMs: msBetween(totalStart, afterValidate),
  }
}

async function benchmarkConsumeBal(
  fixture: ExecutionSpecFixture,
  kzg: microEthKZG,
): Promise<BenchmarkStats> {
  const totalStart = hrtime.bigint()
  const { vm } = await createBenchmarkContext(fixture.fork, fixture.data, kzg)
  const afterSetup = hrtime.bigint()

  for (const { blockAccessList, blockHeader, expectException } of fixture.data.blocks) {
    assert.equal(
      expectException,
      undefined,
      `benchmark runner only supports successful blocks, got expectException=${expectException ?? 'undefined'}`,
    )
    assert.ok(blockAccessList !== undefined, 'missing blockAccessList for consumeBal benchmark')
    await consumeBal(vm, blockAccessList, hexToBytes(blockHeader.stateRoot))
  }
  const afterProcess = hrtime.bigint()

  await validatePostState(vm, fixture.data)
  const afterValidate = hrtime.bigint()

  return {
    setupMs: msBetween(totalStart, afterSetup),
    processMs: msBetween(afterSetup, afterProcess),
    validateMs: msBetween(afterProcess, afterValidate),
    totalMs: msBetween(totalStart, afterValidate),
  }
}

function printReport(results: FixtureBenchmarkResult[]) {
  if (results.length === 0) {
    console.log('No fixtures matched the provided filters.')
    return
  }

  console.log('')
  console.log('BAL vs runBlock benchmark')
  console.log('')

  for (const { fixture, runBlock, consumeBal } of results) {
    const speedup = runBlock.processMs / consumeBal.processMs
    console.log(`${fixture.fork}: ${fixture.id}`)
    console.log(
      `  runBlock   setup=${formatMs(runBlock.setupMs)}ms process=${formatMs(runBlock.processMs)}ms validate=${formatMs(runBlock.validateMs)}ms total=${formatMs(runBlock.totalMs)}ms`,
    )
    console.log(
      `  consumeBal setup=${formatMs(consumeBal.setupMs)}ms process=${formatMs(consumeBal.processMs)}ms validate=${formatMs(consumeBal.validateMs)}ms total=${formatMs(consumeBal.totalMs)}ms`,
    )
    console.log(`  process speedup=${speedup.toFixed(2)}x`)
    console.log('')
  }

  const totals = results.reduce(
    (acc, result) => {
      acc.runBlock.setupMs += result.runBlock.setupMs
      acc.runBlock.processMs += result.runBlock.processMs
      acc.runBlock.validateMs += result.runBlock.validateMs
      acc.runBlock.totalMs += result.runBlock.totalMs
      acc.consumeBal.setupMs += result.consumeBal.setupMs
      acc.consumeBal.processMs += result.consumeBal.processMs
      acc.consumeBal.validateMs += result.consumeBal.validateMs
      acc.consumeBal.totalMs += result.consumeBal.totalMs
      return acc
    },
    {
      runBlock: { setupMs: 0, processMs: 0, validateMs: 0, totalMs: 0 },
      consumeBal: { setupMs: 0, processMs: 0, validateMs: 0, totalMs: 0 },
    },
  )

  console.log('Summary')
  console.log(
    `  runBlock   setup=${formatMs(totals.runBlock.setupMs)}ms process=${formatMs(totals.runBlock.processMs)}ms validate=${formatMs(totals.runBlock.validateMs)}ms total=${formatMs(totals.runBlock.totalMs)}ms`,
  )
  console.log(
    `  consumeBal setup=${formatMs(totals.consumeBal.setupMs)}ms process=${formatMs(totals.consumeBal.processMs)}ms validate=${formatMs(totals.consumeBal.validateMs)}ms total=${formatMs(totals.consumeBal.totalMs)}ms`,
  )
  console.log(
    `  total process speedup=${(totals.runBlock.processMs / totals.consumeBal.processMs).toFixed(2)}x`,
  )
}

async function main() {
  const { values } = parseArgs({
    options: {
      path: { type: 'string' },
      file: { type: 'string' },
      case: { type: 'string' },
    },
  })

  const fixturesPath = path.resolve(values.path ?? process.env.TEST_PATH ?? defaultFixturesPath)
  const testFile = values.file ?? process.env.TEST_FILE
  const testCase = values.case ?? process.env.TEST_CASE

  if (fs.existsSync(fixturesPath) === false) {
    throw new Error(`fixtures not found at ${fixturesPath}`)
  }

  let fixtures: ExecutionSpecFixture[]
  if (fs.statSync(fixturesPath).isFile()) {
    fixtures = loadDirectBlockchainFixtures(fixturesPath)
  } else {
    fixtures = loadExecutionSpecFixtures(fixturesPath, 'blockchain_tests')

    if (testFile !== undefined) {
      const normalizedTestFile = testFile.endsWith('.json') ? testFile : `${testFile}.json`
      fixtures = fixtures.filter((fixture) => path.basename(fixture.filePath) === normalizedTestFile)

      if (fixtures.length === 0) {
        const explicitFixtureFile = resolveExplicitFixtureFile(fixturesPath, testFile)
        if (explicitFixtureFile !== undefined) {
          fixtures = loadDirectBlockchainFixtures(explicitFixtureFile)
        }
      }
    }
  }

  fixtures = fixtures.filter((fixture) => !SKIP_NETWORKS.has(fixture.fork))

  if (testCase !== undefined) {
    fixtures = fixtures.filter((fixture) => fixture.id.includes(testCase))
  }

  console.log(`Using execution-spec blockchain fixtures from: ${fixturesPath}`)
  if (testFile !== undefined) {
    console.log(`Filtering to file: ${testFile}`)
  }
  if (testCase !== undefined) {
    console.log(`Filtering to case: ${testCase}`)
  }
  console.log(`Benchmarking ${fixtures.length} fixture(s)`)

  const kzg = new microEthKZG(trustedSetup)
  const results: FixtureBenchmarkResult[] = []

  for (const fixture of fixtures) {
    const runBlockStats = await benchmarkRunBlock(fixture, kzg)
    const consumeBalStats = await benchmarkConsumeBal(fixture, kzg)
    results.push({
      fixture,
      runBlock: runBlockStats,
      consumeBal: consumeBalStats,
    })
  }

  printReport(results)
}

void main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
