import {
  FlatStateManager,
  StateMissUnavailableError,
  createFlatStateManager,
} from '@ethereumjs/statemanager'
import { Address, accountToBinaryAccount, createAccount, hexToBytes } from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'
import { assert, describe, it } from 'vitest'

import {
  CustodyStateResolver,
  createCustodyResolverHooks,
} from '../src/custody/custodyStateResolver.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import { StatyWriteIndex } from '../src/staty/writeIndex.ts'
import { bootNetworkProfile } from '../src/sync/machineOrchestrator.ts'

/** Address whose trie bucket (nibble 0) stays open-world for policy tests. */
const OPEN_BUCKET_ADDRESS = new Address(hexToBytes(`0x${'00'.repeat(20)}`))

describe('custodyPolicyIsolation', () => {
  it('bootNetworkProfile(auto, snapBootstrap=false) never lists snap/1', () => {
    const profile = bootNetworkProfile('auto', false)
    assert.notInclude(profile.capabilities, 'snap1')
    assert.include(profile.capabilities, 'ethy0')
  })

  it('swarm-only unresolved miss throws StateMissUnavailableError', async () => {
    const sm = new FlatStateManager({
      closedBucketsMask: 0x0000,
      resolutionPolicy: 'swarm-only',
      resolveAccountMiss: async () => undefined,
    })
    try {
      await sm.getAccount(OPEN_BUCKET_ADDRESS)
      assert.fail('expected StateMissUnavailableError')
    } catch (e: unknown) {
      assert.instanceOf(e, StateMissUnavailableError)
      assert.equal(e.kind, 'account')
    }
  })

  it('full policy resolves when resolver returns a binary account', async () => {
    const binary = accountToBinaryAccount(createAccount({ nonce: 9n, balance: 1n }))
    const sm = new FlatStateManager({
      closedBucketsMask: 0x0000,
      resolutionPolicy: 'full',
      resolveAccountMiss: async () => binary,
    })
    const account = await sm.getAccount(OPEN_BUCKET_ADDRESS)
    assert.equal(account?.nonce, 9n)
    assert.equal(account?.balance, 1n)
  })

  it('wired custody resolver swarm-only throws without snap-bootstrap', async () => {
    const spine = createSpine('sepolia', 11155111n)
    const resolver = new CustodyStateResolver({
      getClient: () => undefined,
      getPeers: () => [],
      spine,
      writeIndex: new StatyWriteIndex(keccak_256),
      snapBootstrapEnabled: false,
      balEarliestBlock: () => 0n,
      witnessBatchWindowMs: 0,
    })
    const hooks = createCustodyResolverHooks(resolver)
    const sm = createFlatStateManager({
      closedBucketsMask: 0x0000,
      resolutionPolicy: 'swarm-only',
      ...hooks,
    })
    try {
      await sm.getAccount(OPEN_BUCKET_ADDRESS)
      assert.fail('expected StateMissUnavailableError')
    } catch (e: unknown) {
      assert.instanceOf(e, StateMissUnavailableError)
    }
  })

  it('local-only resolver hooks skip ETHY before network', async () => {
    const spine = createSpine('sepolia', 11155111n)
    const resolver = new CustodyStateResolver({
      getClient: () => undefined,
      getPeers: () => [],
      spine,
      writeIndex: new StatyWriteIndex(keccak_256),
      snapBootstrapEnabled: true,
      balEarliestBlock: () => 0n,
      witnessBatchWindowMs: 0,
    })
    const hash = new Uint8Array(32)
    hash[0] = 0x00
    assert.equal(await resolver.resolveAccountMiss(hash, 'local-only'), undefined)
    const hooks = createCustodyResolverHooks(resolver)
    const sm = createFlatStateManager({
      closedBucketsMask: 0x0000,
      resolutionPolicy: 'local-only',
      ...hooks,
    })
    try {
      await sm.getAccount(OPEN_BUCKET_ADDRESS)
      assert.fail('expected StateMissUnavailableError')
    } catch (e: unknown) {
      assert.instanceOf(e, StateMissUnavailableError)
    }
  })
})
