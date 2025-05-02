import { binaryTreeFromProof, decodeBinaryNode } from '@ethereumjs/binarytree'
import { StatefulBinaryTreeStateManager } from '@ethereumjs/statemanager'
import {
  type PrefixedHexString,
  bytesToBigInt,
  bytesToHex,
  createAddressFromString,
  equalsBytes,
  hexToBytes,
} from '@ethereumjs/util'
import * as ssz from 'micro-eth-signer/ssz'

import {
  BinaryTreeAccessWitness,
  type generateBinaryExecutionWitness,
} from '../binaryTreeAccessWitness.ts'
import { createEVM } from '../constructors.ts'
import { EVMErrorResult, OOGResult } from '../evm.ts'

import { gasLimitCheck } from './util.ts'

import { getPrecompileName } from './index.ts'

import type { BinaryNode } from '@ethereumjs/binarytree'
import { EVMError } from '../errors.ts'
import type { EVM } from '../evm.ts'
import type { ExecResult } from '../types.ts'
import type { PrecompileInput } from './types.ts'

// For suffix diffs in state diff
const SuffixDiff = ssz.container({
  suffix: ssz.uint8,
  currentValue: ssz.bytevector(32),
  newValue: ssz.bytevector(32),
})

// For state diff entries
const StateDiff = ssz.container({
  stem: ssz.bytevector(31), // The stem as a hex string
  suffixDiffs: ssz.list(256, SuffixDiff), // List of suffix diffs
})

// For proof entries
const ProofEntry = ssz.container({
  stem: ssz.bytevector(31), // 31-byte vector for the stem
  proofData: ssz.list(32, ssz.bytelist(16384)), // List of byte arrays, each up to 16384 bytes
})

// Define the BinaryTreeExecutionWitness container
const BinaryTreeExecutionWitness = ssz.container({
  stateDiff: ssz.list(1024, StateDiff), // List of state diffs
  parentStateRoot: ssz.bytevector(32), // Parent state root as hex
  proof: ssz.list(256, ProofEntry), // List of proof entries with stems and proof data
})

const MAX_CALL_DATA_SIZE = 7500000 // Assuming a transaction with all zero bytes fills up an entire block worth of gas
export const traceContainer: ssz.SSZCoder<any> = ssz.container({
  txs: ssz.list(
    // An ssz list of tx objects that match the `eth_call` tx object format
    256,
    ssz.container({
      to: ssz.bytevector(20),
      from: ssz.bytevector(20),
      gasLimit: ssz.uint64,
      gasPrice: ssz.uint64,
      value: ssz.uint64,
      data: ssz.bytelist(MAX_CALL_DATA_SIZE),
    }),
  ),
  witness: BinaryTreeExecutionWitness,
})

export const stateWitnessJSONToSSZ = (
  witness: Awaited<ReturnType<typeof generateBinaryExecutionWitness>>,
) => {
  return {
    stateDiff: witness.stateDiff.map((diff) => ({
      stem: hexToBytes(diff.stem),
      suffixDiffs: diff.suffixDiffs.map((suffixDiff) => ({
        suffix: suffixDiff.suffix,
        currentValue:
          suffixDiff.currentValue !== null
            ? hexToBytes(suffixDiff.currentValue)
            : new Uint8Array(32),
        newValue:
          suffixDiff.newValue !== null ? hexToBytes(suffixDiff.newValue) : new Uint8Array(32),
      })),
    })),
    parentStateRoot: hexToBytes(witness.parentStateRoot),
    proof: Object.entries(witness.proof).map(([stem, proof]) => ({
      stem: hexToBytes(stem as PrefixedHexString),
      proofData: proof,
    })),
  }
}

export async function precompile12(opts: PrecompileInput): Promise<ExecResult> {
  const pName = getPrecompileName('12')
  const data = opts.data
  const evm = opts._EVM as EVM
  const gasUsed = opts.common.param('executeGasCost')
  if (!gasLimitCheck(opts, gasUsed, pName)) {
    return OOGResult(opts.gasLimit)
  }
  if (data.length !== 128) {
    return EVMErrorResult(new EVMError(EVMError.errorMessages.INVALID_INPUT_LENGTH), opts.gasLimit)
  }
  const _preStateRoot = data.subarray(0, 32) // prestateroot for L2 state
  const postStateRoot = data.subarray(32, 64) // post state root for L2 state
  const traceBlob = evm['executionBlobs'].get(bytesToHex(data.subarray(64, 96))) // reference to state access and transactions
  if (traceBlob === undefined) {
    opts._debug?.(`${pName} error - trace not found`)
    return EVMErrorResult(new EVMError(EVMError.errorMessages.REVERT), opts.gasLimit)
  }
  const decodedTrace = traceContainer.decode(traceBlob)
  if (decodedTrace.txs === undefined || decodedTrace.witness === undefined) {
    opts._debug?.(`${pName} error - trace is invalid`)
    return EVMErrorResult(new EVMError(EVMError.errorMessages.REVERT), opts.gasLimit)
  }
  const executeGasUsed = bytesToBigInt(data.subarray(96))

  // Populate the L2 state trie with the prestate

  const witness = decodedTrace.witness
  const tree = await binaryTreeFromProof(witness.proof[0].proofData)
  for (const proof of witness.proof.slice(1)) {
    const putStack: [Uint8Array, BinaryNode][] = proof.proofData.map((bytes: Uint8Array) => {
      const node = decodeBinaryNode(bytes)
      return [tree['merkelize'](node), node]
    })
    await tree.saveStack(putStack)
  }

  let executionResult = true
  const stateManager = new StatefulBinaryTreeStateManager({ common: opts.common, tree })
  const l2EVM = await createEVM({ stateManager, common: opts.common })
  l2EVM.binaryAccessWitness = new BinaryTreeAccessWitness({
    hashFunction: tree['_opts'].hashFunction,
  })
  l2EVM.systemBinaryAccessWitness = new BinaryTreeAccessWitness({
    hashFunction: tree['_opts'].hashFunction,
  })
  let computedGasUsed = 0n
  // Run each transaction in the trace
  for (const tx of decodedTrace.txs) {
    const res = await l2EVM.runCall({
      to: createAddressFromString(bytesToHex(tx.to)),
      caller: createAddressFromString(bytesToHex(tx.from)),
      gasLimit: BigInt(tx.gasLimit),
      gasPrice: BigInt(tx.gasPrice),
      value: BigInt(tx.value),
      data: tx.data !== undefined ? tx.data : undefined,
    })
    computedGasUsed += res.execResult.executionGasUsed
  }
  if (computedGasUsed !== executeGasUsed) {
    opts._debug?.(`${pName} gas used mismatch: ${computedGasUsed} !== ${executeGasUsed}`)
    executionResult = false
  }
  if (!equalsBytes(postStateRoot, tree.root())) {
    opts._debug?.(`${pName} post state root mismatch`)
    executionResult = false
  }
  opts._debug?.(`${pName} trace executed successfully=${executionResult}`)
  const returnValue = executionResult ? new Uint8Array(1).fill(1) : new Uint8Array(1).fill(0)
  return {
    executionGasUsed: gasUsed,
    returnValue,
  }
}
