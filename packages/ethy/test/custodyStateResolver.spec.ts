import { assert, describe, it } from 'vitest'

import { keccak_256 } from '@noble/hashes/sha3.js'
import { CustodyStateResolver } from '../src/custody/custodyStateResolver.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import { StatyWriteIndex } from '../src/staty/writeIndex.ts'

describe('custodyStateResolver', () => {
  it('resolveAccountMiss returns undefined without peers', async () => {
    const spine = createSpine('sepolia', 11155111n)
    const writeIndex = new StatyWriteIndex(keccak_256)
    const resolver = new CustodyStateResolver({
      getClient: () => undefined,
      getPeers: () => [],
      spine,
      writeIndex,
      snapBootstrapEnabled: false,
      balEarliestBlock: () => 0n,
    })
    const hash = new Uint8Array(32)
    hash[0] = 0x20
    const out = await resolver.resolveAccountMiss(hash, 'swarm-only')
    assert.equal(out, undefined)
  })

  it('resolveStorageMiss returns undefined without storage custodian peer', async () => {
    const spine = createSpine('sepolia', 11155111n)
    const resolver = new CustodyStateResolver({
      getClient: () => undefined,
      getPeers: () => [],
      spine,
      writeIndex: new StatyWriteIndex(keccak_256),
      snapBootstrapEnabled: false,
      balEarliestBlock: () => 0n,
    })
    const accountHash = new Uint8Array(32)
    accountHash[0] = 0x40
    const slotHash = keccak_256(new Uint8Array([7]))
    const out = await resolver.resolveStorageMiss(accountHash, slotHash, 'swarm-only')
    assert.equal(out, undefined)
  })

  it('resolveCodeMiss returns undefined when no code custodian peer', async () => {
    const spine = createSpine('sepolia', 11155111n)
    const resolver = new CustodyStateResolver({
      getClient: () => undefined,
      getPeers: () => [],
      spine,
      writeIndex: new StatyWriteIndex(keccak_256),
      snapBootstrapEnabled: false,
      balEarliestBlock: () => 0n,
    })
    const codeHash = keccak_256(new Uint8Array([1, 2, 3]))
    const out = await resolver.resolveCodeMiss(codeHash, 'full')
    assert.equal(out, undefined)
  })
})
