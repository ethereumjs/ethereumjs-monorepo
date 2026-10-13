import { createBlockFromRLP } from '@ethereumjs/block'
import { hexToBytes } from '@ethereumjs/util'
import { MemoryLevel } from 'memory-level'
import { assert, describe, it } from 'vitest'
import { Chain } from '../../src/blockchain/index.ts'
import { Config } from '../../src/config.ts'
import { IndexOperation, IndexType, TxIndex } from '../../src/execution/txIndex.ts'

const blockWithTx = createBlockFromRLP(
  hexToBytes(
    '0xf90261f901f9a017fdd296b813fe768d064604609730648e13ddb7c1166b4c50137de2be19781ea01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347940000000000000000000000000000000000000000a0ad2aee0119debb7370f87035d8f1c4ca75c07548ea739ac83183d3d0a548d8eaa09f23e384d88abd1f4f0a50bcf2a4e21a2aec99324a9e0bfbad2e6ae8182511a1a0fc1dbecb6850d3cd9eb9c69bea09ca8dc93eef71e93192d8240d53338cd31b09b901000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000083020000018347b760825208846127929280a00000000000000000000000000000000000000000000000000000000000000000880000000000000000f862f8608064831e848094000000000000000000000000000000000000000080801ca055eee749c90a5a85477d3c74346652c391aa808287f3176936b8b57d8e36dc98a07630b929b29df9fd9b24c017519180a85eb1da4e9169c4e4623a678903aa4a20c0',
  ),
  { setHardfork: true },
)

describe('TxIndex', async () => {
  const config = new Config({ accountCache: 10000, storageCache: 1000, txLookupLimit: 0 })
  const chain = await Chain.create({ config })
  const metaDB = new MemoryLevel({
    valueEncoding: 'view',
    keyEncoding: 'view',
  }) as any
  const txIndex = new TxIndex({ config, chain, metaDB })

  it('should initialize', async () => {
    assert.isDefined(txIndex, 'txIndex should be defined')
  })

  await txIndex.updateIndex(IndexOperation.Save, IndexType.TxHash, blockWithTx)

  const stored = await txIndex.getIndex(blockWithTx.transactions[0].hash())
  assert.isNotNull(stored, 'should return a tx index value')
  const [blockHash, position] = stored

  assert.deepEqual(blockHash, blockWithTx.hash(), 'should return the correct block hash')
  assert.equal(position, 0, 'should return the correct position')
})
