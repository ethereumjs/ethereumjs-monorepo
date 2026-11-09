import { stdin as input, stdout as output } from 'node:process'
import readline from 'node:readline'

import { buildDeterministicOverview } from '../ai/overviewNarrator.ts'
import type { EthyNode } from '../core/createEthyNode.ts'
import { advanceDemo } from '../demo/advanceDemo.ts'
import { readDomainSnapshots } from '../domains/domainManagers.ts'
import { describeNotice } from '../notify/board.ts'
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
  pushKeyChar,
  reducePromptKey,
} from './prompt.ts'
import { promptCaretPosition, renderFrame } from './renderFrame.ts'

/**
 * Presentation clock. This function only reads spine state, paints, and
 * handles keys. Sync and discovery must not run synchronous disk or ingest
 * work on this turn — see `runtime/lanes.ts`.
 */
export async function runEthySession(node: EthyNode): Promise<void> {
  const demoStart = Date.now()
  let view = createInitialViewState()
  let lastQuerySlot: number | undefined
  let escapeBuf = ''
  let lastPhase = node.spine.phase
  let lastOverviewMs = 0
  const OVERVIEW_INTERVAL_MS = 30_000

  const refreshOverview = (trigger: 'welcome' | 'pulse') => {
    const snapshots = readDomainSnapshots(node.spine)
    view = {
      ...view,
      aiOverview: buildDeterministicOverview(snapshots, trigger),
    }
  }
  refreshOverview('welcome')

  if (input.isTTY) {
    readline.emitKeypressEvents(input)
    input.setRawMode(true)
  }
  output.write(ALT_SCREEN_ON)

  const draw = () => {
    if (node.demo) {
      advanceDemo(node.spine, Date.now() - demoStart)
    }
    const now = Date.now()
    if (node.spine.phase !== lastPhase) {
      lastPhase = node.spine.phase
      refreshOverview('pulse')
      lastOverviewMs = now
    } else if (now - lastOverviewMs >= OVERVIEW_INTERVAL_MS) {
      refreshOverview('pulse')
      lastOverviewMs = now
    }
    const flip = node.spine.headFlipSummary
    if (view.activeWidget === null && flip !== undefined) {
      view = { ...view, activeWidget: flip }
      node.spine.headFlipSummary = undefined
    }
    const cols = output.columns ?? 100
    const rows = output.rows ?? 30
    const lines = renderFrame(node.spine, view, cols, rows, describeNotice(node.notices, now))
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
  const refreshTimer = setInterval(draw, node.demo ? 150 : 400)

  const onResize = () => draw()
  output.on('resize', onResize)

  await new Promise<void>((resolve) => {
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      cleanup()
      resolve()
    }

    const onSignal = () => finish()
    process.once('SIGINT', onSignal)
    process.once('SIGTERM', onSignal)

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
        const {
          view: nextView,
          submittedLine,
          domainCycle,
          openDeepView,
          toggleDebug,
        } = reducePromptKey(view, action)
        view = nextView
        if (toggleDebug === true) {
          const w = view.activeWidget
          if (w?.debugPage !== undefined && w.debugPage.length > 0) {
            view = {
              ...view,
              interactionPage: view.interactionPage === 'debug' ? 'main' : 'debug',
            }
          }
        }
        if (domainCycle !== undefined) {
          view = {
            ...view,
            activeDomain: cycleDomain(view.activeDomain, domainCycle),
          }
        }
        if (openDeepView === true) {
          const cmd = deepViewCommand(view.activeDomain)
          const result = node.intentEngine.handle({
            text: cmd,
            spine: node.spine,
            lastQuerySlot,
          })
          lastQuerySlot = result.querySlot
          view = {
            ...view,
            activeWidget: result.widget,
            interactionPage: 'main',
            interactionLabel: cmd,
          }
        }
        if (submittedLine !== undefined) {
          const result = node.intentEngine.handle({
            text: submittedLine,
            spine: node.spine,
            lastQuerySlot,
          })
          lastQuerySlot = result.querySlot
          view = {
            ...view,
            activeWidget: result.widget,
            interactionPage: 'main',
            interactionLabel: submittedLine,
          }
        }
        if (view.shouldExit) {
          finish()
          return
        }
      }
      if (dirty) {
        draw()
      }
    }

    const cleanup = () => {
      process.off('SIGINT', onSignal)
      process.off('SIGTERM', onSignal)
      clearInterval(refreshTimer)
      output.off('resize', onResize)
      input.off('data', onData)
      if (input.isTTY) input.setRawMode(false)
      output.write(CURSOR_SHOW)
      output.write(ALT_SCREEN_OFF)
    }

    input.on('data', onData)
  })
}
