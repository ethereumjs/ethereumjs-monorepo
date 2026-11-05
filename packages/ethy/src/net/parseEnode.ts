import { hexToBytes } from '@ethereumjs/util'

export type ParsedEnode = {
  id: Uint8Array
  address: string
  tcpPort: number
  udpPort?: number
}

/** Parse `enode://<hex>@host:port` for direct RLPx dial. */
export function parseEnodeUrl(url: string): ParsedEnode {
  const trimmed = url.trim()
  const match = /^enode:\/\/([a-fA-F0-9]+)@([^:/]+):(\d+)(?:\?.*)?$/i.exec(trimmed)
  if (match === null) {
    throw new Error(`Invalid enode URL (expected enode://<id>@host:port): ${url}`)
  }
  const idHex = match[1]!
  const address = match[2]!
  const tcpPort = Number.parseInt(match[3]!, 10)
  if (tcpPort < 1 || tcpPort > 65535) {
    throw new Error(`Invalid TCP port in enode: ${url}`)
  }
  const idHexNorm = (idHex.startsWith('0x') ? idHex : `0x${idHex}`) as `0x${string}`
  const id = hexToBytes(idHexNorm)
  if (id.length !== 64) {
    throw new Error(`enode node id must be 64 bytes (128 hex chars), got ${id.length} bytes`)
  }
  let udpPort: number | undefined
  const disc = /[?&]discport=(\d+)/i.exec(trimmed)
  if (disc !== null) udpPort = Number.parseInt(disc[1]!, 10)
  return { id, address, tcpPort, udpPort }
}
