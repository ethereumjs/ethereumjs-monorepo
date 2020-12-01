import tape from 'tape'
import { getLogger } from '../lib/logging'

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
        /an error\n {4}at/.test(
          (logger.format.transform({ level: 'error', message: e }) as any).message
        ),
        'log message should contain stack trace (2)'
      )
      st.end()
    }
  })

  t.test('should colorize key=value pairs', (st) => {
    if (process.env.GITHUB_ACTION) {
      st.skip('no color functionality in ci')
      return st.end()
    }
    const { message } = logger.format.transform({ level: 'info', message: 'test key=value' }) as any
    st.equal(message, 'test \u001b[32mkey\u001b[39m=value ', 'key=value pairs should be colorized')
    st.end()
  })
})
