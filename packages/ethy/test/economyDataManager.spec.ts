import { createBlockHeader } from '@ethereumjs/block'
import { Common, Sepolia } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { createAccessList2930Tx, createFeeMarket1559Tx, createLegacyTx } from '@ethereumjs/tx'
import {
  BlockLevelAccessList,
  type PrefixedHexString,
  bytesToHex,
  createAddressFromString,
  createBlockLevelAccessListFromRLP,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { expandSlashCommand } from '../src/ai/slashComplete.ts'
import { readDomainSnapshots } from '../src/domains/domainManagers.ts'
import {
  SLASH_TOOL_REGISTRY,
  assertRegistryMatchesSlashList,
  registryWriteActions,
} from '../src/domains/toolRegistry.ts'
import { decodeBundle } from '../src/economy/decodeBundle.ts'
import { ETHEconomyDataManager } from '../src/economy/economyDataManager.ts'
import { formatEthFromWei, formatSignedEthFromWei } from '../src/economy/format.ts'
import { activeHardfork, chainConfigForNetwork } from '../src/net/chainHardfork.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import { economyDeepViewWidget } from '../src/tools/economyTools.ts'
import { renderInteractionWidgetBody } from '../src/tui/interactionContent.ts'
import { renderWidgetLines } from '../src/tui/widgets.ts'

function headerAt(
  number: bigint,
  baseFee: bigint,
  balHash?: Uint8Array,
  hardfork = 'amsterdam',
): Uint8Array {
  const common = new Common({ chain: Sepolia, hardfork })
  const header = createBlockHeader(
    {
      number,
      parentHash: new Uint8Array(32),
      stateRoot: new Uint8Array(32),
      gasLimit: 30_000_000n,
      gasUsed: 15_000_000n,
      baseFeePerGas: baseFee,
      blockAccessListHash: balHash,
    },
    { common },
  )
  return header.serialize()
}

function balWithContract(addr: string, writes: number, reads: number, code = false): Uint8Array {
  const bal = new BlockLevelAccessList()
  const storageChanges: Record<string, Array<[number, Uint8Array]>> = {}
  const storageReads = new Set<PrefixedHexString>()
  for (let i = 0; i < writes; i++) {
    const slot = bytesToHex(new Uint8Array([i])) as PrefixedHexString
    storageChanges[slot] = storageChanges[slot] ?? []
    storageChanges[slot]!.push([0, new Uint8Array(32)])
  }
  for (let i = 0; i < reads; i++) {
    storageReads.add(bytesToHex(new Uint8Array([128 + i])) as PrefixedHexString)
  }
  bal.accesses[addr as never] = {
    nonceChanges: new Map(),
    balanceChanges: new Map([[0, '0x01' as never]]),
    codeChanges: code ? [[0, new Uint8Array([1, 2, 3])]] : [],
    storageChanges,
    storageReads,
  }
  return bal.serialize()
}

describe('[Ethy/Economy]: trend and ingest', () => {
  const chain = chainConfigForNetwork('sepolia')
  const hardfork = activeHardfork(chain)

  it('computes base-fee trend with flat threshold', () => {
    const spine = createSpine('sepolia', 11155111n)
    const mgr = new ETHEconomyDataManager({ spine, chain, hardfork })
    const balRlp = balWithContract('0x00000000000000000000000000000000000000c1', 1, 0)
    const bal = createBlockLevelAccessListFromRLP(balRlp)
    const balHash = bal.hash()
    for (let i = 1; i <= 16; i++) {
      const fee = i <= 8 ? 1_000_000_000n + BigInt(i) * 100_000_000n : 2_000_000_000n
      mgr.noteBundle({
        blockNumber: BigInt(i),
        headerRlp: headerAt(BigInt(i), fee, balHash),
        bodyRlp: RLP.encode([[], [], []]),
        receiptsEth69Rlp: RLP.encode([]),
        balRlp,
      })
    }
    assert.equal(spine.economy?.trend, 'up')
    mgr.noteBundle({
      blockNumber: 17n,
      headerRlp: headerAt(17n, 1_100_000_000n, balHash),
      bodyRlp: RLP.encode([[], [], []]),
      receiptsEth69Rlp: RLP.encode([]),
      balRlp,
    })
    assert.isTrue(spine.economy?.trend === 'down' || spine.economy?.trend === 'flat')
  })

  it('aggregates tx value and types', () => {
    const common = new Common({ chain: Sepolia, hardfork: 'amsterdam' })
    const txs = [
      createLegacyTx({ value: 100_000_000_000_000_000n }, { common }).serialize(),
      createAccessList2930Tx({ value: 1_000_000_000_000_000_000n }, { common }).serialize(),
      createFeeMarket1559Tx({ value: 2_000_000_000_000_000_000n }, { common }).serialize(),
    ]
    const bodyRlp = RLP.encode([txs, [], []])
    const record = decodeBundle({
      blockNumber: 99n,
      headerRlp: headerAt(99n, 2_000_000_000n),
      bodyRlp,
      chain,
      hardfork,
    })
    assert.equal(record.txCount, 3)
    assert.equal(record.txTypeSplit.legacy, 1)
    assert.equal(record.txTypeSplit.accessList, 1)
    assert.equal(record.txTypeSplit.feeMarket, 1)
    assert.equal(record.ethTransferredWei, 3_100_000_000_000_000_000n)
    assert.equal(record.largestTransferWei, 2_000_000_000_000_000_000n)
  })

  it('ranks contracts by blocks active in rolling window', () => {
    const spine = createSpine('sepolia', 11155111n)
    const mgr = new ETHEconomyDataManager({ spine, chain, hardfork })
    const hot = '0x000000000000000000000000000000000000aaaa'
    const warm = '0x000000000000000000000000000000000000bbbb'
    for (let n = 1; n <= 4; n++) {
      const balRlp = balWithContract(n <= 3 ? hot : warm, n === 4 ? 50 : 1, 0)
      const bal = createBlockLevelAccessListFromRLP(balRlp)
      mgr.noteBundle({
        blockNumber: BigInt(n),
        headerRlp: headerAt(BigInt(n), 1_000_000_000n, bal.hash()),
        bodyRlp: RLP.encode([[], [], []]),
        receiptsEth69Rlp: RLP.encode([]),
        balRlp,
      })
    }
    const top = spine.economy?.topContracts[0]
    assert.equal(top?.address, hot.toLowerCase())
    assert.equal(top?.blocksActive, 3)
  })

  it('ignores lower block numbers and header-only blocks', () => {
    const spine = createSpine('sepolia', 11155111n)
    const mgr = new ETHEconomyDataManager({ spine, chain, hardfork })
    mgr.noteBundle({
      blockNumber: 10n,
      headerRlp: headerAt(10n, 1_000_000_000n),
      bodyRlp: RLP.encode([[], [], []]),
      receiptsEth69Rlp: RLP.encode([]),
    })
    mgr.noteBundle({
      blockNumber: 9n,
      headerRlp: headerAt(9n, 1_000_000_000n),
      bodyRlp: RLP.encode([[], [], []]),
      receiptsEth69Rlp: RLP.encode([]),
    })
    assert.equal(spine.economy?.latestBlockNumber, '10')
    mgr.noteBundle({
      blockNumber: 11n,
      headerRlp: headerAt(11n, 1_000_000_000n),
    })
    assert.equal(spine.economy?.hasTxBody, false)
    const pairs = mgr.cockpitPairs()
    assert.include(pairs[1]?.value, '—')
  })
})

describe('[Ethy/Economy]: snapshots and tools', () => {
  it('readDomainSnapshots is JSON-plain', () => {
    const spine = createSpine('sepolia', 11155111n)
    const snap = readDomainSnapshots(spine)
    assert.equal(typeof snap.pulse.phase, 'string')
    assert.isFalse('economy' in snap && typeof (snap as { drop?: unknown }).drop === 'function')
    assert.equal(snap.economy.hasBlocks, false)
  })

  it('registry write set and slash expansion', () => {
    assertRegistryMatchesSlashList()
    assert.deepEqual(
      registryWriteActions().sort(),
      ['/drop', '/pause', '/reassign', '/resume', '/send'].sort(),
    )
    assert.equal(expandSlashCommand('/e'), '/economy')
    assert.equal(expandSlashCommand('/et'), '/ethy')
    const writes = SLASH_TOOL_REGISTRY.filter((r) => r.permission === 'write').map((r) => r.command)
    assert.deepEqual(writes.sort(), registryWriteActions().sort())
  })

  it('deep view renders S-Writes and base fee row', () => {
    const spine = createSpine('sepolia', 11155111n)
    const chain = chainConfigForNetwork('sepolia')
    const hardfork = activeHardfork(chain)
    const mgr = new ETHEconomyDataManager({ spine, chain, hardfork })
    const addr = createAddressFromString('0x00000000000000000000000000000000deadbeef').toString()
    const balRlp = balWithContract(addr, 2, 1)
    const bal = createBlockLevelAccessListFromRLP(balRlp)
    mgr.noteBundle({
      blockNumber: 100n,
      headerRlp: headerAt(100n, 2_500_000_000n, bal.hash()),
      bodyRlp: RLP.encode([[], [], []]),
      receiptsEth69Rlp: RLP.encode([]),
      balRlp,
    })
    const widget = economyDeepViewWidget(spine)
    assert.equal(widget.kind, 'table')
    if (widget.kind === 'table') {
      const lines = renderWidgetLines(widget, 100)
      const plain = lines.join('\n')
      assert.include(plain, 'S-Writes')
      assert.include(plain, 'Gwei')
      const bounded = renderInteractionWidgetBody(widget, 80, 18, 'main').join('\n')
      assert.include(bounded, 'Recent blocks')
    }
    const pairs = mgr.cockpitPairs()
    assert.include(pairs[0]?.value, 'Gwei')
    assert.equal(formatEthFromWei(-5_000_000_000_000_000_000n), '-5.0 ETH')
    assert.equal(formatSignedEthFromWei(5_000_000_000_000_000_000n), '+5.0 ETH')
  })
})
