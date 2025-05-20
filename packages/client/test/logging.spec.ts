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

  // must be run with `FORCE_COLOR='1' npx vitest test/logging.spec.ts`
  it.skipIf(process.env.FORCE_COLOR !== '1')('should colorize key=value pairs', () => {
    if (process.env.GITHUB_ACTION !== undefined) {
      assert.isTrue(true, 'no color functionality in ci')
      return
    }
    const { message } = format.transform({
      level: 'info',
      message: 'test key=value',
    }) as any

    // matches either ESC[32m (basic green) or ESC[38;2;0;128;0m (true-color green)
    function hasGreen(str: string): boolean {
      // eslint-disable-next-line
      return /\x1B\[(?:32|38;2;0;128;0)m/.test(str)
    }

    assert.isTrue(
      hasGreen(message), // cspell:disable-line
      'key=value pairs should be colorized',
    )
  })
})
