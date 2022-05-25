import { EthereumJSError } from 'ethereumjs-util'

export enum HeaderValidationErrorCode {
  WRONG_TX_TRIE_LENGTH = 'WRONG_TX_TRIE_LENGTH',
}

export type HeaderValidationErrorType = {
  block: string
  received: string
}

export class HeaderValidationError extends EthereumJSError<HeaderValidationErrorType> {}
