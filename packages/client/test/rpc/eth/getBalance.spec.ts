import tape from 'tape'
import { Address, BN, toBuffer } from 'ethereumjs-util'
import Blockchain from '@ethereumjs/blockchain'
import { Transaction } from '@ethereumjs/tx'
import { FullSynchronizer } from '../../../lib/sync'
import { startRPC, createManager, createClient, params, baseRequest } from '../helpers'

const method = 'eth_getBalance'

tape(`${method}: call with valid arguments`, async (t) => {
  const blockchain = await Blockchain.create()

  const client = createClient({ blockchain, includeVM: true })
  const manager = createManager(client)
  const server = startRPC(manager.getMethods())

  // since synchronizer.run() is not executed in the mock setup,
  // manually run stateManager.generateCanonicalGenesis()
  const vm = (client.services[0].synchronizer as FullSynchronizer).execution.vm
  await vm.stateManager.generateCanonicalGenesis()

  // genesis address with balance
  const address = Address.fromString('0xccfd725760a68823ff1e062f4cc97e1360e8d997')

  // verify balance is genesis amount
  const req = params(method, [address.toString(), 'latest'])
  const expectRes = (res: any) => {
    const msg = 'should return the correct balance'
    if (res.body.result === '0x15ac56edc4d12c0000') {
      t.pass(msg)
    } else {
      throw new Error(msg)
    }
  }
  baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: ensure balance deducts after a tx`, async (t) => {
  const blockchain = await Blockchain.create()

  const client = createClient({ blockchain, includeVM: true })
  const manager = createManager(client)
  const server = startRPC(manager.getMethods())

  const service = client.services.find((s) => s.name === 'eth')
  const vm = (service!.synchronizer as FullSynchronizer).execution.vm

  // since synchronizer.run() is not executed in the mock setup,
  // manually run stateManager.generateCanonicalGenesis()
  await vm.stateManager.generateCanonicalGenesis()

  // genesis address with balance
  const address = Address.fromString('0xccfd725760a68823ff1e062f4cc97e1360e8d997')

  // construct tx
  const tx = Transaction.fromTxData({ gasLimit: 53000 }, { freeze: false })
  tx.getSenderAddress = () => {
    return address
  }

  const { amountSpent } = await vm.runTx({ tx })

  // verify balance is genesis amount minus amountSpent
  const genesisBalance = new BN(toBuffer('0x15ac56edc4d12c0000'))
  const expectedNewBalance = genesisBalance.sub(amountSpent)
  const req = params(method, [address.toString(), 'latest'])
  const expectRes = (res: any) => {
    const msg = 'should return the correct balance'
    const resultBN = new BN(toBuffer(res.body.result))
    if (resultBN.eq(expectedNewBalance)) {
      t.pass(msg)
    } else {
      throw new Error(msg)
    }
  }
  baseRequest(t, server, req, 200, expectRes)
})
