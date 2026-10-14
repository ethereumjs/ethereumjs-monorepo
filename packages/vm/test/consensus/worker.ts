import { parentPort, workerData } from 'node:worker_threads'

import { runCases } from './cases/runFile.ts'
import type { ConsensusTestCase } from './types.ts'

const data = workerData as { cases: ConsensusTestCase[]; rootLabel: string }

const results = await runCases(data.cases, data.rootLabel)
parentPort?.postMessage({ results })
