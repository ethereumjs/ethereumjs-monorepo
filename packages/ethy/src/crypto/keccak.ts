import { keccak_256 as nobleKeccak256 } from '@noble/hashes/sha3.js'

type Keccak256Fn = (data: Uint8Array) => Uint8Array

let keccakImpl: Keccak256Fn = nobleKeccak256
let backend: 'awasm' | 'noble' = 'noble'
let initPromise: Promise<void> | undefined

/** One-shot keccak256 for snap verify and flat state (WASM when {@link initEthyKeccak} succeeded). */
export function ethyKeccak256(data: Uint8Array): Uint8Array {
  return keccakImpl(data)
}

export function ethyKeccakBackend(): 'awasm' | 'noble' {
  return backend
}

/** Load `@awasm/noble` keccak; keeps `@noble/hashes` when the ESM module is unavailable. */
export async function initEthyKeccak(): Promise<void> {
  if (initPromise !== undefined) {
    return initPromise
  }
  initPromise = (async () => {
    try {
      const mod = await import('@awasm/noble')
      keccakImpl = mod.keccak_256 as Keccak256Fn
      backend = 'awasm'
    } catch {
      keccakImpl = nobleKeccak256
      backend = 'noble'
    }
  })()
  return initPromise
}
