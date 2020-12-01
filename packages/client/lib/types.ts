export type Key = Buffer
export type KeyLike = string | Key

export type Multiaddrs = string[]
export type MultiaddrsLike = string | Multiaddrs

export interface Bootnode {
  id?: string | null
  ip: string | null
  port: number
}
export type BootnodeLike = string | string[] | Bootnode | Bootnode[]
