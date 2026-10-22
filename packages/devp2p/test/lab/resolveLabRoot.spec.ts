import { realpathSync } from 'node:fs'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { LAB_DIR_ENV } from '../../src/lab/constants.ts'
import { defaultNetwork, initLabDir, resolveLabRoot } from '../../src/lab/labDir.ts'

describe('[Devp2p/Lab]: resolveLabRoot', () => {
  const envSnapshot = process.env[LAB_DIR_ENV]
  const cwdSnapshot = process.cwd()

  afterEach(async () => {
    if (envSnapshot === undefined) delete process.env[LAB_DIR_ENV]
    else process.env[LAB_DIR_ENV] = envSnapshot
    process.chdir(cwdSnapshot)
  })

  it('finds lab when cwd is inside the lab directory', async () => {
    const root = resolve(await mkdtemp(join(tmpdir(), 'devp2p-lab-root-')))
    await initLabDir(root, ['alice'], 30300, defaultNetwork())
    process.chdir(join(root, 'alice'))
    expect(realpathSync(resolveLabRoot())).toBe(realpathSync(root))
  })

  it('uses DEVP2P_LAB when set', async () => {
    const root = await mkdtemp(join(tmpdir(), 'devp2p-lab-root-'))
    await initLabDir(root, ['alice'], 30300, defaultNetwork())
    process.env[LAB_DIR_ENV] = root
    process.chdir(tmpdir())
    expect(realpathSync(resolveLabRoot())).toBe(realpathSync(root))
  })
})
