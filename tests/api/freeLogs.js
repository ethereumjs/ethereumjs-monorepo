const tape = require('tape')
const VM = require('../../lib/index')

/*
contract Contract1 {
    event Event();
    function() external {
        emit Event();
    }
}
*/

const code = Buffer.from('6080604052348015600f57600080fd5b506040517f57050ab73f6b9ebdd9f76b8d4997793f48cf956e965ee070551b9ca0bb71584e90600090a10000a165627a7a72305820f80265dc41ca5376abe548a02070b68b91119b77dc54c76563b9c19a758cf26f0029', 'hex')

tape('VM with free logs', async (t) => {
  t.test('should run code without charging for log opcode', async (st) => {
    const vm = new VM({ emitFreeLogs: true })
    vm.runCode({
      code: code,
      gasLimit: 1000
    }, function (err, val) {
      st.notOk(err)
      st.ok(val.runState.gasLeft >= 0x235, 'should expend less gas')
      st.ok(val.logs.length === 1, 'should emit event')
      st.end()
    })
  })
  t.test('should charge normal gas if flag is not set', async (st) => {
    const vm = new VM()
    vm.runCode({
      code: code,
      gasLimit: 1000
    }, function (err, val) {
      st.notOk(err)
      st.ok(val.runState.gasLeft < 0x235, 'should expend normal gas')
      st.ok(val.logs.length === 1, 'should emit event')
      st.end()
    })
  })
  t.test('should emit event on static context', async (st) => {
    const vm = new VM({ emitFreeLogs: true })
    vm.runCode({
      code: code,
      gasLimit: 24000,
      static: true
    }, function (err, val) {
      st.notOk(err)
      st.ok(val.logs.length === 1, 'should emit event')
      st.end()
    })
  })
  t.test('should not emit event on static context if flag is not set', async (st) => {
    const vm = new VM()
    vm.runCode({
      code: code,
      gasLimit: 24000,
      static: true
    }, function (err, val) {
      st.ok(err)
      st.ok(val.logs.length === 0, 'should emit zero events')
      st.end()
    })
  })
})
