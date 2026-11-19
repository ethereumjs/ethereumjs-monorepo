import * as fs from 'node:fs'
import * as path from 'node:path'

import type { EthyCliArgs } from '../cli/args.ts'
import { resolveEthyDataDir } from './ethyDataRoot.ts'

export type EthyAiMode = 'default' | 'off' | 'local'

export type LocalLlmProviderKind = 'ollama' | 'openai-compatible'

export interface EthyAiConfig {
  mode: EthyAiMode
  /** Active when `mode === 'local'`. */
  localProvider?: LocalLlmProviderKind
  /** Loopback or explicit remote base URL (e.g. `http://127.0.0.1:11434`). */
  baseUrl?: string
  /** Model identifier required by Ollama / LM Studio (e.g. `qwen3:1.7b`). */
  model?: string
  /** Allow non-loopback `baseUrl` when explicitly opted in. */
  allowRemote?: boolean
  /** Turn memory preference (`ephemeral` 3-turn RAM ring vs `off`). */
  memory?: 'ephemeral' | 'off'
  /** Opt-in: allow autonomous AI dispatches (`WP-10c`) to see recent RAM-only session prompts. */
  sharePromptHistory?: boolean
  /** Default model id override once WP-10d ships multiple tiers. */
  defaultModelId?: string
}

export interface EthyUserConfig {
  schemaVersion: 1
  updatedAt: string
  ai?: EthyAiConfig
}

export type ResolveEnv = {
  isTTY: boolean
}

export type EffectiveAiResolution = {
  effective: EthyAiConfig
  /** Show first-run onboarding inside the TUI. */
  showOnboarding: boolean
  /** Write `effective` to disk after boot (CLI first install or `--ai-save`). */
  persistOnBoot: boolean
  /** Session-only override; do not write unless `persistOnBoot`. */
  sessionOnly: boolean
}

const KNOWN_NETWORKS = new Set(['sepolia', 'mainnet', 'hoodi', 'holesky'])

export function userConfigFilePath(dataDir?: string): string {
  return path.join(resolveEthyDataDir(dataDir), 'config.json')
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v)
}

function parseAiBlock(raw: unknown): EthyAiConfig | undefined {
  if (!isRecord(raw)) return undefined
  const mode = raw.mode
  if (mode !== 'default' && mode !== 'off' && mode !== 'local') return undefined
  const localProvider = raw.localProvider
  const memory = raw.memory
  const out: EthyAiConfig = { mode }
  if (localProvider === 'ollama' || localProvider === 'openai-compatible') {
    out.localProvider = localProvider
  }
  if (typeof raw.baseUrl === 'string' && raw.baseUrl.length > 0) out.baseUrl = raw.baseUrl
  if (typeof raw.model === 'string' && raw.model.length > 0) out.model = raw.model
  if (raw.allowRemote === true) out.allowRemote = true
  if (memory === 'ephemeral' || memory === 'off') out.memory = memory
  if (raw.sharePromptHistory === true) out.sharePromptHistory = true
  if (typeof raw.defaultModelId === 'string' && raw.defaultModelId.length > 0) {
    out.defaultModelId = raw.defaultModelId
  }
  return out
}

export function readUserConfig(dataDir?: string): EthyUserConfig | undefined {
  const file = userConfigFilePath(dataDir)
  if (!fs.existsSync(file)) return undefined
  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8')) as unknown
    if (!isRecord(parsed)) return undefined
    if (parsed.schemaVersion !== 1) return { schemaVersion: 1, updatedAt: '', ai: undefined }
    const ai = parsed.ai !== undefined ? parseAiBlock(parsed.ai) : undefined
    return {
      schemaVersion: 1,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : '',
      ai,
    }
  } catch {
    return undefined
  }
}

