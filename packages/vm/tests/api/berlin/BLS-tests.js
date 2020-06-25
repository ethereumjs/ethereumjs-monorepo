const BN = require('bn.js')
const tape = require('tape')
const Common = require('@ethereumjs/common').default
const util = require('ethereumjs-util')
const VM = require('../../../dist/index').default
const { getPrecompile } = require('../../../dist/evm/precompiles')
const fs = require('fs')

tape('Berlin BLS tests', (t) => {
    t.test('G1ADD precompile', async (st) => {
        const fileStr = fs.readFileSync("g1_add.csv", 'utf8')   // read test file csv (https://raw.githubusercontent.com/matter-labs/eip1962/master/src/test/test_vectors/eip2537/g1_add.csv)
        const remFirstLine = fileStr.slice(13)                  // remove the first line 
        const results = remFirstLine.match(/[0-9A-Fa-f]+/g)     // very simple splitter

        const BLS_G1ADD_Address = "000000000000000000000000000000000000000a"
        const common = new Common('mainnet', 'berlin')

        const vm = new VM({ common: common })

        if (results.length != 200) {
            st.fail('amount of tests not the expected test amount')
        }

        for (let i = 0; i < results.length; i+=2) {
            const input = results[i]
            const output = results[i + 1]
            const result = await vm.runCall({
                caller: Buffer.from('0000000000000000000000000000000000000000', 'hex'),
                gasLimit: new BN(0xffffffffff),
                to: Buffer.from(BLS_G1ADD_Address, 'hex'),
                value: new BN(0),
                data: Buffer.from(input, 'hex')
            })
          
            if (result.execResult.returnValue.toString('hex') != output) {
                st.fail("BLS G1ADD return value is not the expected value")
            }

            if (!result.execResult.gasUsed.eq(new BN(600))) {
                st.fail("BLS G1ADD gas used is incorrect")
            }
        }

        st.pass("BLS G1ADD output is correct")

        st.end()
    })

    // TODO: add G1/G2 tests checking for failures (i.e. input length incorrect; input values not on curve)

    t.test('G1MUL precompile', async (st) => {
        const fileStr = fs.readFileSync("g1_mul.csv", 'utf8')   // read test file csv (https://raw.githubusercontent.com/matter-labs/eip1962/master/src/test/test_vectors/eip2537/g1_mul.csv)
        const remFirstLine = fileStr.slice(13)                  // remove the first line 
        const results = remFirstLine.match(/[0-9A-Fa-f]+/g)     // very simple splitter

        const BLS_G1MUL_ADDRESS = "000000000000000000000000000000000000000b"
        const common = new Common('mainnet', 'berlin')

        const vm = new VM({ common: common })

        if (results.length != 200) {
            st.fail('amount of tests not the expected test amount')
        }

        for (let i = 0; i < results.length; i+=2) {
            const input = results[i]
            const output = results[i + 1]
            const result = await vm.runCall({
                caller: Buffer.from('0000000000000000000000000000000000000000', 'hex'),
                gasLimit: new BN(0xffffffffff),
                to: Buffer.from(BLS_G1MUL_ADDRESS, 'hex'),
                value: new BN(0),
                data: Buffer.from(input, 'hex')
            })

            if (result.execResult.returnValue.toString('hex') != output) {
                st.fail("BLS G1MUL return value is not the expected value")
            }

            if (!result.execResult.gasUsed.eq(new BN(12000))) {
                st.fail("BLS G1MUL gas used is incorrect")
            }
        }

        st.pass("BLS G1MUL output is correct")

        st.end()
    })

    t.test('G2ADD precompile', async (st) => {
        const fileStr = fs.readFileSync("g2_add.csv", 'utf8')   // read test file csv (https://raw.githubusercontent.com/matter-labs/eip1962/master/src/test/test_vectors/eip2537/g2_add.csv)
        const remFirstLine = fileStr.slice(13)                  // remove the first line 
        const results = remFirstLine.match(/[0-9A-Fa-f]+/g)     // very simple splitter

        const BLS_G2ADD_Address = "000000000000000000000000000000000000000d"
        const common = new Common('mainnet', 'berlin')

        const vm = new VM({ common: common })

        if (results.length != 200) {
            st.fail('amount of tests not the expected test amount')
        }

        for (let i = 0; i < results.length; i+=2) {
            const input = results[i]
            const output = results[i + 1]
            const result = await vm.runCall({
                caller: Buffer.from('0000000000000000000000000000000000000000', 'hex'),
                gasLimit: new BN(0xffffffffff),
                to: Buffer.from(BLS_G2ADD_Address, 'hex'),
                value: new BN(0),
                data: Buffer.from(input, 'hex')
            })
          
            if (result.execResult.returnValue.toString('hex') != output) {
                st.fail("BLS G2ADD return value is not the expected value")
            }

            if (!result.execResult.gasUsed.eq(new BN(4500))) {
                st.fail("BLS G2ADD gas used is incorrect")
            }
        }

        st.pass("BLS G2ADD output is correct")

        st.end()
    })

    t.test('G2MUL precompile', async (st) => {
        const fileStr = fs.readFileSync("g2_mul.csv", 'utf8')   // read test file csv (https://raw.githubusercontent.com/matter-labs/eip1962/master/src/test/test_vectors/eip2537/g2_mul.csv)
        const remFirstLine = fileStr.slice(13)                  // remove the first line 
        const results = remFirstLine.match(/[0-9A-Fa-f]+/g)     // very simple splitter

        const BLS_G2MUL_Address = "000000000000000000000000000000000000000e"
        const common = new Common('mainnet', 'berlin')

        const vm = new VM({ common: common })

        if (results.length != 200) {
            st.fail('amount of tests not the expected test amount')
        }

        for (let i = 0; i < results.length; i+=2) {
            const input = results[i]
            const output = results[i + 1]
            const result = await vm.runCall({
                caller: Buffer.from('0000000000000000000000000000000000000000', 'hex'),
                gasLimit: new BN(0xffffffffff),
                to: Buffer.from(BLS_G2MUL_Address, 'hex'),
                value: new BN(0),
                data: Buffer.from(input, 'hex')
            })
          
            if (result.execResult.returnValue.toString('hex') != output) {
                st.fail("BLS G2MUL return value is not the expected value")
            }

            if (!result.execResult.gasUsed.eq(new BN(55000))) {
                st.fail("BLS G2MUL gas used is incorrect")
            }
        }

        st.pass("BLS G2MUL output is correct")

        st.end()
    })

  })

