import { EthereumService, EthereumServiceOptions } from './ethereumservice'
import { Peer } from '../net/peer/peer'
import { LightSynchronizer } from '../sync/lightsync'
import { LesProtocol } from '../net/protocol/lesprotocol'

/**
 * Ethereum service
 * @memberof module:service
 */
export class LightEthereumService extends EthereumService {
  public synchronizer: LightSynchronizer

  /**
   * Create new ETH service
   * @param {Object}   options constructor parameters
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
    return [new LesProtocol({ config: this.config, chain: this.chain, timeout: this.timeout })]
  }

  /**
   * Handles incoming message from connected peer
   * @param  {Object}  message message object
   * @param  {string}  protocol protocol name
   * @param  {Peer}    peer peer
   * @return {Promise}
   */
  async handle(_message: any, _protocol: string, _peer: Peer) {}
}
