import { hexStringToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { Chain, Common, ConsensusAlgorithm, ConsensusType, Hardfork } from '../src/index.js'

import * as gethGenesisKilnJSON from './data/geth-genesis/geth-genesis-kiln.json'

describe('[Common]: Hardfork logic', () => {
  it('Hardfork access', () => {
    const supportedHardforks = [
      Hardfork.Chainstart,
      Hardfork.Homestead,
      Hardfork.Dao,
      Hardfork.Chainstart,
      Hardfork.SpuriousDragon,
      Hardfork.Byzantium,
      Hardfork.Constantinople,
      Hardfork.Petersburg,
      Hardfork.Istanbul,
      Hardfork.Berlin,
      Hardfork.London,
      Hardfork.ArrowGlacier,
      Hardfork.GrayGlacier,
      Hardfork.Shanghai,
      Hardfork.Paris,
    ]
    let c

    for (const hardfork of supportedHardforks) {
      c = new Common({ chain: Chain.Mainnet, hardfork })
      assert.equal(c.hardfork(), hardfork, hardfork)
    }
  })

  it('getHardforkBy() / setHardforkBy()', () => {
    let c = new Common({ chain: Chain.Mainnet })
    let msg = 'should get HF correctly'

    assert.equal(c.getHardforkBy({ blockNumber: 0n }), Hardfork.Chainstart, msg)
    assert.equal(c.getHardforkBy({ blockNumber: 1149999n }), Hardfork.Chainstart, msg)
    assert.equal(c.getHardforkBy({ blockNumber: 1150000n }), Hardfork.Homestead, msg)
    assert.equal(c.getHardforkBy({ blockNumber: 1400000n }), Hardfork.Homestead, msg)
    assert.equal(c.getHardforkBy({ blockNumber: 9200000n }), Hardfork.MuirGlacier, msg)
    assert.equal(c.getHardforkBy({ blockNumber: 12244000n }), Hardfork.Berlin, msg)
    assert.equal(c.getHardforkBy({ blockNumber: 12965000n }), Hardfork.London, msg)
    assert.equal(c.getHardforkBy({ blockNumber: 13773000n }), Hardfork.ArrowGlacier, msg)
    assert.equal(c.getHardforkBy({ blockNumber: 15050000n }), Hardfork.GrayGlacier, msg)
    // merge is now specified at 15537394 in config
    assert.equal(c.getHardforkBy({ blockNumber: 999999999999n }), Hardfork.Paris, msg)
    msg = 'should set HF correctly'

    assert.equal(c.setHardforkBy({ blockNumber: 0n }), Hardfork.Chainstart, msg)
    assert.equal(c.setHardforkBy({ blockNumber: 1149999n }), Hardfork.Chainstart, msg)
    assert.equal(c.setHardforkBy({ blockNumber: 1150000n }), Hardfork.Homestead, msg)
    assert.equal(c.setHardforkBy({ blockNumber: 1400000n }), Hardfork.Homestead, msg)
    assert.equal(c.setHardforkBy({ blockNumber: 12244000n }), Hardfork.Berlin, msg)
    assert.equal(c.setHardforkBy({ blockNumber: 12965000n }), Hardfork.London, msg)
    assert.equal(c.setHardforkBy({ blockNumber: 13773000n }), Hardfork.ArrowGlacier, msg)
    assert.equal(c.setHardforkBy({ blockNumber: 15050000n }), Hardfork.GrayGlacier, msg)
    // merge is now specified at 15537394 in config
    assert.equal(c.setHardforkBy({ blockNumber: 999999999999n }), Hardfork.Paris, msg)

    c = new Common({ chain: Chain.Ropsten })
    assert.equal(c.setHardforkBy({ blockNumber: 0n }), 'tangerineWhistle', msg)
  })

  it('should throw if no hardfork qualifies', () => {
    const hardforks = [
      {
        name: 'homestead',
        block: 3,
      },
      {
        name: 'tangerineWhistle',
        block: 3,
      },
      {
        name: 'spuriousDragon',
        block: 3,
      },
    ]

    const c = Common.custom({ hardforks }, { baseChain: Chain.Sepolia })
    const f = () => {
      c.getHardforkBy({ blockNumber: 0n })
    }
    assert.throws(f, undefined, undefined, 'throw since no hardfork qualifies')

    const msg = 'should return correct value'
    assert.equal(c.setHardforkBy({ blockNumber: 3n }), Hardfork.SpuriousDragon, msg)
  })

  it('setHardfork(): hardforkChanged event', () => {
    const c = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    c.on('hardforkChanged', (hardfork: string) => {
      assert.equal(hardfork, Hardfork.Byzantium, 'should send correct hardforkChanged event')
    })
    c.setHardfork(Hardfork.Byzantium)
  })

  it('hardforkBlock()', () => {
    let c = new Common({ chain: Chain.Ropsten })
    let msg = 'should return the correct HF change block for byzantium (provided)'
    assert.equal(c.hardforkBlock(Hardfork.Byzantium)!, BigInt(1700000), msg)

    msg = 'should return null if HF does not exist on chain'
    assert.equal(c.hardforkBlock('thisHardforkDoesNotExist'), null, msg)

    c = new Common({ chain: Chain.Ropsten, hardfork: Hardfork.Byzantium })
    msg = 'should return the correct HF change block for byzantium (set)'
    assert.equal(c.hardforkBlock()!, BigInt(1700000), msg)

    c = new Common({ chain: Chain.Ropsten, hardfork: Hardfork.Istanbul })
    msg = 'should return the correct HF change block for istanbul (set)'
    assert.equal(c.hardforkBlock()!, BigInt(6485846), msg)
  })

  it('nextHardforkBlockOrTimestamp()', () => {
    let c = new Common({ chain: Chain.Rinkeby, hardfork: Hardfork.Chainstart })
    let msg =
      'should work with HF set / return correct next HF block for chainstart (rinkeby: chainstart -> homestead)'
    assert.equal(c.nextHardforkBlockOrTimestamp()!, BigInt(1), msg)

    msg =
      'should correctly skip a HF where block is set to null (rinkeby: homestead -> (dao) -> tangerineWhistle)'
    assert.equal(c.nextHardforkBlockOrTimestamp('homestead')!, BigInt(2), msg)

    msg = 'should return correct next HF (rinkeby: byzantium -> constantinople)'
    assert.equal(c.nextHardforkBlockOrTimestamp(Hardfork.Byzantium)!, BigInt(3660663), msg)

    msg = 'should return null if next HF is not available (rinkeby: london -> shanghai)'
    assert.equal(c.nextHardforkBlockOrTimestamp(Hardfork.London), null, msg)

    msg =
      'should work correctly along the need to skip several forks (ropsten: chainstart -> (homestead) -> (dao) -> (tangerineWhistle) -> spuriousDragon)'
    c = new Common({ chain: Chain.Ropsten, hardfork: Hardfork.Chainstart })
    assert.equal(c.nextHardforkBlockOrTimestamp()!, BigInt(10), msg)
  })

  it('hardforkIsActiveOnBlock() / activeOnBlock()', () => {
    let c = new Common({ chain: Chain.Ropsten })
    let msg = 'Ropsten, byzantium (provided), 1700000 -> true'
    assert.equal(c.hardforkIsActiveOnBlock(Hardfork.Byzantium, 1700000), true, msg)

    msg = 'Ropsten, byzantium (provided), 1700005 -> true'
    assert.equal(c.hardforkIsActiveOnBlock(Hardfork.Byzantium, 1700005), true, msg)

    msg = 'Ropsten, byzantium (provided), 1699999 -> false'
    assert.equal(c.hardforkIsActiveOnBlock(Hardfork.Byzantium, 1699999), false, msg)

    c = new Common({ chain: Chain.Ropsten, hardfork: Hardfork.Byzantium })
    msg = 'Ropsten, byzantium (set), 1700000 -> true'
    assert.equal(c.hardforkIsActiveOnBlock(null, 1700000), true, msg)

    msg = 'Ropsten, byzantium (set), 1700000 -> true (alias function)'
    assert.equal(c.activeOnBlock(1700000), true, msg)

    msg = 'Ropsten, byzantium (set), 1700005 -> true'
    assert.equal(c.hardforkIsActiveOnBlock(null, 1700005), true, msg)

    msg = 'Ropsten, byzantium (set), 1699999 -> false'
    assert.equal(c.hardforkIsActiveOnBlock(null, 1699999), false, msg)
  })

  it('hardforkBlock()', () => {
    const c = new Common({ chain: Chain.Mainnet })

    let msg = 'should return correct value'
    assert.equal(c.hardforkBlock(Hardfork.Berlin)!, BigInt(12244000), msg)
    assert.equal(c.hardforkBlock(Hardfork.Berlin)!, BigInt(12244000), msg)

    msg = 'should return null for unscheduled hardfork'
    // developer note: when Shanghai is set,
    // update this test to next unscheduled hardfork.
    assert.equal(c.hardforkBlock(Hardfork.Shanghai), null, msg)
    assert.equal(c.hardforkBlock(Hardfork.Shanghai), null, msg)
    assert.equal(c.nextHardforkBlockOrTimestamp(Hardfork.Shanghai), null, msg)
  })

  it('hardforkGteHardfork()', () => {
    let c = new Common({ chain: Chain.Ropsten })
    let msg = 'Ropsten, constantinople >= byzantium (provided) -> true'
    assert.equal(c.hardforkGteHardfork(Hardfork.Constantinople, Hardfork.Byzantium), true, msg)

    msg = 'Ropsten, dao >= chainstart (provided) -> false'
    assert.equal(c.hardforkGteHardfork(Hardfork.Dao, Hardfork.Chainstart), false, msg)

    msg = 'Ropsten, byzantium >= byzantium (provided) -> true'
    assert.equal(c.hardforkGteHardfork(Hardfork.Byzantium, Hardfork.Byzantium), true, msg)

    msg = 'Ropsten, spuriousDragon >= byzantium (provided) -> false'
    assert.equal(c.hardforkGteHardfork(Hardfork.SpuriousDragon, Hardfork.Byzantium), false, msg)

    c = new Common({ chain: Chain.Ropsten, hardfork: Hardfork.Byzantium })
    msg = 'Ropsten, byzantium (set) >= spuriousDragon -> true'
    assert.equal(c.hardforkGteHardfork(null, Hardfork.SpuriousDragon), true, msg)

    msg = 'Ropsten, byzantium (set) >= spuriousDragon -> true (alias function)'
    assert.equal(c.gteHardfork(Hardfork.SpuriousDragon), true, msg)

    msg = 'Ropsten, byzantium (set) >= byzantium -> true'
    assert.equal(c.hardforkGteHardfork(null, Hardfork.Byzantium), true, msg)

    msg = 'Ropsten, byzantium (set) >= constantinople -> false'
    assert.equal(c.hardforkGteHardfork(null, Hardfork.Constantinople), false, msg)
  })

  it('hardforkGteHardfork() ropsten', () => {
    const c = new Common({ chain: Chain.Ropsten })
    const msg = 'ropsten, spuriousDragon >= muirGlacier (provided) -> false'
    assert.equal(c.hardforkGteHardfork(Hardfork.SpuriousDragon, Hardfork.MuirGlacier), false, msg)
  })

  it('_calcForkHash()', () => {
    const chains: [Chain, Uint8Array][] = [
      [
        Chain.Mainnet,
        hexStringToBytes('d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3'),
      ],
      [
        Chain.Ropsten,
        hexStringToBytes('41941023680923e0fe4d74a34bdac8141f2540e3ae90623718e47d66d1ca4a2d'),
      ],
      [
        Chain.Rinkeby,
        hexStringToBytes('6341fd3daf94b748c72ced5a5b26028f2474f5f00d824504e4fa37a75767e177'),
      ],
      [
        Chain.Goerli,
        hexStringToBytes('bf7e331f7f7c1dd2e05159666b3bf8bc7a8a3a9eb1d518969eab529dd9b88c1a'),
      ],
      [
        Chain.Sepolia,
        hexStringToBytes('25a5cc106eea7138acab33231d7160d69cb777ee0c2c553fcddf5138993e6dd9'),
      ],
    ]

    let c = new Common({ chain: Chain.Mainnet })
    const mainnetGenesisHash = chains[0][1]
    let msg = 'should calc correctly for chainstart (only genesis)'
    assert.equal(c._calcForkHash(Hardfork.Chainstart, mainnetGenesisHash), '0xfc64ec04', msg)

    msg = 'should calc correctly for first applied HF'
    assert.equal(c._calcForkHash(Hardfork.Homestead, mainnetGenesisHash), '0x97c2c34c', msg)

    msg = 'should calc correctly for in-between applied HF'
    assert.equal(c._calcForkHash(Hardfork.Byzantium, mainnetGenesisHash), '0xa00bc324', msg)

    for (const [chain, genesisHash] of chains) {
      c = new Common({ chain })
      for (const hf of c.hardforks()) {
        if (typeof hf.forkHash === 'string') {
          const msg = `Verify forkHash calculation for: ${Chain[chain]} -> ${hf.name}`
          assert.equal(c._calcForkHash(hf.name, genesisHash), hf.forkHash, msg)
        }
      }
    }
  })

  it('forkHash()', () => {
    let c = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Byzantium })
    let msg = 'should provide correct forkHash for HF set'
    assert.equal(c.forkHash(), '0xa00bc324', msg)

    msg = 'should provide correct forkHash for HF provided'
    assert.equal(c.forkHash(Hardfork.SpuriousDragon), '0x3edd5b10', msg)
    const genesisHash = hexStringToBytes(
      'd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3'
    )
    assert.equal(c.forkHash(Hardfork.SpuriousDragon, genesisHash), '0x3edd5b10', msg)

    c = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Shanghai })
    // unschedule shanghai on it to test
    c.hardforks()
      .filter((hf) => hf.name === Hardfork.Shanghai)
      .map((hf) => {
        hf.block = null
        hf.timestamp = undefined
      })
    let f = () => {
      c.forkHash(Hardfork.Shanghai)
    }
    msg = 'should throw when called on non-applied or future HF'
    assert.throws(f, /No fork hash calculation possible/, undefined, msg)

    f = () => {
      c.forkHash('thisHardforkDoesNotExist')
    }
    msg = 'should throw when called with a HF that does not exist on chain'
    assert.throws(f, /No fork hash calculation possible/, undefined, msg)
  })

  it('hardforkForForkHash()', () => {
    const c = new Common({ chain: Chain.Mainnet })

    let msg = 'should return the correct HF array for a matching forkHash'
    const res = c.hardforkForForkHash('0x3edd5b10')!
    assert.equal(res.name, Hardfork.SpuriousDragon, msg)

    msg = 'should return null for a forkHash not matching any HF'
    assert.equal(c.hardforkForForkHash('0x12345'), null, msg)
  })

  it('HF consensus updates', () => {
    let c = new Common({ chain: Chain.Goerli, hardfork: Hardfork.Byzantium })
    assert.equal(
      c.consensusType(),
      ConsensusType.ProofOfAuthority,
      'should provide the correct initial chain consensus type'
    )
    assert.equal(
      c.consensusAlgorithm(),
      ConsensusAlgorithm.Clique,
      'should provide the correct initial chain consensus algorithm'
    )
    assert.equal(
      c.consensusConfig()['period'],
      15,
      'should provide the correct initial chain consensus configuration'
    )

    c = new Common({ chain: Chain.Goerli, hardfork: Hardfork.Paris })
    assert.equal(
      c.consensusType(),
      ConsensusType.ProofOfStake,
      'should provide the correct updated chain consensus type'
    )
    assert.equal(
      c.consensusAlgorithm(),
      ConsensusAlgorithm.Casper,
      'should provide the correct updated chain consensus algorithm'
    )
    assert.deepEqual(
      c.consensusConfig(),
      {},
      'should provide the correct updated chain consensus configuration'
    )
  })

  it('Should correctly apply hardfork changes', () => {
    // For sepolia MergeForkIdTransition happens AFTER merge
    let c = new Common({ chain: Chain.Sepolia, hardfork: Hardfork.London })
    assert.equal(
      c['HARDFORK_CHANGES'][11][0],
      Hardfork.Paris,
      'should correctly apply hardfork changes'
    )
    assert.equal(
      c['HARDFORK_CHANGES'][12][0],
      Hardfork.MergeForkIdTransition,
      'should correctly apply hardfork changes'
    )

    // Should give correct ConsensusType pre and post merge
    assert.equal(
      c.consensusType(),
      ConsensusType.ProofOfWork,
      'should provide the correct initial chain consensus type'
    )
    c.setHardfork(Hardfork.Paris)
    assert.equal(
      c.consensusType(),
      ConsensusType.ProofOfStake,
      `should switch to ProofOfStake consensus on merge`
    )
    c.setHardfork(Hardfork.MergeForkIdTransition)
    assert.equal(
      c.consensusType(),
      ConsensusType.ProofOfStake,
      `should stay on ProofOfStake consensus post merge`
    )

    // For kiln MergeForkIdTransition happens BEFORE Merge
    c = Common.fromGethGenesis(gethGenesisKilnJSON, {
      chain: 'kiln',
      mergeForkIdPostMerge: false,
    })

    // MergeForkIdTransition change should be before Merge
    assert.equal(
      c['HARDFORK_CHANGES'][10][0],
      Hardfork.MergeForkIdTransition,
      'should correctly apply hardfork changes'
    )
    assert.equal(
      c['HARDFORK_CHANGES'][11][0],
      Hardfork.Paris,
      'should correctly apply hardfork changes'
    )

    // Should give correct ConsensusType pre and post merge
    c.setHardfork(Hardfork.London)
    assert.equal(
      c.consensusType(),
      ConsensusType.ProofOfWork,
      'should provide the correct initial chain consensus type'
    )
    c.setHardfork(Hardfork.Paris)
    assert.equal(
      c.consensusType(),
      ConsensusType.ProofOfStake,
      `should switch to ProofOfStake consensus on merge`
    )
    c.setHardfork(Hardfork.MergeForkIdTransition)
    assert.equal(
      c.consensusType(),
      ConsensusType.ProofOfWork,
      `should give pow consensus as MergeForkIdTransition is pre-merge`
    )
  })
})
