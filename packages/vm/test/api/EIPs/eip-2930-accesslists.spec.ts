import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createAccessList2930Tx } from '@ethereumjs/tx'
import {
  Address,
  bytesToHex,
  createAccount,
  createAddressFromPrivateKey,
  hexToBytes,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { SIGNER_A } from '@ethereumjs/testdata'
import { createVM, runTx } from '../../../src/index.ts'

import type { InterpreterStep } from '@ethereumjs/evm'

const common = new Common({
  eips: [2718, 2929, 2930],
  chain: Mainnet,
  hardfork: Hardfork.Berlin,
})

const validAddress = hexToBytes('0x00000000000000000000000000000000000000ff')
const validSlot = hexToBytes(`0x${'00'.repeat(32)}`)

// setup the accounts for this test
const contractAddress = new Address(validAddress)

describe('EIP-2930 Optional Access Lists tests', () => {
  it('VM should charge the right gas when using access list transactions', async () => {
    const access = [
      {
        address: bytesToHex(validAddress),
        storageKeys: [bytesToHex(validSlot)],
      },
    ]
    const txnWithAccessList = createAccessList2930Tx(
      {
        accessList: access,
        chainId: BigInt(1),
        gasLimit: BigInt(100000),
        to: contractAddress,
      },
      { common },
    ).sign(SIGNER_A.privateKey)
    const txnWithoutAccessList = createAccessList2930Tx(
      {
        accessList: [],
        chainId: BigInt(1),
        gasLimit: BigInt(100000),
        to: contractAddress,
      },
      { common },
    ).sign(SIGNER_A.privateKey)

    const vm = await createVM({ common })

    // contract code PUSH1 0x00 SLOAD STOP
    await vm.stateManager.putCode(contractAddress, hexToBytes('0x60005400'))

    const address = createAddressFromPrivateKey(SIGNER_A.privateKey)
    const initialBalance = BigInt(10) ** BigInt(18)

    const account = await vm.stateManager.getAccount(address)
    await vm.stateManager.putAccount(
      address,
      createAccount({ ...account, balance: initialBalance }),
    )

    let trace: Array<[string, bigint]> = []

    const handler = (o: InterpreterStep) => {
      trace.push([o.opcode.name, o.gasLeft])
    }
    vm.evm.events!.on('step', handler)

    await runTx(vm, { tx: txnWithAccessList })
    assert.strictEqual(trace[1][0], 'SLOAD')
    let gasUsed = trace[1][1] - trace[2][1]
    assert.strictEqual(Number(gasUsed), 100, 'charge warm sload gas')

    trace = []
    await runTx(vm, { tx: txnWithoutAccessList, skipNonce: true })
    assert.strictEqual(trace[1][0], 'SLOAD')
    gasUsed = trace[1][1] - trace[2][1]
    assert.strictEqual(Number(gasUsed), 2100, 'charge cold sload gas')
    vm.evm.events!.removeListener('step', handler)
  })
})
