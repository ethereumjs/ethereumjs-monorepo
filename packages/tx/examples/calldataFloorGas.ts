import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import {
  countCalldataFloorTokens,
  createLegacyTx,
  getCalldataFloorGas,
  getEip2780FloorBaseGas,
  getEip2780RecipientRegularGas,
} from '@ethereumjs/tx'
import { createAddressFromPrivateKey, createZeroAddress, hexToBytes } from '@ethereumjs/util'

import type { LegacyTxInterface } from '@ethereumjs/tx'

const main = () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
  const senderKey = hexToBytes(`0x${'20'.repeat(32)}`)
  const sender = createAddressFromPrivateKey(senderKey)
  const other = createZeroAddress()

  const report = (label: string, tx: LegacyTxInterface) => {
    console.log(label)
    console.log(`  TX_BASE:      ${tx.common.param('txGas')}`)
    console.log(`  2780 extras:  ${getEip2780RecipientRegularGas(tx)}`)
    console.log(`  floor base:   ${getEip2780FloorBaseGas(tx)}`)
    console.log(`  floor tokens: ${countCalldataFloorTokens(tx)}`)
    console.log(`  intrinsic:    ${tx.getIntrinsicGas()}`)
    console.log(`  floor:        ${getCalldataFloorGas(tx)}`)
    console.log(`  minimum:      ${tx.getMinimumGasLimit()}`)
    console.log(`  gasLimit:     ${tx.gasLimit} valid=${tx.isValid()}`)
  }

  report(
    'Value transfer to another account (still 21_000)',
    createLegacyTx({ to: other, value: 1n, gasLimit: 21_000n, gasPrice: 10n }, { common }).sign(
      senderKey,
    ),
  )

  report(
    'Self-transfer (2780 extras skipped)',
    createLegacyTx({ to: sender, value: 1n, gasLimit: 21_000n, gasPrice: 10n }, { common }).sign(
      senderKey,
    ),
  )

  report(
    '100 calldata bytes (7976 floor exceeds 21_000)',
    createLegacyTx(
      { to: other, data: new Uint8Array(100).fill(1), gasLimit: 21_000n, gasPrice: 10n },
      { common },
    ).sign(senderKey),
  )
}

void main()
