import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import {
  Account,
  bigIntToBytes,
  bytesToHex,
  concatBytes,
  createAddressFromPrivateKey,
  createAddressFromString,
  equalsBytes,
  hexToBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { CLRequestType } from '../../../../util/src/request.js'
import { runBlock } from '../../../src/index.js'
import { setupVM } from '../utils.js'

import type { Block } from '@ethereumjs/block'

const pkey = hexToBytes(`0x${'20'.repeat(32)}`)
const addr = createAddressFromPrivateKey(pkey)

const common = new Common({ chain: Mainnet, hardfork: Hardfork.Cancun, eips: [7685, 7002] })

// Note: this deployment tx data is the deployment tx in order to setup the EIP-7002 contract
// It is taken from the EIP
const deploymentTxData = {
  nonce: BigInt(0),
  gasLimit: BigInt('0x3d090'),
  gasPrice: BigInt('0xe8d4a51000'),
  data: hexToBytes(
    '0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff5f556101f480602d5f395ff33373fffffffffffffffffffffffffffffffffffffffe1460c7573615156028575f545f5260205ff35b36603814156101f05760115f54807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff146101f057600182026001905f5b5f821115608057810190830284830290049160010191906065565b9093900434106101f057600154600101600155600354806003026004013381556001015f35815560010160203590553360601b5f5260385f601437604c5fa0600101600355005b6003546002548082038060101160db575060105b5f5b81811461017f5780604c02838201600302600401805490600101805490600101549160601b83528260140152807fffffffffffffffffffffffffffffffff0000000000000000000000000000000016826034015260401c906044018160381c81600701538160301c81600601538160281c81600501538160201c81600401538160181c81600301538160101c81600201538160081c81600101535360010160dd565b9101809214610191579060025561019c565b90505f6002555f6003555b5f54807fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff14156101c957505f5b6001546002828201116101de5750505f6101e4565b01600290035b5f555f600155604c025ff35b5f5ffd',
  ),
  v: BigInt('0x1b'),
  r: BigInt('0x539'),
  s: BigInt('0x10e740537d4d36b9'),
}

const deploymentTx = createLegacyTx(deploymentTxData)
const sender = deploymentTx.getSenderAddress()
const upfrontCost = deploymentTx.getUpfrontCost()
const acc = new Account()
acc.balance = upfrontCost

const validatorPubkey = hexToBytes(`0x${'20'.repeat(48)}`)
const amount = BigInt(12345678)
const amountBytes = setLengthLeft(bigIntToBytes(amount), 8)

function generateTx(nonce: bigint) {
  const addressBytes = setLengthLeft(
    bigIntToBytes(common.param('withdrawalRequestPredeployAddress')),
    20,
  )
  const withdrawalsAddress = createAddressFromString(bytesToHex(addressBytes))

  return createLegacyTx({
    nonce,
    gasPrice: BigInt(100),
    data: concatBytes(validatorPubkey, amountBytes),
    value: BigInt(1),
    to: withdrawalsAddress,
    gasLimit: 200_000,
  }).sign(pkey)
}

describe('EIP-7002 tests', () => {
  it('should correctly create requests', async () => {
    const vm = await setupVM({ common })
    const block = createBlock(
      {
        header: {
          number: 1,
        },
        transactions: [deploymentTx],
      },
      { common },
    )
    await vm.stateManager.putAccount(sender, acc)
    await vm.stateManager.putAccount(addr, acc)

    // Deploy withdrawals contract
    const results = await runBlock(vm, {
      block,
      skipHeaderValidation: true,
      skipBlockValidation: true,
      generate: true,
    })

    const root = results.stateRoot

    const tx = generateTx(BigInt(0))

    // Call withdrawals contract with a withdrawals request
    const block2 = createBlock(
      {
        header: {
          number: 2,
          parentBeaconBlockRoot: new Uint8Array(32),
        },
        transactions: [tx],
      },
      { common },
    )

    let generatedBlock: Block
    vm.events.on('afterBlock', (e) => {
      generatedBlock = e.block
    })

    let runBlockResults = await runBlock(vm, {
      block: block2,
      skipHeaderValidation: true,
      skipBlockValidation: true,
      generate: true,
    })

    // Ensure the request is generated
    assert.ok(runBlockResults.requests!.length === 1)
    assert.equal(
      generatedBlock!.transactions.length,
      1,
      'withdrawal transaction should be included',
    )

    const withdrawalRequest = runBlockResults.requests![0]
    assert.equal(
      withdrawalRequest.type,
      CLRequestType.Withdrawal,
      'make sure its withdrawal request',
    )

    // amount is in le when contract pack it in requests
    const expectedRequestData = concatBytes(
      tx.getSenderAddress().bytes,
      validatorPubkey,
      amountBytes.reverse(),
    )
    // Ensure the requests are correct
    assert.ok(equalsBytes(expectedRequestData, withdrawalRequest.data))

    // generated block should be valid
    await runBlock(vm, { block: generatedBlock!, skipHeaderValidation: true, root })

    // Run block with 2 requests

    const tx2 = generateTx(BigInt(1))
    const tx3 = generateTx(BigInt(2))

    const block3 = createBlock(
      {
        header: {
          number: 3,
          parentBeaconBlockRoot: new Uint8Array(32),
        },
        transactions: [tx2, tx3],
      },
      { common },
    )

    runBlockResults = await runBlock(vm, {
      block: block3,
      skipHeaderValidation: true,
      skipBlockValidation: true,
      generate: true,
    })

    // Note: generatedBlock is now overridden with the new generated block (this is thus block number 3)
    // Ensure there are 2 requests
    assert.ok(runBlockResults.requests!.length === 1)
    assert.equal(
      generatedBlock!.transactions.length,
      2,
      'withdrawal transactions should be included',
    )
  })

  it('should throw when contract is not deployed', async () => {
    const vm = await setupVM({ common })
    const block = createBlock(
      {
        header: {
          number: 1,
        },
      },
      { common },
    )
    try {
      await runBlock(vm, {
        block,
        skipHeaderValidation: true,
        skipBlockValidation: true,
        generate: true,
      })
    } catch (e: any) {
      assert.ok(e.message.includes('Attempt to accumulate EIP-7002 requests failed'))
    }
  })
})
