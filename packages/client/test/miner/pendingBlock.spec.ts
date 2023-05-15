import { Block, BlockHeader } from '@ethereumjs/block'
import { Common, Chain as CommonChain, Hardfork } from '@ethereumjs/common'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import { BlobEIP4844Transaction, FeeMarketEIP1559Transaction, Transaction } from '@ethereumjs/tx'
import {
  Account,
  Address,
  blobsToCommitments,
  blobsToProofs,
  bytesToHex,
  bytesToPrefixedHexString,
  commitmentsToVersionedHashes,
  equalsBytes,
  getBlobs,
  hexStringToBytes,
  initKZG,
  randomBytes,
} from '@ethereumjs/util'
import { VM } from '@ethereumjs/vm'
import * as kzg from 'c-kzg'
import * as tape from 'tape'
import * as td from 'testdouble'

import { Config } from '../../lib/config'
import { getLogger } from '../../lib/logging'
import { PendingBlock } from '../../lib/miner'
import { TxPool } from '../../lib/service/txpool'
import { mockBlockchain } from '../rpc/mockBlockchain'

import type { TypedTransaction } from '@ethereumjs/tx'

const A = {
  address: new Address(hexStringToBytes('0b90087d864e82a284dca15923f3776de6bb016f')),
  privateKey: hexStringToBytes('64bf9cc30328b0e42387b3c82c614e6386259136235e20c1357bd11cdee86993'),
}

const B = {
  address: new Address(hexStringToBytes('6f62d8382bf2587361db73ceca28be91b2acb6df')),
  privateKey: hexStringToBytes('2a6e9ad5a6a8e4f17149b8bc7128bf090566a11dbd63c30e5a0ee9f161309cd6'),
}

const setBalance = async (vm: VM, address: Address, balance: bigint) => {
  await vm.stateManager.checkpoint()
  await vm.stateManager.modifyAccountFields(address, { balance })
  await vm.stateManager.commit()
}

const common = new Common({ chain: CommonChain.Rinkeby, hardfork: Hardfork.Berlin })
const config = new Config({
  transports: [],
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
        eei: { getAccount: () => stateManager.getAccount() },
        copy: () => service.execution.vm,
        setStateRoot: () => {},
        blockchain: mockBlockchain({}),
      },
    },
  }
  const txPool = new TxPool({ config, service })
  return { txPool }
}

