import { Address } from '@ethereumjs/util'
import { randomBytes } from 'crypto'
import { Client } from 'jayson/promise'
const clientPort = process.argv[2]
const input = process.argv[3]

const pkey = Buffer.from('45a915e4d060149eb4365960e6a7a45f334393093061116b197e3240065ff2d8', 'hex')
const sender = Address.fromPrivateKey(pkey)

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function getNonce(client: Client, account: string) {
  const nonce = await client.request('eth_getTransactionCount', [account, 'latest'], 2.0)
  return nonce.result
}
void run(input)
