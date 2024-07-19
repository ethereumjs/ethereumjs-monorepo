import { Common, Chain, Hardfork } from '@ethereumjs/common'
import { Block, createBlockFromBlockData } from '@ethereumjs/block'
import { BlobEIP4844Transaction } from '@ethereumjs/tx'
import { Address } from '@ethereumjs/util'
import { loadKZG } from 'kzg-wasm'
import { randomBytes } from 'crypto'

const main = async () => {
  const kzg = await loadKZG()

  const common = new Common({
    chain: Chain.Mainnet,
    hardfork: Hardfork.Cancun,
    customCrypto: {
      kzg,
    },
  })
  const blobTx = txFromTxData.BlobEIP4844Transaction(
    { blobsData: ['myFirstBlob'], to: Address.fromPrivateKey(randomBytes(32)) },
    { common }
  )

  const block = createBlockFromBlockData(
    {
      header: {
        excessBlobGas: 0n,
      },
      transactions: [blobTx],
    },
    {
      common,
      skipConsensusFormatValidation: true,
    }
  )

  console.log(
    `4844 block header with excessBlobGas=${block.header.excessBlobGas} created and ${
      block.transactions.filter((tx) => tx.type === 3).length
    } blob transactions`
  )
}

main()
