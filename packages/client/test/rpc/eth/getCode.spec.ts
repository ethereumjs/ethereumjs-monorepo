import tape from 'tape'
import { Address, BN } from 'ethereumjs-util'
import Blockchain from '@ethereumjs/blockchain'
import { Transaction } from '@ethereumjs/tx'
import { FullSynchronizer } from '../../../lib/sync'
import { startRPC, createManager, createClient, params, baseRequest } from '../helpers'

const method = 'eth_getCode'

tape(`${method}: call with valid arguments`, async (t) => {
  const blockchain = await Blockchain.create()

  const client = createClient({ blockchain, includeVM: true })
  const manager = createManager(client)
  const server = startRPC(manager.getMethods())

  // genesis address
  const address = Address.fromString('0xccfd725760a68823ff1e062f4cc97e1360e8d997')

  // verify code is null
  const req = params(method, [address.toString(), 'latest'])
  const expectRes = (res: any) => {
    const msg = 'should return the correct code'
    if (res.body.result === '0x') {
      t.pass(msg)
    } else {
      throw new Error(msg)
    }
  }
  baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: ensure returns correct code`, async (t) => {
  const blockchain = await Blockchain.create()

  const client = createClient({ blockchain, includeVM: true })
  const manager = createManager(client)
  const server = startRPC(manager.getMethods())

  const service = client.services.find((s) => s.name === 'eth')
  const vm = (service!.synchronizer as FullSynchronizer).execution.vm

  // genesis address with balance
  const address = Address.fromString('0xccfd725760a68823ff1e062f4cc97e1360e8d997')

  // sample contract from https://ethereum.stackexchange.com/a/70791
  const data =
    '0x608060405234801561001057600080fd5b506040516020806100ef8339810180604052602081101561003057600080fd5b810190808051906020019092919050505080600081905550506098806100576000396000f3fe6080604052600436106039576000357c010000000000000000000000000000000000000000000000000000000090048063a2a9679914603e575b600080fd5b348015604957600080fd5b5060506066565b6040518082815260200191505060405180910390f35b6000548156fea165627a7a72305820fe2ba3506418c87a075f8f3ae19bc636bd4c18ebde0644bcb45199379603a72c00290000000000000000000000000000000000000000000000000000000000000064'
  const code =
    '0x6080604052600436106039576000357c010000000000000000000000000000000000000000000000000000000090048063a2a9679914603e575b600080fd5b348015604957600080fd5b5060506066565b6040518082815260200191505060405180910390f35b6000548156fea165627a7a72305820fe2ba3506418c87a075f8f3ae19bc636bd4c18ebde0644bcb45199379603a72c0029'

  // construct tx
  const tx = Transaction.fromTxData({ gasLimit: 2000000, data }, { freeze: false })
  tx.getSenderAddress = () => {
    return address
  }

  const { createdAddress } = await vm.runTx({ tx })

  const expectedContractAddress = Address.generate(address, new BN(0))
  t.ok(
    createdAddress?.equals(expectedContractAddress),
    'should match the expected contract address'
  )

  // verify contract has code
  const req = params(method, [expectedContractAddress.toString(), 'latest'])
  const expectRes = (res: any) => {
    const msg = 'should return the correct code'
    if (res.body.result === code) {
      t.pass(msg)
    } else {
      throw new Error(msg)
    }
  }
  baseRequest(t, server, req, 200, expectRes)
})
