import type { ManagedAiState } from '../spine/types.ts'
import { formatModelBytes } from './modelBytes.ts'

export function modelBootstrapNote(managed?: ManagedAiState): string | undefined {
  if (managed === undefined) return undefined
  if (managed.phase === 'downloading') {
    const pct = managed.progressPct ?? 0
    const got = formatModelBytes(managed.downloadedBytes ?? 0)
    const total = formatModelBytes(managed.totalBytes ?? 0)
    const speed =
      managed.bytesPerSec !== undefined && managed.bytesPerSec > 0
        ? ` · ${formatModelBytes(managed.bytesPerSec)}/s`
        : ''
    const subject = managed.label ?? 'Qwen3.5-2B'
    return `Downloading ${subject}… ${pct}% (${got} / ${total}${speed}) · P2P & sync running normally`
  }
  if (managed.phase === 'warming' || managed.phase === 'probing') {
    return 'Loading Qwen3.5-2B… · P2P & sync running normally'
  }
  if (managed.phase === 'needs-runner' && managed.detail !== undefined) {
    return managed.detail
  }
  return undefined
}

export function managedPhaseBlocksOverview(phase?: string): boolean {
  return (
    phase === 'downloading' ||
    phase === 'warming' ||
    phase === 'needs-runner' ||
    phase === 'probing'
  )
}
