import { Block } from '@ethereumjs/block'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { Address, zeros } from '@ethereumjs/util'
import * as tape from 'tape'

import { VM } from '../../../src/vm'

import type { Withdrawal } from '@ethereumjs/block'

const common = new Common({
  chain: Chain.Mainnet,
  hardfork: Hardfork.Merge,
})

const pkey = Buffer.from('20'.repeat(32), 'hex')

tape('EIP4895 tests', (t) => {
  t.test('EIP4895: withdrawals execute as expected', async (st) => {
    const vm = await VM.create({ common })
    vm._common.setEIPs([4895])
    const withdrawals = <Withdrawal[]>[]
    const addresses = ['20'.repeat(20), '30'.repeat(20), '40'.repeat(20)]
    const amounts = [BigInt(1000), BigInt(3000), BigInt(5000)]

    /*
      Setup a contract at the second withdrawal address with code:
        PUSH 2
        PUSH 0
        SSTORE
      If code is ran, this stores "2" at slot "0". Check if withdrawal operations do not invoke this code
    */
    const withdrawalCheckAddress = new Address(Buffer.from('fe'.repeat(20), 'hex'))
    const withdrawalCode = Buffer.from('6002600055')

    await vm.stateManager.putContractCode(withdrawalCheckAddress, withdrawalCode)

    const contractAddress = new Address(Buffer.from('ff'.repeat(20), 'hex'))

    /*
        PUSH <addresses[0]>
        BALANCE // Retrieve balance of addresses[0]
        PUSH 0
        MSTORE // Store balance in memory at pos 0
        PUSH 20
        PUSH 0
        RETURN // Return the balance
    */
    const contract = '73' + addresses[0] + '3160005260206000F3'
    await vm.stateManager.putContractCode(contractAddress, Buffer.from(contract, 'hex'))

    const transaction = FeeMarketEIP1559Transaction.fromTxData({
      to: contractAddress,
      maxFeePerGas: BigInt(7),
      maxPriorityFeePerGas: BigInt(0),
      gasLimit: BigInt(50000),
    }).sign(pkey)

    const account = await vm.stateManager.getAccount(transaction.getSenderAddress())
    account.balance = BigInt(1000000)
    await vm.stateManager.putAccount(transaction.getSenderAddress(), account)

    let index = 0
    for (let i = 0; i < addresses.length; i++) {
      // Just assign any number to validatorIndex as its just for CL convinience
      withdrawals.push({
        index,
        validatorIndex: index,
        address: new Address(Buffer.from(addresses[i], 'hex')),
        amount: amounts[i],
      })
      index++
    }
    const block = Block.fromBlockData(
      {
        header: {
          baseFeePerGas: BigInt(7),
          withdrawalsRoot: Buffer.from(
            'c6595e35232ab8ccf2d9af2a1223446c2e60a01667f348ee156608c8dab7795d',
            'hex'
          ),
          transactionsTrie: Buffer.from(
            '9a744e8acc2886e5809ff013e3b71bf8ec97f9941cafbd7730834fc8f76391ba',
            'hex'
          ),
        },
        transactions: [transaction],
        withdrawals,
      },
      { common: vm._common }
    )

    let result: Buffer
    vm.events.on('afterTx', (e) => {
      result = e.execResult.returnValue
    })

    await vm.runBlock({ block, generate: true })

    for (let i = 0; i < addresses.length; i++) {
      const address = new Address(Buffer.from(addresses[i], 'hex'))
      const amount = amounts[i]
      const balance = (await vm.stateManager.getAccount(address)).balance
      st.equals(BigInt(amount), balance, 'balance ok')
    }

    st.ok(zeros(32).equals(result!), 'withdrawals happen after transactions')

    const slotValue = await vm.stateManager.getContractStorage(withdrawalCheckAddress, zeros(32))
    st.ok(zeros(0).equals(slotValue), 'withdrawals do not invoke code')
  })
})
