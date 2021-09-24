import { Synchronizer } from './sync'

export class BeamSynchronizer extends Synchronizer {
  async sync(): Promise<boolean> {
    return true
  }
}
