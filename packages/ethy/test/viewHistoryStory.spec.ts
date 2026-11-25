import { describe, expect, it } from 'vitest'

import { createSpine } from '../src/spine/createSpine.ts'
import { storyWritingPlaceholderWidget } from '../src/tools/storyTools.ts'
import { createInitialViewState } from '../src/tui/prompt.ts'
import { applyLiveSlashRefresh } from '../src/tui/viewHistory.ts'

describe('applyLiveSlashRefresh /story mutations', () => {
  it('does not re-dispatch /story new while the historian is writing', () => {
    const spine = createSpine('sepolia', 11155111n)
    const placeholder = storyWritingPlaceholderWidget()
    const view = {
      ...createInitialViewState(spine),
      viewHistory: [
        {
          kind: 'slash' as const,
          command: '/story new',
          label: '/story new',
          viewTitle: 'Story',
          page: 'main' as const,
        },
      ],
      viewHistoryIndex: 0,
    }
    const leftWidget = {
      kind: 'key_value' as const,
      title: 'Plaza',
      entries: [{ key: 'Status', value: 'unchanged' }],
    }
    const withLeftPane = { ...view, activeWidget: leftWidget }
    const refreshed = applyLiveSlashRefresh(withLeftPane, spine, {
      spine,
      stateManager: {} as never,
    })
    expect(refreshed.activeWidget).toBe(leftWidget)
    expect(refreshed.activeWidget?.kind).toBe('key_value')
  })
})
