import tape from 'tape'
import { Address } from 'ethereumjs-util'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { DefaultStateManager } from '@ethereumjs/statemanager'

import { VmState } from '../../../src/vmState'
import { getSingleFile } from '../../tester/testLoader'
import { isRunningInKarma } from '../../util'
import { createAccount } from '../utils'

const StateManager = DefaultStateManager

tape('vmState', (t) => {
  t.test(
    'should generate the genesis state root correctly for mainnet from ethereum/tests data',
    async (st) => {
      if (isRunningInKarma()) {
        st.skip('skip slow test when running in karma')
        return st.end()
      }
      const genesisData = getSingleFile('BasicTests/genesishashestest.json')

      const vmState = new VmState({ stateManager: new StateManager() })
      await vmState.generateCanonicalGenesis()
      const stateRoot = await vmState.getStateRoot()
      st.equal(
        stateRoot.toString('hex'),
        genesisData.genesis_state_root,
        'generateCanonicalGenesis should produce correct state root for mainnet from ethereum/tests data'
      )
      st.end()
    }
  )

  t.test('should generate the genesis state root correctly for mainnet from common', async (st) => {
    if (isRunningInKarma()) {
      st.skip('skip slow test when running in karma')
      return st.end()
    }
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Petersburg })
    const expectedStateRoot = Buffer.from(common.genesis().stateRoot.slice(2), 'hex')
    const stateManager = new StateManager({ common })

    const vmState = new VmState({ stateManager, common })
    await vmState.generateCanonicalGenesis()
    const stateRoot = await vmState.getStateRoot()

    st.true(
      stateRoot.equals(expectedStateRoot),
      `generateCanonicalGenesis should produce correct state root for mainnet from common`
    )
    st.end()
  })

  t.test('should generate the genesis state root correctly for all other chains', async (st) => {
    const chains = [Chain.Ropsten, Chain.Rinkeby, Chain.Kovan, Chain.Goerli]

    for (const chain of chains) {
      const common = new Common({ chain: chain, hardfork: Hardfork.Petersburg })
      const expectedStateRoot = Buffer.from(common.genesis().stateRoot.slice(2), 'hex')
      const stateManager = new DefaultStateManager({ common })
      const vmState = new VmState({ stateManager, common })

      await vmState.generateCanonicalGenesis()
      const stateRoot = await vmState.getStateRoot()

      st.true(
        stateRoot.equals(expectedStateRoot),
        `generateCanonicalGenesis should produce correct state root for ${chain}`
      )
    }
    st.end()
  })
})

tape('Original storage cache', async (t) => {
  const stateManager = new DefaultStateManager()
  const vmState = new VmState({ stateManager })

  const address = new Address(Buffer.from('a94f5374fce5edbc8e2a8697c15331677e6ebf0b', 'hex'))
  const account = createAccount()
  await vmState.putAccount(address, account)

  const key = Buffer.from('1234567890123456789012345678901234567890123456789012345678901234', 'hex')
  const value = Buffer.from('1234', 'hex')

  t.test('should initially have empty storage value', async (st) => {
    await vmState.checkpoint()
    const res = await vmState.getContractStorage(address, key)
    st.deepEqual(res, Buffer.alloc(0))

    const origRes = await vmState.getOriginalContractStorage(address, key)
    st.deepEqual(origRes, Buffer.alloc(0))

    await vmState.commit()

    st.end()
  })

  t.test('should set original storage value', async (st) => {
    await vmState.putContractStorage(address, key, value)
    const res = await vmState.getContractStorage(address, key)
    st.deepEqual(res, value)

    st.end()
  })

  t.test('should get original storage value', async (st) => {
    const res = await vmState.getOriginalContractStorage(address, key)
    st.deepEqual(res, value)
    st.end()
  })

  t.test('should return correct original value after modification', async (st) => {
    const newValue = Buffer.from('1235', 'hex')
    await vmState.putContractStorage(address, key, newValue)
    const res = await vmState.getContractStorage(address, key)
    st.deepEqual(res, newValue)

    const origRes = await vmState.getOriginalContractStorage(address, key)
    st.deepEqual(origRes, value)
    st.end()
  })

  t.test('should cache keys separately', async (st) => {
    const key2 = Buffer.from(
      '0000000000000000000000000000000000000000000000000000000000000012',
      'hex'
    )
    const value2 = Buffer.from('12', 'hex')
    const value3 = Buffer.from('123', 'hex')
    await vmState.putContractStorage(address, key2, value2)

    let res = await vmState.getContractStorage(address, key2)
    st.deepEqual(res, value2)
    let origRes = await vmState.getOriginalContractStorage(address, key2)
    st.deepEqual(origRes, value2)

    await vmState.putContractStorage(address, key2, value3)

    res = await vmState.getContractStorage(address, key2)
    st.deepEqual(res, value3)
    origRes = await vmState.getOriginalContractStorage(address, key2)
    st.deepEqual(origRes, value2)

    // Check previous key
    res = await vmState.getContractStorage(address, key)
    st.deepEqual(res, Buffer.from('1235', 'hex'))
    origRes = await vmState.getOriginalContractStorage(address, key)
    st.deepEqual(origRes, value)

    st.end()
  })

  t.test("getOriginalContractStorage should validate the key's length", async (st) => {
    try {
      await vmState.getOriginalContractStorage(address, Buffer.alloc(12))
    } catch (e: any) {
      st.equal(e.message, 'Storage key must be 32 bytes long')
      st.end()
      return
    }

    st.fail('Should have failed')
    st.end()
  })
})

