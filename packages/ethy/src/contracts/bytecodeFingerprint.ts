import { bytesToHex } from '@ethereumjs/util'

import {
  EIP1967_BEACON_SLOT,
  EIP1967_IMPLEMENTATION_SLOT,
  SELECTOR,
  lookupFunctionSelector,
} from './signatureCatalog.ts'

export type ProxyKind = 'EIP-1167' | 'EIP-1967' | 'EIP-1967-Beacon' | 'EIP-7702' | undefined

export type BytecodeFingerprint = {
  implementedSelectors: string[]
  bytecodeSize: number
  truncated: boolean
  proxyKind: ProxyKind
  proxyTarget?: string
  hasDelegateCall: boolean
  pushes1967ImplSlot: boolean
  pushes1967BeaconSlot: boolean
  opcodeCounts: {
    sstore: number
    sload: number
    call: number
    staticcall: number
    delegatecall: number
    log1: number
    log2: number
    log3: number
    log4: number
  }
  interfaceFlags: {
    erc20: boolean
    erc721: boolean
    erc1155: boolean
    dexPool: boolean
    dexRouter: boolean
    aa: boolean
    weth: boolean
  }
}

const EIP1167_PREFIX = new Uint8Array([0x36, 0x3d, 0x3d, 0x37, 0x3d, 0x3d, 0x3d, 0x36, 0x3d, 0x73])
const EIP1167_SUFFIX = new Uint8Array([
  0x5a, 0xf4, 0x3d, 0x82, 0x80, 0x3e, 0x90, 0x3d, 0x91, 0x60, 0x2b, 0x57, 0xfd, 0x5b, 0xf3,
])
const EIP7702_PREFIX = new Uint8Array([0xef, 0x01, 0x00])
const MAX_SCAN_BYTES = 48 * 1024

const IMPL_SLOT_BYTES = hexToBytes(EIP1967_IMPLEMENTATION_SLOT)
const BEACON_SLOT_BYTES = hexToBytes(EIP1967_BEACON_SLOT)

function hexToBytes(hex: string): Uint8Array {
  const h = hex.startsWith('0x') ? hex.slice(2) : hex
  const out = new Uint8Array(h.length / 2)
  for (let i = 0; i < out.length; i++) {
    out[i] = Number.parseInt(h.slice(i * 2, i * 2 + 2), 16)
  }
  return out
}

function bytesEqual(a: Uint8Array, b: Uint8Array, offA = 0, offB = 0, len?: number): boolean {
  const n = len ?? b.length
  if (offA + n > a.length || offB + n > b.length) return false
  for (let i = 0; i < n; i++) {
    if (a[offA + i] !== b[offB + i]) return false
  }
  return true
}

function hasSelector(selectors: string[], hex: string): boolean {
  const key = hex.toLowerCase()
  return selectors.some((s) => s.toLowerCase() === key)
}

function classifyInterfaces(selectors: string[]): BytecodeFingerprint['interfaceFlags'] {
  const erc20 =
    hasSelector(selectors, SELECTOR.transfer) &&
    hasSelector(selectors, SELECTOR.balanceOf) &&
    (hasSelector(selectors, SELECTOR.approve) || hasSelector(selectors, SELECTOR.transferFrom))
  const erc721 = hasSelector(selectors, SELECTOR.ownerOf)
  const erc1155 = hasSelector(selectors, SELECTOR.balanceOfBatch)
  const dexPool =
    (hasSelector(selectors, SELECTOR.swapV2) || hasSelector(selectors, SELECTOR.swapV3)) &&
    (hasSelector(selectors, SELECTOR.getReserves) ||
      hasSelector(selectors, SELECTOR.slot0) ||
      hasSelector(selectors, SELECTOR.liquidity))
  const dexRouter =
    hasSelector(selectors, SELECTOR.execute) ||
    hasSelector(selectors, SELECTOR.swapExactTokensForTokens) ||
    hasSelector(selectors, SELECTOR.exactInputSingle)
  const aa =
    hasSelector(selectors, SELECTOR.handleOps) || hasSelector(selectors, SELECTOR.validateUserOp)
  const weth =
    hasSelector(selectors, SELECTOR.deposit) && hasSelector(selectors, SELECTOR.withdraw) && erc20
  return { erc20, erc721, erc1155, dexPool, dexRouter, aa, weth }
}

function pushWidth(op: number): number {
  return op - 0x5f
}

