import { bigIntToHex } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { createClient, createManager, getRPCClient, startRPC } from '../helpers.js'

import { generateBlockchain, generateConsecutiveBlock } from './util.js'

const method = 'debug_setHead'

describe(method, async () => {
  it('call with valid arguments', async () => {
    const { blockchain, blocks, _ } = await generateBlockchain(3)
    const a = await createClient({ blockchain })
    await a.service.skeleton?.open()
    const manager = createManager(a)
    const rpc = getRPCClient(startRPC(manager.getMethods()))

    assert.equal(
      await a.service.skeleton?.headHash(),
      undefined,
      'should return undefined when head is not set',
    )
    for (let i = 0; i < blocks.length; i++) {
      await rpc.request(method, [`0x${i}`])
      assert.deepEqual(
        await a.service.skeleton?.headHash()!,
        await blocks[i].header.hash(),
        `should return hash of block number ${i} set as head`,
      )
    }

    const newCanonicalHead = generateConsecutiveBlock(blocks[2], 1)
    await blockchain.putBlocks([newCanonicalHead])
    await rpc.request(method, [bigIntToHex(newCanonicalHead.header.number)])
    assert.deepEqual(
      await a.service.skeleton?.headHash()!,
      newCanonicalHead.header.hash(),
      `should set hash to new head when there is a fork`,
    )
  }, 30000)
})
