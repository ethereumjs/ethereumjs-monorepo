/**
 * @module util
 */

export * from './parse'

export function short(buffer: Buffer): string {
  return buffer.toString('hex').slice(0, 8) + '...'
}
