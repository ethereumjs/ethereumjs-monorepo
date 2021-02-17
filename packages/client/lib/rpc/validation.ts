import { INVALID_PARAMS } from './error-code'

/**
 * middleware for parameters validation
 * @memberof module:rpc
 * @param {Function} method            function to add middleware
 * @param {number} requiredParamsCount required parameters count
 * @param {Function[]} validators      array of validator
 */
export function middleware(method: any, requiredParamsCount: number, validators: any[] = []): any {
  return function (params: any[] = []) {
    return new Promise((resolve, reject) => {
      if (params.length < requiredParamsCount) {
        const error = {
          code: INVALID_PARAMS,
          message: `missing value for required argument ${params.length}`,
        }
        return reject(error)
      }

      for (let i = 0; i < validators.length; i++) {
        if (validators[i]) {
          for (let j = 0; j < validators[i].length; j++) {
            const error = validators[i][j](params, i)
            if (error) {
              return reject(error)
            }
          }
        }
      }

      resolve(method(params))
    })
  }
}

/**
 * @memberof module:rpc
 */
export const validators = {
  /**
   * hex validator to ensure has `0x` prefix
   * @param {any[]} params parameters of method
   * @param {number} index index of parameter
   */
  hex(params: any[], index: number): any {
    if (typeof params[index] !== 'string') {
      return {
        code: INVALID_PARAMS,
        message: `invalid argument ${index}: argument must be a hex string`,
      }
    }

    if (params[index].substr(0, 2) !== '0x') {
      return {
        code: INVALID_PARAMS,
        message: `invalid argument ${index}: hex string without 0x prefix`,
      }
    }
  },

  /**
   * hex validator to validate block hash
   * @param {any[]} params parameters of method
   * @param {number} index index of parameter
   */
  blockHash(params: any[], index: number): any {
    if (typeof params[index] !== 'string') {
      return {
        code: INVALID_PARAMS,
        message: `invalid argument ${index}: argument must be a hex string`,
      }
    }

    const blockHash = params[index].substring(2)

    if (!/^[0-9a-fA-F]+$/.test(blockHash) || blockHash.length !== 64) {
      return {
        code: INVALID_PARAMS,
        message: `invalid argument ${index}: invalid block hash`,
      }
    }
  },

  /**
   * bool validator to check if type is boolean
   * @param {any[]} params parameters of method
   * @param {number} index index of parameter
   */
  bool(params: any[], index: number): any {
    if (typeof params[index] !== 'boolean') {
      return {
        code: INVALID_PARAMS,
        message: `invalid argument ${index}: argument is not boolean`,
      }
    }
  },
}
