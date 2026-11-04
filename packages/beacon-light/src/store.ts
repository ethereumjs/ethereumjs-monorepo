import { mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'

import { parseClientSnapshot, serializeClientSnapshot } from './stateSnapshot.ts'

import type { BeaconLightClientSnapshot } from './stateSnapshot.ts'

/** Default on-disk path for Ethy-style network data dirs. */
export function defaultLightClientPath(network: string): string {
  return join(homedir(), '.ethy', 'networks', network, 'cl', 'light-client.json')
}

export class BeaconLightStore {
  readonly filePath: string

  constructor(filePath: string) {
    this.filePath = filePath
  }

  load(): BeaconLightClientSnapshot | undefined {
    try {
      const raw = readFileSync(this.filePath, 'utf8')
      return parseClientSnapshot(raw)
    } catch (e: unknown) {
      const err = e as NodeJS.ErrnoException
      if (err.code === 'ENOENT') return undefined
      try {
        unlinkSync(this.filePath)
      } catch {
        // ignore
      }
      return undefined
    }
  }

  save(snapshot: BeaconLightClientSnapshot): void {
    mkdirSync(dirname(this.filePath), { recursive: true })
    const tmp = `${this.filePath}.tmp`
    writeFileSync(tmp, serializeClientSnapshot(snapshot), 'utf8')
    renameSync(tmp, this.filePath)
  }

  clear(): void {
    try {
      unlinkSync(this.filePath)
    } catch {
      // ignore missing
    }
  }
}
