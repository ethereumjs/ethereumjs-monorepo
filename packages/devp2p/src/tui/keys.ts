export type KeyAction =
  | { type: 'char'; ch: string }
  | { type: 'up' }
  | { type: 'down' }
  | { type: 'ignore' }

/** Fold one raw byte into an escape sequence. `action` is omitted while a sequence is unfinished. */
export function pushKey(buffer: string, ch: string): { buffer: string; action?: KeyAction } {
  if (buffer === '' && ch !== '\u001b') {
    return { buffer: '', action: { type: 'char', ch } }
  }
  const next = buffer + ch
  if (next === '\u001b' || next === '\u001b[' || next === '\u001bO') {
    return { buffer: next }
  }
  if (next === '\u001b[A' || next === '\u001bOA') return { buffer: '', action: { type: 'up' } }
  if (next === '\u001b[B' || next === '\u001bOB') return { buffer: '', action: { type: 'down' } }
  if (next.startsWith('\u001b[') && next.length < 8 && !/[A-Za-z~]$/.test(next)) {
    return { buffer: next }
  }
  return { buffer: '', action: { type: 'ignore' } }
}
