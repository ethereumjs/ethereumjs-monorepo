import assert from 'assert'
import { exec } from 'child_process'
import { promisify } from 'util'
import vm from 'vm'
import RLP from '../dist'
import { bytesToUtf8 } from './utils'

describe('Distribution:', function () {
  it('should be able to execute functionality from distribution build', function () {
    const encodedSelf = RLP.encode('a')
    assert.strictEqual(bytesToUtf8(encodedSelf), 'a')
    assert.strictEqual(encodedSelf.length, 1)
  })
})

const execAsync = promisify(exec)

describe('CLI command:', function () {
  it('should be able to run CLI command', async function () {
    const result = await execAsync('./bin/rlp encode "[ 5 ]"')
    const resultFormatted = result.stdout.trim()
    assert.strictEqual(resultFormatted, '0xc105')
  })

  const officalTests = require('./fixture/rlptest.json').tests
  it('should return valid values for official tests', async function () {
    // eslint-disable-next-line no-invalid-this
    this.timeout(10000)

    // eslint-disable-next-line no-restricted-syntax
    for (const testName in officalTests) {
      const { in: incoming, out } = officalTests[testName]

      // skip if testing a big number
      if (incoming[0] === '#') {
        continue
      }

      const json = JSON.stringify(incoming)
      const encodeResult = await execAsync(`./bin/rlp encode '${json}'`)
      const encodeResultTrimmed = encodeResult.stdout.trim()
      assert.strictEqual(encodeResultTrimmed, out.toLowerCase(), `should pass encoding ${testName}`)
    }
  })
})

describe('Cross-frame:', function () {
  it('should be able to encode Arrays across stack frames', function () {
    assert.strictEqual(
      vm.runInNewContext(
        "Array.from(RLP.encode(['dog', 'god', 'cat'])).map(n => n.toString(16).padStart(2, '0')).join('')",
        { RLP }
      ),
      'cc83646f6783676f6483636174'
    )
  })
})
