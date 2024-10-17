import { Common, Mainnet } from '@ethereumjs/common'
import { MAX_INTEGER, MAX_UINT64 } from '@ethereumjs/util'

export function getCommon(common?: Common): Common {
  return common?.copy() ?? new Common({ chain: Mainnet })
}

/**
 * Validates that an object with BigInt values cannot exceed the specified bit limit.
 * @param values Object containing string keys and BigInt values
 * @param bits Number of bits to check (64 or 256)
 * @param cannotEqual Pass true if the number also cannot equal one less the maximum value
 */
export function valueBoundaryCheck( // TODO: better method name
  values: { [key: string]: bigint | undefined },
  bits = 256,
  cannotEqual = false,
) {
  for (const [key, value] of Object.entries(values)) {
    switch (bits) {
      case 64:
        if (cannotEqual) {
          if (value !== undefined && value >= MAX_UINT64) {
            // TODO: error msgs got raised to a error string handler first, now throws "generic" error
            throw new Error(`${key} cannot equal or exceed MAX_UINT64 (2^64-1), given ${value}`)
          }
        } else {
          if (value !== undefined && value > MAX_UINT64) {
            throw new Error(`${key} cannot exceed MAX_UINT64 (2^64-1), given ${value}`)
          }
        }
        break
      case 256:
        if (cannotEqual) {
          if (value !== undefined && value >= MAX_INTEGER) {
            throw new Error(`${key} cannot equal or exceed MAX_INTEGER (2^256-1), given ${value}`)
          }
        } else {
          if (value !== undefined && value > MAX_INTEGER) {
            throw new Error(`${key} cannot exceed MAX_INTEGER (2^256-1), given ${value}`)
          }
        }
        break
      default: {
        throw new Error('unimplemented bits value')
      }
    }
  }
}
