import { INVALID_PARAMS } from './error-code'

/**
 * middleware for parameters validation
 * @memberof module:rpc
 * @param method function to add middleware
 * @param requiredParamsCount required parameters count
 * @param validators array of validators
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
        if (validators[i] !== undefined) {
          for (let j = 0; j < validators[i].length; j++) {
            // Only apply validators if params[i] is a required parameter or exists
            if (i < requiredParamsCount || params[i] !== undefined) {
              const error = validators[i][j](params, i)
              if (error !== undefined) {
                return reject(error)
              }
            }
          }
        }
      }

      resolve(method(params))
    })
  }
}

function bytes(bytes: number, params: any[], index: number) {
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
  if (params[index].length > 2 && !/^[0-9a-fA-F]+$/.test(params[index].substr(2))) {
    return {
      code: INVALID_PARAMS,
      message: `invalid argument ${index}: argument must be a hex string`,
    }
  }
  if (params[index].substr(2).length > bytes * 2) {
    return {
      code: INVALID_PARAMS,
      message: `invalid argument ${index}: expected ${bytes} byte value`,
    }
  }
}

function uint(uint: number, params: any[], index: number) {
  if (uint % 8 !== 0) {
    // Sanity check
    throw new Error(`Uint should be a multiple of 8, got: ${uint}`)
  }
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
  if (params[index].length > 2 && !/^[0-9a-fA-F]+$/.test(params[index].substr(2))) {
    return {
      code: INVALID_PARAMS,
      message: `invalid argument ${index}: argument must be a hex string`,
    }
  }
  if (params[index].substr(2).length > (uint / 8) * 2) {
    return {
      code: INVALID_PARAMS,
      message: `invalid argument ${index}: expected ${uint} bit value`,
    }
  }
}

/**
 * @memberof module:rpc
 */
