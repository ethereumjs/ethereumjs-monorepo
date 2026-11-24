import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { describe, expect, it } from 'vitest'

import { planDossierProbes } from '../src/contracts/contractDossierProbes.ts'
import { ContractDossierStore } from '../src/contracts/contractDossierStore.ts'
import type { ForensicStaticScan } from '../src/contracts/contractForensics.ts'

function minimalScan(
  over: Partial<ForensicStaticScan['fingerprint']['interfaceFlags']> = {},
): ForensicStaticScan {
  return {
    codeHash: '0xab',
    bytecodeSize: 100,
    fingerprint: {
      implementedSelectors: [],
      bytecodeSize: 100,
      truncated: false,
      proxyKind: undefined,
      hasDelegateCall: false,
      pushes1967ImplSlot: false,
      pushes1967BeaconSlot: false,
      opcodeCounts: {
        sstore: 0,
        sload: 0,
        call: 0,
        staticcall: 0,
        delegatecall: 0,
        log1: 0,
        log2: 0,
        log3: 0,
        log4: 0,
      },
      interfaceFlags: {
        erc20: false,
        erc721: false,
        erc1155: false,
        dexPool: false,
        dexRouter: false,
        aa: false,
        weth: false,
        ...over,
      },
    },
    knownSelectors: [],
    unknownSelectors: [],
    embeddedAddresses: [],
    embeddedStrings: [],
    opcodeFlags: {
      create: false,
      create2: false,
      delegatecall: false,
      tstore: false,
      blobhash: false,
      selfdestruct: false,
    },
  }
}

describe('contractDossierProbes', () => {
  it('plans ERC-20 view probes when decimals not cached', () => {
    const fns = planDossierProbes(minimalScan({ erc20: true }))
    expect(fns).toContain('name')
    expect(fns).toContain('symbol')
    expect(fns.length).toBeLessThanOrEqual(4)
  })

  it('skips fields already present or marked miss', () => {
    const fns = planDossierProbes(minimalScan({ erc20: true }), {
      name: 'Token',
      miss: { symbol: true },
    })
    expect(fns).not.toContain('name')
    expect(fns).not.toContain('symbol')
  })
})

describe('ContractDossierStore', () => {
  it('mergeProbes persists across reload', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-dossier-'))
    const store = ContractDossierStore.open(root, 'sepolia')
    expect(store).toBeDefined()
    const addr = '0x00000000000000000000000000000000000000aa'
    store!.upsertStatic(addr, '100', minimalScan({ erc20: true }), undefined, undefined)
    store!.mergeProbes(addr, '101', { name: 'Demo', symbol: 'DMO', probedAtBlock: '101' })
    store!.flush()
    const again = ContractDossierStore.open(root, 'sepolia')!
    expect(again.get(addr)?.probes?.name).toBe('Demo')
    fs.rmSync(root, { recursive: true, force: true })
  })
})
