export enum ErrorCode {
  INVALID_BLOCK_HEADER = 'INVALID_BLOCK_HEADER',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

interface GeneralError<T extends ErrorCode = ErrorCode> extends Error {
  code?: T
}

interface InvalidBlockHeaderError extends GeneralError<ErrorCode.INVALID_BLOCK_HEADER> {
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
interface UnknownError extends GeneralError<ErrorCode.UNKNOWN_ERROR> {
  [key: string]: any
}

// Convert an ErrorCode into its Typed Error
type CodedGeneralError<T> = T extends ErrorCode.INVALID_BLOCK_HEADER
  ? InvalidBlockHeaderError
  : T extends ErrorCode.UNKNOWN_ERROR
  ? UnknownError
  : never

class ErrorLogger {
  static errors = ErrorCode

  makeError<T>(codedError: CodedGeneralError<T>): Error {
    let { message } = codedError
    const { code } = codedError
    const messageDetails: Array<string> = []

    if (isInvalidBlockHeaderError(codedError)) {
      messageDetails.push('Invalid param' + '=' + codedError.param)
    }

    if (isUnknownError(codedError)) {
      Object.keys(codedError)
        .filter((key) => key !== 'message' && key !== 'code')
        .forEach((key) => {
          const value = codedError[key]
          try {
            messageDetails.push(key + '=' + JSON.stringify(value))
          } catch {
            messageDetails.push(key + '=' + JSON.stringify(codedError[key].toString()))
          }
        })
    }

    messageDetails.push(`code=${codedError.code}`)

    if (messageDetails.length) {
      message += ' (' + messageDetails.join(', ') + ')'
    }

    const error = new Error(message) as CodedGeneralError<T>

    Object.keys(codedError)
      .filter((key) => key !== 'message' && key !== 'code')
      .forEach((key) => {
        const typedKey = key as keyof typeof codedError
        error[typedKey] = codedError[typedKey]
      })

    throw error
  }

  // TODO: Make name (and maybe message?) optional fields when throwing an error
  throwError<T extends ErrorCode>(error: CodedGeneralError<T>): never {
    if (!error.code) {
      error.code = ErrorCode.UNKNOWN_ERROR
    }

    throw this.makeError(error)
  }
}

export const errorLog = new ErrorLogger()

export function isError<K extends ErrorCode, T extends CodedGeneralError<K>>(
  error: Error,
  code: K
): error is T {
  if (error && (<GeneralError>error).code === code) {
    return true
  }
  return false
}

export function isInvalidBlockHeaderError(error: Error): error is InvalidBlockHeaderError {
  return isError(error, ErrorCode.INVALID_BLOCK_HEADER)
}

export function isUnknownError(error: Error): error is UnknownError {
  return isError(error, ErrorCode.UNKNOWN_ERROR)
}
