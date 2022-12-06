import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { execSync, spawn } from 'node:child_process'
import * as net from 'node:net'

import type { Common } from '@ethereumjs/common'
import type { Client } from 'jayson/promise'

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function waitForELOnline(client: Client): Promise<string> {
  for (let i = 0; i < 15; i++) {
    try {
      console.log('Waiting for EL online...')
      const res = await client.request('web3_clientVersion', [])
      return res.result as string
    } catch (e) {
      await sleep(4000)
    }
  }
  throw Error('EL not online in 60 seconds')
}

async function isPortInUse(port: number): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    const server = net.createServer()
    server.once('error', function (err) {
      if ((err as unknown as { code: string }).code === 'EADDRINUSE') {
        resolve(true)
      } else {
        reject(err)
      }
    })

    server.once('listening', function () {
      // close the server if listening doesn't fail
      server.close(() => {
        resolve(false)
      })
    })

    server.listen(port)
  })
}

export async function waitForELOffline(): Promise<void> {
  const port = 30303

  for (let i = 0; i < 15; i++) {
    console.log('Waiting for EL offline...')
    const isInUse = await isPortInUse(port)
    if (!isInUse) {
      return
    }
    await sleep(4000)
  }
  throw Error('EL not offline in 120 seconds')
}

type RunOpts = {
  filterKeywords: string[]
  filterOutWords: string[]
  externalRun: string | undefined
}

export function runNetwork(
  network: string,
  client: Client,
  { filterKeywords, filterOutWords }: RunOpts
): () => Promise<void> {
  const runProc = spawn('test/sim/single-run.sh', [], {
    env: {
      ...process.env,
      NETWORK: network,
    },
  })
  console.log({ pid: runProc.pid })
  let lastPrintedDot = false

  runProc.stdout.on('data', (chunk) => {
    const str = Buffer.from(chunk).toString('utf8')
    const filterStr = filterKeywords.reduce((acc, next) => acc || str.includes(next), false)
    const filterOutStr = filterOutWords.reduce((acc, next) => acc || str.includes(next), false)
    if (filterStr && !filterOutStr) {
      if (lastPrintedDot) {
        console.log('')
        lastPrintedDot = false
      }
      process.stdout.write(`el<>cl: ${runProc.pid}: ${str}`) // str already contains a new line. console.log adds a new line
    } else {
      if (str.includes('Synchronized')) {
        process.stdout.write('.')
        lastPrintedDot = true
      }
    }
  })
  runProc.stderr.on('data', (chunk) => {
    const str = Buffer.from(chunk).toString('utf8')
    const filterOutStr = filterOutWords.reduce((acc, next) => acc || str.includes(next), false)
    if (!filterOutStr) {
      process.stderr.write(`el<>cl: ${runProc.pid}: ${str}`) // str already contains a new line. console.log adds a new line
    }
  })

  runProc.on('exit', (code) => {
    console.log('network exited', { code })
  })

  const teardownCallBack = async () => {
    console.log('teardownCallBack', { pid: runProc.pid })
    if (runProc.killed) {
      throw Error('network is killed before end of test')
    }
    console.log('Killing network process', runProc.pid)
    execSync(`pkill -15 -P ${runProc.pid}`)
    // Wait for the P2P to be offline
    await waitForELOffline()
    console.log('network successfully killed!')
  }
  return teardownCallBack
}

export async function startNetwork(
  network: string,
  client: Client,
  opts: RunOpts
): Promise<{ teardownCallBack: () => Promise<void>; result: string }> {
  let teardownCallBack
  if (opts.externalRun === undefined) {
    teardownCallBack = runNetwork(network, client, opts)
  } else {
    teardownCallBack = async (): Promise<void> => {}
  }
  const result = await waitForELOnline(client)
  return { teardownCallBack, result }
}

export async function runTxHelper(
  opts: { client: Client; common: Common; sender: string; pkey: Buffer },
  data: string,
  to?: string,
  value?: bigint
) {
  const { client, common, sender, pkey } = opts
  const nonce = BigInt((await client.request('eth_getTransactionCount', [sender, 'latest'])).result)

  const block = await client.request('eth_getBlockByNumber', ['latest', false])
  const baseFeePerGas = BigInt(block.result.baseFeePerGas) * 100n
  const maxPriorityFeePerGas = 100000000n
  const tx = FeeMarketEIP1559Transaction.fromTxData(
    {
      data,
      gasLimit: 1000000,
      maxFeePerGas: baseFeePerGas + maxPriorityFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      to,
      value,
    },
    { common }
  ).sign(pkey)

  const res = await client.request(
    'eth_sendRawTransaction',
    ['0x' + tx.serialize().toString('hex')],
    2.0
  )
  let mined = false
  let receipt
  console.log(`tx: ${res.result}`)
  let tries = 0
  while (!mined && tries < 50) {
    tries++
    receipt = await client.request('eth_getTransactionReceipt', [res.result])
    if (receipt.result !== null) {
      mined = true
    } else {
      process.stdout.write('-')
      await sleep(12000)
    }
  }
  return receipt.result
}
