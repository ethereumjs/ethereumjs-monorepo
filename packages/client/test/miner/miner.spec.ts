import { Block, BlockHeader } from '@ethereumjs/block'
import { Common, Chain as CommonChain, Hardfork } from '@ethereumjs/common'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import { FeeMarketEIP1559Transaction, LegacyTransaction } from '@ethereumjs/tx'
import { Address, equalsBytes, hexToBytes } from '@ethereumjs/util'
import { AbstractLevel } from 'abstract-level'
// import { keccak256 } from 'ethereum-cryptography/keccak'
import { assert, describe, it, vi } from 'vitest'

// import { Chain } from '../../src/blockchain'
import { Config } from '../../src/config'
import { Miner } from '../../src/miner'
import { FullEthereumService } from '../../src/service'
// import { Event } from '../../src/types'
import { wait } from '../integration/util'

import type { FullSynchronizer } from '../../src/sync'
import type { CliqueConsensus } from '@ethereumjs/blockchain'
import type { VM } from '@ethereumjs/vm'

const A = {
  address: new Address(hexToBytes('0x0b90087d864e82a284dca15923f3776de6bb016f')),
  privateKey: hexToBytes('0x64bf9cc30328b0e42387b3c82c614e6386259136235e20c1357bd11cdee86993'),
}

const B = {
  address: new Address(hexToBytes('0x6f62d8382bf2587361db73ceca28be91b2acb6df')),
  privateKey: hexToBytes('0x2a6e9ad5a6a8e4f17149b8bc7128bf090566a11dbd63c30e5a0ee9f161309cd6'),
}

const setBalance = async (vm: VM, address: Address, balance: bigint) => {
  await vm.stateManager.checkpoint()
  await vm.stateManager.modifyAccountFields(address, { balance })
  await vm.stateManager.commit()
}

BlockHeader.prototype['_consensusFormatValidation'] = vi.fn()

// Stub out setStateRoot so txPool.validate checks will pass since correct state root
// doesn't exist in fakeChain state anyway
DefaultStateManager.prototype.setStateRoot = vi.fn()

class FakeChain {
  open() {}
  close() {}
  update() {}
  get headers() {
    return {
      latest: BlockHeader.fromHeaderData(),
      height: BigInt(0),
    }
  }
  get blocks() {
    return {
      latest: Block.fromBlockData(),
      height: BigInt(0),
    }
  }
  getBlock() {
    return BlockHeader.fromHeaderData()
  }
  getCanonicalHeadHeader() {
    return BlockHeader.fromHeaderData()
  }
  blockchain: any = {
    putBlock: async () => {},
    consensus: {
      cliqueActiveSigners: () => [A.address],
      cliqueSignerInTurn: async () => true,
      cliqueCheckRecentlySigned: () => false,
      validateDifficulty: () => undefined,
    },
    validateHeader: () => {},
    getIteratorHead: () => {
      return Block.fromBlockData({ header: { number: 1 } })
    },
    getTotalDifficulty: () => {
      return 1n
    },
    // eslint-disable-next-line no-invalid-this
    shallowCopy: () => this.blockchain,
    _init: async () => undefined,
    events: {
      addListener: () => {},
    },
  }
}

const accounts: [Address, Uint8Array][] = [[A.address, A.privateKey]]

const consensusConfig = {
  clique: {
    period: 10,
    epoch: 30000,
  },
}
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
const addr = A.address.toString().slice(2)

const extraData = '0x' + '0'.repeat(64) + addr + '0'.repeat(130)
const chainData = {
  ...defaultChainData,
  extraData,
  alloc: { [addr]: { balance: '0x10000000000000000000' } },
}
const customCommon = Common.fromGethGenesis(chainData, {
  chain: 'devnet',
  hardfork: Hardfork.Berlin,
})
customCommon.events.setMaxListeners(50)
const customConfig = new Config({
  accountCache: 10000,
  storageCache: 1000,
  accounts,
  mine: true,
  common: customCommon,
})
customConfig.events.setMaxListeners(50)

