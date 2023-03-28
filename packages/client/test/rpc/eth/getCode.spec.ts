import { Block } from '@ethereumjs/block'
import { Blockchain } from '@ethereumjs/blockchain'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { Transaction } from '@ethereumjs/tx'
import { Address } from '@ethereumjs/util'
import * as tape from 'tape'

import { INVALID_PARAMS } from '../../../lib/rpc/error-code'
import { baseRequest, createClient, createManager, params, startRPC } from '../helpers'
import { checkError } from '../util'

import type { FullEthereumService } from '../../../lib/service'

const method = 'eth_getCode'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })

tape(`${method}: call with valid arguments`, async (t) => {
  const blockchain = await Blockchain.create({ common })

  const client = createClient({ blockchain, commonChain: common, includeVM: true })
  const manager = createManager(client)
  const server = startRPC(manager.getMethods())

  const { execution } = client.services.find((s) => s.name === 'eth') as FullEthereumService
  t.notEqual(execution, undefined, 'should have valid execution')
  const { vm } = execution
  await vm.evm.eei.generateCanonicalGenesis(blockchain.genesisState())

  // genesis address
  const address = Address.fromString('0xccfd725760a68823ff1e062f4cc97e1360e8d997')

  // verify code is null
  const req = params(method, [address.toString(), 'latest'])
  const expectRes = (res: any) => {
    const msg = 'should return the correct code'
    t.equal(res.body.result, '0x', msg)
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: ensure returns correct code`, async (t) => {
  const blockchain = await Blockchain.create({
    common,
    validateBlocks: false,
    validateConsensus: false,
  })

  const client = createClient({ blockchain, commonChain: common, includeVM: true })
  const manager = createManager(client)
  const server = startRPC(manager.getMethods())

  const { execution } = client.services.find((s) => s.name === 'eth') as FullEthereumService
  t.notEqual(execution, undefined, 'should have valid execution')
  const { vm } = execution

  // genesis address with balance
  const address = Address.fromString('0xccfd725760a68823ff1e062f4cc97e1360e8d997')

  // sample contract from https://ethereum.stackexchange.com/a/70791
  const data =
    '0x608060405234801561001057600080fd5b506040516020806100ef8339810180604052602081101561003057600080fd5b810190808051906020019092919050505080600081905550506098806100576000396000f3fe6080604052600436106039576000357c010000000000000000000000000000000000000000000000000000000090048063a2a9679914603e575b600080fd5b348015604957600080fd5b5060506066565b6040518082815260200191505060405180910390f35b6000548156fea165627a7a72305820fe2ba3506418c87a075f8f3ae19bc636bd4c18ebde0644bcb45199379603a72c00290000000000000000000000000000000000000000000000000000000000000064'
  const code =
    '0x6080604052600436106039576000357c010000000000000000000000000000000000000000000000000000000090048063a2a9679914603e575b600080fd5b348015604957600080fd5b5060506066565b6040518082815260200191505060405180910390f35b6000548156fea165627a7a72305820fe2ba3506418c87a075f8f3ae19bc636bd4c18ebde0644bcb45199379603a72c0029'

  // construct block with tx
  const gasLimit = 2000000
  const tx = Transaction.fromTxData({ gasLimit, data }, { common, freeze: false })
  tx.getSenderAddress = () => {
    return address
  }
  const parent = await blockchain.getCanonicalHeadHeader()
  const block = Block.fromBlockData(
    {
      header: {
        parentHash: parent.hash(),
        number: 1,
        gasLimit,
      },
    },
    { common, calcDifficultyFromHeader: parent }
  )
  block.transactions[0] = tx

  // deploy contract
  let ranBlock: Block | undefined = undefined
  vm.events.once('afterBlock', (result: any) => (ranBlock = result.block))
  const result = await vm.runBlock({ block, generate: true, skipBlockValidation: true })
  const { createdAddress } = result.results[0]
  await vm.blockchain.putBlock(ranBlock!)

  const expectedContractAddress = Address.generate(address, BigInt(0))
  t.ok(
    createdAddress!.equals(expectedContractAddress),
    'should match the expected contract address'
  )

  // verify contract has code
  const req = params(method, [expectedContractAddress.toString(), 'latest'])
  const expectRes = (res: any) => {
    const msg = 'should return the correct code'
    t.equal(res.body.result, code, msg)
  }
  await baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: call with unsupported block argument`, async (t) => {
  const blockchain = await Blockchain.create()

  const client = createClient({ blockchain, includeVM: true })
  const manager = createManager(client)
  const server = startRPC(manager.getMethods())

  const req = params(method, ['0xccfd725760a68823ff1e062f4cc97e1360e8d997', 'pending'])
  const expectRes = checkError(t, INVALID_PARAMS, '"pending" is not yet supported')
  await baseRequest(t, server, req, 200, expectRes)
})
