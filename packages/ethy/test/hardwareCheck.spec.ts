import { assert, describe, it } from 'vitest'

import { assessHardware } from '../src/ai/hardwareCheck.ts'

describe('[Ethy/ai]: hardwareCheck', () => {
  it('assessHardware() marks low RAM below 6 GiB', () => {
    const ok = assessHardware({
      totalRamBytes: 8 * 1024 ** 3,
      freeRamBytes: 4 * 1024 ** 3,
      freeDiskBytes: 10 * 1024 ** 3,
    })
    assert.isFalse(ok.lowHardware)
    const low = assessHardware({
      totalRamBytes: 4 * 1024 ** 3,
      freeRamBytes: 2 * 1024 ** 3,
      freeDiskBytes: 10 * 1024 ** 3,
    })
    assert.isTrue(low.lowHardware)
  })

  it('assessHardware() marks low disk below 2 GiB free', () => {
    const low = assessHardware({
      totalRamBytes: 16 * 1024 ** 3,
      freeRamBytes: 8 * 1024 ** 3,
      freeDiskBytes: 1024 ** 3,
    })
    assert.isTrue(low.lowHardware)
  })
})
