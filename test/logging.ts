import tape from 'tape'
const { getLogger } = require('../lib/logging')

tape('[Logging]', (t) => {
  const logger = getLogger()

  t.test('should log error stacks properly', (st) => {
    try {
      throw new Error('an error')
    } catch (e) {
      e.level = 'error'
      // st.ok(
      //   /an error\n {4}at/.test(logger.format.transform(e).message),
      //   'log message should contain stack trace (1)')
      st.ok(
        /an error\n {4}at/.test(logger.format.transform({ level: 'error', message: e }).message),
        'log message should contain stack trace (2)'
      )
      st.end()
    }
  })

  t.test('should colorize key=value pairs', (st) => {
    const { message } = logger.format.transform({ level: 'info', message: 'test key=value' })
    t.equal(message, 'test \u001b[32mkey\u001b[39m=value ', 'key=value pairs should be colorized')
    st.end()
  })
})
