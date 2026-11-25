/**
 * WP-10d AI smoke harness.
 * - CI / agents: `npm run ai:smoke -- --mock` (100% offline, zero downloads)
 * - Manual human runs:
 *     `npm run ai:smoke -- --live`                   (uses managed Qwen3.5-2B runner)
 *     `npm run ai:smoke -- --live --ollama <model>`  (uses local Ollama model)
 */
import { FetchLlmTransport, type LlmTransport } from '../src/ai/fixtureEngine.ts'
import { DEFAULT_OLLAMA_BASE } from '../src/ai/localProviders.ts'
import { createManagedModelRunner } from '../src/ai/managedRunner.ts'
import { runSmokeScenarios } from '../src/ai/smokeScenarios.ts'
import { createSpine } from '../src/spine/createSpine.ts'

const args = process.argv.slice(2)
const mock = args.includes('--mock')
const live = args.includes('--live')
const ollamaIdx = args.indexOf('--ollama')
const ollamaModel = ollamaIdx >= 0 ? args[ollamaIdx + 1] : undefined

async function runLive(): Promise<void> {
  if (ollamaModel !== undefined && ollamaModel.length > 0) {
    const transport = new FetchLlmTransport(DEFAULT_OLLAMA_BASE, {
      provider: 'ollama',
      model: ollamaModel,
    })
    console.log(`Running 4 Chain-Detective scenarios against Ollama (${ollamaModel})…`)
    const results = await runSmokeScenarios(transport)
    for (const r of results) {
      console.log(
        `[${r.validJSON ? 'OK' : 'FAIL'}] ${r.name} (${r.ms}ms) tools=[${r.tools.join(',')}]`,
      )
      console.log(`  headline: ${r.headline ?? '-'}`)
      if (r.story !== undefined) console.log(`  story:    ${r.story}`)
    }
    if (results.some((r) => !r.validJSON)) process.exit(1)
    return
  }

  const spine = createSpine('sepolia', 11155111n)
  spine.aiMode = 'default'
  let transport: LlmTransport | undefined
  let lastLoggedPct = -10
  const runner = createManagedModelRunner({
    spine,
    getEpoch: () => 0,
    onPhase: (u) => {
      if (u.phase === 'downloading') {
        const pct = spine.managedAi?.progressPct ?? 0
        if (pct >= lastLoggedPct + 10 || pct === 100) {
          lastLoggedPct = pct
          console.log(`  downloading ${spine.managedAi?.label ?? 'model'}: ${pct}%`)
        }
      } else if (u.phase === 'warming') {
        console.log('  loading Qwen3.5-2B into llama-server…')
      } else if (u.phase === 'ready') {
        transport = u.transport
      }
    },
  })

  try {
    console.log('Bootstrapping managed Qwen3.5-2B runner…')
    await runner.start()
    if (transport === undefined) {
      console.error(
        `Managed runner unavailable: ${spine.managedAi?.detail ?? 'unknown error'}`,
      )
      process.exit(1)
    }
    console.log('Running 4 Chain-Detective scenarios against Qwen3.5-2B…')
    const results = await runSmokeScenarios(transport)
    for (const r of results) {
      console.log(
        `[${r.validJSON ? 'OK' : 'FAIL'}] ${r.name} (${r.ms}ms) tools=[${r.tools.join(',')}]`,
      )
      console.log(`  headline: ${r.headline ?? '-'}`)
      if (r.story !== undefined) console.log(`  story:    ${r.story}`)
    }
    if (results.some((r) => !r.validJSON)) process.exit(1)
    console.log('Tip: after a live node run, inspect traces with npm run ai:inspect -- <dataDir> [network]')
  } finally {
    await runner.stop()
  }
}

async function main(): Promise<void> {
  if (mock) {
    const results = await runSmokeScenarios()
    for (const r of results) {
      console.log(
        `${r.name}: ${r.ms}ms tools=[${r.tools.join(',')}] headline=${r.headline ?? '-'} json=${r.validJSON}`,
      )
      if (!r.validJSON) process.exit(1)
    }
    return
  }
  if (!live) {
    console.error('Pass --mock for offline CI smoke, or --live (optional --ollama <model>) for manual live test')
    process.exit(2)
  }
  await runLive()
}

void main()
