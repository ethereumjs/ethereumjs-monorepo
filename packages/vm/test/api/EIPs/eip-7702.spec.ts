import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { EOACodeEIP7702Transaction } from '@ethereumjs/tx'
import {
  Account,
  Address,
  //BIGINT_1,
  bigIntToBytes,
  concatBytes,
  ecsign,
  hexToBytes,
  privateToAddress,
  unpadBytes,
} from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { equalsBytes } from 'ethereum-cryptography/utils'
import { assert, describe, it } from 'vitest'

import { VM } from '../../../src/vm'

import type { AuthorizationListBytesItem } from '@ethereumjs/common'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Cancun, eips: [7702] })

const defaultAuthPkey = hexToBytes(`0x${'20'.repeat(32)}`)
const defaultAuthAddr = new Address(privateToAddress(defaultAuthPkey))

const defaultSenderPkey = hexToBytes(`0x${'40'.repeat(32)}`)
const defaultSenderAddr = new Address(privateToAddress(defaultSenderPkey))

const codeAddr = Address.fromString(`0x${'aa'.repeat(20)}`)

function getAuthorizationListItem(opts: {
  chainId?: number
  nonce?: number
  address: Address
  pkey?: Uint8Array
}): AuthorizationListBytesItem {
  const actualOpts = {
    ...{ chainId: 0, pkey: defaultAuthPkey },
    ...opts,
  }

  const { chainId, nonce, address, pkey } = actualOpts

  const chainIdBytes = unpadBytes(hexToBytes(`0x${chainId.toString(16)}`))
  const nonceBytes = nonce !== undefined ? [unpadBytes(hexToBytes(`0x${nonce.toString(16)}`))] : []
  const addressBytes = address.toBytes()

  const rlpdMsg = RLP.encode([chainIdBytes, addressBytes, nonceBytes])
  const msgToSign = keccak256(concatBytes(new Uint8Array([5]), rlpdMsg))
  const signed = ecsign(msgToSign, pkey)

  return [chainIdBytes, addressBytes, nonceBytes, bigIntToBytes(signed.v), signed.r, signed.s]
}

describe('EIP 7702: set code to EOA accounts', () => {
  it('should do basic functionality', async () => {
    const vm = await VM.create({ common })
    const authList = [
      getAuthorizationListItem({
        address: codeAddr,
      }),
    ]
    const tx = EOACodeEIP7702Transaction.fromTxData(
      {
        gasLimit: 100000,
        maxFeePerGas: 1000,
        authorizationList: authList,
        to: defaultAuthAddr,
        // value: BIGINT_1 // Note, by enabling this line, the account will not get deleted
        // Therefore, this test will pass
      },
      { common }
    ).sign(defaultSenderPkey)

    // Store value 1 in storage slot 1
    // PUSH1 PUSH1 SSTORE STOP
    const code = hexToBytes('0x600160015500')
    await vm.stateManager.putContractCode(codeAddr, code)

    const acc = (await vm.stateManager.getAccount(defaultSenderAddr)) ?? new Account()
    acc.balance = BigInt(1_000_000_000)
    await vm.stateManager.putAccount(defaultSenderAddr, acc)

    console.log(defaultAuthAddr.toString())

    vm.evm.events?.on('step', (e) => {
      console.log(e.address.toString(), e.opcode.name, e.stack)
    })

    await vm.runTx({ tx })

    // Note: due to EIP-161, defaultAuthAddr is now deleted

    const slot = hexToBytes('0x' + '00'.repeat(31) + '01')
    const value = await vm.stateManager.getContractStorage(defaultAuthAddr, slot)
    assert.ok(equalsBytes(unpadBytes(slot), value))
  })
})
