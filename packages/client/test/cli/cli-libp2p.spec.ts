import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import * as tape from 'tape'

const end = (child: ChildProcessWithoutNullStreams, hasEnded: boolean, st: tape.Test) => {
  if (hasEnded) return
  hasEnded = true
  child.stdout.removeAllListeners()
  child.stderr.removeAllListeners()
  const res = child.kill('SIGINT')
  st.ok(res, 'client shut down successfully')
  st.end()
}

tape('[CLI] rpc', (t) => {
  t.test('libp2p should start up', (st) => {
    const file = require.resolve('../../dist/bin/cli.js')
    const child = spawn(process.execPath, [
      file,
      ...[
        '--transports=libp2p',
        '--dev',
        '--lightserv=true',
        '--multiaddrs=/ip4/127.0.0.1/tcp/50505/',
      ],
    ])
    let child2: ChildProcessWithoutNullStreams
    const hasEnded = false

    child.stdout.on('data', async (data) => {
      const message = data.toString()

      if (message.includes('transport=libp2p')) {
        st.pass('libp2p server started')
        const bootnodeAddressArray = message.split(' ')
        const bootnodeAddressIndex = bootnodeAddressArray.findIndex((chunk: string) =>
          chunk.startsWith('url=')
        )
        const bootNodeAddress = bootnodeAddressArray[bootnodeAddressIndex].split('=')[1]
        child2 = spawn(process.execPath, [
          file,
          ...[
            '--transports=libp2p',
            `--bootnodes=${bootNodeAddress}`,
            '--datadir=data2',
            '--mine=false',
            '--dev',
            '--multiaddrs=/ip4/0.0.0.0/tcp/50506',
            '--syncmode=light',
            '--loglevel=debug',
          ],
        ])
        child2.stdout.on('data', async (data) => {
          const message = data.toString()
          if (message.includes('Peer added')) {
            st.pass('connected to peer over libp2p')
            child2.kill('SIGINT')
            child2.stdout.removeAllListeners()
            end(child, false, st)
          }
        })
      }
    })

    child.stderr.on('data', (data) => {
      const message = data.toString()
      st.fail(`stderr: ${message}`)
      end(child, hasEnded, st)
    })

    child.on('close', (code) => {
      if (code && code > 0) {
        st.fail(`child process exited with code ${code}`)
        end(child, hasEnded, st)
      }
    })
  })
})
