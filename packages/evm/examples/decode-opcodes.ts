// Decode opcodes example
//
// 1. Takes binary EVM code and decodes it into opcodes

import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { getOpcodesForHF, paramsEVM } from '@ethereumjs/evm'
import { bytesToHex, hexToBytes } from '@ethereumjs/util'

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Istanbul, params: paramsEVM })
const opcodes = getOpcodesForHF(common).opcodes

const data = '0x6107608061000e6000396000f30060003560e060020a90048063141961bc1461006e57806319ac74bd'

nameOpCodes(hexToBytes(data))

function nameOpCodes(raw: Uint8Array) {
  let pushData = new Uint8Array()

  for (let i = 0; i < raw.length; i++) {
    const pc = i
    const curOpCode = opcodes.get(raw[pc])?.name

    // no destinations into the middle of PUSH
    if (curOpCode?.slice(0, 4) === 'PUSH') {
      const jumpNum = raw[pc] - 0x5f
      pushData = raw.subarray(pc + 1, pc + jumpNum + 1)
      i += jumpNum
    }

    console.log(
      pad(pc, roundLog(raw.length, 10)) +
        '  ' +
        curOpCode +
        ' ' +
        (pushData?.length > 0 ? bytesToHex(pushData as Uint8Array) : ''),
    )

    pushData = new Uint8Array()
  }
}

function pad(num: number, size: number) {
  let s = num + ''
  while (s.length < size) s = '0' + s
  return s
}

function log(num: number, base: number) {
  return Math.log(num) / Math.log(base)
}

function roundLog(num: number, base: number) {
  return Math.ceil(log(num, base))
}
