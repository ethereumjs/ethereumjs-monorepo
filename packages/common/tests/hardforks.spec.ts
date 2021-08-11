import tape from 'tape'
import { BN } from 'ethereumjs-util'
import Common, { Chain, ConsensusAlgorithm, ConsensusType, Hardfork } from '../src'

tape('[Common]: Hardfork logic', function (t: tape.Test) {
  t.test('Hardfork access', function (st: tape.Test) {
    const supportedHardforks = [
      'chainstart',
      'homestead',
      'dao',
      'tangerineWhistle',
      'spuriousDragon',
      'byzantium',
      'constantinople',
      'petersburg',
      'istanbul',
      'berlin',
      'london',
      'shanghai',
      'merge',
    ]
    let c

    for (const hardfork of supportedHardforks) {
      c = new Common({ chain: Chain.Mainnet, hardfork: hardfork })
      st.equal(c.hardfork(), hardfork, hardfork)
    }

    st.end()
  })

  t.test('getHardforkByBlockNumber() / setHardforkByBlockNumber()', function (st: tape.Test) {
    let c = new Common({ chain: Chain.Mainnet })
    let msg = 'should get HF correctly'

    st.equal(c.getHardforkByBlockNumber(0), 'chainstart', msg)
    st.equal(c.getHardforkByBlockNumber(1149999), 'chainstart', msg)
    st.equal(c.getHardforkByBlockNumber(1150000), 'homestead', msg)
    st.equal(c.getHardforkByBlockNumber(1400000), 'homestead', msg)
    st.equal(c.getHardforkByBlockNumber(9200000), 'muirGlacier', msg)
    st.equal(c.getHardforkByBlockNumber(12244000), 'berlin', msg)
    st.equal(c.getHardforkByBlockNumber(12965000), 'london', msg)
    st.equal(c.getHardforkByBlockNumber(999999999999), 'london', msg)

    msg = 'should set HF correctly'

    st.equal(c.setHardforkByBlockNumber(0), 'chainstart', msg)
    st.equal(c.setHardforkByBlockNumber(1149999), 'chainstart', msg)
    st.equal(c.setHardforkByBlockNumber(1150000), 'homestead', msg)
    st.equal(c.setHardforkByBlockNumber(1400000), 'homestead', msg)
    st.equal(c.setHardforkByBlockNumber(12244000), 'berlin', msg)
    st.equal(c.setHardforkByBlockNumber(12965000), 'london', msg)
    st.equal(c.setHardforkByBlockNumber(999999999999), 'london', msg)

    c = new Common({ chain: Chain.Ropsten })
    st.equal(c.setHardforkByBlockNumber(0), 'tangerineWhistle', msg)

    st.end()
  })

  t.test('setHardfork(): hardforkChanged event', function (st) {
    const c = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    c.on('hardforkChanged', (hardfork: string) => {
      st.equal(hardfork, 'byzantium', 'should send correct hardforkChanged event')
      st.end()
    })
    c.setHardfork(Hardfork.Byzantium)
  })

  t.test('hardforkBlock()', function (st: tape.Test) {
    let c = new Common({ chain: Chain.Ropsten })
    let msg = 'should return the correct HF change block for byzantium (provided)'
    st.equal(c.hardforkBlock('byzantium'), 1700000, msg)

    c = new Common({ chain: Chain.Ropsten, hardfork: Hardfork.Byzantium })
    msg = 'should return the correct HF change block for byzantium (set)'
    st.equal(c.hardforkBlock(), 1700000, msg)

    c = new Common({ chain: Chain.Ropsten, hardfork: Hardfork.Istanbul })
    msg = 'should return the correct HF change block for istanbul (set)'
    st.equal(c.hardforkBlock(), 6485846, msg)

    st.end()
  })

  t.test('isHardforkBlock()', function (st: tape.Test) {
    let c = new Common({ chain: Chain.Ropsten })
    let msg = 'should return true for HF change block for byzantium (provided)'
    st.equal(c.isHardforkBlock(1700000, 'byzantium'), true, msg)

    msg = 'should return false for another block for byzantium (provided)'
    st.equal(c.isHardforkBlock(1700001, 'byzantium'), false, msg)

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
    st.equal(c.nextHardforkBlock(), 1, msg)

    msg =
      'should correctly skip a HF where block is set to null (rinkeby: homestead -> (dao) -> tangerineWhistle)'
    st.equal(c.nextHardforkBlock('homestead'), 2, msg)

    msg = 'should return correct next HF (rinkeby: byzantium -> constantinople)'
    st.equal(c.nextHardforkBlock('byzantium'), 3660663, msg)

    msg = 'should return null if next HF is not available (rinkeby: london -> shanghai)'
    st.equal(c.nextHardforkBlock('london'), null, msg)

    msg =
      'should work correctly along the need to skip several forks (ropsten: chainstart -> (homestead) -> (dao) -> (tangerineWhistle) -> spuriousDragon)'
    c = new Common({ chain: Chain.Ropsten, hardfork: Hardfork.Chainstart })
    st.equal(c.nextHardforkBlock(), 10, msg)

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
    st.equal(c.isNextHardforkBlock(3660663, 'byzantium'), true, msg)

    msg = 'should return false for a block number too low (rinkeby: byzantium -> constantinople)'
    st.equal(c.isNextHardforkBlock(124, 'byzantium'), false, msg)

    msg = 'should return false for a block number too high (rinkeby: byzantium -> constantinople)'
    st.equal(c.isNextHardforkBlock(605948938, 'byzantium'), false, msg)

    st.end()
  })

  t.test('activeHardforks()', function (st: tape.Test) {
    let c = new Common({ chain: Chain.Ropsten })
    let msg = 'should return correct number of active hardforks for Ropsten'
    st.equal(c.activeHardforks().length, 11, msg)

    msg = 'should return the correct HF data for Ropsten'
    st.equal(c.activeHardforks()[3]['name'], 'spuriousDragon', msg)

    msg = 'should return 3 active hardforks for Ropsten up to block 9'
    st.equal(c.activeHardforks(9).length, 3, msg)

    msg = 'should return 4 active hardforks for Ropsten up to block 10'
    st.equal(c.activeHardforks(10).length, 4, msg)

    c = new Common({
      chain: Chain.Ropsten,
      supportedHardforks: ['spuriousDragon', 'byzantium', 'constantinople'],
    })
    msg = 'should return 3 active HFs when restricted to supported HFs'
    st.equal(c.activeHardforks(null, { onlySupported: true }).length, 3, msg)

    c = new Common({
      chain: Chain.Ropsten,
      supportedHardforks: ['spuriousDragon', 'byzantium', 'dao'],
    })
    msg = 'should return 2 active HFs when restricted to supported HFs'
    st.equal(c.activeHardforks(null, { onlySupported: true }).length, 2, msg)

    c = new Common({ chain: Chain.Mainnet })
    msg = 'should return correct number of active HFs for mainnet'
    st.equal(c.activeHardforks().length, 12, msg)

    c = new Common({ chain: Chain.Rinkeby })
    msg = 'should return correct number of active HFs for rinkeby'
    st.equal(c.activeHardforks().length, 10, msg)

    c = new Common({ chain: Chain.Goerli })
    msg = 'should return correct number of active HFs for goerli'
    st.equal(c.activeHardforks().length, 10, msg)

    st.end()
  })

  t.test('activeHardfork()', function (st: tape.Test) {
    let c = new Common({ chain: Chain.Ropsten })
    let msg = 'should return correct latest active HF for Ropsten'
    st.equal(c.activeHardfork(), 'london', msg)

    msg = 'should return spuriousDragon as latest active HF for Ropsten for block 10'
    st.equal(c.activeHardfork(10), 'spuriousDragon', msg)

    c = new Common({
      chain: Chain.Ropsten,
      supportedHardforks: ['tangerineWhistle', 'spuriousDragon'],
    })
    msg = 'should return spuriousDragon as latest active HF for Ropsten with limited supported HFs'
    st.equal(c.activeHardfork(null, { onlySupported: true }), 'spuriousDragon', msg)

    c = new Common({ chain: Chain.Rinkeby })
    msg = 'should return correct latest active HF for Rinkeby'
    st.equal(c.activeHardfork(), 'london', msg)

    st.end()
  })

  t.test('hardforkIsActiveOnBlock() / activeOnBlock()', function (st: tape.Test) {
    let c = new Common({ chain: Chain.Ropsten })
    let msg = 'Ropsten, byzantium (provided), 1700000 -> true'
    st.equal(c.hardforkIsActiveOnBlock('byzantium', 1700000), true, msg)

    msg = 'Ropsten, byzantium (provided), 1700005 -> true'
    st.equal(c.hardforkIsActiveOnBlock('byzantium', 1700005), true, msg)

    msg = 'Ropsten, byzantium (provided), 1699999 -> false'
    st.equal(c.hardforkIsActiveOnBlock('byzantium', 1699999), false, msg)

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

  t.test('hardforkBlock() / hardforkBlockBN()', function (st: tape.Test) {
    const c = new Common({ chain: Chain.Mainnet })

    let msg = 'should return correct value'
    st.equal(c.hardforkBlock(Hardfork.Berlin), 12244000, msg)
    st.ok(c.hardforkBlockBN(Hardfork.Berlin)!.eq(new BN(12244000)), msg)

    msg = 'should return null for unscheduled hardfork'
    // developer note: when Shanghai is set,
    // update this test to next unscheduled hardfork.
    st.equal(c.hardforkBlock(Hardfork.Shanghai), null, msg)
    st.equal(c.hardforkBlockBN(Hardfork.Shanghai), null, msg)
    st.equal(c.nextHardforkBlockBN(Hardfork.Shanghai), null, msg)

    st.end()
  })

  t.test('hardforkGteHardfork()', function (st: tape.Test) {
    let c = new Common({ chain: Chain.Ropsten })
    let msg = 'Ropsten, constantinople >= byzantium (provided) -> true'
    st.equal(c.hardforkGteHardfork('constantinople', 'byzantium'), true, msg)

    msg = 'Ropsten, dao >= chainstart (provided), onlyActive -> false'
    st.equal(
      c.hardforkGteHardfork('dao', 'chainstart', {
        onlyActive: true,
      }),
      false,
      msg
    )

    msg = 'Ropsten, byzantium >= byzantium (provided) -> true'
    st.equal(c.hardforkGteHardfork('byzantium', 'byzantium'), true, msg)

    msg = 'Ropsten, spuriousDragon >= byzantium (provided) -> false'
    st.equal(c.hardforkGteHardfork('spuriousDragon', 'byzantium'), false, msg)

    c = new Common({ chain: Chain.Ropsten, hardfork: Hardfork.Byzantium })
    msg = 'Ropsten, byzantium (set) >= spuriousDragon -> true'
    st.equal(c.hardforkGteHardfork(null, 'spuriousDragon'), true, msg)

    msg = 'Ropsten, byzantium (set) >= spuriousDragon -> true (alias function)'
    st.equal(c.gteHardfork('spuriousDragon'), true, msg)

    msg = 'Ropsten, byzantium (set) >= spuriousDragon, onlyActive -> true'
    st.equal(c.hardforkGteHardfork(null, 'spuriousDragon', { onlyActive: true }), true, msg)

    msg = 'Ropsten, byzantium (set) >= byzantium -> true'
    st.equal(c.hardforkGteHardfork(null, 'byzantium'), true, msg)

    msg = 'Ropsten, byzantium (set) >= constantinople -> false'
    st.equal(c.hardforkGteHardfork(null, 'constantinople'), false, msg)

    st.end()
  })

  t.test('hardforkGteHardfork() ropsten', function (st: tape.Test) {
    const c = new Common({ chain: Chain.Ropsten })
    const msg = 'ropsten, spuriousDragon >= muirGlacier (provided) -> false'
    st.equal(c.hardforkGteHardfork('spuriousDragon', 'muirGlacier'), false, msg)

    st.end()
  })

  t.test('hardforkIsActiveOnChain()', function (st: tape.Test) {
    let c = new Common({ chain: Chain.Ropsten })
    let msg = 'should return true for byzantium (provided) on Ropsten'
    st.equal(c.hardforkIsActiveOnChain('byzantium'), true, msg)

    msg = 'should return false for dao (provided) on Ropsten'
    st.equal(c.hardforkIsActiveOnChain('dao'), false, msg)

    msg = 'should return true for petersburg (provided) on Ropsten'
    st.equal(c.hardforkIsActiveOnChain('petersburg'), true, msg)

    msg = 'should return false for a non-existing HF (provided) on Ropsten'
    st.equal(c.hardforkIsActiveOnChain('notexistinghardfork'), false, msg)

    let f = function () {
      c.hardforkIsActiveOnChain('spuriousDragon', { onlySupported: true })
    }
    msg = 'should not throw with unsupported Hf (provided) and onlySupported set to false'
    st.doesNotThrow(f, /unsupported hardfork$/, msg)

    c = new Common({ chain: Chain.Ropsten, hardfork: Hardfork.Byzantium })
    msg = 'should return true for byzantium (set) on Ropsten'
    st.equal(c.hardforkIsActiveOnChain(), true, msg)

    c = new Common({
      chain: Chain.Ropsten,
      supportedHardforks: ['byzantium', 'constantinople'],
    })
    f = function () {
      c.hardforkIsActiveOnChain('spuriousDragon', { onlySupported: true })
    }
    msg = 'should throw with unsupported Hf and onlySupported set to true'
    st.throws(f, /not set as supported in supportedHardforks$/, msg)

    st.end()
  })

  t.test('_calcForkHash()', function (st: tape.Test) {
    let c = new Common({ chain: Chain.Mainnet })
    let msg = 'should calc correctly for chainstart (only genesis)'
    st.equal(c._calcForkHash('chainstart'), '0xfc64ec04', msg)

    msg = 'should calc correctly for first applied HF'
    st.equal(c._calcForkHash('homestead'), '0x97c2c34c', msg)

    msg = 'should calc correctly for in-between applied HF'
    st.equal(c._calcForkHash('byzantium'), '0xa00bc324', msg)

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
    let c = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Byzantium })
    let msg = 'should provide correct forkHash for HF set'
    st.equal(c.forkHash(), '0xa00bc324', msg)

    msg = 'should provide correct forkHash for HF provided'
    st.equal(c.forkHash('spuriousDragon'), '0x3edd5b10', msg)

    c = new Common({ chain: Chain.Kovan })
    const f = () => {
      c.forkHash('london')
    }
    msg = 'should throw when called on non-applied or future HF'
    st.throws(f, /No fork hash calculation possible/, msg)

    st.end()
  })

  t.test('hardforkForForkHash()', function (st: tape.Test) {
    const c = new Common({ chain: Chain.Mainnet })

    let msg = 'should return the correct HF array for a matching forkHash'
    const res = c.hardforkForForkHash('0x3edd5b10')
    st.equal(res.name, 'spuriousDragon', msg)

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
