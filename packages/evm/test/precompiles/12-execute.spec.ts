import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { StatefulVerkleStateManager } from '@ethereumjs/statemanager'
import {
  bigIntToBytes,
  bytesToHex,
  concatBytes,
  createAccount,
  createAddressFromPrivateKey,
  createAddressFromString,
  hexToBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import { createVerkleTree } from '@ethereumjs/verkle'
import { sha256 } from 'ethereum-cryptography/sha256'
import * as verkle from 'micro-eth-signer/verkle'
import { assert, describe, it } from 'vitest'

import {
  VerkleAccessWitness,
  createEVM,
  generateExecutionWitness,
  getActivePrecompiles,
} from '../../src/index.js'
import { executionWitnessJSONToSSZ, traceContainer } from '../../src/precompiles/12-execute.js'

describe('Precompiles: EXECUTE', () => {
  it('should execute a trace', async () => {
    const common = new Common({
      chain: Mainnet,
      hardfork: Hardfork.Prague,
      eips: [6800, 9999],
      customCrypto: {
        verkle,
      },
    })
    // Construct L2 state and transaction
    const account = createAccount({ balance: 0xffffffffffffffffffffffffffffffffffffffffn })
    const address = createAddressFromString('0x999aebeac9619be18e0369d9cb8d0393cfb99021')
    const receiver = createAddressFromPrivateKey(
      hexToBytes('0xaeb51ceb07e4f6761ea6ad9a772d0e4a70367020fd6175b5e271d0d12e37d24d'),
    )
    const tx = {
      to: receiver.toBytes(),
      from: address.toBytes(),
      gasLimit: BigInt('0xffffffffff'),
      gasPrice: BigInt('0x1'),
      value: BigInt('0x1'),
      data: new Uint8Array(),
    }
    const tree = await createVerkleTree({ verkleCrypto: verkle })
    const stateManager = new StatefulVerkleStateManager({ common, trie: tree })
    await stateManager.putAccount(address, account)

    const preStateRoot = tree.root()
    const evm = await createEVM({ stateManager, common })

    evm.verkleAccessWitness = new VerkleAccessWitness({
      verkleCrypto: verkle,
    })
    evm.systemVerkleAccessWitness = new VerkleAccessWitness({
      verkleCrypto: verkle,
    })
    const res = await evm.runCall({
      to: receiver,
      caller: address,
      gasLimit: tx.gasLimit,
      gasPrice: tx.gasPrice,
      value: tx.value,
    })
    const executionGasUsed = res.execResult.executionGasUsed
    const postStateRoot = tree.root()
    const execWitness = await generateExecutionWitness(
      stateManager,
      evm.verkleAccessWitness,
      preStateRoot,
    )

    // End of L2 state construction

    // Create a trace
    const trace = {
      witness: executionWitnessJSONToSSZ(execWitness),
      txs: [tx],
    }
    const traceBytes = traceContainer.encode(trace)

    // We use the sha256 hash of the serialized trace as a reference.  This is standing in for the versionedHash that we should use
    // once we have the trace properly converted to an Ethereum blob.
    const hash = bytesToHex(sha256(traceBytes))
    evm['executionBlobs'].set(hash, traceBytes)

    const addressStr = '0000000000000000000000000000000000000012'
    const EXECUTE = getActivePrecompiles(common).get(addressStr)!
    const input = concatBytes(
      preStateRoot,
      postStateRoot,
      hexToBytes(hash),
      setLengthLeft(bigIntToBytes(executionGasUsed), 32),
    )

    const result = await EXECUTE({
      data: input,
      gasLimit: 1000000000n,
      common,
      _EVM: evm,
    })
    assert.equal(result.returnValue[0], 1)
  })
})
