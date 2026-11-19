import * as fs from 'node:fs'
import * as path from 'node:path'

import { execFileSync } from 'node:child_process'

export function resolveLlamaServerBin(): string | undefined {
  const fromEnv = process.env.ETHY_LLAMA_SERVER_BIN
  if (fromEnv !== undefined && fromEnv.length > 0) {
    if (fromEnv.endsWith('.mjs') || fromEnv.endsWith('.js')) {
      if (fs.existsSync(fromEnv)) return fromEnv
    } else if (fs.existsSync(fromEnv)) {
      return fromEnv
    }
  }
  try {
    const cmd = process.platform === 'win32' ? 'where' : 'which'
    const out = execFileSync(cmd, ['llama-server'], { encoding: 'utf8' }).trim()
    const first = out.split(/\r?\n/u)[0]?.trim()
    if (first !== undefined && first.length > 0) return first
  } catch {
    // not on PATH
  }
  return undefined
}

export function spawnLlamaServerCommand(
  bin: string,
  modelPath: string,
  port: number,
): { command: string; args: string[] } {
  const normalized = path.resolve(bin)
  if (normalized.endsWith('.mjs') || normalized.endsWith('.js')) {
    return {
      command: process.execPath,
      args: [
        normalized,
        '-m',
        modelPath,
        '--host',
        '127.0.0.1',
        '--port',
        String(port),
        '--ctx-size',
        '4096',
        '--reasoning-budget',
        '0',
      ],
    }
  }
  return {
    command: bin,
    args: [
      '-m',
      modelPath,
      '--host',
      '127.0.0.1',
      '--port',
      String(port),
      '--ctx-size',
      '4096',
      '--reasoning-budget',
      '0',
    ],
  }
}
