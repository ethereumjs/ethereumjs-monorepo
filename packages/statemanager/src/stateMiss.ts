export type StateResolutionPolicy = 'full' | 'swarm-only' | 'local-only'

export type StateMissKind = 'account' | 'storage' | 'code'

export type AccountMissResult = Uint8Array | 'empty' | undefined
export type StorageMissResult = Uint8Array | 'empty' | undefined
export type CodeMissResult = Uint8Array | undefined

/** Thrown when an open-world bucket cannot resolve a key (false-zero safety). */
export class StateMissUnavailableError extends Error {
  public readonly code = 'STATE_MISS_UNAVAILABLE' as const
  public readonly kind: StateMissKind
  public readonly key: Uint8Array

  constructor(kind: StateMissKind, key: Uint8Array, message?: string) {
    super(message ?? `State miss unavailable (${kind})`)
    this.name = 'StateMissUnavailableError'
    this.kind = kind
    this.key = key
  }
}
