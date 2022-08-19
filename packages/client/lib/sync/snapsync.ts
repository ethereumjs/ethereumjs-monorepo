import { Synchronizer } from './sync'

import type { Peer } from '../net/peer/peer'
import type { SynchronizerOptions } from './sync'

interface SnapSynchronizerOptions extends SynchronizerOptions {}

export class SnapSynchronizer extends Synchronizer {
  public running = false
  constructor(options: SnapSynchronizerOptions) {
    super(options)
  }

  /**
   * Returns synchronizer type
   */
  get type() {
    return 'snap'
  }

  /**
   * Open synchronizer. Must be called before sync() is called
   */
  async open(): Promise<void> {}

  /**
   * Returns true if peer can be used for syncing
   */
  syncable(peer: Peer): boolean {
    // Need eth as well to get the latest of the peer
    // TODO: review
    return peer.snap !== undefined && peer.eth !== undefined
  }

  /**
   * Finds the best peer to sync with. We will synchronize to this peer's
   * blockchain. Returns null if no valid peer is found
   */
  async best(): Promise<Peer | undefined> {
    let best: [Peer, bigint] | undefined
    const peers = this.pool.peers.filter(this.syncable.bind(this))
    if (peers.length < this.config.minPeers && !this.forceSync) return
    for (const peer of peers) {
      const latest = await this.latest(peer)
      if (latest) {
        const { number } = latest
        if ((!best && number >= this.chain.blocks.height) || (best && best[1] < number)) {
          best = [peer, number]
        }
      }
    }
    return best ? best[0] : undefined
  }

  /**
   * Get latest header of peer
   */
  async latest(peer: Peer) {
    const result = await peer.eth?.getBlockHeaders({
      block: peer.eth!.status.bestHash,
      max: 1,
    })
    return result ? result[1][0] : undefined
  }

  /**
   * Called from `sync()` to sync blocks and state from peer starting from current height.
   * @param peer remote peer to sync with
   * @returns a boolean if the setup was successful
   */
  async syncWithPeer(peer?: Peer): Promise<boolean> {
    const latest = peer ? await this.latest(peer) : undefined
    if (!latest) return false

    // Just a small snippet to test out the methods manually
    // From/for g11tech:
    //  Clean it up, once we have a full fetcher implemented, else let them
    //  stay commented for easy reference and manual testing
    //
    // const stateRoot = latest.stateRoot
    // const rangeResult = await peer!.snap!.getAccountRange({
    //   root: stateRoot,
    //   origin: Buffer.from(
    //     '0000000000000000000000000000000000000000000000000000000000000000',
    //     'hex'
    //   ),
    //   limit: Buffer.from('0000000000000000000000000f00000000000000000000000000000000000010', 'hex'),
    //   bytes: BigInt(5000000),
    // })

    // console.log({ rangeResult: rangeResult?.accounts[0] })
    // if (rangeResult) {
    //   process.exit()
    // }

    // const height = latest.number
    // if (!this.config.syncTargetHeight || this.config.syncTargetHeight < latest.number) {
    //   this.config.syncTargetHeight = height
    //   this.config.logger.info(`New sync target height=${height} hash=${short(latest.hash())}`)
    // }

    return false
  }

  /**
   * Stop synchronization. Returns a promise that resolves once its stopped.
   */
  async stop(): Promise<boolean> {
    return super.stop()
  }

  /**
   * Close synchronizer.
   */
  async close() {
    if (!this.opened) return
    await super.close()
  }
}
