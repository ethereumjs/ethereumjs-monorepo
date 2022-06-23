import { Account, Address } from '@ethereumjs/util'
import Blockchain from '@ethereumjs/blockchain'
import { VM } from '../../src/vm'
import { VMOpts } from '../../src/types'
import { Block } from '@ethereumjs/block'
import { TransactionFactory } from '@ethereumjs/tx'
import Common from '@ethereumjs/common'

import { MemoryLevel } from 'memory-level'

export function createAccount(nonce = BigInt(0), balance = BigInt(0xfff384)) {
  return new Account(nonce, balance)
}

export async function setBalance(vm: VM, address: Address, balance = BigInt(100000000)) {
  const account = createAccount(BigInt(0), balance)
  await vm.eei.state.checkpoint()
  await vm.eei.state.putAccount(address, account)
  await vm.eei.state.commit()
}

export async function setupVM(opts: VMOpts & { genesisBlock?: Block } = {}) {
  const db: any = new MemoryLevel()
  const { common, genesisBlock } = opts
  if (!opts.blockchain) {
    opts.blockchain = await Blockchain.create({
      db,
      validateBlocks: false,
      validateConsensus: false,
      common,
      genesisBlock,
    })
  }
  const vm = await VM.create({
    ...opts,
  })
  return vm
}

export async function getEEI() {
  return (await setupVM()).eei
}

export function getTransaction(
  common: Common,
  txType = 0,
  sign = false,
  value = '0x00',
  createContract = false
) {
  let to: string | undefined = '0x0000000000000000000000000000000000000000'
  let data = '0x7f7465737432000000000000000000000000000000000000000000000000000000600057'

  if (createContract) {
    to = undefined
    data =
      '0x6080604052348015600f57600080fd5b50603e80601d6000396000f3fe6080604052600080fdfea265627a7a723158204aed884a44fd1747efccba1447a2aa2d9a4b06dd6021c4a3bbb993021e0a909e64736f6c634300050f0032'
  }

  const txParams: any = {
    nonce: 0,
    gasPrice: 100,
    gasLimit: 90000,
    to,
    value,
    data,
  }

  if (txType > 0) {
    txParams['type'] = txType
  }

  if (txType === 1) {
    txParams['chainId'] = common.chainId()
    txParams['accessList'] = [
      {
        address: '0x0000000000000000000000000000000000000101',
        storageKeys: [
          '0x0000000000000000000000000000000000000000000000000000000000000000',
          '0x00000000000000000000000000000000000000000000000000000000000060a7',
        ],
      },
    ]
  } else if (txType === 2) {
    txParams['gasPrice'] = undefined
    txParams['maxFeePerGas'] = BigInt(100)
    txParams['maxPriorityFeePerGas'] = BigInt(10)
  }

  const tx = TransactionFactory.fromTxData(txParams, { common, freeze: false })

  if (sign) {
    const privateKey = Buffer.from(
      'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109',
      'hex'
    )
    return tx.sign(privateKey)
  }

  return tx
}

/**
 * Checks if in a karma test runner.
 * @returns boolean whether running in karma
 */
export function isRunningInKarma(): Boolean {
  // eslint-disable-next-line no-undef
  return typeof (<any>globalThis).window !== 'undefined' && (<any>globalThis).window.__karma__
}
