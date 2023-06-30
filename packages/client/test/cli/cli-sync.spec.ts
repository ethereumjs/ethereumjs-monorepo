import { spawn } from 'child_process'
import * as tape from 'tape'

// get args for --network and --syncmode
const cliArgs = process.argv.filter(
  (arg) => arg.startsWith('--network') || arg.startsWith('--sync')
)

tape('[CLI] sync', (t) => {
  t.test('should begin downloading blocks', { timeout: 260000 }, (st) => {
    const file = require.resolve('../../dist/bin/cli.js')
    const child = spawn(process.execPath, [file, ...cliArgs])

    let hasEnded = false
    const end = () => {
      if (hasEnded) return
      hasEnded = true
      child.stdout.removeAllListeners()
      child.stderr.removeAllListeners()
      child.kill('SIGINT')
      st.end()
    }

    child.stdout.on('data', (data) => {
      const message: string = data.toString()

      // log message for easier debugging
      // eslint-disable-next-line no-console
      console.log(message)

      if (message.toLowerCase().includes('error')) {
        st.fail(message)
        return end()
      }
      if (message.includes('Imported')) {
        st.pass('successfully imported blocks or headers')
        return end()
      }
    })

    child.stderr.on('data', (data) => {
      const message: string = data.toString()
      if (message.includes('Possible EventEmitter memory leak detected')) {
        // This is okay.
        return
      }
      st.fail(`stderr: ${message}`)
      end()
    })

    child.on('close', (code) => {
      if (typeof code === 'number' && code > 0) {
        st.fail(`child process exited with code ${code}`)
        end()
      }
    })
  })
})
