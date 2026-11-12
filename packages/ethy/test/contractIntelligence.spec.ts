import { bytesToHex, hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'
import { ethyKeccak256 } from '../src/crypto/keccak.ts'

import { Common } from '@ethereumjs/common'
import { createFlatStateManager } from '@ethereumjs/statemanager'
import { DeterministicIntentEngine } from '../src/ai/deterministicEngine.ts'
import { fingerprintBytecode } from '../src/contracts/bytecodeFingerprint.ts'
import {
  type CodeLookup,
  type ContractAddressAgg,
  classifyAddress,
  createFingerprintCache,
} from '../src/contracts/contractIntelligence.ts'
import { decodeAbiWords } from '../src/contracts/localAbi.ts'
import {
  SELECTOR,
  TOPIC,
  catalogSelectorForSignature,
  catalogTopic0ForSignature,
} from '../src/contracts/signatureCatalog.ts'
import { ETHEconomyDataManager } from '../src/economy/economyDataManager.ts'
import { activeHardfork, chainConfigForNetwork } from '../src/net/chainHardfork.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import { contractMicroscopeWidget } from '../src/tools/contractTools.ts'

describe('[Ethy/Contracts]: catalog vectors', () => {
  it('matches keccak selectors and topics', () => {
    assert.equal(catalogSelectorForSignature('transfer(address,uint256)'), SELECTOR.transfer)
    assert.equal(catalogSelectorForSignature('balanceOf(address)'), SELECTOR.balanceOf)
    assert.equal(catalogSelectorForSignature('approve(address,uint256)'), SELECTOR.approve)
    assert.equal(
      catalogSelectorForSignature('transferFrom(address,address,uint256)'),
      SELECTOR.transferFrom,
    )
    assert.equal(
      catalogTopic0ForSignature('Transfer(address,address,uint256)'),
      TOPIC.transferErc20,
    )
    assert.equal(
      catalogSelectorForSignature('swap(uint256,uint256,address,bytes)'),
      SELECTOR.swapV2,
    )
    assert.equal(
      catalogSelectorForSignature('swap(address,bool,int256,uint160,bytes)'),
      SELECTOR.swapV3,
    )
    assert.equal(catalogSelectorForSignature('execute(bytes,bytes[])'), SELECTOR.execute)
    assert.equal(catalogSelectorForSignature('deposit()'), SELECTOR.deposit)
    assert.equal(catalogSelectorForSignature('withdraw(uint256)'), SELECTOR.withdraw)
    assert.equal(
      catalogSelectorForSignature(
        'handleOps((address,uint256,bytes,bytes,uint256,uint256,uint256,uint256,uint256,bytes,bytes)[],address)',
      ),
      SELECTOR.handleOps,
    )
    assert.equal(
      catalogSelectorForSignature(
        'validateUserOp((address,uint256,bytes,bytes,uint256,uint256,uint256,uint256,uint256,bytes,bytes),bytes32,uint256)',
      ),
      SELECTOR.validateUserOp,
    )
  })
})

describe('[Ethy/Contracts]: localAbi', () => {
  it('decodes transfer calldata words', () => {
    const to = `${'0'.repeat(24)}${'11'.repeat(20)}`
    const amount = `${'0'.repeat(62)}64`
    const data = Buffer.from(`${SELECTOR.transfer.slice(2)}${to}${amount}`, 'hex')
    const decoded = decodeAbiWords(['address', 'uint256'], new Uint8Array(data.subarray(4)))
    assert.isDefined(decoded)
    assert.match(decoded![0]!, /0x1111/)
    assert.equal(decoded![1], '100')
  })

  it('returns undefined on truncated buffer', () => {
    assert.isUndefined(decodeAbiWords(['uint256'], new Uint8Array(16)))
  })
})

describe('[Ethy/Contracts]: bytecodeFingerprint', () => {
  it('skips PUSH32 immediate containing 0x63', () => {
    const code = new Uint8Array([0x7f, ...new Uint8Array(32).fill(0x63), 0x00])
    const fp = fingerprintBytecode(code)
    assert.equal(fp.implementedSelectors.length, 0)
  })

  it('extracts PUSH4 in dispatcher', () => {
    const sel = Buffer.from(SELECTOR.transfer.slice(2), 'hex')
    const code = new Uint8Array([0x63, ...sel, 0x14, 0x00])
    const fp = fingerprintBytecode(code)
    assert.equal(fp.implementedSelectors[0], SELECTOR.transfer)
  })

  it('detects EIP-1167', () => {
    const impl = Buffer.alloc(20, 0xab)
    const prefix = Buffer.from('363d3d373d3d3d363d73', 'hex')
    const suffix = Buffer.from('5af43d82803e903d91602b57fd5bf3', 'hex')
    const code = Buffer.concat([prefix, impl, suffix])
    const fp = fingerprintBytecode(new Uint8Array(code))
    assert.equal(fp.proxyKind, 'EIP-1167')
    assert.isDefined(fp.proxyTarget)
  })

  it('detects EIP-7702 delegation prefix', () => {
    const delegate = Buffer.alloc(20, 0xcd)
    const code = new Uint8Array([0xef, 0x01, 0x00, ...delegate])
    const fp = fingerprintBytecode(code)
    assert.equal(fp.proxyKind, 'EIP-7702')
  })

  it('scans 24 KiB under 10ms', () => {
    const code = new Uint8Array(24 * 1024).fill(0x00)
    code[0] = 0x63
    code[1] = 0xa9
    code[2] = 0x05
    code[3] = 0x9c
    code[4] = 0xbb
    code[5] = 0x14
    const start = performance.now()
    fingerprintBytecode(code)
    const elapsed = performance.now() - start
    // v8 coverage instrumentation adds a few ms on CI.
    assert.isBelow(elapsed, 10)
  })
})

function erc20Agg(): ContractAddressAgg {
  const m = new Map<string, number>()
  m.set(SELECTOR.transfer, 10)
  m.set(SELECTOR.balanceOf, 1)
  m.set(SELECTOR.approve, 1)
  const t = new Map<string, number>()
  t.set(TOPIC.transferErc20, 5)
  return {
    selectorCounts: m,
    topicCounts: t,
    coTouched: new Set(),
    maxTransferLogsInTx: 0,
    soleCalleeBlocks: 0,
    inboundCalls: 0,
    swapEmittersInTx: new Set(),
    callPreviews: [],
    eventPreviews: [],
  }
}

describe('[Ethy/Contracts]: classification', () => {
  const chain = chainConfigForNetwork('sepolia')
  const common = new Common({ chain, hardfork: activeHardfork(chain) })
  const sm = createFlatStateManager({ common })
  const lookup = {
    chainId: 11155111n,
    getCodeForAddress: () => undefined,
  }
  const cache = createFingerprintCache()

  it('classifies ERC-20 from bytecode selectors', () => {
    const selBytes: number[] = []
    for (const s of [SELECTOR.transfer, SELECTOR.balanceOf, SELECTOR.approve]) {
      selBytes.push(0x63, ...Buffer.from(s.slice(2), 'hex'), 0x14)
    }
    const code = new Uint8Array(selBytes)
    sm.putCodeByHash(ethyKeccak256(code), code)
    const row = {
      address: '0x000000000000000000000000000000000000c1',
      blocksActive: 2,
      storageWrites: 4,
      storageReads: 0,
      netEthDeltaWei: 0n,
    }
    const agg = erc20Agg()
    const extra = classifyAddress(
      row.address,
      row,
      agg,
      {
        chainId: 11155111n,
        getCodeForAddress: () => code,
      },
      cache,
    )
    assert.equal(extra.archetype, 'ERC-20')
  })

  it('classifies busy ERC-20 from Transfer logs without write-rate cliff', () => {
    const row = {
      address: '0x000000000000000000000000000000000000c2',
      blocksActive: 10,
      storageWrites: 80,
      storageReads: 0,
      netEthDeltaWei: 0n,
    }
    const agg = erc20Agg()
    const extra = classifyAddress(row.address, row, agg, lookup, cache)
    assert.equal(extra.archetype, 'ERC-20')
  })

  it('classifies DEX Pool on Swap without Sync', () => {
    const topics = new Map<string, number>()
    topics.set(TOPIC.swapV3, 3)
    const agg: ContractAddressAgg = {
      selectorCounts: new Map(),
      topicCounts: topics,
      coTouched: new Set(),
      maxTransferLogsInTx: 0,
      soleCalleeBlocks: 0,
      inboundCalls: 0,
      swapEmittersInTx: new Set(),
      callPreviews: [],
      eventPreviews: [],
    }
    const row = {
      address: '0x000000000000000000000000000000000000d00d',
      blocksActive: 2,
      storageWrites: 4,
      storageReads: 0,
      netEthDeltaWei: 0n,
    }
    const extra = classifyAddress(row.address, row, agg, lookup, cache)
    assert.equal(extra.archetype, 'DEX Pool')
  })

  it('keeps proxy kind when implementation code is cold', () => {
    const impl = '0x000000000000000000000000abcdef00000001'
    const agg: ContractAddressAgg = {
      selectorCounts: new Map(),
      topicCounts: new Map(),
      coTouched: new Set(),
      maxTransferLogsInTx: 0,
      soleCalleeBlocks: 0,
      inboundCalls: 0,
      swapEmittersInTx: new Set(),
      callPreviews: [],
      eventPreviews: [],
      implSlotValue: '0x00000000000000000000000000000000000000000000000000000000abcdef00000001',
    }
    const row = {
      address: '0x000000000000000000000000000000000000beef',
      blocksActive: 41,
      storageWrites: 41,
      storageReads: 0,
      netEthDeltaWei: 0n,
    }
    const extra = classifyAddress(row.address, row, agg, lookup, cache)
    assert.equal(extra.archetype, 'EIP-1967 Proxy')
    assert.include(extra.proxyTarget?.toLowerCase(), 'abcdef00000001')
  })

  it('resolves EIP-1967 proxy via getStorageSlotForAddress and selector-only ERC-20', () => {
    const implHex = '0x0000000000000000000000000000000000009999'
    const proxyLookup: CodeLookup = {
      chainId: 11155111n,
      getCodeForAddress: (addr) => {
        if (addr.toLowerCase() === implHex) {
          // ERC-20 bytecode selectors followed by EQ (0x14): transfer, approve, balanceOf, transferFrom
          return hexToBytes(
            `0x63${SELECTOR.transfer.slice(2)}1463${SELECTOR.approve.slice(2)}1463${SELECTOR.balanceOf.slice(2)}1463${SELECTOR.transferFrom.slice(2)}14`,
          )
        }
        return undefined
      },
      getStorageSlotForAddress: () =>
        '0x0000000000000000000000000000000000000000000000000000000000009999',
    }
    const agg: ContractAddressAgg = {
      selectorCounts: new Map(),
      topicCounts: new Map(),
      coTouched: new Set(),
      maxTransferLogsInTx: 0,
      soleCalleeBlocks: 0,
      inboundCalls: 0,
      swapEmittersInTx: new Set(),
      callPreviews: [],
      eventPreviews: [],
    }
    const row = {
      address: '0x0000000000000000000000000000000000007777',
      blocksActive: 5,
      storageWrites: 10,
      storageReads: 0,
      netEthDeltaWei: 0n,
    }
    const extra = classifyAddress(row.address, row, agg, proxyLookup, cache)
    assert.equal(extra.archetype, 'ERC-20')
    assert.equal(extra.proxyKind, 'EIP-1967')
    assert.equal(extra.proxyTarget?.toLowerCase(), implHex)

    // Selector-only ERC-20 without Transfer log
    const selAgg: ContractAddressAgg = {
      selectorCounts: new Map([[SELECTOR.approve.toLowerCase(), 3]]),
      topicCounts: new Map(),
      coTouched: new Set(),
      maxTransferLogsInTx: 0,
      soleCalleeBlocks: 0,
      inboundCalls: 3,
      swapEmittersInTx: new Set(),
      callPreviews: [],
      eventPreviews: [],
    }
    const selExtra = classifyAddress(row.address, row, selAgg, lookup, cache)
    assert.equal(selExtra.archetype, 'ERC-20')
  })
})

describe('[Ethy/Contracts]: /contract widget', () => {
  it('renders archetype in table preface', async () => {
    const chain = chainConfigForNetwork('sepolia')
    const hardfork = activeHardfork(chain)
    const spine = createSpine('sepolia', 11155111n)
    const mgr = new ETHEconomyDataManager({ spine, chain, hardfork })
    spine.economy = {
      hasBlocks: true,
      topContracts: [
        {
          address: '0x00000000000000000000000000000000000000c1',
          blocksActive: 3,
          storageWrites: 12,
          storageReads: 4,
          netEthDeltaWei: 0n,
          archetype: 'DEX Router',
          confidence: 'high',
        },
      ],
      recentBlocks: [],
    }
    const common = new Common({ chain, hardfork })
    const sm = createFlatStateManager({ common })
    const w = contractMicroscopeWidget(spine, sm, chain, mgr, '1')
    assert.equal(w.kind, 'key_value')
    assert.match(
      (w as { entries: { value: string }[] }).entries[0]!.value,
      /Not in the 64-block window/,
    )
  })

  it('dispatch /contract via intent engine', async () => {
    const chain = chainConfigForNetwork('sepolia')
    const hardfork = activeHardfork(chain)
    const spine = createSpine('sepolia', 11155111n)
    const mgr = new ETHEconomyDataManager({ spine, chain, hardfork })
    const common = new Common({ chain, hardfork })
    const sm = createFlatStateManager({ common })
    const engine = new DeterministicIntentEngine({ stateManager: sm, economy: mgr, chain })
    const res = await engine.handle({ text: '/contract', spine, lastQuerySlot: 0 })
    assert.equal(res.widget.kind, 'key_value')
  })
})
