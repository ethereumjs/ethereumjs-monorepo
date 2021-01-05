import { debug as createDebugLogger } from 'debug'
import ip from 'ip'
import * as rlp from 'rlp'
import secp256k1 from 'secp256k1'
import { keccak256, int2buffer, buffer2int, assertEq, unstrictDecode } from '../util'
import { PeerInfo } from './dpt'

const debug = createDebugLogger('devp2p:dpt:server')

function getTimestamp() {
  return (Date.now() / 1000) | 0
}

const timestamp = {
  encode: function (value = getTimestamp() + 60) {
    const buffer = Buffer.allocUnsafe(4)
    buffer.writeUInt32BE(value, 0)
    return buffer
  },
  decode: function (buffer: Buffer) {
    if (buffer.length !== 4)
      throw new RangeError(`Invalid timestamp buffer :${buffer.toString('hex')}`)
    return buffer.readUInt32BE(0)
  },
}

const address = {
  encode: function (value: string) {
    if (ip.isV4Format(value)) return ip.toBuffer(value)
    if (ip.isV6Format(value)) return ip.toBuffer(value)
    throw new Error(`Invalid address: ${value}`)
  },
  decode: function (buffer: Buffer) {
    if (buffer.length === 4) return ip.toString(buffer)
    if (buffer.length === 16) return ip.toString(buffer)

    const str = buffer.toString()
    if (ip.isV4Format(str) || ip.isV6Format(str)) return str

    // also can be host, but skip it right now (because need async function for resolve)
    throw new Error(`Invalid address buffer: ${buffer.toString('hex')}`)
  },
}

const port = {
  encode: function (value: number | null): Buffer {
    if (value === null) return Buffer.allocUnsafe(0)
    if (value >>> 16 > 0) throw new RangeError(`Invalid port: ${value}`)
    return Buffer.from([(value >>> 8) & 0xff, (value >>> 0) & 0xff])
  },
  decode: function (buffer: Buffer): number | null {
    if (buffer.length === 0) return null
    // if (buffer.length !== 2) throw new RangeError(`Invalid port buffer: ${buffer.toString('hex')}`)
    return buffer2int(buffer)
  },
}

const endpoint = {
  encode: function (obj: PeerInfo): Buffer[] {
    return [
      address.encode(obj.address!),
      port.encode(obj.udpPort || null),
      port.encode(obj.tcpPort || null),
    ]
  },
  decode: function (payload: Buffer[]): PeerInfo {
    return {
      address: address.decode(payload[0]),
      udpPort: port.decode(payload[1]),
      tcpPort: port.decode(payload[2]),
    }
  },
}

type InPing = { [0]: Buffer; [1]: Buffer[]; [2]: Buffer[]; [3]: Buffer }
type OutPing = { version: number; from: PeerInfo; to: PeerInfo; timestamp: number }
const ping = {
  encode: function (obj: OutPing): InPing {
    return [
      int2buffer(obj.version),
      endpoint.encode(obj.from),
      endpoint.encode(obj.to),
      timestamp.encode(obj.timestamp),
    ]
  },
  decode: function (payload: InPing): OutPing {
    return {
      version: buffer2int(payload[0]),
      from: endpoint.decode(payload[1]),
      to: endpoint.decode(payload[2]),
      timestamp: timestamp.decode(payload[3]),
    }
  },
}

type OutPong = { to: PeerInfo; hash: Buffer; timestamp: number }
type InPong = { [0]: Buffer[]; [1]: Buffer[]; [2]: Buffer }
const pong = {
  encode: function (obj: OutPong) {
    return [endpoint.encode(obj.to), obj.hash, timestamp.encode(obj.timestamp)]
  },
  decode: function (payload: InPong) {
    return {
      to: endpoint.decode(payload[0]),
      hash: payload[1],
      timestamp: timestamp.decode(payload[2]),
    }
  },
}

type OutFindMsg = { id: string; timestamp: number }
type InFindMsg = { [0]: string; [1]: Buffer }
const findneighbours = {
  encode: function (obj: OutFindMsg): InFindMsg {
    return [obj.id, timestamp.encode(obj.timestamp)]
  },
  decode: function (payload: InFindMsg): OutFindMsg {
    return {
      id: payload[0],
      timestamp: timestamp.decode(payload[1]),
    }
  },
}

type InNeighborMsg = { peers: PeerInfo[]; timestamp: number }
type OutNeighborMsg = { [0]: Buffer[][]; [1]: Buffer }
const neighbours = {
  encode: function (obj: InNeighborMsg): OutNeighborMsg {
    return [
      obj.peers.map((peer: PeerInfo) => endpoint.encode(peer).concat(peer.id! as Buffer)),
      timestamp.encode(obj.timestamp),
    ]
  },
  decode: function (payload: OutNeighborMsg): InNeighborMsg {
    return {
      peers: payload[0].map((data) => {
        return { endpoint: endpoint.decode(data), id: data[3] } // hack for id
      }),
      timestamp: timestamp.decode(payload[1]),
    }
  },
}

const messages: any = { ping, pong, findneighbours, neighbours }

type Types = { [index: string]: { [index: string]: number | string } }
const types: Types = {
  byName: {
    ping: 0x01,
    pong: 0x02,
    findneighbours: 0x03,
    neighbours: 0x04,
  },
  byType: {
    0x01: 'ping',
    0x02: 'pong',
    0x03: 'findneighbours',
    0x04: 'neighbours',
  },
}

// [0, 32) data hash
// [32, 96) signature
// 96 recoveryId
// 97 type
// [98, length) data

export function encode<T>(typename: string, data: T, privateKey: Buffer) {
  const type: number = types.byName[typename] as number
  if (type === undefined) throw new Error(`Invalid typename: ${typename}`)
  const encodedMsg = messages[typename].encode(data)
  const typedata = Buffer.concat([Buffer.from([type]), rlp.encode(encodedMsg)])

  const sighash = keccak256(typedata)
  const sig = secp256k1.ecdsaSign(sighash, privateKey)
  const hashdata = Buffer.concat([Buffer.from(sig.signature), Buffer.from([sig.recid]), typedata])
  const hash = keccak256(hashdata)
  return Buffer.concat([hash, hashdata])
}

export function decode(buffer: Buffer) {
  const hash = keccak256(buffer.slice(32))
  assertEq(buffer.slice(0, 32), hash, 'Hash verification failed', debug)

  const typedata = buffer.slice(97)
  const type = typedata[0]
  const typename = types.byType[type]
  if (typename === undefined) throw new Error(`Invalid type: ${type}`)
  const data = messages[typename].decode(unstrictDecode(typedata.slice(1)))

  const sighash = keccak256(typedata)
  const signature = buffer.slice(32, 96)
  const recoverId = buffer[96]
  const publicKey = Buffer.from(secp256k1.ecdsaRecover(signature, recoverId, sighash, false))

  return { typename, data, publicKey }
}
