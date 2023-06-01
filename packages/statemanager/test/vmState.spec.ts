import { Blockchain } from '@ethereumjs/blockchain'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { Account, Address } from '@ethereumjs/util'
import { hexToBytes, utf8ToBytes } from 'ethereum-cryptography/utils'
import * as tape from 'tape'

import { DefaultStateManager } from '../src'

export function createAccount(nonce = BigInt(0), balance = BigInt(0xfff384)) {
  return new Account(nonce, balance)
}
/**
 * Checks if in a karma test runner.
 * @returns boolean whether running in karma
 */
export function isRunningInKarma(): boolean {
  // eslint-disable-next-line no-undef
  return typeof (<any>globalThis).window !== 'undefined' && (<any>globalThis).window.__karma__
}

const StateManager = DefaultStateManager

tape('stateManager', (t) => {
  t.test('should generate the genesis state root correctly for mainnet from common', async (st) => {
    if (isRunningInKarma()) {
      st.skip('skip slow test when running in karma')
      return st.end()
    }
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Petersburg })
    const expectedStateRoot = hexToBytes(
      'd7f8974fb5ac78d9ac099b9ad5018bedc2ce0a72dad1827a1709da30580f0544'
    )
    const stateManager = new StateManager({})

    const blockchain = await Blockchain.create({ common })
    await stateManager.generateCanonicalGenesis(blockchain.genesisState())
    const stateRoot = await stateManager.getStateRoot()

    st.deepEquals(
      stateRoot,
      expectedStateRoot,
      `generateCanonicalGenesis should produce correct state root for mainnet from common`
    )
    st.end()
  })

  t.test('should generate the genesis state root correctly for all other chains', async (st) => {
    const chains: [Chain, Uint8Array][] = [
      [
        Chain.Ropsten,
        hexToBytes('217b0bbcfb72e2d57e28f33cb361b9983513177755dc3f33ce3e7022ed62b77b'),
      ],
      [
        Chain.Rinkeby,
        hexToBytes('53580584816f617295ea26c0e17641e0120cab2f0a8ffb53a866fd53aa8e8c2d'),
      ],
      [
        Chain.Goerli,
        hexToBytes('5d6cded585e73c4e322c30c2f782a336316f17dd85a4863b9d838d2d4b8b3008'),
      ],
      [
        Chain.Sepolia,
        hexToBytes('5eb6e371a698b8d68f665192350ffcecbbbf322916f4b51bd79bb6887da3f494'),
      ],
    ]

    for (const [chain, expectedStateRoot] of chains) {
      const common = new Common({ chain, hardfork: Hardfork.Chainstart })
      const stateManager = new DefaultStateManager({})

      const blockchain = await Blockchain.create({ common })
      await stateManager.generateCanonicalGenesis(blockchain.genesisState())
      const stateRoot = await stateManager.getStateRoot()

      st.deepEquals(
        stateRoot,
        expectedStateRoot,
        `generateCanonicalGenesis should produce correct state root for ${Chain[chain]}`
      )
    }
    st.end()
  })
})

tape('Original storage cache', async (t) => {
  const stateManager = new DefaultStateManager()

  const address = new Address(hexToBytes('a94f5374fce5edbc8e2a8697c15331677e6ebf0b'))
  const account = createAccount()
  await stateManager.putAccount(address, account)

  const key = hexToBytes('1234567890123456789012345678901234567890123456789012345678901234')
  const value = hexToBytes('1234')

  t.test('should initially have empty storage value', async (st) => {
    await stateManager.checkpoint()
    const res = await stateManager.getContractStorage(address, key)
    st.deepEqual(res, new Uint8Array(0))

    const origRes = await stateManager.originalStorageCache.get(address, key)
    st.deepEqual(origRes, new Uint8Array(0))

    await stateManager.commit()

    st.end()
  })

  t.test('should set original storage value', async (st) => {
    await stateManager.putContractStorage(address, key, value)
    const res = await stateManager.getContractStorage(address, key)
    st.deepEqual(res, value)

    st.end()
  })

  t.test('should get original storage value', async (st) => {
    const res = await stateManager.originalStorageCache.get(address, key)
    st.deepEqual(res, value)
    st.end()
  })

  t.test('should return correct original value after modification', async (st) => {
    const newValue = hexToBytes('1235')
    await stateManager.putContractStorage(address, key, newValue)
    const res = await stateManager.getContractStorage(address, key)
    st.deepEqual(res, newValue)

    const origRes = await stateManager.originalStorageCache.get(address, key)
    st.deepEqual(origRes, value)
    st.end()
  })

  t.test('should cache keys separately', async (st) => {
    const key2 = hexToBytes('0000000000000000000000000000000000000000000000000000000000000012')
    const value2 = utf8ToBytes('12')
    const value3 = utf8ToBytes('123')
    await stateManager.putContractStorage(address, key2, value2)

    let res = await stateManager.getContractStorage(address, key2)
    st.deepEqual(res, value2)
    let origRes = await stateManager.originalStorageCache.get(address, key2)
    st.deepEqual(origRes, value2)

    await stateManager.putContractStorage(address, key2, value3)

    res = await stateManager.getContractStorage(address, key2)
    st.deepEqual(res, value3)
    origRes = await stateManager.originalStorageCache.get(address, key2)
    st.deepEqual(origRes, value2)

    // Check previous key
    res = await stateManager.getContractStorage(address, key)
    st.deepEqual(res, hexToBytes('1235'))
    origRes = await stateManager.originalStorageCache.get(address, key)
    st.deepEqual(origRes, value)

    st.end()
  })

  t.test("getOriginalContractStorage should validate the key's length", async (st) => {
    try {
      await stateManager.originalStorageCache.get(address, new Uint8Array(12))
    } catch (e: any) {
      st.equal(e.message, 'Storage key must be 32 bytes long')
      st.end()
      return
    }

    st.fail('Should have failed')
    st.end()
  })
})
