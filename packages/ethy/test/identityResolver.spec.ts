import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createFlatStateManager } from '@ethereumjs/statemanager'
import { Address, bytesToHex, hexToBytes } from '@ethereumjs/util'
import { describe, expect, it } from 'vitest'

import {
  IdentityResolver,
  decodeAbiString,
  ensNameHash,
} from '../src/contracts/identityResolver.ts'
import { knownContractMeta, knownContractName } from '../src/contracts/knownContracts.ts'
import { createEthySandbox } from '../src/evm/sandbox.ts'
import { RpcBlockWindowStore } from '../src/rpc/blockWindowStore.ts'
import { createSpine } from '../src/spine/createSpine.ts'

function encodeAbiString(text: string): Uint8Array {
  const bytes = new TextEncoder().encode(text)
  const paddedLen = Math.ceil(bytes.length / 32) * 32
  const out = new Uint8Array(64 + paddedLen)
  out[31] = 32 // offset = 0x20
  out[63] = bytes.length
  out.set(bytes, 64)
  return out
}

/** Tiny EVM bytecode that returns `returnBytes` regardless of calldata. */
function returnConstantBytecode(returnBytes: Uint8Array): Uint8Array {
  // PUSH32 / MSTORE loop is overkill for small payloads; use CODECOPY from tail + RETURN
  // PUSH1 len, PUSH1 codeOffset, PUSH1 0, CODECOPY, PUSH1 len, PUSH1 0, RETURN
  const len = returnBytes.length
  const headerLen = 12
  const out = new Uint8Array(headerLen + len)
  out.set(
    [
      0x60,
      len, // PUSH1 len
      0x60,
      headerLen, // PUSH1 offset
      0x60,
      0x00, // PUSH1 0
      0x39, // CODECOPY
      0x60,
      len, // PUSH1 len
      0x60,
      0x00, // PUSH1 0
      0xf3, // RETURN
    ],
    0,
  )
  out.set(returnBytes, headerLen)
  return out
}

describe('knownContracts', () => {
  it('resolves ENS registry on mainnet & sepolia and exposes token decimals metadata', () => {
    expect(knownContractName(1n, '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e')).toBe('ENS Registry')
    expect(knownContractName(11155111n, '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e')).toBe(
      'ENS Registry',
    )
    const sepoliaUsdc = knownContractMeta(11155111n, '0x1c7d4b196cb0c7b01d743fbc6116a902379c7238')
    expect(sepoliaUsdc?.name).toBe('USDC')
    expect(sepoliaUsdc?.kind).toBe('token')
    expect(sepoliaUsdc?.decimals).toBe(6)
  })
})

