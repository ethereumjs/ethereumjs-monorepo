enum ErrorCode {
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
type CodedGeneralError<T> = T extends ErrorCode.INVALID_PARAM
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
    const { code, message, ...params } = codedError
    const messageDetails: Array<string> = []

    if (isInvalidParamError(codedError) && typeof params.param !== 'undefined') {
      messageDetails.push(`Invalid param=${codedError.param}`)
    }

    if (isUnknownError(codedError)) {
      Object.keys(params).forEach((key) => {
        const value = codedError[key]
        try {
          messageDetails.push(key + '=' + JSON.stringify(value))
        } catch {
          messageDetails.push(key + '=' + JSON.stringify(codedError[key].toString()))
        }
      })
    }

    messageDetails.push(`code=${code}`)

    let errorMessage = message ?? ''

    if (messageDetails.length) {
      errorMessage += ' | Details: ' + messageDetails.join(', ')
    }

    const error = new Error(errorMessage) as CodedGeneralError<T>
    error.code = codedError.code

    Object.keys(params).forEach((key) => {
      const typedKey = key as keyof typeof codedError
      error[typedKey] = codedError[typedKey]
    })

    // captureStackTrace is not defined in some browsers, notably Firefox
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, this.throwError)
    }

    throw error
  }

  throwError<T extends ErrorCode>(
    code?: T,
    params?: Omit<CodedGeneralError<T>, 'code' | 'stack'>
  ): void {
    this.makeError({
      code: code ?? ErrorCode.UNKNOWN_ERROR,
      ...params,
    } as CodedGeneralError<T>)
  }
}

export const errorLog = new ErrorLogger()
