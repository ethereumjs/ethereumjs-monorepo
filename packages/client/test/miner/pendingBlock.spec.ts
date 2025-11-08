import { BlockHeader, createBlockHeader } from '@ethereumjs/block'
import { createBlockchain } from '@ethereumjs/blockchain'
import { Common, Hardfork, Mainnet, createCommonFromGethGenesis } from '@ethereumjs/common'
import { MerkleStateManager } from '@ethereumjs/statemanager'
import { eip4844GethGenesis, goerliChainConfig } from '@ethereumjs/testdata'
import {
  NetworkWrapperType,
  createBlob4844Tx,
  createFeeMarket1559Tx,
  createLegacyTx,
} from '@ethereumjs/tx'
import {
  Account,
  Address,
  Units,
  blobsToCommitments,
  blobsToProofs,
  bytesToHex,
  commitmentsToVersionedHashes,
  getBlobs,
  hexToBytes,
  intToHex,
  randomBytes,
} from '@ethereumjs/util'
import { createVM } from '@ethereumjs/vm'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'
import { assert, describe, it, vi } from 'vitest'

import { Config } from '../../src/config.ts'
import { PendingBlock } from '../../src/miner/index.ts'
import { TxPool } from '../../src/service/txpool.ts'
import { mockBlockchain } from '../rpc/mockBlockchain.ts'

import type { Blockchain } from '@ethereumjs/blockchain'
import type { TypedTransaction } from '@ethereumjs/tx'
import type { PrefixedHexString } from '@ethereumjs/util'
import type { VM } from '@ethereumjs/vm'

const kzg = new microEthKZG(trustedSetup)

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

const common = new Common({ chain: goerliChainConfig, hardfork: Hardfork.Berlin })
// Unschedule any timestamp since tests are not configured for timestamps
common
  .hardforks()
  .filter((hf) => hf.timestamp !== undefined)
  .map((hf) => {
    hf.timestamp = undefined
  })
const txGauge: any = {
  inc: () => {},
}
const config = new Config({
  common,
  accountCache: 10000,
  storageCache: 1000,
  prometheusMetrics: txGauge,
})

const setup = () => {
  const stateManager = {
    getAccount: () => new Account(BigInt(0), BigInt('50000000000000000000')),
    setStateRoot: async () => {},
  }
  const service: any = {
    chain: {
      headers: { height: BigInt(0) },
      getCanonicalHeadHeader: () => createBlockHeader({}, { common }),
    },
    execution: {
      vm: {
        stateManager,
        shallowCopy: () => service.execution.vm,
        setStateRoot: () => {},
        blockchain: mockBlockchain({}),
        common: new Common({ chain: Mainnet }),
      },
    },
  }
  const txPool = new TxPool({ config, service })
  return { txPool }
}

