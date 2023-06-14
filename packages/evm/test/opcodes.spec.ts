import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import { assert, describe, it } from 'vitest'

import { EVM } from '../src/index.js'

describe('EVM -> getActiveOpcodes()', () => {
  const DIFFICULTY_PREVRANDAO = 0x44
  const CHAINID = 0x46 //istanbul opcode
  const BEGINSUB = 0x5c // EIP-2315 opcode

  it('should not expose opcodes from a follow-up HF (istanbul -> petersburg)', async () => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Petersburg })
    const evm = await EVM.create({
      common,
      stateManager: new DefaultStateManager(),
    })
    assert.equal(
      evm.getActiveOpcodes().get(CHAINID),
      undefined,
      'istanbul opcode not exposed (HF: < istanbul (petersburg)'
    )
  })

  it('should expose opcodes when HF is active (>= istanbul)', async () => {
    let common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    let evm = await EVM.create({
      common,
      stateManager: new DefaultStateManager(),
    })
    assert.equal(
      evm.getActiveOpcodes().get(CHAINID)!.name,
      'CHAINID',
      'istanbul opcode exposed (HF: istanbul)'
    )

    common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.MuirGlacier })
    evm = await EVM.create({
      common,
      stateManager: new DefaultStateManager(),
    })
    assert.equal(
      evm.getActiveOpcodes().get(CHAINID)!.name,
      'CHAINID',
      'istanbul opcode exposed (HF: > istanbul (muirGlacier)'
    )
  })

  it('should switch DIFFICULTY opcode name to PREVRANDAO when >= Merge HF', async () => {
    let common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    let evm = await EVM.create({
      common,
      stateManager: new DefaultStateManager(),
    })
    assert.equal(
      evm.getActiveOpcodes().get(DIFFICULTY_PREVRANDAO)!.name,
      'DIFFICULTY',
      'Opcode x44 named DIFFICULTY pre-Merge'
    )

    common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Paris })
    evm = await EVM.create({
      common,
      stateManager: new DefaultStateManager(),
    })
    assert.equal(
      evm.getActiveOpcodes().get(DIFFICULTY_PREVRANDAO)!.name,
      'PREVRANDAO',
      'Opcode x44 named PREVRANDAO post-Merge'
    )
  })

  it('should expose opcodes when EIP is active', async () => {
    let common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul, eips: [2315] })
    let evm = await EVM.create({
      common,
      stateManager: new DefaultStateManager(),
    })
    assert.equal(
      evm.getActiveOpcodes().get(BEGINSUB)!.name,
      'BEGINSUB',
      'EIP-2315 opcode BEGINSUB exposed (EIP-2315 activated)'
    )

    common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    evm = await EVM.create({
      common,
      stateManager: new DefaultStateManager(),
    })
    assert.equal(
      evm.getActiveOpcodes().get(BEGINSUB),
      undefined,
      'EIP-2315 opcode BEGINSUB not exposed (EIP-2315 not activated)'
    )
  })

  it('should update opcodes on a hardfork change', async () => {
    const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Istanbul })
    const evm = await EVM.create({
      common,
      stateManager: new DefaultStateManager(),
    })

    common.setHardfork(Hardfork.Byzantium)
    assert.equal(
      evm.getActiveOpcodes().get(CHAINID),
      undefined,
      'opcode not exposed after HF change (-> < istanbul)'
    )

    common.setHardfork(Hardfork.Istanbul)
    assert.equal(
      evm.getActiveOpcodes().get(CHAINID)!.name,
      'CHAINID',
      'opcode exposed after HF change (-> istanbul)'
    )
  })
})
