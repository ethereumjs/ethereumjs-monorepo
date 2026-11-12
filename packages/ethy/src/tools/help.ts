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

function economySections(): { sections: DomainHelpSection[]; aiExamples: string[] } {
  return {
    sections: [
      {
        title: 'Economy Commands',
        rows: [
          { command: '/live · /plaza', detail: 'Ethereum Plaza observatory' },
          { command: '/economy', detail: '64-block gas, TPS & volume' },
          { command: '/contract', detail: 'Hot contract #1 microscope' },
          { command: '/contract <N>', detail: 'Inspect leaderboard #1..10' },
          { command: '/contract <0x>', detail: 'Bytecode, proxy & ABI lens' },
        ],
      },
    ],
    aiExamples: [
      'How is base fee trending?',
      'Which contracts write most?',
      'Explain the hottest contract',
      'Show contracts with >10 writes',
      'What is current TPS & volume?',
    ],
  }
}

function stateSections(): { sections: DomainHelpSection[]; aiExamples: string[] } {
  return {
    sections: [
      {
        title: 'State Commands',
        rows: [
          { command: '/buckets', detail: '16-bucket sync & cursors' },
          { command: '/range [hex]', detail: 'Browse accounts by prefix' },
          { command: '/sample', detail: 'Top accounts by balance' },
          { command: '/account <0x>', detail: 'Balance, nonce & code' },
          { command: '/bal', detail: 'Latest BAL state diffs' },
          { command: '/cl', detail: 'Beacon finality & BLS %' },
          { command: '/simulate <to> <data>', detail: 'EVM microscope at head' },
        ],
      },
      {
        title: 'State Control',
        rows: [
          { command: '/pause · /resume', detail: 'Pause or resume range sync' },
          { command: '/reassign <0x>', detail: 'Reassign stalled bucket' },
        ],
      },
    ],
    aiExamples: [
      'Why is bucket 0x3 slower?',
      'What changed in the latest BAL?',
      'Show top ETH holders',
      'How far is sync from head?',
      'Is head verified by CL?',
    ],
  }
}

function p2pSections(): { sections: DomainHelpSection[]; aiExamples: string[] } {
  return {
    sections: [
      {
        title: 'P2P Commands',
        rows: [
          { command: '/peers', detail: 'Client table, caps & RTT' },
          { command: '/ethy', detail: 'ETHY/0 swarm & serve stats' },
          { command: '/rpc', detail: 'JSON-RPC status & methods' },
          { command: '/diag', detail: 'Diagnostic ring buffer' },
          { command: '/drop <peerId>', detail: 'Disconnect peer session' },
          { command: '/send <signedTxHex>', detail: 'Submit raw tx to the pool' },
        ],
      },
    ],
    aiExamples: [
      'Compare Nethermind vs Reth peers',
      'Who is the fastest peer?',
      'Any handshake anomalies?',
      'How many peers serve snap?',
      'Show peers by snap replies',
    ],
  }
}

const UNIFIED_AI_EXAMPLES = [
  'How is base fee trending?',
  'Explain the hottest contract',
  'What changed in the latest BAL?',
  'Show top ETH holders',
  'Compare Nethermind vs Reth peers',
  'Any handshake or sync anomalies?',
]

export function parseHelpDomainArg(parts: string[]): CapabilityId | undefined {
  const arg = parts[1]?.toLowerCase()
  if (arg === 'state' || arg === 'economy' || arg === 'p2p') return arg
  return undefined
}

