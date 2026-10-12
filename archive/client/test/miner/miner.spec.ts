import { BlockHeader, createBlock, createBlockHeader } from '@ethereumjs/block'
import {
  Common,
  type GethGenesis,
  Hardfork,
  createCommonFromGethGenesis,
  createCustomCommon,
} from '@ethereumjs/common'
import { MerkleStateManager } from '@ethereumjs/statemanager'
import { SIGNER_A, SIGNER_B, goerliChainConfig } from '@ethereumjs/testdata'
import { createFeeMarket1559Tx, createLegacyTx } from '@ethereumjs/tx'
import type { Address } from '@ethereumjs/util'
import { equalsBytes } from '@ethereumjs/util'
// import { keccak_256 } from '@noble/hashes/sha3.js'
import { assert, describe, it, vi } from 'vitest'

// import { Chain } from '../../src/blockchain/index.ts'
import { Config } from '../../src/config.ts'
import { Miner } from '../../src/miner/index.ts'
import { FullEthereumService } from '../../src/service/index.ts'
// import { Event } from '../../src/types'
import { wait } from '../integration/util.ts'

import type { Block } from '@ethereumjs/block'
import type { Blockchain, CliqueConsensus } from '@ethereumjs/blockchain'
import type { VM } from '@ethereumjs/vm'
import { MemoryLevel } from 'memory-level'
import type { FullSynchronizer } from '../../src/sync/index.ts'

const setBalance = async (vm: VM, address: Address, balance: bigint) => {
  await vm.stateManager.checkpoint()
  await vm.stateManager.modifyAccountFields(address, { balance })
  await vm.stateManager.commit()
}

BlockHeader.prototype['_consensusFormatValidation'] = vi.fn()

// Stub out setStateRoot so txPool.validate checks will pass since correct state root
// doesn't exist in fakeChain state anyway
MerkleStateManager.prototype.setStateRoot = vi.fn()

class FakeChain {
  open() {}
  close() {}
  update() {}
  get headers() {
    return {
      latest: createBlockHeader(),
      height: BigInt(0),
    }
  }
  get blocks() {
    return {
      latest: createBlock(),
      height: BigInt(0),
    }
  }
  getBlock() {
    return createBlockHeader()
  }
  getCanonicalHeadHeader() {
    return createBlockHeader()
  }
  blockchain: any = {
    putBlock: async () => {},
    consensus: {
      cliqueActiveSigners: () => [SIGNER_A.address],
      cliqueSignerInTurn: async () => true,
      cliqueCheckRecentlySigned: () => false,
      validateDifficulty: () => undefined,
    },
    validateHeader: () => {},
    getIteratorHead: () => {
      return createBlock({ header: { number: 1 } })
    },
    getTotalDifficulty: () => {
      return 1n
    },

    shallowCopy: () => this.blockchain,
    _init: async () => undefined,
    events: {
      addListener: () => {},
    },
  }
}

const accounts: [Address, Uint8Array][] = [[SIGNER_A.address, SIGNER_A.privateKey]]

const consensusConfig = {
  clique: {
    period: 10,
    epoch: 30000,
  },
}
const defaultChainData: GethGenesis = {
  config: {
    chainId: 123456,
    homesteadBlock: 0,
    eip150Block: 0,
    eip150Hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    eip155Block: 0,
    eip158Block: 0,
    byzantiumBlock: 0,
    constantinopleBlock: 0,
    petersburgBlock: 0,
    istanbulBlock: 0,
    berlinBlock: 0,
    londonBlock: 0,
    ...consensusConfig,
  },
  nonce: '0x0',
  timestamp: '0x614b3731',
  gasLimit: '0x47b760',
  difficulty: '0x1',
  mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
  coinbase: '0x0000000000000000000000000000000000000000',
  number: '0x0',
  gasUsed: '0x0',
  parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
  baseFeePerGas: 7,
  alloc: {},
}
const addr = SIGNER_A.address.toString().slice(2)

const extraData = '0x' + '0'.repeat(64) + addr + '0'.repeat(130)
const chainData = {
  ...defaultChainData,
  extraData,
  alloc: { [addr]: { balance: '0x10000000000000000000' } },
}
const customCommon = createCommonFromGethGenesis(chainData, {
  chain: 'devnet',
  hardfork: Hardfork.Berlin,
})

