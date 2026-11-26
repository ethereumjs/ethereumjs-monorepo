/** WP-16f: when true, worker forwards `GET_STATE_WITNESS` to the main thread. */
export function deferEthyWitnessToMain(liveProofMode: boolean, msgName: string): boolean {
  return liveProofMode && msgName === 'GET_STATE_WITNESS'
}
