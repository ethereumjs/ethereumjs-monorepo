import { UsageError, ValidationError, ValidationErrorType } from 'ethereumjs-util'

/**
 * Always define error codes on the generic Util
 * error class level (e.g. associated to `ValidationError`)
 */
export enum ValidationErrorCode {
  WRONG_TX_TRIE_LENGTH = 'WRONG_TX_TRIE_LENGTH',
}

/**
 * Additional types extending the generic Util
 * error types (e.g. `ValidationErrorType`)
 */
export type HeaderValidationErrorType =
  | {
      block: string
      received: string
    }
  | ValidationErrorType
export type HeaderUsageErrorType = {
  block: string
}

/**
 * Dedicated error classes for the specific package,
 * always to be subclassed from the generic Util error type
 * classes (e.g. `ValidationError`, not: `EthereumJSError`)
 */
export class HeaderValidationError extends ValidationError<HeaderValidationErrorType> {}
export class HeaderUsageError extends UsageError<HeaderUsageErrorType> {}
