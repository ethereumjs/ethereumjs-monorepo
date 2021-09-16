enum ErrorCode {
  INVALID_BLOCK_HEADER = 'INVALID_BLOCK_HEADER',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface GeneralError<T extends ErrorCode = ErrorCode> extends Error {
  code?: T
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
export interface UnknownError extends GeneralError<ErrorCode.UNKNOWN_ERROR> {
  [key: string]: any
}

// Convert an ErrorCode into its Typed Error
export type CodedGeneralError<T> = T extends ErrorCode.INVALID_BLOCK_HEADER
  ? InvalidBlockHeaderError
  : T extends ErrorCode.UNKNOWN_ERROR
  ? UnknownError
  : never

export class Logger {
  static errors = ErrorCode

  // makeError<T>(codedError: CodedGeneralError<T>): Error {
  //   let { message } = codedError
  //   const { code } = codedError
  //   const messageDetails: Array<string> = []

  //   if (isError(codedError, ErrorCode.INVALID_BLOCK_HEADER)) {
  //     messageDetails.push('Invalid param' + '=' + codedError.param)
  //   }

  //   if (isError(codedError, ErrorCode.UNKNOWN_ERROR)) {
  //     Object.keys(codedError)
  //       .filter((key) => key !== 'message' && key !== 'code')
  //       .forEach((key) => {
  //         const value = codedError[key]
  //         try {
  //           messageDetails.push(key + '=' + JSON.stringify(value))
  //         } catch {
  //           messageDetails.push(key + '=' + JSON.stringify(codedError[key].toString()))
  //         }
  //       })
  //   }

  //   messageDetails.push(`code=${codedError.code}`)

  //   if (messageDetails.length) {
  //     message += ' (' + messageDetails.join(', ') + ')'
  //   }

  //   const error = new Error(message) as CodedGeneralError<T>
  //   error.code = code

  //   // TODO: Find how to add all args

  //   // Object.keys(codedError)
  //   //   .filter((key) => key !== 'message' && key !== 'code')
  //   //   .forEach((key) => {
  //   //     error[key] = codedError[key]
  //   //   })

  //   return error
  // }

  throwError<T extends ErrorCode>(error: CodedGeneralError<T>): never {
    if (!error.code) {
      error.code = ErrorCode.UNKNOWN_ERROR
    }

    throw error
  }
}

export const log = new Logger()

export function isError<K extends ErrorCode, T extends CodedGeneralError<K>>(
  error: Error,
  code: K
): error is T {
  if (error && (<GeneralError>error).code === code) {
    return true
  }
  return false
}

export function isInvalidBlockHeader(error: Error): error is InvalidBlockHeaderError {
  return isError(error, ErrorCode.INVALID_BLOCK_HEADER)
}
