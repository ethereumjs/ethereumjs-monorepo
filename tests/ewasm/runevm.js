const fs = require('fs')
const path = require('path')
const tape = require('tape')
const BN = require('bn.js')
const ethUtil = require('ethereumjs-util')
const { Contract } = require('../../lib/ewasm')

tape('Runevm', (t) => {
  let interpreter

  t.test('should execute deployer', st => {
    const runevmCode = fs.readFileSync(path.join(__dirname, '../../lib/ewasm/system/runevm.wasm'))
    const deployerCode = fs.readFileSync(path.join(__dirname, '../../lib/ewasm/system/deployer.wasm'))

    const deployer = new Contract(deployerCode)
    let opts = {
      code: runevmCode
    }
    let res = deployer.run(opts)

    t.equal(res.exception, 1)
    t.ok(res.return.length > 0)

    const interpreterCode = res.return
    interpreter = new Contract(interpreterCode)

    st.end()
  })

  require('ethereumjs-testing').getTestsFromArgs('VMTests/vmArithmeticTest', (fileName, testName, test) => {
    t.test(`${fileName}/${testName}`, st => {
      const testcase = test
      const state = new Map()
      for (const addr of Object.keys(testcase.pre)) {
        const acc = {
          balance: ethUtil.toBuffer(testcase.pre[addr].balance),
          code: ethUtil.toBuffer(testcase.pre[addr].code),
          nonce: ethUtil.toBuffer(testcase.pre[addr].nonce),
          storage: new Map()
        }
        for (const k of Object.keys(testcase.pre[addr].storage)) {
          acc.storage.set(ethUtil.stripHexPrefix(k), ethUtil.toBuffer(testcase.pre[addr].storage[k]))
        }
        state.set(ethUtil.stripHexPrefix(addr), acc)
      }

      const opts = {
        state: state,
        address: ethUtil.toBuffer(testcase.exec.address),
        caller: ethUtil.toBuffer(testcase.exec.caller),
        code: ethUtil.toBuffer(testcase.exec.code),
        data: ethUtil.toBuffer(testcase.exec.data),
        gasLimit: new BN(ethUtil.stripHexPrefix(testcase.exec.gas), 16),
        gasPrice: new BN(ethUtil.stripHexPrefix(testcase.exec.gasPrice), 16)
      }

      const res = interpreter.run(opts)

      // If exception is expected, testcase doesn't include
      // post state
      if ('post' in testcase) {
        t.equal(res.exception, 1)
        t.deepEqual(res.return, ethUtil.toBuffer(testcase.out), 'return value should match')
        t.ok(opts.gasLimit.sub(res.gasUsed).eq(new BN(ethUtil.stripHexPrefix(testcase.gas), 16)), 'gas usage should match')
        // TODO: check logs
        // TODO: check callcreates
        t.equal(testcase.callcreates.length, 0)

        // Check state
        for (const addr of Object.keys(testcase.post)) {
          const acc = state.get(ethUtil.stripHexPrefix(addr))
          st.ok(typeof acc !== 'undefined')
          for (let k of Object.keys(testcase.post[addr].storage)) {
            k = ethUtil.setLengthLeft(ethUtil.stripHexPrefix(k), 32)
            const v = acc.storage.get(k)
            st.deepEqual(v, testcase.post[addr].storage[k])
          }
        }
      } else {
        st.equal(res.exception, 0)
      }

      st.end()
    })
  }).then(() => t.end())
})
