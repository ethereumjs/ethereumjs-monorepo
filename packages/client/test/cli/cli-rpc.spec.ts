import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import * as tape from 'tape'
import { Client } from 'jayson/promise'

const cliArgs = ['--rpc', '--ws', '--dev', '--transports=rlpx']

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
  t.test('should return valid responses from http and ws endpoints', (st) => {
    const file = require.resolve('../../dist/bin/cli.js')
    const child = spawn(process.execPath, [file, ...cliArgs])
    const hasEnded = false

    child.stdout.on('data', async (data) => {
      const message = data.toString()
      if (message.includes('http://')) {
        // if http endpoint startup message detected, call http endpoint with RPC method
        const client = Client.http({ port: 8545 })
        const res = await client.request('web3_clientVersion', [], 2.0)
        st.ok(res.result.includes('EthereumJS'), 'read from HTTP RPC')
      }

      if (message.includes('ws://')) {
        // if ws endpoint startup message detected, call ws endpoint with RPC method
        const client = Client.websocket({ url: 'ws://localhost:8545' })
        ;(client as any).ws.on('open', async function () {
          const res = await client.request('web3_clientVersion', [], 2.0)
          st.ok(res.result.includes('EthereumJS'), 'read from WS RPC')
          ;(client as any).ws.close()
          end(child, hasEnded, st)
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

  t.test('http and ws endpoints should not start when cli args omitted', (st) => {
    const file = require.resolve('../../dist/bin/cli.js')
    const rpcDisabledArgs = cliArgs.filter((arg) => !['--rpc', '--ws'].includes(arg))
    const child = spawn(process.execPath, [file, ...rpcDisabledArgs])
    const hasEnded = false

    child.stdout.on('data', async (data) => {
      const message = data.toString()
      if (message.includes('address=http://')) {
        st.fail('http endpoint should not be enabled')
      }
      if (message.includes('address=ws://')) {
        st.fail('ws endpoint should not be enabled')
      }
      if (message.includes('Miner: Assembling block')) {
        st.pass('miner started and no rpc endpoints started')
        end(child, hasEnded, st)
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
