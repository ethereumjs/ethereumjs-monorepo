import { EthereumJSErrorWithoutCode } from '@ethereumjs/util'

import { eipsDict } from './eips.ts'

import type { Common } from './common.ts'
import type { Hardfork } from './enums.ts'

/**
 * Expand an EIP list with transitive {@link EIPConfig.requiredEIPs} in
 * dependency order, then validate {@link EIPConfig.conflictsWith} pairs.
 *
 * Does not mutate `Common`. Pass the result to {@link CommonOpts.eips} or
 * {@link Common.setEIPs}.
 */
export function resolveEIPs(eips: number[], common?: Common): number[] {
  const seen = new Set<number>()
  const ordered: number[] = []

  const visit = (eip: number) => {
    if (seen.has(eip)) return
    if (!(eip in eipsDict)) {
      throw EthereumJSErrorWithoutCode(`${eip} not supported`)
    }
    if (common !== undefined) {
      const minHF = eipsDict[eip].minimumHardfork
      if (!common.gteHardfork(minHF)) {
        throw EthereumJSErrorWithoutCode(
          `${eip} cannot be activated on hardfork ${common.hardfork()}, minimumHardfork: ${minHF}`,
        )
      }
    }
    const required = eipsDict[eip].requiredEIPs ?? []
    for (const dep of required) {
      visit(dep)
    }
    seen.add(eip)
    ordered.push(eip)
  }

  for (const eip of eips) {
    visit(eip)
  }

  for (const eip of ordered) {
    const conflicts = eipsDict[eip].conflictsWith ?? []
    for (const other of conflicts) {
      if (ordered.includes(other)) {
        throw EthereumJSErrorWithoutCode(`EIP ${eip} conflicts with EIP ${other}`)
      }
    }
  }

  return ordered
}
