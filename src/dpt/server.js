const { EventEmitter } = require('events')
const dgram = require('dgram')
const ms = require('ms')
const createDebugLogger = require('debug')
const LRUCache = require('lru-cache')
const message = require('./message')
const { keccak256, pk2id, createDeferred } = require('../util')

const debug = createDebugLogger('devp2p:dpt:server')
const VERSION = 0x04
const createSocketUDP4 = dgram.createSocket.bind(null, 'udp4')

class Server extends EventEmitter {
  constructor (dpt, privateKey, options) {
    super()

    this._dpt = dpt
    this._privateKey = privateKey

    this._timeout = options.timeout || ms('10s')
    this._endpoint = options.endpoint || { address: '0.0.0.0', udpPort: null, tcpPort: null }
    this._requests = new Map()
    this._parityRequestMap = new Map()
    this._requestsCache = new LRUCache({ max: 1000, maxAge: ms('1s'), stale: false })

    const createSocket = options.createSocket || createSocketUDP4
    this._socket = createSocket()
    this._socket.once('listening', () => this.emit('listening'))
    this._socket.once('close', () => this.emit('close'))
    this._socket.on('error', (err) => this.emit('error', err))
    this._socket.on('message', (msg, rinfo) => {
      try {
        this._handler(msg, rinfo)
      } catch (err) {
        this.emit('error', err)
      }
    })
  }

  bind (...args) {
    this._isAliveCheck()
    debug('call .bind')

    this._socket.bind(...args)
  }

  destroy (...args) {
    this._isAliveCheck()
    debug('call .destroy')

    this._socket.close(...args)
    this._socket = null
  }

  async ping (peer) {
    this._isAliveCheck()

    const rckey = `${peer.address}:${peer.udpPort}`
    const promise = this._requestsCache.get(rckey)
    if (promise !== undefined) return promise

    const hash = this._send(peer, 'ping', {
      version: VERSION,
      from: this._endpoint,
      to: peer
    })

    const deferred = createDeferred()
    const rkey = hash.toString('hex')
    this._requests.set(rkey, {
      peer,
      deferred,
      timeoutId: setTimeout(() => {
        if (this._requests.get(rkey) !== undefined) {
          debug(`ping timeout: ${peer.address}:${peer.udpPort} ${peer.id && peer.id.toString('hex')}`)
          this._requests.delete(rkey)
          deferred.reject(new Error(`Timeout error: ping ${peer.address}:${peer.udpPort}`))
        } else {
          return deferred.promise
        }
      }, this._timeout)
    })
    this._requestsCache.set(rckey, deferred.promise)
    return deferred.promise
  }

  findneighbours (peer, id) {
    this._isAliveCheck()
    this._send(peer, 'findneighbours', { id })
  }

  _isAliveCheck () {
    if (this._socket === null) throw new Error('Server already destroyed')
  }

  _send (peer, typename, data) {
    debug(`send ${typename} to ${peer.address}:${peer.udpPort} (peerId: ${peer.id && peer.id.toString('hex')})`)

    const msg = message.encode(typename, data, this._privateKey)
    // Parity hack
    // There is a bug in Parity up to at lease 1.8.10 not echoing the hash from
    // discovery spec (hash: sha3(signature || packet-type || packet-data))
    // but just hashing the RLP-encoded packet data (see discovery.rs, on_ping())
    // 2018-02-28
    if (typename === 'ping') {
      const rkeyParity = keccak256(msg.slice(98)).toString('hex')
      this._parityRequestMap.set(rkeyParity, msg.slice(0, 32).toString('hex'))
      setTimeout(() => {
        if (this._parityRequestMap.get(rkeyParity) !== undefined) {
          this._parityRequestMap.delete(rkeyParity)
        }
      }, this._timeout)
    }
    this._socket.send(msg, 0, msg.length, peer.udpPort, peer.address)
    return msg.slice(0, 32) // message id
  }

  _handler (msg, rinfo) {
    const info = message.decode(msg)
    const peerId = pk2id(info.publicKey)
    debug(`received ${info.typename} from ${rinfo.address}:${rinfo.port} (peerId: ${peerId.toString('hex')})`)

    // add peer if not in our table
    const peer = this._dpt.getPeer(peerId)
    if (peer === null && info.typename === 'ping' && info.data.from.udpPort !== null) {
      setTimeout(() => this.emit('peers', [ info.data.from ]), ms('100ms'))
    }

    switch (info.typename) {
      case 'ping':
        Object.assign(rinfo, { id: peerId, udpPort: rinfo.port })
        this._send(rinfo, 'pong', {
          to: {
            address: rinfo.address,
            udpPort: rinfo.port,
            tcpPort: info.data.from.tcpPort
          },
          hash: msg.slice(0, 32)
        })
        break

      case 'pong':
        var rkey = info.data.hash.toString('hex')
        const rkeyParity = this._parityRequestMap.get(rkey)
        if (rkeyParity) {
          rkey = rkeyParity
          this._parityRequestMap.delete(rkeyParity)
        }
        const request = this._requests.get(rkey)
        if (request) {
          this._requests.delete(rkey)
          request.deferred.resolve({
            id: peerId,
            address: request.peer.address,
            udpPort: request.peer.udpPort,
            tcpPort: request.peer.tcpPort
          })
        }
        break

      case 'findneighbours':
        Object.assign(rinfo, { id: peerId, udpPort: rinfo.port })
        this._send(rinfo, 'neighbours', {
          peers: this._dpt.getClosestPeers(info.data.id)
        })
        break

      case 'neighbours':
        this.emit('peers', info.data.peers.map((peer) => peer.endpoint))
        break
    }
  }
}

module.exports = Server
