import tape from 'tape'
import Common, { ChainId, ConsensusAlgorithm, ConsensusType, HardforkName } from '../src'

tape('[Common]: Hardfork logic', function (t: tape.Test) {
  t.test('Hardfork access', function (st: tape.Test) {
    const supportedHardforks = [
      HardforkName.Chainstart,
      HardforkName.Homestead,
      HardforkName.Dao,
      HardforkName.Chainstart,
      HardforkName.SpuriousDragon,
      HardforkName.Byzantium,
      HardforkName.Constantinople,
      HardforkName.Petersburg,
      HardforkName.Istanbul,
      HardforkName.Berlin,
      HardforkName.London,
      HardforkName.ArrowGlacier,
      HardforkName.Shanghai,
      HardforkName.Merge,
    ]
    let c

    for (const hardfork of supportedHardforks) {
      c = new Common({ chain: ChainId.Mainnet, hardfork: hardfork })
      st.equal(c.hardfork(), hardfork, hardfork)
    }

    st.end()
  })

  t.test('getHardforkByBlockNumber() / setHardforkByBlockNumber()', function (st: tape.Test) {
    let c = new Common({ chain: ChainId.Mainnet })
    let msg = 'should get HF correctly'

    st.equal(c.getHardforkByBlockNumber(0), HardforkName.Chainstart, msg)
    st.equal(c.getHardforkByBlockNumber(1149999), HardforkName.Chainstart, msg)
    st.equal(c.getHardforkByBlockNumber(1150000), HardforkName.Homestead, msg)
    st.equal(c.getHardforkByBlockNumber(1400000), HardforkName.Homestead, msg)
    st.equal(c.getHardforkByBlockNumber(9200000), HardforkName.MuirGlacier, msg)
    st.equal(c.getHardforkByBlockNumber(12244000), HardforkName.Berlin, msg)
    st.equal(c.getHardforkByBlockNumber(12965000), HardforkName.London, msg)
    st.equal(c.getHardforkByBlockNumber(13773000), HardforkName.ArrowGlacier, msg)
    st.equal(c.getHardforkByBlockNumber(999999999999), HardforkName.ArrowGlacier, msg)

    msg = 'should set HF correctly'

    st.equal(c.setHardforkByBlockNumber(0), HardforkName.Chainstart, msg)
    st.equal(c.setHardforkByBlockNumber(1149999), HardforkName.Chainstart, msg)
    st.equal(c.setHardforkByBlockNumber(1150000), HardforkName.Homestead, msg)
    st.equal(c.setHardforkByBlockNumber(1400000), HardforkName.Homestead, msg)
    st.equal(c.setHardforkByBlockNumber(12244000), HardforkName.Berlin, msg)
    st.equal(c.setHardforkByBlockNumber(12965000), HardforkName.London, msg)
    st.equal(c.setHardforkByBlockNumber(13773000), HardforkName.ArrowGlacier, msg)
    st.equal(c.setHardforkByBlockNumber(999999999999), HardforkName.ArrowGlacier, msg)

    c = new Common({ chain: ChainId.Ropsten })
    st.equal(c.setHardforkByBlockNumber(0), 'tangerineWhistle', msg)

    st.end()
  })

  t.test('setHardfork(): hardforkChanged event', function (st) {
    const c = new Common({ chain: ChainId.Mainnet, hardfork: HardforkName.Istanbul })
    c.on('hardforkChanged', (hardfork: string) => {
      st.equal(hardfork, HardforkName.Byzantium, 'should send correct hardforkChanged event')
      st.end()
    })
    c.setHardfork(HardforkName.Byzantium)
  })

  t.test('hardforkBlock()', function (st: tape.Test) {
    let c = new Common({ chain: ChainId.Ropsten })
    let msg = 'should return the correct HF change block for byzantium (provided)'
    st.equal(c.hardforkBlock(HardforkName.Byzantium)!, BigInt(1700000), msg)

    msg = 'should return null if HF does not exist on chain'
    st.equal(c.hardforkBlock('thisHardforkDoesNotExist'), null, msg)

    c = new Common({ chain: ChainId.Ropsten, hardfork: HardforkName.Byzantium })
    msg = 'should return the correct HF change block for byzantium (set)'
    st.equal(c.hardforkBlock()!, BigInt(1700000), msg)

    c = new Common({ chain: ChainId.Ropsten, hardfork: HardforkName.Istanbul })
    msg = 'should return the correct HF change block for istanbul (set)'
    st.equal(c.hardforkBlock()!, BigInt(6485846), msg)

    st.end()
  })

  t.test('isHardforkBlock()', function (st: tape.Test) {
    let c = new Common({ chain: ChainId.Ropsten })
    let msg = 'should return true for HF change block for byzantium (provided)'
    st.equal(c.isHardforkBlock(1700000, HardforkName.Byzantium), true, msg)

    msg = 'should return false for another block for byzantium (provided)'
    st.equal(c.isHardforkBlock(1700001, HardforkName.Byzantium), false, msg)

    c = new Common({ chain: ChainId.Ropsten, hardfork: HardforkName.Byzantium })
    msg = 'should return true for HF change block for byzantium (set)'
    st.equal(c.isHardforkBlock(1700000), true, msg)

    msg = 'should return false for another block for byzantium (set)'
    st.equal(c.isHardforkBlock(1700001), false, msg)

    st.end()
  })

  t.test('nextHardforkBlock()', function (st: tape.Test) {
    let c = new Common({ chain: ChainId.Rinkeby, hardfork: HardforkName.Chainstart })
    let msg =
      'should work with HF set / return correct next HF block for chainstart (rinkeby: chainstart -> homestead)'
    st.equal(c.nextHardforkBlock()!, BigInt(1), msg)

    msg =
      'should correctly skip a HF where block is set to null (rinkeby: homestead -> (dao) -> tangerineWhistle)'
    st.equal(c.nextHardforkBlock('homestead')!, BigInt(2), msg)

    msg = 'should return correct next HF (rinkeby: byzantium -> constantinople)'
    st.equal(c.nextHardforkBlock(HardforkName.Byzantium)!, BigInt(3660663), msg)

    msg = 'should return null if next HF is not available (rinkeby: london -> shanghai)'
    st.equal(c.nextHardforkBlock(HardforkName.London), null, msg)

    msg =
      'should work correctly along the need to skip several forks (ropsten: chainstart -> (homestead) -> (dao) -> (tangerineWhistle) -> spuriousDragon)'
    c = new Common({ chain: ChainId.Ropsten, hardfork: HardforkName.Chainstart })
    st.equal(c.nextHardforkBlock()!, BigInt(10), msg)

    st.end()
  })

  t.test('isNextHardforkBlock()', function (st: tape.Test) {
    const c = new Common({ chain: ChainId.Rinkeby, hardfork: HardforkName.Chainstart })
    let msg =
      'should work with HF set / return true for correct next HF block for chainstart (rinkeby: chainstart -> homestead)'
    st.equal(c.isNextHardforkBlock(1), true, msg)

    msg =
      'should correctly skip a HF where block is set to null (rinkeby: homestead -> (dao) -> tangerineWhistle)'
    st.equal(c.isNextHardforkBlock(2, 'homestead'), true, msg)

    msg = 'should return true for correct next HF (rinkeby: byzantium -> constantinople)'
    st.equal(c.isNextHardforkBlock(3660663, HardforkName.Byzantium), true, msg)

    msg = 'should return false for a block number too low (rinkeby: byzantium -> constantinople)'
    st.equal(c.isNextHardforkBlock(124, HardforkName.Byzantium), false, msg)

    msg = 'should return false for a block number too high (rinkeby: byzantium -> constantinople)'
    st.equal(c.isNextHardforkBlock(605948938, HardforkName.Byzantium), false, msg)

    st.end()
  })

  t.test('hardforkIsActiveOnBlock() / activeOnBlock()', function (st: tape.Test) {
    let c = new Common({ chain: ChainId.Ropsten })
    let msg = 'Ropsten, byzantium (provided), 1700000 -> true'
    st.equal(c.hardforkIsActiveOnBlock(HardforkName.Byzantium, 1700000), true, msg)

    msg = 'Ropsten, byzantium (provided), 1700005 -> true'
    st.equal(c.hardforkIsActiveOnBlock(HardforkName.Byzantium, 1700005), true, msg)

    msg = 'Ropsten, byzantium (provided), 1699999 -> false'
    st.equal(c.hardforkIsActiveOnBlock(HardforkName.Byzantium, 1699999), false, msg)

    c = new Common({ chain: ChainId.Ropsten, hardfork: HardforkName.Byzantium })
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
    const c = new Common({ chain: ChainId.Mainnet })

    let msg = 'should return correct value'
    st.equal(c.hardforkBlock(HardforkName.Berlin)!, BigInt(12244000), msg)
    st.equal(c.hardforkBlock(HardforkName.Berlin)!, BigInt(12244000), msg)

    msg = 'should return null for unscheduled hardfork'
    // developer note: when Shanghai is set,
    // update this test to next unscheduled hardfork.
    st.equal(c.hardforkBlock(HardforkName.Shanghai), null, msg)
    st.equal(c.hardforkBlock(HardforkName.Shanghai), null, msg)
    st.equal(c.nextHardforkBlock(HardforkName.Shanghai), null, msg)

    st.end()
  })

  t.test('hardforkGteHardfork()', function (st: tape.Test) {
    let c = new Common({ chain: ChainId.Ropsten })
    let msg = 'Ropsten, constantinople >= byzantium (provided) -> true'
    st.equal(c.hardforkGteHardfork(HardforkName.Constantinople, HardforkName.Byzantium), true, msg)

    msg = 'Ropsten, dao >= chainstart (provided) -> false'
    st.equal(c.hardforkGteHardfork(HardforkName.Dao, HardforkName.Chainstart), false, msg)

    msg = 'Ropsten, byzantium >= byzantium (provided) -> true'
    st.equal(c.hardforkGteHardfork(HardforkName.Byzantium, HardforkName.Byzantium), true, msg)

    msg = 'Ropsten, spuriousDragon >= byzantium (provided) -> false'
    st.equal(c.hardforkGteHardfork(HardforkName.SpuriousDragon, HardforkName.Byzantium), false, msg)

    c = new Common({ chain: ChainId.Ropsten, hardfork: HardforkName.Byzantium })
    msg = 'Ropsten, byzantium (set) >= spuriousDragon -> true'
    st.equal(c.hardforkGteHardfork(null, HardforkName.SpuriousDragon), true, msg)

    msg = 'Ropsten, byzantium (set) >= spuriousDragon -> true (alias function)'
    st.equal(c.gteHardfork(HardforkName.SpuriousDragon), true, msg)

    msg = 'Ropsten, byzantium (set) >= byzantium -> true'
    st.equal(c.hardforkGteHardfork(null, HardforkName.Byzantium), true, msg)

    msg = 'Ropsten, byzantium (set) >= constantinople -> false'
    st.equal(c.hardforkGteHardfork(null, HardforkName.Constantinople), false, msg)

    st.end()
  })

  t.test('hardforkGteHardfork() ropsten', function (st: tape.Test) {
    const c = new Common({ chain: ChainId.Ropsten })
    const msg = 'ropsten, spuriousDragon >= muirGlacier (provided) -> false'
    st.equal(
      c.hardforkGteHardfork(HardforkName.SpuriousDragon, HardforkName.MuirGlacier),
      false,
      msg
    )

    st.end()
  })

  t.test('_calcForkHash()', function (st: tape.Test) {
    let c = new Common({ chain: ChainId.Mainnet })
    let msg = 'should calc correctly for chainstart (only genesis)'
    st.equal(c._calcForkHash('chainstart'), '0xfc64ec04', msg)

    msg = 'should calc correctly for first applied HF'
    st.equal(c._calcForkHash('homestead'), '0x97c2c34c', msg)

    msg = 'should calc correctly for in-between applied HF'
    st.equal(c._calcForkHash(HardforkName.Byzantium), '0xa00bc324', msg)

    const chains = ['mainnet', 'ropsten', 'rinkeby', 'goerli', 'kovan']

    chains.forEach((chain) => {
      c = new Common({ chain: chain })

      for (const hf of c.hardforks()) {
        if (hf.forkHash && hf.forkHash !== null) {
          const msg = `Verify forkHash calculation for: ${chain} -> ${hf.name}`
          st.equal(c._calcForkHash(hf.name), hf.forkHash, msg)
        }
      }
    })

    st.end()
  })

  t.test('forkHash()', function (st: tape.Test) {
    let c = new Common({ chain: ChainId.Mainnet, hardfork: HardforkName.Byzantium })
    let msg = 'should provide correct forkHash for HF set'
    st.equal(c.forkHash(), '0xa00bc324', msg)

    msg = 'should provide correct forkHash for HF provided'
    st.equal(c.forkHash(HardforkName.SpuriousDragon), '0x3edd5b10', msg)

    c = new Common({ chain: ChainId.Kovan })
    let f = () => {
      c.forkHash(HardforkName.Merge)
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
    const c = new Common({ chain: ChainId.Mainnet })

    let msg = 'should return the correct HF array for a matching forkHash'
    const res = c.hardforkForForkHash('0x3edd5b10')!
    st.equal(res.name, HardforkName.SpuriousDragon, msg)

    msg = 'should return null for a forkHash not matching any HF'
    st.equal(c.hardforkForForkHash('0x12345'), null, msg)

    st.end()
  })

  t.test('HF consensus updates', function (st: tape.Test) {
    let c = new Common({ chain: ChainId.Goerli, hardfork: HardforkName.Byzantium })
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

    c = new Common({ chain: ChainId.Goerli, hardfork: HardforkName.Merge })
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
