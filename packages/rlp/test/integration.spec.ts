import { exec } from 'child_process'
import { promisify } from 'util'
import { assert, describe, it } from 'vitest'
import * as vm from 'vm'

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

const execAsync = promisify(exec)

describe.skipIf(isBrowser)('CLI command', () => {
  it('should be able to run CLI command', async () => {
    const result = await execAsync('./bin/rlp encode "[ 5 ]"')
    const resultFormatted = result.stdout.trim()
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
        const encodeResult = await execAsync(`./bin/rlp encode '${json}'`)
        const encodeResultTrimmed = encodeResult.stdout.trim()
        assert.deepEqual(encodeResultTrimmed, out.toLowerCase(), `should pass encoding ${testName}`)
      }
    },
    { timeout: 10000 }
  )
})

describe('Cross-frame', () => {
  it('should be able to encode Arrays across stack frames', () => {
    assert.deepEqual(
      vm.runInNewContext(
        "Array.from(RLP.encode(['dog', 'god', 'cat'])).map(n => n.toString(16).padStart(2, '0')).join('')",
        { RLP }
      ),
      'cc83646f6783676f6483636174'
    )
  })
})
