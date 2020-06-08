module.exports = {
  checkError (expectedCode, expectedMessage) {
    return function (res) {
      if (!res.body.error) {
        throw new Error('should return an error object')
      }
      if (res.body.error.code !== expectedCode) {
        throw new Error(`should have an error code ${expectedCode}`)
      }
      if (expectedMessage && res.body.error.message !== expectedMessage) {
        throw new Error(`should have an error message "${expectedMessage}"`)
      }
    }
  }
}
