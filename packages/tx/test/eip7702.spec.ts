import { Chain, Common, Hardfork } from '@ethereumjs/common'
import { Address, hexToBytes, privateToAddress } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { EOACodeEIP7702Transaction } from '../src/index.js'

import type { PrefixedHexString } from '@ethereumjs/util'

const common = new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Cancun, eips: [7702] })

const pkey = hexToBytes('0x' + '20'.repeat(32))
const addr = new Address(privateToAddress(pkey))

const ones32 = `0x${'01'.repeat(32)}` as PrefixedHexString

describe('[EOACodeEIP7702Transaction]', () => {
  it('sign()', () => {
    const txn = EOACodeEIP7702Transaction.fromTxData(
      {
        value: 1,
        maxFeePerGas: 1,
        maxPriorityFeePerGas: 1,
        accessList: [],
        authorizationList: [],
        chainId: 1,
        gasLimit: 100000,
        to: Address.zero(),
        data: new Uint8Array(1),
      },
      { common }
    )
    const signed = txn.sign(pkey)
    assert.ok(signed.getSenderAddress().equals(addr))
    const txnSigned = txn.addSignature(signed.v!, signed.r!, signed.s!)
    assert.deepEqual(signed.toJSON(), txnSigned.toJSON())
  })

  it('valid and invalid authorizationList values', () => {
    assert.throws(() => {
      EOACodeEIP7702Transaction.fromTxData(
        {
          authorizationList: [
            {
              chainId: '0x',
              address: `0x${'20'.repeat(21)}`,
              nonce: [],
              yParity: '0x1',
              r: ones32,
              s: ones32,
            },
          ],
        },
        { common }
      )
    }, 'address length should be 20 bytes')

    assert.throws(() => {
      EOACodeEIP7702Transaction.fromTxData(
        {
          authorizationList: [
            {
              chainId: '0x',
              address: `0x${'20'.repeat(20)}`,
              nonce: ['0x1', '0x2'],
              yParity: '0x1',
              r: ones32,
              s: ones32,
            },
          ],
        },
        { common }
      )
    }, 'nonce list should consist of at most 1 item')

    assert.throws(() => {
      EOACodeEIP7702Transaction.fromTxData(
        {
          authorizationList: [
            {
              chainId: '0x',
              address: `0x${'20'.repeat(20)}`,
              nonce: ['0x1'],
              yParity: '0x1',
              r: ones32,
              //@ts-ignore
              s: undefined,
            },
          ],
        },
        { common }
      )
    }, 's is not defined')

    assert.throws(() => {
      EOACodeEIP7702Transaction.fromTxData(
        {
          authorizationList: [
            {
              chainId: '0x',
              address: `0x${'20'.repeat(20)}`,
              nonce: ['0x1'],
              yParity: '0x1',
              // @ts-ignore
              r: undefined,
              s: ones32,
            },
          ],
        },
        { common }
      )
    }, 'r is not defined')

    assert.throws(() => {
      EOACodeEIP7702Transaction.fromTxData(
        {
          authorizationList: [
            {
              chainId: '0x',
              address: `0x${'20'.repeat(20)}`,
              nonce: ['0x1'],
              // @ts-ignore
              yParity: undefined,
              r: ones32,
              s: ones32,
            },
          ],
        },
        { common }
      )
    }, 'yParity is not defined')

    assert.throws(() => {
      EOACodeEIP7702Transaction.fromTxData(
        {
          authorizationList: [
            {
              chainId: '0x',
              address: `0x${'20'.repeat(20)}`,
              // @ts-ignore
              nonce: undefined,
              yParity: '0x1',
              r: ones32,
              s: ones32,
            },
          ],
        },
        { common }
      )
    }, 'nonce is not defined')

    assert.throws(() => {
      EOACodeEIP7702Transaction.fromTxData(
        {
          authorizationList: [
            {
              chainId: '0x',
              // @ts-ignore
              address: undefined,
              nonce: ['0x1'],
              yParity: '0x1',
              r: ones32,
              s: ones32,
            },
          ],
        },
        { common }
      )
    }, 'address is not defined')

    assert.throws(() => {
      EOACodeEIP7702Transaction.fromTxData(
        {
          authorizationList: [
            {
              // @ts-ignore
              chainId: undefined,
              address: `0x${'20'.repeat(20)}`,
              nonce: ['0x1'],
              yParity: '0x1',
              r: ones32,
              s: ones32,
            },
          ],
        },
        { common }
      )
    }, 'chainId is not defined')

    assert.doesNotThrow(() => {
      EOACodeEIP7702Transaction.fromTxData(
        {
          authorizationList: [
            {
              chainId: '0x',
              address: `0x${'20'.repeat(20)}`,
              nonce: ['0x1'],
              yParity: '0x1',
              r: ones32,
              s: ones32,
            },
          ],
        },
        { common }
      )
    })
  })
})
