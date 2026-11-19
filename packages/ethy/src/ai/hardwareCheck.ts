import * as fs from 'node:fs'
import * as os from 'node:os'

export type HardwareSnapshot = {
  totalRamBytes: number
  freeRamBytes: number
  freeDiskBytes?: number
  lowHardware: boolean
  platform: string
  arch: string
}

const RAM_LOW_BYTES = 6 * 1024 ** 3
const DISK_LOW_BYTES = 2 * 1024 ** 3

export function assessHardware(input: {
  totalRamBytes: number
  freeRamBytes: number
  freeDiskBytes?: number
}): Omit<HardwareSnapshot, 'platform' | 'arch'> {
  const lowRam = input.totalRamBytes < RAM_LOW_BYTES
  const lowDisk = input.freeDiskBytes !== undefined ? input.freeDiskBytes < DISK_LOW_BYTES : false
  return {
    totalRamBytes: input.totalRamBytes,
    freeRamBytes: input.freeRamBytes,
    freeDiskBytes: input.freeDiskBytes,
    lowHardware: lowRam || lowDisk,
  }
}

export function probeHardware(dataDir: string): HardwareSnapshot {
  let freeDiskBytes: number | undefined
  try {
    const st = fs.statfsSync(dataDir)
    const bavail = (st as { bavail?: number }).bavail ?? 0
    const bsize = (st as { bsize?: number }).bsize ?? 0
    if (bavail > 0 && bsize > 0) freeDiskBytes = bavail * bsize
  } catch {
    freeDiskBytes = undefined
  }
  const base = assessHardware({
    totalRamBytes: os.totalmem(),
    freeRamBytes: os.freemem(),
    freeDiskBytes,
  })
  return {
    ...base,
    platform: process.platform,
    arch: process.arch,
  }
}

export function formatRamGiB(bytes: number): string {
  const gib = bytes / 1024 ** 3
  return `${gib.toFixed(1)} GiB`
}
