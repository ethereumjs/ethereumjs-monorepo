import { parseDetectiveTriage } from './chainDetective.ts'
import { FixtureReplayTransport, type LlmTransport } from './fixtureEngine.ts'
import { INVESTIGATION_TOOL_NAMES } from './investigationTools.ts'
import { parseLlmJSONObject } from './llmClient.ts'
import { ETHY_USAGE_PLAYBOOK } from './usagePlaybook.ts'

export type SmokeScenarioResult = {
  name: string
  ms: number
  tools: string[]
  headline?: string
  body?: string
  validJSON: boolean
}

const TURN1_SYSTEM = `${ETHY_USAGE_PLAYBOOK}\n\nJSON only. Either { "mode": "investigate", "calls": [{ "tool": "<name>", "args": {} }] } (1-2 tools) OR { "mode": "dispatch", "category": "surge|7702|l2|fee|flow|contract|watch", "severity": "calm|notable|surge", "headline": "<=72 chars", "body": "<=360 chars", "relatedAddress"?: "0x...", "suggestedAction"?: "..." }. Tools: ${INVESTIGATION_TOOL_NAMES.join(', ')}.`

const TURN2_SYSTEM = `${ETHY_USAGE_PLAYBOOK}\n\nJSON only: { "mode": "dispatch", "category": "surge|7702|l2|fee|flow|contract|watch", "severity": "calm|notable|surge", "headline": "<=72 chars", "body": "<=360 chars", "relatedAddress"?: "0x...", "suggestedAction"?: "..." }`

type SmokeScenarioDef = {
  name: string
  digest: Record<string, unknown>
  mockToolResult: Record<string, unknown>
  cannedTurn1: string
  cannedTurn2?: string
}

const SCENARIOS: SmokeScenarioDef[] = [
  {
    name: 'EIP-7702 delegation surge',
    digest: {
      headBlock: '12124050',
      signals: [
        {
          id: 'delegation_surge:0x1234:16',
          kind: 'delegation_surge',
          severity: 'surge',
          noveltyScore: 84,
          headline: 'EIP-7702 delegate cluster (19 auths)',
          address: '0x0000000000000000000000000000000000001234',
          windowBlocks: 16,
          metrics: { count: 19, target: '0x0000000000000000000000000000000000001234' },
        },
      ],
      l2: [],
    },
    mockToolResult: {
      delegateAddress: '0x0000000000000000000000000000000000001234',
      delegationCount: 19,
      revocations: 0,
      proxyKind: 'EIP-1967',
      proxyTarget: '0x0000000000000000000000000000000000004567',
      bytecodeBytes: 148,
      riskCues: ['DELEGATECALL'],
    },
    cannedTurn1: JSON.stringify({
      mode: 'investigate',
      calls: [
        {
          tool: 'inspect_delegations',
          args: { delegateAddress: '0x0000000000000000000000000000000000001234' },
        },
      ],
    }),
    cannedTurn2: JSON.stringify({
      mode: 'dispatch',
      category: '7702',
      severity: 'surge',
      headline: 'EIP-7702 proxy delegation wave at 0x1234',
      body: '19 EOAs delegated to EIP-1967 proxy 0x1234 forwarding to 0x4567 with DELEGATECALL; unknown custom bytecode.',
      relatedAddress: '0x0000000000000000000000000000000000001234',
      suggestedAction: '/contract 0x0000000000000000000000000000000000001234',
    }),
  },
  {
    name: 'L2 blob cost climb',
    digest: {
      headBlock: '12124055',
      signals: [
        {
          id: 'l2_blob_pressure:8',
          kind: 'l2_blob_pressure',
          severity: 'notable',
          noveltyScore: 76,
          headline: 'Blob base fee climbing — L2 batch pressure',
          windowBlocks: 8,
          metrics: { blobBaseFee: '4800000000', streak: 5 },
        },
      ],
      l2: [
        {
          inbox: '0xff00000000000000000000000000000000008453',
          displayName: 'Base Batcher',
          blobCount: 24,
          estimatedEthWei: '15099494400000000',
        },
      ],
    },
    mockToolResult: {
      blobBaseFeeGwei: '4.80',
      inboxes: [
        {
          inbox: '0xff00000000000000000000000000000000008453',
          displayName: 'Base Batcher',
          blobCount: 24,
          estimatedEthWei: '15099494400000000',
        },
      ],
    },
    cannedTurn1: JSON.stringify({
      mode: 'investigate',
      calls: [{ tool: 'inspect_l2_blobs', args: {} }],
    }),
    cannedTurn2: JSON.stringify({
      mode: 'dispatch',
      category: 'l2',
      severity: 'notable',
      headline: 'Base leads rising L2 blob settlement costs',
      body: 'Blob base fee climbed for 5 blocks to 4.80 Gwei; Base Batcher posted 24 blobs (~0.015 ETH).',
      suggestedAction: '/signals',
    }),
  },
  {
    name: 'Quiet normal block',
    digest: {
      headBlock: '12124060',
      signals: [],
      l2: [],
      momentHeadline: 'Block #12124060: 42 accounts touched across 18 storage writes (38% full)',
    },
    mockToolResult: {},
    cannedTurn1: JSON.stringify({
      mode: 'dispatch',
      category: 'watch',
      severity: 'calm',
      headline: 'Quiet chain — steady activity',
      body: 'Block #12124060 ran at 38% gas fullness with no ranked anomalies across the rolling window.',
    }),
  },
]

