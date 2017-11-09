const ip = require('ip')
const rlp = require('rlp-encoding')
const secp256k1 = require('secp256k1')
const Buffer = require('safe-buffer').Buffer
const { keccak256, int2buffer, buffer2int, assertEq } = require('../util')

function getTimestamp () {
  return (Date.now() / 1000) | 0
}

const timestamp = {
  encode: function (value = getTimestamp() + 60) {
    const buffer = Buffer.allocUnsafe(4)
    buffer.writeUInt32BE(value)
    return buffer
  },
  decode: function (buffer) {
    if (buffer.length !== 4) throw new RangeError(`Invalid timestamp buffer :${buffer.toString('hex')}`)
    return buffer.readUInt32BE(0)
  }
}

const address = {
  encode: function (value) {
    if (ip.isV4Format(value)) return ip.toBuffer(value)
    if (ip.isV6Format(value)) return ip.toBuffer(value)
    throw new Error(`Invalid address: ${value}`)
  },
  decode: function (buffer) {
    if (buffer.length === 4) return ip.toString(buffer)
    if (buffer.length === 16) return ip.toString(buffer)

    const str = buffer.toString()
    if (ip.isV4Format(str) || ip.isV6Format(str)) return str

    // also can be host, but skip it right now (because need async function for resolve)
    throw new Error(`Invalid address buffer: ${buffer.toString('hex')}`)
  }
}

const port = {
  encode: function (value) {
    if (value === null) return Buffer.allocUnsafe(0)
    if ((value >>> 16) > 0) throw new RangeError(`Invalid port: ${value}`)
    return Buffer.from([ (value >>> 8) & 0xff, (value >>> 0) & 0xff ])
  },
  decode: function (buffer) {
    if (buffer.length === 0) return null
    // if (buffer.length !== 2) throw new RangeError(`Invalid port buffer: ${buffer.toString('hex')}`)
    return buffer2int(buffer)
  }
}

const endpoint = {
  encode: function (obj) {
    return [
      address.encode(obj.address),
      port.encode(obj.udpPort),
      port.encode(obj.tcpPort)
    ]
  },
  decode: function (payload) {
    return {
      address: address.decode(payload[0]),
      udpPort: port.decode(payload[1]),
      tcpPort: port.decode(payload[2])
    }
  }
}

const ping = {
  encode: function (obj) {
    return [
      int2buffer(obj.version),
      endpoint.encode(obj.from),
      endpoint.encode(obj.to),
      timestamp.encode(obj.timestamp)
    ]
  },
  decode: function (payload) {
    return {
      version: buffer2int(payload[0]),
      from: endpoint.decode(payload[1]),
      to: endpoint.decode(payload[2]),
      timestamp: timestamp.decode(payload[3])
    }
  }
}

const pong = {
  encode: function (obj) {
    return [
      endpoint.encode(obj.to),
      obj.hash,
      timestamp.encode(obj.timestamp)
    ]
  },
  decode: function (payload) {
    return {
      to: endpoint.decode(payload[0]),
      hash: payload[1],
      timestamp: timestamp.decode(payload[2])
    }
  }
}

const findneighbours = {
  encode: function (obj) {
    return [
      obj.id,
      timestamp.encode(obj.timestamp)
    ]
  },
  decode: function (payload) {
    return {
      id: payload[0],
      timestamp: timestamp.decode(payload[1])
    }
  }
}

const neighbours = {
  encode: function (obj) {
    return [
      obj.peers.map((peer) => endpoint.encode(peer).concat(peer.id)),
      timestamp.encode(obj.timestamp)
    ]
  },
  decode: function (payload) {
    return {
      peers: payload[0].map((data) => {
        return { endpoint: endpoint.decode(data), id: data[3] } // hack for id
      }),
      timestamp: timestamp.decode(payload[1])
    }
  }
}

const messages = { ping, pong, findneighbours, neighbours }

const types = {
  byName: {
    ping: 0x01,
    pong: 0x02,
    findneighbours: 0x03,
    neighbours: 0x04
  },
  byType: {
    0x01: 'ping',
    0x02: 'pong',
    0x03: 'findneighbours',
    0x04: 'neighbours'
  }
}

// [0, 32) data hash
// [32, 96) signature
// 96 recoveryId
// 97 type
// [98, length) data

function encode (typename, data, privateKey) {
  const type = types.byName[typename]
  if (type === undefined) throw new Error(`Invalid typename: ${typename}`)
  const encodedMsg = messages[typename].encode(data)
  const typedata = Buffer.concat([ Buffer.from([ type ]), rlp.encode(encodedMsg) ])

  const sighash = keccak256(typedata)
  const sig = secp256k1.sign(sighash, privateKey)
  const hashdata = Buffer.concat([ sig.signature, Buffer.from([ sig.recovery ]), typedata ])
  const hash = keccak256(hashdata)
  return Buffer.concat([ hash, hashdata ])
}

function decode (buffer) {
  const hash = keccak256(buffer.slice(32))
  assertEq(buffer.slice(0, 32), hash, 'Hash verification failed')

  const typedata = buffer.slice(97)
  const type = typedata[0]
  const typename = types.byType[type]
  if (typename === undefined) throw new Error(`Invalid type: ${type}`)
  const data = messages[typename].decode(rlp.decode(typedata.slice(1)))

  const sighash = keccak256(typedata)
  const signature = buffer.slice(32, 96)
  const recoverId = buffer[96]
  const publicKey = secp256k1.recover(sighash, signature, recoverId, false)

  return { typename, data, publicKey }
}

module.exports = { encode, decode }
