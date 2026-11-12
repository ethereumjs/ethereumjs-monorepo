import type { ChainConfig } from '@ethereumjs/common'
import { createEVM } from '@ethereumjs/evm'
import type { FlatStateManager } from '@ethereumjs/statemanager'
import { type TypedTransaction, createTx } from '@ethereumjs/tx'
import type { AccessList } from '@ethereumjs/tx'
import { bytesToHex } from '@ethereumjs/util'
import { createVM, runTx } from '@ethereumjs/vm'

import type { RpcBlockWindowStore } from '../rpc/blockWindowStore.ts'
import { dataHex, quantityHex } from '../rpc/quantities.ts'
import type { JsonRpcError } from '../rpc/types.ts'
import type { EthySpine } from '../spine/types.ts'
import { buildExecutionBlock, gasCapForContext } from './blockContext.ts'
import { type ParsedRpcCall, parseRpcTxObject } from './callParams.ts'
import { enqueueSandbox } from './queue.ts'
import { formatExecutionReverted } from './revertReason.ts'
import { applyStateOverride } from './stateOverride.ts'

export type ExecutionOutcome = { result: unknown } | { error: JsonRpcError }

export type EthySandbox = {
  runEthCall: (tx: unknown, stateOverride?: unknown) => Promise<ExecutionOutcome>
  runEstimateGas: (tx: unknown, stateOverride?: unknown) => Promise<ExecutionOutcome>
  runCreateAccessList: (tx: unknown, stateOverride?: unknown) => Promise<ExecutionOutcome>
  runSimulateCall: (parsed: ParsedRpcCall) => Promise<{
    gasUsed: bigint
    returnData: Uint8Array
    logs: { address: string; topics: string[]; data: string }[]
    overlay: FlatStateManager
    execError?: JsonRpcError
  }>
}

function err(code: number, message: string, data?: unknown): { error: JsonRpcError } {
  return { error: { code, message, data } }
}

async function prepareOverlay(
  root: FlatStateManager,
  stateOverride: unknown,
): Promise<{ overlay: FlatStateManager } | { error: JsonRpcError }> {
  const overlay = root.shallowCopy() as FlatStateManager
  const applied = await applyStateOverride(overlay, stateOverride)
  if ('error' in applied) return applied
  return { overlay }
}

function buildUnsignedTx(
  parsed: ParsedRpcCall,
  common: ReturnType<typeof buildExecutionBlock>['common'],
  baseFee: bigint,
  gasLimitOverride?: bigint,
): { tx: TypedTransaction } | { error: JsonRpcError } {
  const gasLimit = gasLimitOverride ?? parsed.gasLimit ?? 30_000_000n
  const maxFee = parsed.maxFeePerGas ?? parsed.gasPrice ?? (baseFee > 0n ? baseFee : 1_000_000_000n)
  const maxPrio = parsed.maxPriorityFeePerGas ?? 0n
  const txData: Record<string, unknown> = {
    to: parsed.to?.toString(),
    data: parsed.data.length > 0 ? `0x${bytesToHex(parsed.data)}` : undefined,
    value: parsed.value,
    gasLimit,
    maxFeePerGas: maxFee,
    maxPriorityFeePerGas: maxPrio,
    type: 2,
  }
  if (parsed.gasPrice !== undefined && parsed.maxFeePerGas === undefined) {
    txData.type = 0
    txData.gasPrice = parsed.gasPrice
    delete txData.maxFeePerGas
    delete txData.maxPriorityFeePerGas
  }
  try {
    const tx = createTx(txData as never, { common, freeze: false })
    const sender = parsed.from
    tx.getSenderAddress = () => sender
    return { tx }
  } catch (e: unknown) {
    return err(-32602, (e as Error).message)
  }
}

async function runTxOnOverlay(
  overlay: FlatStateManager,
  parsed: ParsedRpcCall,
  common: ReturnType<typeof buildExecutionBlock>['common'],
  baseFee: bigint,
  block: ReturnType<typeof buildExecutionBlock>['block'],
  opts: { gasLimit: bigint; reportAccessList?: boolean },
): Promise<
  | { ok: true; gas: bigint; returnValue: Uint8Array; accessList?: AccessList }
  | { error: JsonRpcError }
> {
  const built = buildUnsignedTx(parsed, common, baseFee, opts.gasLimit)
  if ('error' in built) return built
  const vm = await createVM({ common, stateManager: overlay })
  try {
    const result = await runTx(vm, {
      tx: built.tx,
      block,
      skipNonce: true,
      skipBalance: true,
      skipBlockGasLimitValidation: true,
      reportAccessList: opts.reportAccessList === true,
    })
    if (result.execResult.exceptionError !== undefined) {
      const rev = result.execResult.exceptionError.error
      if (rev === 'revert') {
        const msg = formatExecutionReverted(result.execResult.returnValue)
        return err(3, msg, dataHex(result.execResult.returnValue))
      }
      return err(-32000, rev)
    }
    return {
      ok: true,
      gas: result.totalGasSpent,
      returnValue: result.execResult.returnValue,
      accessList: result.accessList,
    }
  } catch (e: unknown) {
    return err(-32000, (e as Error).message)
  }
}

