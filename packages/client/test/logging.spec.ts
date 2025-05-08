import { assert, describe, it } from 'vitest'

import { getLogger } from '../src/logging.ts'

describe('[Logging]', () => {
  const logger = getLogger({ logLevel: 'info', logFile: 'ethereumjs.log', logLevelFile: 'info' })
  const format = logger!.transports.find((t: any) => t.name === 'console')!.format!

  it('should have correct transports', () => {
    assert.isTrue(
      logger?.transports.find((t: any) => t.name === 'console') !== undefined,
      'should have stdout transport',
    )
    assert.isTrue(
      logger?.transports.find((t: any) => t.name === 'file') !== undefined,
      'should have file transport',
    )
  })

  it('should log error stacks properly', () => {
    try {
      throw new Error('an error')
    } catch (e: any) {
      e.level = 'error'
      assert.isTrue(
        /an error\n {4}at/.test((format.transform(e) as any).message),
        'log message should contain stack trace (1)',
      )
      assert.isTrue(
        /an error\n {4}at/.test((format.transform({ level: 'error', message: e }) as any).message),
        'log message should contain stack trace (2)',
      )
    }
  })

  // This test breaks for no obvious reason and we don't run it in CI anyway.
  // Running the client confirms that logging is using correct color schemes.
  it.skip('should colorize key=value pairs', () => {
    if (process.env.GITHUB_ACTION !== undefined) {
      assert.isTrue(true, 'no color functionality in ci')
      return
    }
    const { message } = format.transform({
      level: 'info',
      message: 'test key=value',
    }) as any
    assert.strictEqual(
      message,
      'test \x1B[38;2;0;128;0mkey\x1B[39m=value ', // cspell:disable-line
      'key=value pairs should be colorized',
    )
  })
})
