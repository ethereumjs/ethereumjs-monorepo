import { spawn } from 'child_process'
import { assert, describe, it } from 'vitest'

import type { ChildProcessWithoutNullStreams } from 'child_process'

const end = (child: ChildProcessWithoutNullStreams, hasEnded: boolean) => {
  if (hasEnded) return
  hasEnded = true
  child.stdout.removeAllListeners()
  child.stderr.removeAllListeners()
  const res = child.kill('SIGINT')
  assert.ok(res, 'client shut down successfully')
}

describe('[CLI] rpc', () => {
  it('libp2p should start up', () => {
    const file = require.resolve('../../dist/bin/cli.js')
    const child = spawn(process.execPath, [
      file,
      ...[
        '--transports=libp2p',
        '--dev',
        '--lightServe=true',
        '--multiaddrs=/ip4/127.0.0.1/tcp/50505/',
      ],
    ])
    let child2: ChildProcessWithoutNullStreams
    const hasEnded = false

    child.stdout.on('data', async (data) => {
      const message: string = data.toString()

      if (message.includes('transport=libp2p')) {
        assert.ok(true, 'libp2p server started')
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
            '--dataDir=data2',
            '--mine=false',
            '--dev',
            '--multiaddrs=/ip4/0.0.0.0/tcp/50506',
            '--sync=light',
            '--logLevel=debug',
          ],
        ])
        child2.stdout.on('data', async (data) => {
          const message: string = data.toString()
          if (message.includes('Peer added')) {
            assert.ok(true, 'connected to peer over libp2p')
            child2.kill('SIGINT')
            child2.stdout.removeAllListeners()
            end(child, false)
          }
        })
      }
    })

    child.stderr.on('data', (data) => {
      const message: string = data.toString()
      assert.fail(`stderr: ${message}`)
      end(child, hasEnded)
    })

    child.on('close', (code) => {
      if (typeof code === 'number' && code > 0) {
        assert.fail(`child process exited with code ${code}`)
        end(child, hasEnded)
      }
    })
  })
})
