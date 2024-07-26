import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { RLP } from '@ethereumjs/rlp'
import { create7702EOACodeTx } from '@ethereumjs/tx'
import {
  Account,
  Address,
  BIGINT_1,
  KECCAK256_NULL,
  bigIntToBytes,
  concatBytes,
  createAddressFromString,
  ecsign,
  hexToBytes,
  privateToAddress,
  unpadBytes,
} from '@ethereumjs/util'
import { keccak256 } from 'ethereum-cryptography/keccak'
import { equalsBytes } from 'ethereum-cryptography/utils'
import { assert, describe, it } from 'vitest'

import { VM, runTx } from '../../../src/index.js'

import type { AuthorizationListBytesItem } from '@ethereumjs/common'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Cancun, eips: [7702] })

const defaultAuthPkey = hexToBytes(`0x${'20'.repeat(32)}`)
const defaultAuthAddr = new Address(privateToAddress(defaultAuthPkey))

const defaultSenderPkey = hexToBytes(`0x${'40'.repeat(32)}`)
const defaultSenderAddr = new Address(privateToAddress(defaultSenderPkey))

const code1Addr = createAddressFromString(`0x${'01'.repeat(20)}`)
const code2Addr = createAddressFromString(`0x${'02'.repeat(20)}`)

type GetAuthListOpts = {
  chainId?: number
  nonce?: number
  address: Address
  pkey?: Uint8Array
}

function getAuthorizationListItem(opts: GetAuthListOpts): AuthorizationListBytesItem {
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

async function runTest(
  authorizationListOpts: GetAuthListOpts[],
  expect: Uint8Array,
  vm?: VM,
  skipEmptyCode?: boolean,
) {
  vm = vm ?? (await VM.create({ common }))
  const authList = authorizationListOpts.map((opt) => getAuthorizationListItem(opt))
  const tx = create7702EOACodeTx(
    {
      gasLimit: 100000,
      maxFeePerGas: 1000,
      authorizationList: authList,
      to: defaultAuthAddr,
      value: BIGINT_1,
    },
    { common },
  ).sign(defaultSenderPkey)

  const code1 = hexToBytes('0x600160015500')
  await vm.stateManager.putCode(code1Addr, code1)

  const code2 = hexToBytes('0x600260015500')
  await vm.stateManager.putCode(code2Addr, code2)

  const acc = (await vm.stateManager.getAccount(defaultSenderAddr)) ?? new Account()
  acc.balance = BigInt(1_000_000_000)
  await vm.stateManager.putAccount(defaultSenderAddr, acc)

  await runTx(vm, { tx })

  const slot = hexToBytes(`0x${'00'.repeat(31)}01`)
  const value = await vm.stateManager.getStorage(defaultAuthAddr, slot)
  assert.ok(equalsBytes(unpadBytes(expect), value))

  if (skipEmptyCode === undefined) {
    // Check that the code is cleaned after the `runTx`
    const account = (await vm.stateManager.getAccount(defaultAuthAddr)) ?? new Account()
    assert.ok(equalsBytes(account.codeHash, KECCAK256_NULL))
  }
}

describe('EIP 7702: set code to EOA accounts', () => {
  it('should do basic functionality', async () => {
    // Basic test: store 1 in slot 1
    await runTest(
      [
        {
          address: code1Addr,
        },
      ],
      new Uint8Array([1]),
    )

    // Try to set code to two different addresses
    // Only the first is valid
    await runTest(
      [
        {
          address: code1Addr,
        },
        {
          address: code2Addr,
        },
      ],
      new Uint8Array([1]),
    )

    // Chain id check: is chain id 1 also valid?
    // Also checks that code2Addr has the correct code
    await runTest(
      [
        {
          address: code2Addr,
          chainId: 1,
        },
        {
          address: code2Addr,
        },
      ],
      new Uint8Array([2]),
    )

    // Check if chain id 2 is ignored
    await runTest(
      [
        {
          address: code1Addr,
          chainId: 2,
        },
        {
          address: code2Addr,
        },
      ],
      new Uint8Array([2]),
    )

    // Check if nonce is ignored in case the nonce is incorrect
    await runTest(
      [
        {
          address: code1Addr,
          nonce: 1,
        },
        {
          address: code2Addr,
        },
      ],
      new Uint8Array([2]),
    )
  })

  it('Code is already present in account', async () => {
    const vm = await VM.create({ common })
    await vm.stateManager.putCode(defaultAuthAddr, new Uint8Array([1]))
    await runTest(
      [
        {
          address: code1Addr,
        },
      ],
      new Uint8Array(),
      vm,
      true,
    )
  })

  it('Auth address is added to warm addresses', async () => {
    const vm = await VM.create({ common })
    const authList = [
      getAuthorizationListItem({
        address: code1Addr,
      }),
    ]

    // Call into the defaultAuthAddr
    // Gas cost:
    // 5 * PUSH0: 10
    // 1 * PUSH20: 3
    // 1 * GAS: 2
    // 1x warm call: 100
    // Total: 115
    const checkAddressWarmCode = hexToBytes(
      `0x5F5F5F5F5F73${defaultAuthAddr.toString().slice(2)}5AF1`,
    )
    const checkAddressWarm = createAddressFromString(`0x${'FA'.repeat(20)}`)

    await vm.stateManager.putCode(checkAddressWarm, checkAddressWarmCode)

    const tx = create7702EOACodeTx(
      {
        gasLimit: 100000,
        maxFeePerGas: 1000,
        authorizationList: authList,
        to: checkAddressWarm,
        value: BIGINT_1,
      },
      { common },
    ).sign(defaultSenderPkey)

    const code1 = hexToBytes('0x')
    await vm.stateManager.putCode(code1Addr, code1)

    const acc = (await vm.stateManager.getAccount(defaultSenderAddr)) ?? new Account()
    acc.balance = BigInt(1_000_000_000)
    await vm.stateManager.putAccount(defaultSenderAddr, acc)

    const res = await runTx(vm, { tx })
    assert.ok(res.execResult.executionGasUsed === BigInt(115))
  })

  // This test shows, that due to EIP-161, if an EOA has 0 nonce and 0 balance,
  // if EIP-7702 code is being ran which sets storage on this EOA,
  // the account is still deleted after the tx (and thus also the storage is wiped)
  it('EIP-161 test case', async () => {
    const vm = await VM.create({ common })
    const authList = [
      getAuthorizationListItem({
        address: code1Addr,
      }),
    ]
    const tx = create7702EOACodeTx(
      {
        gasLimit: 100000,
        maxFeePerGas: 1000,
        authorizationList: authList,
        to: defaultAuthAddr,
        // value: BIGINT_1 // Note, by enabling this line, the account will not get deleted
        // Therefore, this test will pass
      },
      { common },
    ).sign(defaultSenderPkey)

    // Store value 1 in storage slot 1
    // PUSH1 PUSH1 SSTORE STOP
    const code = hexToBytes('0x600160015500')
    await vm.stateManager.putCode(code1Addr, code)

    const acc = (await vm.stateManager.getAccount(defaultSenderAddr)) ?? new Account()
    acc.balance = BigInt(1_000_000_000)
    await vm.stateManager.putAccount(defaultSenderAddr, acc)

    await runTx(vm, { tx })

    // Note: due to EIP-161, defaultAuthAddr is now deleted
    const account = await vm.stateManager.getAccount(defaultAuthAddr)
    assert.ok(account === undefined)
  })
})
