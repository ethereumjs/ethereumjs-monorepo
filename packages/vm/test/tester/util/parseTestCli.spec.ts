import { assert, describe, it } from 'vitest'

import { parseEstWrapperArgv, parseLegacyVitestArgv } from './parseTestCli.ts'

describe('parseTestCli', () => {
  it('parseLegacyVitestArgv reads string and boolean flags', () => {
    const argv = parseLegacyVitestArgv([
      '--fork',
      'Prague',
      '--file',
      'foo.json',
      '--jobs=2',
      '--debug',
      '--verify-test-amount-alltests',
      '1',
    ])
    assert.strictEqual(argv.fork, 'Prague')
    assert.strictEqual(argv.file, 'foo.json')
    assert.strictEqual(argv.jobs, '2')
    assert.strictEqual(argv.debug, true)
    assert.strictEqual(argv['verify-test-amount-alltests'], '1')
  })

  it('parseEstWrapperArgv reads jobs', () => {
    assert.deepEqual(parseEstWrapperArgv(['--jobs', '4']), { jobs: '4' })
    assert.deepEqual(parseEstWrapperArgv(['--jobs=1']), { jobs: '1' })
  })
})
