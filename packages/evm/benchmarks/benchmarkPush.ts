import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { EVM } from '../dist/cjs'
import { Address, hexToBytes } from '@ethereumjs/util'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Cancun })
const maxCode = Number(common.param('vm', 'maxCodeSize'))

// This benchmarks benchmarks a code test where we run 30 million gas
// on a contract which tries to execute as much PUSH opcodes as possible
// To do this, we loop over the max code we can deposit, and PUSH POP each time
// Note that we have to POP, otherwise we stack overflow
// This runs:

/*
    JUMPDEST (1 gas): 733
    PUSH1:   (3 gas): 5998976
    POP:     (2 gas): 5998243
    JUMP:    (8 gas): 732

    This accounts to 30_000_003 gas, but this is correct since the "step" output will report the final PUSH opcode:
    It finds out after that there is not enough gas and thus go OOG
*/

let start = '5B' // JUMPDEST
let end = '600056' // PUSH 0 JUMP
let inbtw = '600050' // PUSH 0 POP (have to pop, otherwise we overflow stack)

let code = start

while (code.length + inbtw.length + end.length <= maxCode * 2) {
  code += inbtw
}

code = '0x' + code + end

async function bench() {
  const evm = await EVM.create({ common })
  const state = evm.stateManager

  /*let tbl:any = {

    }
    evm.events.on('step', (e) => {
        let op = e.opcode.name
        if (tbl[op] === undefined) {
            tbl[op] = 0
        }
        tbl[op]++
    })*/

  const toAddr = Address.fromString('0x' + 'cc'.repeat(20))
  await state.putContractCode(toAddr, hexToBytes(code))

  const tmr = performance.now()
  await evm.runCall({
    gasLimit: BigInt(30_000_000),
    to: toAddr,
  })

  const took = performance.now() - tmr
  console.log(`\tTook ${took}ms`)
  //console.log(tbl)
}

async function go() {
  console.log('----BENCHMARK: PUSH OPCODES----')
  for (let i = 0; i < 5; i++) {
    console.log(`\tStart run ${i + 1}`)
    await bench()
  }
}

go()
