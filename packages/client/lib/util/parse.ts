import { Multiaddr, multiaddr } from 'multiaddr'
import { URL } from 'url'

import type { MultiaddrLike } from '../types'
import type { Common } from '@ethereumjs/common'

/**
 * Parses multiaddrs and bootnodes to multiaddr format.
 * @param input comma separated string
 */
export function parseMultiaddrs(input: MultiaddrLike): Multiaddr[] {
  if (input === '') {
    return []
  }
  if (!Array.isArray(input) && typeof input === 'object') {
    return [input] as Multiaddr[]
  }
  if (Array.isArray(input)) {
    // Comma-separated bootnodes
    if (input.length === 1 && typeof input[0] === 'string' && input[0].includes(',')) {
      input = input[0].split(',')
    }
  } else {
    input = input.split(',')
  }
  try {
    return (input as string[]).map((s) => {
      if (Multiaddr.isMultiaddr(s)) {
        return s
      }
      // parse as multiaddr
      if (s[0] === '/') {
        return multiaddr(s)
      }
      // parse as object
      if (typeof s === 'object') {
        const { ip, port } = s as any
        if (ip !== undefined && port !== undefined) {
          return multiaddr(`/ip4/${ip}/tcp/${port}`)
        }
      }
      // parse as ip:port
      const match = s.match(/^(\d+\.\d+\.\d+\.\d+):([0-9]+)$/)
      if (match) {
        const [_, ip, port] = match
        return multiaddr(`/ip4/${ip}/tcp/${port}`)
      }
      // parse using WHATWG URL API
      const { hostname: ip, port } = new URL(s)
      if (ip && port) {
        return multiaddr(`/ip4/${ip}/tcp/${port}`)
      }
      throw new Error(`Unable to parse bootnode URL: ${s}`)
    })
  } catch (e: any) {
    throw new Error(`Invalid bootnode URLs: ${e.message}`)
  }
}

export function parseTransports(transports: string[]) {
  return transports.map((t) => {
    const options: { [key: string]: string } = {}
    const [name, ...pairs] = t.split(':')
    if (pairs.length) {
      for (const p of pairs.join(':').split(',')) {
        const [key, value] = p.split('=')
        options[key] = value
      }
    }
    return { name, options }
  })
}

/**
 * Returns Buffer from input hexadecimal string or Buffer
 * @param input hexadecimal string or Buffer
 */
export function parseKey(input: string | Buffer) {
  if (Buffer.isBuffer(input)) {
    return input
  }
  return Buffer.from(input, 'hex')
}

/**
 * Sets any missing forkHashes on the passed-in {@link Common} instance
 * @param common The {@link Common} to set the forkHashes for
 * @param genesisHash The genesis block hash
 */
export function setCommonForkHashes(common: Common, genesisHash: Buffer) {
  for (const hf of (common as any)._chainParams.hardforks) {
    if (
      (hf.forkHash === null || hf.forkhash === undefined) &&
      typeof hf.block !== 'undefined' &&
      (hf.block !== null || typeof hf.td !== 'undefined')
    ) {
      hf.forkHash = common.forkHash(hf.name, genesisHash)
    }
  }
}