async function runScenarioOnTransport(
  transport: LlmTransport,
  scenario: SmokeScenarioDef,
): Promise<SmokeScenarioResult> {
  const t0 = Date.now()
  const tools: string[] = []
  let headline: string | undefined
  let body: string | undefined
  let validJSON = false
  try {
    const raw1 = await transport.complete({
      kind: 'pulse',
      messages: [
        { role: 'system', content: TURN1_SYSTEM },
        {
          role: 'user',
          content: JSON.stringify({
            digest: JSON.stringify(scenario.digest),
            journal: [],
            userCues: [],
            trigger: 'pulse',
          }),
        },
      ],
    })
    const triage = parseDetectiveTriage(parseLlmJSONObject(raw1))
    validJSON = triage !== undefined
    if (triage?.mode === 'investigate') {
      const toolResults = triage.calls.map((c) => {
        tools.push(c.tool)
        return { tool: c.tool, result: JSON.stringify(scenario.mockToolResult) }
      })
      const raw2 = await transport.complete({
        kind: 'pulse',
        messages: [
          { role: 'system', content: TURN2_SYSTEM },
          {
            role: 'user',
            content: JSON.stringify({
              digest: JSON.stringify(scenario.digest),
              toolResults,
              journalSnippet: [],
            }),
          },
        ],
      })
      const parsed = parseLlmJSONObject(raw2) as {
        headline?: string
        body?: string
        mode?: string
      }
      if (parsed.mode === 'dispatch' && typeof parsed.headline === 'string') {
        headline = parsed.headline
        body = typeof parsed.body === 'string' ? parsed.body : undefined
        validJSON = true
      } else if (typeof parsed.headline === 'string') {
        headline = parsed.headline
        body = typeof parsed.body === 'string' ? parsed.body : undefined
      }
    } else if (triage?.mode === 'dispatch') {
      headline = triage.card.headline
      body = triage.card.body
    }
  } catch {
    validJSON = false
  }
  return {
    name: scenario.name,
    ms: Date.now() - t0,
    tools,
    headline,
    body,
    validJSON,
  }
}

export async function runSmokeScenarios(transport?: LlmTransport): Promise<SmokeScenarioResult[]> {
  const out: SmokeScenarioResult[] = []
  if (transport !== undefined) {
    for (const sc of SCENARIOS) {
      out.push(await runScenarioOnTransport(transport, sc))
    }
    return out
  }
  for (const sc of SCENARIOS) {
    const canned =
      sc.cannedTurn2 !== undefined ? [sc.cannedTurn1, sc.cannedTurn2] : [sc.cannedTurn1]
    const local = new FixtureReplayTransport(canned)
    out.push(await runScenarioOnTransport(local, sc))
  }
  return out
}
