import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { seedDemoEthyPivot } from '../src/sync/seedDemoState.ts'

async function main(): Promise<void> {
  const dataDir = mkdtempSync(join(tmpdir(), 'ethy-node-a-'))
  await seedDemoEthyPivot({ dataDir, network: 'sepolia', chainId: 11155111n })

  process.stdout.write(`Seeded demo ETHY pivot at ${dataDir}\n\n`)
  process.stdout.write(
    'Terminal 1 (seeder):\n  npx tsx packages/ethy/src/cli/main.ts sepolia --port 30303 --data-dir ' +
      dataDir +
      ' --sync-mode snap\n\n',
  )
  process.stdout.write(
    'Terminal 2 (joiner):\n  npx tsx packages/ethy/src/cli/main.ts sepolia --port 30304 --data-dir /tmp/ethy-node-b --connect <enode-from-/diag> --sync-mode ethy\n',
  )
}

main().catch((err: unknown) => {
  process.stderr.write(`${(err as Error).message}\n`)
  process.exit(1)
})