const customConfig = new Config({
  accountCache: 10000,
  storageCache: 1000,
  accounts,
  mine: true,
  common: customCommon,
})

const goerliCommon = new Common({ chain: goerliChainConfig, hardfork: Hardfork.Berlin })

const goerliConfig = new Config({
  accountCache: 10000,
  storageCache: 1000,
  accounts,
  mine: true,
  common: customCommon,
})

const createTx = (
  from = SIGNER_A,
  to = SIGNER_B,
  nonce = 0,
  value = 1,
  gasPrice = 1000000000,
  gasLimit = 100000,
  common = customCommon,
) => {
  const txData = {
    nonce,
    gasPrice,
    gasLimit,
    to: to.address,
    value,
  }
  const tx = createLegacyTx(txData, { common })
  const signedTx = tx.sign(from.privateKey)
  return signedTx
}

const txA01 = createTx() // SIGNER_A -> SIGNER_B, nonce: 0, value: 1, normal gasPrice
const txA011 = createTx(
  // SIGNER_A -> SIGNER_B, nonce: 0, value: 1, normal gasPrice, mainnet as chain
  SIGNER_A,
  SIGNER_B,
  0,
  1,
  1000000000,
  100000,
  goerliCommon,
) // SIGNER_A -> SIGNER_B, nonce: 0, value: 1, normal gasPrice

const txA02 = createTx(SIGNER_A, SIGNER_B, 1, 1, 2000000000) // SIGNER_A -> SIGNER_B, nonce: 1, value: 1, 2x gasPrice
const txA03 = createTx(SIGNER_A, SIGNER_B, 2, 1, 3000000000) // SIGNER_A -> SIGNER_B, nonce: 2, value: 1, 3x gasPrice
const txB01 = createTx(SIGNER_B, SIGNER_A, 0, 1, 2500000000) // SIGNER_B -> SIGNER_A, nonce: 0, value: 1, 2.5x gasPrice

describe('should initialize correctly', () => {
  const chain = new FakeChain() as any
  const service = new FullEthereumService({
    config: customConfig,
    chain,
  })
  it('should start/stop', async () => {
    const miner = new Miner({ config: customConfig, service })
    assert.isFalse(miner.running)
    miner.start()
    assert.isTrue(miner.running)
    await wait(100)
    miner.stop()
    assert.isFalse(miner.running)
  })

  it('Should not start when config.mine=false', () => {
    const configMineFalse = new Config({ accounts, mine: false })
    const miner = new Miner({ config: configMineFalse, service })
    miner.start()
    assert.isFalse(miner.running, 'miner should not start when config.mine=false')
  })
})

describe('assembleBlocks() -> with a single tx', async () => {
  const chain = new FakeChain() as any
  const service = new FullEthereumService({
    config: customConfig,
    chain,
  })
  const miner = new Miner({ config: customConfig, service, skipHardForkValidation: true })
  const { txPool } = service
  await service.execution.open()
  const { vm } = service.execution

  txPool.start()
  miner.start()

  await setBalance(vm, SIGNER_A.address, BigInt('200000000000001'))

  // add tx
  await txPool.add(txA01)

  // disable consensus to skip PoA block signer validation
  ;((vm.blockchain as Blockchain).consensus as CliqueConsensus).cliqueActiveSigners = () => [
    SIGNER_A.address,
  ] // stub

  chain.putBlocks = (blocks: Block[]) => {
    it('should include tx in new block', () => {
      assert.strictEqual(blocks[0].transactions.length, 1, 'new block should include tx')
    })
    miner.stop()
    txPool.stop()
  }
  await (miner as any).queueNextAssembly(0)
  await wait(500)
})