describe('[PendingBlock]', async () => {
  BlockHeader.prototype['_consensusFormatValidation'] = vi.fn()
  vi.doMock('@ethereumjs/block', () => {
    return {
      BlockHeader,
    }
  })

  MerkleStateManager.prototype.setStateRoot = vi.fn()

  const createTx = (
    from = A,
    to = B,
    nonce = 0,
    value = 1,
    gasPrice = 1000000000,
    gasLimit = 100000,
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

  const txA01 = createTx() // A -> B, nonce: 0, value: 1, normal gasPrice
  const txA011 = createTx() // A -> B, nonce: 0, value: 1, normal gasPrice
  const txA02 = createTx(A, B, 1, 1, 2000000000) // A -> B, nonce: 1, value: 1, 2x gasPrice
  const txB01 = createTx(B, A, 0, 1, 2500000000) // B -> A, nonce: 0, value: 1, 2.5x gasPrice
  const txB011 = createTx(B, A, 0, 1, 2500000000) // B -> A, nonce: 0, value: 1, 2.5x gasPrice

  it('should start and build', async () => {
    const { txPool } = setup()
    const blockchain = await createBlockchain({ common })
    const vm = await createVM({ common, blockchain })
    await setBalance(vm, A.address, BigInt(5000000000000000))
    await setBalance(vm, B.address, BigInt(5000000000000000))
    await txPool.add(txA01)
    await txPool.add(txA02)
    // skip hardfork validation for ease
    const pendingBlock = new PendingBlock({ config, txPool, skipHardForkValidation: true })
    const parentBlock = await (vm.blockchain as Blockchain).getCanonicalHeadBlock!()
    const payloadId = await pendingBlock.start(vm, parentBlock)
    assert.strictEqual(pendingBlock.pendingPayloads.size, 1, 'should set the pending payload')
    await txPool.add(txB01)
    const built = await pendingBlock.build(payloadId)
    if (!built) return assert.fail('pendingBlock did not return')
    const [block, receipts] = built
    assert.strictEqual(block?.header.number, BigInt(1), 'should have built block number 1')
    assert.strictEqual(block?.transactions.length, 3, 'should include txs from pool')
    assert.strictEqual(receipts.length, 3, 'receipts should match number of transactions')
    pendingBlock.pruneSetToMax(0)
    assert.strictEqual(
      pendingBlock.pendingPayloads.size,
      0,
      'should reset the pending payload after build',
    )
  })

  it('should include txs with mismatching hardforks that can still be executed', async () => {
    const { txPool } = setup()
    const blockchain = await createBlockchain({ common })
    const vm = await createVM({ common, blockchain })
    await setBalance(vm, A.address, BigInt(5000000000000000))
    await setBalance(vm, B.address, BigInt(5000000000000000))

    txA011.common.setHardfork(Hardfork.Paris)
    await txPool.add(txA011)
    assert.strictEqual(txPool.txsInPool, 1, '1 txA011 should be added')
    // skip hardfork validation for ease
    const pendingBlock = new PendingBlock({ config, txPool })
    const parentBlock = await (vm.blockchain as Blockchain).getCanonicalHeadBlock!()
    const payloadId = await pendingBlock.start(vm, parentBlock)
    assert.strictEqual(pendingBlock.pendingPayloads.size, 1, 'should set the pending payload')
    const payload = pendingBlock.pendingPayloads.get(bytesToHex(payloadId))
    assert.strictEqual(
      (payload as any).transactions.filter(
        (tx: TypedTransaction) => bytesToHex(tx.hash()) === bytesToHex(txA011.hash()),
      ).length,
      1,
      'txA011 should be in block',
    )

    txB011.common.setHardfork(Hardfork.Paris)
    await txPool.add(txB011)
    assert.strictEqual(txPool.txsInPool, 2, '1 txB011 should be added')
    const built = await pendingBlock.build(payloadId)
    if (!built) return assert.fail('pendingBlock did not return')
    const [block] = built
    assert.strictEqual(block?.header.number, BigInt(1), 'should have built block number 1')
    assert.strictEqual(block?.transactions.length, 2, 'should include txs from pool')
    assert.strictEqual(
      (payload as any).transactions.filter(
        (tx: TypedTransaction) => bytesToHex(tx.hash()) === bytesToHex(txB011.hash()),
      ).length,
      1,
      'txB011 should be in block',
    )
    pendingBlock.pruneSetToMax(0)
    assert.strictEqual(
      pendingBlock.pendingPayloads.size,
      0,
      'should reset the pending payload after build',
    )
  })

  it('should start and stop', async () => {
    const { txPool } = setup()
    await txPool.add(txA01)
    const pendingBlock = new PendingBlock({ config, txPool, skipHardForkValidation: true })
    const blockchain = await createBlockchain({ common })
    const vm = await createVM({ common, blockchain })
    await setBalance(vm, A.address, BigInt(5000000000000000))
    const parentBlock = await (vm.blockchain as Blockchain).getCanonicalHeadBlock!()
    const payloadId = await pendingBlock.start(vm, parentBlock)
    assert.strictEqual(pendingBlock.pendingPayloads.size, 1, 'should set the pending payload')
    pendingBlock.stop(payloadId)
    assert.strictEqual(
      pendingBlock.pendingPayloads.size,
      0,
      'should reset the pending payload after stopping',
    )
  })

  it('should stop adding txs when block is full', async () => {
    const { txPool } = setup()

    // set gas limit low so that can accommodate, 2 txs
    const prevGasLimit = common['_chainParams'].genesis.gasLimit
    common['_chainParams'].genesis.gasLimit = 50000

    const blockchain = await createBlockchain({ common })
    const vm = await createVM({ common, blockchain })
    await setBalance(vm, A.address, BigInt(5000000000000000))

    // create alternate transactions with custom gas limits to
    const txA012 = createTx(A, B, 0, 1, 1000000000, 25000)
    const txA022 = createTx(A, B, 1, 1, 2000000000, 25000) // A -> B, nonce: 1, value: 1, 2x gasPrice

    await txPool.add(txA012)
    await txPool.add(txA022)

    // This tx will not be added since its too big to fit
    const txA03 = createLegacyTx(
      {
        data: '0xFE', // INVALID opcode, uses all gas
        gasLimit: 10000000,
        gasPrice: 1000000000,
        nonce: 2,
      },
      { common },
    ).sign(A.privateKey)
    await txPool.add(txA03)
    const pendingBlock = new PendingBlock({ config, txPool, skipHardForkValidation: true })
    await setBalance(vm, A.address, BigInt(5000000000000000))
    const parentBlock = await (vm.blockchain as Blockchain).getCanonicalHeadBlock!()
    const payloadId = await pendingBlock.start(vm, parentBlock)
    assert.strictEqual(pendingBlock.pendingPayloads.size, 1, 'should set the pending payload')

    // Add a tx to
    const built = await pendingBlock.build(payloadId)
    if (!built) return assert.fail('pendingBlock did not return')
    const [block, receipts] = built
    assert.strictEqual(block?.header.number, BigInt(1), 'should have built block number 1')
    assert.strictEqual(
      block?.transactions.length,
      2,
      'should include txs from pool that fit in the block',
    )
    assert.strictEqual(receipts.length, 2, 'receipts should match number of transactions')
    pendingBlock.pruneSetToMax(0)
    assert.strictEqual(
      pendingBlock.pendingPayloads.size,
      0,
      'should reset the pending payload after build',
    )

    // reset gas Limit
    common['_chainParams'].genesis.gasLimit = prevGasLimit
  })

  it('should skip adding txs when tx too big to fit', async () => {
    const { txPool } = setup()
    const blockchain = await createBlockchain({ common })
    const vm = await createVM({ common, blockchain })
    await setBalance(vm, A.address, BigInt(5000000000000000))
    await txPool.add(txA01)
    await txPool.add(txA02)
    const txA03 = createLegacyTx(
      {
        data: '0xFE', // INVALID opcode, uses all gas
        gasLimit: 10000000,
        gasPrice: 1000000000,
        nonce: 2,
      },
      { common },
    ).sign(A.privateKey)
    await txPool.add(txA03)
    const pendingBlock = new PendingBlock({ config, txPool, skipHardForkValidation: true })
    await setBalance(vm, A.address, BigInt(5000000000000000))
    const parentBlock = await (vm.blockchain as Blockchain).getCanonicalHeadBlock!()
    const payloadId = await pendingBlock.start(vm, parentBlock)
    assert.strictEqual(pendingBlock.pendingPayloads.size, 1, 'should set the pending payload')
    const built = await pendingBlock.build(payloadId)
    if (!built) return assert.fail('pendingBlock did not return')
    const [block, receipts] = built
    assert.strictEqual(block?.header.number, BigInt(1), 'should have built block number 1')
    assert.strictEqual(
      block?.transactions.length,
      2,
      'should include txs from pool that fit in the block',
    )
    assert.strictEqual(receipts.length, 2, 'receipts should match number of transactions')
    pendingBlock.pruneSetToMax(0)
    assert.strictEqual(
      pendingBlock.pendingPayloads.size,
      0,
      'should reset the pending payload after build',
    )
  })

  it('should not add tx that errors (sender with insufficient funds)', async () => {
    const { txPool } = setup()
    await txPool.add(txA01)
    const pendingBlock = new PendingBlock({ config, txPool, skipHardForkValidation: true })
    const blockchain = await createBlockchain({ common })
    const vm = await createVM({ common, blockchain })
    const parentBlock = await (vm.blockchain as Blockchain).getCanonicalHeadBlock!()
    const payloadId = await pendingBlock.start(vm, parentBlock)
    assert.strictEqual(pendingBlock.pendingPayloads.size, 1, 'should set the pending payload')
    const built = await pendingBlock.build(payloadId)
    if (!built) return assert.fail('pendingBlock did not return')
    const [block, receipts] = built
    assert.strictEqual(block?.header.number, BigInt(1), 'should have built block number 1')
    assert.strictEqual(
      block.transactions.length,
      0,
      'should not include tx with sender that has insufficient funds',
    )
    assert.strictEqual(receipts.length, 0, 'receipts should match number of transactions')
    pendingBlock.pruneSetToMax(0)
    assert.strictEqual(
      pendingBlock.pendingPayloads.size,
      0,
      'should reset the pending payload after build',
    )
  })

  it('construct blob bundles', async () => {
    const common = createCommonFromGethGenesis(eip4844GethGenesis, {
      chain: 'customChain',
      hardfork: Hardfork.Cancun,
      customCrypto: {
        kzg,
      },
    })

    const { txPool } = setup()
    txPool['config'].chainCommon.setHardfork(Hardfork.Cancun)

    // fill up the blobAndProofByHash and proofs cache before adding a blob tx
    // for cache pruning check
    const fillBlobs = getBlobs('hello world')
    const fillCommitments = blobsToCommitments(kzg, fillBlobs)
    const fillProofs = blobsToProofs(kzg, fillBlobs, fillCommitments)
    const fillBlobAndProof = { blob: fillBlobs[0], proof: fillProofs[0] }

    const blobGasLimit = txPool['config'].chainCommon.param('maxBlobGasPerBlock')
    const blobGasPerBlob = txPool['config'].chainCommon.param('blobGasPerBlob')
    const allowedBlobsPerBlock = Number(blobGasLimit / blobGasPerBlob)
    const allowedLength = allowedBlobsPerBlock * txPool['config'].blobsAndProofsCacheBlocks

    for (let i = 0; i < allowedLength; i++) {
      // this is space efficient as same object is inserted in dummy positions
      txPool.blobAndProofByHash.set(intToHex(i), fillBlobAndProof)
    }
    assert.strictEqual(txPool.blobAndProofByHash.size, allowedLength, 'fill the cache to capacity')

    // Create 2 txs with 3 blobs each so that only 2 of them can be included in a build
    let blobs: PrefixedHexString[] = [],
      proofs: PrefixedHexString[] = [],
      versionedHashes: PrefixedHexString[] = []
    for (let x = 0; x <= 2; x++) {
      // generate unique blobs different from fillBlobs
      const txBlobs = [
        ...getBlobs(`hello world-${x}1`),
        ...getBlobs(`hello world-${x}2`),
        ...getBlobs(`hello world-${x}3`),
      ]
      assert.strictEqual(txBlobs.length, 3, '3 blobs should be created')
      const txCommitments = blobsToCommitments(kzg, txBlobs)
      const txBlobVersionedHashes = commitmentsToVersionedHashes(txCommitments)
      const txProofs = blobsToProofs(kzg, txBlobs, txCommitments)

      const txA01 = createBlob4844Tx(
        {
          networkWrapperVersion: NetworkWrapperType.EIP4844,
          blobVersionedHashes: txBlobVersionedHashes,
          blobs: txBlobs,
          kzgCommitments: txCommitments,
          kzgProofs: txProofs,
          maxFeePerBlobGas: 100000000n,
          gasLimit: 0xffffffn,
          maxFeePerGas: Units.gwei(1),
          maxPriorityFeePerGas: 100000000n,
          to: randomBytes(20),
          nonce: BigInt(x),
        },
        { common },
      ).sign(A.privateKey)
      await txPool.add(txA01)

      // accumulate for verification
      blobs = [...blobs, ...txBlobs]
      proofs = [...proofs, ...txProofs]
      versionedHashes = [...versionedHashes, ...txBlobVersionedHashes]
    }

    assert.strictEqual(
      txPool.blobAndProofByHash.size,
      allowedLength,
      'cache should be prune and stay at same size',
    )
    // check if blobs and proofs are added in txpool by versioned hashes
    for (let i = 0; i < versionedHashes.length; i++) {
      const versionedHash = versionedHashes[i]
      const blob = blobs[i]
      const proof = proofs[i]

      const blobAndProof = txPool.blobAndProofByHash.get(versionedHash) ?? {
        blob: '0x0',
        proof: '0x0',
      }
      assert.strictEqual(blob, blobAndProof.blob, 'blob should match')
      assert.strictEqual(proof, blobAndProof.proof, 'proof should match')
    }

    // Add one other normal tx for nonce 3 which should also be not included in the build
    const txNorm = createFeeMarket1559Tx(
      {
        gasLimit: 0xffffffn,
        maxFeePerGas: Units.gwei(1),
        maxPriorityFeePerGas: 100000000n,
        to: randomBytes(20),
        nonce: BigInt(3),
      },
      { common },
    ).sign(A.privateKey)
    await txPool.add(txNorm)

    assert.strictEqual(txPool.txsInPool, 4, '4 txs should still be in the pool')

    const pendingBlock = new PendingBlock({ config, txPool })
    const blockchain = await createBlockchain({ common })
    const vm = await createVM({ common, blockchain })
    await setBalance(vm, A.address, BigInt(500000000000000000))
    const parentBlock = await (vm.blockchain as Blockchain).getCanonicalHeadBlock!()
    // stub the vm's common set hf to do nothing but stay in cancun
    vm.common.setHardforkBy = () => {
      return vm.common.hardfork()
    }
    const payloadId = await pendingBlock.start(vm, parentBlock)
    const [block, _receipts, _value, blobsBundles] = (await pendingBlock.build(payloadId)) ?? []

    assert.isTrue(block !== undefined && blobsBundles !== undefined)
    assert.strictEqual(block!.transactions.length, 2, 'Only two blob txs should be included')
    assert.strictEqual(blobsBundles!.blobs.length, 6, 'maximum 6 blobs should be included')
    assert.strictEqual(
      blobsBundles!.commitments.length,
      6,
      'maximum 6 commitments should be included',
    )
    assert.strictEqual(blobsBundles!.proofs.length, 6, 'maximum 6 proofs should be included')

    const pendingBlob = blobsBundles!.blobs[0]
    assert.isTrue(pendingBlob !== undefined && pendingBlob === blobs[0])
    const blobProof = blobsBundles!.proofs[0]
    assert.isTrue(blobProof !== undefined && blobProof === proofs[0])
  }, 30000)
})
