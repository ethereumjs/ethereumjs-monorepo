import { createBlockchain } from '@ethereumjs/blockchain'
import { TransactionType, createTx } from '@ethereumjs/tx'
import { Account, blobsToCommitments, computeVersionedHash, getBlobs } from '@ethereumjs/util'
import { MemoryLevel } from 'memory-level'

import { createVM } from '../../src/index.ts'

import { LevelDB } from './level.ts'

import type { Block } from '@ethereumjs/block'
import type { Common } from '@ethereumjs/common'
import { SIGNER_G } from '@ethereumjs/testdata'
import type { Address, PrefixedHexString } from '@ethereumjs/util'
import type { VMOpts } from '../../src/types.ts'
import type { VM } from '../../src/vm.ts'

export function createAccountWithDefaults(nonce = BigInt(0), balance = BigInt(0xfff384)) {
  return new Account(nonce, balance)
}

export async function setBalance(vm: VM, address: Address, balance = BigInt(100000000)) {
  const account = createAccountWithDefaults(BigInt(0), balance)
  await vm.stateManager.checkpoint()
  await vm.stateManager.putAccount(address, account)
  await vm.stateManager.commit()
}

export async function setupVM(opts: VMOpts & { genesisBlock?: Block } = {}) {
  const db: any = new LevelDB(new MemoryLevel())
  const { common, genesisBlock } = opts
  if (opts.blockchain === undefined) {
    opts.blockchain = await createBlockchain({
      db,
      validateBlocks: false,
      validateConsensus: false,
      common,
      genesisBlock,
    })
  }
  const vm = await createVM({
    ...opts,
  })
  return vm
}

export function getTransaction(
  common: Common,
  txType: TransactionType = TransactionType.Legacy,
  sign = false,
  value = '0x00',
  createContract = false,
  nonce = 0,
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
    if (common.customCrypto?.kzg === undefined) {
      throw new Error('kzg instance required to instantiate blob txs')
    }
    txParams['gasPrice'] = undefined
    txParams['maxFeePerGas'] = BigInt(1000000000)
    txParams['maxPriorityFeePerGas'] = BigInt(10)
    txParams['maxFeePerBlobGas'] = BigInt(100)
    txParams['blobs'] = getBlobs('hello world')
    txParams['kzgCommitments'] = blobsToCommitments(common.customCrypto!.kzg!, txParams['blobs'])
    txParams['kzgProofs'] = txParams['blobs'].map((blob: PrefixedHexString, ctx: number) =>
      common.customCrypto!.kzg!.computeBlobProof(blob, txParams['kzgCommitments'][ctx]),
    )
    txParams['blobVersionedHashes'] = txParams['kzgCommitments'].map(
      (commitment: PrefixedHexString) => computeVersionedHash(commitment, 0x1),
    )
  }

  const tx = createTx(txParams, { common, freeze: false })

  if (sign) {
    return tx.sign(SIGNER_G.privateKey)
  }

  return tx
}
