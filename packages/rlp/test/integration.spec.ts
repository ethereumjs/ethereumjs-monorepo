import * as tape from 'tape'
import { exec } from 'child_process'
import { promisify } from 'util'
import * as vm from 'vm'
import RLP from '../src'
import { bytesToUtf8 } from './utils'
import * as official from './fixture/rlptest.json'

tape('Distribution', (t) => {
  t.test('should be able to execute functionality from distribution build', (st) => {
    const encodedSelf = RLP.encode('a')
    st.deepEqual(bytesToUtf8(encodedSelf), 'a')
    st.deepEqual(encodedSelf.length, 1)
    st.end()
  })
})

const execAsync = promisify(exec)

tape('CLI command', (t) => {
  t.test('should be able to run CLI command', async (st) => {
    const result = await execAsync('./bin/rlp encode "[ 5 ]"')
    const resultFormatted = result.stdout.trim()
    st.deepEqual(resultFormatted, '0xc105')
    st.end()
  })

  t.test('should return valid values for official tests', { timeout: 10000 }, async (st) => {
    for (const [testName, test] of Object.entries(official.tests)) {
      const { in: incoming, out } = test

      // skip if testing a big number
      if ((incoming as any)[0] === '#') {
        continue
      }

      const json = JSON.stringify(incoming)
      const encodeResult = await execAsync(`./bin/rlp encode '${json}'`)
      const encodeResultTrimmed = encodeResult.stdout.trim()
      st.deepEqual(encodeResultTrimmed, out.toLowerCase(), `should pass encoding ${testName}`)
    }
    st.end()
  })
})

tape('Cross-frame', (t) => {
  t.test('should be able to encode Arrays across stack frames', (st) => {
    st.deepEqual(
      vm.runInNewContext(
        "Array.from(RLP.encode(['dog', 'god', 'cat'])).map(n => n.toString(16).padStart(2, '0')).join('')",
        { RLP }
      ),
      'cc83646f6783676f6483636174'
    )
    st.end()
  })
})
