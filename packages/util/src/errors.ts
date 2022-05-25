/**
 * Generic EthereumJS error with metadata attached
 *
 * Kudos to https://github.com/ChainSafe/lodestar monorepo
 * for the inspiration :-)
 */
export class EthereumJSError<T extends {}> extends Error {
  code: string
  errorContext: T

  constructor(msg: string, code: string, errorContext: T) {
    super(msg)
    this.code = code
    this.errorContext = errorContext
  }

  getErrorContext(): Record<string, string | number | null> {
    return { code: this.code, ...this.errorContext }
  }

  /**
   * Get the metadata and the stacktrace for the error.
   */
  toObject(): Record<string, string | number | null> {
    return {
      ...this.getErrorContext(),
      stack: this.stack ?? '',
    }
  }
}
