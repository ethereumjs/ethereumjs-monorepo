import * as tape from 'tape'
import { FeeMarketEIP1559Transaction, Transaction } from '@ethereumjs/tx'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { toBuffer } from '@ethereumjs/util'
import { INTERNAL_ERROR, INVALID_PARAMS, PARSE_ERROR } from '../../../lib/rpc/error-code'
import { baseSetup, params, baseRequest } from '../helpers'
import { checkError } from '../util'
import { FullEthereumService } from '../../../lib/service'

const method = 'eth_sendRawTransaction'

tape(`${method}: call with valid arguments`, async (t) => {
  const syncTargetHeight = new Common({ chain: Chain.Mainnet }).hardforkBlock(Hardfork.London)
  const { server, client } = baseSetup({ syncTargetHeight, includeVM: true })

  // Mainnet EIP-1559 tx
  const txData =
    '0x02f90108018001018402625a0094cccccccccccccccccccccccccccccccccccccccc830186a0b8441a8451e600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f85bf859940000000000000000000000000000000000000101f842a00000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000060a701a0afb6e247b1c490e284053c87ab5f6b59e219d51f743f7a4d83e400782bc7e4b9a0479a268e0e0acd4de3f1e28e4fac2a6b32a4195e8dfa9d19147abe8807aa6f64'
  const transaction = FeeMarketEIP1559Transaction.fromSerializedTx(
    Buffer.from(txData.slice(2), 'hex')
  )
  const address = transaction.getSenderAddress()
  const vm = (client.services.find((s) => s.name === 'eth') as FullEthereumService).execution.vm

  const account = await vm.stateManager.getAccount(address)
  account.balance = BigInt('40100000')
  await vm.stateManager.putAccount(address, account)

  const req = params(method, [txData])
  const expectRes = (res: any) => {
    const msg = 'should return the correct tx hash'
    t.equal(
      res.body.result,
      '0xd7217a7d3251880051783f305a3536e368c604aa1f1602e6cd107eb7b87129da',
      msg
    )
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: send local tx with gasprice lower than minimum`, async (t) => {
  const syncTargetHeight = new Common({ chain: Chain.Mainnet }).hardforkBlock(Hardfork.London)
  const { server } = baseSetup({ syncTargetHeight, includeVM: true })

  const transaction = Transaction.fromTxData({
    gasLimit: 21000,
    gasPrice: 0,
    nonce: 0,
  }).sign(Buffer.from('42'.repeat(32), 'hex'))

  const txData = '0x' + transaction.serialize().toString('hex')

  const req = params(method, [txData])
  const expectRes = (res: any) => {
    t.equal(
      res.body.result,
      '0xf6798d5ed936a464ef4f49dd5a3abe1ad6947364912bd47c5e56781125d44ac3',
      'local tx with lower gasprice than minimum gasprice added to pool'
    )
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid arguments: not enough balance`, async (t) => {
  const syncTargetHeight = new Common({ chain: Chain.Mainnet }).hardforkBlock(Hardfork.London)
  const { server } = baseSetup({ syncTargetHeight, includeVM: true })

  // Mainnet EIP-1559 tx
  const txData =
    '0x02f90108018001018402625a0094cccccccccccccccccccccccccccccccccccccccc830186a0b8441a8451e600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f85bf859940000000000000000000000000000000000000101f842a00000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000060a701a0afb6e247b1c490e284053c87ab5f6b59e219d51f743f7a4d83e400782bc7e4b9a0479a268e0e0acd4de3f1e28e4fac2a6b32a4195e8dfa9d19147abe8807aa6f64'

  const req = params(method, [txData])
  const expectRes = checkError(t, INVALID_PARAMS, 'insufficient balance')
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with sync target height not set yet`, async (t) => {
  const { server } = baseSetup()

  // Mainnet EIP-1559 tx
  const txData =
    '0x02f90108018001018402625a0094cccccccccccccccccccccccccccccccccccccccc830186a0b8441a8451e600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f85bf859940000000000000000000000000000000000000101f842a00000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000060a701a0afb6e247b1c490e284053c87ab5f6b59e219d51f743f7a4d83e400782bc7e4b9a0479a268e0e0acd4de3f1e28e4fac2a6b32a4195e8dfa9d19147abe8807aa6f64'
  const req = params(method, [txData])

  const expectRes = checkError(
    t,
    INTERNAL_ERROR,
    'client is not aware of the current chain height yet (give sync some more time)'
  )
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with invalid tx (wrong chain ID)`, async (t) => {
  const syncTargetHeight = new Common({ chain: Chain.Mainnet }).hardforkBlock(Hardfork.London)
  const { server } = baseSetup({ syncTargetHeight, includeVM: true })

  // Baikal EIP-1559 tx
  const txData =
    '0x02f9010a82066a8001018402625a0094cccccccccccccccccccccccccccccccccccccccc830186a0b8441a8451e600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f85bf859940000000000000000000000000000000000000101f842a00000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000060a701a0afb6e247b1c490e284053c87ab5f6b59e219d51f743f7a4d83e400782bc7e4b9a0479a268e0e0acd4de3f1e28e4fac2a6b32a4195e8dfa9d19147abe8807aa6f64'
  const req = params(method, [txData])

  const expectRes = checkError(t, PARSE_ERROR, 'serialized tx data could not be parsed')
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with unsigned tx`, async (t) => {
  const syncTargetHeight = new Common({ chain: Chain.Mainnet }).hardforkBlock(Hardfork.London)
  const { server } = baseSetup({ syncTargetHeight })

  // Mainnet EIP-1559 tx
  const txData =
    '0x02f90108018001018402625a0094cccccccccccccccccccccccccccccccccccccccc830186a0b8441a8451e600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f85bf859940000000000000000000000000000000000000101f842a00000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000060a701a0afb6e247b1c490e284053c87ab5f6b59e219d51f743f7a4d83e400782bc7e4b9a0479a268e0e0acd4de3f1e28e4fac2a6b32a4195e8dfa9d19147abe8807aa6f64'
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })
  const tx = FeeMarketEIP1559Transaction.fromSerializedTx(toBuffer(txData), {
    common,
    freeze: false,
  })
  ;(tx as any).v = undefined
  ;(tx as any).r = undefined
  ;(tx as any).s = undefined
  const txHex = '0x' + tx.serialize().toString('hex')
  const req = params(method, [txHex])

  const expectRes = checkError(t, INVALID_PARAMS, 'tx needs to be signed')
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with no peers`, async (t) => {
  const syncTargetHeight = new Common({ chain: Chain.Mainnet }).hardforkBlock(Hardfork.London)
  const { server, client } = baseSetup({ syncTargetHeight, includeVM: true, noPeers: true })

  // Mainnet EIP-1559 tx
  const txData =
    '0x02f90108018001018402625a0094cccccccccccccccccccccccccccccccccccccccc830186a0b8441a8451e600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f85bf859940000000000000000000000000000000000000101f842a00000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000060a701a0afb6e247b1c490e284053c87ab5f6b59e219d51f743f7a4d83e400782bc7e4b9a0479a268e0e0acd4de3f1e28e4fac2a6b32a4195e8dfa9d19147abe8807aa6f64'
  const transaction = FeeMarketEIP1559Transaction.fromSerializedTx(
    Buffer.from(txData.slice(2), 'hex')
  )
  const address = transaction.getSenderAddress()
  const vm = (client.services.find((s) => s.name === 'eth') as FullEthereumService).execution.vm

  const account = await vm.stateManager.getAccount(address)
  account.balance = BigInt('40100000')
  await vm.stateManager.putAccount(address, account)

  const req = params(method, [txData])

  const expectRes = checkError(t, INTERNAL_ERROR, 'no peer connection available')
  await baseRequest(t, server, req, 200, expectRes)
})
