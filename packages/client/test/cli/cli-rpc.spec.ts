import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import tape from 'tape'
import { Client } from 'jayson/promise'

const cliArgs = ['--rpc', '--ws', '--dev', '--transports=rlpx']

const end = (child: ChildProcessWithoutNullStreams, hasEnded: boolean) => {
  if (hasEnded) return
  hasEnded = true
  child.stdout.removeAllListeners()
  child.stderr.removeAllListeners()
  child.kill('SIGINT')
}

tape('[CLI] rpc tests', (t) => {
  t.test('should return valid responses from http and ws endpoints', (t) => {
    const file = require.resolve('../../dist/bin/cli.js')
    const child = spawn(process.execPath, [file, ...cliArgs])
    const hasEnded = false

    child.stdout.on('data', async (data) => {
      const message = data.toString()

      if (message.includes('http://')) {
        // if http endpoint startup message detected, call http endpoint with RPC method
        const client = Client.http({ port: 8545 })
        const res = await client.request('web3_clientVersion', [], 2.0)
        t.ok(res.result.includes('EthereumJS'), 'read from HTTP RPC')
      }

      if (message.includes('ws://')) {
        // if ws endpoint startup message detected, call ws endpoint with RPC method
        const client = Client.websocket({ url: 'ws://localhost:8544' })
        ;(client as any).ws.on('open', async function () {
          const res = await client.request('web3_clientVersion', [], 2.0)
          t.ok(res.result.includes('EthereumJS'), 'read from WS RPC')
          ;(client as any).ws.close()
          end(child, hasEnded)
          t.end()
        })
      }
    })

    child.stderr.on('data', (data) => {
      const message = data.toString()
      t.fail(`stderr: ${message}`)
      end(child, hasEnded)
    })

    child.on('close', (code) => {
      if (code > 0) {
        t.fail(`child process exited with code ${code}`)
        end(child, hasEnded)
      }
    })
  })

  t.test('http and ws endpoints should not start when cli args omitted', (t) => {
    const file = require.resolve('../../dist/bin/cli.js')
    const rpcDisabledArgs = cliArgs.filter((arg) => !['--rpc', '--ws'].includes(arg))
    const child = spawn(process.execPath, [file, ...rpcDisabledArgs])
    const hasEnded = false

    child.stdout.on('data', async (data) => {
      const message = data.toString()
      if (message.includes('address=http://')) {
        t.fail('http endpoint should not be enabled')
      }
      if (message.includes('address=ws://')) {
        t.fail('ws endpoint should not be enabled')
      }
      if (message.includes('Miner: Assembling block')) {
        t.pass('miner started and no rpc endpoints started')
        end(child, hasEnded)
        t.end()
      }
    })

    child.stderr.on('data', (data) => {
      const message = data.toString()
      t.fail(`stderr: ${message}`)
      end(child, hasEnded)
      t.end()
    })

    child.on('close', (code) => {
      if (code > 0) {
        t.fail(`child process exited with code ${code}`)
        end(child, hasEnded)
        t.end()
      }
    })
  })
})
