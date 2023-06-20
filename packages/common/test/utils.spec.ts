import { hexStringToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { Common } from '../src/common'
import { Hardfork } from '../src/enums'
import { parseGethGenesis } from '../src/utils'

import * as gethGenesisKilnJSON from './data/geth-genesis/geth-genesis-kiln.json'
import * as invalidSpuriousDragonJSON from './data/geth-genesis/invalid-spurious-dragon.json'
import * as noExtraDataJSON from './data/geth-genesis/no-extra-data.json'
import * as poaJSON from './data/geth-genesis/poa.json'
import * as postMergeJSON from './data/geth-genesis/post-merge.json'
import * as testnetJSON from './data/geth-genesis/testnet.json'
import * as postMergeHardforkJSON from './data/post-merge-hardfork.json'

describe('[Utils/Parse]', () => {
  it('should parse geth params file', async () => {
    const params = parseGethGenesis(testnetJSON, 'rinkeby')
    assert.equal(params.genesis.nonce, '0x0000000000000042', 'nonce should be correctly formatted')
  })

  it('should throw with invalid Spurious Dragon blocks', async () => {
    const f = () => {
      parseGethGenesis(invalidSpuriousDragonJSON, 'bad_params')
    }
    assert.throws(f, undefined, undefined, 'should throw')
  })

  it('should import poa network params correctly', async () => {
    let params = parseGethGenesis(poaJSON, 'poa')
    assert.equal(params.genesis.nonce, '0x0000000000000000', 'nonce is formatted correctly')
    assert.deepEqual(
      params.consensus,
      { type: 'poa', algorithm: 'clique', clique: { period: 15, epoch: 30000 } },
      'consensus config matches'
    )
    const poaJSONCopy = Object.assign({}, poaJSON)
    poaJSONCopy.nonce = '00'
    params = parseGethGenesis(poaJSONCopy, 'poa')
    assert.equal(
      params.genesis.nonce,
      '0x0000000000000000',
      'non-hex prefixed nonce is formatted correctly'
    )
    assert.equal(params.hardfork, Hardfork.London, 'should correctly infer current hardfork')
  })

  it('should generate expected hash with london block zero and base fee per gas defined', async () => {
    const params = parseGethGenesis(postMergeJSON, 'post-merge')
    assert.equal(params.genesis.baseFeePerGas, postMergeJSON.baseFeePerGas)
  })

  it('should successfully parse genesis file with no extraData', async () => {
    const params = parseGethGenesis(noExtraDataJSON, 'noExtraData')
    assert.equal(params.genesis.extraData, '0x', 'extraData set to 0x')
    assert.equal(params.genesis.timestamp, '0x10', 'timestamp parsed correctly')
  })

  it('should successfully parse kiln genesis and set forkhash', async () => {
    const common = Common.fromGethGenesis(gethGenesisKilnJSON, {
      chain: 'customChain',
      genesisHash: hexStringToBytes(
        '51c7fe41be669f69c45c33a56982cbde405313342d9e2b00d7c91a7b284dd4f8'
      ),
      mergeForkIdPostMerge: false,
    })
    assert.deepEqual(
      common.hardforks().map((hf) => hf.name),
      [
        'chainstart',
        'homestead',
        'tangerineWhistle',
        'spuriousDragon',
        'byzantium',
        'constantinople',
        'petersburg',
        'istanbul',
        'berlin',
        'london',
        'mergeForkIdTransition',
        'paris',
      ],
      'hardfork parse order should be correct'
    )
    for (const hf of common.hardforks()) {
      /* eslint-disable @typescript-eslint/no-use-before-define */
      assert.equal(hf.forkHash, kilnForkHashes[hf.name], `${hf.name} forkHash should match`)
    }

    assert.equal(common.hardfork(), Hardfork.Paris, 'should correctly infer current hardfork')

    // Ok lets schedule shanghai at block 0, this should force merge to be scheduled at just after
    // genesis if even mergeForkIdTransition is not confirmed to be post merge
    // This will also check if the forks are being correctly sorted based on block
    Object.assign(gethGenesisKilnJSON.config, { shanghaiTime: Math.floor(Date.now() / 1000) })
    const common1 = Common.fromGethGenesis(gethGenesisKilnJSON, {
      chain: 'customChain',
    })
    // merge hardfork is now scheduled just after shanghai even if mergeForkIdTransition is not confirmed
    // to be post merge
    assert.deepEqual(
      common1.hardforks().map((hf) => hf.name),
      [
        'chainstart',
        'homestead',
        'tangerineWhistle',
        'spuriousDragon',
        'byzantium',
        'constantinople',
        'petersburg',
        'istanbul',
        'berlin',
        'london',
        'paris',
        'mergeForkIdTransition',
        'shanghai',
      ],
      'hardfork parse order should be correct'
    )

    assert.equal(common1.hardfork(), Hardfork.Shanghai, 'should correctly infer current hardfork')
  })

  it('should successfully parse genesis with hardfork scheduled post merge', async () => {
    const common = Common.fromGethGenesis(postMergeHardforkJSON, {
      chain: 'customChain',
    })
    assert.deepEqual(
      common.hardforks().map((hf) => hf.name),
      [
        'chainstart',
        'homestead',
        'tangerineWhistle',
        'spuriousDragon',
        'byzantium',
        'constantinople',
        'petersburg',
        'istanbul',
        'muirGlacier',
        'berlin',
        'london',
        'paris',
        'shanghai',
      ],
      'hardfork parse order should be correct'
    )

    assert.equal(common.getHardforkBy({ blockNumber: 0n }), Hardfork.London, 'london at genesis')
    assert.equal(
      common.getHardforkBy({ blockNumber: 1n, td: 2n }),
      Hardfork.Paris,
      'merge at block 1'
    )
    // shanghai is at timestamp 8
    assert.equal(
      common.getHardforkBy({ blockNumber: 8n }),
      Hardfork.London,
      'without timestamp still london'
    )
    assert.equal(
      common.getHardforkBy({ blockNumber: 8n, td: 2n }),
      Hardfork.Paris,
      'without timestamp at merge'
    )
    assert.equal(
      common.getHardforkBy({ blockNumber: 8n, timestamp: 8n }),
      Hardfork.Shanghai,
      'with timestamp at shanghai'
    )
    // should be post merge at shanghai
    assert.equal(
      common.getHardforkBy({ blockNumber: 8n, td: 2n, timestamp: 8n }),
      Hardfork.Shanghai,
      'post merge shanghai'
    )
    assert.equal(common.hardfork(), Hardfork.Shanghai, 'should correctly infer common hardfork')
  })
})

const kilnForkHashes: any = {
  chainstart: '0xbcadf543',
  homestead: '0xbcadf543',
  tangerineWhistle: '0xbcadf543',
  spuriousDragon: '0xbcadf543',
  byzantium: '0xbcadf543',
  constantinople: '0xbcadf543',
  petersburg: '0xbcadf543',
  istanbul: '0xbcadf543',
  berlin: '0xbcadf543',
  london: '0xbcadf543',
  mergeForkIdTransition: '0x013fd1b5',
  paris: '0x013fd1b5',
}
