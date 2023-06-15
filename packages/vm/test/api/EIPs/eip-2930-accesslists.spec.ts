import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { AccessListEIP2930Transaction } from '@ethereumjs/tx'
import { Account, Address, bytesToHex } from '@ethereumjs/util'
import { hexToBytes } from 'ethereum-cryptography/utils'
import { assert, describe, it } from 'vitest'

import { VM } from '../../../src/vm'

const common = new Common({
  eips: [2718, 2929, 2930],
  chain: Chain.Mainnet,
  hardfork: Hardfork.Berlin,
})

const validAddress = hexToBytes('00000000000000000000000000000000000000ff')
const validSlot = hexToBytes('00'.repeat(32))

// setup the accounts for this test
const privateKey = hexToBytes('e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109')
const contractAddress = new Address(validAddress)

describe('EIP-2930 Optional Access Lists tests', () => {
  it('VM should charge the right gas when using access list transactions', async () => {
    const access = [
      {
        address: bytesToHex(validAddress),
        storageKeys: [bytesToHex(validSlot)],
      },
    ]
    const txnWithAccessList = AccessListEIP2930Transaction.fromTxData(
      {
        accessList: access,
        chainId: BigInt(1),
        gasLimit: BigInt(100000),
        to: contractAddress,
      },
      { common }
    ).sign(privateKey)
    const txnWithoutAccessList = AccessListEIP2930Transaction.fromTxData(
      {
        accessList: [],
        chainId: BigInt(1),
        gasLimit: BigInt(100000),
        to: contractAddress,
      },
      { common }
    ).sign(privateKey)

    const vm = await VM.create({ common })

    // contract code PUSH1 0x00 SLOAD STOP
    await vm.stateManager.putContractCode(contractAddress, hexToBytes('60005400'))

    const address = Address.fromPrivateKey(privateKey)
    const initialBalance = BigInt(10) ** BigInt(18)

    const account = await vm.stateManager.getAccount(address)
    await vm.stateManager.putAccount(
      address,
      Account.fromAccountData({ ...account, balance: initialBalance })
    )

    let trace: any = []

    vm.evm.events!.on('step', (o: any) => {
      trace.push([o.opcode.name, o.gasLeft])
    })

    await vm.runTx({ tx: txnWithAccessList })
    assert.ok(trace[1][0] === 'SLOAD')
    let gasUsed = trace[1][1] - trace[2][1]
    assert.equal(gasUsed, BigInt(100), 'charge warm sload gas')

    trace = []
    await vm.runTx({ tx: txnWithoutAccessList, skipNonce: true })
    assert.ok(trace[1][0] === 'SLOAD')
    gasUsed = trace[1][1] - trace[2][1]
    assert.equal(gasUsed, BigInt(2100), 'charge cold sload gas')
  })
})
