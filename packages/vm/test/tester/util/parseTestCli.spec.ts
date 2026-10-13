import { assert, describe, it } from 'vitest'

import { parseEstWrapperArgv, parseLegacyVitestArgv, parseT8nArgv } from './parseTestCli.ts'

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

  it('parseT8nArgv maps dotted flags to T8NOptions', () => {
    const opts = parseT8nArgv([
      '--state.fork=Cancun',
      '--input.alloc=/a/alloc.json',
      '--input.txs=/a/txs.json',
      '--input.env=/a/env.json',
      '--output.basedir=/out',
      '--output.result=result.json',
      '--output.alloc=alloc.json',
      '--trace',
    ])
    assert.strictEqual(opts.state.fork, 'Cancun')
    assert.strictEqual(opts.state.chainid, 1n)
    assert.strictEqual(opts.state.reward, -1n)
    assert.strictEqual(opts.input.alloc, '/a/alloc.json')
    assert.strictEqual(opts.trace, true)
    assert.strictEqual(opts.log, false)
  })

  it('parseT8nArgv rejects unknown flags', () => {
    assert.throws(
      () =>
        parseT8nArgv([
          '--state.fork=Cancun',
          '--input.alloc=a',
          '--input.txs=t',
          '--input.env=e',
          '--output.basedir=o',
          '--output.result=r',
          '--output.alloc=a2',
          '--nope',
        ]),
      /Unknown option/,
    )
  })
})
