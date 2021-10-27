import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import tape from 'tape'
import { Client } from 'jayson/promise'

// set args for --network and --syncmode
const cliArgs = ['--rpc', '--rpcHttpPort=8545', '--rpcWsPort=8544', '--dev', '--transports=rlpx']

tape('[CLI] rpc tests', (t) => {
  t.test('should call http and ws RPCs and verify disabled rpc', { timeout: 200000 }, (t) => {
    const end = (child: ChildProcessWithoutNullStreams, hasEnded: boolean) => {
      if (hasEnded) return
      hasEnded = true
      child.stdout.removeAllListeners()
      child.stderr.removeAllListeners()
      child.kill('SIGINT')
    }
    const disabledRpcTest = () => {
      const file = require.resolve('../../dist/bin/cli.js')
      const child = spawn(process.execPath, [
        file,
        ...cliArgs.filter((arg) => !arg.includes('--rpc')),
      ])

      const hasEnded = false
      child.stdout.on('data', async (data) => {
        const message = data.toString()

        // log message for easier debugging
        // eslint-disable-next-line no-console
        console.log(message)

        if (message.toLowerCase().includes('http endpoint')) {
          t.fail('http endpoint should not be enabled')
        }

        if (message.toLowerCase().includes('wss endpoint')) {
          t.fail('ws endpoint should not be enabled')
        }

        if (message.toLowerCase().includes('miner: assembling block')) {
          t.pass('miner started and no rpc endpoints started')
          end(child, hasEnded)
          t.end()
        }

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
    }
    const file = require.resolve('../../dist/bin/cli.js')
    const child = spawn(process.execPath, [file, ...cliArgs])
    const hasEnded = false

    child.stdout.on('data', async (data) => {
      const message = data.toString()

      // log message for easier debugging
      // eslint-disable-next-line no-console
      console.log(message)

      if (message.toLowerCase().includes('http endpoint')) {
        // if http endpoint startup message detected, call http endpoint with RPC method
        const client = Client.http({ port: 8545 })
        const res = await client.request('web3_clientVersion', [], 2.0)
        t.ok(res.result.includes('EthereumJS'), 'read from HTTP RPC')
      }

      if (message.toLowerCase().includes('ws endpoint')) {
        // if ws endpoint startup message detected, call ws endpoint with RPC method
        const client = Client.websocket({ url: 'ws://localhost:8544' })
          ; (client as any).ws.on('open', async function () {
            const res = await client.request('web3_clientVersion', [], 2.0)
            t.ok(res.result.includes('EthereumJS'), 'read from WS RPC')
              ; (client as any).ws.close()
            end(child, hasEnded)
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

    child.on('exit', () => {
      disabledRpcTest()
    })
  })
})
