import type {
  CapabilityId,
  DebugSectionSpec,
  DomainHelpSection,
  EthySpine,
  WidgetSpec,
} from '../spine/types.ts'

const DOMAIN_LABEL: Record<CapabilityId, string> = {
  state: 'State',
  economy: 'Economy',
  p2p: 'P2P',
}

function stateSections(): DomainHelpSection[] {
  return [
    {
      title: 'State & Sync Inspection',
      rows: [
        { command: '/buckets', detail: '16-bucket progress, cursors & speeds' },
        { command: '/range [hex]', detail: 'Browse synced accounts by hash prefix' },
        { command: '/sample', detail: 'Top synced accounts ranked by ETH balance' },
        { command: '/account <0x>', detail: 'Inspect account balance, nonce, code & BAL hits' },
        { command: '/bal', detail: 'Latest block access list diff table' },
        { command: '/cl', detail: 'Beacon light client finality & BLS %' },
      ],
    },
    {
      title: 'State Control',
      rows: [
        { command: '/pause · /resume', detail: 'Pause or resume range synchronization' },
        { command: '/reassign <0x>', detail: 'Reassign a stalled bucket' },
      ],
    },
    {
      title: 'Ask in Plain English',
      prompts: [
        'Why is bucket 0x3 slower?',
        'What changed in the latest BAL?',
        'Show top ETH holders',
      ],
    },
  ]
}

function economySections(): DomainHelpSection[] {
  return [
    {
      title: 'Chain & Contract Intelligence',
      rows: [
        { command: '/economy', detail: '64-block fee market, TPS, ETH volume & top contracts' },
        {
          command: '/contract [addr|1..10]',
          detail: 'Bytecode, proxy, ABI calls & events microscope',
        },
      ],
    },
    {
      title: 'Ask in Plain English',
      prompts: [
        'Which contracts write the most storage?',
        'Explain the hottest contract',
        'How is base fee trending?',
      ],
    },
  ]
}

function p2pSections(): DomainHelpSection[] {
  return [
    {
      title: 'Swarm & Diagnostics',
      rows: [
        { command: '/peers', detail: 'Connected client table, caps, ETHY seed & latency' },
        { command: '/ethy', detail: 'ETHY/0 swarm status & served chunks' },
        { command: '/diag', detail: 'Flight-recorder diagnostic ring buffer' },
        { command: '/drop <peerId>', detail: 'Disconnect a peer session' },
      ],
    },
    {
      title: 'Ask in Plain English',
      prompts: [
        'Compare Nethermind vs Geth peers',
        'Who is the fastest peer?',
        'Any handshake anomalies?',
      ],
    },
  ]
}

export function parseHelpDomainArg(parts: string[]): CapabilityId | undefined {
  const arg = parts[1]?.toLowerCase()
  if (arg === 'state' || arg === 'economy' || arg === 'p2p') return arg
  return undefined
}

function domainHelpDebugPage(spine: EthySpine): DebugSectionSpec[] {
  const { economy, state, p2p } = spine.capabilities
  return [
    {
      title: 'Node',
      entries: [
        { key: 'Phase', value: spine.phase },
        { key: 'Network', value: spine.network },
      ],
    },
    {
      title: 'Capabilities',
      entries: [
        { key: 'Economy', value: `${economy.status} (${economy.label})` },
        { key: 'State', value: `${state.status} (${state.label})` },
        { key: 'P2P', value: `${p2p.status} (${p2p.label})` },
      ],
    },
    {
      title: 'Peers',
      entries: [{ key: 'Connected', value: String(spine.peers.size) }],
    },
  ]
}

export function buildDomainHelpWidget(spine: EthySpine, domain: CapabilityId): WidgetSpec {
  const sections =
    domain === 'state' ? stateSections() : domain === 'economy' ? economySections() : p2pSections()
  return { kind: 'domain_help', domain, sections, debugPage: domainHelpDebugPage(spine) }
}

/** Legacy flat command table (tests / carousel). */
export function buildHelpWidget(spine: EthySpine): WidgetSpec {
  return buildDomainHelpWidget(spine, 'economy')
}

export function helpDomainLabel(domain: CapabilityId): string {
  return DOMAIN_LABEL[domain]
}