const goerliCommon = new Common({ chain: CommonChain.Goerli, hardfork: Hardfork.Berlin })
goerliCommon.events.setMaxListeners(50)
const goerliConfig = new Config({
  accountCache: 10000,
  storageCache: 1000,
  accounts,
  mine: true,
  common: customCommon,
})
customConfig.events.setMaxListeners(50)

const createTx = (
  from = A,
  to = B,
  nonce = 0,
  value = 1,
  gasPrice = 1000000000,
  gasLimit = 100000,
  common = customCommon
) => {
  const txData = {
    nonce,
    gasPrice,
    gasLimit,
    to: to.address,
    value,
  }
  const tx = LegacyTransaction.fromTxData(txData, { common })
  const signedTx = tx.sign(from.privateKey)
  return signedTx
}

const txA01 = createTx() // A -> B, nonce: 0, value: 1, normal gasPrice
const txA011 = createTx(
  // A -> B, nonce: 0, value: 1, normal gasPrice, mainnet as chain
  A,
  B,
  0,
  1,
  1000000000,
  100000,
  goerliCommon
) // A -> B, nonce: 0, value: 1, normal gasPrice

const txA02 = createTx(A, B, 1, 1, 2000000000) // A -> B, nonce: 1, value: 1, 2x gasPrice
const txA03 = createTx(A, B, 2, 1, 3000000000) // A -> B, nonce: 2, value: 1, 3x gasPrice
const txB01 = createTx(B, A, 0, 1, 2500000000) // B -> A, nonce: 0, value: 1, 2.5x gasPrice