tape('StateManager - generateAccessList', (tester) => {
  const it = tester.test

  // Only use 0..9
  function a(n: number) {
    return Buffer.from(`ff${'00'.repeat(18)}0${n}`, 'hex')
  }

  // Only use 0..9
  function s(n: number) {
    return Buffer.from(`${'00'.repeat(31)}0${n}`, 'hex')
  }

  function getStateManagerAliases() {
    const stateManager = new DefaultStateManager()
    const vmState = new VmState({ stateManager })
    const addA = vmState.addWarmedAddress.bind(vmState)
    const addS = vmState.addWarmedStorage.bind(vmState)
    const gen = vmState.generateAccessList.bind(vmState)
    const sm = vmState
    return { addA, addS, gen, sm }
  }

  it('one frame, simple', async (t) => {
    const { addA, addS, gen } = getStateManagerAliases()
    addA(a(1))
    addS(a(1), s(1))
    const json = [
      {
        address: '0xff00000000000000000000000000000000000001',
        storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000001'],
      },
    ]
    t.deepEqual(gen(), json)
    t.end()
  })

  it('one frame, unsorted slots', async (t) => {
    const { addA, addS, gen } = getStateManagerAliases()
    addA(a(1))
    addS(a(1), s(2))
    addS(a(1), s(1))
    const json = [
      {
        address: '0xff00000000000000000000000000000000000001',
        storageKeys: [
          '0x0000000000000000000000000000000000000000000000000000000000000001',
          '0x0000000000000000000000000000000000000000000000000000000000000002',
        ],
      },
    ]
    t.deepEqual(gen(), json)
    t.end()
  })

  it('one frame, unsorted addresses', async (t) => {
    const { addA, addS, gen } = getStateManagerAliases()
    addA(a(2))
    addS(a(2), s(1))
    addA(a(1))
    addS(a(1), s(1))
    const json = [
      {
        address: '0xff00000000000000000000000000000000000001',
        storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000001'],
      },
      {
        address: '0xff00000000000000000000000000000000000002',
        storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000001'],
      },
    ]
    t.deepEqual(gen(), json)
    t.end()
  })

  it('one frame, more complex', async (t) => {
    const { addA, addS, gen } = getStateManagerAliases()
    addA(a(1))
    addS(a(1), s(1))
    addA(a(2))
    addA(a(3))
    addS(a(3), s(1))
    addS(a(3), s(2))
    let json = [
      {
        address: '0xff00000000000000000000000000000000000001',
        storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000001'],
      },
      {
        address: '0xff00000000000000000000000000000000000002',
        storageKeys: [],
      },
      {
        address: '0xff00000000000000000000000000000000000003',
        storageKeys: [
          '0x0000000000000000000000000000000000000000000000000000000000000001',
          '0x0000000000000000000000000000000000000000000000000000000000000002',
        ],
      },
    ]
    t.deepEqual(gen(), json)

    json = [
      {
        address: '0xff00000000000000000000000000000000000002',
        storageKeys: [],
      },
      {
        address: '0xff00000000000000000000000000000000000003',
        storageKeys: [
          '0x0000000000000000000000000000000000000000000000000000000000000001',
          '0x0000000000000000000000000000000000000000000000000000000000000002',
        ],
      },
    ]
    const aRemoved = new Address(a(1))
    t.deepEqual(gen([aRemoved]), json, 'address removed')

    json = [
      {
        address: '0xff00000000000000000000000000000000000001',
        storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000001'],
      },
      {
        address: '0xff00000000000000000000000000000000000002',
        storageKeys: [],
      },
      {
        address: '0xff00000000000000000000000000000000000003',
        storageKeys: [
          '0x0000000000000000000000000000000000000000000000000000000000000001',
          '0x0000000000000000000000000000000000000000000000000000000000000002',
        ],
      },
    ]
    const aOnlyStorageKept = new Address(a(3))
    t.deepEqual(gen([], [aOnlyStorageKept]), json, 'addressesOnlyStorage, kept')

    json = [
      {
        address: '0xff00000000000000000000000000000000000001',
        storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000001'],
      },
      {
        address: '0xff00000000000000000000000000000000000003',
        storageKeys: [
          '0x0000000000000000000000000000000000000000000000000000000000000001',
          '0x0000000000000000000000000000000000000000000000000000000000000002',
        ],
      },
    ]
    const aOnlyStorageRemoved = new Address(a(2))
    t.deepEqual(gen([], [aOnlyStorageRemoved]), json, 'addressesOnlyStorage, removed')
    t.end()
  })

  it('two frames, simple', async (t) => {
    const { addA, addS, gen, sm } = getStateManagerAliases()
    addA(a(1))
    addS(a(1), s(1))
    await sm.checkpoint()
    addA(a(2))
    addA(a(3))
    addS(a(3), s(1))
    addS(a(3), s(2))
    const json = [
      {
        address: '0xff00000000000000000000000000000000000001',
        storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000001'],
      },
      {
        address: '0xff00000000000000000000000000000000000002',
        storageKeys: [],
      },
      {
        address: '0xff00000000000000000000000000000000000003',
        storageKeys: [
          '0x0000000000000000000000000000000000000000000000000000000000000001',
          '0x0000000000000000000000000000000000000000000000000000000000000002',
        ],
      },
    ]
    t.deepEqual(gen(), json)
    t.end()
  })

  it('two frames, same address with different storage slots', async (t) => {
    const { addA, addS, gen, sm } = getStateManagerAliases()
    addA(a(1))
    addS(a(1), s(1))
    await sm.checkpoint()
    addA(a(1))
    addS(a(1), s(2))
    const json = [
      {
        address: '0xff00000000000000000000000000000000000001',
        storageKeys: [
          '0x0000000000000000000000000000000000000000000000000000000000000001',
          '0x0000000000000000000000000000000000000000000000000000000000000002',
        ],
      },
    ]
    t.deepEqual(gen(), json)
    t.end()
  })

  it('two frames, same address with same storage slots', async (t) => {
    const { addA, addS, gen, sm } = getStateManagerAliases()
    addA(a(1))
    addS(a(1), s(1))
    await sm.checkpoint()
    addA(a(1))
    addS(a(1), s(1))
    const json = [
      {
        address: '0xff00000000000000000000000000000000000001',
        storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000001'],
      },
    ]
    t.deepEqual(gen(), json)
    t.end()
  })

  it('three frames, no accesses on level two', async (t) => {
    const { addA, addS, gen, sm } = getStateManagerAliases()
    addA(a(1))
    addS(a(1), s(1))
    await sm.checkpoint()
    await sm.checkpoint()
    addA(a(2))
    addS(a(2), s(2))
    const json = [
      {
        address: '0xff00000000000000000000000000000000000001',
        storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000001'],
      },
      {
        address: '0xff00000000000000000000000000000000000002',
        storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000002'],
      },
    ]
    t.deepEqual(gen(), json)
    t.end()
  })

  it('one frame, one revert frame', async (t) => {
    const { addA, addS, gen, sm } = getStateManagerAliases()
    await sm.checkpoint()
    addA(a(1))
    addS(a(1), s(1))
    await sm.revert()
    addA(a(2))
    addS(a(2), s(2))
    const json = [
      {
        address: '0xff00000000000000000000000000000000000001',
        storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000001'],
      },
      {
        address: '0xff00000000000000000000000000000000000002',
        storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000002'],
      },
    ]
    t.deepEqual(gen(), json)
    t.end()
  })

  it('one frame, one revert frame, same address, different slots', async (t) => {
    const { addA, addS, gen, sm } = getStateManagerAliases()
    await sm.checkpoint()
    addA(a(1))
    addS(a(1), s(1))
    await sm.revert()
    addA(a(1))
    addS(a(1), s(2))
    const json = [
      {
        address: '0xff00000000000000000000000000000000000001',
        storageKeys: [
          '0x0000000000000000000000000000000000000000000000000000000000000001',
          '0x0000000000000000000000000000000000000000000000000000000000000002',
        ],
      },
    ]
    t.deepEqual(gen(), json)
    t.end()
  })

  it('one frame, two revert frames', async (t) => {
    const { addA, addS, gen, sm } = getStateManagerAliases()
    await sm.checkpoint()
    await sm.checkpoint()
    addA(a(1))
    addS(a(1), s(1))
    await sm.revert()
    addA(a(2))
    addS(a(2), s(1))
    await sm.revert()
    addA(a(3))
    addS(a(3), s(1))
    const json = [
      {
        address: '0xff00000000000000000000000000000000000001',
        storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000001'],
      },
      {
        address: '0xff00000000000000000000000000000000000002',
        storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000001'],
      },
      {
        address: '0xff00000000000000000000000000000000000003',
        storageKeys: ['0x0000000000000000000000000000000000000000000000000000000000000001'],
      },
    ]
    t.deepEqual(gen(), json)
    t.end()
  })
})
