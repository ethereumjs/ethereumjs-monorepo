import tape from 'tape'
import { ErrorLogger } from '../src/errors'

tape('ErrorLogger', (t) => {
  const errorLog = new ErrorLogger()

  t.test('should assign the UNKNOWN_ERROR code to errors without code', (st) => {
    let error: any

    try {
      errorLog.throwError()
    } catch (e) {
      error = e
    }

    st.equal(error.code, ErrorLogger.errors.UNKNOWN_ERROR)
    st.end()
  }),
    t.test('should preserve the stack trace of the throwError context', (st) => {
      let error: any

      try {
        errorLog.throwError()
      } catch (e) {
        error = e
      }

      // captureStackTrace is not defined in some browsers, notably Firefox, so behavior can't be implemented/tested there
      // @ts-ignore
      if (Error.captureStackTrace) {
        st.ok(/Error: {2}\| Details: code=UNKNOWN_ERROR\n {4}at Test./.test(error.stack))
      }

      st.end()
    }),
    t.test('should populate an error with UNKNOWN_ERROR code with all provided params', (st) => {
      let error: any

      try {
        errorLog.throwError(ErrorLogger.errors.UNKNOWN_ERROR, {
          errorInfo1: 'Information on the error',
          errorInfo2: 'More information on the error',
        })
      } catch (e) {
        error = e
      }

      st.equal(error.code, ErrorLogger.errors.UNKNOWN_ERROR)
      st.equal(error.errorInfo1, 'Information on the error')
      st.equal(error.errorInfo2, 'More information on the error')
      st.end()
    }),
    t.test(
      'should add all error params of UNKNOWN_ERROR to error mes21 02 2022 17:42:12.866:ERROR [launcher]: No binary for ChromeHeadless browser on your platform.sage details',
      (st) => {
        let error: any

        try {
          errorLog.throwError(ErrorLogger.errors.UNKNOWN_ERROR, {
            errorInfo1: 'Information on the error',
            errorInfo2: 'More information on the error',
          })
        } catch (e) {
          error = e
        }

        st.equal(
          error.message,
          ' | Details: errorInfo1="Information on the error", errorInfo2="More information on the error", code=UNKNOWN_ERROR'
        )
        st.end()
      }
    ),
    t.test('should append all error details to provided error message', (st) => {
      let error: any

      try {
        errorLog.throwError(ErrorLogger.errors.UNKNOWN_ERROR, {
          message: 'Error Message',
          errorInfo1: 'Information on the error',
          errorInfo2: 'More information on the error',
        })
      } catch (e) {
        error = e
      }

      st.equal(
        error.message,
        'Error Message | Details: errorInfo1="Information on the error", errorInfo2="More information on the error", code=UNKNOWN_ERROR'
      )
      st.end()
    })
  t.test('should populate an error with INVALID_PARAM with the "param" prop', (st) => {
    let error: any

    try {
      errorLog.throwError(ErrorLogger.errors.INVALID_PARAM, {
        param: 'difficulty',
      })
    } catch (e) {
      error = e
    }

    st.equal(error.param, 'difficulty')
    st.end()
  }),
    t.test('should add the "param" prop to the INVALID_PARAM error message', (st) => {
      let error: any

      try {
        errorLog.throwError(ErrorLogger.errors.INVALID_PARAM, {
          message: 'Gas limit higher than maximum',
          param: 'gasLimit',
        })
      } catch (e) {
        error = e
      }

      st.equal(
        error.message,
        'Gas limit higher than maximum | Details: Invalid param=gasLimit, code=INVALID_PARAM'
      )
      st.end()
    })
})
