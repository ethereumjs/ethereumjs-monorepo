import type { ChainDispatchCard } from '../spine/types.ts'
import type { EthereumLoreCard } from './ethereumLore.ts'
import type { StoryBrief } from './storyBrief.ts'
import type { StoryLens } from './storyDirector.ts'

export function buildDeterministicFieldNote(
  brief: StoryBrief,
  lens: StoryLens,
  loreCard: EthereumLoreCard | undefined,
  atMs: number,
): ChainDispatchCard {
  const head = brief.head
  const moment = brief.moments[0]
  const hot = brief.hotContracts[0]
  const artifact =
    moment !== undefined
      ? moment.headline
      : hot !== undefined
        ? `${hot.knownName ?? hot.address} active in the window`
        : `block ${head.blockNumber ?? '?'}`

  const bodyParts = [artifact]
  if (loreCard !== undefined) bodyParts.push(loreCard.attackOrEdgeScenario)
  bodyParts.push(`Inspect: ${moment?.address ?? hot?.address ?? head.blockNumber ?? 'signals'}.`)
  const body = bodyParts.join(' ')

  const curiosity = hot?.knownName ?? moment?.headline ?? 'What changed in the last few blocks?'

  return {
    category: lens,
    severity: 'calm',
    headline: (moment?.headline ?? hot?.knownName ?? artifact).slice(0, 72),
    body: body.slice(0, 900),
    blockNumber: head.blockNumber,
    atMs,
    deterministic: true,
    lens,
    network: brief.network,
    angle: loreCard?.historicalEcho.slice(0, 280),
    fallbackReason: 'deterministic',
    angleKind: loreCard !== undefined ? 'history' : undefined,
    curiosityQuestion: curiosity,
    loreCardId: loreCard?.id,
    subjectKey: moment !== undefined ? `moment:${moment.id}` : `head:${head.blockNumber ?? '0'}`,
    relatedAddress: moment?.address ?? hot?.address,
    suggestedAction:
      moment?.address !== undefined
        ? `/contract ${moment.address}`
        : hot?.address !== undefined
          ? `/contract ${hot.address}`
          : '/story new',
  }
}
