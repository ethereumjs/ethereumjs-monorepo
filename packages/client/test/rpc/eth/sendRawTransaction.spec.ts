import { BlockHeader, paramsBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet, createCommonFromGethGenesis } from '@ethereumjs/common'
import { MerkleStateManager } from '@ethereumjs/statemanager'
import { createBlob4844Tx, createFeeMarket1559TxFromRLP, createLegacyTx } from '@ethereumjs/tx'
import {
  Account,
  blobsToCommitments,
  bytesToHex,
  commitmentsToVersionedHashes,
  getBlobs,
  hexToBytes,
  randomBytes,
} from '@ethereumjs/util'
import { trustedSetup } from '@paulmillr/trusted-setups/fast.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg'
import { assert, describe, it } from 'vitest'

import { INTERNAL_ERROR, INVALID_PARAMS, PARSE_ERROR } from '../../../src/rpc/error-code.ts'
import { baseSetup } from '../helpers.ts'

import type { PrefixedHexString } from '@ethereumjs/util'

const method = 'eth_sendRawTransaction'

const kzg = new microEthKZG(trustedSetup)
describe(method, () => {
  it('call with valid arguments', async () => {
    // Disable stateroot validation in TxPool since valid state root isn't available
    const originalSetStateRoot = MerkleStateManager.prototype.setStateRoot
    const originalStateManagerCopy = MerkleStateManager.prototype.shallowCopy
    MerkleStateManager.prototype.setStateRoot = function (): any {}
    MerkleStateManager.prototype.shallowCopy = function () {
      return this
    }
    // Unschedule any timestamp since tests are not configured for timestamps
    Mainnet.hardforks
      .filter((hf) => hf.timestamp !== undefined)
      .map((hf) => {
        hf.timestamp = undefined
      })
    const common = new Common({ chain: Mainnet })
    common
      .hardforks()
      .filter((hf) => hf.timestamp !== undefined)
      .map((hf) => {
        hf.timestamp = undefined
      })

    const syncTargetHeight = common.hardforkBlock(Hardfork.London)
    const { rpc, client } = await baseSetup({ syncTargetHeight, includeVM: true })

    // Mainnet EIP-1559 tx
    const txData =
      '0x02f90108018001018402625a0094cccccccccccccccccccccccccccccccccccccccc830186a0b8441a8451e600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f85bf859940000000000000000000000000000000000000101f842a00000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000060a701a0afb6e247b1c490e284053c87ab5f6b59e219d51f743f7a4d83e400782bc7e4b9a0479a268e0e0acd4de3f1e28e4fac2a6b32a4195e8dfa9d19147abe8807aa6f64'
    const transaction = createFeeMarket1559TxFromRLP(hexToBytes(txData))
    const address = transaction.getSenderAddress()
    const vm = client.service.execution.vm
    await vm.stateManager.putAccount(address, new Account())
    const account = await vm.stateManager.getAccount(address)
    account!.balance = BigInt('40100000')
    await vm.stateManager.putAccount(address, account!)
    const res = await rpc.request(method, [txData])

    assert.strictEqual(
      res.result,
      '0xd7217a7d3251880051783f305a3536e368c604aa1f1602e6cd107eb7b87129da',
      'should return the correct tx hash',
    )

    // Restore setStateRoot
    MerkleStateManager.prototype.setStateRoot = originalSetStateRoot
    MerkleStateManager.prototype.shallowCopy = originalStateManagerCopy
  })

  it('send local tx with gasprice lower than minimum', async () => {
    // Disable stateroot validation in TxPool since valid state root isn't available
    const originalSetStateRoot = MerkleStateManager.prototype.setStateRoot
    MerkleStateManager.prototype.setStateRoot = (): any => {}
    const syncTargetHeight = new Common({ chain: Mainnet }).hardforkBlock(Hardfork.London)
    const { rpc } = await baseSetup({ syncTargetHeight, includeVM: true })

    const transaction = createLegacyTx({
      gasLimit: 21000,
      gasPrice: 0,
      nonce: 0,
    }).sign(hexToBytes(`0x${'42'.repeat(32)}`))

    const txData = bytesToHex(transaction.serialize())

    const res = await rpc.request(method, [txData])

    assert.strictEqual(
      res.result,
      '0xf6798d5ed936a464ef4f49dd5a3abe1ad6947364912bd47c5e56781125d44ac3',
      'local tx with lower gasprice than minimum gasprice added to pool',
    )

    // Restore setStateRoot
    MerkleStateManager.prototype.setStateRoot = originalSetStateRoot
  })

  it('call with invalid arguments: not enough balance', async () => {
    // Disable stateroot validation in TxPool since valid state root isn't available
    const originalSetStateRoot = MerkleStateManager.prototype.setStateRoot
    MerkleStateManager.prototype.setStateRoot = (): any => {}
    const syncTargetHeight = new Common({ chain: Mainnet }).hardforkBlock(Hardfork.London)
    const { rpc } = await baseSetup({ syncTargetHeight, includeVM: true })

    // Mainnet EIP-1559 tx
    const txData =
      '0x02f90108018001018402625a0094cccccccccccccccccccccccccccccccccccccccc830186a0b8441a8451e600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f85bf859940000000000000000000000000000000000000101f842a00000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000060a701a0afb6e247b1c490e284053c87ab5f6b59e219d51f743f7a4d83e400782bc7e4b9a0479a268e0e0acd4de3f1e28e4fac2a6b32a4195e8dfa9d19147abe8807aa6f64'

    const res = await rpc.request(method, [txData])
    assert.strictEqual(res.error.code, INVALID_PARAMS)
    assert.isTrue(res.error.message.includes('insufficient balance'))

    // Restore setStateRoot
    MerkleStateManager.prototype.setStateRoot = originalSetStateRoot
  })

  it('call with sync target height not set yet', async () => {
    const { rpc, client } = await baseSetup()
    client.config.synchronized = false

    // Mainnet EIP-1559 tx
    const txData =
      '0x02f90108018001018402625a0094cccccccccccccccccccccccccccccccccccccccc830186a0b8441a8451e600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f85bf859940000000000000000000000000000000000000101f842a00000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000060a701a0afb6e247b1c490e284053c87ab5f6b59e219d51f743f7a4d83e400782bc7e4b9a0479a268e0e0acd4de3f1e28e4fac2a6b32a4195e8dfa9d19147abe8807aa6f64'
    const res = await rpc.request(method, [txData])

    assert.strictEqual(res.error.code, INTERNAL_ERROR)
    assert.isTrue(
      res.error.message.includes(
        'client is not aware of the current chain height yet (give sync some more time)',
      ),
    )
  })

  it('call with invalid tx (wrong chain ID)', async () => {
    const syncTargetHeight = new Common({ chain: Mainnet }).hardforkBlock(Hardfork.London)
    const { rpc } = await baseSetup({ syncTargetHeight, includeVM: true })

    // Baikal EIP-1559 tx
    const txData =
      '0x02f9010a82066a8001018402625a0094cccccccccccccccccccccccccccccccccccccccc830186a0b8441a8451e600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f85bf859940000000000000000000000000000000000000101f842a00000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000060a701a0afb6e247b1c490e284053c87ab5f6b59e219d51f743f7a4d83e400782bc7e4b9a0479a268e0e0acd4de3f1e28e4fac2a6b32a4195e8dfa9d19147abe8807aa6f64'
    const res = await rpc.request(method, [txData])

    assert.strictEqual(res.error.code, PARSE_ERROR)
    assert.isTrue(res.error.message.includes('serialized tx data could not be parsed'))
  })

  it('call with unsigned tx', async () => {
    const syncTargetHeight = new Common({ chain: Mainnet }).hardforkBlock(Hardfork.London)
    const { rpc } = await baseSetup({ syncTargetHeight })

    // Mainnet EIP-1559 tx
    const txData =
      '0x02f90108018001018402625a0094cccccccccccccccccccccccccccccccccccccccc830186a0b8441a8451e600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f85bf859940000000000000000000000000000000000000101f842a00000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000060a701a0afb6e247b1c490e284053c87ab5f6b59e219d51f743f7a4d83e400782bc7e4b9a0479a268e0e0acd4de3f1e28e4fac2a6b32a4195e8dfa9d19147abe8807aa6f64'
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.London })
    const tx = createFeeMarket1559TxFromRLP(hexToBytes(txData), {
      common,
      freeze: false,
    })
    /// @ts-expect-error -- Assign to-readonly property
    tx.v = undefined
    /// @ts-expect-error -- Assign to-readonly property
    tx.r = undefined
    /// @ts-expect-error -- Assign to-readonly property
    tx.s = undefined
    const txHex = bytesToHex(tx.serialize())
    const res = await rpc.request(method, [txHex])

    assert.strictEqual(res.error.code, INVALID_PARAMS)
    assert.isTrue(res.error.message.includes('tx needs to be signed'))
  })

  it('call with no peers', async () => {
    // Disable stateroot validation in TxPool since valid state root isn't available
    const originalSetStateRoot = MerkleStateManager.prototype.setStateRoot
    MerkleStateManager.prototype.setStateRoot = (): any => {}
    const originalStateManagerCopy = MerkleStateManager.prototype.shallowCopy
    MerkleStateManager.prototype.shallowCopy = function () {
      return this
    }
    const common = new Common({ chain: Mainnet, hardfork: Hardfork.London })

    const syncTargetHeight = common.hardforkBlock(Hardfork.London)
    const { rpc, client } = await baseSetup({
      commonChain: common,
      syncTargetHeight,
      includeVM: true,
      noPeers: true,
    })

    // Mainnet EIP-1559 tx
    const txData =
      '0x02f90108018001018402625a0094cccccccccccccccccccccccccccccccccccccccc830186a0b8441a8451e600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f85bf859940000000000000000000000000000000000000101f842a00000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000060a701a0afb6e247b1c490e284053c87ab5f6b59e219d51f743f7a4d83e400782bc7e4b9a0479a268e0e0acd4de3f1e28e4fac2a6b32a4195e8dfa9d19147abe8807aa6f64'
    const transaction = createFeeMarket1559TxFromRLP(hexToBytes(txData))
    const address = transaction.getSenderAddress()
    const vm = client.service.execution.vm

    await vm.stateManager.putAccount(address, new Account())
    const account = await vm.stateManager.getAccount(address)
    account!.balance = BigInt('40100000')
    await vm.stateManager.putAccount(address, account!)

    const res = await rpc.request(method, [txData])

    assert.strictEqual(res.error.code, INTERNAL_ERROR)
    assert.isTrue(res.error.message.includes('no peer connection available'))

    // Restore setStateRoot
    MerkleStateManager.prototype.setStateRoot = originalSetStateRoot
    MerkleStateManager.prototype.shallowCopy = originalStateManagerCopy
  })

  it('blob EIP 4844 transaction', async () => {
    // Disable stateroot validation in TxPool since valid state root isn't available
    const originalSetStateRoot = MerkleStateManager.prototype.setStateRoot
    MerkleStateManager.prototype.setStateRoot = (): any => {}
    const originalStateManagerCopy = MerkleStateManager.prototype.shallowCopy
    MerkleStateManager.prototype.shallowCopy = function () {
      return this
    }
    // Disable block header consensus format validation
    const consensusFormatValidation = BlockHeader.prototype['_consensusFormatValidation']
    BlockHeader.prototype['_consensusFormatValidation'] = (): any => {}
    const { eip4844GethGenesis } = await import('@ethereumjs/testdata')

    const common = createCommonFromGethGenesis(eip4844GethGenesis, {
      chain: 'customChain',
      hardfork: Hardfork.Cancun,
      customCrypto: { kzg },
      params: paramsBlock,
    })

    common.setHardfork(Hardfork.Cancun)
    const { rpc, client } = await baseSetup({
      commonChain: common,
      includeVM: true,
      syncTargetHeight: 100n,
    })
    const blobs = getBlobs('hello world')
    const commitments = blobsToCommitments(kzg, blobs)
    const blobVersionedHashes = commitmentsToVersionedHashes(commitments)
    const proofs = blobs.map((blob, ctx) =>
      kzg.computeBlobProof(blob, commitments[ctx]),
    ) as PrefixedHexString[]
    const pk = randomBytes(32)
    const tx = createBlob4844Tx(
      {
        blobVersionedHashes,
        blobs,
        kzgCommitments: commitments,
        kzgProofs: proofs,
        maxFeePerBlobGas: 1000000n,
        gasLimit: 0xffffn,
        maxFeePerGas: 10000000n,
        maxPriorityFeePerGas: 1000000n,
        to: randomBytes(20),
      },
      { common },
    ).sign(pk)

    const replacementTx = createBlob4844Tx(
      {
        blobVersionedHashes,
        blobs,
        kzgCommitments: commitments,
        kzgProofs: proofs,
        maxFeePerBlobGas: 1000000n,
        gasLimit: 0xfffffn,
        maxFeePerGas: 100000000n,
        maxPriorityFeePerGas: 10000000n,
        to: randomBytes(20),
      },
      { common },
    ).sign(pk)
    const vm = client.service.execution.vm
    await vm.stateManager.putAccount(tx.getSenderAddress(), new Account())
    const account = await vm.stateManager.getAccount(tx.getSenderAddress())
    account!.balance = BigInt(0xfffffffffffff)
    await vm.stateManager.putAccount(tx.getSenderAddress(), account!)

    const res = await rpc.request(method, [bytesToHex(tx.serializeNetworkWrapper())])

    const res2 = await rpc.request(method, [bytesToHex(replacementTx.serializeNetworkWrapper())])

    assert.strictEqual(res.error, undefined, 'initial blob transaction accepted')

    assert.strictEqual(res2.error.code, INVALID_PARAMS)
    assert.include(res2.error.message, 'replacement blob gas too low')

    // Restore stubbed out functionality
    MerkleStateManager.prototype.setStateRoot = originalSetStateRoot
    MerkleStateManager.prototype.shallowCopy = originalStateManagerCopy
    BlockHeader.prototype['_consensusFormatValidation'] = consensusFormatValidation
  })
})
