import { createBlockchain } from '@ethereumjs/blockchain'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { createEVM } from '@ethereumjs/evm'
import { DefaultStateManager } from '@ethereumjs/statemanager'
import { bytesToHex, hexToBytes } from '@ethereumjs/util'

import type { PrefixedHexString } from '@ethereumjs/util'

const main = async () => {
  const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Shanghai })
  const stateManager = new DefaultStateManager()
  const blockchain = await createBlockchain()

  const evm = await createEVM({
    common,
    stateManager,
    blockchain,
  })

  const STOP = '00'
  const ADD = '01'
  const PUSH1 = '60'

  // Note that numbers added are hex values, so '20' would be '32' as decimal e.g.
  const code = [PUSH1, '03', PUSH1, '05', ADD, STOP]

  evm.events.on('step', function (data) {
    // Note that data.stack is not immutable, i.e. it is a reference to the vm's internal stack object
    console.log(`Opcode: ${data.opcode.name}\tStack: ${data.stack}`)
  })

  const results = await evm.runCode({
    code: hexToBytes(('0x' + code.join('')) as PrefixedHexString),
    gasLimit: BigInt(0xffff),
  })

  console.log(`Returned: ${bytesToHex(results.returnValue)}`)
  console.log(`gasUsed: ${results.executionGasUsed.toString()}`)
}

void main()
