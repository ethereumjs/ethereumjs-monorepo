import * as tape from 'tape'

import { Chain, Common, ConsensusAlgorithm, ConsensusType, Hardfork } from '../src'

tape('[Common]: Hardfork logic', function (t: tape.Test) {
  t.test('Hardfork access', function (st: tape.Test) {
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
      Hardfork.Merge,
    ]
    let c

    for (const hardfork of supportedHardforks) {
      c = new Common({ chain: Chain.Mainnet, hardfork })
      st.equal(c.hardfork(), hardfork, hardfork)
    }

    st.end()
  })

  t.test('getHardforkByBlockNumber() / setHardforkByBlockNumber()', function (st: tape.Test) {
    let c = new Common({ chain: Chain.Mainnet })
    let msg = 'should get HF correctly'

    st.equal(c.getHardforkByBlockNumber(0), Hardfork.Chainstart, msg)
    st.equal(c.getHardforkByBlockNumber(1149999), Hardfork.Chainstart, msg)
    st.equal(c.getHardforkByBlockNumber(1150000), Hardfork.Homestead, msg)
    st.equal(c.getHardforkByBlockNumber(1400000), Hardfork.Homestead, msg)
    st.equal(c.getHardforkByBlockNumber(9200000), Hardfork.MuirGlacier, msg)
    st.equal(c.getHardforkByBlockNumber(12244000), Hardfork.Berlin, msg)
    st.equal(c.getHardforkByBlockNumber(12965000), Hardfork.London, msg)
    st.equal(c.getHardforkByBlockNumber(13773000), Hardfork.ArrowGlacier, msg)
    st.equal(c.getHardforkByBlockNumber(15050000), Hardfork.GrayGlacier, msg)
    st.equal(c.getHardforkByBlockNumber(999999999999), Hardfork.GrayGlacier, msg)
    msg = 'should set HF correctly'

    st.equal(c.setHardforkByBlockNumber(0), Hardfork.Chainstart, msg)
    st.equal(c.setHardforkByBlockNumber(1149999), Hardfork.Chainstart, msg)
    st.equal(c.setHardforkByBlockNumber(1150000), Hardfork.Homestead, msg)
    st.equal(c.setHardforkByBlockNumber(1400000), Hardfork.Homestead, msg)
    st.equal(c.setHardforkByBlockNumber(12244000), Hardfork.Berlin, msg)
    st.equal(c.setHardforkByBlockNumber(12965000), Hardfork.London, msg)
    st.equal(c.setHardforkByBlockNumber(13773000), Hardfork.ArrowGlacier, msg)
    st.equal(c.setHardforkByBlockNumber(15050000), Hardfork.GrayGlacier, msg)
    st.equal(c.setHardforkByBlockNumber(999999999999), Hardfork.GrayGlacier, msg)

    c = new Common({ chain: Chain.Ropsten })
    st.equal(c.setHardforkByBlockNumber(0), 'tangerineWhistle', msg)

    st.end()
  })

  t.test('test post merge hardforks using Sepolia', function (st: tape.Test) {
    const c = new Common({ chain: Chain.Sepolia })
    let msg = 'should get HF correctly'

    st.equal(c.getHardforkByBlockNumber(0), Hardfork.London, msg)
    //using Hardfork.London even though Merge is expected after terminal block 1450408
    st.equal(c.getHardforkByBlockNumber(1450409), Hardfork.London, msg)
    st.equal(c.getHardforkByBlockNumber(1450409, BigInt('17000000000000000')), Hardfork.Merge, msg)
    st.equal(c.getHardforkByBlockNumber(1735371), Hardfork.MergeForkIdTransition, msg)
    st.equal(c.getHardforkByBlockNumber(1735371, undefined), Hardfork.MergeForkIdTransition, msg)
    st.equal(
      c.getHardforkByBlockNumber(1735371, BigInt('17000000000000000')),
      Hardfork.MergeForkIdTransition,
      msg
    )
    try {
      st.equal(
        c.getHardforkByBlockNumber(1735371, BigInt('15000000000000000')),
        Hardfork.MergeForkIdTransition,
        msg
      )
      st.fail('should have thrown as specified td < merge ttd for a post merge hardfork')
    } catch (error) {
      st.pass('throws error as specified td < merge ttd for a post merge hardfork')
    }
    try {
      st.equal(
        c.getHardforkByBlockNumber(1760410, undefined, true),
        Hardfork.MergeForkIdTransition,
        msg
      )
      st.fail(
        'should have thrown as a post merge block provided without providing td with strick td checks enabled'
      )
    } catch (error) {
      st.pass(
        'throws error as a post merge block provided without providing td with strick td checks enabled'
      )
    }

    msg = 'should set HF correctly'

    st.equal(c.setHardforkByBlockNumber(0), Hardfork.London, msg)
    //using Hardfork.London even though Merge is expected after terminal block 1450408
    st.equal(c.setHardforkByBlockNumber(1450409), Hardfork.London, msg)
    st.equal(c.setHardforkByBlockNumber(1450409, BigInt('17000000000000000')), Hardfork.Merge, msg)
    st.equal(c.setHardforkByBlockNumber(1735371), Hardfork.MergeForkIdTransition, msg)
    st.equal(c.setHardforkByBlockNumber(1735371, undefined), Hardfork.MergeForkIdTransition, msg)
    st.equal(
      c.setHardforkByBlockNumber(1735371, BigInt('17000000000000000')),
      Hardfork.MergeForkIdTransition,
      msg
    )
    try {
      st.equal(
        c.setHardforkByBlockNumber(1735371, BigInt('15000000000000000')),
        Hardfork.MergeForkIdTransition,
        msg
      )
      st.fail('should have thrown as specified td < merge ttd for a post merge hardfork')
    } catch (error) {
      st.pass('throws error as specified td < merge ttd for a post merge hardfork')
    }
    try {
      st.equal(
        c.setHardforkByBlockNumber(1760410, undefined, true),
        Hardfork.MergeForkIdTransition,
        msg
      )
      st.fail(
        'should have thrown as a post merge block provided without providing td with strick td checks enabled'
      )
    } catch (error) {
      st.pass(
        'throws error as a post merge block provided without providing td with strick td checks enabled'
      )
    }

    st.end()
  })

  t.test('setHardfork(): hardforkChanged event', function (st) {
    const c = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    c.on('hardforkChanged', (hardfork: string) => {
      st.equal(hardfork, Hardfork.Byzantium, 'should send correct hardforkChanged event')
      st.end()
    })
    c.setHardfork(Hardfork.Byzantium)
  })

  t.test('hardforkBlock()', function (st: tape.Test) {
    let c = new Common({ chain: Chain.Ropsten })
    let msg = 'should return the correct HF change block for byzantium (provided)'
    st.equal(c.hardforkBlock(Hardfork.Byzantium)!, BigInt(1700000), msg)

    msg = 'should return null if HF does not exist on chain'
    st.equal(c.hardforkBlock('thisHardforkDoesNotExist'), null, msg)

    c = new Common({ chain: Chain.Ropsten, hardfork: Hardfork.Byzantium })
    msg = 'should return the correct HF change block for byzantium (set)'
    st.equal(c.hardforkBlock()!, BigInt(1700000), msg)

    c = new Common({ chain: Chain.Ropsten, hardfork: Hardfork.Istanbul })
    msg = 'should return the correct HF change block for istanbul (set)'
    st.equal(c.hardforkBlock()!, BigInt(6485846), msg)

    st.end()
  })

  t.test('isHardforkBlock()', function (st: tape.Test) {
    let c = new Common({ chain: Chain.Ropsten })
    let msg = 'should return true for HF change block for byzantium (provided)'
    st.equal(c.isHardforkBlock(1700000, Hardfork.Byzantium), true, msg)

    msg = 'should return false for another block for byzantium (provided)'
    st.equal(c.isHardforkBlock(1700001, Hardfork.Byzantium), false, msg)

    c = new Common({ chain: Chain.Ropsten, hardfork: Hardfork.Byzantium })
    msg = 'should return true for HF change block for byzantium (set)'
    st.equal(c.isHardforkBlock(1700000), true, msg)

    msg = 'should return false for another block for byzantium (set)'
    st.equal(c.isHardforkBlock(1700001), false, msg)

    st.end()
  })

  t.test('nextHardforkBlock()', function (st: tape.Test) {
    let c = new Common({ chain: Chain.Rinkeby, hardfork: Hardfork.Chainstart })
    let msg =
      'should work with HF set / return correct next HF block for chainstart (rinkeby: chainstart -> homestead)'
    st.equal(c.nextHardforkBlock()!, BigInt(1), msg)

    msg =
      'should correctly skip a HF where block is set to null (rinkeby: homestead -> (dao) -> tangerineWhistle)'
    st.equal(c.nextHardforkBlock('homestead')!, BigInt(2), msg)

    msg = 'should return correct next HF (rinkeby: byzantium -> constantinople)'
    st.equal(c.nextHardforkBlock(Hardfork.Byzantium)!, BigInt(3660663), msg)

    msg = 'should return null if next HF is not available (rinkeby: london -> shanghai)'
    st.equal(c.nextHardforkBlock(Hardfork.London), null, msg)

    msg =
      'should work correctly along the need to skip several forks (ropsten: chainstart -> (homestead) -> (dao) -> (tangerineWhistle) -> spuriousDragon)'
    c = new Common({ chain: Chain.Ropsten, hardfork: Hardfork.Chainstart })
    st.equal(c.nextHardforkBlock()!, BigInt(10), msg)

    st.end()
  })

  t.test('isNextHardforkBlock()', function (st: tape.Test) {
    const c = new Common({ chain: Chain.Rinkeby, hardfork: Hardfork.Chainstart })
    let msg =
      'should work with HF set / return true for correct next HF block for chainstart (rinkeby: chainstart -> homestead)'
    st.equal(c.isNextHardforkBlock(1), true, msg)

    msg =
      'should correctly skip a HF where block is set to null (rinkeby: homestead -> (dao) -> tangerineWhistle)'
    st.equal(c.isNextHardforkBlock(2, 'homestead'), true, msg)

    msg = 'should return true for correct next HF (rinkeby: byzantium -> constantinople)'
    st.equal(c.isNextHardforkBlock(3660663, Hardfork.Byzantium), true, msg)

    msg = 'should return false for a block number too low (rinkeby: byzantium -> constantinople)'
    st.equal(c.isNextHardforkBlock(124, Hardfork.Byzantium), false, msg)

    msg = 'should return false for a block number too high (rinkeby: byzantium -> constantinople)'
    st.equal(c.isNextHardforkBlock(605948938, Hardfork.Byzantium), false, msg)

    st.end()
  })

  t.test('hardforkIsActiveOnBlock() / activeOnBlock()', function (st: tape.Test) {
    let c = new Common({ chain: Chain.Ropsten })
    let msg = 'Ropsten, byzantium (provided), 1700000 -> true'
    st.equal(c.hardforkIsActiveOnBlock(Hardfork.Byzantium, 1700000), true, msg)

    msg = 'Ropsten, byzantium (provided), 1700005 -> true'
    st.equal(c.hardforkIsActiveOnBlock(Hardfork.Byzantium, 1700005), true, msg)

    msg = 'Ropsten, byzantium (provided), 1699999 -> false'
    st.equal(c.hardforkIsActiveOnBlock(Hardfork.Byzantium, 1699999), false, msg)

    c = new Common({ chain: Chain.Ropsten, hardfork: Hardfork.Byzantium })
    msg = 'Ropsten, byzantium (set), 1700000 -> true'
    st.equal(c.hardforkIsActiveOnBlock(null, 1700000), true, msg)

    msg = 'Ropsten, byzantium (set), 1700000 -> true (alias function)'
    st.equal(c.activeOnBlock(1700000), true, msg)

    msg = 'Ropsten, byzantium (set), 1700005 -> true'
    st.equal(c.hardforkIsActiveOnBlock(null, 1700005), true, msg)

    msg = 'Ropsten, byzantium (set), 1699999 -> false'
    st.equal(c.hardforkIsActiveOnBlock(null, 1699999), false, msg)

    st.end()
  })

  t.test('hardforkBlock()', function (st: tape.Test) {
    const c = new Common({ chain: Chain.Mainnet })

    let msg = 'should return correct value'
    st.equal(c.hardforkBlock(Hardfork.Berlin)!, BigInt(12244000), msg)
    st.equal(c.hardforkBlock(Hardfork.Berlin)!, BigInt(12244000), msg)

    msg = 'should return null for unscheduled hardfork'
    // developer note: when Shanghai is set,
    // update this test to next unscheduled hardfork.
    st.equal(c.hardforkBlock(Hardfork.Shanghai), null, msg)
    st.equal(c.hardforkBlock(Hardfork.Shanghai), null, msg)
    st.equal(c.nextHardforkBlock(Hardfork.Shanghai), null, msg)

    st.end()
  })

  t.test('hardforkGteHardfork()', function (st: tape.Test) {
    let c = new Common({ chain: Chain.Ropsten })
    let msg = 'Ropsten, constantinople >= byzantium (provided) -> true'
    st.equal(c.hardforkGteHardfork(Hardfork.Constantinople, Hardfork.Byzantium), true, msg)

    msg = 'Ropsten, dao >= chainstart (provided) -> false'
    st.equal(c.hardforkGteHardfork(Hardfork.Dao, Hardfork.Chainstart), false, msg)

    msg = 'Ropsten, byzantium >= byzantium (provided) -> true'
    st.equal(c.hardforkGteHardfork(Hardfork.Byzantium, Hardfork.Byzantium), true, msg)

    msg = 'Ropsten, spuriousDragon >= byzantium (provided) -> false'
    st.equal(c.hardforkGteHardfork(Hardfork.SpuriousDragon, Hardfork.Byzantium), false, msg)

    c = new Common({ chain: Chain.Ropsten, hardfork: Hardfork.Byzantium })
    msg = 'Ropsten, byzantium (set) >= spuriousDragon -> true'
    st.equal(c.hardforkGteHardfork(null, Hardfork.SpuriousDragon), true, msg)

    msg = 'Ropsten, byzantium (set) >= spuriousDragon -> true (alias function)'
    st.equal(c.gteHardfork(Hardfork.SpuriousDragon), true, msg)

    msg = 'Ropsten, byzantium (set) >= byzantium -> true'
    st.equal(c.hardforkGteHardfork(null, Hardfork.Byzantium), true, msg)

    msg = 'Ropsten, byzantium (set) >= constantinople -> false'
    st.equal(c.hardforkGteHardfork(null, Hardfork.Constantinople), false, msg)

    st.end()
  })

  t.test('hardforkGteHardfork() ropsten', function (st: tape.Test) {
    const c = new Common({ chain: Chain.Ropsten })
    const msg = 'ropsten, spuriousDragon >= muirGlacier (provided) -> false'
    st.equal(c.hardforkGteHardfork(Hardfork.SpuriousDragon, Hardfork.MuirGlacier), false, msg)

    st.end()
  })

  t.test('_calcForkHash()', function (st: tape.Test) {
    const chains: [Chain, Buffer][] = [
      [
        Chain.Mainnet,
        Buffer.from('d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3', 'hex'),
      ],
      [
        Chain.Ropsten,
        Buffer.from('41941023680923e0fe4d74a34bdac8141f2540e3ae90623718e47d66d1ca4a2d', 'hex'),
      ],
      [
        Chain.Rinkeby,
        Buffer.from('6341fd3daf94b748c72ced5a5b26028f2474f5f00d824504e4fa37a75767e177', 'hex'),
      ],
      [
        Chain.Goerli,
        Buffer.from('bf7e331f7f7c1dd2e05159666b3bf8bc7a8a3a9eb1d518969eab529dd9b88c1a', 'hex'),
      ],
      [
        Chain.Sepolia,
        Buffer.from('25a5cc106eea7138acab33231d7160d69cb777ee0c2c553fcddf5138993e6dd9', 'hex'),
      ],
    ]

    let c = new Common({ chain: Chain.Mainnet })
    const mainnetGenesisHash = chains[0][1]
    let msg = 'should calc correctly for chainstart (only genesis)'
    st.equal(c._calcForkHash(Hardfork.Chainstart, mainnetGenesisHash), '0xfc64ec04', msg)

    msg = 'should calc correctly for first applied HF'
    st.equal(c._calcForkHash(Hardfork.Homestead, mainnetGenesisHash), '0x97c2c34c', msg)

    msg = 'should calc correctly for in-between applied HF'
    st.equal(c._calcForkHash(Hardfork.Byzantium, mainnetGenesisHash), '0xa00bc324', msg)

    for (const [chain, genesisHash] of chains) {
      c = new Common({ chain })
      for (const hf of c.hardforks()) {
        if (typeof hf.forkHash === 'string') {
          const msg = `Verify forkHash calculation for: ${Chain[chain]} -> ${hf.name}`
          st.equal(c._calcForkHash(hf.name, genesisHash), hf.forkHash, msg)
        }
      }
    }
    st.end()
  })

  t.test('forkHash()', function (st: tape.Test) {
    let c = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Byzantium })
    let msg = 'should provide correct forkHash for HF set'
    st.equal(c.forkHash(), '0xa00bc324', msg)

    msg = 'should provide correct forkHash for HF provided'
    st.equal(c.forkHash(Hardfork.SpuriousDragon), '0x3edd5b10', msg)
    const genesisHash = Buffer.from(
      'd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
      'hex'
    )
    st.equal(c.forkHash(Hardfork.SpuriousDragon, genesisHash), '0x3edd5b10', msg)

    c = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Shanghai })
    let f = () => {
      c.forkHash(Hardfork.Shanghai)
    }
    msg = 'should throw when called on non-applied or future HF'
    st.throws(f, /No fork hash calculation possible/, msg)

    f = () => {
      c.forkHash('thisHardforkDoesNotExist')
    }
    msg = 'should throw when called with a HF that does not exist on chain'
    st.throws(f, /No fork hash calculation possible/, msg)

    st.end()
  })

  t.test('hardforkForForkHash()', function (st: tape.Test) {
    const c = new Common({ chain: Chain.Mainnet })

    let msg = 'should return the correct HF array for a matching forkHash'
    const res = c.hardforkForForkHash('0x3edd5b10')!
    st.equal(res.name, Hardfork.SpuriousDragon, msg)

    msg = 'should return null for a forkHash not matching any HF'
    st.equal(c.hardforkForForkHash('0x12345'), null, msg)

    st.end()
  })

  t.test('HF consensus updates', function (st: tape.Test) {
    let c = new Common({ chain: Chain.Goerli, hardfork: Hardfork.Byzantium })
    st.equal(
      c.consensusType(),
      ConsensusType.ProofOfAuthority,
      'should provide the correct initial chain consensus type'
    )
    st.equal(
      c.consensusAlgorithm(),
      ConsensusAlgorithm.Clique,
      'should provide the correct initial chain consensus algorithm'
    )
    st.equal(
      c.consensusConfig()['period'],
      15,
      'should provide the correct initial chain consensus configuration'
    )

    c = new Common({ chain: Chain.Goerli, hardfork: Hardfork.Merge })
    st.equal(
      c.consensusType(),
      ConsensusType.ProofOfStake,
      'should provide the correct updated chain consensus type'
    )
    st.equal(
      c.consensusAlgorithm(),
      ConsensusAlgorithm.Casper,
      'should provide the correct updated chain consensus algorithm'
    )
    st.deepEqual(
      c.consensusConfig(),
      {},
      'should provide the correct updated chain consensus configuration'
    )

    st.end()
  })
})
