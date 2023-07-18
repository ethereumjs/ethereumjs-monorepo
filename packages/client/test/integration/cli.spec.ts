import { spawn } from 'child_process'
import { assert, describe, it } from 'vitest'
describe('[CLI]', () => {
  it('should start up client and execute blocks blocks', () => {
    const file = require.resolve('../../dist/bin/cli.js')
    const child = spawn(process.execPath, [file, '--dev=poa'])

    let hasEnded = false

    const timeout = setTimeout(() => {
      assert.fail('timed out before finishing')
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      end()
    }, 240000)

    const end = () => {
      clearTimeout(timeout)
      if (!hasEnded) {
        hasEnded = true
        child.kill('SIGINT')
      }
    }

    child.stdout.on('data', (data) => {
      const message = data.toString()
      // log message for easier debugging
      // eslint-disable-next-line no-console
      console.log(message)

      if (message.toLowerCase().includes('error') === true) {
        assert.fail(message)
      }
      if (message.includes('Executed') === true) {
        assert.ok(true, 'successfully executed blocks')
        return end()
      }
    })

    child.stderr.on('data', (data) => {
      const message = data.toString()
      assert.fail(`stderr: ${message}`)
    })

    child.on('close', (code) => {
      if (code !== null && code > 0) {
        assert.fail(`child process exited with code ${code}`)
      }
    })
  })
})
