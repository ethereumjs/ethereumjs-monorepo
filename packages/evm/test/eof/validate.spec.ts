import { Chain, Common, Hardfork } from '@ethereumjs/common'
import * as tape from 'tape'

import { validateCode } from '../../src/eof'
import { EVM } from '../../src/evm'

import * as sampleinput from './sampleinput.json'
import * as sampleoutput from './sampleoutput.json'

const common: any = new Common({
  chain: Chain.Mainnet,
  hardfork: Hardfork.Merge,
  eips: [3540, 3670, 4200, 4750, 5450, 3860, 3855],
})

const eei: any = {}

const evm = new EVM({ common, eei })

function getBuffer(line: string) {
  let input = line.replace(/\W/g, '')
  if (input.substring(0, 1) === ' ') {
    input = input.substring(1)
  }
  if (input.substring(0, 2) === '0x') {
    const len = input.length - 2 + (input.length % 2)
    return Buffer.from(input.substring(2).padStart(len, '0'), 'hex')
  } else {
    const len = input.length + (input.length % 2)
    return Buffer.from(input.padStart(len, '0'), 'hex')
  }
}

tape('validate tx', (t) => {
  function parse(line: string, output?: string) {
    if (line.substring(0, 1) === '#') {
      return
    }
    try {
      const buf = getBuffer(line)
      validateCode(buf, evm._opcodes)
    } catch (e: any) {
      t.equal(e.message, output, 'matched expected ' + output)
    }
  }

  const _output: string[] = sampleoutput
  const _input: string[] = sampleinput
  for (const [idx, line] of _input.entries()) {
    parse(line, _output[idx])
  }

  t.end()
})
