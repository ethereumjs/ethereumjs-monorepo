import type { Block } from '@ethereumjs/block'
import { EthereumJSErrorWithoutCode, bytesToHex, equalsBytes } from '@ethereumjs/util'
import type { Debugger } from 'debug'
import type { ApplyBlockResult } from './types.ts'
import type { VM } from './vm.ts'

const formatErrorMessage = (field: string, headerValue: string, resultsValue: string): string => {
  return `invalid ${field}\n----header: ${headerValue} \n----result: ${resultsValue}`
}

/**
 * Validates the header fields of a block.
 * @param vm - VM instance.
 * @param block - Block to validate.
 * @param result - Result of the block execution.
 * @param requestsHash - Computed requests hash.
 * @param stateRoot - Post execution state root.
 * @param debug - Debug function.
 */
export async function validateHeaderFields(
  vm: VM,
  block: Block,
  result: ApplyBlockResult,
  requestsHash: Uint8Array | undefined,
  stateRoot: Uint8Array,
  debug: Debugger,
) {
  const errors: string[] = []

  // EIP-7685: Validate Requests Hash
  if (vm.common.isActivatedEIP(7685)) {
    if (!equalsBytes(block.header.requestsHash!, requestsHash!)) {
      const msg = formatErrorMessage(
        'requestsHash',
        bytesToHex(block.header.requestsHash!),
        bytesToHex(requestsHash!),
      )
      if (vm.DEBUG) debug(msg)
      errors.push(msg)
    }
  }
  // EIP-7928: Validate Block Access List Hash
  if (vm.common.isActivatedEIP(7928)) {
    if (!equalsBytes(block.header.blockAccessListHash!, block.header.blockAccessListHash!)) {
      const msg = formatErrorMessage(
        'blockAccessListHash',
        bytesToHex(block.header.blockAccessListHash!),
        bytesToHex(block.header.blockAccessListHash!),
      )
      if (vm.DEBUG) debug(msg)
      errors.push(msg)
    }
  }
  // Validate receiptsRoot
  if (equalsBytes(result.receiptsRoot, block.header.receiptTrie) === false) {
    const msg = formatErrorMessage(
      'receiptsRoot',
      bytesToHex(block.header.receiptTrie),
      bytesToHex(result.receiptsRoot),
    )
    if (vm.DEBUG) debug(msg)
    errors.push(msg)
  }
  // Validate logsBloom
  if (!(equalsBytes(result.bloom.bitvector, block.header.logsBloom) === true)) {
    const msg = formatErrorMessage(
      'bloom',
      bytesToHex(block.header.logsBloom),
      bytesToHex(result.bloom.bitvector),
    )
    if (vm.DEBUG) debug(msg)
    errors.push(msg)
  }
  // Validate gasUsed
  if (result.gasUsed !== block.header.gasUsed) {
    const msg = formatErrorMessage(
      'gasUsed',
      block.header.gasUsed.toString(),
      result.gasUsed.toString(),
    )
    if (vm.DEBUG) debug(msg)
    errors.push(msg)
  }
  // Validate stateRoot
  if (!(equalsBytes(stateRoot, block.header.stateRoot) === true)) {
    const msg = formatErrorMessage(
      'stateRoot',
      bytesToHex(block.header.stateRoot),
      bytesToHex(stateRoot),
    )
    if (vm.DEBUG) debug(msg)
    errors.push(msg)
  }

  if (errors.length > 0) {
    const blockErrorStr = 'errorStr' in block ? block.errorStr() : 'block'
    const errorMsg = `(${vm.errorStr()} -> ${blockErrorStr})`
    throw EthereumJSErrorWithoutCode(
      `Error: Header validation failed:\n ${errors.join('\n')}\n${errorMsg}`,
    )
  }
}
