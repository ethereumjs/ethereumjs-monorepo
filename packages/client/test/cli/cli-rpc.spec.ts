import { spawn } from 'child_process'
import { Client } from 'jayson/promise'
import { assert, describe, it } from 'vitest'

import type { ChildProcessWithoutNullStreams } from 'child_process'

const cliArgs = ['--rpc', '--ws', '--dev', '--transports=rlpx']

const end = (child: ChildProcessWithoutNullStreams, hasEnded: boolean) => {
  if (hasEnded) return
  hasEnded = true
  child.stdout.removeAllListeners()
  child.stderr.removeAllListeners()
  const res = child.kill('SIGINT')
  assert.ok(res, 'client shut down successfully')
}

describe('[CLI] rpc', () => {
  it('should return valid responses from http and ws endpoints', () => {
    const file = require.resolve('../../dist/bin/cli.js')
    const child = spawn(process.execPath, [file, ...cliArgs])
    const hasEnded = false

    child.stdout.on('data', async (data) => {
      const message: string = data.toString()
      if (message.includes('http://')) {
        // if http endpoint startup message detected, call http endpoint with RPC method
        const client = Client.http({ port: 8545 })
        const res = await client.request('web3_clientVersion', [], 2.0)
        assert.ok(res.result.includes('EthereumJS'), 'read from HTTP RPC')
      }

      if (message.includes('ws://')) {
        // if ws endpoint startup message detected, call ws endpoint with RPC method
        const client = Client.websocket({ url: 'ws://localhost:8545' })
        ;(client as any).ws.on('open', async function () {
          const res = await client.request('web3_clientVersion', [], 2.0)
          assert.ok(res.result.includes('EthereumJS'), 'read from WS RPC')
          ;(client as any).ws.close()
          end(child, hasEnded)
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

  it('http and ws endpoints should not start when cli args omitted', () => {
    const file = require.resolve('../../dist/bin/cli.js')
    const rpcDisabledArgs = cliArgs.filter((arg) => !['--rpc', '--ws'].includes(arg))
    const child = spawn(process.execPath, [file, ...rpcDisabledArgs])
    const hasEnded = false

    child.stdout.on('data', async (data) => {
      const message: string = data.toString()
      if (message.includes('address=http://')) {
        assert.fail('http endpoint should not be enabled')
      }
      if (message.includes('address=ws://')) {
        assert.fail('ws endpoint should not be enabled')
      }
      if (message.includes('Miner: Assembling block')) {
        assert.ok('miner started and no rpc endpoints started')
        end(child, hasEnded)
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
