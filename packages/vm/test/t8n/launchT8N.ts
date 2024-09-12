import { getArguments } from './helpers.js'
import { TransitionTool } from './t8ntool.js'

const args = getArguments()

await TransitionTool.run(args)