describe('should initialize correctly', () => {
  const chain = new FakeChain() as any
  const service = new FullEthereumService({
    config: customConfig,
    chain,
  })
  it('should start/stop', async () => {
    const miner = new Miner({ config: customConfig, service })
    assert.notOk(miner.running)
    miner.start()
    assert.ok(miner.running)
    await wait(100)
    miner.stop()
    assert.notOk(miner.running)
  })

  it('Should not start when config.mine=false', () => {
    const configMineFalse = new Config({ accounts, mine: false })
    const miner = new Miner({ config: configMineFalse, service })
    miner.start()
    assert.notOk(miner.running, 'miner should not start when config.mine=false')
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

  await setBalance(vm, A.address, BigInt('200000000000001'))

  // add tx
  await txPool.add(txA01)

  // disable consensus to skip PoA block signer validation
  ;(vm.blockchain.consensus as CliqueConsensus).cliqueActiveSigners = () => [A.address] // stub

  chain.putBlocks = (blocks: Block[]) => {
    it('should include tx in new block', () => {
      assert.equal(blocks[0].transactions.length, 1, 'new block should include tx')
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

  await setBalance(vm, A.address, BigInt('200000000000001'))

  // add tx
  txA011.common.setHardfork(Hardfork.Paris)
  it('should add tx to pool', async () => {
    await txPool.add(txA011)
    assert.equal(txPool.txsInPool, 1, 'transaction should be in pool')
  })

  // disable consensus to skip PoA block signer validation
  ;(vm.blockchain.consensus as CliqueConsensus).cliqueActiveSigners = () => [A.address] // stub

  chain.putBlocks = (blocks: Block[]) => {
    it('should not include tx', () => {
      assert.equal(
        blocks[0].transactions.length,
        0,
        'new block should not include tx due to hardfork mismatch'
      )
      assert.equal(txPool.txsInPool, 1, 'transaction should remain in pool')
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

  await setBalance(vm, A.address, BigInt('400000000000001'))
  await setBalance(vm, B.address, BigInt('400000000000001'))

  // add txs
  await txPool.add(txA01)
  await txPool.add(txA02)
  await txPool.add(txA03)
  await txPool.add(txB01)

  // disable consensus to skip PoA block signer validation
  ;(vm.blockchain as any)._validateConsensus = false

  chain.putBlocks = (blocks: Block[]) => {
    it('sholud be properly orded by gasPrice and nonce', () => {
      const msg = 'txs in block should be properly ordered by gasPrice and nonce'
      const expectedOrder = [txB01, txA01, txA02, txA03]
      for (const [index, tx] of expectedOrder.entries()) {
        const txHash = blocks[0].transactions[index]?.hash()
        assert.ok(txHash !== undefined && equalsBytes(txHash, tx.hash()), msg)
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
    metaDB: new AbstractLevel({
      encodings: { utf8: true, buffer: true },
    }),
  })
  const miner = new Miner({ config, service, skipHardForkValidation: true })
  const { txPool } = service
  await service.execution.open()
  const { vm, receiptsManager } = service.execution
  txPool.start()
  miner.start()
  it('should initialize receiptsManager', () => {
    assert.ok(receiptsManager, 'receiptsManager should be initialized')
  })

  await setBalance(vm, A.address, BigInt('400000000000001'))
  await setBalance(vm, B.address, BigInt('400000000000001'))

  // add txs
  await txPool.add(txA01)
  await txPool.add(txA02)
  await txPool.add(txA03)
  await txPool.add(txB01)

  // disable consensus to skip PoA block signer validation
  ;(vm.blockchain as any)._validateConsensus = false

  chain.putBlocks = async (blocks: Block[]) => {
    it('should be properly orded by gasPrice and nonce', async () => {
      const msg = 'txs in block should be properly ordered by gasPrice and nonce'
      const expectedOrder = [txB01, txA01, txA02, txA03]
      for (const [index, tx] of expectedOrder.entries()) {
        const txHash = blocks[0].transactions[index]?.hash()
        assert.ok(txHash !== undefined && equalsBytes(txHash, tx.hash()), msg)
      }
    })
    miner.stop()
    txPool.stop()
  }
  await (miner as any).queueNextAssembly(0)
  it('should save receipt', async () => {
    const receipt = await receiptsManager!.getReceipts(txB01.hash())
    assert.ok(receipt, 'receipt should be saved')
  })
  it('should save receipt', async () => {
    const receipt = await receiptsManager!.getReceipts(txA01.hash())
    assert.ok(receipt, 'receipt should be saved')
    it('should save receipt', async () => {})
    it('should save receipt', async () => {
      const receipt = await receiptsManager!.getReceipts(txA02.hash())
      assert.ok(receipt, 'receipt should be saved')
    })
    it('should save receipt', async () => {
      const receipt = await receiptsManager!.getReceipts(txA03.hash())
      assert.ok(receipt, 'receipt should be saved')
    })
    await wait(500)
  })
})

describe('assembleBlocks() -> should not include tx under the baseFee', async () => {
  const customChainParams = { hardforks: [{ name: 'london', block: 0 }] }
  const common = Common.custom(customChainParams, {
    baseChain: CommonChain.Goerli,
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
  const block = Block.fromBlockData({}, { common })
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
  const tx = FeeMarketEIP1559Transaction.fromTxData(
    { to: B.address, maxFeePerGas: 6 },
    { common }
  ).sign(A.privateKey)
  try {
    await txPool.add(tx, true)
  } catch {
    assert.fail('txPool should throw trying to add a tx with an invalid maxFeePerGas')
  }

  // disable consensus to skip PoA block signer validation
  ;(vm.blockchain as any)._validateConsensus = false
  ;(service.synchronizer as FullSynchronizer).handleNewBlock = async (block: Block) => {
    assert.equal(block.transactions.length, 0, 'should not include tx')
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
  const block = Block.fromBlockData(
    { header: { gasLimit } },
    { common: customCommon, setHardfork: true }
  )
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

  await setBalance(vm, A.address, BigInt('200000000000001'))

  // add txs
  const data = '0xfe' // INVALID opcode, consumes all gas
  const tx1FillsBlockGasLimit = LegacyTransaction.fromTxData(
    { gasLimit: gasLimit - 1, data, gasPrice: BigInt('1000000000') },
    { common: customCommon }
  ).sign(A.privateKey)
  const tx2ExceedsBlockGasLimit = LegacyTransaction.fromTxData(
    { gasLimit: 21000, to: B.address, nonce: 1, gasPrice: BigInt('1000000000') },
    { common: customCommon }
  ).sign(A.privateKey)
  await txPool.add(tx1FillsBlockGasLimit)
  await txPool.add(tx2ExceedsBlockGasLimit)

  // disable consensus to skip PoA block signer validation
  ;(vm.blockchain as any)._validateConsensus = false

  chain.putBlocks = (blocks: Block[]) => {
    it('should include tx', () => {
      assert.equal(blocks[0].transactions.length, 1, 'only one tx should be included')
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
  ;(miner as any).chainUpdated = async () => {}

  const { txPool } = service
  const { vm } = service.execution
  txPool.start()
  miner.start()

  await setBalance(vm, A.address, BigInt('200000000000001'))

  // add many txs to slow assembling
  let privateKey = keccak256(new Uint8Array(0))
  for (let i = 0; i < 1000; i++) {
    // In order not to pollute TxPool with too many txs from the same address
    // (or txs which are already known), keep generating a new address for each tx
    const address = Address.fromPrivateKey(privateKey)
    await setBalance(vm, address, BigInt('200000000000001'))
    const tx = createTx({ address, privateKey })
    await txPool.add(tx)
    privateKey = keccak256(privateKey)
  }

  chain.putBlocks = () => {
    assert.fail('should have stopped assembling when a new block was received')
  }
  await (miner as any).queueNextAssembly(5)
  await wait(5)
  assert.ok((miner as any).assembling, 'miner should be assembling')
  config.events.emit(Event.CHAIN_UPDATED)
  await wait(25)
  assert.notOk((miner as any).assembling, 'miner should have stopped assembling')
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
  const common = Common.custom(customChainParams, { baseChain: CommonChain.Goerli })
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
  ;(vm.blockchain.consensus as CliqueConsensus).cliqueActiveSigners = () => [A.address] // stub
  vm.blockchain.validateHeader = vi.fn() // stub
  ;(miner as any).chainUpdated = async () => {} // stub
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
  assert.equal(config.execCommon.hardfork(), Hardfork.Chainstart)

  // block 2: berlin
  await (miner as any).queueNextAssembly(0)
  await wait(100)
  config.execCommon.setHardforkBy({ blockNumber: 2 })
  assert.equal(config.execCommon.hardfork(), Hardfork.Berlin)
  const blockHeader2 = await chain.getCanonicalHeadHeader()

  // block 3: london
  await (miner as any).queueNextAssembly(0)
  await wait(100)
  const blockHeader3 = await chain.getCanonicalHeadHeader()
  config.execCommon.setHardforkBy({ blockNumber: 3 })
  assert.equal(config.execCommon.hardfork(), Hardfork.London)
  assert.equal(
    blockHeader2.gasLimit * BigInt(2),
    blockHeader3.gasLimit,
    'gas limit should be double previous block'
  )
  const initialBaseFee = config.execCommon.paramByEIP('gasConfig', 'initialBaseFee', 1559)!
  assert.equal(blockHeader3.baseFeePerGas!, initialBaseFee, 'baseFee should be initial value')

  // block 4
  await (miner as any).queueNextAssembly(0)
  await wait(100)
  const blockHeader4 = await chain.getCanonicalHeadHeader()
  config.execCommon.setHardforkBy({ blockNumber: 4 })
  assert.equal(config.execCommon.hardfork(), Hardfork.London)
  assert.equal(
    blockHeader4.baseFeePerGas!,
    blockHeader3.calcNextBaseFee(),
    'baseFee should be as calculated'
  )
  assert.ok((await chain.getCanonicalHeadHeader()).number === BigInt(4))
  miner.stop()
  await chain.close()
})

describe.skip('should handle mining ethash PoW', async () => {
  const addr = A.address.toString().slice(2)
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
  const common = Common.fromGethGenesis(chainData, {
    chain: 'devnet',
    hardfork: Hardfork.London,
  })
  ;(common as any)._chainParams['genesis'].difficulty = 1
  ;(common as any)._chainParams['genesis'].difficulty = 1
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
  ;(chain.blockchain as any)._validateConsensus = false
  ;(miner as any).chainUpdated = async () => {} // stub
  miner.start()
  await wait(1000)
  config.events.on(Event.CHAIN_UPDATED, async () => {
    assert.equal(chain.blocks.latest!.header.number, BigInt(1))
    miner.stop()
    await chain.close()
  })
  await (miner as any).queueNextAssembly(0)
  await wait(10000)
}, 200000)
 */
