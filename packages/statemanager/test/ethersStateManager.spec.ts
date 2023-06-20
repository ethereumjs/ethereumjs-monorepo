import { Block } from '@ethereumjs/block'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction, TransactionFactory } from '@ethereumjs/tx'
import {
  Account,
  Address,
  bigIntToBytes,
  equalsBytes,
  hexStringToBytes,
  setLengthLeft,
  utf8ToBytes,
} from '@ethereumjs/util'
import { VM } from '@ethereumjs/vm'
import { ethers } from 'ethers'
import { assert, describe, it } from 'vitest'

import { EthersStateManager } from '../src/ethersStateManager.js'

import * as blockData from './testdata/providerData/blocks/block0x7a120.json'
import { MockProvider } from './testdata/providerData/mockProvider.js'
import * as txData from './testdata/providerData/transactions/0xed1960aa7d0d7b567c946d94331dddb37a1c67f51f30bf51f256ea40db88cfb0.json'

// Hack to detect if running in browser or not
const isBrowser = new Function('try {return this===window;}catch(e){ return false;}')

// To run the tests with a live provider, set the PROVIDER environmental variable with a valid provider url
// from Infura/Alchemy or your favorite web3 provider when running the test.  Below is an example command:
// `PROVIDER=https://mainnet.infura.io/v3/[mySuperS3cretproviderKey] npm run tape -- 'test/ethersStateManager.spec.ts'
describe('Ethers State Manager initialization tests', () => {
  it('should work', () => {
    const provider = new MockProvider()
    let state = new EthersStateManager({ provider, blockTag: 1n })
    assert.ok(
      state instanceof EthersStateManager,
      'was able to instantiate state manager with JsonRpcProvider subclass'
    )
    assert.equal((state as any).blockTag, '0x1', 'State manager starts with default block tag of 1')

    state = new EthersStateManager({ provider, blockTag: 1n })
    assert.equal(
      (state as any).blockTag,
      '0x1',
      'State Manager instantiated with predefined blocktag'
    )

    state = new EthersStateManager({ provider: 'https://google.com', blockTag: 1n })
    assert.ok(
      state instanceof EthersStateManager,
      'was able to instantiate state manager with valid url'
    )

    const invalidProvider = new ethers.SocketProvider('mainnet')
    assert.throws(
      () => new EthersStateManager({ provider: invalidProvider as any, blockTag: 1n }),
      undefined,
      undefined,
      'cannot instantiate state manager with invalid provider'
    )
  })
})

describe('Ethers State Manager API tests', () => {
  it('should work', async () => {
    if (isBrowser() === true) {
      // The `MockProvider` is not able to load JSON files dynamically in browser so skipped in browser tests
    } else {
      const provider =
        process.env.PROVIDER !== undefined
          ? new ethers.JsonRpcProvider(process.env.PROVIDER, 1)
          : new MockProvider()
      const state = new EthersStateManager({ provider, blockTag: 1n })
      const vitalikDotEth = Address.fromString('0xd8da6bf26964af9d7eed9e03e53415d37aa96045')
      const account = await state.getAccount(vitalikDotEth)
      assert.ok(account!.nonce > 0n, 'Vitalik.eth returned a valid nonce')

      await state.putAccount(vitalikDotEth, account!)

      const retrievedVitalikAccount = Account.fromRlpSerializedAccount(
        (state as any)._accountCache.get(vitalikDotEth)!.accountRLP
      )

      assert.ok(retrievedVitalikAccount.nonce > 0n, 'Vitalik.eth is stored in cache')
      const doesThisAccountExist =
        (await state.getAccount(
          Address.fromString('0xccAfdD642118E5536024675e776d32413728DD07')
        )) === undefined
      assert.ok(!doesThisAccountExist, 'getAccount returns undefined for non-existent account')

      assert.ok(state.getAccount(vitalikDotEth) !== undefined, 'vitalik.eth does exist')

      const UNIerc20ContractAddress = Address.fromString(
        '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'
      )
      const UNIContractCode = await state.getContractCode(UNIerc20ContractAddress)
      assert.ok(UNIContractCode.length > 0, 'was able to retrieve UNI contract code')

      await state.putContractCode(UNIerc20ContractAddress, UNIContractCode)
      assert.ok(
        typeof (state as any).contractCache.get(UNIerc20ContractAddress.toString()) !== 'undefined',
        'UNI ERC20 contract code was found in cache'
      )

      const storageSlot = await state.getContractStorage(
        UNIerc20ContractAddress,
        setLengthLeft(bigIntToBytes(1n), 32)
      )
      assert.ok(storageSlot.length > 0, 'was able to retrieve storage slot 1 for the UNI contract')

      await state.putContractStorage(
        UNIerc20ContractAddress,
        setLengthLeft(bigIntToBytes(2n), 32),
        utf8ToBytes('abcd')
      )
      const slotValue = await state.getContractStorage(
        UNIerc20ContractAddress,
        setLengthLeft(bigIntToBytes(2n), 32)
      )
      assert.ok(equalsBytes(slotValue, utf8ToBytes('abcd')), 'should retrieve slot 2 value')

      // Verify that provider is not called for cached data
      ;(provider as any).getStorageAt = function () {
        throw new Error('should not be called!')
      }

      assert.doesNotThrow(
        async () =>
          state.getContractStorage(UNIerc20ContractAddress, setLengthLeft(bigIntToBytes(2n), 32)),
        'should not call provider.getStorageAt'
      )

      await state.putContractStorage(
        UNIerc20ContractAddress,
        setLengthLeft(bigIntToBytes(2n), 32),
        new Uint8Array(0)
      )

      await state.modifyAccountFields(vitalikDotEth, { nonce: 39n })
      assert.equal(
        (await state.getAccount(vitalikDotEth))?.nonce,
        39n,
        'modified account fields successfully'
      )

      // Verify that provider is not called
      ;(state as any).getAccountFromProvider = function () {
        throw new Error('should not have called this!')
      }
      assert.doesNotThrow(
        async () => state.getAccount(vitalikDotEth),
        'does not call getAccountFromProvider'
      )

      try {
        await state.getAccount(Address.fromString('0x9Cef824A8f4b3Dc6B7389933E52e47F010488Fc8'))
      } catch (err) {
        assert.ok(true, 'calls getAccountFromProvider for non-cached account')
      }

      const deletedSlot = await state.getContractStorage(
        UNIerc20ContractAddress,
        setLengthLeft(bigIntToBytes(2n), 32)
      )

      assert.equal(deletedSlot.length, 0, 'deleted slot from storage cache')

      await state.deleteAccount(vitalikDotEth)
      assert.ok(
        (await state.getAccount(vitalikDotEth)) === undefined,
        'account should not exist after being deleted'
      )

      try {
        await Block.fromJsonRpcProvider(provider, 'fakeBlockTag', {} as any)
        assert.fail('should have thrown')
      } catch (err: any) {
        assert.ok(
          err.message.includes('expected blockTag to be block hash, bigint, hex prefixed string'),
          'threw with correct error when invalid blockTag provided'
        )
      }

      const newState = state.copy()

      assert.equal(
        undefined,
        (state as any).contractCache.get(UNIerc20ContractAddress),
        'should not have any code for contract after cache is cleared'
      )

      assert.notEqual(
        undefined,
        (newState as any).contractCache.get(UNIerc20ContractAddress.toString()),
        'state manager copy should have code for contract after cache is cleared on original state manager'
      )

      assert.equal((state as any).blockTag, '0x1', 'blockTag defaults to 1')
      state.setBlockTag(5n)
      assert.equal((state as any).blockTag, '0x5', 'blockTag set to 0x5')
      state.setBlockTag('earliest')
      assert.equal((state as any).blockTag, 'earliest', 'blockTag set to earliest')
    }
  })
})

