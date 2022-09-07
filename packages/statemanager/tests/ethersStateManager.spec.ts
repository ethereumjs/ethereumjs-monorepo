import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { Address, bigIntToBuffer, bigIntToHex, bufferToHex, setLengthLeft } from '@ethereumjs/util'
import { VM } from '@ethereumjs/vm'
import { CloudflareProvider, JsonRpcProvider } from '@ethersproject/providers'
import * as tape from 'tape'

import { EthersStateManager } from '../src/ethersStateManager'

import { MockProvider } from './testdata/providerData/mockProvider'

import type { Proof } from '../src'

tape('Ethers State Manager API tests', async (t) => {
  const provider =
    process.env.PROVIDER !== undefined ? new CloudflareProvider() : new MockProvider()
  const state = new EthersStateManager({ provider })
  const vitalikDotEth = Address.fromString('0xd8da6bf26964af9d7eed9e03e53415d37aa96045')
  const account = await state.getAccount(vitalikDotEth)
  t.ok(account.nonce > 0n, 'Vitalik.eth returned a valid nonce')

  await state.putAccount(vitalikDotEth, account)

  t.ok((state as any)._cache.get(vitalikDotEth).nonce > 0, 'Vitalik.eth is stored in accountCache')
  const doesThisAccountExist = await state.accountExists(
    Address.fromString('0xccAfdD642118E5536024675e776d32413728DD07')
  )
  t.ok(!doesThisAccountExist, 'accountExists returns false for non-existent account')

  t.ok(state.accountExists(vitalikDotEth), 'vitalik.eth does exist')
  const UNIerc20ContractAddress = Address.fromString('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984')
  const UNIContractCode = await state.getContractCode(UNIerc20ContractAddress)

  t.ok(UNIContractCode.length > 0, 'was able to retrieve UNI contract code')

  await state.putContractCode(UNIerc20ContractAddress, UNIContractCode)

  t.ok(
    typeof (state as any).contractCache.get(UNIerc20ContractAddress.toString()) !== 'undefined',
    'UNI ERC20 contract code was found in cache'
  )
  const storageSlot = await state.getContractStorage(
    UNIerc20ContractAddress,
    setLengthLeft(bigIntToBuffer(1n), 32)
  )
  t.ok(storageSlot.length > 0, 'was able to retrieve storage slot 1 for the UNI contract')

  t.end()
})

tape('runTx tests', async (t) => {
  const common = new Common({ chain: Chain.Mainnet })
  const provider =
    process.env.PROVIDER !== undefined ? new CloudflareProvider() : new MockProvider()
  const state = new EthersStateManager({ provider })
  const vm = await VM.create({ common, stateManager: state })

  const vitalikDotEth = Address.fromString('0xd8da6bf26964af9d7eed9e03e53415d37aa96045')
  const privateKey = Buffer.from(
    'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
    'hex'
  )
  const tx = FeeMarketEIP1559Transaction.fromTxData(
    { to: vitalikDotEth, value: '0x100', gasLimit: 500000n, maxFeePerGas: 7 },
    { common }
  ).sign(privateKey)

  const result = await vm.runTx({
    skipBalance: true,
    skipNonce: true,
    tx,
  })

  t.equal(result.totalGasSpent, 21000n, 'sent some ETH to vitalik.eth')
  t.end()
})

/** To run the block test with an actual provider, you will need a provider URL (like alchemy or infura) that provides access to an archive node.
 *  Pass it in the PROVIDER=[provider url] npm run tape -- 'tests/ethersStateManager.spec.ts'
 *  Note: Cloudflare only provides access to the last 128 blocks on these tests so will fail on these tests.
 */

tape('runBlock test', async (t) => {
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
  const provider =
    process.env.PROVIDER !== undefined
      ? new JsonRpcProvider(process.env.PROVIDER)
      : new MockProvider()
  const blockTag = 500000n
  const state = new EthersStateManager({
    provider,
    // Set the state manager to look at the state of the chain before the block has been executed
    blockTag: blockTag - 1n,
  })

  const vm = await VM.create({ common, stateManager: state })
  const previousStateRoot = Buffer.from(
    (
      await provider.send('eth_getBlockByNumber', [bigIntToHex(blockTag - 1n), true])
    ).stateRoot.slice(2),
    'hex'
  )

  const block = await state.getBlockFromProvider(blockTag, common)
  try {
    const res = await vm.runBlock({
      block,
      root: previousStateRoot,
      generate: true,
      skipHeaderValidation: true,
    })

    t.equal(
      bufferToHex(res.stateRoot),
      bufferToHex(block.header.stateRoot),
      'was able to run block and computed correct state root'
    )
  } catch (err) {
    console.log(err)
  }

  const proof = (await provider.send('eth_getProof', [
    block.header.coinbase.toString(),
    [],
    bigIntToHex(block.header.number),
  ])) as Proof
  const localproof = await state.getProof(block.header.coinbase)

  for (let j = 0; j < proof.accountProof.length; j++) {
    t.deepEqual(
      localproof.accountProof[j],
      proof.accountProof[j],
      'proof nodes for account match proof from provider'
    )
  }
  t.end()
})
