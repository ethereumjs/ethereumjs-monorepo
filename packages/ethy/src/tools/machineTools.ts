import type { DebugSectionSpec, EthySpine, MachinePlaneStatus, WidgetSpec } from '../spine/types.ts'

function planeGlyph(status: MachinePlaneStatus | undefined): string {
  if (status === 'active') return '●'
  if (status === 'prewarming' || status === 'standby') return '◐'
  return '○'
}

function clCadence(spine: EthySpine): string {
  const cl = spine.machine?.planes.cl
  if (spine.clStatus === 'p2p_only') return 'off (p2p only)'
  if (cl === 'off') return 'off'
  if (cl === 'active') return '12s slot poll'
  return '60s standby poll'
}

export function machineMicroscopeWidget(spine: EthySpine): WidgetSpec {
  const m = spine.machine
  const planes = m?.planes
  const mask = spine.ethyBucketsBitmask ?? 0
  const bucketBits = mask.toString(2).replace(/0/g, '').length
  return {
    kind: 'table',
    title: 'Sync network machine',
    headers: ['Field', 'Value'],
    rows: [
      ['Mode', m !== undefined ? `${m.mode} (${m.modeReason})` : '—'],
      ['Next event', m?.nextEventSummary ?? '—'],
      [
        'Planes',
        planes !== undefined
          ? `eth ${planeGlyph(planes.eth)} · ethy ${planeGlyph(planes.ethy)} · snap ${planeGlyph(planes.snap)} · disc ${planeGlyph(planes.discovery)}`
          : '—',
      ],
      ['CL beacon', clCadence(spine)],
      ['ETHY serving', m?.servingEthy ?? '—'],
      ['ENR ethy tag', m?.ethyDiscoveryTag === true ? 'on' : 'off'],
      [
        'Servable window',
        `${spine.serving?.earliestBlock ?? '—'}..${spine.serving?.latestBlock ?? '—'}`,
      ],
      ['Bucket mask', `${bucketBits}/16 (0x${mask.toString(16)})`],
      ['Discovery mode', m?.discoveryMode ?? '—'],
      ['VIP target', m?.vipTarget !== undefined ? String(m.vipTarget) : '—'],
    ],
    debugPage: machineDebugSections(spine),
  }
}

export function machineDebugSections(spine: EthySpine): DebugSectionSpec[] {
  const lines = spine.machine?.transitions ?? []
  return [
    {
      title: 'Plane transitions (last 24)',
      entries:
        lines.length > 0
          ? lines.map((line, i) => ({ key: String(i + 1), value: line }))
          : [{ key: '—', value: 'No transitions yet' }],
    },
  ]
}
