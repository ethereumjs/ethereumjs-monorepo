const tape = require('tape')
const BN = require('bn.js')
const Common = require('ethereumjs-common').default
const VM = require('../../../dist/index').default
const { ERROR } = require('../../../dist/exceptions')

const testCases = [
  { chain: 'mainnet', hardfork: 'istanbul', chainId: new BN(1) },
  { chain: 'mainnet', hardfork: 'constantinople', err: ERROR.INVALID_OPCODE },
  { chain: 'ropsten', hardfork: 'istanbul', chainId: new BN(3) }
]

// CHAINID PUSH8 0x00 MSTORE8 PUSH8 0x01 PUSH8 0x00 RETURN
const code = ['46', '60', '00', '53', '60', '01', '60', '00', 'f3']
tape('Istanbul: EIP-1344 CHAINID', async (t) => {
  const runCodeArgs = {
    code: Buffer.from(code.join(''), 'hex'),
    gasLimit: new BN(0xffff)
  }

  for (const testCase of testCases) {
    const common = new Common(testCase.chain, testCase.hardfork)
    const vm = new VM({ common })
    try {
      const res = await vm.runCode(runCodeArgs)
      if (testCase.err) {
        t.equal(res.exceptionError.error, testCase.err)
      } else {
        t.assert(res.exceptionError === undefined)
        t.assert(testCase.chainId.eq(new BN(res.returnValue)))
      }
    } catch (e) {
      t.fail(e.message)
    }
  }

  t.end()
})
