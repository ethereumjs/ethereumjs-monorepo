import { parseDetectiveTriage } from './chainDetective.ts'
import { FixtureReplayTransport, type LlmTransport } from './fixtureEngine.ts'
import { parseLlmJSONObject } from './llmClient.ts'

export type SmokeScenarioResult = {
  name: string
  ms: number
  tools: string[]
  headline?: string
  validJSON: boolean
}

const SCENARIOS: Array<{ name: string; turn1: string; turn2?: string }> = [
  {
    name: 'EIP-7702 delegation surge',
    turn1: JSON.stringify({
      mode: 'investigate',
      calls: [{ tool: 'inspect_delegations', args: {} }],
    }),
    turn2: JSON.stringify({
      mode: 'dispatch',
      category: '7702',
      severity: 'surge',
      headline: 'Delegation spike',
      body: 'Many new delegate targets in the macro window.',
    }),
  },
  {
    name: 'L2 blob cost climb',
    turn1: JSON.stringify({
      mode: 'investigate',
      calls: [{ tool: 'inspect_l2_blobs', args: {} }],
    }),
    turn2: JSON.stringify({
      mode: 'dispatch',
      category: 'l2',
      severity: 'notable',
      headline: 'Blob fees rising',
      body: 'L2 inbox blob spend is above the macro baseline.',
    }),
  },
  {
    name: 'Quiet normal block',
    turn1: JSON.stringify({
      mode: 'dispatch',
      category: 'watch',
      severity: 'calm',
      headline: 'Steady block',
      body: 'No novel economic signals this window.',
    }),
  },
]

async function runScenarioOnTransport(
  transport: LlmTransport,
  name: string,
): Promise<SmokeScenarioResult> {
  const t0 = Date.now()
  const tools: string[] = []
  let headline: string | undefined
  let validJSON = false
  const raw1 = await transport.complete({
    kind: 'pulse',
    messages: [
      { role: 'system', content: '{}' },
      { role: 'user', content: '{"digest":{}}' },
    ],
  })
  const triage = parseDetectiveTriage(parseLlmJSONObject(raw1))
  validJSON = triage !== undefined
  if (triage?.mode === 'investigate') {
    for (const c of triage.calls) tools.push(c.tool)
    const raw2 = await transport.complete({
      kind: 'pulse',
      messages: [
        { role: 'system', content: '{}' },
        { role: 'user', content: '{"toolResults":[]}' },
      ],
    })
    const parsed = parseLlmJSONObject(raw2) as {
      headline?: string
      mode?: string
    }
    if (parsed.mode === 'dispatch' && typeof parsed.headline === 'string') {
      headline = parsed.headline
      validJSON = true
    } else if (typeof parsed.headline === 'string') {
      headline = parsed.headline
    }
  } else if (triage?.mode === 'dispatch') {
    headline = triage.card.headline
  }
  return {
    name,
    ms: Date.now() - t0,
    tools,
    headline,
    validJSON,
  }
}

export async function runSmokeScenarios(transport?: LlmTransport): Promise<SmokeScenarioResult[]> {
  const out: SmokeScenarioResult[] = []
  if (transport !== undefined) {
    for (const sc of SCENARIOS) {
      out.push(await runScenarioOnTransport(transport, sc.name))
    }
    return out
  }
  for (const sc of SCENARIOS) {
    const canned = sc.turn2 !== undefined ? [sc.turn1, sc.turn2] : [sc.turn1]
    const local = new FixtureReplayTransport(canned)
    out.push(await runScenarioOnTransport(local, sc.name))
  }
  return out
}
