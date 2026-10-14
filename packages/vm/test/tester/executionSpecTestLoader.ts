/** @deprecated Import from `test/consensus/` instead. Re-export for analysis scripts. */
export {
  loadEstFixtures as loadExecutionSpecFixtures,
  parseShard,
} from '../consensus/fixtureLoader.ts'
export {
  createCommonForFork,
  parseStateTest,
} from '../consensus/forkCommon.ts'
export { estForkToCommonHardfork as normalizeForkName } from '../consensus/forks.ts'
export type {
  BlockchainTestFixtureData,
  ExecutionSpecFixture,
  ExecutionSpecFixtureType,
  ParsedStateTest,
  StateTestFixtureData,
} from '../consensus/types.ts'
