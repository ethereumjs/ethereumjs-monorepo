import { EthereumService } from './ethereumservice'
import { Peer } from '../net/peer/peer'
import { LightSynchronizer } from '../sync/lightsync'
import { LesProtocol } from '../net/protocol/lesprotocol'

/**
 * Ethereum service
 * @memberof module:service
 */
export class LightEthereumService extends EthereumService {
  /**
   * Create new ETH service
   * @param {Object}   options constructor parameters
   * @param {Server[]} options.servers servers to run service on
   * @param {Chain}    [options.chain] blockchain
   * @param {number}   [options.minPeers=3] number of peers needed before syncing
   * @param {number}   [options.maxPeers=25] maximum peers allowed
   * @param {number}   [options.interval] sync retry interval
   */
  constructor(options?: any) {
    super(options)
    this.init()
  }

  init() {
    this.config.logger.info('Light sync mode')
    this.synchronizer = new LightSynchronizer({
      pool: this.pool,
      chain: this.chain,
      common: this.config.common,
      minPeers: this.minPeers,
      flow: this.flow,
      interval: this.interval,
    })
  }

  /**
   * Returns all protocols required by this service
   */
  get protocols(): LesProtocol[] {
    return [new LesProtocol({ chain: this.chain, timeout: this.timeout })]
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