function domainHelpDebugPage(spine: EthySpine, domain: CapabilityId): DebugSectionSpec[] {
  const { economy, state, p2p, ai } = spine.capabilities
  if (domain === 'p2p') {
    const d = spine.discovery
    const s = spine.serving
    return [
      {
        title: 'Discovery funnel',
        entries:
          d === undefined
            ? [{ key: 'Status', value: 'Metrics unavailable' }]
            : [
                { key: 'DPT table', value: String(d.tablePeers) },
                { key: 'RLPx dials', value: String(d.rlpx.dials) },
                { key: 'Connected', value: String(d.rlpx.connected) },
                { key: 'STATUS ok', value: String(d.rlpx.statusOk) },
              ],
      },
      {
        title: 'Serving & identity',
        entries: [
          { key: 'Peers', value: String(spine.peers.size) },
          {
            key: 'Served',
            value: s !== undefined ? `${s.totalRequestsServed} replies` : '0 replies',
          },
          { key: 'Enode', value: d?.localEnode ?? '—' },
        ],
      },
    ]
  }
  if (domain === 'economy') {
    const econ = spine.economy
    return [
      {
        title: 'Economy window',
        entries: [
          { key: 'Latest block', value: econ?.latestBlockNumber ?? '—' },
          { key: 'Base fee', value: econ?.baseFeeGwei ? `${econ.baseFeeGwei} Gwei` : '—' },
          { key: 'Tracked contracts', value: String(econ?.topContracts.length ?? 0) },
          { key: 'Recent blocks', value: String(econ?.recentBlocks.length ?? 0) },
        ],
      },
      {
        title: 'Capabilities',
        entries: [
          { key: 'Economy', value: `${economy.status} (${economy.label})` },
          { key: 'AI', value: `${ai.status} (${ai.label})` },
        ],
      },
    ]
  }
  return [
    {
      title: 'State sync',
      entries: [
        { key: 'Phase', value: spine.phase },
        { key: 'Accounts', value: spine.totalAccountsSynced.toLocaleString('en-US') },
        {
          key: 'Bytecode',
          value: `${spine.codesSynced}/${spine.codesTotal ?? spine.codesSynced + spine.codesQueued}`,
        },
        {
          key: 'Storage acc',
          value: `${spine.storageAccountsSynced ?? 0}/${spine.storageAccountsTotal ?? 0}`,
        },
      ],
    },
    {
      title: 'Capabilities',
      entries: [
        { key: 'State', value: `${state.status} (${state.label})` },
        { key: 'P2P', value: `${p2p.status} (${p2p.label})` },
        { key: 'AI', value: `${ai.status} (${ai.label})` },
      ],
    },
  ]
}

function unifiedHelpDebugPage(spine: EthySpine): DebugSectionSpec[] {
  const { economy, state, p2p } = spine.capabilities
  const rpcListen = spine.rpc?.listening === true ? 'listening' : 'off'
  return [
    {
      title: 'Capabilities',
      entries: [
        { key: 'Economy', value: `${economy.status} (${economy.label})` },
        { key: 'State', value: `${state.status} (${state.label})` },
        { key: 'P2P', value: `${p2p.status} (${p2p.label})` },
        { key: 'JSON-RPC', value: rpcListen },
      ],
    },
  ]
}

export function buildDomainHelpWidget(spine: EthySpine, domain: CapabilityId): WidgetSpec {
  const spec =
    domain === 'state' ? stateSections() : domain === 'economy' ? economySections() : p2pSections()
  return {
    kind: 'domain_help',
    domain,
    sections: spec.sections,
    aiExamples: spec.aiExamples,
    debugPage: domainHelpDebugPage(spine, domain),
  }
}

export function buildHelpWidget(spine: EthySpine): WidgetSpec {
  const sections: DomainHelpSection[] = [
    {
      column: 'left',
      domain: 'economy',
      title: 'Economy',
      rows: [
        { command: '/live · /plaza', detail: 'Ethereum Plaza observatory' },
        { command: '/economy', detail: '64-block gas, TPS & volume' },
        { command: '/contract [N|0x]', detail: 'Contract & ABI microscope' },
      ],
    },
    {
      column: 'left',
      domain: 'state',
      title: 'State',
      rows: [
        { command: '/buckets', detail: '16-bucket sync & cursors' },
        { command: '/account <0x>', detail: 'Balance, nonce & code' },
        { command: '/bal', detail: 'Latest BAL state diffs' },
        { command: '/cl', detail: 'Beacon finality & BLS %' },
        { command: '/simulate <to> <data>', detail: 'EVM call microscope at head' },
        { command: '/range [hex] · /sample', detail: 'Browse or sample accounts' },
        { command: '/pause · /resume · /reassign', detail: 'Control range sync' },
      ],
    },
    {
      column: 'right',
      domain: 'p2p',
      title: 'P2P',
      rows: [
        { command: '/peers', detail: 'Client table, caps & RTT' },
        { command: '/ethy', detail: 'ETHY/0 swarm & serve stats' },
        { command: '/rpc', detail: 'JSON-RPC status & methods' },
        { command: '/diag', detail: 'Diagnostic ring buffer' },
        { command: '/send <txHex> · /drop <id>', detail: 'Broadcast tx or drop peer' },
      ],
    },
  ]
  return {
    kind: 'domain_help',
    unified: true,
    sections,
    aiExamples: UNIFIED_AI_EXAMPLES,
    debugPage: unifiedHelpDebugPage(spine),
  }
}

export function helpDomainLabel(domain: CapabilityId): string {
  return DOMAIN_LABEL[domain]
}