describe('assembleBlocks() -> with a hardfork mismatching tx', async () => {
  const chain = new FakeChain() as any
  const service = new FullEthereumService({
    config: goerliConfig,
    chain,
  })

  // no skipHardForkValidation
  const miner = new Miner({ config: goerliConfig, service })
  const { txPool } = service
  await service.execution.setupMerkleVM()
  const { vm } = service.execution
  txPool.start()
  miner.start()

  await setBalance(vm, SIGNER_A.address, BigInt('200000000000001'))

  // add tx
  txA011.common.setHardfork(Hardfork.Paris)
  it('should add tx to pool', async () => {
    await txPool.add(txA011)
    assert.strictEqual(txPool.txsInPool, 1, 'transaction should be in pool')
  })

  // disable consensus to skip PoA block signer validation
  ;((vm.blockchain as Blockchain).consensus as CliqueConsensus).cliqueActiveSigners = () => [
    SIGNER_A.address,
  ] // stub

  chain.putBlocks = (blocks: Block[]) => {
    it('should not include tx', () => {
      assert.strictEqual(
        blocks[0].transactions.length,
        0,
        'new block should not include tx due to hardfork mismatch',
      )
      assert.strictEqual(txPool.txsInPool, 1, 'transaction should remain in pool')
    })
    miner.stop()
    txPool.stop()
  }
  await (miner as any).queueNextAssembly(0)
  await wait(500)
})

describe('assembleBlocks() -> with multiple txs, properly ordered by gasPrice and nonce', async () => {
  const chain = new FakeChain() as any
  const _config = {
    ...customConfig,
  }
  const service = new FullEthereumService({
    config: customConfig,
    chain,
  })
  const miner = new Miner({ config: customConfig, service, skipHardForkValidation: true })
  const { txPool } = service
  await service.execution.open()
  const { vm } = service.execution
  txPool.start()
  miner.start()

  await setBalance(vm, SIGNER_A.address, BigInt('400000000000001'))
  await setBalance(vm, SIGNER_B.address, BigInt('400000000000001'))

  // add txs
  await txPool.add(txA01)
  await txPool.add(txA02)
  await txPool.add(txA03)
  await txPool.add(txB01)

  // disable consensus to skip PoA block signer validation
  /// @ts-expect-error -- Property exists on actual class but not on interface
  vm.blockchain['_validateConsensus'] = false

  chain.putBlocks = (blocks: Block[]) => {
    it('should be properly ordered by gasPrice and nonce', () => {
      const msg = 'txs in block should be properly ordered by gasPrice and nonce'
      const expectedOrder = [txB01, txA01, txA02, txA03]
      for (const [index, tx] of expectedOrder.entries()) {
        const txHash = blocks[0].transactions[index]?.hash()
        assert.isTrue(txHash !== undefined && equalsBytes(txHash, tx.hash()), msg)
      }
    })
    miner.stop()
    txPool.stop()
  }
  await (miner as any).queueNextAssembly(0)
  await wait(500)
})

describe('assembleBlocks() -> with saveReceipts', async () => {
  const chain = new FakeChain() as any
  const config = new Config({
    accountCache: 10000,
    storageCache: 1000,
    accounts,
    mine: true,
    common: customCommon,
    saveReceipts: true,
  })
  const service = new FullEthereumService({
    config,
    chain,
    metaDB: new MemoryLevel({
      keyEncoding: 'view',
      valueEncoding: 'view',
    }),
  })
  const miner = new Miner({ config, service, skipHardForkValidation: true })
  const { txPool } = service
  await service.execution.open()
  const { vm, receiptsManager, txIndex } = service.execution
  txPool.start()
  miner.start()
  it('should initialize receiptsManager', () => {
    assert.isDefined(receiptsManager, 'receiptsManager should be initialized')
  })
  it('should initialize txIndex', () => {
    assert.isDefined(txIndex)
  })

  await setBalance(vm, SIGNER_A.address, BigInt('400000000000001'))
  await setBalance(vm, SIGNER_B.address, BigInt('400000000000001'))

  // add txs
  await txPool.add(txA01)
  await txPool.add(txA02)
  await txPool.add(txA03)
  await txPool.add(txB01)

  // disable consensus to skip PoA block signer validation
  /// @ts-expect-error -- Property exists on actual class but not on interface
  vm.blockchain['_validateConsensus'] = false

  chain.putBlocks = async (blocks: Block[]) => {
    it('should be properly ordered by gasPrice and nonce', async () => {
      const msg = 'txs in block should be properly ordered by gasPrice and nonce'
      const expectedOrder = [txB01, txA01, txA02, txA03]
      for (const [index, tx] of expectedOrder.entries()) {
        const txHash = blocks[0].transactions[index]?.hash()
        assert.isTrue(txHash !== undefined && equalsBytes(txHash, tx.hash()), msg)
      }
    })
    miner.stop()
    txPool.stop()
  }
  await (miner as any).queueNextAssembly(0)
  it(`should save receipts for block`, async () => {
    const [blockHash] = (await txIndex!.getIndex(txB01.hash()))!
    const receipt = await receiptsManager!.getReceipts(blockHash)
    assert.isDefined(receipt, 'receipt should be saved')
    assert.equal(receipt.length, 4, 'receipt should include 4 tx')
  })
  it('should find receipt for tx', async () => {
    let index = await txIndex!.getIndex(txB01.hash())
    let receipt = await receiptsManager!.getReceiptByTxHashIndex(index!)
    assert.isDefined(receipt, 'receipt should be saved')
    index = await txIndex!.getIndex(txA02.hash())
    receipt = await receiptsManager!.getReceiptByTxHashIndex(index!)
    assert.isDefined(receipt, 'receipt should be saved')
    index = await txIndex!.getIndex(txA03.hash())
    receipt = await receiptsManager!.getReceiptByTxHashIndex(index!)
    assert.isDefined(receipt, 'receipt should be saved')

    await wait(500)
  })
})

