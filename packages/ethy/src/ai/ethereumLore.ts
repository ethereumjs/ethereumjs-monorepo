import type { StoryBrief } from './storyBrief.ts'
import type { StoryLens } from './storyDirector.ts'

export type EthereumLoreCard = {
  id: string
  tags: readonly string[]
  title: string
  protocolMechanism: string
  historicalEcho: string
  attackOrEdgeScenario: string
}

export const ETHEREUM_LORE_CARDS: readonly EthereumLoreCard[] = [
  {
    id: 'l2_blobs_dencun',
    tags: ['l2_blob_pressure', 'blob_anchor', 'economics'],
    title: 'EIP-4844 blob fee market',
    protocolMechanism:
      'Post-Dencun (March 2024), rollups post data as cheap blob gas instead of calldata, with a separate blob base fee auction.',
    historicalEcho:
      'Before EIP-4844, 2023 inscription waves filled blocks with calldata and pushed fees to painful highs; Dencun split blob demand from execution gas.',
    attackOrEdgeScenario:
      'Sequencers racing to batch can pay escalating blob fees on L1 while users still see cheap L2 fees — until the data layer tightens.',
  },
  {
    id: 'eip7702_delegation_lens',
    tags: ['delegation_surge', 'eip7702', 'security', 'DELEGATECALL'],
    title: 'EIP-7702 EOA delegation',
    protocolMechanism:
      'Pectra (2025) lets an EOA temporarily point its code at a delegate (`0xef0100…`), enabling smart-wallet behavior in one signature.',
    historicalEcho:
      'EIP-7702 was designed so wallets could upgrade without deploying new contracts; the same opcode pattern can appear in phishing flows.',
    attackOrEdgeScenario:
      'One plausible attack: trick a user into signing a delegation to attacker bytecode that drains tokens on the next call — honest wallets use audited delegates.',
  },
  {
    id: 'delegatecall_proxy_risk',
    tags: ['DELEGATECALL', 'proxy', 'contract_surge', 'security'],
    title: 'Proxy DELEGATECALL storage',
    protocolMechanism:
      'Upgradeable proxies (EIP-1967) run implementation code in the proxy’s storage context via DELEGATECALL; layouts must match exactly.',
    historicalEcho:
      'The 2017 Parity multi-sig library self-destruct froze hundreds of millions in ETH; storage collisions remain a classic upgrade risk.',
    attackOrEdgeScenario:
      'A malicious implementation upgrade or wrong slot layout can let an admin drain funds — always verify implementation address and timelocks.',
  },
  {
    id: 'revert_storm_mev_wars',
    tags: ['revert', 'congestion_pressure', 'economics'],
    title: 'Revert storms and MEV races',
    protocolMechanism:
      'Searchers fire many txs at the same opportunity; losers still pay base fee for included reverts when their bundle loses the auction.',
    historicalEcho:
      'Flash Boys 2.0 (2019) described priority gas auctions; today block builders run the same race at millisecond scale.',
    attackOrEdgeScenario:
      'A pool seeing dozens of reverts in one block often means competing bots, not random user errors.',
  },
  {
    id: 'choreography_flash_composability',
    tags: ['choreography', 'whale_or_flow', 'security'],
    title: 'Single-tx composability',
    protocolMechanism:
      'Routers, flash loans, and DEX paths chain many calls in one transaction — money moves as atomic building blocks.',
    historicalEcho:
      'bZx (2020) and Euler (2023) showed how flash-loan + oracle manipulation composes in one block.',
    attackOrEdgeScenario:
      'Multi-account flows in one tx can be innocent arbitrage or an exploit rehearsal — watch oracle reads and liquidations.',
  },
  {
    id: 'eip1559_fee_auction',
    tags: ['congestion_pressure', 'economics'],
    title: 'EIP-1559 base fee',
    protocolMechanism:
      'London (August 2021) targets half-full blocks; base fee rises when demand persists and burns ETH instead of paying miners.',
    historicalEcho:
      'NFT land mints in 2022 routinely pushed base fee into hundreds of Gwei until demand cooled.',
    attackOrEdgeScenario:
      'Sustained >90% fullness with climbing base fee signals real demand, not a single spam tx.',
  },
  {
    id: 'contract_birth_code_audit',
    tags: ['birth', 'deployment_or_upgrade', 'SELFDESTRUCT', 'security'],
    title: 'Fresh contract deployments',
    protocolMechanism:
      'CREATE and CREATE2 publish new bytecode; Dencun (EIP-6780) restricted how often code can self-destruct and respawn.',
    historicalEcho:
      'Metamorphic contracts historically used CREATE2 + SELFDESTRUCT to swap bytecode at the same address.',
    attackOrEdgeScenario:
      'Unverified newborn contracts deserve extra scrutiny — users often approve them before anyone reads the source.',
  },
  {
    id: 'whale_settlement_flow',
    tags: ['whale', 'whale_or_flow'],
    title: 'Large ETH transfers',
    protocolMechanism:
      'Single high-value transfers can be exchange rebalancing, OTC settlement, bridge withdrawals, or internal treasury moves.',
    historicalEcho:
      'Address-poisoning scams mimic whale transfer amounts with lookalike addresses — always verify the full address.',
    attackOrEdgeScenario:
      'Could this be poisoned dust followed by a copy-paste mistake? Compare sender history and known exchange labels.',
  },
  {
    id: 'storage_slot_accumulator',
    tags: ['slot_trend', 'storage'],
    title: 'Monotonic storage writes',
    protocolMechanism:
      'BALs and live traces show slots that only increase — reserves, counters, nonces — or sudden admin flips.',
    historicalEcho:
      'Liquidity pool reserve slots and vault share counters are the heartbeat of DeFi; unexpected admin slot writes preceded many hacks.',
    attackOrEdgeScenario:
      'A step-jump on an admin slot right before large withdrawals is a classic pause-or-drain pattern.',
  },
  {
    id: 'graffiti_onchain_messages',
    tags: ['graffiti_note', 'lore'],
    title: 'On-chain graffiti',
    protocolMechanism:
      'Validators embed ASCII in extraData; users embed UTF-8 in calldata — both are immutable once included.',
    historicalEcho:
      'From the Genesis quote to 2016 DAO negotiation messages, Ethereum carries political and human notes in plain sight.',
    attackOrEdgeScenario:
      'Graffiti is rarely financial — but it signals who was watching a block and can anchor timelines in investigations.',
  },
  {
    id: 'veteran_vs_newcomer',
    tags: ['veteran', 'first_step', 'lore'],
    title: 'Nonce veterans beside newcomers',
    protocolMechanism:
      'High-nonce EOAs are usually bots, exchanges, or relayers; nonce-1 wallets are often fresh humans or new bots.',
    historicalEcho:
      'Ethereum’s open mempool means veterans and first-time users share the same block — a social street, not a VIP lane.',
    attackOrEdgeScenario:
      'A veteran funding dozens of nonce-1 wallets in one window can be faucet distribution or airdrop farming.',
  },
  {
    id: 'amsterdam_bal_state_lens',
    tags: ['economics', 'lore'],
    title: 'EIP-7928 block access lists',
    protocolMechanism:
      'Amsterdam-style BALs list every balance, nonce, code, and storage touch per block so nodes can sync state without replaying every tx locally.',
    historicalEcho:
      'EIP-7928 (Amsterdam preview) shifts state delivery from trie walks to verifiable per-block diffs.',
    attackOrEdgeScenario:
      'Ethy reads those diffs live — so contract heat and storage writes you see are what the network actually applied.',
  },
  {
    id: 'sender_burst_automation',
    tags: ['sender_burst', 'economics'],
    title: 'Sender transaction bursts',
    protocolMechanism:
      'One address firing many txs per block is usually automation: relayers, oracle updates, cancel/replace loops.',
    historicalEcho:
      'Market makers and CEX hot wallets routinely dominate block sender counts without any single large transfer.',
    attackOrEdgeScenario:
      'Nonce-griefing or spam tests can mimic bots — pair burst patterns with revert rate and contract targets.',
  },
  {
    id: 'sepolia_testnet_rehearsal',
    tags: ['network:sepolia', 'lore'],
    title: 'Sepolia rehearsals',
    protocolMechanism:
      'Sepolia ETH has no mainnet value; teams stage upgrades, wallet SDK tests, and bridge drills there first.',
    historicalEcho:
      'Major forks and EIP-7702 wallet pilots land on Sepolia months before mainnet — strange bursts are often dev traffic.',
    attackOrEdgeScenario:
      'Treat high scores here as rehearsal signals, not stolen funds — still interesting for protocol QA narratives.',
  },
]

