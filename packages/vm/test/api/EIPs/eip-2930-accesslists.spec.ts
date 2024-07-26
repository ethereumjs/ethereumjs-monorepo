import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { create2930AccessListTx } from '@ethereumjs/tx'
import {
  Address,
  bytesToHex,
  createAccount,
  createAddressFromPrivateKey,
  hexToBytes,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { VM, runTx } from '../../../src/index.js'

const common = new Common({
  eips: [2718, 2929, 2930],
  chain: Chain.Mainnet,
  hardfork: Hardfork.Berlin,
})

const validAddress = hexToBytes('0x00000000000000000000000000000000000000ff')
const validSlot = hexToBytes(`0x${'00'.repeat(32)}`)

// setup the accounts for this test
const privateKey = hexToBytes('0xe331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109')
const contractAddress = new Address(validAddress)

describe('EIP-2930 Optional Access Lists tests', () => {
  it('VM should charge the right gas when using access list transactions', async () => {
    const access = [
      {
        address: bytesToHex(validAddress),
        storageKeys: [bytesToHex(validSlot)],
      },
    ]
    const txnWithAccessList = create2930AccessListTx(
      {
        accessList: access,
        chainId: BigInt(1),
        gasLimit: BigInt(100000),
        to: contractAddress,
      },
      { common },
    ).sign(privateKey)
    const txnWithoutAccessList = create2930AccessListTx(
      {
        accessList: [],
        chainId: BigInt(1),
        gasLimit: BigInt(100000),
        to: contractAddress,
      },
      { common },
    ).sign(privateKey)

    const vm = await VM.create({ common })

    // contract code PUSH1 0x00 SLOAD STOP
    await vm.stateManager.putCode(contractAddress, hexToBytes('0x60005400'))

    const address = createAddressFromPrivateKey(privateKey)
    const initialBalance = BigInt(10) ** BigInt(18)

    const account = await vm.stateManager.getAccount(address)
    await vm.stateManager.putAccount(
      address,
      createAccount({ ...account, balance: initialBalance }),
    )

    let trace: any = []

    vm.evm.events!.on('step', (o: any) => {
      trace.push([o.opcode.name, o.gasLeft])
    })

    await runTx(vm, { tx: txnWithAccessList })
    assert.ok(trace[1][0] === 'SLOAD')
    let gasUsed = trace[1][1] - trace[2][1]
    assert.equal(gasUsed, 100, 'charge warm sload gas')

    trace = []
    await runTx(vm, { tx: txnWithoutAccessList, skipNonce: true })
    assert.ok(trace[1][0] === 'SLOAD')
    gasUsed = trace[1][1] - trace[2][1]
    assert.equal(gasUsed, 2100, 'charge cold sload gas')
  })
})
