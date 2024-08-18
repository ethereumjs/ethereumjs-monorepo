import { assert, beforeAll, describe, it } from 'vitest'

import { RLP } from '../src/index.js'

import * as official from './fixture/rlptest.json'
import { bytesToUtf8 } from './utils.js'

const isBrowser = new Function('try {return this===window;}catch(e){ return false;}')

describe('Distribution', () => {
  it('should be able to execute functionality from distribution build', () => {
    const encodedSelf = RLP.encode('a')
    assert.deepEqual(bytesToUtf8(encodedSelf), 'a')
    assert.deepEqual(encodedSelf.length, 1)
  })
})

describe.skipIf(isBrowser)('CLI command', () => {
  let exec: any
  beforeAll(async () => {
    const child_process = await import('child_process')
    exec = child_process.exec
  })
  it('should be able to run CLI command', async () => {
    const result = exec('./bin/rlp encode "[ 5 ]"')
    const resultFormatted = result.stdout!.read().trim()
    assert.deepEqual(resultFormatted, '0xc105')
  })

  it(
    'should return valid values for official tests',
    async () => {
      for (const [testName, test] of Object.entries(official.tests)) {
        const { in: incoming, out } = test

        // skip if testing a big number
        if ((incoming as any)[0] === '#') {
          continue
        }

        const json = JSON.stringify(incoming)
        const encodeResult = exec(`./bin/rlp encode '${json}'`)
        const encodeResultTrimmed = encodeResult.stdout!.read().trim()
        assert.deepEqual(encodeResultTrimmed, out.toLowerCase(), `should pass encoding ${testName}`)
      }
    },
    { timeout: 10000 },
  )
})

describe.skipIf(isBrowser)('Cross-frame', () => {
  it('should be able to encode Arrays across stack frames', async () => {
    const vm = await import('vm')
    assert.deepEqual(
      vm.runInNewContext(
        "Array.from(RLP.encode(['dog', 'god', 'cat'])).map(n => n.toString(16).padStart(2, '0')).join('')",
        { RLP },
      ),
      'cc83646f6783676f6483636174',
    )
  })
})
