import { Blockchain } from '@ethereumjs/blockchain'
import { TransactionFactory, TransactionType } from '@ethereumjs/tx'
import { Account, blobsToCommitments, computeVersionedHash, getBlobs } from '@ethereumjs/util'
import * as kzg from 'c-kzg'
import { hexToBytes } from 'ethereum-cryptography/utils'
import { MemoryLevel } from 'memory-level'

import { VM } from '../../src/vm'

import { LevelDB } from './level'

import type { VMOpts } from '../../src/types'
import type { Block } from '@ethereumjs/block'
import type { Common } from '@ethereumjs/common'
import type { Address } from '@ethereumjs/util'

export function createAccount(nonce = BigInt(0), balance = BigInt(0xfff384)) {
  return new Account(nonce, balance)
}

export async function setBalance(vm: VM, address: Address, balance = BigInt(100000000)) {
  const account = createAccount(BigInt(0), balance)
  await vm.stateManager.checkpoint()
  await vm.stateManager.putAccount(address, account)
  await vm.stateManager.commit()
}

export async function setupVM(opts: VMOpts & { genesisBlock?: Block } = {}) {
  const db: any = new LevelDB(new MemoryLevel())
  const { common, genesisBlock } = opts
  if (opts.blockchain === undefined) {
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

export function getTransaction(
  common: Common,
  txType = TransactionType.Legacy,
  sign = false,
  value = '0x00',
  createContract = false,
  nonce = 0
) {
  let to: string | undefined = '0x0000000000000000000000000000000000000000'
  let data = '0x7f7465737432000000000000000000000000000000000000000000000000000000600057'

  if (createContract) {
    to = undefined
    data =
      '0x6080604052348015600f57600080fd5b50603e80601d6000396000f3fe6080604052600080fdfea265627a7a723158204aed884a44fd1747efccba1447a2aa2d9a4b06dd6021c4a3bbb993021e0a909e64736f6c634300050f0032'
  }

  const txParams: any = {
    nonce,
    gasPrice: 100,
    gasLimit: 90000,
    to,
    value,
    data,
  }

  if (txType > TransactionType.Legacy) {
    txParams['type'] = txType
  }

  if (txType === TransactionType.AccessListEIP2930) {
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
  } else if (txType === TransactionType.FeeMarketEIP1559) {
    txParams['gasPrice'] = undefined
    txParams['maxFeePerGas'] = BigInt(100)
    txParams['maxPriorityFeePerGas'] = BigInt(10)
  } else if (txType === TransactionType.BlobEIP4844) {
    txParams['gasPrice'] = undefined
    txParams['maxFeePerGas'] = BigInt(1000000000)
    txParams['maxPriorityFeePerGas'] = BigInt(10)
    txParams['maxFeePerDataGas'] = BigInt(100)
    txParams['blobs'] = getBlobs('hello world')
    txParams['kzgCommitments'] = blobsToCommitments(txParams['blobs'])
    txParams['kzgProofs'] = txParams['blobs'].map((blob: Uint8Array, ctx: number) =>
      kzg.computeBlobKzgProof(blob, txParams['kzgCommitments'][ctx] as Uint8Array)
    )
    txParams['versionedHashes'] = txParams['kzgCommitments'].map((commitment: Uint8Array) =>
      computeVersionedHash(commitment, 0x1)
    )
  }

  const tx = TransactionFactory.fromTxData(txParams, { common, freeze: false })

  if (sign) {
    const privateKey = hexToBytes(
      'e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109'
    )
    return tx.sign(privateKey)
  }

  return tx
}
