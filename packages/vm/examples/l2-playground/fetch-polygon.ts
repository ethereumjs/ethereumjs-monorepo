const fetch = require('node-fetch')
import VM from '../../src'
import Common, { CustomChain, Hardfork } from '@ethereumjs/common'
import { Transaction } from '@ethereumjs/tx'
import { Account, Address, toBuffer } from 'ethereumjs-util'
import { BN } from 'ethereumjs-util/dist/externals'
import { Block } from '@ethereumjs/block'
import { mumbaiData } from './polygon-mumbai-data'

const url = 'https://polygon-mumbai.g.alchemy.com/v2/EomkJjyUZ_sLzKWuaExlMwcFQZ-hDpjZ'
export const fetchLastBlock = async () => {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_blockNumber',
      params: [],
      id: 0,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return await response.json()
}

export const fetchBlockInfo = async (blockNumber: string) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBlockByNumber',
        params: ['0x0', true],
        id: 0,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const { result } = await response.json()
    console.log(result)
    console.log('Number of transactions: ', result.transactions.length)
    return result
  } catch (e) {
    console.log('Error on fetchBlockInfo: ', e)
  }
}

const main = async () => {
  try {
    const { result: blockNumber } = await fetchLastBlock()
    const blockData = await fetchBlockInfo(blockNumber)

    const privateKey = Buffer.from('', 'hex')

    const accountAddress = Address.fromPrivateKey(privateKey)

    const common = new Common({
      chain: 'mumbai',
      customChains: [mumbaiData],
    })

    const acctData = {
      nonce: 0,
      balance: new BN(10).pow(new BN(19)), // 10 eth
    }
    const account = Account.fromAccountData(acctData)

    // const common = Common.custom(CustomChain.PolygonMainnet, {
    //   eips: [1559, 2718, 2930],
    //   hardfork: Hardfork.London,
    // })

    // const common = new Common({
    //   eips: [1559, 2718, 2930],
    //   chain: Chain.Mainnet,
    //   hardfork: Hardfork.London,
    // })

    const vm = new VM({ common })
    vm.stateManager.putAccount(accountAddress, account)
    const oneEthInGwei = new BN(1).pow(new BN(9))
    console.log('Address that will sign the transaction: ', account.toString())
    const transaction = new Transaction(
      {
        to: accountAddress.toString(),
        value: toBuffer('0x1'),
        gasLimit: 21_000,
        gasPrice: oneEthInGwei,
      },
      { common }
    )
      .sign(privateKey)
      .toJSON()

    const block = Block.fromBlockData(
      {
        header: {
          number: new BN(1),
          // coinbase,
          // baseFeePerGas: oneEthInGwei,
          gasLimit: 500_000,
        },
        transactions: [transaction],
      },
      {
        common,
      }
    )

    const result = await vm.runBlock({
      block,
      skipBlockValidation: true,
      // generate: true,
      // @ts-ignore
      // root: vm.stateManager._trie.root,
    })

    console.log({ result })
  } catch (e) {
    console.log('Fetch polygon has failed because of: ', e)
  }
}

main().then().catch()