export function writeUserConfig(dataDir: string | undefined, ai: EthyAiConfig): void {
  const file = userConfigFilePath(dataDir)
  const dir = path.dirname(file)
  fs.mkdirSync(dir, { recursive: true })
  const payload: EthyUserConfig = {
    schemaVersion: 1,
    updatedAt: new Date().toISOString(),
    ai,
  }
  const tmp = `${file}.tmp`
  fs.writeFileSync(tmp, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')
  fs.renameSync(tmp, file)
}

function cliTouchesAi(cli: EthyCliArgs): boolean {
  return (
    cli.aiMode !== undefined ||
    cli.noAi === true ||
    cli.ollama !== undefined ||
    cli.llmUrl !== undefined ||
    cli.aiSetup === true
  )
}

function aiConfigFromCli(cli: EthyCliArgs): EthyAiConfig {
  const memory = cli.aiMemory
  const sharePromptHistory = cli.aiSharePrompts === true ? true : undefined
  const shareField = sharePromptHistory !== undefined ? { sharePromptHistory } : {}
  if (cli.noAi === true || cli.aiMode === 'off') {
    return { mode: 'off', memory, ...shareField }
  }
  if (cli.ollama !== undefined) {
    const model =
      cli.ollama === '' || cli.ollama === true
        ? undefined
        : typeof cli.ollama === 'string'
          ? cli.ollama
          : undefined
    return {
      mode: 'local',
      localProvider: 'ollama',
      baseUrl: 'http://127.0.0.1:11434',
      model,
      memory,
      ...shareField,
    }
  }
  if (cli.llmUrl !== undefined) {
    return {
      mode: 'local',
      localProvider: 'openai-compatible',
      baseUrl: cli.llmUrl,
      model: cli.llmModel,
      allowRemote: cli.llmAllowRemote,
      memory,
      ...shareField,
    }
  }
  if (cli.aiMode === 'local') {
    return {
      mode: 'local',
      localProvider: 'openai-compatible',
      memory,
      ...shareField,
    }
  }
  if (cli.aiMode === 'default') {
    return { mode: 'default', memory, ...shareField }
  }
  return { mode: 'off', memory, ...shareField }
}

export function mergeAiMemory(base: EthyAiConfig, cli: EthyCliArgs): EthyAiConfig {
  return { ...base, memory: cli.aiMemory }
}

/**
 * Four-rule AI config resolution (WP-10a).
 */
export function resolveEffectiveAiConfig(
  saved: EthyUserConfig | undefined,
  cli: EthyCliArgs,
  env: ResolveEnv,
): EffectiveAiResolution {
  const savedAi = saved?.ai
  const hasCliAi = cliTouchesAi(cli)

  if (hasCliAi) {
    const effective = aiConfigFromCli(cli)
    const persistOnBoot = cli.aiSave === true || (savedAi === undefined && cli.noSave !== true)
    return {
      effective,
      showOnboarding: cli.aiSetup === true && env.isTTY && !cli.headless && !cli.demo,
      persistOnBoot,
      sessionOnly: !persistOnBoot && savedAi !== undefined,
    }
  }

  if (savedAi !== undefined) {
    const effective = mergeAiMemory(savedAi, cli)
    return {
      effective,
      showOnboarding: false,
      persistOnBoot: false,
      sessionOnly: false,
    }
  }

  if (env.isTTY && !cli.demo && !cli.headless) {
    return {
      effective: { mode: 'off', memory: cli.aiMemory },
      showOnboarding: true,
      persistOnBoot: false,
      sessionOnly: false,
    }
  }

  return {
    effective: { mode: 'off', memory: cli.aiMemory },
    showOnboarding: false,
    persistOnBoot: false,
    sessionOnly: false,
  }
}

/** `--ollama` next token: model name unless it is a flag or known network. */
export function parseOllamaModelArg(
  argv: string[],
  indexAfterFlag: number,
): string | true | undefined {
  const next = argv[indexAfterFlag]
  if (next === undefined) return true
  if (next.startsWith('-')) return true
  if (KNOWN_NETWORKS.has(next.toLowerCase())) return undefined
  return next
}
