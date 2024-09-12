import { spawn } from 'child_process'
import { assert, describe, it } from 'vitest'

import type { ChildProcessWithoutNullStreams } from 'child_process'

export function cliRunHelper(
  cliArgs: string[],
  onData: (message: string, child: ChildProcessWithoutNullStreams, resolve: Function) => void,
) {
  const file = require.resolve('../bin/rlp.cjs')
  const child = spawn(process.execPath, [file, ...cliArgs])
  return new Promise((resolve) => {
    child.stdout.on('data', async (data) => {
      const message: string = data.toString()
      onData(message, child, resolve)
      if (message.toLowerCase().includes('error')) {
        child.kill(9)
        assert.fail(`client encountered error: ${message}`)
      }
    })
    child.stderr.on('data', (data) => {
      const message: string = data.toString()
      assert.fail(`stderr: ${message}`)
    })
    child.on('close', (code) => {
      if (typeof code === 'number' && code > 0) {
        assert.fail(`child process exited with code ${code}`)
      }
    })
  })
}

describe('rlp CLI', async () => {
  it('correctly encodes RLP from the CLI', async () => {
    const cliArgs = ['encode', '5']
    const onData = (message: string, child: ChildProcessWithoutNullStreams, resolve: Function) => {
      assert.ok(message.includes('0x05'), 'cli correctly encoded 5')
      child.kill(9)
      resolve(undefined)
    }
    await cliRunHelper(cliArgs, onData)
  })
  it('correctly decoded RLP from the CLI'),
    async () => {
      const cliArgs = ['decode', '0x05']
      const onData = (
        message: string,
        child: ChildProcessWithoutNullStreams,
        resolve: Function,
      ) => {
        assert.ok(message.includes('0x05'), 'cli correctly encoded 5')
        child.kill(9)
        resolve(undefined)
      }

      await cliRunHelper(cliArgs, onData)
    }
})
