import { Block, BlockHeader } from '@ethereumjs/block'
import { Common, Chain as CommonChain, Hardfork } from '@ethereumjs/common'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import {
  BlobEIP4844Transaction,
  FeeMarketEIP1559Transaction,
  LegacyTransaction,
} from '@ethereumjs/tx'
import {
  Account,
  Address,
  blobsToCommitments,
  blobsToProofs,
  bytesToHex,
  commitmentsToVersionedHashes,
  equalsBytes,
  getBlobs,
  hexToBytes,
  randomBytes,
} from '@ethereumjs/util'
import { VM } from '@ethereumjs/vm'
import { loadKZG } from 'kzg-wasm'
import { assert, describe, it, vi } from 'vitest'

import gethGenesis from '../../../block/test/testdata/4844-hardfork.json'
import { Config } from '../../src/config'
import { getLogger } from '../../src/logging'
import { PendingBlock } from '../../src/miner'
import { TxPool } from '../../src/service/txpool'
import { mockBlockchain } from '../rpc/mockBlockchain'

import type { TypedTransaction } from '@ethereumjs/tx'

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

const common = new Common({ chain: CommonChain.Goerli, hardfork: Hardfork.Berlin })
// Unschedule any timestamp since tests are not configured for timestamps
common
  .hardforks()
  .filter((hf) => hf.timestamp !== undefined)
  .map((hf) => {
    hf.timestamp = undefined
  })

const config = new Config({
  common,
  accountCache: 10000,
  storageCache: 1000,
  logger: getLogger({ loglevel: 'debug' }),
})

const setup = () => {
  const stateManager = {
    getAccount: () => new Account(BigInt(0), BigInt('50000000000000000000')),
    setStateRoot: async () => {},
  }
  const service: any = {
    chain: {
      headers: { height: BigInt(0) },
      getCanonicalHeadHeader: () => BlockHeader.fromHeaderData({}, { common }),
    },
    execution: {
      vm: {
        stateManager,
        shallowCopy: () => service.execution.vm,
        setStateRoot: () => {},
        blockchain: mockBlockchain({}),
        common: new Common({ chain: 'mainnet' }),
      },
    },
  }
  const txPool = new TxPool({ config, service })
  return { txPool }
}

