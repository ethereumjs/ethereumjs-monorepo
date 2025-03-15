import { EOFContainer, EOFContainerMode } from './container.ts'

import type { RunState } from '../interpreter.ts'

/**
 * Setup EOF by preparing the `RunState` to run EVM in EOF mode
 * @param runState Current run state
 * @param eofMode EOF mode to run in (only changes in case of EOFCREATE)
 */
export function setupEOF(runState: RunState, eofMode: EOFContainerMode = EOFContainerMode.Default) {
  runState.env.eof = {
    container: new EOFContainer(runState.code, eofMode),
    eofRunState: {
      returnStack: [], // Return stack for RETF/CALLF/JUMPF
    },
  }

  // In case that txCallData is set, set the `callData` of `env` to this calldata
  // This ensures that CALLDATA can be read when deploying EOF contracts using txs
  if (runState.env.eof.container.body.txCallData !== undefined) {
    runState.env.callData = runState.env.eof.container.body.txCallData
  }

  // Set program counter to the first code section
  const pc = runState.env.eof.container.header.getCodePosition(0)
  runState.programCounter = pc
}
