/**
 * WP-10d smoke harness. Agents and CI must use `--mock` only (no live model download).
 */
import { runSmokeScenarios } from '../src/ai/smokeScenarios.ts'

const mock = process.argv.includes('--mock')

async function main(): Promise<void> {
  if (!mock) {
    console.error('Refusing live ai:smoke without explicit human intent — use --mock in CI')
    process.exit(2)
  }
  const results = await runSmokeScenarios()
  for (const r of results) {
    console.log(
      `${r.name}: ${r.ms}ms tools=[${r.tools.join(',')}] headline=${r.headline ?? '-'} json=${r.validJSON}`,
    )
    if (!r.validJSON) process.exit(1)
  }
}

void main()