import { Address } from '@ethereumjs/util'
import { CloudflareProvider } from '@ethersproject/providers'
import * as tape from 'tape'
import { EthersStateManager } from '../src/ethersStateManager'

const provider = new CloudflareProvider()

tape('Ethers State Manager tests', async (t) => {
  const state = new EthersStateManager({ provider: provider })
  const account = await state.getAccount(
    Address.fromString('0xd8da6bf26964af9d7eed9e03e53415d37aa96045')
  )
  t.ok(account.nonce > 0n, 'Vitalik.eth returned a valid nonce')

  const doesThisAccountExist = await state.accountExists(
    Address.fromString('0xccAfdD642118E5536024675e776d32413728DD07')
  )
  t.ok(!doesThisAccountExist, 'accountExists returns false for non-existent account')
})
