'use strict'

const EventEmitter = require('events')

const Pipe = function (id) {
  const buffer = []
  let closed = false

  return {
    source: (end, cb) => {
      if (closed) end = true
      if (end) return cb(end)
      const next = function () {
        if (closed) return
        if (buffer.length) {
          setTimeout(() => {
            const data = buffer.shift()
            cb(null, data)
          }, 1)
        } else {
          setTimeout(next, 1)
        }
      }
      next()
    },
    sink: (read) => {
      read(null, function next (end, data) {
        if (end === true || closed === true) return
        if (end) throw end
        buffer.push(data)
        read(null, next)
      })
    },
    close: () => {
      closed = true
    }
  }
}

const Connection = function (protocols) {
  const outgoing = new Pipe('OUT')
  const incoming = new Pipe('IN')

  return {
    local: (remoteId) => ({
      source: incoming.source,
      sink: outgoing.sink,
      remoteId,
      protocols
    }),
    remote: (location) => ({
      source: outgoing.source,
      sink: incoming.sink,
      location,
      protocols
    }),
    close: () => {
      incoming.close()
      outgoing.close()
    }
  }
}

const servers = {}

function createServer (location) {
  if (servers[location]) {
    throw new Error(`Already running a server at ${location}`)
  }
  servers[location] = {
    server: new EventEmitter(),
    connections: {}
  }
  setTimeout(() => servers[location].server.emit('listening'), 10)
  return servers[location].server
}

function destroyServer (location) {
  if (servers[location]) {
    for (const id of Object.keys(servers[location].connections)) {
      destroyConnection(id, location)
    }
  }
  delete servers[location]
}

function createConnection (id, location, protocols) {
  if (!servers[location]) {
    throw new Error(`There is no server at ${location}`)
  }
  const connection = new Connection(protocols)
  servers[location].connections[id] = connection
  setTimeout(() => servers[location].server.emit('connection', connection.local(id)), 10)
  return connection.remote(location)
}

function destroyConnection (id, location) {
  if (servers[location]) {
    const conn = servers[location].connections[id]
    if (conn) {
      conn.close()
      delete servers[location].connections[id]
    }
  }
}

exports.createServer = createServer
exports.destroyServer = destroyServer
exports.createConnection = createConnection
exports.destroyConnection = destroyConnection
exports.servers = servers