export const validators = {
  /**
   * address validator to ensure has `0x` prefix and 20 bytes length
   * @param params parameters of method
   * @param index index of parameter
   */
  get address() {
    return (params: any[], index: number) => {
      if (typeof params[index] !== 'string') {
        return {
          code: INVALID_PARAMS,
          message: `invalid argument ${index}: argument must be a hex string`,
        }
      }

      if (params[index].substr(0, 2) !== '0x') {
        return {
          code: INVALID_PARAMS,
          message: `invalid argument ${index}: missing 0x prefix`,
        }
      }

      const address = params[index].substr(2)

      if (!/^[0-9a-fA-F]+$/.test(address) || address.length !== 40) {
        return {
          code: INVALID_PARAMS,
          message: `invalid argument ${index}: invalid address`,
        }
      }
    }
  },

  /**
   * hex validator to ensure has `0x` prefix
   * @param params parameters of method
   * @param index index of parameter
   */
  get hex() {
    return (params: any[], index: number) => {
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
    }
  },

  get bytes8() {
    return (params: any[], index: number) => bytes(8, params, index)
  },
  get bytes16() {
    return (params: any[], index: number) => bytes(16, params, index)
  },
  get bytes20() {
    return (params: any[], index: number) => bytes(20, params, index)
  },
  get bytes32() {
    return (params: any[], index: number) => bytes(32, params, index)
  },
  get variableBytes32() {
    return (params: any[], index: number) => bytes(32, params, index)
  },
  get bytes48() {
    return (params: any[], index: number) => bytes(48, params, index)
  },
  get bytes256() {
    return (params: any[], index: number) => bytes(256, params, index)
  },
  get uint64() {
    return (params: any[], index: number) => uint(64, params, index)
  },
  get uint256() {
    return (params: any[], index: number) => uint(256, params, index)
  },
  get blob() {
    // "each blob is FIELD_ELEMENTS_PER_BLOB * BYTES_PER_FIELD_ELEMENT = 4096 * 32 = 131072"
    // See: https://github.com/ethereum/execution-apis/blob/b7c5d3420e00648f456744d121ffbd929862924d/src/engine/experimental/blob-extension.md
    return (params: any[], index: number) => bytes(131072, params, index)
  },

  /**
   * hex validator to validate block hash
   * @param params parameters of method
   * @param index index of parameter
   */
  get blockHash() {
    return (params: any[], index: number) => {
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

      const blockHash = params[index].substring(2)

      if (!/^[0-9a-fA-F]+$/.test(blockHash) || blockHash.length !== 64) {
        return {
          code: INVALID_PARAMS,
          message: `invalid argument ${index}: invalid block hash`,
        }
      }
    }
  },

  /**
   * validator to ensure valid block integer or hash, or string option ["latest", "earliest", "pending"]
   * @param params parameters of method
   * @param index index of parameter
   */
  get blockOption() {
    return (params: any[], index: number) => {
      if (typeof params[index] !== 'string') {
        return {
          code: INVALID_PARAMS,
          message: `invalid argument ${index}: argument must be a string`,
        }
      }

      const blockOption = params[index]

      if (!['latest', 'finalized', 'safe', 'earliest', 'pending'].includes(blockOption)) {
        if (blockOption.substr(0, 2) === '0x') {
          const hash = this.blockHash([blockOption], 0)
          // todo: make integer validator?
          const integer = this.hex([blockOption], 0)
          // valid if undefined
          if (hash === undefined || integer === undefined) {
            // valid
            return
          }
        }
        return {
          code: INVALID_PARAMS,
          message: `invalid argument ${index}: block option must be a valid 0x-prefixed block hash or hex integer, or "latest", "earliest" or "pending"`,
        }
      }
    }
  },

  /**
   * bool validator to check if type is boolean
   * @param params parameters of method
   * @param index index of parameter
   */
  get bool() {
    return (params: any[], index: number) => {
      if (typeof params[index] !== 'boolean') {
        return {
          code: INVALID_PARAMS,
          message: `invalid argument ${index}: argument is not boolean`,
        }
      }
    }
  },

  /**
   * validator to ensure required transaction fields are present, and checks for valid address and hex values.
   * @param requiredFields array of required fields
   * @returns validator function with params:
   *   - @param params parameters of method
   *   - @param index index of parameter
   */
  get transaction() {
    return (requiredFields: string[] = []) => {
      return (params: any[], index: number) => {
        if (typeof params[index] !== 'object') {
          return {
            code: INVALID_PARAMS,
            message: `invalid argument ${index}: argument must be an object`,
          }
        }

        const tx = params[index]

        for (const field of requiredFields) {
          if (tx[field] === undefined) {
            return {
              code: INVALID_PARAMS,
              message: `invalid argument ${index}: required field ${field}`,
            }
          }
        }

        const validate = (field: any, validator: Function) => {
          if (field === undefined) return
          const v = validator([field], 0)
          if (v !== undefined) return v
        }

        // validate addresses
        for (const field of [tx.to, tx.from]) {
          const v = validate(field, this.address)
          if (v !== undefined) return v
        }

        // validate hex
        const hexFields = { gas: tx.gas, gasPrice: tx.gasPrice, value: tx.value, data: tx.data }
        for (const field of Object.entries(hexFields)) {
          const v = validate(field[1], this.hex)
          if (v !== undefined) {
            return {
              code: INVALID_PARAMS,
              message: `invalid argument ${field[0]}:${v.message.split(':')[1]}`,
            }
          }
        }
      }
    }
  },

  /**
   * validator to ensure required withdawal fields are present, and checks for valid address and hex values
   * for the other quantity based fields
   * @param requiredFields array of required fields
   * @returns validator function with params:
   *   - @param params parameters of method
   *   - @param index index of parameter
   */
  get withdrawal() {
    return (requiredFields: string[] = ['index', 'validatorIndex', 'address', 'amount']) => {
      return (params: any[], index: number) => {
        if (typeof params[index] !== 'object') {
          return {
            code: INVALID_PARAMS,
            message: `invalid argument ${index}: argument must be an object`,
          }
        }

        const wt = params[index]

        for (const field of requiredFields) {
          if (wt[field] === undefined) {
            return {
              code: INVALID_PARAMS,
              message: `invalid argument ${index}: required field ${field}`,
            }
          }
        }

        const validate = (field: any, validator: Function) => {
          if (field === undefined) return
          const v = validator([field], 0)
          if (v !== undefined) return v
        }

        // validate addresses
        for (const field of [wt.address]) {
          const v = validate(field, this.address)
          if (v !== undefined) return v
        }

        // validate hex
        for (const field of [wt.index, wt.validatorIndex, wt.amount]) {
          const v = validate(field, this.hex)
          if (v !== undefined) return v
        }
      }
    }
  },

  /**
   * object validator to check if type is object with
   * required keys and expected validation of values
   * @param form object with keys and values of validators
   * @returns validator function with params:
   *   - @param params parameters of method
   *   - @param index index of parameter
   */
  get object() {
    return (form: { [key: string]: Function }) => {
      return (params: any[], index: number) => {
        if (typeof params[index] !== 'object') {
          return {
            code: INVALID_PARAMS,
            message: `invalid argument ${index}: argument is not object`,
          }
        }
        for (const [key, validator] of Object.entries(form)) {
          const value = params[index][key]
          const result = validator([value], 0)
          if (result !== undefined) {
            // add key to message for context
            const originalMessage = result.message.split(':')
            const message = `invalid argument ${index} for key '${key}':${originalMessage[1]}`
            return { ...result, message }
          }
        }
      }
    }
  },

  /**
   * array validator to check if each element
   * of the array passes the passed-in validator
   * @param validator validator to check against the elements of the array
   * @returns validator function with params:
   *   - @param params parameters of method
   *   - @param index index of parameter
   */
  get array() {
    return (validator: Function) => {
      return (params: any[], index: number) => {
        if (!Array.isArray(params[index])) {
          return {
            code: INVALID_PARAMS,
            message: `invalid argument ${index}: argument is not array`,
          }
        }
        for (const value of params[index]) {
          const result = validator([value], 0)
          if (result !== undefined) return result
        }
      }
    }
  },

  /**
   * validator to ensure that contains one of the string values
   * @param values array of possible values
   * @returns validator function with params:
   *   - @param params parameters of method
   *   - @param index index of parameter
   */
  get values() {
    return (values: string[]) => {
      return (params: any[], index: number) => {
        if (!values.includes(params[index])) {
          const valueOptions = '[' + values.map((v) => `"${v}"`).join(', ') + ']'
          return {
            code: INVALID_PARAMS,
            message: `invalid argument ${index}: argument is not one of ${valueOptions}`,
          }
        }
      }
    }
  },

  /**
   * Validator to allow validation of an optional value
   * @param validator validator to check against the value
   * @returns validator function with params:
   *   - @param params parameters of method
   *   - @param index index of parameter
   */
  get optional() {
    return (validator: any) => {
      return (params: any, index: number) => {
        if (params[index] === undefined || params[index] === '' || params[index] === null) {
          return
        }
        return validator(params, index)
      }
    }
  },

  /**
   * Validator that passes if any of the specified validators pass
   * @param validator validator to check against the value
   * @returns validator function with params:
   *   - @param params parameters of method
   *   - @param index index of parameter
   */
  get either() {
    return (...validators: any) => {
      return (params: any, index: number) => {
        if (params[index] === undefined) {
          return
        }
        const results = validators.map((v: any) => v(params, index))
        const numPassed = results.filter((r: any) => r === undefined).length
        return numPassed > 0 ? undefined : results[0]
      }
    }
  },
}
