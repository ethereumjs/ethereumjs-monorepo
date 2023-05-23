import { Blockchain } from '@ethereumjs/blockchain'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { Level } from 'level'
import { execSync, spawn } from 'node:child_process'
import * as net from 'node:net'

import { EthereumClient } from '../../lib/client'
import { Config } from '../../lib/config'

import type { Common } from '@ethereumjs/common'
import type { ChildProcessWithoutNullStreams } from 'child_process'
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

export async function waitForELStart(client: Client): Promise<void> {
  for (let i = 0; i < 5; i++) {
    const res = await client.request('eth_getBlockByNumber', ['latest', false])
    if (Number(res.result.number) > 0) {
      return
    } else {
      process.stdout.write('*')
      await sleep(12000)
    }
  }
  throw Error('EL not started in 60 seconds')
}

export async function validateBlockHashesInclusionInBeacon(
  beaconUrl: string,
  from: number,
  to: number,
  blockHashes: string[]
) {
  const executionHashes: string[] = []
  for (let i = from; i <= to; i++) {
    const res = await (await fetch(`${beaconUrl}/eth/v2/beacon/blocks/${i}`)).json()
    // it could be possible that executionPayload is not provided if the block
    // is not bellatrix+
    const executionHash = res.data.message.body.execution_payload?.block_hash
    if (executionHash !== undefined) {
      executionHashes.push(executionHash)
    }
  }
  const inclusionCheck = blockHashes.reduce((acc, blockHash) => {
    return acc && executionHashes.includes(blockHash)
  }, true)
  if (!inclusionCheck) {
    throw Error('Failed inclusion check')
  }
}

type RunOpts = {
  filterKeywords: string[]
  filterOutWords: string[]
  externalRun?: string
  withPeer?: string
}

export function runNetwork(
  network: string,
  client: Client,
  { filterKeywords, filterOutWords, withPeer }: RunOpts
): () => Promise<void> {
  const runProc = spawn('test/sim/single-run.sh', [], {
    env: {
      ...process.env,
      NETWORK: network,
      // If instructed to run a multipeer with a peer2
      MULTIPEER: withPeer === 'peer2' ? 'peer1' : undefined,
    },
  })
  const runProcPrefix = withPeer !== undefined ? 'peer1' : ''
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
      process.stdout.write(`data:${runProcPrefix}: ${runProc.pid}: ${str}`) // str already contains a new line. console.log adds a new line
    } else {
      if (str.includes('Synchronized')) {
        process.stdout.write('.')
        lastPrintedDot = true
      } else if (str.includes('Synced') && !str.includes('skipped')) {
        process.stdout.write('`')
      }
    }
  })
  runProc.stderr.on('data', (chunk) => {
    const str = Buffer.from(chunk).toString('utf8')
    const filterStr = filterKeywords.reduce((acc, next) => acc || str.includes(next), false)
    const filterOutStr = filterOutWords.reduce((acc, next) => acc || str.includes(next), false)
    if (filterStr && !filterOutStr) {
      process.stderr.write(`stderr:${runProcPrefix}: ${runProc.pid}: ${str}`) // str already contains a new line. console.log adds a new line
    }
  })

  runProc.on('exit', (code) => {
    console.log('network exited', { code })
  })
  console.log({ pid: runProc.pid })

  let peerRunProc: ChildProcessWithoutNullStreams | undefined = undefined
  if (withPeer !== undefined) {
    peerRunProc = spawn('test/sim/single-run.sh', [], {
      env: {
        ...process.env,
        NETWORK: network,
        MULTIPEER: withPeer,
      },
    })
    console.log({ peerRunProc: peerRunProc.pid })

    let lastPrintedDot = false
    peerRunProc.stdout.on('data', (chunk) => {
      const str = Buffer.from(chunk).toString('utf8')
      const filterStr = filterKeywords.reduce((acc, next) => acc || str.includes(next), false)
      const filterOutStr = filterOutWords.reduce((acc, next) => acc || str.includes(next), false)
      if (filterStr && !filterOutStr) {
        if (lastPrintedDot) {
          console.log('')
          lastPrintedDot = false
        }
        process.stdout.write(`${withPeer}:el<>cl: ${runProc.pid}: ${str}`) // str already contains a new line. console.log adds a new line
      } else {
        if (str.includes('Synchronized')) {
          process.stdout.write('.')
          lastPrintedDot = true
        }
      }
    })
    peerRunProc.stderr.on('data', (chunk) => {
      const str = Buffer.from(chunk).toString('utf8')
      const filterOutStr = filterOutWords.reduce((acc, next) => acc || str.includes(next), false)
      if (!filterOutStr) {
        process.stderr.write(`${withPeer}:el<>cl: ${runProc.pid}: ${str}`) // str already contains a new line. console.log adds a new line
      }
    })

    peerRunProc.on('exit', (code) => {
      console.log('network exited', { code })
    })
  }

  const teardownCallBack = async () => {
    console.log('teardownCallBack', { pid: runProc.pid })
    if (runProc.killed) {
      throw Error('network is killed before end of test')
    }
    console.log('Killing network process', runProc.pid)
    execSync(`pkill -15 -P ${runProc.pid}`)
    if (peerRunProc !== undefined) {
      console.log('Killing peer network process', peerRunProc.pid)
      execSync(`pkill -15 -P ${peerRunProc.pid}`)
    }
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

export async function createInlineClient(config: any, common: any, customGenesisState: any) {
  config.events.setMaxListeners(50)
  const datadir = Config.DATADIR_DEFAULT
  const chainDB = new Level<string | Buffer, string | Buffer>(
    `${datadir}/${common.chainName()}/chainDB`
  )
  const stateDB = new Level<string | Buffer, string | Buffer>(
    `${datadir}/${common.chainName()}/stateDB`
  )
  const metaDB = new Level<string | Buffer, string | Buffer>(
    `${datadir}/${common.chainName()}/metaDB`
  )

  const blockchain = await Blockchain.create({
    db: chainDB,
    genesisState: customGenesisState,
    common: config.chainCommon,
    hardforkByHeadBlockNumber: true,
    validateBlocks: true,
    validateConsensus: false,
  })
  config.chainCommon.setForkHashes(blockchain.genesisBlock.hash())
  const inlineClient = await EthereumClient.create({ config, blockchain, chainDB, stateDB, metaDB })
  await inlineClient.open()
  await inlineClient.start()
  return inlineClient
}

// To minimise noise on the spec run, selective filteration is applied to let the important events
// of the testnet log to show up in the spec log
export const filterKeywords = [
  'warn',
  'error',
  'npm run client:start',
  'docker run',
  'lodestar dev',
  'kill',
  'ejs',
  'lode',
  'pid',
  'Synced - slot: 0 -',
  'TxPool started',
  'number=0',
]
export const filterOutWords = ['duties', 'Low peer count', 'MaxListenersExceededWarning']
