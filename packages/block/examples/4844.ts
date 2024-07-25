import { createBlockFromBlockData } from '@ethereumjs/block'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { create4844BlobTx } from '@ethereumjs/tx'
import { Address } from '@ethereumjs/util'
import { randomBytes } from 'crypto'
import { loadKZG } from 'kzg-wasm'

const main = async () => {
  const kzg = await loadKZG()

  const common = new Common({
    chain: Chain.Mainnet,
    hardfork: Hardfork.Cancun,
    customCrypto: {
      kzg,
    },
  })
  const blobTx = create4844BlobTx(
    { blobsData: ['myFirstBlob'], to: Address.fromPrivateKey(randomBytes(32)) },
    { common },
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
    },
  )

  console.log(
    `4844 block header with excessBlobGas=${block.header.excessBlobGas} created and ${
      block.transactions.filter((tx) => tx.type === 3).length
    } blob transactions`,
  )
}

void main()
