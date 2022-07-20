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

  const UNIContractCode = await state.getContractCode(
    Address.fromString('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984')
  )
  t.ok(UNIContractCode.length > 0, 'was able to retrieve UNI contract code')

  const storageSlot = await state.getContractStorage(
    Address.fromString('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'),
    Buffer.from('1', 'hex')
  )
  t.ok(storageSlot.length > 0, 'was able to retrieve storage slot 1 for the UNI contract')
})