function isDispatcherFollow(code: Uint8Array, start: number): boolean {
  const end = Math.min(code.length, start + 12)
  for (let i = start; i < end; i++) {
    const op = code[i]!
    if (op === 0x14 || op === 0x03) return true
    if (op === 0x11 || op === 0x10) {
      for (let j = i + 1; j < Math.min(code.length, i + 7); j++) {
        if (code[j] === 0x57) return true
      }
    }
  }
  return false
}

function scanPush32Slot(code: Uint8Array, pc: number, slot: Uint8Array): boolean {
  const w = pushWidth(code[pc]!)
  if (w !== 32 || pc + 32 >= code.length) return false
  return bytesEqual(code, slot, pc + 1, 0, 32)
}

export function fingerprintBytecode(code: Uint8Array): BytecodeFingerprint {
  const truncated = code.length > MAX_SCAN_BYTES
  const scan = truncated ? code.subarray(0, MAX_SCAN_BYTES) : code
  const implementedSelectors: string[] = []
  const counts = {
    sstore: 0,
    sload: 0,
    call: 0,
    staticcall: 0,
    delegatecall: 0,
    log1: 0,
    log2: 0,
    log3: 0,
    log4: 0,
  }
  let hasDelegateCall = false
  let pushes1967ImplSlot = false
  let pushes1967BeaconSlot = false

  for (let pc = 0; pc < scan.length; ) {
    const op = scan[pc]!
    if (op >= 0x60 && op <= 0x7f) {
      const w = pushWidth(op)
      if (op === 0x63 && pc + 4 < scan.length && isDispatcherFollow(scan, pc + 5)) {
        const raw = bytesToHex(scan.subarray(pc + 1, pc + 5))
        const sel = raw.startsWith('0x') ? raw.toLowerCase() : `0x${raw}`.toLowerCase()
        if (!implementedSelectors.includes(sel)) implementedSelectors.push(sel)
      }
      if (w === 32) {
        if (scanPush32Slot(scan, pc, IMPL_SLOT_BYTES)) pushes1967ImplSlot = true
        if (scanPush32Slot(scan, pc, BEACON_SLOT_BYTES)) pushes1967BeaconSlot = true
      }
      pc += 1 + w
      continue
    }
    if (op === 0x55) counts.sstore += 1
    else if (op === 0x54) counts.sload += 1
    else if (op === 0xf1) counts.call += 1
    else if (op === 0xfa) counts.staticcall += 1
    else if (op === 0xf4) {
      counts.delegatecall += 1
      hasDelegateCall = true
    } else if (op === 0xa1) counts.log1 += 1
    else if (op === 0xa2) counts.log2 += 1
    else if (op === 0xa3) counts.log3 += 1
    else if (op === 0xa4) counts.log4 += 1
    pc += 1
  }

  let proxyKind: ProxyKind
  let proxyTarget: string | undefined
  if (code.length === 23 && bytesEqual(code, EIP7702_PREFIX, 0, 0, 3)) {
    proxyKind = 'EIP-7702'
    proxyTarget = `0x${bytesToHex(code.subarray(3, 23))}`
  } else if (
    code.length >= EIP1167_PREFIX.length + 20 + EIP1167_SUFFIX.length &&
    bytesEqual(code, EIP1167_PREFIX) &&
    bytesEqual(code, EIP1167_SUFFIX, EIP1167_PREFIX.length + 20, 0)
  ) {
    proxyKind = 'EIP-1167'
    proxyTarget = `0x${bytesToHex(code.subarray(EIP1167_PREFIX.length, EIP1167_PREFIX.length + 20))}`
  } else if (hasDelegateCall && pushes1967ImplSlot) {
    proxyKind = 'EIP-1967'
  } else if (hasDelegateCall && pushes1967BeaconSlot) {
    proxyKind = 'EIP-1967-Beacon'
  } else {
    proxyKind = undefined
  }

  return {
    implementedSelectors,
    bytecodeSize: code.length,
    truncated,
    proxyKind,
    proxyTarget,
    hasDelegateCall,
    pushes1967ImplSlot,
    pushes1967BeaconSlot,
    opcodeCounts: counts,
    interfaceFlags: classifyInterfaces(implementedSelectors),
  }
}

export function selectorLabel(sel: string): string {
  const row = lookupFunctionSelector(sel)
  return row !== undefined ? `${row.name}` : sel
}
