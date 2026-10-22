import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { LAB_NODE_ENV } from '../../src/lab/constants.ts'
import {
  defaultNetwork,
  initLabDir,
  resolveLabNode,
  setLabDefaultNode,
} from '../../src/lab/labDir.ts'

describe('[Devp2p/Lab]: resolveLabNode', () => {
  const envSnapshot = process.env[LAB_NODE_ENV]

  afterEach(() => {
    if (envSnapshot === undefined) delete process.env[LAB_NODE_ENV]
    else process.env[LAB_NODE_ENV] = envSnapshot
  })

  it('uses explicit --node over env and file', async () => {
    const root = await mkdtemp(join(tmpdir(), 'devp2p-resolve-'))
    await initLabDir(root, ['alice', 'bob'], 30300, defaultNetwork())
    await setLabDefaultNode(root, 'bob')
    process.env[LAB_NODE_ENV] = 'bob'
    expect(await resolveLabNode(root, 'alice')).toBe('alice')
  })

  it('uses DEVP2P_NODE when --node is omitted', async () => {
    const root = await mkdtemp(join(tmpdir(), 'devp2p-resolve-'))
    await initLabDir(root, ['alice', 'bob'], 30300, defaultNetwork())
    process.env[LAB_NODE_ENV] = 'bob'
    expect(await resolveLabNode(root, undefined)).toBe('bob')
  })

  it('uses lab/.node after devp2p use', async () => {
    const root = await mkdtemp(join(tmpdir(), 'devp2p-resolve-'))
    await initLabDir(root, ['alice', 'bob'], 30300, defaultNetwork())
    delete process.env[LAB_NODE_ENV]
    await setLabDefaultNode(root, 'alice')
    expect(await resolveLabNode(root, undefined)).toBe('alice')
  })

  it('picks the only configured node', async () => {
    const root = await mkdtemp(join(tmpdir(), 'devp2p-resolve-'))
    await initLabDir(root, ['solo'], 30300, defaultNetwork())
    delete process.env[LAB_NODE_ENV]
    expect(await resolveLabNode(root, undefined)).toBe('solo')
  })

  it('errors when several nodes and no default', async () => {
    const root = await mkdtemp(join(tmpdir(), 'devp2p-resolve-'))
    await initLabDir(root, ['alice', 'bob'], 30300, defaultNetwork())
    delete process.env[LAB_NODE_ENV]
    await expect(resolveLabNode(root, undefined)).rejects.toThrow(/Ambiguous lab node/)
  })
})
