import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM } from '@ethereumjs/evm'

const SLOTNUM = 0x4b
const STOP = 0x00

const main = async () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
  const evm = await createEVM({ common })

  const slotNumber = 42n
  const block = createBlock(
    { header: { slotNumber, gasLimit: 30_000_000n } },
    { common, skipConsensusFormatValidation: true },
  )

  const res = await evm.runCode({
    code: Uint8Array.from([SLOTNUM, STOP]),
    block,
    gasLimit: 100_000n,
  })

  const [top] = res.runState!.stack.peek(1)
  console.log(`SLOTNUM read consensus slot ${top} (header.slotNumber=${slotNumber})`)
  console.log(`Gas used: ${res.executionGasUsed}`)
}

void main()