describe('identityResolver', () => {
  it('empty name is zero node', () => {
    const z = ensNameHash('')
    expect([...z].every((b) => b === 0)).toBe(true)
  })

  it('decodes both ABI string and legacy bytes32 names', () => {
    expect(decodeAbiString(encodeAbiString('USD Coin'))).toBe('USD Coin')
    const b32 = new Uint8Array(32)
    b32.set(new TextEncoder().encode('MKR'), 0)
    expect(decodeAbiString(b32)).toBe('MKR')
  })

  it('resolves token name() via real EthySandbox with hex gas parameter', async () => {
    const chain = Mainnet
    const hardfork = Hardfork.Cancun
    const common = new Common({ chain, hardfork })
    const stateManager = createFlatStateManager({ common })
    const spine = createSpine('mainnet', 1n)
    spine.phase = 'HEAD_FOLLOWING'
    const blockWindow = new RpcBlockWindowStore(chain, hardfork)
    const sandbox = createEthySandbox({ spine, stateManager, chain, hardfork, blockWindow })

    const addrHex = '0x0000000000000000000000000000000000001234' as const
    const addr = new Address(hexToBytes(addrHex))
    await stateManager.putCode(addr, returnConstantBytecode(encodeAbiString('EthyToken')))

    const resolver = new IdentityResolver({ chain, sandbox, spine })
    resolver.onBlock(100n, [addrHex])
    await new Promise((r) => setTimeout(r, 80))

    // Both name() and symbol() return EthyToken on our constant-return contract
    expect(resolver.getKnownName(addrHex)).toBe('EthyToken (EthyToken)')
  })

  it('accepts verified ENS reverse lookup and rejects spoofed forward mismatch', async () => {
    const targetAddr = '0x000000000000000000000000000000000000abcd'
    const resolverAddr = '0x0000000000000000000000000000000000009999'
    const spine = createSpine('mainnet', 1n)
    spine.phase = 'HEAD_FOLLOWING'

    const padAddr = (a: string) => `0x${'00'.repeat(12)}${a.replace(/^0x/, '')}`
    const makeMockSandbox = (forwardReturnAddr: string) => ({
      runEthCall: async (tx: unknown) => {
        const obj = tx as { to: string; data: string; gas: string }
        expect(obj.gas.startsWith('0x')).toBe(true)
        if (obj.data.startsWith('0x0178b8bf')) return { result: padAddr(resolverAddr) }
        if (obj.data.startsWith('0x691f3431')) {
          return { result: bytesToHex(encodeAbiString('alice.eth')) }
        }
        if (obj.data.startsWith('0x3b3b57de')) return { result: padAddr(forwardReturnAddr) }
        return { error: { code: 3, message: 'revert' } }
      },
      runEstimateGas: async () => ({ result: '0x0' }),
      runCreateAccessList: async () => ({ result: {} }),
      runSimulateCall: async () => {
        throw new Error('unused')
      },
    })

    const okResolver = new IdentityResolver({
      chain: Mainnet,
      sandbox: makeMockSandbox(targetAddr) as never,
      spine,
    })
    okResolver.onBlock(1n, [targetAddr])
    await new Promise((r) => setTimeout(r, 30))
    expect(okResolver.getKnownName(targetAddr)).toBe('alice.eth')

    const spoofResolver = new IdentityResolver({
      chain: Mainnet,
      sandbox: makeMockSandbox('0x000000000000000000000000000000000000dead') as never,
      spine,
    })
    spoofResolver.onBlock(1n, [targetAddr])
    await new Promise((r) => setTimeout(r, 30))
    expect(spoofResolver.getKnownName(targetAddr)).toBeUndefined()
  })

  it('supports resolveNow, getEnsName, EOA ensOnly fast path, and long ENS names (>32 chars)', async () => {
    const targetAddr = '0x000000000000000000000000000000000000cafe'
    const resolverAddr = '0x0000000000000000000000000000000000009999'
    const longEns = 'this-is-a-very-long-ethereum-validator-name.eth'
    const spine = createSpine('mainnet', 1n)
    spine.phase = 'HEAD_FOLLOWING'

    const seenCalls: string[] = []
    const padAddr = (a: string) => `0x${'00'.repeat(12)}${a.replace(/^0x/, '')}`
    const sandbox = {
      runEthCall: async (tx: unknown) => {
        const obj = tx as { to: string; data: string; gas: string }
        seenCalls.push(obj.data.slice(0, 10))
        if (obj.data.startsWith('0x0178b8bf')) return { result: padAddr(resolverAddr) }
        if (obj.data.startsWith('0x691f3431')) {
          return { result: bytesToHex(encodeAbiString(longEns)) }
        }
        if (obj.data.startsWith('0x3b3b57de')) return { result: padAddr(targetAddr) }
        return { error: { code: 3, message: 'revert' } }
      },
      runEstimateGas: async () => ({ result: '0x0' }),
      runCreateAccessList: async () => ({ result: {} }),
      runSimulateCall: async () => {
        throw new Error('unused')
      },
    }

    const resolver = new IdentityResolver({
      chain: Mainnet,
      sandbox: sandbox as never,
      spine,
    })
    const hit = await resolver.resolveNow(targetAddr, 50n, { ensOnly: true })
    expect(hit.ensName).toBe(longEns)
    expect(hit.knownName).toBe(longEns)
    expect(resolver.getEnsName(targetAddr)).toBe(longEns)
    // ensOnly must skip ERC-20 name() (0x06fdde03) and symbol() (0x95d89b41)
    expect(seenCalls).not.toContain('0x06fdde03')
    expect(seenCalls).not.toContain('0x95d89b41')
  })

  it('reports ensRegistryReady=false and avoids negative caching when ENS Registry code is missing locally', async () => {
    const chain = Mainnet
    const common = new Common({ chain, hardfork: Hardfork.Cancun })
    const stateManager = createFlatStateManager({ common })
    const spine = createSpine('mainnet', 1n)
    spine.phase = 'HEAD_FOLLOWING'
    let ethCallCount = 0
    const sandbox = {
      runEthCall: async () => {
        ethCallCount += 1
        return { result: '0x' }
      },
      runEstimateGas: async () => ({ result: '0x0' }),
      runCreateAccessList: async () => ({ result: {} }),
      runSimulateCall: async () => {
        throw new Error('unused')
      },
    }
    const resolver = new IdentityResolver({
      chain,
      sandbox: sandbox as never,
      spine,
      stateManager,
    })
    expect(resolver.hasLocalEnsRegistry()).toBe(false)
    await resolver.resolveNow('0x000000000000000000000000000000000000abcd', 10n, { ensOnly: true })
    expect(ethCallCount).toBe(0)
    expect(resolver.getStats()).toEqual({
      ensRegistryReady: false,
      ensHits: 0,
      tokenHits: 0,
      cacheSize: 0,
    })
  })
})
