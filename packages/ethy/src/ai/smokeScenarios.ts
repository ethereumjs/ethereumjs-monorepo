import { parseDetectiveTriage } from './chainDetective.ts'
import { FixtureReplayTransport, type LlmTransport } from './fixtureEngine.ts'
import { INVESTIGATION_TOOL_NAMES } from './investigationTools.ts'
import { parseLlmJSONObject } from './llmClient.ts'
import { parseStoryOutput as parseProse } from './parseStoryOutput.ts'
import { buildScoutSystem } from './storyNarrator.ts'

export type SmokeScenarioResult = {
  name: string
  ms: number
  tools: string[]
  headline?: string
  story?: string
  validJSON: boolean
}

type SmokeScenarioDef = {
  name: string
  brief: Record<string, unknown>
  mockToolResult: Record<string, unknown>
  cannedTurn1: string
  cannedTurn2: string
}

const SCENARIOS: SmokeScenarioDef[] = [
  {
    name: 'Mainnet EIP-7702 unknown proxy',
    brief: {
      network: 'mainnet',
      signals: [
        {
          kind: 'delegation_surge',
          headline: 'EIP-7702 delegate cluster',
          noveltyScore: 84,
        },
      ],
    },
    mockToolResult: { delegationCount: 19, proxyKind: 'EIP-1967', riskCues: ['DELEGATECALL'] },
    cannedTurn1: JSON.stringify({
      mode: 'investigate',
      calls: [{ tool: 'inspect_delegations', args: { delegateAddress: '0x1234' } }],
    }),
    cannedTurn2: `HEADLINE: Delegation wave at an unknown proxy
STORY: Nineteen EOAs pointed code at one delegate in a short window — one plausible reading is wallet upgrades, another is a trap rehearsal.
ANGLE: EIP-7702 lets EOAs delegate without deploying; attackers abuse the same opcode shape.
CURIOSITY: Could this delegate drain wallets in one user signature?
COMMAND: /contract 0x1234`,
  },
  {
    name: 'Mainnet L2 blob base fee climb',
    brief: {
      network: 'mainnet',
      head: { blobBaseFeeGwei: '4.80 Gwei' },
      signals: [{ kind: 'l2_blob_pressure' }],
    },
    mockToolResult: {
      blobBaseFeeGwei: '4.80',
      inboxes: [{ displayName: 'Base Batcher', blobCount: 24 }],
    },
    cannedTurn1: JSON.stringify({
      mode: 'investigate',
      calls: [{ tool: 'inspect_l2_blobs', args: {} }],
    }),
    cannedTurn2: `HEADLINE: Base Batcher pushes blob lane to 4.80 Gwei
STORY: Rollup batches are buying blob space faster than the lane's target fullness, so blob base fee climbed in step with Base Batcher posts.
ANGLE: EIP-4844 (Dencun 2024) created this two-dimensional fee market.
CURIOSITY: Do other inboxes piggyback the same spike?
COMMAND: /signals`,
  },
  {
    name: 'Sepolia quiet block with birth and graffiti',
    brief: {
      network: 'sepolia',
      signals: [],
      moments: [
        { kind: 'birth', headline: 'New contract born' },
        { kind: 'graffiti_note', headline: 'Hello Sepolia' },
      ],
    },
    mockToolResult: {},
    cannedTurn1: JSON.stringify({ mode: 'tell_story', focus: 'quiet testnet artifacts' }),
    cannedTurn2: `HEADLINE: Sepolia whispers instead of roaring
STORY: No ranked mainnet-style signals, yet a newborn contract and a graffiti note appeared — dress-rehearsal traffic on testnet ETH.
ANGLE: Teams stage upgrades here before risking real funds.
CURIOSITY: Is this graffiti from a validator client test?
COMMAND: /story list`,
  },
  {
    name: 'Interactive follow-up prose',
    brief: { network: 'mainnet', signals: [{ kind: 'delegation_surge' }] },
    mockToolResult: {},
    cannedTurn1: JSON.stringify({ mode: 'tell_story', focus: '7702 phishing' }),
    cannedTurn2: `HEADLINE: How an EIP-7702 phishing arc works
STORY: A user signs a delegation that points their EOA at attacker bytecode; the next call drains allowances — always framed as what-if, not proven here.
ANGLE: Social engineering sits beside the opcode change.
CURIOSITY: Which delegate bytecode should wallets allow-list?
COMMAND: /story security`,
  },
]

const SCOUT_SYSTEM = buildScoutSystem(INVESTIGATION_TOOL_NAMES.join(', '))

async function runScenarioOnTransport(
  transport: LlmTransport,
  scenario: SmokeScenarioDef,
): Promise<SmokeScenarioResult> {
  const t0 = Date.now()
  const tools: string[] = []
  let headline: string | undefined
  let story: string | undefined
  let validJSON = false
  try {
    const raw1 = await transport.complete({
      kind: 'pulse',
      messages: [
        { role: 'system', content: SCOUT_SYSTEM },
        {
          role: 'user',
          content: JSON.stringify({ brief: scenario.brief, trigger: 'pulse' }),
        },
      ],
      overrides: { responseMode: 'json' },
    })
    const triage = parseDetectiveTriage(parseLlmJSONObject(raw1))
    validJSON = triage !== undefined
    if (triage?.mode === 'investigate') {
      for (const c of triage.calls) tools.push(c.tool)
    }
    const raw2 = await transport.complete({
      kind: 'story',
      messages: [
        { role: 'system', content: 'Storyteller' },
        { role: 'user', content: JSON.stringify({ brief: scenario.brief, toolResults: tools }) },
      ],
      overrides: { responseMode: 'text' },
    })
    const parsed = parseProse(raw2)
    if (parsed !== undefined) {
      headline = parsed.headline
      story = parsed.story
    }
  } catch {
    validJSON = false
  }
  return {
    name: scenario.name,
    ms: Date.now() - t0,
    tools,
    headline,
    story,
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
    const local = new FixtureReplayTransport([sc.cannedTurn1, sc.cannedTurn2])
    out.push(await runScenarioOnTransport(local, sc))
  }
  return out
}
