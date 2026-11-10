import { assert, describe, it, vi } from 'vitest'

import { createFlatStateManager } from '@ethereumjs/statemanager'

import { buildCompactDomainContext } from '../src/ai/compactContext.ts'
import { composeViewFromRequest } from '../src/ai/composeView.ts'
import { FixtureReplayTransport } from '../src/ai/fixtureEngine.ts'
import { HybridIntentEngine } from '../src/ai/hybridEngine.ts'
import { assertLlmBaseUrl, normalizeLlmBase, parseLlmJSONObject } from '../src/ai/llmClient.ts'
import { LocalHttpIntentEngine } from '../src/ai/localHttpEngine.ts'
import {
  MAX_AI_TOTAL_CHARS,
  buildDeterministicOverviewSections,
} from '../src/ai/overviewNarrator.ts'
import { AiPulseNarrator } from '../src/ai/pulseNarrator.ts'
import { buildToolCatalog } from '../src/ai/toolCatalog.ts'
import { TurnMemoryRing } from '../src/ai/turnMemory.ts'
import { advanceDemo } from '../src/demo/advanceDemo.ts'
import { readDomainSnapshots } from '../src/domains/domainManagers.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import type { AiOverviewSections } from '../src/spine/types.ts'

describe('[Ethy/AI]: llm client', () => {
  it('rejects remote llm url without allow flag', () => {
    assert.throws(() => assertLlmBaseUrl('http://203.0.113.1:8080', false), /Refusing non-loopback/)
  })

  it('allows loopback llm url', () => {
    const url = assertLlmBaseUrl('http://127.0.0.1:8080', false)
    assert.equal(url.hostname, '127.0.0.1')
  })

  it('parseLlmJSONObject strips fences and surrounding prose', () => {
    const obj = parseLlmJSONObject('Here is the JSON:\n```json\n{"overviewText":"hi"}\n```\nDone.')
    assert.equal(obj.overviewText, 'hi')
    const rawProse = parseLlmJSONObject('Sure! {"overviewText":"hello"}')
    assert.equal(rawProse.overviewText, 'hello')
  })

  it('normalizeLlmBase strips trailing /v1 so /v1/models does not double', () => {
    const url = assertLlmBaseUrl('http://localhost:11434/v1/', false)
    assert.equal(url.hostname, 'localhost')
    assert.equal(normalizeLlmBase(url), 'http://localhost:11434')
  })
})

describe('[Ethy/AI]: pulse narrator', () => {
  it('clamps pulse sections to max total chars', async () => {
    const long = 'x'.repeat(MAX_AI_TOTAL_CHARS + 40)
    const transport = new FixtureReplayTransport([JSON.stringify({ state: long })])
    let out: AiOverviewSections = {}
    const spine = createSpine('sepolia', 11155111n)
    advanceDemo(spine, 5000)
    const narrator = new AiPulseNarrator({
      transport,
      onOverview: (sections) => {
        out = sections
      },
    })
    narrator.start(spine)
    await new Promise((r) => setTimeout(r, 50))
    narrator.stop()
    const total = (out.state?.length ?? 0) + (out.economy?.length ?? 0) + (out.p2p?.length ?? 0)
    assert.isAtMost(total, MAX_AI_TOTAL_CHARS)
  })

  it('falls back to deterministic sections when pulse JSON is empty', async () => {
    const transport = new FixtureReplayTransport([JSON.stringify({})])
    let out: AiOverviewSections = {}
    const spine = createSpine('sepolia', 11155111n)
    advanceDemo(spine, 5000)
    const narrator = new AiPulseNarrator({
      transport,
      onOverview: (sections) => {
        out = sections
      },
    })
    narrator.start(spine)
    await new Promise((r) => setTimeout(r, 50))
    narrator.stop()
    const fallback = buildDeterministicOverviewSections(readDomainSnapshots(spine), 'welcome')
    assert.equal(out.state, fallback.state)
  })
})

describe('[Ethy/AI]: intent engine fixtures', () => {
  it('routes tool call to peers table with viewTitle', async () => {
    vi.stubGlobal('fetch', () => {
      throw new Error('fetch should not run in fixture mode')
    })
    const spine = createSpine('sepolia', 11155111n)
    advanceDemo(spine, 8000)
    const stateManager = createFlatStateManager()
    const transport = new FixtureReplayTransport([
      JSON.stringify({
        viewTitle: 'Most used peers',
        action: { type: 'tool', name: 'peers' },
      }),
    ])
    const fallback = new HybridIntentEngine({ stateManager })
    const engine = new LocalHttpIntentEngine({
      transport,
      stateManager,
      fallback,
      getTurns: () => [],
    })
    const r = await engine.handle({ text: 'most used peers please', spine })
    assert.equal(r.viewTitle, 'Most used peers')
    assert.equal(r.widget.kind, 'table')
    vi.unstubAllGlobals()
  })

  it('routes tool call with args cleanly and falls back to widget.assistantComment', async () => {
    const spine = createSpine('sepolia', 11155111n)
    advanceDemo(spine, 8000)
    const stateManager = createFlatStateManager()
    const transport = new FixtureReplayTransport([
      JSON.stringify({
        viewTitle: 'Peer Table',
        action: { type: 'tool', name: 'ethy' },
      }),
    ])
    const fallback = new HybridIntentEngine({ stateManager })
    const engine = new LocalHttpIntentEngine({
      transport,
      stateManager,
      fallback,
      getTurns: () => [],
    })
    const r = await engine.handle({ text: 'show ethy swarm', spine })
    assert.equal(r.viewTitle, 'Peer Table')
    assert.isDefined(r.overviewNote)
  })

  it('compose peersByClient from live spine', () => {
    const spine = createSpine('sepolia', 11155111n)
    advanceDemo(spine, 8000)
    const w = composeViewFromRequest(spine, createFlatStateManager(), {
      kind: 'dataset',
      dataset: 'peersByClient',
      viewTitle: 'By client',
    })
    assert.equal(w.kind, 'table')
    if (w.kind === 'table') {
      assert.include(w.headers.join(' '), 'Client family')
    }
  })
})

describe('[Ethy/AI]: tool catalog gating', () => {
  it('omits head tools when head locked', () => {
    const spine = createSpine('sepolia', 11155111n)
    const catalog = buildToolCatalog(spine, 'interactive')
    assert.isFalse(catalog.some((t) => t.id === 'bal'))
  })
})

describe('[Ethy/AI]: turn memory', () => {
  it('keeps at most three turns', () => {
    const ring = new TurnMemoryRing()
    for (let i = 0; i < 5; i++) {
      ring.push({ userQuery: `q${i}`, viewTitle: `t${i}`, toolCalled: 'peers' })
    }
    assert.equal(ring.snapshot().length, 3)
    assert.equal(ring.snapshot()[0]?.userQuery, 'q2')
  })
})

describe('[Ethy/AI]: compact context', () => {
  it('does not embed userQuery field', () => {
    const spine = createSpine('sepolia', 11155111n)
    const ctx = buildCompactDomainContext(spine)
    assert.isUndefined((ctx as { userQuery?: string }).userQuery)
  })
})
