import tape from 'tape'
import { Address } from 'ethereumjs-util'
import Blockchain from '@ethereumjs/blockchain'
import { Transaction } from '@ethereumjs/tx'
import { FullSynchronizer } from '../../../lib/sync'
import { startRPC, createManager, createClient, params, baseRequest } from '../helpers'

const method = 'eth_getTransactionCount'

tape(`${method}: call with valid arguments`, async (t) => {
  const blockchain = await Blockchain.create()

  const manager = createManager(createClient({ blockchain, includeVM: true }))
  const server = startRPC(manager.getMethods())

  // a genesis address
  const address = Address.fromString('0xccfd725760a68823ff1e062f4cc97e1360e8d997')

  // verify nonce is 0
  const req = params(method, [address.toString(), 'latest'])
  const expectRes = (res: any) => {
    const msg = 'should return the correct nonce (0)'
    if (res.body.result === '0x0') {
      t.pass(msg)
    } else {
      throw new Error(msg)
    }
  }
  baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: ensure count increments after a tx`, async (t) => {
  const blockchain = await Blockchain.create()

  const client = createClient({ blockchain, includeVM: true })
  const manager = createManager(client)
  const server = startRPC(manager.getMethods())

  const service = client.services.find((s) => s.name === 'eth')
  const vm = (service!.synchronizer as FullSynchronizer).execution.vm

  // a genesis address
  const address = Address.fromString('0xccfd725760a68823ff1e062f4cc97e1360e8d997')

  // construct tx
  const tx = Transaction.fromTxData({ gasLimit: 53000 }, { freeze: false })
  tx.getSenderAddress = () => {
    return address
  }

  await vm.runTx({ tx })

  // verify nonce is incremented to 1
  const req = params(method, [address.toString(), 'latest'])
  const expectRes = (res: any) => {
    const msg = 'should return the correct nonce (1)'
    if (res.body.result === '0x1') {
      t.pass(msg)
    } else {
      throw new Error(msg)
    }
  }
  baseRequest(t, server, req, 200, expectRes)
})