describe('[PendingBlock]', async () => {
  BlockHeader.prototype['_consensusFormatValidation'] = vi.fn()
  vi.doMock('@ethereumjs/block', () => {
    {
      BlockHeader
    }
  })

  DefaultStateManager.prototype.setStateRoot = vi.fn()

  const createTx = (
    from = A,
    to = B,
    nonce = 0,
    value = 1,
    gasPrice = 1000000000,
    gasLimit = 100000
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
  const txA011 = createTx() // A -> B, nonce: 0, value: 1, normal gasPrice
  const txA02 = createTx(A, B, 1, 1, 2000000000) // A -> B, nonce: 1, value: 1, 2x gasPrice
  const txB01 = createTx(B, A, 0, 1, 2500000000) // B -> A, nonce: 0, value: 1, 2.5x gasPrice
  const txB011 = createTx(B, A, 0, 1, 2500000000) // B -> A, nonce: 0, value: 1, 2.5x gasPrice

  it('should start and build', async () => {
    const { txPool } = setup()
    const vm = await VM.create({ common })
    await setBalance(vm, A.address, BigInt(5000000000000000))
    await setBalance(vm, B.address, BigInt(5000000000000000))
    await txPool.add(txA01)
    await txPool.add(txA02)
    // skip hardfork validation for ease
    const pendingBlock = new PendingBlock({ config, txPool, skipHardForkValidation: true })
    const parentBlock = await vm.blockchain.getCanonicalHeadBlock!()
    const payloadId = await pendingBlock.start(vm, parentBlock)
    assert.equal(pendingBlock.pendingPayloads.size, 1, 'should set the pending payload')
    await txPool.add(txB01)
    const built = await pendingBlock.build(payloadId)
    if (!built) return assert.fail('pendingBlock did not return')
    const [block, receipts] = built
    assert.equal(block?.header.number, BigInt(1), 'should have built block number 1')
    assert.equal(block?.transactions.length, 3, 'should include txs from pool')
    assert.equal(receipts.length, 3, 'receipts should match number of transactions')
    pendingBlock.pruneSetToMax(0)
    assert.equal(
      pendingBlock.pendingPayloads.size,
      0,
      'should reset the pending payload after build'
    )
  })

  it('should include txs with mismatching hardforks that can still be executed', async () => {
    const { txPool } = setup()
    const vm = await VM.create({ common })
    await setBalance(vm, A.address, BigInt(5000000000000000))
    await setBalance(vm, B.address, BigInt(5000000000000000))

    txA011.common.setHardfork(Hardfork.Paris)
    await txPool.add(txA011)
    assert.equal(txPool.txsInPool, 1, '1 txA011 should be added')
    // skip hardfork validation for ease
    const pendingBlock = new PendingBlock({ config, txPool })
    const parentBlock = await vm.blockchain.getCanonicalHeadBlock!()
    const payloadId = await pendingBlock.start(vm, parentBlock)
    assert.equal(pendingBlock.pendingPayloads.size, 1, 'should set the pending payload')
    const payload = pendingBlock.pendingPayloads.get(bytesToHex(payloadId))
    assert.equal(
      (payload as any).transactions.filter(
        (tx: TypedTransaction) => bytesToHex(tx.hash()) === bytesToHex(txA011.hash())
      ).length,
      1,
      'txA011 should be in block'
    )

    txB011.common.setHardfork(Hardfork.Paris)
    await txPool.add(txB011)
    assert.equal(txPool.txsInPool, 2, '1 txB011 should be added')
    const built = await pendingBlock.build(payloadId)
    if (!built) return assert.fail('pendingBlock did not return')
    const [block] = built
    assert.equal(block?.header.number, BigInt(1), 'should have built block number 1')
    assert.equal(block?.transactions.length, 2, 'should include txs from pool')
    assert.equal(
      (payload as any).transactions.filter(
        (tx: TypedTransaction) => bytesToHex(tx.hash()) === bytesToHex(txB011.hash())
      ).length,
      1,
      'txB011 should be in block'
    )
    pendingBlock.pruneSetToMax(0)
    assert.equal(
      pendingBlock.pendingPayloads.size,
      0,
      'should reset the pending payload after build'
    )
  })

  it('should start and stop', async () => {
    const { txPool } = setup()
    await txPool.add(txA01)
    const pendingBlock = new PendingBlock({ config, txPool, skipHardForkValidation: true })
    const vm = await VM.create({ common })
    await setBalance(vm, A.address, BigInt(5000000000000000))
    const parentBlock = await vm.blockchain.getCanonicalHeadBlock!()
    const payloadId = await pendingBlock.start(vm, parentBlock)
    assert.equal(pendingBlock.pendingPayloads.size, 1, 'should set the pending payload')
    pendingBlock.stop(payloadId)
    assert.equal(
      pendingBlock.pendingPayloads.size,
      0,
      'should reset the pending payload after stopping'
    )
  })

  it('should stop adding txs when block is full', async () => {
    const { txPool } = setup()

    // set gas limit low so that can accomodate 2 txs
    const prevGasLimit = common['_chainParams'].genesis.gasLimit
    common['_chainParams'].genesis.gasLimit = 50000

    const vm = await VM.create({ common })
    await setBalance(vm, A.address, BigInt(5000000000000000))

    // create alternate transactions with custom gas limits to
    const txA012 = createTx(A, B, 0, 1, 1000000000, 25000)
    const txA022 = createTx(A, B, 1, 1, 2000000000, 25000) // A -> B, nonce: 1, value: 1, 2x gasPrice

    await txPool.add(txA012)
    await txPool.add(txA022)

    // This tx will not be added since its too big to fit
    const txA03 = LegacyTransaction.fromTxData(
      {
        data: '0xFE', // INVALID opcode, uses all gas
        gasLimit: 10000000,
        gasPrice: 1000000000,
        nonce: 2,
      },
      { common }
    ).sign(A.privateKey)
    await txPool.add(txA03)
    const pendingBlock = new PendingBlock({ config, txPool, skipHardForkValidation: true })
    await setBalance(vm, A.address, BigInt(5000000000000000))
    const parentBlock = await vm.blockchain.getCanonicalHeadBlock!()
    const payloadId = await pendingBlock.start(vm, parentBlock)
    assert.equal(pendingBlock.pendingPayloads.size, 1, 'should set the pending payload')

    // Add a tx to
    const built = await pendingBlock.build(payloadId)
    if (!built) return assert.fail('pendingBlock did not return')
    const [block, receipts] = built
    assert.equal(block?.header.number, BigInt(1), 'should have built block number 1')
    assert.equal(
      block?.transactions.length,
      2,
      'should include txs from pool that fit in the block'
    )
    assert.equal(receipts.length, 2, 'receipts should match number of transactions')
    pendingBlock.pruneSetToMax(0)
    assert.equal(
      pendingBlock.pendingPayloads.size,
      0,
      'should reset the pending payload after build'
    )

    // reset gas Limit
    common['_chainParams'].genesis.gasLimit = prevGasLimit
  })

  it('should skip adding txs when tx too big to fit', async () => {
    const { txPool } = setup()
    const vm = await VM.create({ common })
    await setBalance(vm, A.address, BigInt(5000000000000000))
    await txPool.add(txA01)
    await txPool.add(txA02)
    const txA03 = LegacyTransaction.fromTxData(
      {
        data: '0xFE', // INVALID opcode, uses all gas
        gasLimit: 10000000,
        gasPrice: 1000000000,
        nonce: 2,
      },
      { common }
    ).sign(A.privateKey)
    await txPool.add(txA03)
    const pendingBlock = new PendingBlock({ config, txPool, skipHardForkValidation: true })
    await setBalance(vm, A.address, BigInt(5000000000000000))
    const parentBlock = await vm.blockchain.getCanonicalHeadBlock!()
    const payloadId = await pendingBlock.start(vm, parentBlock)
    assert.equal(pendingBlock.pendingPayloads.size, 1, 'should set the pending payload')
    const built = await pendingBlock.build(payloadId)
    if (!built) return assert.fail('pendingBlock did not return')
    const [block, receipts] = built
    assert.equal(block?.header.number, BigInt(1), 'should have built block number 1')
    assert.equal(
      block?.transactions.length,
      2,
      'should include txs from pool that fit in the block'
    )
    assert.equal(receipts.length, 2, 'receipts should match number of transactions')
    pendingBlock.pruneSetToMax(0)
    assert.equal(
      pendingBlock.pendingPayloads.size,
      0,
      'should reset the pending payload after build'
    )
  })

  it('should not add tx that errors (sender with insufficient funds)', async () => {
    const { txPool } = setup()
    await txPool.add(txA01)
    const pendingBlock = new PendingBlock({ config, txPool, skipHardForkValidation: true })
    const vm = await VM.create({ common })
    const parentBlock = await vm.blockchain.getCanonicalHeadBlock!()
    const payloadId = await pendingBlock.start(vm, parentBlock)
    assert.equal(pendingBlock.pendingPayloads.size, 1, 'should set the pending payload')
    const built = await pendingBlock.build(payloadId)
    if (!built) return assert.fail('pendingBlock did not return')
    const [block, receipts] = built
    assert.equal(block?.header.number, BigInt(1), 'should have built block number 1')
    assert.equal(
      block.transactions.length,
      0,
      'should not include tx with sender that has insufficient funds'
    )
    assert.equal(receipts.length, 0, 'receipts should match number of transactions')
    pendingBlock.pruneSetToMax(0)
    assert.equal(
      pendingBlock.pendingPayloads.size,
      0,
      'should reset the pending payload after build'
    )
  })

  it('should throw when blockchain does not have getTotalDifficulty function', async () => {
    const { txPool } = setup()
    const pendingBlock = new PendingBlock({ config, txPool, skipHardForkValidation: true })
    const vm = txPool['service'].execution.vm
    // override total difficulty function to trigger error case
    vm.blockchain.getTotalDifficulty = undefined
    try {
      await pendingBlock.start(vm, new Block())
      assert.fail('should have thrown')
    } catch (err: any) {
      assert.equal(
        err.message,
        'cannot get iterator head: blockchain has no getTotalDifficulty function'
      )
    }
  })

  it('construct blob bundles', async () => {
    const kzg = await loadKZG()
    const common = Common.fromGethGenesis(gethGenesis, {
      chain: 'customChain',
      hardfork: Hardfork.Cancun,
      customCrypto: {
        kzg,
      },
    })

    const { txPool } = setup()

    const blobs = getBlobs('hello world')
    const commitments = blobsToCommitments(kzg, blobs)
    const blobVersionedHashes = commitmentsToVersionedHashes(commitments)
    const proofs = blobsToProofs(kzg, blobs, commitments)

    // Create 3 txs with 2 blobs each so that only 2 of them can be included in a build
    for (let x = 0; x <= 2; x++) {
      const txA01 = BlobEIP4844Transaction.fromTxData(
        {
          blobVersionedHashes: [
            ...blobVersionedHashes,
            ...blobVersionedHashes,
            ...blobVersionedHashes,
          ],
          blobs: [...blobs, ...blobs, ...blobs],
          kzgCommitments: [...commitments, ...commitments, ...commitments],
          kzgProofs: [...proofs, ...proofs, ...proofs],
          maxFeePerBlobGas: 100000000n,
          gasLimit: 0xffffffn,
          maxFeePerGas: 1000000000n,
          maxPriorityFeePerGas: 100000000n,
          to: randomBytes(20),
          nonce: BigInt(x),
        },
        { common }
      ).sign(A.privateKey)
      await txPool.add(txA01)
    }

    // Add one other normal tx for nonce 3 which should also be not included in the build
    const txNorm = FeeMarketEIP1559Transaction.fromTxData(
      {
        gasLimit: 0xffffffn,
        maxFeePerGas: 1000000000n,
        maxPriorityFeePerGas: 100000000n,
        to: randomBytes(20),
        nonce: BigInt(3),
      },
      { common }
    ).sign(A.privateKey)
    await txPool.add(txNorm)

    assert.equal(txPool.txsInPool, 4, '4 txs should still be in the pool')

    const pendingBlock = new PendingBlock({ config, txPool })
    const vm = await VM.create({ common })
    await setBalance(vm, A.address, BigInt(500000000000000000))
    const parentBlock = await vm.blockchain.getCanonicalHeadBlock!()
    // stub the vm's common set hf to do nothing but stay in cancun
    vm.common.setHardforkBy = () => {
      return vm.common.hardfork()
    }
    const payloadId = await pendingBlock.start(vm, parentBlock)
    const [block, _receipts, _value, blobsBundles] = (await pendingBlock.build(payloadId)) ?? []

    assert.ok(block !== undefined && blobsBundles !== undefined)
    assert.equal(block!.transactions.length, 2, 'Only two blob txs should be included')
    assert.equal(blobsBundles!.blobs.length, 6, 'maximum 6 blobs should be included')
    assert.equal(blobsBundles!.commitments.length, 6, 'maximum 6 commitments should be included')
    assert.equal(blobsBundles!.proofs.length, 6, 'maximum 6 proofs should be included')

    const pendingBlob = blobsBundles!.blobs[0]
    assert.ok(pendingBlob !== undefined && equalsBytes(pendingBlob, blobs[0]))
    const blobProof = blobsBundles!.proofs[0]
    assert.ok(blobProof !== undefined && equalsBytes(blobProof, proofs[0]))
  })

  it('should exclude missingBlobTx', async () => {
    const gethGenesis = require('../../../block/test/testdata/4844-hardfork.json')
    const kzg = await loadKZG()

    const common = Common.fromGethGenesis(gethGenesis, {
      chain: 'customChain',
      hardfork: Hardfork.Cancun,
      customCrypto: { kzg },
    })

    const { txPool } = setup()

    const blobs = getBlobs('hello world')
    const commitments = blobsToCommitments(kzg, blobs)
    const blobVersionedHashes = commitmentsToVersionedHashes(commitments)
    const proofs = blobsToProofs(kzg, blobs, commitments)

    // create a tx with missing blob data which should be excluded from the build
    const missingBlobTx = BlobEIP4844Transaction.fromTxData(
      {
        blobVersionedHashes,
        kzgCommitments: commitments,
        kzgProofs: proofs,
        maxFeePerBlobGas: 100000000n,
        gasLimit: 0xffffffn,
        maxFeePerGas: 1000000000n,
        maxPriorityFeePerGas: 100000000n,
        to: randomBytes(20),
        nonce: BigInt(0),
      },
      { common }
    ).sign(A.privateKey)
    await txPool.add(missingBlobTx)

    assert.equal(txPool.txsInPool, 1, '1 txs should still be in the pool')

    const pendingBlock = new PendingBlock({ config, txPool })
    const vm = await VM.create({ common })
    await setBalance(vm, A.address, BigInt(500000000000000000))
    const parentBlock = await vm.blockchain.getCanonicalHeadBlock!()
    // stub the vm's common set hf to do nothing but stay in cancun
    vm.common.setHardforkBy = () => {
      return vm.common.hardfork()
    }
    const payloadId = await pendingBlock.start(vm, parentBlock)
    const [block, _receipts, _value, blobsBundles] = (await pendingBlock.build(payloadId)) ?? []

    assert.ok(block !== undefined && blobsBundles !== undefined)
    assert.equal(block!.transactions.length, 0, 'Missing blob tx should not be included')
  })
})
