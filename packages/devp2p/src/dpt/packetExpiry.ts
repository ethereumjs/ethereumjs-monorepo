/** discv4 ping/pong/findneighbours carry an expiration timestamp (seconds since epoch). */
export function discv4ExpirationValid(
  expirationSec: number,
  nowSec = (Date.now() / 1000) | 0,
): boolean {
  return expirationSec >= nowSec - 2
}
