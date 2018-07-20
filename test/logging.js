const tape = require('tape')
const { getLogger } = require('../lib/logging')

tape('[Logging]: Logging functions', t => {
  const logger = getLogger()

  t.test('should log error stacks properly', st => {
    try {
      throw new Error('an error')
    } catch (e) {
      e.level = 'error'
      t.ok(
        /an error\n {4}at/.test(logger.format.transform(e).message),
        'log message should contain stack trace (1)')
      t.ok(
        /an error\n {4}at/.test(logger.format.transform({level: 'error', message: e}).message),
        'log message should contain stack trace (2)')
      t.end()
    }
  })
})
