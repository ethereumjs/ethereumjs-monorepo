import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM } from '@ethereumjs/evm'
import {
  bigIntToBytes,
  createAccount,
  createAddressFromString,
  setLengthLeft,
} from '@ethereumjs/util'

const PUSH32 = 0x7f
const PUSH1 = 0x60
const RETURN = 0xf3

/** Initcode that returns `returnSize` zero bytes from memory (becomes deployed runtime code). */
function buildReturnInitcode(returnSize: number): Uint8Array {
  const sizeWord = setLengthLeft(bigIntToBytes(BigInt(returnSize)), 32)
  return Uint8Array.from([PUSH32, ...sizeWord, PUSH1, 0x00, RETURN])
}

const CALLER = createAddressFromString('0x00000000000000000000000000000000000000ee')
const DEPLOY_GAS = 50_000_000n

/** One byte above pre-7954 maxCodeSize (24576); fits under Amsterdam (65536). */
const OVER_LEGACY_MAX_CODE_SIZE = 24576 + 1

async function deployRuntimeCode(hardfork: Hardfork, returnSize: number) {
  const common = new Common({ chain: Mainnet, hardfork })
  const evm = await createEVM({ common })
  await evm.stateManager.putAccount(CALLER, createAccount({ nonce: 0n, balance: BigInt(1e18) }))

  const result = await evm.runCall({
    caller: CALLER,
    data: buildReturnInitcode(returnSize),
    gasLimit: DEPLOY_GAS,
  })

  const error = result.execResult.exceptionError?.error as string | undefined
  const deployed = result.createdAddress
  const codeLen =
    deployed !== undefined ? ((await evm.stateManager.getCode(deployed))?.length ?? 0) : 0

  return { hardfork, returnSize, error, deployed, codeLen }
}

const main = async () => {
  for (const hardfork of [Hardfork.Prague, Hardfork.Amsterdam]) {
    const evm = await createEVM({
      common: new Common({ chain: Mainnet, hardfork }),
    })
    console.log(
      `${hardfork}: maxCodeSize=${evm.common.param('maxCodeSize')} maxInitCodeSize=${evm.common.param('maxInitCodeSize')}`,
    )
  }

  console.log(
    `\nDeploy runtime code of ${OVER_LEGACY_MAX_CODE_SIZE} bytes (legacy limit was 24576):`,
  )

  const prague = await deployRuntimeCode(Hardfork.Prague, OVER_LEGACY_MAX_CODE_SIZE)
  console.log(
    `  Prague:   ${prague.error ?? `created ${prague.deployed} with ${prague.codeLen} bytes`}`,
  )

  const amsterdam = await deployRuntimeCode(Hardfork.Amsterdam, OVER_LEGACY_MAX_CODE_SIZE)
  console.log(
    `  Amsterdam: ${amsterdam.error ?? `created ${amsterdam.deployed} with ${amsterdam.codeLen} bytes`}`,
  )
}

void main()
