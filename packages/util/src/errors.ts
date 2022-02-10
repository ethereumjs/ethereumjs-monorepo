export enum ErrorCode {
  INVALID_PARAM = 'INVALID_PARAM',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

interface GeneralError<T extends ErrorCode = ErrorCode> extends Partial<Error> {
  code?: T
}

interface InvalidParamError extends GeneralError<ErrorCode.INVALID_PARAM> {
  param?: string
}

interface UnknownError extends GeneralError<ErrorCode.UNKNOWN_ERROR> {
  [key: string]: any
}

// Convert an ErrorCode into its Typed Error
export type CodedGeneralError<T> = T extends ErrorCode.INVALID_PARAM
  ? InvalidParamError
  : T extends ErrorCode.UNKNOWN_ERROR
  ? UnknownError
  : never

function isError<K extends ErrorCode, T extends CodedGeneralError<K>>(
  error: GeneralError,
  code: K
): error is T {
  if (error && (<GeneralError>error).code === code) {
    return true
  }
  return false
}

function isInvalidParamError(error: GeneralError): error is InvalidParamError {
  return isError(error, ErrorCode.INVALID_PARAM)
}

function isUnknownError(error: GeneralError): error is UnknownError {
  return isError(error, ErrorCode.UNKNOWN_ERROR)
}

export class ErrorLogger {
  static errors = ErrorCode

  makeError<T>(codedError: CodedGeneralError<T>): Error {
    let { message } = codedError
    const messageDetails: Array<string> = []

    if (isInvalidParamError(codedError) && typeof codedError.param !== 'undefined') {
      messageDetails.push(`Invalid param=${codedError.param}`)
    }

    if (isUnknownError(codedError)) {
      Object.keys(codedError)
        .filter((key) => ['message', 'code', 'stack'].includes(key))
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
      message += ' | Details: ' + messageDetails.join(', ')
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
