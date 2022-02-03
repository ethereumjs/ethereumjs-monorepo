import Common, { Chain, CustomChain, Hardfork } from '@ethereumjs/common'
import VM from '../src'
import { Block } from '@ethereumjs/block'
import { FeeMarketEIP1559Transaction, Transaction, TypedTransaction } from '@ethereumjs/tx'
import { Account, Address, toBuffer } from 'ethereumjs-util'
import { BN } from 'ethereumjs-util/dist/externals'

const main = async () => {
  const privateKeyOne = Buffer.from(
    'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
    'hex'
  )

  const privateKeyTwo = Buffer.from(
    '3cd7232cd6f3fc66a57a6bedc1a8ed6c228fff0a327e169c2bcc5e869ed49511',
    'hex'
  )

  const accountOneAddress = Address.fromPrivateKey(privateKeyOne)
  console.log('Account one: ', accountOneAddress.toString())
  const accountTwoAddress = Address.fromPrivateKey(privateKeyTwo)
  console.log('Account two: ', accountTwoAddress.toString())

  const acctData = {
    nonce: 0,
    balance: new BN(1000).pow(new BN(18)), // 100 eth
  }
  const accountOne = Account.fromAccountData(acctData)
  const accountTwo = Account.fromAccountData(acctData)

  try {
    const common = Common.custom(CustomChain.PolygonMainnet, {
      eips: [1559, 2718, 2930],
      hardfork: Hardfork.London,
    })

    // const common = new Common({
    //   eips: [1559, 2718, 2930],
    //   chain: Chain.Mainnet,
    //   hardfork: Hardfork.London,
    // })

    const vm = new VM({ common })
    await vm.stateManager.putAccount(accountOneAddress, accountOne)
    await vm.stateManager.putAccount(accountTwoAddress, accountTwo)

    const coinbase = new Address(Buffer.from('11'.repeat(20), 'hex'))
    const oneEthInGwei = new BN(1).pow(new BN(9))
    const transaction = new FeeMarketEIP1559Transaction(
      {
        to: accountTwoAddress.toString(),
        value: toBuffer(1),
        maxFeePerGas: oneEthInGwei.muln(5),
        maxPriorityFeePerGas: oneEthInGwei.muln(2),
        gasLimit: 21_000,
      },
      {
        common,
      }
    )
      .sign(privateKeyOne)
      .toJSON()

    const accountOneData = await vm.stateManager.getAccount(accountOneAddress)
    console.log(accountOneData.balance.toString())
    //@ts-ignore
    transaction.type = 2

    const blockWithData = Block.fromBlockData(
      {
        header: {
          number: new BN(1),
          coinbase,
          baseFeePerGas: oneEthInGwei,
          gasLimit: 500_000,
        },
        transactions: [transaction],
      },
      {
        common,
      }
    )

    const block = new Block()

    console.log(
      'Account 2 balance: ',
      (await vm.stateManager.getAccount(accountTwoAddress)).balance.toString()
    )
    await vm.runBlock({
      block: blockWithData,
      skipBlockValidation: true,
      // @ts-ignore
      root: vm.stateManager._trie.root,
    })

    console.log(
      'Account 2 balance: ',
      (await vm.stateManager.getAccount(accountTwoAddress)).balance.toString()
    )
  } catch (e) {
    console.log('Error: ', e)
  }
}

main().then().catch()