describe('assembleBlocks() -> should not include tx under the baseFee', async () => {
  const customChainParams = {
    hardforks: [
      { name: 'chainstart', block: 0 },
      { name: 'london', block: 0 },
    ],
  }
  const common = createCustomCommon(customChainParams, goerliChainConfig, {
    hardfork: Hardfork.London,
  })
  const config = new Config({
    accountCache: 10000,
    storageCache: 1000,
    accounts,
    mine: true,
    common,
  })
  const chain = new FakeChain() as any
  const block = createBlock({}, { common })
  Object.defineProperty(chain, 'headers', {
    get() {
      return { latest: block.header, height: block.header.number }
    },
  })
  Object.defineProperty(chain, 'blocks', {
    get() {
      return { latest: block }
    },
  })
  const service = new FullEthereumService({
    config,
    chain,
  })
  const miner = new Miner({ config, service, skipHardForkValidation: true })
  const { txPool } = service
  await service.execution.open()
  const { vm } = service.execution
  txPool.start()
  miner.start()

  // the default block baseFee will be 7
  // add tx with maxFeePerGas of 6
  const tx = createFeeMarket1559Tx({ to: SIGNER_B.address, maxFeePerGas: 6 }, { common }).sign(
    SIGNER_A.privateKey,
  )
  try {
    await txPool.add(tx, true)
  } catch {
    assert.fail('txPool should throw trying to add a tx with an invalid maxFeePerGas')
  }
  // disable consensus to skip PoA block signer validation
  /// @ts-expect-error -- Property exists on actual class but not on interface
  vm.blockchain['_validateConsensus'] = false
  ;(service.synchronizer as FullSynchronizer).handleNewBlock = async (block: Block) => {
    assert.strictEqual(block.transactions.length, 0, 'should not include tx')
    miner.stop()
    txPool.stop()
  }
  await wait(500)
  await (miner as any).queueNextAssembly(0)
  await wait(500)
})