export function createEthySandbox(opts: {
  spine: EthySpine
  stateManager: FlatStateManager
  chain: ChainConfig
  hardfork: string
  blockWindow: RpcBlockWindowStore
}): EthySandbox {
  const { spine, stateManager, chain, hardfork, blockWindow } = opts

  return {
    runEthCall(txObj, stateOverride) {
      return enqueueSandbox(async () => {
        const parsed = parseRpcTxObject(txObj)
        if ('error' in parsed) return parsed
        const prep = await prepareOverlay(stateManager, stateOverride)
        if ('error' in prep) return prep
        const { block, common, baseFee } = buildExecutionBlock(spine, chain, hardfork, blockWindow)
        const gasLimit = gasCapForContext(blockWindow, chain, hardfork, parsed.parsed.gasLimit)
        const gasPrice = parsed.parsed.gasPrice ?? baseFee
        const evm = await createEVM({ common, stateManager: prep.overlay })
        const result = await evm.runCall({
          caller: parsed.parsed.from,
          to: parsed.parsed.to,
          data: parsed.parsed.data,
          value: parsed.parsed.value,
          gasLimit,
          gasPrice,
          block,
          skipBalance: true,
        })
        if (result.execResult.exceptionError !== undefined) {
          const rev = result.execResult.exceptionError.error
          if (rev === 'revert') {
            const msg = formatExecutionReverted(result.execResult.returnValue)
            return err(3, msg, dataHex(result.execResult.returnValue))
          }
          return err(-32000, rev)
        }
        return { result: dataHex(result.execResult.returnValue) }
      })
    },

    runEstimateGas(txObj, stateOverride) {
      return enqueueSandbox(async () => {
        const parsed = parseRpcTxObject(txObj)
        if ('error' in parsed) return parsed
        const prep = await prepareOverlay(stateManager, stateOverride)
        if ('error' in prep) return prep
        const { block, common, baseFee } = buildExecutionBlock(spine, chain, hardfork, blockWindow)
        const cap = gasCapForContext(blockWindow, chain, hardfork, parsed.parsed.gasLimit)
        const built = buildUnsignedTx(parsed.parsed, common, baseFee, cap)
        if ('error' in built) return built
        const hi = await runTxOnOverlay(prep.overlay, parsed.parsed, common, baseFee, block, {
          gasLimit: cap,
        })
        if ('error' in hi) return hi
        let low = built.tx.getIntrinsicGas()
        let high = cap
        let best = high
        if (hi.gas <= high) {
          const exactPrep = await prepareOverlay(stateManager, stateOverride)
          if ('error' in exactPrep) return exactPrep
          const exact = await runTxOnOverlay(
            exactPrep.overlay,
            parsed.parsed,
            common,
            baseFee,
            block,
            { gasLimit: hi.gas },
          )
          if (!('error' in exact)) {
            return { result: quantityHex(hi.gas) }
          }
        }
        for (let i = 0; i < 20 && low < high; i++) {
          const mid = (low + high) / 2n
          const probePrep = await prepareOverlay(stateManager, stateOverride)
          if ('error' in probePrep) return probePrep
          const run = await runTxOnOverlay(
            probePrep.overlay,
            parsed.parsed,
            common,
            baseFee,
            block,
            { gasLimit: mid },
          )
          if ('error' in run) {
            low = mid + 1n
          } else {
            best = mid
            high = mid
          }
        }
        return { result: quantityHex(best) }
      })
    },

    runCreateAccessList(txObj, stateOverride) {
      return enqueueSandbox(async () => {
        const parsed = parseRpcTxObject(txObj)
        if ('error' in parsed) return parsed
        const prep = await prepareOverlay(stateManager, stateOverride)
        if ('error' in prep) return prep
        const { block, common, baseFee } = buildExecutionBlock(spine, chain, hardfork, blockWindow)
        const cap = gasCapForContext(blockWindow, chain, hardfork, parsed.parsed.gasLimit)
        const run = await runTxOnOverlay(prep.overlay, parsed.parsed, common, baseFee, block, {
          gasLimit: cap,
          reportAccessList: true,
        })
        if ('error' in run) return run
        return {
          result: {
            accessList: run.accessList ?? [],
            gasUsed: quantityHex(run.gas),
          },
        }
      })
    },

    runSimulateCall(parsed) {
      return enqueueSandbox(async () => {
        const prep = await prepareOverlay(stateManager, undefined)
        if ('error' in prep) {
          return {
            gasUsed: 0n,
            returnData: new Uint8Array(),
            logs: [],
            overlay: stateManager.shallowCopy() as FlatStateManager,
            execError: prep.error,
          }
        }
        const { block, common, baseFee } = buildExecutionBlock(spine, chain, hardfork, blockWindow)
        const gasLimit = gasCapForContext(blockWindow, chain, hardfork)
        const gasPrice = baseFee
        const evm = await createEVM({ common, stateManager: prep.overlay })
        const result = await evm.runCall({
          caller: parsed.from,
          to: parsed.to,
          data: parsed.data,
          value: parsed.value,
          gasLimit,
          gasPrice,
          block,
          skipBalance: true,
        })
        const logs =
          result.execResult.logs?.map((row) => ({
            address: dataHex(row[0] ?? new Uint8Array()),
            topics: row[1]?.map((t) => dataHex(t)) ?? [],
            data: dataHex(row[2] ?? new Uint8Array()),
          })) ?? []
        if (result.execResult.exceptionError !== undefined) {
          const rev = result.execResult.exceptionError.error
          const execError =
            rev === 'revert'
              ? err(3, formatExecutionReverted(result.execResult.returnValue))
              : err(-32000, rev)
          return {
            gasUsed: result.execResult.executionGasUsed,
            returnData: result.execResult.returnValue,
            logs,
            overlay: prep.overlay,
            execError: execError.error,
          }
        }
        return {
          gasUsed: result.execResult.executionGasUsed,
          returnData: result.execResult.returnValue,
          logs,
          overlay: prep.overlay,
        }
      })
    },
  }
}
