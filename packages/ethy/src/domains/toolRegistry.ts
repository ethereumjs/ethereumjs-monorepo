import { SLASH_COMMANDS } from '../ai/slashComplete.ts'
import type { DomainPermission } from './types.ts'

export type SlashToolDescriptor = {
  command: string
  permission: DomainPermission
}

const READ_COMMANDS = [
  '/live',
  '/peers',
  '/ethy',
  '/rpc',
  '/buckets',
  '/snap',
  '/diag',
  '/help',
  '/range',
  '/sample',
  '/account',
  '/bal',
  '/simulate',
  '/cl',
  '/economy',
  '/contract',
  '/clear',
  '/ai',
] as const

const WRITE_COMMANDS = ['/drop', '/reassign', '/pause', '/resume', '/send'] as const

function normalizeCmd(cmd: string): string {
  return cmd.trim().toLowerCase().split(/\s+/)[0] ?? cmd
}

export const SLASH_TOOL_REGISTRY: SlashToolDescriptor[] = [
  ...READ_COMMANDS.map((command) => ({ command, permission: 'read' as const })),
  ...WRITE_COMMANDS.map((command) => ({ command, permission: 'write' as const })),
]

export function permissionForSlash(line: string): DomainPermission | undefined {
  const cmd = normalizeCmd(line)
  const row = SLASH_TOOL_REGISTRY.find((r) => r.command === cmd)
  return row?.permission
}

/** Returns registry entries whose base command appears in {@link SLASH_COMMANDS}. */
export function registryWriteActions(): string[] {
  return WRITE_COMMANDS.slice()
}

export function assertRegistryMatchesSlashList(): void {
  for (const row of SLASH_TOOL_REGISTRY) {
    const ok = SLASH_COMMANDS.some((c) => c.trim().toLowerCase().startsWith(row.command))
    if (!ok) {
      throw new Error(`Registry command ${row.command} missing from SLASH_COMMANDS`)
    }
  }
}
