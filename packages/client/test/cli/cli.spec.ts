import { spawn } from 'child_process'
import tape from 'tape'

// get args for --network and --syncmode
const cliArgs = process.argv.filter(
  (arg) => arg.startsWith('--network') || arg.startsWith('--syncmode')
)

tape('[CLI]', (t) => {
  t.test('should begin downloading blocks', { timeout: 260000 }, (t) => {
    const file = require.resolve('../../dist/bin/cli.js')
    const child = spawn(process.execPath, [file, ...cliArgs])

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
      if (message.includes('Imported')) {
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
      if (code > 0) {
        t.fail(`child process exited with code ${code}`)
        end()
      }
    })
  })
})