tape('[PendingBlock]', async (t) => {
  const originalValidate = BlockHeader.prototype._consensusFormatValidation
  BlockHeader.prototype._consensusFormatValidation = td.func<any>()
  td.replace<any>('@ethereumjs/block', { BlockHeader })

  const originalSetStateRoot = DefaultStateManager.prototype.setStateRoot
  DefaultStateManager.prototype.setStateRoot = td.func<any>()

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
    const tx = Transaction.fromTxData(txData, { common })
    const signedTx = tx.sign(from.privateKey)
    return signedTx
  }

  const txA01 = createTx() // A -> B, nonce: 0, value: 1, normal gasPrice
  const txA011 = createTx() // A -> B, nonce: 0, value: 1, normal gasPrice
  const txA02 = createTx(A, B, 1, 1, 2000000000) // A -> B, nonce: 1, value: 1, 2x gasPrice
  const txB01 = createTx(B, A, 0, 1, 2500000000) // B -> A, nonce: 0, value: 1, 2.5x gasPrice
  const txB011 = createTx(B, A, 0, 1, 2500000000) // B -> A, nonce: 0, value: 1, 2.5x gasPrice

  t.test('should start and build', async (t) => {
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
    t.equal(pendingBlock.pendingPayloads.size, 1, 'should set the pending payload')
    await txPool.add(txB01)
    const built = await pendingBlock.build(payloadId)
    if (!built) return t.fail('pendingBlock did not return')
    const [block, receipts] = built
    t.equal(block?.header.number, BigInt(1), 'should have built block number 1')
    t.equal(block?.transactions.length, 3, 'should include txs from pool')
    t.equal(receipts.length, 3, 'receipts should match number of transactions')
    pendingBlock.pruneSetToMax(0)
    t.equal(pendingBlock.pendingPayloads.size, 0, 'should reset the pending payload after build')
    t.end()
  })

  t.test('should include txs with mismatching hardforks that can still be executed', async (t) => {
    const { txPool } = setup()
    const vm = await VM.create({ common })
    await setBalance(vm, A.address, BigInt(5000000000000000))
    await setBalance(vm, B.address, BigInt(5000000000000000))

    txA011.common.setHardfork(Hardfork.Paris)
    await txPool.add(txA011)
    t.equal(txPool.txsInPool, 1, '1 txA011 should be added')
    // skip hardfork validation for ease
    const pendingBlock = new PendingBlock({ config, txPool })
    const parentBlock = await vm.blockchain.getCanonicalHeadBlock!()
    const payloadId = await pendingBlock.start(vm, parentBlock)
    t.equal(pendingBlock.pendingPayloads.size, 1, 'should set the pending payload')
    const payload = pendingBlock.pendingPayloads.get(bytesToPrefixedHexString(payloadId))
    t.equal(
      (payload as any).transactions.filter(
        (tx: TypedTransaction) => bytesToHex(tx.hash()) === bytesToHex(txA011.hash())
      ).length,
      1,
      'txA011 should be in block'
    )

    txB011.common.setHardfork(Hardfork.Paris)
    await txPool.add(txB011)
    t.equal(txPool.txsInPool, 2, '1 txB011 should be added')
    const built = await pendingBlock.build(payloadId)
    if (!built) return t.fail('pendingBlock did not return')
    const [block] = built
    t.equal(block?.header.number, BigInt(1), 'should have built block number 1')
    t.equal(block?.transactions.length, 2, 'should include txs from pool')
    t.equal(
      (payload as any).transactions.filter(
        (tx: TypedTransaction) => bytesToHex(tx.hash()) === bytesToHex(txB011.hash())
      ).length,
      1,
      'txB011 should be in block'
    )
    pendingBlock.pruneSetToMax(0)
    t.equal(pendingBlock.pendingPayloads.size, 0, 'should reset the pending payload after build')
    t.end()
  })

  t.test('should start and stop', async (t) => {
    const { txPool } = setup()
    await txPool.add(txA01)
    const pendingBlock = new PendingBlock({ config, txPool, skipHardForkValidation: true })
    const vm = await VM.create({ common })
    await setBalance(vm, A.address, BigInt(5000000000000000))
    const parentBlock = await vm.blockchain.getCanonicalHeadBlock!()
    const payloadId = await pendingBlock.start(vm, parentBlock)
    t.equal(pendingBlock.pendingPayloads.size, 1, 'should set the pending payload')
    pendingBlock.stop(payloadId)
    t.equal(pendingBlock.pendingPayloads.size, 0, 'should reset the pending payload after stopping')
    t.end()
  })

  t.test('should stop adding txs when block is full', async (t) => {
    const { txPool } = setup()
    const vm = await VM.create({ common })
    await setBalance(vm, A.address, BigInt(5000000000000000))
    await txPool.add(txA01)
    await txPool.add(txA02)
    const txA03 = Transaction.fromTxData(
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
    t.equal(pendingBlock.pendingPayloads.size, 1, 'should set the pending payload')
    const built = await pendingBlock.build(payloadId)
    if (!built) return t.fail('pendingBlock did not return')
    const [block, receipts] = built
    t.equal(block?.header.number, BigInt(1), 'should have built block number 1')
    t.equal(block?.transactions.length, 2, 'should include txs from pool that fit in the block')
    t.equal(receipts.length, 2, 'receipts should match number of transactions')
    pendingBlock.pruneSetToMax(0)
    t.equal(pendingBlock.pendingPayloads.size, 0, 'should reset the pending payload after build')
    t.end()
  })

  t.test('should not add tx that errors (sender with insufficient funds)', async (t) => {
    const { txPool } = setup()
    await txPool.add(txA01)
    const pendingBlock = new PendingBlock({ config, txPool, skipHardForkValidation: true })
    const vm = await VM.create({ common })
    const parentBlock = await vm.blockchain.getCanonicalHeadBlock!()
    const payloadId = await pendingBlock.start(vm, parentBlock)
    t.equal(pendingBlock.pendingPayloads.size, 1, 'should set the pending payload')
    const built = await pendingBlock.build(payloadId)
    if (!built) return t.fail('pendingBlock did not return')
    const [block, receipts] = built
    t.equal(block?.header.number, BigInt(1), 'should have built block number 1')
    t.equal(
      block.transactions.length,
      0,
      'should not include tx with sender that has insufficient funds'
    )
    t.equal(receipts.length, 0, 'receipts should match number of transactions')
    pendingBlock.pruneSetToMax(0)
    t.equal(pendingBlock.pendingPayloads.size, 0, 'should reset the pending payload after build')
    t.end()
  })

  t.test('should throw when blockchain does not have getTotalDifficulty function', async (st) => {
    const { txPool } = setup()
    const pendingBlock = new PendingBlock({ config, txPool, skipHardForkValidation: true })
    const vm = (txPool as any).vm
    try {
      await pendingBlock.start(vm, new Block())
      st.fail('should have thrown')
    } catch (err: any) {
      st.equal(
        err.message,
        'cannot get iterator head: blockchain has no getTotalDifficulty function'
      )
    }
  })

  t.test('construct blob bundles', async (st) => {
    try {
      initKZG(kzg, __dirname + '/../../lib/trustedSetups/devnet4.txt')
      // eslint-disable-next-line
    } catch {}
    const gethGenesis = require('../../../block/test/testdata/4844-hardfork.json')
    const common = Common.fromGethGenesis(gethGenesis, {
      chain: 'customChain',
      hardfork: Hardfork.Cancun,
    })
    const { txPool } = setup()

    const blobs = getBlobs('hello world')
    const commitments = blobsToCommitments(blobs)
    const versionedHashes = commitmentsToVersionedHashes(commitments)
    const proofs = blobsToProofs(blobs, commitments)

    // Create 3 txs with 2 blobs each so that only 2 of them can be included in a build
    for (let x = 0; x <= 2; x++) {
      const txA01 = BlobEIP4844Transaction.fromTxData(
        {
          versionedHashes,
          blobs: [...blobs, ...blobs],
          kzgCommitments: [...commitments, ...commitments],
          kzgProofs: [...proofs, ...proofs],
          maxFeePerDataGas: 100000000n,
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
    st.equal(txPool.txsInPool, 4, '4 txs should still be in the pool')

    const pendingBlock = new PendingBlock({ config, txPool })
    const vm = await VM.create({ common })
    await setBalance(vm, A.address, BigInt(500000000000000000))
    const parentBlock = await vm.blockchain.getCanonicalHeadBlock!()
    // stub the vm's common set hf to do nothing but stay in cancun
    vm._common.setHardforkByBlockNumber = (_a: bigint, _b?: bigint, _c?: bigint) => {
      return vm._common.hardfork()
    }
    const payloadId = await pendingBlock.start(vm, parentBlock)
    const [block, _receipts, _value, blobsBundles] = (await pendingBlock.build(payloadId)) ?? []

    st.ok(block !== undefined && blobsBundles !== undefined)
    st.equal(block!.transactions.length, 2, 'Only two blob txs should be included')
    st.equal(blobsBundles!.blobs.length, 4, 'maximum 4 blobs should be included')
    st.equal(blobsBundles!.commitments.length, 4, 'maximum 4 commitments should be included')
    st.equal(blobsBundles!.proofs.length, 4, 'maximum 4 proofs should be included')

    const pendingBlob = blobsBundles!.blobs[0]
    st.ok(pendingBlob !== undefined && equalsBytes(pendingBlob, blobs[0]))
    const blobProof = blobsBundles!.proofs[0]
    st.ok(blobProof !== undefined && equalsBytes(blobProof, proofs[0]))
    st.end()
  })
  t.test('should reset td', (st) => {
    td.reset()
    // according to https://github.com/testdouble/testdouble.js/issues/379#issuecomment-415868424
    // mocking indirect dependencies is not properly supported, but it works for us in this file,
    // so we will replace the original functions to avoid issues in other tests that come after
    BlockHeader.prototype._consensusFormatValidation = originalValidate
    DefaultStateManager.prototype.setStateRoot = originalSetStateRoot

    st.end()
  })
})
