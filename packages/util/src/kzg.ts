import type { loadKZG } from 'kzg-wasm'
/**
 * Interface for an externally provided kzg library used when creating blob transactions
 */
export type KZG = Awaited<ReturnType<typeof loadKZG>>
