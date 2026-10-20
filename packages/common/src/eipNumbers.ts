import { eipsDict } from './eips.ts'

/** Sorted EIP numbers defined in {@link eipsDict}. */
export const EIP_NUMBERS: number[] = Object.keys(eipsDict)
  .map((key) => Number(key))
  .filter((n) => !Number.isNaN(n))
  .sort((a, b) => a - b)
