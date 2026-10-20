import { Common, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import { bytesToHex } from '@ethereumjs/util'
import { Wallet } from '@ethereumjs/wallet'

const main = async () => {
  const wallet = Wallet.generate()
  const common = new Common({ chain: Mainnet })

  const tx = createLegacyTx(
    {
      nonce: 0,
      gasPrice: 100n,
      gasLimit: 21_000n,
      to: '0x0000000000000000000000000000000000000000',
      value: 0n,
    },
    { common },
  )

  const signed = tx.sign(wallet.getPrivateKey())
  console.log(`Signer: ${wallet.getAddressString()}`)
  console.log(`Tx hash: ${bytesToHex(signed.hash())}`)
}

void main()
