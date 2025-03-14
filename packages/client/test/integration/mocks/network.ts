import { EventEmitter } from 'eventemitter3'
import { duplexPair } from 'it-pair/duplex'

const Stream = function (protocols: string[]) {
  const [local, remote] = duplexPair()
  return {
    local: (remoteId: string) => ({ ...local, remoteId, protocols }),
    remote: (location: string) => ({ ...remote, location, protocols }),
  }
}

export type Stream = ReturnType<typeof Stream>
export type RemoteStream = ReturnType<Stream['remote']>

interface ServerDetails {
  [key: string]: {
    server: EventEmitter
    streams: {
      [key: string]: Stream
    }
  }
}
export const servers: ServerDetails = {}

export function createServer(location: string) {
  if (servers[location] !== undefined) {
    throw new Error(`Already running a server at ${location}`)
  }
  servers[location] = {
    server: new EventEmitter(),
    streams: {},
  }
  // TODO: Convert to central event bus `Event.SERVER_LISTENING` if needed
  setTimeout(() => servers[location].server.emit('listening'), 10)
  return servers[location].server
}

export function destroyStream(id: string, location: string) {
  if (servers[location] !== undefined) {
    const stream = servers[location].streams[id]
    if (stream !== undefined) {
      delete servers[location].streams[id]
    }
  }
}

export async function destroyServer(location: string) {
  return new Promise<void>((resolve) => {
    for (const id of Object.keys(servers[location].streams)) {
      destroyStream(id, location)
    }
    delete servers[location]
    resolve()
  })
}

export function createStream(id: string, location: string, protocols: string[]) {
  if (servers[location] === undefined) {
    throw new Error(`There is no server at ${location}`)
  }
  const stream = Stream(protocols)
  servers[location].streams[id] = stream
  setTimeout(
    () => servers[location].server.emit('connection', { id, stream: stream.local(id) }),
    10,
  )
  return stream.remote(location)
}
