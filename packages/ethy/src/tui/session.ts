import { stdin as input, stdout as output } from 'node:process'
import readline from 'node:readline'

import type { EthyNode } from '../core/createEthyNode.ts'
import { advanceDemo } from '../demo/advanceDemo.ts'
import {
  ALT_SCREEN_OFF,
  ALT_SCREEN_ON,
  CURSOR_HIDE,
  CURSOR_SHOW,
  cursorTo,
  syncOutputBegin,
  syncOutputEnd,
} from './ansi.ts'
import {
  createInitialViewState,
  cycleDomain,
  deepViewCommand,
  ghostForPhase,
  pushKeyChar,
  reducePromptKey,
} from './prompt.ts'
import { promptCaretPosition, renderFrame } from './renderFrame.ts'

export async function runEthySession(node: EthyNode): Promise<void> {
  const demoStart = Date.now()
  let view = createInitialViewState()
  let lastQuerySlot: number | undefined
  let escapeBuf = ''

  if (input.isTTY) {
    readline.emitKeypressEvents(input)
    input.setRawMode(true)
  }
  output.write(ALT_SCREEN_ON)

  const draw = () => {
    if (node.demo) {
      advanceDemo(node.spine, Date.now() - demoStart)
    }
    view.ghostSuggestion = ghostForPhase(node.spine.phase)
    const cols = output.columns ?? 100
    const rows = output.rows ?? 30
    const lines = renderFrame(node.spine, view, cols, rows)
    const caret = promptCaretPosition(cols, rows, view.promptDraft)
    output.write(CURSOR_HIDE)
    output.write(syncOutputBegin())
    output.write('\x1b[H')
    output.write(lines.join('\n'))
    output.write(cursorTo(caret.row, caret.col))
    output.write(syncOutputEnd())
    output.write(CURSOR_SHOW)
  }

  draw()
  const demoTimer = node.demo ? setInterval(draw, 150) : undefined

  const onResize = () => draw()
  output.on('resize', onResize)

  await new Promise<void>((resolve) => {
    const onData = (buf: Buffer) => {
      const chunk = buf.toString('utf8')
      let dirty = false
      for (const ch of chunk) {
        const step = pushKeyChar(escapeBuf, ch)
        escapeBuf = step.buffer
        const action = step.action
        if (action === undefined) {
          continue
        }
        dirty = true
        const ghost = view.ghostSuggestion
        const {
          view: nextView,
          submittedLine,
          domainCycle,
          openDeepView,
        } = reducePromptKey(view, action, ghost)
        view = nextView
        if (domainCycle !== undefined) {
          view = {
            ...view,
            activeDomain: cycleDomain(view.activeDomain, domainCycle),
          }
        }
        if (openDeepView === true) {
          const result = node.intentEngine.handle({
            text: deepViewCommand(view.activeDomain),
            spine: node.spine,
            lastQuerySlot,
          })
          lastQuerySlot = result.querySlot
          view.activeWidget = result.widget
        }
        if (submittedLine !== undefined) {
          const result = node.intentEngine.handle({
            text: submittedLine,
            spine: node.spine,
            lastQuerySlot,
          })
          lastQuerySlot = result.querySlot
          view.activeWidget = result.widget
        }
        if (view.shouldExit) {
          cleanup()
          resolve()
          return
        }
      }
      if (dirty) {
        draw()
      }
    }

    const cleanup = () => {
      if (demoTimer !== undefined) clearInterval(demoTimer)
      output.off('resize', onResize)
      input.off('data', onData)
      if (input.isTTY) input.setRawMode(false)
      output.write(CURSOR_SHOW)
      output.write(ALT_SCREEN_OFF)
    }

    input.on('data', onData)
  })
}