describe("assembleBlocks() -> should stop assembling a block after it's full", async () => {
  const chain = new FakeChain() as any
  const gasLimit = 100000
  const block = createBlock({ header: { gasLimit } }, { common: customCommon, setHardfork: true })
  Object.defineProperty(chain, 'headers', {
    get() {
      return { latest: block.header, height: BigInt(0) }
    },
  })
  Object.defineProperty(chain, 'blocks', {
    get() {
      return { latest: block, height: BigInt(0) }
    },
  })
  const service = new FullEthereumService({
    config: customConfig,
    chain,
  })
  await service.execution.open()
  const miner = new Miner({ config: customConfig, service, skipHardForkValidation: true })
  const { txPool } = service
  const { vm } = service.execution
  txPool.start()
  miner.start()

  await setBalance(vm, SIGNER_A.address, BigInt('200000000000001'))

  // add txs
  const data = '0xfe' // INVALID opcode, consumes all gas
  const tx1FillsBlockGasLimit = createLegacyTx(
    { gasLimit: gasLimit - 1, data, gasPrice: BigInt('1000000000') },
    { common: customCommon },
  ).sign(SIGNER_A.privateKey)
  const tx2ExceedsBlockGasLimit = createLegacyTx(
    { gasLimit: 21000, to: SIGNER_B.address, nonce: 1, gasPrice: BigInt('1000000000') },
    { common: customCommon },
  ).sign(SIGNER_A.privateKey)
  await txPool.add(tx1FillsBlockGasLimit)
  await txPool.add(tx2ExceedsBlockGasLimit)

  // disable consensus to skip PoA block signer validation
  /// @ts-expect-error -- Property exists on actual class but not on interface
  vm.blockchain['_validateConsensus'] = false

  chain.putBlocks = (blocks: Block[]) => {
    it('should include tx', () => {
      assert.strictEqual(blocks[0].transactions.length, 1, 'only one tx should be included')
    })
    miner.stop()
    txPool.stop()
  }
  await miner['queueNextAssembly'](0)
  await wait(500)
})
/*****************************************************************************************
 *  Skipping the next three tests because they timeout quite often in CI runs where
 *  vitest is running them in parallel with other tests.  These tests should be rewritten
 *  using vi.useFakeTimers so that the tests aren't dependent on race conditions in the
 *  Miner class in order to pass.
 */