function tagHits(card: EthereumLoreCard, tags: Set<string>): number {
  let score = 0
  for (const t of card.tags) {
    if (tags.has(t)) score += 2
  }
  return score
}

export function selectLoreCards(
  brief: StoryBrief,
  lens: StoryLens,
  recentLoreIds: readonly string[],
  maxCards: number,
): EthereumLoreCard[] {
  const tags = new Set<string>()
  tags.add(`network:${brief.network.toLowerCase()}`)
  if (lens === 'security') tags.add('security')
  if (lens === 'economics') tags.add('economics')
  for (const s of brief.signals) tags.add(s.kind)
  for (const m of brief.moments) tags.add(m.kind)
  for (const h of brief.hotContracts) {
    if (h.proxyKind !== undefined) tags.add('proxy')
    if (h.archetype?.toLowerCase().includes('dex')) tags.add('choreography')
  }
  const recent = new Set(recentLoreIds)

  const scored = ETHEREUM_LORE_CARDS.map((card) => {
    let score = tagHits(card, tags)
    if (recent.has(card.id)) score -= 4
    if (brief.network.toLowerCase() === 'sepolia' && card.id === 'sepolia_testnet_rehearsal') {
      score += 5
    }
    return { card, score }
  })
    .sort((a, b) => b.score - a.score)
    .filter((x) => x.score > 0)

  const picked: EthereumLoreCard[] = []
  for (const row of scored) {
    if (picked.length >= maxCards) break
    if (picked.some((p) => p.id === row.card.id)) continue
    picked.push(row.card)
  }
  if (picked.length === 0) {
    const fallback =
      brief.network.toLowerCase() === 'sepolia'
        ? ETHEREUM_LORE_CARDS.find((c) => c.id === 'sepolia_testnet_rehearsal')
        : ETHEREUM_LORE_CARDS.find((c) => c.id === 'amsterdam_bal_state_lens')
    if (fallback !== undefined) picked.push(fallback)
  }
  return picked.slice(0, maxCards)
}
