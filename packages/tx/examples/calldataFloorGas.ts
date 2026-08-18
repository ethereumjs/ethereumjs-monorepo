import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createAccessList2930Tx, createLegacyTx, getCalldataFloorGas } from '@ethereumjs/tx'
import { createZeroAddress } from '@ethereumjs/util'

import type { LegacyTxInterface } from '@ethereumjs/tx'

const main = () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
  const to = createZeroAddress()

  const report = (label: string, tx: LegacyTxInterface) => {
    console.log(label)
    console.log(`  intrinsic: ${tx.getIntrinsicGas()}`)
    console.log(`  floor:     ${getCalldataFloorGas(tx)}`)
    console.log(`  minimum:   ${tx.getMinimumGasLimit()}`)
    console.log(`  gasLimit:  ${tx.gasLimit}`)
    console.log(`  valid:     ${tx.isValid()}`)
  }

  report(
    'Empty value transfer (21_000 still works)',
    createLegacyTx({ to, value: 1n, gasLimit: 21_000n, gasPrice: 10n }, { common }),
  )

  report(
    '100 non-zero calldata bytes (EIP-7976 floor exceeds 21_000)',
    createLegacyTx(
      { to, data: new Uint8Array(100).fill(1), gasLimit: 21_000n, gasPrice: 10n },
      { common },
    ),
  )

  report(
    'Access list: 1 address + 2 slots (EIP-7981)',
    createAccessList2930Tx(
      {
        to,
        gasLimit: 21_000n,
        gasPrice: 10n,
        accessList: [
          {
            address: '0x0000000000000000000000000000000000000101',
            storageKeys: [`0x${'00'.repeat(32)}`, `0x${'11'.repeat(32)}`],
          },
        ],
      },
      { common },
    ),
  )
}

void main()
