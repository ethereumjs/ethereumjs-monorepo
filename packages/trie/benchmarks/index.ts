import { createSuite } from './suite'
import { LevelDB } from './engines/level'
import { MapDB } from '../dist'

createSuite(new MapDB())
createSuite(new LevelDB())
