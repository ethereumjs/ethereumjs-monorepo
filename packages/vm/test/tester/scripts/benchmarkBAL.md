# Benchmarking `consumeBal()` vs `runBlock()`

## `generateLargeFixture.ts` & `benchmarkBalVsExecution.ts`

----
`generateLargeFixture.ts` is an AI generated script that builds a very large test fixture in the same format as the execution-spec-test fixtures, modeled after the BAL specific test suite.  It accepts the following flags:
```
--blocks: number of blocks
--txs-per-block: mean number of tx per block
--withdrawals-per-block: mean number of withdrawals per block
```
Running:
`npx tsx packages/client/scripts/generateLargeFixture.ts --blocks 150 --txs-per-block 200 --withdrawals-per-block 15 --output /tmp/large-fixture.json`
will generate a test fixture with 150 blocks, each with an average of 200 tx's and 15 withdrawals...quite a large fixture.
**Generating one this large will take a while**

----
`benchmarkBalVsExecution.ts` will run the large fixture through two separate paths, and compare the processing time for each.  The `runBlock` path will execute each block, and validate the post-state.  The `consumeBal` path will consume each BAL instead, and validate the same post-state.  Both approaches lead to the same post-state.  The script will then report the processing time for each method and compare the results.

Running:
`npx tsx ./test/tester/scripts/benchmarkBalVsExecution.ts --path /tmp --file large_fixture.json`
Should produce output like this:
```
Summary
  runBlock   setup=1217.30ms process=471664.39ms validate=634.67ms total=473516.36ms
  consumeBal setup=463.41ms process=28967.96ms validate=439.14ms total=29870.50ms
  total process speedup=16.28x
 ```
