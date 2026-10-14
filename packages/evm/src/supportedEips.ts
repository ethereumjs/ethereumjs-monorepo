import { EIP_NUMBERS } from '@ethereumjs/common'

/**
 * EIPs defined in `@ethereumjs/common` that the EVM does not execute.
 * All other {@link EIP_NUMBERS} entries are accepted in {@link EVM} construction.
 */
export const UNSUPPORTED_IN_EVM = new Set<number>([
  1, 606, 607, 608, 609, 1013, 1679, 1716, 2384, 3298, 7997, 8038, 8246, 8282,
])

/** Sorted EIP numbers the EVM accepts when passed via {@link Common} `eips`. */
export const SUPPORTED_EVM_EIPS: number[] = EIP_NUMBERS.filter(
  (eip) => !UNSUPPORTED_IN_EVM.has(eip),
)