describe('runTx custom transaction test', () => {
  it('should work', async () => {
    if (isBrowser() === true) {
      // The `MockProvider` is not able to load JSON files dynamically in browser so skipped in browser tests
    } else {
      const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })
      const provider =
        process.env.PROVIDER !== undefined
          ? new ethers.JsonRpcProvider(process.env.PROVIDER, 1)
          : new MockProvider()
      const state = new EthersStateManager({ provider, blockTag: 1n })
      const vm = await VM.create({ common, stateManager: <any>state }) // TODO fix the type DefaultStateManager back to StateManagerInterface in VM

      const vitalikDotEth = Address.fromString('0xd8da6bf26964af9d7eed9e03e53415d37aa96045')
      const privateKey = hexStringToBytes(
        'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109'
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

      assert.equal(result.totalGasSpent, 21000n, 'sent some ETH to vitalik.eth')
    }
  })
})

describe('runTx test: replay mainnet transactions', () => {
  it('should work', async () => {
    if (isBrowser() === true) {
      // The `MockProvider` is not able to load JSON files dynamically in browser so skipped in browser tests
    } else {
      const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.London })

      const provider =
        process.env.PROVIDER !== undefined
          ? new ethers.JsonRpcProvider(process.env.PROVIDER)
          : new MockProvider()

      const blockTag = 15496077n
      common.setHardforkBy({ blockNumber: blockTag })
      const tx = await TransactionFactory.fromRPC(txData, { common })
      const state = new EthersStateManager({
        provider,
        // Set the state manager to look at the state of the chain before the block has been executed
        blockTag: blockTag - 1n,
      })
      const vm = await VM.create({ common, stateManager: <any>state })
      const res = await vm.runTx({ tx })
      assert.equal(
        res.totalGasSpent,
        21000n,
        'calculated correct total gas spent for simple transfer'
      )
    }
  })
})

describe('runBlock test', () => {
  it('should work', async () => {
    if (isBrowser() === true) {
      // The `MockProvider` is not able to load JSON files dynamically in browser so skipped in browser tests
    } else {
      const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Chainstart })
      const provider =
        process.env.PROVIDER !== undefined
          ? new ethers.JsonRpcProvider(process.env.PROVIDER)
          : new MockProvider()
      const blockTag = 500000n
      const state = new EthersStateManager({
        provider,
        // Set the state manager to look at the state of the chain before the block has been executed
        blockTag: blockTag - 1n,
      })

      // Set the common to HF, doesn't impact this specific blockTag, but will impact much recent
      // blocks, also for post merge network, ttd should also be passed
      common.setHardforkBy({ blockNumber: blockTag - 1n })

      const vm = await VM.create({ common, stateManager: state })
      const block = Block.fromRPC(blockData, [], { common })
      try {
        const res = await vm.runBlock({
          block,
          generate: true,
          skipHeaderValidation: true,
        })
        assert.equal(
          res.gasUsed,
          block.header.gasUsed,
          'should compute correct cumulative gas for block'
        )
      } catch (err: any) {
        assert.fail(`should have successfully ran block; got error ${err.message}`)
      }
    }
  })
})
