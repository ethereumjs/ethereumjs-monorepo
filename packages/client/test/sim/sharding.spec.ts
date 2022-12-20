import { Common } from '@ethereumjs/common'
import { bigIntToHex, privateToAddress } from '@ethereumjs/util'
import { Client } from 'jayson/promise'
import * as tape from 'tape'

import { runBlobTx, runTxHelper, sleep, startNetwork } from './simutils'

const pkey = Buffer.from('45a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065ff2d8', 'hex')
const sender = '0x' + privateToAddress(pkey).toString('hex')
const client = Client.http({ port: 8545 })

const network = 'sharding'
const shardingJson = require(`./configs/${network}.json`)
const common = Common.fromGethGenesis(shardingJson, { chain: network })

export async function runTx(data: string, to?: string, value?: bigint) {
  return runTxHelper({ client, common, sender, pkey }, data, to, value)
}

// To minimise noise on the spec run, selective filteration is applied to let the important events
// of the testnet log to show up in the spec log
const filterKeywords = [
  'warn',
  'error',
  'npm run client:start',
  'docker run',
  'lodestar dev',
  'kill',
  'ejs',
  'lode',
  'pid',
]
const filterOutWords = ['duties', 'Low peer count', 'MaxListenersExceededWarning']

tape('sharding/eip4844 hardfork tests', async (t) => {
  const { teardownCallBack, result } = await startNetwork(network, client, {
    filterKeywords,
    filterOutWords,
    externalRun: process.env.EXTERNAL_RUN,
  })

  if (result.includes('EthereumJS')) {
    t.pass('connected to client')
  } else {
    t.fail('connected to wrong client')
  }

  console.log(`Waiting for network to start...`)
  let syncing = true
  let tries = 0
  while (syncing && tries < 5) {
    tries++
    const res = await client.request('eth_syncing', [])
    if (res.result === false) {
      syncing = false
    } else {
      process.stdout.write('*')
      await sleep(12000)
    }
  }
  if (syncing) {
    t.fail('ethereumjs<>lodestar failed to start')
  } else {
    t.pass('ethereumjs<>lodestar started successfully')
  } /*
  // ------------Sanity checks--------------------------------
  t.test('Simple transfer - sanity check', async (st) => {
    await runTx('', '0x3dA33B9A0894b908DdBb00d96399e506515A1009', 1000000n)
    const balance = await client.request('eth_getBalance', [
      '0x3dA33B9A0894b908DdBb00d96399e506515A1009',
      'latest',
    ])
    st.equal(BigInt(balance.result), 1000000n, 'sent a simple ETH transfer')
    st.end()
  })

  t.test('Simple blob tx', async (st) => {
    const txResult = await runBlobTx(client, 'hello', pkey, '0x3dA33B9A0894b908DdBb00d96399e506515A1009')

    const eth2res = await (await fetch('http://127.0.0.1:9596/eth/v1/beacon/headers')).json()
    const start = parseInt(eth2res.data[0].header.message.slot) - 1
    let eth2kzgs
    for (let i = 0; i < 5; i++) {
      const res = await (
        await fetch(`http://127.0.0.1:9596/eth/v2/beacon/blocks/${start + i}`)
      ).json()
      let done = false

      if (
        res.data.message.body.blob_kzg_commitments !== undefined &&
        res.data.message.body.blob_kzg_commitments.length > 0
      ) {
        done = true
        eth2kzgs = res.data.message.body.blob_kzg_commitments
        break
      }
      while (!done) {
        const current =
          (await (await fetch(`http://127.0.0.1:9596/eth/v1/beacon/headers`)).json()).data[0].header
            .message.slot - 1
        if (current > start + i) {
          done = false
          break
        }
        await sleep(1000)
      }
    }

    st.equal(
      eth2kzgs[0],
      '0x' + txResult.tx.kzgCommitments![0].toString('hex'),
      'found expected blob commitments on CL'
    )
    st.end()
  })
*/
  t.test('data gas fee market tests', async (st) => {
    const txResult = await runBlobTx(
      client,
      'hello',
      pkey,
      '0x3dA33B9A0894b908DdBb00d96399e506515A1009'
    )
    console.log(txResult.receipt)
    const block1 = await client.request(
      'eth_getBlockByHash',
      [txResult.receipt.blockHash, false],
      2.0
    )

    const nextBlock = await client.request(
      'eth_getBlockByNumber',
      [bigIntToHex(BigInt(block1.result.number) + 1n), false],
      2.0
    )
    console.log(nextBlock)
    st.ok(BigInt(nextBlock.result.excessDataGas) > 0n, 'block2 has more data gas consumed')
  })
  t.test('should reset td', async (st) => {
    try {
      await teardownCallBack()
      st.pass('network cleaned')
    } catch (e) {
      st.fail('network not cleaned properly')
    }
    st.end()
  })

  t.end()
})
