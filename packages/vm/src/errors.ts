export enum ErrorCode {
  INVALID_BLOCK_HEADER = 'INVALID_BLOCK_HEADER',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

interface GeneralError<T extends ErrorCode = ErrorCode> extends Partial<Error> {
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
export type CodedGeneralError<T> = T extends ErrorCode.INVALID_BLOCK_HEADER
  ? InvalidBlockHeaderError
  : T extends ErrorCode.UNKNOWN_ERROR
  ? UnknownError
  : never

export class ErrorLogger {
  static errors = ErrorCode

  makeError<T>(codedError: CodedGeneralError<T>): Error {
    let { message } = codedError
    const messageDetails: Array<string> = []

    if (isInvalidBlockHeaderError(codedError)) {
      messageDetails.push(`Invalid param = ${codedError.param}`)
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
    error.code = codedError.code

    Object.keys(codedError)
      .filter((key) => key !== 'message' && key !== 'code')
      .forEach((key) => {
        const typedKey = key as keyof typeof codedError
        error[typedKey] = codedError[typedKey]
      })

    throw error
  }

  throwError<T extends ErrorCode>(code?: T, params?: Omit<CodedGeneralError<T>, 'code'>): never {
    throw this.makeError({
      code: code ?? ErrorCode.UNKNOWN_ERROR,
      ...params,
    } as CodedGeneralError<T>)
  }
}

export const errorLog = new ErrorLogger()

function isError<K extends ErrorCode, T extends CodedGeneralError<K>>(
  error: GeneralError,
  code: K
): error is T {
  if (error && (<GeneralError>error).code === code) {
    return true
  }
  return false
}

function isInvalidBlockHeaderError(error: GeneralError): error is InvalidBlockHeaderError {
  return isError(error, ErrorCode.INVALID_BLOCK_HEADER)
}

function isUnknownError(error: GeneralError): error is UnknownError {
  return isError(error, ErrorCode.UNKNOWN_ERROR)
}
