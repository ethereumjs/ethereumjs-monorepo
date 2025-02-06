import { StatefulVerkleStateManager } from '@ethereumjs/statemanager'
import {
  bytesToBigInt,
  bytesToHex,
  createAddressFromString,
  equalsBytes,
  hexToBytes,
} from '@ethereumjs/util'
import { createVerkleTree } from '@ethereumjs/verkle'

import { createEVM } from '../constructors.js'
import { EvmErrorResult, OOGResult } from '../evm.js'
import { ERROR, EvmError } from '../exceptions.js'
import { VerkleAccessWitness } from '../verkleAccessWitness.js'

import { gasLimitCheck } from './util.js'

import { getPrecompileName } from './index.js'

import type { EVM } from '../evm.js'
import type { ExecResult } from '../types.js'
import type { PrecompileInput } from './types.js'
import type { VerkleExecutionWitness } from '@ethereumjs/util'

export async function precompile12(opts: PrecompileInput): Promise<ExecResult> {
  const pName = getPrecompileName('12')
  const data = opts.data
  const evm = opts._EVM as EVM
  const gasUsed = opts.common.param('executeGasCost')
  if (!gasLimitCheck(opts, gasUsed, pName)) {
    return OOGResult(opts.gasLimit)
  }

  if (data.length !== 128) {
    return EvmErrorResult(new EvmError(ERROR.INVALID_INPUT_LENGTH), opts.gasLimit)
  }

  const _preStateRoot = data.subarray(0, 32) // prestateroot for L2 state
  const postStateRoot = data.subarray(32, 64) // post state root for L2 state
  const traceBlob = evm['executionBlobs'].get(bytesToHex(data.subarray(64, 96))) // reference to state access and transactions
  if (traceBlob === undefined) {
    opts._debug?.(`${pName} error - trace not found`)
    return EvmErrorResult(new EvmError(ERROR.REVERT), opts.gasLimit)
  }

  const decodedTrace = JSON.parse(new TextDecoder().decode(traceBlob))

  if (decodedTrace.txs === undefined || decodedTrace.witness === undefined) {
    opts._debug?.(`${pName} error - trace is invalid`)
    return EvmErrorResult(new EvmError(ERROR.REVERT), opts.gasLimit)
  }
  const executeGasUsed = bytesToBigInt(data.subarray(96))

  const witness = decodedTrace.witness as VerkleExecutionWitness
  const tree = await createVerkleTree({ verkleCrypto: opts.common.customCrypto.verkle })

  // Populate the L2 state trie with the prestate
  for (const stateDiff of witness.stateDiff) {
    const suffixes: number[] = []
    const values: Uint8Array[] = []
    for (const diff of stateDiff.suffixDiffs) {
      if (diff.currentValue !== null) {
        suffixes.push(Number(diff.suffix))
        values.push(hexToBytes(diff.currentValue))
      }
    }
    const stem = hexToBytes(stateDiff.stem)
    await tree.put(stem, suffixes, values)
  }
  const executionResult = true

  const stateManager = new StatefulVerkleStateManager({ common: opts.common, trie: tree })
  const l2EVM = await createEVM({ stateManager, common: opts.common })

  l2EVM.verkleAccessWitness = new VerkleAccessWitness({
    verkleCrypto: opts.common.customCrypto.verkle!,
  })
  l2EVM.systemVerkleAccessWitness = new VerkleAccessWitness({
    verkleCrypto: opts.common.customCrypto.verkle!,
  })
  let computedGasUsed = 0n

  // Run each transaction in the trace
  for (const tx of decodedTrace.txs) {
    const res = await l2EVM.runCall({
      to: createAddressFromString(tx.to),
      caller: createAddressFromString(tx.from),
      gasLimit: BigInt(tx.gasLimit),
      gasPrice: BigInt(tx.gasPrice),
      value: BigInt(tx.value),
      data: tx.data !== undefined ? hexToBytes(tx.data) : undefined,
    })
    computedGasUsed += res.execResult.executionGasUsed
  }

  if (computedGasUsed !== executeGasUsed) {
    opts._debug?.(`${pName} gas used mismatch: ${computedGasUsed} !== ${executeGasUsed}`)
    return EvmErrorResult(new EvmError(ERROR.REVERT), opts.gasLimit)
  }

  if (!equalsBytes(postStateRoot, tree.root())) {
    opts._debug?.(`${pName} post state root mismatch`)
    return EvmErrorResult(new EvmError(ERROR.REVERT), opts.gasLimit)
  }

  opts._debug?.(`${pName} trace executed successfully=${executionResult}`)

  const returnValue = executionResult ? new Uint8Array(1).fill(1) : new Uint8Array(1).fill(0)

  return {
    executionGasUsed: gasUsed,
    returnValue,
  }
}
