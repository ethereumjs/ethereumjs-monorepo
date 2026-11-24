import { bytesToHex } from '@ethereumjs/util'

import { ethyKeccak256 } from '../crypto/keccak.ts'
import { type BytecodeFingerprint, fingerprintBytecode } from './bytecodeFingerprint.ts'
import { lookupFunctionSelector } from './signatureCatalog.ts'

export type KnownSelectorRow = { selector: string; name: string; signature: string }

export type ForensicStaticScan = {
  codeHash: string
  bytecodeSize: number
  fingerprint: BytecodeFingerprint
  knownSelectors: KnownSelectorRow[]
  unknownSelectors: string[]
  embeddedAddresses: string[]
  embeddedStrings: string[]
  compilerHint?: string
  opcodeFlags: {
    create: boolean
    create2: boolean
    delegatecall: boolean
    tstore: boolean
    blobhash: boolean
    selfdestruct: boolean
  }
}

const SOLC_META = new Uint8Array([0xa2, 0x64, 0x69, 0x70, 0x66, 0x73, 0x58, 0x22])

function isTrivialAddress(hex: string): boolean {
  const h = hex.toLowerCase()
  if (h === `0x${'0'.repeat(40)}` || h === `0x${'f'.repeat(40)}`) return true
  if (h.endsWith('dead') && h.startsWith('0x000000000000000000000000000000000000')) return true
  const n = BigInt(h)
  if (n <= 0xffn) return true
  return false
}

function scanPush20(code: Uint8Array): string[] {
  const out: string[] = []
  for (let pc = 0; pc < code.length; pc++) {
    const op = code[pc]!
    if (op >= 0x73 && op <= 0x7b) {
      const width = op - 0x5f
      if (pc + width >= code.length) continue
      const slice = code.subarray(pc + 1, pc + 1 + width)
      if (width < 20) continue
      const addrBytes = slice.subarray(slice.length - 20)
      const hex = bytesToHex(addrBytes)
      if (!isTrivialAddress(hex)) out.push(hex)
      pc += width
    }
  }
  return [...new Set(out)].slice(0, 6)
}

function scanAsciiStrings(code: Uint8Array): string[] {
  const out: string[] = []
  let run = ''
  for (let i = 0; i < code.length; i++) {
    const c = code[i]!
    if (c >= 0x20 && c <= 0x7e) {
      run += String.fromCharCode(c)
    } else {
      if (run.length >= 5) out.push(run)
      run = ''
    }
  }
  if (run.length >= 5) out.push(run)
  return [...new Set(out)].slice(0, 8)
}

function detectCompilerHint(code: Uint8Array): string | undefined {
  for (let i = 0; i < code.length - SOLC_META.length; i++) {
    let ok = true
    for (let j = 0; j < SOLC_META.length; j++) {
      if (code[i + j] !== SOLC_META[j]) {
        ok = false
        break
      }
    }
    if (ok) return 'solc (metadata tail)'
  }
  return undefined
}

function opcodeFlags(code: Uint8Array): ForensicStaticScan['opcodeFlags'] {
  let create = false
  let create2 = false
  let delegatecall = false
  let tstore = false
  let blobhash = false
  let selfdestruct = false
  for (const op of code) {
    if (op === 0xf0) create = true
    if (op === 0xf5) create2 = true
    if (op === 0xf4) delegatecall = true
    if (op === 0x5c) tstore = true
    if (op === 0x49) blobhash = true
    if (op === 0xff) selfdestruct = true
  }
  return { create, create2, delegatecall, tstore, blobhash, selfdestruct }
}

function splitSelectors(fp: BytecodeFingerprint): {
  known: KnownSelectorRow[]
  unknown: string[]
} {
  const known: KnownSelectorRow[] = []
  const unknown: string[] = []
  for (const sel of fp.implementedSelectors) {
    const hit = lookupFunctionSelector(sel)
    if (hit !== undefined) {
      known.push({ selector: sel, name: hit.name, signature: hit.signature })
    } else {
      unknown.push(sel)
    }
  }
  return { known, unknown }
}

export function scanBytecodeForensics(code: Uint8Array): ForensicStaticScan {
  const fingerprint = fingerprintBytecode(code)
  const { known, unknown } = splitSelectors(fingerprint)
  return {
    codeHash: bytesToHex(ethyKeccak256(code)),
    bytecodeSize: code.length,
    fingerprint,
    knownSelectors: known,
    unknownSelectors: unknown,
    embeddedAddresses: scanPush20(code),
    embeddedStrings: scanAsciiStrings(code),
    compilerHint: detectCompilerHint(code),
    opcodeFlags: opcodeFlags(code),
  }
}
