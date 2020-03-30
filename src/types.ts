export type BufferCallback = (err?: Error | null, value?: Buffer | null) => void
export type ProveCallback = (err?: Error | null, proof?: Buffer[] | null) => void
export type ErrorCallback = (err?: Error | null) => void
