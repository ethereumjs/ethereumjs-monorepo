var ethTests = require('ethereumjs-testing').tests
var test = require('tape')
var cp = require('child_process')

test('executable test', function (t) {
  var stateTest = {
    'randomTest': ethTests.stateTests.stRefundTest.refund50_1
  }
  var ejt = cp.spawn(__dirname + '/tester', ['-r', JSON.stringify(stateTest)])
  ejt.stderr.on('data', function (d) {
    t.fail(d.toString())
  })

  ejt.stdout.on('data', function (data) {
    t.equal(data.toString(), '0', 'should not error')
  })

  ejt.on('close', function () {
    t.end()
  })
})
