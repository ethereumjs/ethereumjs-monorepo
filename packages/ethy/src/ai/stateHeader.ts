import type { EthySpine } from '../spine/types.ts'

function capSummary(spine: EthySpine): string {
  const { p2p, snap, head } = spine.capabilities
  const fmt = (name: string, c: { status: string; label: string }) =>
    `${name}=${c.status.toUpperCase()}(${c.label})`
  return [fmt('p2p', p2p), fmt('snap', snap), fmt('head', head)].join(', ')
}

export function formatEthyStateHeader(spine: EthySpine, lastQuerySlot?: number): string {
  let slotDelta: string
  if (lastQuerySlot === undefined) {
    slotDelta = 'first query'
  } else {
    const delta = spine.currentSlot - lastQuerySlot
    slotDelta = `+${delta} since last query`
  }
  return `<ethy_state network="${spine.network}" slot="${spine.currentSlot}" slot_delta="${slotDelta}" phase="${spine.phase}">
  capabilities: ${capSummary(spine)}
</ethy_state>`
}
