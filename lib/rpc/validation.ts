import { INVALID_PARAMS } from './error-code'

/**
 * middleware for parameters validation
 * @memberof module:rpc
 * @param {Function} method            function to add middleware
 * @param {number} requiredParamsCount required parameters count
 * @param {Function[]} validators      array of validator
 */
export function middleware(method: any, requiredParamsCount: number, validators: any[] = []): any {
  return function (params: any[] = [], cb: (err: any, val?: any) => void) {
    if (params.length < requiredParamsCount) {
      const err = {
        code: INVALID_PARAMS,
        message: `missing value for required argument ${params.length}`,
      }
      return cb(err)
    }

    for (let i = 0; i < validators.length; i++) {
      if (validators[i]) {
        for (let j = 0; j < validators[i].length; j++) {
          const err = validators[i][j](params, i)
          if (err) {
            return cb(err)
          }
        }
      }
    }

    method(params, cb)
  }
}

/**
 * @memberof module:rpc
 */
export const validators = {
  /**
   * hex validator to ensure has "0x" prefix
   * @param {any[]} params parameters of method
   * @param {number} index index of parameter
   */
  hex(params: any[], index: number): any {
    let err
    if (typeof params[index] !== 'string') {
      return {
        code: INVALID_PARAMS,
        message: `invalid argument ${index}: argument must be a hex string`,
      }
    }

    if (params[index].substr(0, 2) !== '0x') {
      err = {
        code: INVALID_PARAMS,
        message: `invalid argument ${index}: hex string without 0x prefix`,
      }
    }

    return err
  },

  /**
   * hex validator to validate block hash
   * @param {any[]} params parameters of method
   * @param {number} index index of parameter
   */
  blockHash(params: any[], index: number): any {
    let err

    if (typeof params[index] !== 'string') {
      return {
        code: INVALID_PARAMS,
        message: `invalid argument ${index}: argument must be a hex string`,
      }
    }

    const blockHash = params[index].substring(2)

    if (!/^[0-9a-fA-F]+$/.test(blockHash) || blockHash.length !== 64) {
      err = {
        code: INVALID_PARAMS,
        message: `invalid argument ${index}: invalid block hash`,
      }
    }

    return err
  },

  /**
   * bool validator to check if type is boolean
   * @param {any[]} params parameters of method
   * @param {number} index index of parameter
   */
  bool(params: any[], index: number): any {
    let err
    if (typeof params[index] !== 'boolean') {
      err = {
        code: INVALID_PARAMS,
        message: `invalid argument ${index}: argument is not boolean`,
      }
    }

    return err
  },
}
