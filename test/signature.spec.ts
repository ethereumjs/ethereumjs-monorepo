import assert from 'assert'
import BN from 'bn.js'
import {
  ecsign,
  ecrecover,
  privateToPublic,
  hashPersonalMessage,
  isValidSignature,
  fromRpcSig,
  toRpcSig
} from '../src'

const echash = Buffer.from(
  '82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28',
  'hex'
)
const ecprivkey = Buffer.from(
  '3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1',
  'hex'
)
const chainId = 3 // ropsten

describe('ecsign', function() {
  it('should produce a signature', function() {
    const sig = ecsign(echash, ecprivkey)
    assert.deepEqual(
      sig.r,
      Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    )
    assert.deepEqual(
      sig.s,
      Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    )
    assert.equal(sig.v, 27)
  })

  it('should produce a signature for Ropsten testnet', function() {
    const sig = ecsign(echash, ecprivkey, chainId)
    assert.deepEqual(
      sig.r,
      Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    )
    assert.deepEqual(
      sig.s,
      Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    )
    assert.equal(sig.v, 41)
  })

  it('should produce a signature for chainId=150', function() {
    const chainId = 150
    const sig = ecsign(echash, ecprivkey, chainId)
    assert.deepEqual(
      sig.r,
      Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    )
    assert.deepEqual(
      sig.s,
      Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    )
    assert.equal(sig.v, chainId * 2 + 35)
  })
})

describe('ecrecover', function() {
  it('should recover a public key', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    const v = 27
    const pubkey = ecrecover(echash, v, r, s)
    assert.deepEqual(pubkey, privateToPublic(ecprivkey))
  })
  it('should recover a public key (chainId = 3)', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    const v = 41
    const pubkey = ecrecover(echash, v, r, s, chainId)
    assert.deepEqual(pubkey, privateToPublic(ecprivkey))
  })
  it('should recover a public key (chainId = 150)', function() {
    const chainId = 150
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    const v = chainId * 2 + 35
    const pubkey = ecrecover(echash, v, r, s, chainId)
    assert.deepEqual(pubkey, privateToPublic(ecprivkey))
  })
  it('should fail on an invalid signature (v = 21)', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    assert.throws(function() {
      ecrecover(echash, 21, r, s)
    })
  })
  it('should fail on an invalid signature (v = 29)', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    assert.throws(function() {
      ecrecover(echash, 29, r, s)
    })
  })
  it('should fail on an invalid signature (swapped points)', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    assert.throws(function() {
      ecrecover(echash, 27, s, r)
    })
  })
  it('should return the right sender when using very high chain id / v values', function() {
    // This data is from a transaction of the YoloV3 network, block 77, txhash c6121a23ca17b8ff70d4706c7d134920c1da43c8329444c96b4c63a55af1c760
    /*
      {
        nonce: '0x8',
        gasPrice: '0x3b9aca00',
        gasLimit: '0x1a965',
        to: undefined,
        value: '0x0',
        data: '0x608060405234801561001057600080fd5b50610101806100206000396000f3fe608060405260043610601f5760003560e01c8063776d1a0114603b576020565b5b6000543660008037600080366000845af43d6000803e3d6000f35b348015604657600080fd5b50608660048036036020811015605b57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506088565b005b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505056fea26469706673582212206d3160e3f009c6ebac579877e529c0a1ca8313678f08fe311659d440067d26ea64736f6c63430007040033',
        v: '0xf2ded8deec6714',
        r: '0xec212841e0b7aaffc3b3e33a08adf32fa07159e856ef23db85175a4f6d71dc0f',
        s: '0x4b8e02b96b94064a5aa2f8d72bd0040616ba8e482a5dd96422e38c9a4611f8d5'
      }
    */
    const senderPubKey = Buffer.from(
      '78988201fbceed086cfca7b64e382d08d0bd776898731443d2907c097745b7324c54f522087f5964412cddba019f192de0fd57a0ffa63f098c2b200e53594b15',
      'hex'
    )
    const msgHash = Buffer.from(
      '8ae8cb685a7a9f29494b07b287c3f6a103b73fa178419d10d1184861a40f6afe',
      'hex'
    )

    const r = Buffer.from('ec212841e0b7aaffc3b3e33a08adf32fa07159e856ef23db85175a4f6d71dc0f', 'hex')
    const s = Buffer.from('4b8e02b96b94064a5aa2f8d72bd0040616ba8e482a5dd96422e38c9a4611f8d5', 'hex')

    const vBuffer = Buffer.from('f2ded8deec6714', 'hex')
    const chainIDBuffer = Buffer.from('796f6c6f763378', 'hex')
    let sender = ecrecover(msgHash, vBuffer, r, s, chainIDBuffer)
    assert.ok(sender.equals(senderPubKey), 'sender pubkey correct (Buffer)')

    const vBN = new BN(vBuffer)
    const chainIDBN = new BN(chainIDBuffer)
    sender = ecrecover(msgHash, vBN, r, s, chainIDBN)
    assert.ok(sender.equals(senderPubKey), 'sender pubkey correct (BN)')

    const vHexString = '0xf2ded8deec6714'
    const chainIDHexString = '0x796f6c6f763378'
    sender = ecrecover(msgHash, vHexString, r, s, chainIDHexString)
    assert.ok(sender.equals(senderPubKey), 'sender pubkey correct (HexString)')

    const chainIDNumber = parseInt(chainIDBuffer.toString('hex'), 16)
    const vNumber = parseInt(vBuffer.toString('hex'), 16)
    assert.throws(() => {
      // If we would use numbers for the `v` and `chainId` parameters, then it should throw.
      // (The numbers are too high to perform arithmetic on)
      ecrecover(msgHash, vNumber, r, s, chainIDNumber)
    })
  })
})

