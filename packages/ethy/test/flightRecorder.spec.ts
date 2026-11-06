import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import { assert, describe, it } from 'vitest'

import { createEthyNode } from '../src/core/createEthyNode.ts'
import { EthyFlightRecorder } from '../src/persist/flightRecorder.ts'
import { createSpine } from '../src/spine/createSpine.ts'
import { recordDiagnostic } from '../src/spine/diagnostics.ts'

describe('[Ethy/Persist]: Flight Recorder logs', () => {
  it('writes ethy.log, errors.log, and structured events.jsonl with size-capped rotation', () => {
    const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-logs-'))
    const node = createEthyNode({
      network: 'sepolia',
      chainId: 11155111n,
      dataDir,
      enableFlightRecorder: true,
    })

    recordDiagnostic(node.spine, {
      subsystem: 'snap',
      severity: 'info',
      message: 'Bucket 0x0 accepted 1500 accounts',
      bucketIndex: 0,
    })
    recordDiagnostic(node.spine, {
      subsystem: 'devp2p',
      severity: 'warn',
      peerId: 'abcd1234567890ef',
      message: 'TOO_MANY_PEERS (remote dropped us)',
    })
    node.flightRecorder?.recordPulse()
    node.flightRecorder?.stop()

    const paths = node.flightRecorder!.paths
    assert.isTrue(fs.existsSync(paths.generalLogPath))
    assert.isTrue(fs.existsSync(paths.errorsLogPath))
    assert.isTrue(fs.existsSync(paths.jsonlLogPath))

    const general = fs.readFileSync(paths.generalLogPath, 'utf8')
    const errors = fs.readFileSync(paths.errorsLogPath, 'utf8')
    const jsonlLines = fs
      .readFileSync(paths.jsonlLogPath, 'utf8')
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as Record<string, unknown>)

    assert.include(general, 'Bucket 0x0 accepted 1500 accounts')
    assert.include(general, 'TOO_MANY_PEERS')
    assert.notInclude(errors, 'Bucket 0x0 accepted 1500 accounts')
    assert.include(errors, 'TOO_MANY_PEERS')
    assert.isTrue(jsonlLines.some((r) => r.kind === 'pulse'))
    assert.isTrue(jsonlLines.some((r) => r.kind === 'diag' && r.sev === 'warn'))

    // Verify rotation when maxFileBytes is exceeded
    const tinyRecorder = new EthyFlightRecorder({
      dataDir,
      network: 'sepolia',
      spine: createSpine('sepolia', 11155111n),
      enabled: true,
      maxFileBytes: 120,
    })
    tinyRecorder.start()
    for (let i = 0; i < 6; i++) {
      tinyRecorder.recordDiagnostic({
        timestamp: Date.now(),
        subsystem: 'snap',
        severity: 'warn',
        message: `rotation-test-${i}`,
      })
      tinyRecorder.flushSync()
    }
    tinyRecorder.stop()
    assert.isTrue(fs.existsSync(paths.generalLogPath.replace(/\.log$/, '.1.log')))
  })
})
