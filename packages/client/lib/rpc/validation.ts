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

      if (!['latest', 'earliest', 'pending'].includes(blockOption)) {
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
          if (!tx[field]) {
            return {
              code: INVALID_PARAMS,
              message: `invalid argument ${index}: required field ${field}`,
            }
          }
        }

        const validate = (field: any, validator: Function) => {
          if (!field) return
          const v = validator([field], 0)
          if (v) return v
        }

        // validate addresses
        for (const field of [tx.to, tx.from]) {
          const v = validate(field, this.address)
          if (v) return v
        }

        // valdiate hex
        for (const field of [tx.gas, tx.gasPrice, tx.value, tx.data]) {
          const v = validate(field, this.hex)
          if (v) return v
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
          if (result) {
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
          if (result) return result
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
        if (!params[index]) {
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
        if (!params[index]) {
          return
        }
        const results = validators.map((v: any) => v(params, index))
        const numPassed = results.filter((r: any) => r === undefined).length
        return numPassed > 0 ? undefined : results[0]
      }
    }
  },
}
