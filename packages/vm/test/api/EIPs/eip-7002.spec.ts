import { Block } from '@ethereumjs/block'
import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { LegacyTransaction } from '@ethereumjs/tx'
import {
  Account,
  Address,
  bigIntToBytes,
  bytesToHex,
  concatBytes,
  equalsBytes,
  hexToBytes,
  setLengthLeft,
  zeros,
} from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { setupVM } from '../utils.js'

const pkey = hexToBytes(`0x${'20'.repeat(32)}`)
const addr = Address.fromPrivateKey(pkey)

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Cancun, eips: [7685, 7002] })

const deploymentTxData = {
  nonce: BigInt(0),
  gasLimit: BigInt('0x3d090'),
  gasPrice: BigInt('0xe8d4a51000'),
  data: hexToBytes(
    '0x61049d5f5561013280600f5f395ff33373fffffffffffffffffffffffffffffffffffffffe146090573615156028575f545f5260205ff35b366038141561012e5760115f54600182026001905f5b5f82111560595781019083028483029004916001019190603e565b90939004341061012e57600154600101600155600354806003026004013381556001015f3581556001016020359055600101600355005b6003546002548082038060101160a4575060105b5f5b81811460dd5780604c02838201600302600401805490600101805490600101549160601b83528260140152906034015260010160a6565b910180921460ed579060025560f8565b90505f6002555f6003555b5f548061049d141561010757505f5b60015460028282011161011c5750505f610122565b01600290035b5f555f600155604c025ff35b5f5ffd'
  ),
  v: BigInt('0x1b'),
  r: BigInt('0x539'),
  s: BigInt('0xaba653c9d105790c'),
}

const deploymentTx = LegacyTransaction.fromTxData(deploymentTxData)
const sender = deploymentTx.getSenderAddress()
const upfrontCost = deploymentTx.getUpfrontCost()
const acc = new Account()
acc.balance = upfrontCost

const validatorPubkey = hexToBytes(`0x${'20'.repeat(48)}`)
const amount = BigInt(12345678)
const amountBytes = setLengthLeft(bigIntToBytes(amount), 8)

function generateTx(nonce: bigint) {
  const addressBytes = setLengthLeft(
    bigIntToBytes(common.param('vm', 'withdrawalRequestPredeployAddress')),
    20
  )
  const withdrawalsAddress = Address.fromString(bytesToHex(addressBytes))

  return LegacyTransaction.fromTxData({
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
    const block = Block.fromBlockData(
      {
        header: {
          number: 1,
        },
        transactions: [deploymentTx],
      },
      { common }
    )
    await vm.stateManager.putAccount(sender, acc)
    await vm.stateManager.putAccount(addr, acc)

    // Deploy withdrawals contract
    const results = await vm.runBlock({
      block,
      skipHeaderValidation: true,
      skipBlockValidation: true,
      generate: true,
    })

    const root = results.stateRoot

    const tx = generateTx(BigInt(0))

    // Call withdrawals contract with a withdrawals request
    const block2 = Block.fromBlockData(
      {
        header: {
          number: 2,
          parentBeaconBlockRoot: zeros(32),
        },
        transactions: [tx],
      },
      { common }
    )

    let generatedBlock: Block
    vm.events.on('afterBlock', (e) => {
      generatedBlock = e.block
    })

    await vm.runBlock({
      block: block2,
      skipHeaderValidation: true,
      skipBlockValidation: true,
      generate: true,
    })

    assert.ok(generatedBlock!.requests!.length === 1)

    const requestDecoded = RLP.decode(generatedBlock!.requests![0].bytes)

    const sourceAddressRequest = requestDecoded[0] as Uint8Array
    const validatorPubkeyRequest = requestDecoded[1] as Uint8Array
    const amountRequest = requestDecoded[2] as Uint8Array

    assert.ok(equalsBytes(sourceAddressRequest, tx.getSenderAddress().bytes))
    assert.ok(equalsBytes(validatorPubkey, validatorPubkeyRequest))
    assert.ok(equalsBytes(amountBytes, amountRequest))

    await vm.runBlock({ block: generatedBlock!, skipHeaderValidation: true, root })
  })
})