describe('hashPersonalMessage', function() {
  it('should produce a deterministic hash', function() {
    const h = hashPersonalMessage(Buffer.from('Hello world'))
    assert.deepEqual(
      h,
      Buffer.from('8144a6fa26be252b86456491fbcd43c1de7e022241845ffea1c3df066f7cfede', 'hex')
    )
  })
  it('should throw if input is not a buffer', function() {
    try {
      hashPersonalMessage((<unknown>[0, 1, 2, 3, 4]) as Buffer)
    } catch (err) {
      assert(err.message.includes('This method only supports Buffer'))
    }
  })
})

describe('isValidSignature', function() {
  it('should fail on an invalid signature (shorter r))', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1ab', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    assert.equal(isValidSignature(27, r, s), false)
  })
  it('should fail on an invalid signature (shorter s))', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca', 'hex')
    assert.equal(isValidSignature(27, r, s), false)
  })
  it('should fail on an invalid signature (v = 21)', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    assert.equal(isValidSignature(21, r, s), false)
  })
  it('should fail on an invalid signature (v = 29)', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    assert.equal(isValidSignature(29, r, s), false)
  })
  it('should fail when on homestead and s > secp256k1n/2', function() {
    const SECP256K1_N_DIV_2 = new BN(
      '7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0',
      16
    )

    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from(SECP256K1_N_DIV_2.add(new BN('1', 16)).toString(16), 'hex')

    const v = 27
    assert.equal(isValidSignature(v, r, s, true), false)
  })
  it('should not fail when not on homestead but s > secp256k1n/2', function() {
    const SECP256K1_N_DIV_2 = new BN(
      '7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0',
      16
    )

    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from(SECP256K1_N_DIV_2.add(new BN('1', 16)).toString(16), 'hex')

    const v = 27
    assert.equal(isValidSignature(v, r, s, false), true)
  })
  it('should work otherwise', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    const v = 27
    assert.equal(isValidSignature(v, r, s), true)
  })
  it('should work otherwise(chainId=3)', function() {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    const v = 41
    assert.equal(isValidSignature(v, r, s, false, chainId), true)
  })
  it('should work otherwise(chainId=150)', function() {
    const chainId = 150
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    const v = chainId * 2 + 35
    assert.equal(isValidSignature(v, r, s, false, chainId), true)
  })
  // FIXME: add homestead test
})

describe('message sig', function() {
  const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
  const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')

  it('should return hex strings that the RPC can use', function() {
    assert.equal(
      toRpcSig(27, r, s),
      '0x99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca661b'
    )
    assert.deepEqual(
      fromRpcSig(
        '0x99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca661b'
      ),
      {
        v: 27,
        r: r,
        s: s
      }
    )
    assert.deepEqual(
      fromRpcSig(
        '0x99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca6600'
      ),
      {
        v: 27,
        r: r,
        s: s
      }
    )
  })

  it('should return hex strings that the RPC can use (chainId=150)', function() {
    const chainId = 150
    const v = chainId * 2 + 35
    assert.equal(
      toRpcSig(v, r, s, chainId),
      '0x99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66014f'
    )
    assert.deepEqual(
      fromRpcSig(
        '0x99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66014f'
      ),
      {
        v,
        r: r,
        s: s
      }
    )
  })

  it('should throw on shorter length', function() {
    assert.throws(function() {
      fromRpcSig('')
    })
    assert.throws(function() {
      fromRpcSig(
        '0x99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca'
      )
    })
  })

  it('pad short r and s values', function() {
    assert.equal(
      toRpcSig(27, r.slice(20), s.slice(20)),
      '0x00000000000000000000000000000000000000004a1579cf389ef88b20a1abe90000000000000000000000000000000000000000326fa689f228040429e3ca661b'
    )
  })

  it('should throw on invalid v value', function() {
    assert.throws(function() {
      toRpcSig(1, r, s)
    })
  })
})
