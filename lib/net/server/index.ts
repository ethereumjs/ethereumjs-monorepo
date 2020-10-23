export { Server } from './server'
export { RlpxServer } from './rlpxserver'
export { Libp2pServer } from './libp2pserver'

import { RlpxServer } from './rlpxserver'
import { Libp2pServer } from './libp2pserver'

/**
 * @module net/server
 */

const servers: any = {
  rlpx: RlpxServer,
  libp2p: Libp2pServer,
}

export const fromName = function (name: string) {
  return servers[name]
}
