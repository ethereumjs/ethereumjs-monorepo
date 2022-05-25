import tape from 'tape'
import {
  BN,
  ecsign,
  ecrecover,
  privateToPublic,
  hashPersonalMessage,
  isValidSignature,
  fromRpcSig,
  toRpcSig,
  toCompactSig,
  intToBuffer,
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

tape('ecsign', function (t) {
  t.test('should produce a signature', function (st) {
    const sig = ecsign(echash, ecprivkey)
    st.ok(
      sig.r.equals(
        Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
      )
    )
    st.ok(
      sig.s.equals(
        Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
      )
    )
    st.equal(sig.v, 27)
    st.end()
  })

  t.test('should produce a signature for Ropsten testnet', function (st) {
    const sig = ecsign(echash, ecprivkey, chainId)
    st.ok(
      sig.r.equals(
        Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
      )
    )
    st.ok(
      sig.s.equals(
        Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
      )
    )
    st.equal(sig.v, 41)
    st.end()
  })

  t.test('should produce a signature for chainId=150', function (st) {
    const expectedSigR = Buffer.from(
      '99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9',
      'hex'
    )
    const expectedSigS = Buffer.from(
      '129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66',
      'hex'
    )
    const expectedSigV = Buffer.from('014f', 'hex')

    const sig = ecsign(echash, ecprivkey, 150)
    st.ok(sig.r.equals(expectedSigR))
    st.ok(sig.s.equals(expectedSigS))
    st.equal(sig.v, 150 * 2 + 35)

    let sigBuffer = ecsign(echash, ecprivkey, new BN(150))
    st.ok(sigBuffer.r.equals(expectedSigR))
    st.ok(sigBuffer.s.equals(expectedSigS))
    st.ok(sigBuffer.v.equals(expectedSigV))

    sigBuffer = ecsign(echash, ecprivkey, Buffer.from([150]))
    st.ok(sigBuffer.v.equals(expectedSigV))

    sigBuffer = ecsign(echash, ecprivkey, '0x96')
    st.ok(sigBuffer.v.equals(expectedSigV))

    st.throws(function () {
      ecsign(echash, ecprivkey, '96')
    })
    st.end()
  })

  t.test(
    'should produce a signature for a high number chainId greater than MAX_SAFE_INTEGER',
    function (st) {
      const chainIDBuffer = Buffer.from('796f6c6f763378', 'hex')
      const expectedSigR = Buffer.from(
        '99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9',
        'hex'
      )
      const expectedSigS = Buffer.from(
        '129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66',
        'hex'
      )
      const expectedSigV = Buffer.from('f2ded8deec6713', 'hex')

      let sigBuffer = ecsign(echash, ecprivkey, new BN(chainIDBuffer))
      st.ok(sigBuffer.r.equals(expectedSigR))
      st.ok(sigBuffer.s.equals(expectedSigS))
      st.ok(sigBuffer.v.equals(expectedSigV))

      sigBuffer = ecsign(echash, ecprivkey, chainIDBuffer)
      st.ok(sigBuffer.v.equals(expectedSigV))

      sigBuffer = ecsign(echash, ecprivkey, '0x' + chainIDBuffer.toString('hex'))
      st.ok(sigBuffer.v.equals(expectedSigV))

      const chainIDNumber = parseInt(chainIDBuffer.toString('hex'), 16)
      st.throws(() => {
        // If we would use a number for the `chainId` parameter then it should throw.
        // (The numbers are too high to perform arithmetic on)
        ecsign(echash, ecprivkey, chainIDNumber)
      })
      st.end()
    }
  )
})

tape('ecrecover', function (t) {
  t.test('should recover a public key', function (st) {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    const v = 27
    const pubkey = ecrecover(echash, v, r, s)
    st.ok(pubkey.equals(privateToPublic(ecprivkey)))
    st.end()
  })
  t.test('should recover a public key (chainId = 3)', function (st) {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    const v = 41
    const pubkey = ecrecover(echash, v, r, s, chainId)
    st.ok(pubkey.equals(privateToPublic(ecprivkey)))
    st.end()
  })
  t.test('should recover a public key (chainId = 150)', function (st) {
    const chainId = 150
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    const v = chainId * 2 + 35
    const pubkey = ecrecover(echash, v, r, s, chainId)
    st.ok(pubkey.equals(privateToPublic(ecprivkey)))
    st.end()
  })
  t.test('should recover a public key (v = 0)', function (st) {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    const v = 0
    const pubkey = ecrecover(echash, v, r, s)
    st.ok(pubkey.equals(privateToPublic(ecprivkey)))
    st.end()
  })
  t.test('should fail on an invalid signature (v = 21)', function (st) {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    st.throws(function () {
      ecrecover(echash, 21, r, s)
    })
    st.end()
  })
  t.test('should fail on an invalid signature (v = 29)', function (st) {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    st.throws(function () {
      ecrecover(echash, 29, r, s)
    })
    st.end()
  })
  t.test('should fail on an invalid signature (swapped points)', function (st) {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    st.throws(function () {
      ecrecover(echash, 27, s, r)
    })
    st.end()
  })
  t.test('should return the right sender when using very high chain id / v values', function (st) {
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
    st.ok(sender.equals(senderPubKey), 'sender pubkey correct (Buffer)')

    const vBN = new BN(vBuffer)
    const chainIDBN = new BN(chainIDBuffer)
    sender = ecrecover(msgHash, vBN, r, s, chainIDBN)
    st.ok(sender.equals(senderPubKey), 'sender pubkey correct (BN)')

    const vHexString = '0xf2ded8deec6714'
    const chainIDHexString = '0x796f6c6f763378'
    sender = ecrecover(msgHash, vHexString, r, s, chainIDHexString)
    st.ok(sender.equals(senderPubKey), 'sender pubkey correct (HexString)')

    st.throws(function () {
      ecrecover(msgHash, 'f2ded8deec6714', r, s, chainIDHexString)
    })
    st.throws(function () {
      ecrecover(msgHash, vHexString, r, s, '796f6c6f763378')
    })

    const chainIDNumber = parseInt(chainIDBuffer.toString('hex'), 16)
    const vNumber = parseInt(vBuffer.toString('hex'), 16)
    st.throws(() => {
      // If we would use numbers for the `v` and `chainId` parameters, then it should throw.
      // (The numbers are too high to perform arithmetic on)
      ecrecover(msgHash, vNumber, r, s, chainIDNumber)
    })
    st.end()
  })
})

tape('hashPersonalMessage', function (t) {
  t.test('should produce a deterministic hash', function (st) {
    const h = hashPersonalMessage(Buffer.from('Hello world'))
    st.ok(
      h.equals(
        Buffer.from('8144a6fa26be252b86456491fbcd43c1de7e022241845ffea1c3df066f7cfede', 'hex')
      )
    )
    st.end()
  })
  t.test('should throw if input is not a buffer', function (st) {
    try {
      hashPersonalMessage((<unknown>[0, 1, 2, 3, 4]) as Buffer)
    } catch (err: any) {
      st.ok(err.message.includes('This method only supports Buffer'))
    }
    st.end()
  })
})

tape('isValidSignature', function (t) {
  t.test('should fail on an invalid signature (shorter r))', function (st) {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1ab', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    st.notOk(isValidSignature(27, r, s))
    st.end()
  })
  t.test('should fail on an invalid signature (shorter s))', function (st) {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca', 'hex')
    st.notOk(isValidSignature(27, r, s))
    st.end()
  })
  t.test('should fail on an invalid signature (v = 21)', function (st) {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    st.notOk(isValidSignature(21, r, s))
    st.end()
  })
  t.test('should fail on an invalid signature (v = 29)', function (st) {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    st.notOk(isValidSignature(29, r, s))
    st.end()
  })
  t.test('should fail when on homestead and s > secp256k1n/2', function (st) {
    const SECP256K1_N_DIV_2 = new BN(
      '7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0',
      16
    )

    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from(SECP256K1_N_DIV_2.add(new BN('1', 16)).toString(16), 'hex')

    const v = 27
    st.notOk(isValidSignature(v, r, s, true))
    st.end()
  })
  t.test('should not fail when not on homestead but s > secp256k1n/2', function (st) {
    const SECP256K1_N_DIV_2 = new BN(
      '7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0',
      16
    )

    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from(SECP256K1_N_DIV_2.add(new BN('1', 16)).toString(16), 'hex')

    const v = 27
    st.ok(isValidSignature(v, r, s, false))
    st.end()
  })
  t.test('should work otherwise', function (st) {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    const v = 27
    st.ok(isValidSignature(v, r, s))
    st.end()
  })
  t.test('should work otherwise (v=0)', function (st) {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    const v = 0
    st.ok(isValidSignature(v, r, s))
    st.end()
  })
  t.test('should work otherwise (v=1)', function (st) {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    const v = 1
    st.ok(isValidSignature(v, r, s))
    st.end()
  })
  t.test('should work otherwise (chainId=3)', function (st) {
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    const v = 41
    st.ok(isValidSignature(v, r, s, false, chainId))
    st.end()
  })
  t.test('should work otherwise (chainId=150)', function (st) {
    const chainId = 150
    const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
    const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')
    const v = chainId * 2 + 35
    st.ok(isValidSignature(v, r, s, false, chainId))
    st.ok(isValidSignature(intToBuffer(v), r, s, false, intToBuffer(chainId)))
    st.ok(isValidSignature(new BN(v), r, s, false, new BN(chainId)))
    st.ok(
      isValidSignature(
        '0x' + intToBuffer(v).toString('hex'),
        r,
        s,
        false,
        '0x' + intToBuffer(chainId).toString('hex')
      )
    )
    st.end()
  })
  t.test('should work otherwise (chainId larger than MAX_INTEGER)', function (st) {
    const r = Buffer.from('ec212841e0b7aaffc3b3e33a08adf32fa07159e856ef23db85175a4f6d71dc0f', 'hex')
    const s = Buffer.from('4b8e02b96b94064a5aa2f8d72bd0040616ba8e482a5dd96422e38c9a4611f8d5', 'hex')

    const vBuffer = Buffer.from('f2ded8deec6714', 'hex')
    const chainIDBuffer = Buffer.from('796f6c6f763378', 'hex')
    st.ok(isValidSignature(vBuffer, r, s, false, chainIDBuffer))
    st.ok(isValidSignature(new BN(vBuffer), r, s, false, new BN(chainIDBuffer)))
    st.ok(
      isValidSignature(
        '0x' + vBuffer.toString('hex'),
        r,
        s,
        false,
        '0x' + chainIDBuffer.toString('hex')
      )
    )

    const chainIDNumber = parseInt(chainIDBuffer.toString('hex'), 16)
    const vNumber = parseInt(vBuffer.toString('hex'), 16)
    st.throws(() => {
      // If we would use numbers for the `v` and `chainId` parameters, then it should throw.
      // (The numbers are too high to perform arithmetic on)
      isValidSignature(vNumber, r, s, false, chainIDNumber)
    })
    st.end()
  })
  // FIXME: add homestead test
})

tape('message sig', function (t) {
  const r = Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex')
  const s = Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex')

  t.test('should return hex strings that the RPC can use', function (st) {
    const sig =
      '0x99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca661b'
    st.equal(toRpcSig(27, r, s), sig)
    st.deepEqual(fromRpcSig(sig), {
      v: 27,
      r,
      s,
    })
    st.end()
  })

  t.test('should support compact signature representation (EIP-2098)', function (st) {
    const sig =
      '0x99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66'
    st.equal(toCompactSig(27, r, s), sig)
    st.deepEqual(fromRpcSig(sig), {
      v: 27,
      r,
      s,
    })
    st.end()
  })

  t.test('should support compact signature representation (EIP-2098) (v=0)', function (st) {
    const sig =
      '0x99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66'
    st.equal(toCompactSig(0, r, s), sig)
    st.deepEqual(fromRpcSig(sig), {
      v: 27,
      r,
      s,
    })
    st.end()
  })

  t.test('should support compact signature representation 2 (EIP-2098)', function (st) {
    const sig =
      '0x99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9929ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66'
    st.equal(toCompactSig(28, r, s), sig)
    st.deepEqual(fromRpcSig(sig), {
      v: 28,
      r,
      s,
    })
    st.end()
  })

  t.test('should support compact signature representation 2 (EIP-2098) (v=1)', function (st) {
    const sig =
      '0x99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9929ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66'
    st.equal(toCompactSig(1, r, s), sig)
    st.deepEqual(fromRpcSig(sig), {
      v: 28,
      r,
      s,
    })
    st.end()
  })

  t.test('should return hex strings that the RPC can use (chainId=150)', function (st) {
    const sig =
      '0x99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66014f'
    const chainId = 150
    const v = chainId * 2 + 35
    st.equal(toRpcSig(v, r, s, chainId), sig)
    st.equal(toRpcSig(intToBuffer(v), r, s, intToBuffer(chainId)), sig)
    st.equal(toRpcSig(new BN(v), r, s, new BN(chainId)), sig)
    st.equal(
      toRpcSig(
        '0x' + intToBuffer(v).toString('hex'),
        r,
        s,
        '0x' + intToBuffer(chainId).toString('hex')
      ),
      sig
    )
    st.deepEqual(fromRpcSig(sig), {
      v,
      r,
      s,
    })
    st.end()
  })

  t.test(
    'should return hex strings that the RPC can use (chainId larger than MAX_SAFE_INTEGER)',
    function (st) {
      const sig =
        '0x99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66f2ded8deec6714'
      const chainIDBuffer = Buffer.from('796f6c6f763378', 'hex')
      const vBuffer = Buffer.from('f2ded8deec6714', 'hex')
      st.equal(toRpcSig(vBuffer, r, s, chainIDBuffer), sig)
      st.equal(toRpcSig(new BN(vBuffer), r, s, new BN(chainIDBuffer)), sig)
      st.equal(
        toRpcSig('0x' + vBuffer.toString('hex'), r, s, '0x' + chainIDBuffer.toString('hex')),
        sig
      )

      const chainIDNumber = parseInt(chainIDBuffer.toString('hex'), 16)
      const vNumber = parseInt(vBuffer.toString('hex'), 16)
      st.throws(function () {
        toRpcSig(vNumber, r, s, chainIDNumber)
      })
      st.end()
    }
  )

  t.test('should throw on shorter length', function (st) {
    st.throws(function () {
      fromRpcSig('')
    })
    st.throws(function () {
      fromRpcSig(
        '0x99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca'
      )
    })
    st.end()
  })

  t.test('pad short r and s values', function (st) {
    st.equal(
      toRpcSig(27, r.slice(20), s.slice(20)),
      '0x00000000000000000000000000000000000000004a1579cf389ef88b20a1abe90000000000000000000000000000000000000000326fa689f228040429e3ca661b'
    )
    st.end()
  })

  t.test('should throw on invalid v value', function (st) {
    st.throws(function () {
      toRpcSig(2, r, s)
    })
    st.end()
  })
})
