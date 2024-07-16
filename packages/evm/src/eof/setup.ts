import { EOFContainer, EOFContainerMode } from './container.js'

import type { RunState } from '../interpreter.js'

/**
 * This method setups the EOF inside the EVM. It prepares the `RunState` to start running EVM in EOF mode
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

  // In case that txCallData is set, then set the `callData` of the `env` to this calldata
  // This ensures that CALLDATA can be read when deploying EOF contracts using transactions
  if (runState.env.eof.container.body.txCallData !== undefined) {
    runState.env.callData = runState.env.eof.container.body.txCallData
  }

  // Set the program counter to the first code section
  const pc = runState.env.eof.container.header.getCodePosition(0)
  runState.programCounter = pc
}
