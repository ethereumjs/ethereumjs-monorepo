import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'
import { assert, afterEach, describe, it } from 'vitest'

import type { EthyCliArgs } from '../src/cli/args.ts'
import { parseEthyArgs } from '../src/cli/args.ts'
import {
  readUserConfig,
  resolveEffectiveAiConfig,
  userConfigFilePath,
  writeUserConfig,
} from '../src/persist/userConfig.ts'

const baseCli = (): EthyCliArgs => parseEthyArgs(['node', 'ethy'])

describe('[Ethy/persist]: userConfig', () => {
  const dirs: string[] = []
  afterEach(() => {
    for (const d of dirs) {
      fs.rmSync(d, { recursive: true, force: true })
    }
    dirs.length = 0
  })

  it('resolveEffectiveAiConfig() uses saved ai when no CLI flags', () => {
    const cli = baseCli()
    const saved = { schemaVersion: 1 as const, updatedAt: '', ai: { mode: 'off' as const } }
    const r = resolveEffectiveAiConfig(saved, cli, { isTTY: true })
    assert.equal(r.effective.mode, 'off')
    assert.isFalse(r.showOnboarding)
  })

  it('resolveEffectiveAiConfig() session override without save', () => {
    const cli = parseEthyArgs(['node', 'ethy', '--ollama', 'qwen3:4b'])
    const saved = {
      schemaVersion: 1 as const,
      updatedAt: '',
      ai: { mode: 'off' as const },
    }
    const r = resolveEffectiveAiConfig(saved, cli, { isTTY: true })
    assert.equal(r.effective.mode, 'local')
    assert.equal(r.effective.model, 'qwen3:4b')
    assert.isTrue(r.sessionOnly)
    assert.isFalse(r.persistOnBoot)
  })

  it('resolveEffectiveAiConfig() first interactive open shows onboarding', () => {
    const cli = baseCli()
    const r = resolveEffectiveAiConfig(undefined, cli, { isTTY: true })
    assert.isTrue(r.showOnboarding)
    assert.equal(r.effective.mode, 'off')
  })

  it('resolveEffectiveAiConfig() --no-ai persists on first install', () => {
    const cli = parseEthyArgs(['node', 'ethy', '--no-ai'])
    const r = resolveEffectiveAiConfig(undefined, cli, { isTTY: false })
    assert.equal(r.effective.mode, 'off')
    assert.isTrue(r.persistOnBoot)
  })

  it('writeUserConfig() atomic round-trip', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-cfg-'))
    dirs.push(dir)
    writeUserConfig(dir, { mode: 'local', baseUrl: 'http://127.0.0.1:11434', model: 'gemma3:4b' })
    const pathOnDisk = userConfigFilePath(dir)
    assert.isTrue(fs.existsSync(pathOnDisk))
    assert.isFalse(fs.existsSync(`${pathOnDisk}.tmp`))
    const cfg = readUserConfig(dir)
    assert.equal(cfg?.ai?.model, 'gemma3:4b')
  })

  it('--fresh pivot wipe keeps config.json at data root', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ethy-fresh-'))
    dirs.push(dir)
    writeUserConfig(dir, { mode: 'off' })
    const netDir = path.join(dir, 'networks', 'sepolia', 'pivots')
    fs.mkdirSync(netDir, { recursive: true })
    fs.writeFileSync(path.join(netDir, 'marker.txt'), 'x')
    fs.rmSync(netDir, { recursive: true, force: true })
    assert.isTrue(fs.existsSync(userConfigFilePath(dir)))
  })

  it('parseEthyArgs() --ollama does not consume network name', () => {
    const a = parseEthyArgs(['node', 'ethy', '--ollama', 'mainnet'])
    assert.equal(a.network, 'mainnet')
    assert.equal(a.ollama, true)
  })

  it('resolveEffectiveAiConfig() preserves saved memory: off and saved mode on --ai-setup', () => {
    const saved = {
      schemaVersion: 1 as const,
      updatedAt: '',
      ai: { mode: 'local' as const, model: 'qwen3:4b', memory: 'off' as const },
    }
    const plain = resolveEffectiveAiConfig(saved, baseCli(), { isTTY: true })
    assert.equal(plain.effective.memory, 'off')
    assert.equal(plain.effective.mode, 'local')

    const setup = resolveEffectiveAiConfig(saved, parseEthyArgs(['node', 'ethy', '--ai-setup']), {
      isTTY: true,
    })
    assert.isTrue(setup.showOnboarding)
    assert.equal(setup.effective.mode, 'local')
    assert.isFalse(setup.persistOnBoot)
  })
})
