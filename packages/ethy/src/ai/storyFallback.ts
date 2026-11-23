import type { ChainDispatchCard } from '../spine/types.ts'
import type { EthereumLoreCard } from './ethereumLore.ts'
import type { StoryBrief } from './storyBrief.ts'
import type { StoryLens } from './storyDirector.ts'

export function buildDeterministicFieldNote(
  brief: StoryBrief,
  lens: StoryLens,
  loreCard: EthereumLoreCard,
  atMs: number,
): ChainDispatchCard {
  const head = brief.head
  const netLabel = brief.network.toUpperCase()
  const baseFee = head.baseFeeGwei ?? '—'
  const gas = head.gasFullPct !== undefined ? `${head.gasFullPct}% full` : 'steady gas'
  const moment = brief.moments[0]
  const hot = brief.hotContracts[0]
  const artifact =
    moment !== undefined
      ? moment.headline
      : hot !== undefined
        ? `${hot.knownName ?? hot.address} active in the window`
        : `block ${head.blockNumber ?? '?'}`

  const body = [
    `On ${netLabel}, base fee sits near ${baseFee} with blocks about ${gas}.`,
    `Right now: ${artifact}.`,
    loreCard.historicalEcho,
    `One angle to ponder: ${loreCard.attackOrEdgeScenario}`,
  ].join(' ')

  const curiosity =
    brief.network.toLowerCase() === 'sepolia'
      ? 'Is this a mainnet dress rehearsal or wallet SDK test traffic?'
      : 'Could this pattern repeat if fees spike again tomorrow?'

  return {
    category: lens,
    severity: 'calm',
    headline: loreCard.title.slice(0, 72),
    body: body.slice(0, 900),
    blockNumber: head.blockNumber,
    atMs,
    deterministic: true,
    lens,
    network: brief.network,
    angle: loreCard.historicalEcho,
    angleKind: 'history',
    curiosityQuestion: curiosity,
    loreCardId: loreCard.id,
    subjectKey: moment !== undefined ? `moment:${moment.id}` : `head:${head.blockNumber ?? '0'}`,
    relatedAddress: moment?.address ?? hot?.address,
    suggestedAction: '/story new',
  }
}
