export enum ErrorCode {
  INVALID_BLOCK_HEADER = 'INVALID_BLOCK_HEADER',
}

export interface GeneralError<T extends ErrorCode = ErrorCode> extends Error {
  code: ErrorCode
  error?: Error
}

export interface InvalidBlockHeaderError extends GeneralError<ErrorCode.INVALID_BLOCK_HEADER> {
  param?:
    | 'uncleHash'
    | 'coinbase'
    | 'stateRoot'
    | 'transactionsTrie'
    | 'receiptTrie'
    | 'bloom'
    | 'difficulty'
    | 'number'
    | 'gasLimit'
    | 'gasUsed'
    | 'timestamp'
    | 'extraData'
    | 'mixHash'
    | 'nonce'
    | 'baseFeePerGas'
}

// Converts an ErrorCode its Typed Error

export type CodedGeneralError<T> = T extends ErrorCode.INVALID_BLOCK_HEADER
  ? InvalidBlockHeaderError
  : never
