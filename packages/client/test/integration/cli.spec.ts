import { spawn } from 'child_process'
import * as tape from 'tape'

tape('[CLI]', (t) => {
  t.test('should start up client and execute blocks blocks', { timeout: 300000 }, (t) => {
    const file = require.resolve('../../dist/bin/cli.js')
    const child = spawn(process.execPath, [file, '--dev=poa'])

    let hasEnded = false

    const timeout = setTimeout(() => {
      t.fail('timed out before finishing')
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      end()
    }, 240000)

    const end = () => {
      clearTimeout(timeout)
      if (!hasEnded) {
        hasEnded = true
        child.kill('SIGINT')
        t.end()
      }
    }

    child.stdout.on('data', (data) => {
      const message = data.toString()
      // log message for easier debugging
      // eslint-disable-next-line no-console
      console.log(message)

      if (message.toLowerCase().includes('error')) {
        t.fail(message)
        return end()
      }
      if (message.includes('Executed')) {
        t.pass('successfully imported blocks or headers')
        return end()
      }
    })

    child.stderr.on('data', (data) => {
      const message = data.toString()
      t.fail(`stderr: ${message}`)
      end()
    })

    child.on('close', (code) => {
      if (code !== null && code > 0) {
        t.fail(`child process exited with code ${code}`)
        end()
      }
    })
  })
})
