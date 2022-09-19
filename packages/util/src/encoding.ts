export const hasTerm = (s: Uint8Array) => {
  return s.length > 0 && s[s.length - 1] === 16
}

export const hexToCompact = (hex: Uint8Array) => {
  let terminator = 0
  if (hasTerm(hex)) {
    terminator = 1
    hex = hex.subarray(0, hex.length - 1) //hex.subarray(1, hex.length-1)
  }
  const buf = new Uint8Array(hex.length / 2 + 1)
  buf[0] = terminator << 5
  if ((hex.length & 1) === 1) {
    buf[0] |= 1 << 4
    buf[0] |= hex[0]
    hex = hex.subarray(1)
  }
  decodeNibbles(hex, buf.subarray(1))
  return buf
}

export const decodeNibbles = (nibbles: Uint8Array, bytes: Uint8Array) => {
  for (let bi = 0, ni = 0; ni < nibbles.length; bi += 1, ni += 2) {
    bytes[bi] = (nibbles[ni] << 4) | nibbles[ni + 1]
  }
}

export const compactToHex = (compact: Uint8Array) => {
  if (compact.length === 0) {
    return compact
  }
  let base = keybytesToHex(compact)
  // delete terminator flag
  if (base[0] < 2) {
    base = base.subarray(0, base.length - 2)
  }
  // apply odd flag
  const chop = (2 - base[0]) & 1
  return base.subarray(chop)
}

export const keybytesToHex = (str: Uint8Array) => {
  const l = str.length * 2 + 1
  const nibbles = new Uint8Array(l)
  for (let i = 0; i < str.length; i++) {
    const b = str[i]
    nibbles[i * 2] = b / 16
    nibbles[i * 2 + 1] = b % 16
  }
  nibbles[l - 1] = 16
  return nibbles
}
