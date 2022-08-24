import { LesProtocol } from '../net/protocol/lesprotocol'
import { LightSynchronizer } from '../sync/lightsync'

import { EthereumService } from './ethereumservice'

import type { Peer } from '../net/peer/peer'
import type { EthereumServiceOptions } from './ethereumservice'

/**
 * Light Ethereum service
 * @memberof module:service
 */
export class LightEthereumService extends EthereumService {
  public synchronizer: LightSynchronizer

  /**
   * Create new LES service
   */
  constructor(options: EthereumServiceOptions) {
    super(options)

    this.config.logger.info('Light sync mode')
    this.synchronizer = new LightSynchronizer({
      config: this.config,
      pool: this.pool,
      chain: this.chain,
      flow: this.flow,
      interval: this.interval,
    })
  }

  /**
   * Returns all protocols required by this service
   */
  get protocols(): LesProtocol[] {
    return [
      new LesProtocol({
        config: this.config,
        chain: this.chain,
        timeout: this.timeout,
      }),
    ]
  }

  /**
   * Handles incoming message from connected peer
   * @param message message object
   * @param protocol protocol name
   * @param peer peer
   */
  async handle(_message: any, _protocol: string, _peer: Peer) {}
}
