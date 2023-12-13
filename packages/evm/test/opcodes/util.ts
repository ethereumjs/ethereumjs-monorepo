import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { EVM } from '../../src'
import { hexToBytes } from '@ethereumjs/util'

const allHardforks = Object.keys(Hardfork)
console.log(allHardforks)

type TestOpts = {
  hardforks?: Hardfork[] | 'all'
  testName: string
  testCode: string
  profile?: boolean
  profileOpcode?: string | false
  gasLimit?: bigint
}

const defaultTestOpts: Partial<TestOpts> = {
  hardforks: [Hardfork.Shanghai],
  profile: false,
  profileOpcode: false,
  gasLimit: BigInt(30_000_00),
}

function removeHexPrefix(input: string) {
  return input.startsWith('0x') ? input.slice(2) : input
}

/**
 * Returns code which loops forever
 */
export function makeLoopCode(input: string) {
  '5B' + removeHexPrefix(input) + '600056'
}

export function runTest(opts: TestOpts) {
  opts = {
    ...defaultTestOpts,
    ...opts,
  }
  const { hardforks, testCode, gasLimit } = <Required<TestOpts>>opts

  let hfs = hardforks === 'all' ? allHardforks : hardforks
  for (const hf of hfs) {
    const common = new Common({ chain: Chain.Mainnet, hardfork: hf })
    const evm = new EVM({
      common,
    })
    evm.runCode({
      code: hexToBytes(testCode),
      gasLimit,
    })
  }
}
