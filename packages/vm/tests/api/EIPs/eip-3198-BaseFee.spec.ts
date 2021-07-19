import tape from 'tape'
import { Address, BN, privateToAddress } from 'ethereumjs-util'
import VM from '../../../src'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction, TypedTransaction } from '@ethereumjs/tx'
import { Block } from '@ethereumjs/block'
import { InterpreterStep } from '../../../src/evm/interpreter'

const GWEI = new BN('1000000000')
const ETHER = GWEI.mul(GWEI)

const common = new Common({
  eips: [1559, 2718, 2930, 3198],
  chain: Chain.Mainnet,
  hardfork: Hardfork.London,
})

// Small hack to hack in the activation block number
// (Otherwise there would be need for a custom chain only for testing purposes)
common.hardforkBlockBN = function (hardfork: string | undefined) {
  if (hardfork === 'london') {
    return new BN(1)
  } else if (hardfork === 'dao') {
    // Avoid DAO HF side-effects
    return new BN(99)
  }
  return new BN(0)
}

const coinbase = new Address(Buffer.from('11'.repeat(20), 'hex'))
const pkey = Buffer.from('20'.repeat(32), 'hex')
const sender = new Address(privateToAddress(pkey))

/**
 * Creates an EIP1559 block
 * @param baseFee - base fee of the block
 * @param transaction - the transaction in the block
 * @param txType - the txtype to use
 */
function makeBlock(baseFee: BN, transaction: TypedTransaction, txType: number) {
  const signed = transaction.sign(pkey)
  const json = <any>signed.toJSON()
  json.type = txType
  const block = Block.fromBlockData(
    {
      header: {
        number: new BN(1),
        coinbase,
        baseFeePerGas: baseFee,
        gasLimit: 500000,
      },
      transactions: [json],
    },
    { common }
  )
  return block
}

tape('EIP3198 tests', (t) => {
  t.test('test EIP3198 gas fee and correct value', async (st) => {
    // Test taken from the EIP.
    const fee = new BN(7)
    const tx = new FeeMarketEIP1559Transaction(
      {
        maxFeePerGas: GWEI.muln(5),
        maxPriorityFeePerGas: GWEI.muln(2),
        to: undefined, // Create contract
        gasLimit: 210000,
        data: '0x4800',
      },
      {
        common,
      }
    )
    const block = makeBlock(fee, tx, 2)
    const vm = new VM({ common })
    const account = await vm.stateManager.getAccount(sender)
    account.balance = ETHER
    await vm.stateManager.putAccount(sender, account)

    // Track stack

    let stack: any = []
    vm.on('step', (istep: InterpreterStep) => {
      if (istep.opcode.name === 'STOP') {
        stack = istep.stack
      }
    })

    const results = await vm.runTx({
      tx: block.transactions[0],
      block,
    })
    const txBaseFee = block.transactions[0].getBaseFee()
    const gasUsed = results.gasUsed.sub(txBaseFee)
    st.ok(gasUsed.eqn(2), 'gas used correct')
    st.ok(stack[0].eq(fee), 'right item pushed on stack')
    st.end()
  })
})
