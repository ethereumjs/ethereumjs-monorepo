const GGUF = new Uint8Array([0x47, 0x47, 0x55, 0x46])

export function ggufMagicAt(buf: Uint8Array): boolean {
  if (buf.length < 4) return false
  for (let i = 0; i < 4; i++) {
    if (buf[i] !== GGUF[i]) return false
  }
  return true
}

export function isValidGgufFile(buf: Uint8Array, minValidBytes: number): boolean {
  return ggufMagicAt(buf) && buf.length >= minValidBytes
}
