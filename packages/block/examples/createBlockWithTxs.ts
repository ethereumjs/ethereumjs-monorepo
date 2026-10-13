import { createBlock, genTransactionsTrieRoot } from '@ethereumjs/block'
import { Common, Mainnet } from '@ethereumjs/common'
import { createFeeMarket1559Tx } from '@ethereumjs/tx'
import { bytesToHex, createAddressFromString, hexToBytes } from '@ethereumjs/util'

const main = async () => {
  const common = new Common({ chain: Mainnet })
  const privateKey = hexToBytes(
    '0xe331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
  )

  const tx = createFeeMarket1559Tx(
    {
      type: 2,
      nonce: 0n,
      gasLimit: 21_000n,
      maxFeePerGas: 100n,
      maxPriorityFeePerGas: 1n,
      to: createAddressFromString('0xcccccccccccccccccccccccccccccccccccccccc'),
      value: 1n,
    },
    { common },
  ).sign(privateKey)

  const block = createBlock({ transactions: [tx] }, { common, skipConsensusFormatValidation: true })
  const transactionsRoot = await genTransactionsTrieRoot(block.transactions)

  console.log(`Block with ${block.transactions.length} transaction(s)`)
  console.log(`Transactions root: ${bytesToHex(transactionsRoot)}`)
}

void main()
