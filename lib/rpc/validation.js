const { INVALID_PARAMS } = require('./error-code')

module.exports = {
  /**
   * middleware for parameters validation
   * @param {Function} method            function to add middleware
   * @param {number} requiredParamsCount required parameters count
   * @param {Function[]} validators      array of validator
   */
  middleware (method, requiredParamsCount, validators) {
    return function (params, cb) {
      if (params.length < requiredParamsCount) {
        const err = {
          code: INVALID_PARAMS,
          message: `missing value for required argument ${params.length}`
        }
        return cb(err)
      }

      for (let i = 0; i < validators.length; i++) {
        if (validators[i]) {
          const err = validators[i](params, i)
          if (err) {
            return cb(err)
          }
        }
      }

      method(params, cb)
    }
  },

  validators: {
    /**
     * hex validator to ensure has "0x" prefix
     * @param {any[]} params parameters of method
     * @param {number} index index of parameter
     */
    hex (params, index) {
      let err
      if (params[index].substr(0, 2) !== '0x') {
        err = {
          code: INVALID_PARAMS,
          message: `invalid argument ${index}: hex string without 0x prefix`
        }
      }

      return err
    },

    /**
     * bool validator to check if type is boolean
     * @param {any[]} params parameters of method
     * @param {number} index index of parameter
     */
    bool (params, index) {
      let err
      if (typeof (params[index]) !== 'boolean') {
        err = {
          code: INVALID_PARAMS,
          message: `invalid argument ${index}: argument is not boolean`
        }
      }

      return err
    }
  }
}
