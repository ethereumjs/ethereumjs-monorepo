import { execFile } from 'node:child_process'
import { access, mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

import { describe, expect, it } from 'vitest'

const execFileAsync = promisify(execFile)
const bin = join(import.meta.dirname, '../../bin/devp2p.cjs')

describe('[Devp2p/CLI]: bin', () => {
  it('prints help', async () => {
    const { stdout } = await execFileAsync(process.execPath, [bin, '--help'])
    expect(stdout).toContain('devp2p init')
    expect(stdout).toContain('scenario run')
    expect(stdout).toContain('snap send')
    expect(stdout).toContain('rlpx ping')
    expect(stdout).toContain('dpt ping')
    expect(stdout).toContain('./lab')
    expect(stdout).toContain('devp2p use')
    expect(stdout).toContain('DEVP2P_NODE')
  })

  it('init writes the default ./lab directory', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'devp2p-cli-'))
    await execFileAsync(process.execPath, [bin, 'init', '--nodes', 'alice'], { cwd })
    await access(join(cwd, 'lab', 'alice', 'node.json'))
  })

  it('use sets default node for enode show', async () => {
    const cwd = await mkdtemp(join(tmpdir(), 'devp2p-cli-'))
    await execFileAsync(process.execPath, [bin, 'init', '--nodes', 'alice,bob'], { cwd })
    await execFileAsync(process.execPath, [bin, 'use', 'bob'], { cwd })
    const { stdout } = await execFileAsync(process.execPath, [bin, 'enode', 'show'], { cwd })
    expect(stdout.trim().startsWith('enode://')).toBe(true)
  })

  it('generates a key', async () => {
    const { stdout } = await execFileAsync(process.execPath, [bin, 'key', 'generate'])
    expect(stdout.trim().startsWith('0x')).toBe(true)
  })
})
