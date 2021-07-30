import tape from 'tape'
import { Account, Address, BN, bufferToHex } from 'ethereumjs-util'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import VM from '../../../src'
import { AccessListEIP2930Transaction } from '@ethereumjs/tx'

const common = new Common({
  eips: [2718, 2929, 2930],
  chain: Chain.Mainnet,
  hardfork: Hardfork.Berlin,
})

const validAddress = Buffer.from('00000000000000000000000000000000000000ff', 'hex')
const validSlot = Buffer.from('00'.repeat(32), 'hex')

// setup the accounts for this test
const privateKey = Buffer.from(
  'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
  'hex'
)
const contractAddress = new Address(validAddress)

tape('EIP-2930 Optional Access Lists tests', (t) => {
  t.test('VM should charge the right gas when using access list transactions', async (st) => {
    const access = [
      {
        address: bufferToHex(validAddress),
        storageKeys: [bufferToHex(validSlot)],
      },
    ]
    const txnWithAccessList = AccessListEIP2930Transaction.fromTxData(
      {
        accessList: access,
        chainId: 1,
        gasLimit: 100000,
        to: contractAddress,
      },
      { common }
    ).sign(privateKey)
    const txnWithoutAccessList = AccessListEIP2930Transaction.fromTxData(
      {
        accessList: [],
        chainId: 1,
        gasLimit: 100000,
        to: contractAddress,
      },
      { common }
    ).sign(privateKey)
    const vm = new VM({ common })

    // contract code PUSH1 0x00 SLOAD STOP
    await vm.stateManager.putContractCode(contractAddress, Buffer.from('60005400', 'hex'))

    const address = Address.fromPrivateKey(privateKey)
    const initialBalance = new BN(10).pow(new BN(18))

    const account = await vm.stateManager.getAccount(address)
    await vm.stateManager.putAccount(
      address,
      Account.fromAccountData({ ...account, balance: initialBalance })
    )

    let trace: any = []

    vm.on('step', (o: any) => {
      trace.push([o.opcode.name, o.gasLeft])
    })

    await vm.runTx({ tx: txnWithAccessList })
    st.ok(trace[1][0] == 'SLOAD')
    let gasUsed = trace[1][1].sub(trace[2][1]).toNumber()
    st.equal(gasUsed, 100, 'charge warm sload gas')

    trace = []
    await vm.runTx({ tx: txnWithoutAccessList, skipNonce: true })
    st.ok(trace[1][0] == 'SLOAD')
    gasUsed = trace[1][1].sub(trace[2][1]).toNumber()
    st.equal(gasUsed, 2100, 'charge cold sload gas')

    st.end()
  })
})