/**

describe.skip('assembleBlocks() -> should stop assembling when a new block is received', async () => {
  const chain = new FakeChain() as any
  const config = new Config({
    accountCache: 10000,
    storageCache: 1000,
    accounts,
    mine: true,
    common: customCommon,
  })
  const service = new FullEthereumService({
    config,
    chain,
  })
  const miner = new Miner({ config, service, skipHardForkValidation: true })

  // stub chainUpdated so assemble isn't called again
  // when emitting Event.CHAIN_UPDATED in this test
  miner['chainUpdated'] = async () => {}

  const { txPool } = service
  const { vm } = service.execution
  txPool.start()
  miner.start()

  await setBalance(vm, SIGNER_A.address, BigInt('200000000000001'))

  // add many txs to slow assembling
  let privateKey = keccak_256(new Uint8Array(0))
  for (let i = 0; i < 1000; i++) {
    // In order not to pollute TxPool with too many txs from the same address
    // (or txs which are already known), keep generating a new address for each tx
    const address = createAddressFromPrivateKey(privateKey)
    await setBalance(vm, address, BigInt('200000000000001'))
    const tx = createTx({ address, privateKey })
    await txPool.add(tx)
    privateKey = keccak_256(privateKey)
  }

  chain.putBlocks = () => {
    assert.fail('should have stopped assembling when a new block was received')
  }
  await (miner as any).queueNextAssembly(5)
  await wait(5)
  assert.isTrue((miner as any).assembling, 'miner should be assembling')
  config.events.emit(Event.CHAIN_UPDATED)
  await wait(25)
  assert.isFalse((miner as any).assembling, 'miner should have stopped assembling')
  miner.stop()
  txPool.stop()
})

describe.skip('should handle mining over the london hardfork block', async () => {
  const customChainParams = {
    hardforks: [
      { name: 'chainstart', block: 0 },
      { name: 'berlin', block: 2 },
      { name: 'london', block: 3 },
    ],
  }
  const common = createCustomCommon(customChainParams, { baseChain: CommonChain.Goerli })
  common.setHardforkBy({ blockNumber: 0 })
  const config = new Config({
    accountCache: 10000,
    storageCache: 1000,
    accounts,
    mine: true,
    common,
  })
  const chain = await Chain.create({ config })
  await chain.open()
  const service = new FullEthereumService({
    config,
    chain,
  })
  const miner = new Miner({ config, service, skipHardForkValidation: true })

  const { vm } = service.execution
  ;(vm.blockchain.consensus as CliqueConsensus).cliqueActiveSigners = () => [SIGNER_A.address] // stub
  vm.blockchain.validateHeader = vi.fn() // stub
  miner['chainUpdated'] = async () => {} // stub
  miner.start()
  await wait(100)

  // in this test we need to explicitly update common with
  // setHardforkBy() to test the hardfork() value
  // since the vmexecution run method isn't reached in this
  // stubbed configuration.

  // block 1: chainstart
  await (miner as any).queueNextAssembly(0)
  await wait(100)
  config.execCommon.setHardforkBy({ blockNumber: 1 })
  assert.strictEqual(config.execCommon.hardfork(), Hardfork.Chainstart)

  // block 2: berlin
  await (miner as any).queueNextAssembly(0)
  await wait(100)
  config.execCommon.setHardforkBy({ blockNumber: 2 })
  assert.strictEqual(config.execCommon.hardfork(), Hardfork.Berlin)
  const blockHeader2 = await chain.getCanonicalHeadHeader()

  // block 3: london
  await (miner as any).queueNextAssembly(0)
  await wait(100)
  const blockHeader3 = await chain.getCanonicalHeadHeader()
  config.execCommon.setHardforkBy({ blockNumber: 3 })
  assert.strictEqual(config.execCommon.hardfork(), Hardfork.London)
  assert.strictEqual(
    blockHeader2.gasLimit * BigInt(2),
    blockHeader3.gasLimit,
    'gas limit should be double previous block'
  )
  const initialBaseFee = config.execCommon.paramByEIP('initialBaseFee', 1559)!
  assert.strictEqual(blockHeader3.baseFeePerGas!, initialBaseFee, 'baseFee should be initial value')

  // block 4
  await (miner as any).queueNextAssembly(0)
  await wait(100)
  const blockHeader4 = await chain.getCanonicalHeadHeader()
  config.execCommon.setHardforkBy({ blockNumber: 4 })
  assert.strictEqual(config.execCommon.hardfork(), Hardfork.London)
  assert.strictEqual(
    blockHeader4.baseFeePerGas!,
    blockHeader3.calcNextBaseFee(),
    'baseFee should be as calculated'
  )
  assert.isTrue((await chain.getCanonicalHeadHeader()).number === BigInt(4))
  miner.stop()
  await chain.close()
})

describe.skip('should handle mining ethash PoW', async () => {
  const addr = SIGNER_A.address.toString().slice(2)
  const consensusConfig = { ethash: true }
  const defaultChainData = {
    config: {
      chainId: 123456,
      homesteadBlock: 0,
      eip150Block: 0,
      eip150Hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      eip155Block: 0,
      eip158Block: 0,
      byzantiumBlock: 0,
      constantinopleBlock: 0,
      petersburgBlock: 0,
      istanbulBlock: 0,
      berlinBlock: 0,
      londonBlock: 0,
      ...consensusConfig,
    },
    nonce: '0x0',
    timestamp: '0x614b3731',
    gasLimit: '0x47b760',
    difficulty: '0x1',
    mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    coinbase: '0x0000000000000000000000000000000000000000',
    number: '0x0',
    gasUsed: '0x0',
    parentHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    baseFeePerGas: 7,
  }
  const extraData = '0x' + '0'.repeat(32)
  const chainData = {
    ...defaultChainData,
    extraData,
    alloc: { [addr]: { balance: '0x10000000000000000000' } },
  }
  const common = createCommonFromGethGenesis(chainData, {
    chain: 'devnet',
    hardfork: Hardfork.London,
  })
  common['_chainParams']['genesis'].difficulty = 1
  common['_chainParams']['genesis'].difficulty = 1
  const config = new Config({
    accountCache: 10000,
    storageCache: 1000,
    accounts,
    mine: true,
    common,
  })
  const chain = await Chain.create({ config })
  await chain.open()
  const service = new FullEthereumService({
    config,
    chain,
  })
  const miner = new Miner({ config, service, skipHardForkValidation: true })
  chain.blockchain['_validateConsensus'] = false
  miner['chainUpdated'] = async () => {} // stub
  miner.start()
  await wait(1000)
  config.events.on(Event.CHAIN_UPDATED, async () => {
    assert.strictEqual(chain.blocks.latest!.header.number, BigInt(1))
    miner.stop()
    await chain.close()
  })
  await (miner as any).queueNextAssembly(0)
  await wait(10000)
}, 200000)
 */
