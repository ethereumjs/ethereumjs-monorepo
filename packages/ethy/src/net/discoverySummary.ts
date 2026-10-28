import type { WorkerDiscoverySnapshot } from '@ethereumjs/devp2p'

/** One-line discovery health for `/diag` and logs. */
export function formatDiscoverySummary(d: WorkerDiscoverySnapshot | undefined): string {
  if (d === undefined) {
    return 'Discovery metrics not available'
  }
  const disc = Object.entries(d.rlpx.disconnects)
    .map(([k, v]) => `${k}:${v}`)
    .join(', ')
  const discPart = disc.length > 0 ? ` rlpxDisc=${disc}` : ''
  return (
    `udp ${d.boundAddress}:${d.boundUdpPort} tcp ${d.boundTcpPort} table=${d.tablePeers}` +
    ` boot ${d.bootstrap.ok}/${d.bootstrap.attempts} fail=${d.bootstrap.fail}` +
    ` dns ${d.dns.peersAdded}/${d.dns.attempts} resolver=${d.dns.resolver ?? '?'}` +
    ` rlpx dial=${d.rlpx.dials} conn=${d.rlpx.connected} status=${d.rlpx.statusOk}${discPart}`
  )
}
