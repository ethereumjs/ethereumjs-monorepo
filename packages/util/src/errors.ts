/**
 * Generic EthereumJS error class with metadata attached
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

export type ValidationErrorType = {
  received: string
}

/**
 * Error along Object Validation
 *
 * Use directly or in a subclassed context for error comparison (`e instanceof ValidationError`)
 */
export class ValidationError<T extends ValidationErrorType> extends EthereumJSError<T> {}

/**
 * Error along API Usage
 *
 * Use directly or in a subclassed context for error comparison (`e instanceof UsageError`)
 */
export class UsageError<T extends {}> extends EthereumJSError<T> {}
