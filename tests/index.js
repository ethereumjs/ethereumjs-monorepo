// Remove this test once first test is established,
// just for test setup, linting test,...
// Replace with references to separate test files
// see other ethereumjs repos for reference
const tape = require('tape')

tape('[CL]: Test --debug command line option', function (t) {
  t.test('should test empty command line option', function (st) {
    st.equal(true, true, 'output should default to INFO log level')
    st.end()
  })
})
