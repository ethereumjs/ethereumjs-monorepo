/**
 * Generic EthereumJS error class with metadata attached
 *
 * Kudos to https://github.com/ChainSafe/lodestar monorepo
 * for the inspiration :-)
 * See: https://github.com/ChainSafe/lodestar/blob/unstable/packages/utils/src/errors.ts
 */
export type EthereumJSErrorMetaData = Record<string, string | number | null>
export type EthereumJSErrorObject = {
  message: string
  stack: string
  className: string
  type: EthereumJSErrorMetaData
}

/**
 * Shared structural contract for all EthereumJS errors.
 *
 * Every error type across the monorepo exposes a stable, machine-readable string `code`. This
 * interface is the common shape that both {@link EthereumJSError} (where `code` mirrors
 * `type.code`) and package-specific error classes that are intentionally not part of the
 * `EthereumJSError` prototype chain (e.g. `EVMError` in `@ethereumjs/evm`, which must not be
 * reparented to keep `instanceof EVMError` working) conform to.
 *
 * See the "Error handling" section in the repository `DEVELOPER.md` for the taxonomy.
 */
export interface EthereumJSErrorLike {
  /** Stable, machine-readable error code. */
  readonly code: string
}

// In order to update all our errors to use `EthereumJSError`, temporarily include the
// unset error code. All errors throwing this code should be updated to use the relevant
// error code.
export const DEFAULT_ERROR_CODE = 'ETHEREUMJS_DEFAULT_ERROR_CODE'

/**
 * Generic EthereumJS error with attached metadata
 */
export class EthereumJSError<T extends { code: string }>
  extends Error
  implements EthereumJSErrorLike
{
  type: T
  constructor(type: T, message?: string, stack?: string) {
    super(message ?? type.code)
    this.type = type
    if (stack !== undefined) this.stack = stack
  }

  /**
   * Stable, machine-readable error code (mirrors `type.code`). Satisfies {@link EthereumJSErrorLike}.
   */
  get code(): string {
    return this.type.code
  }

  getMetadata(): EthereumJSErrorMetaData {
    return this.type
  }

  /**
   * Get the metadata and the stacktrace for the error.
   */
  toObject(): EthereumJSErrorObject {
    return {
      type: this.getMetadata(),
      message: this.message ?? '',
      stack: this.stack ?? '',
      className: this.constructor.name,
    }
  }
}

/**
 * @deprecated Use `EthereumJSError` with a set error code instead
 * @param message Optional error message
 * @param stack Optional stack trace
 * @returns
 */
export function EthereumJSErrorWithoutCode(message?: string, stack?: string) {
  return new EthereumJSError({ code: DEFAULT_ERROR_CODE }, message, stack)
}
