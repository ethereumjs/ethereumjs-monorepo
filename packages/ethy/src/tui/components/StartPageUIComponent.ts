import type { EthySpine } from '../../spine/types.ts'
import { BOLD, DIM, FG, RESET, visibleWidth } from '../ansi.ts'
import { CAPABILITY_FG, capabilityMark } from '../capabilityMark.ts'
import { fixedLine } from '../layout.ts'

function centerBlockLine(line: string, blockWidth: number, innerWidth: number): string {
  const leftPad = Math.max(0, Math.floor((innerWidth - blockWidth) / 2))
  return fixedLine(`${' '.repeat(leftPad)}${line}`, innerWidth)
}

function buildCrystalRows(spine: EthySpine, tick: number): string[] {
  const econMark = capabilityMark('economy', spine.capabilities.economy.status)
  const stateMark = capabilityMark('state', spine.capabilities.state.status)
  const p2pMark = capabilityMark('p2p', spine.capabilities.p2p.status)

  const phase = tick % 4
  const sA = phase === 0 ? `${FG.yellow}✦${RESET}` : `${DIM}·${RESET}`
  const sB = phase === 1 ? `${FG.magenta}✦${RESET}` : `${DIM}·${RESET}`
  const sC = phase === 2 ? `${FG.green}✦${RESET}` : `${DIM}·${RESET}`
  const sD = phase === 3 ? `${FG.cyan}✦${RESET}` : `${DIM}·${RESET}`

  const coreColor =
    phase === 0
      ? CAPABILITY_FG.economy
      : phase === 1
        ? CAPABILITY_FG.state
        : phase === 2
          ? CAPABILITY_FG.p2p
          : FG.cyan
  const core = `${BOLD}${coreColor}╬${RESET}`
  const facet = `${coreColor}◈${RESET}`
  const vertex = `${BOLD}${FG.yellow}◆${RESET}`

  // Every row is exactly 21 visible columns wide; diagonals step 1 col/row.
  return [
    `     ${sA}   ${FG.yellow}✦${RESET}     ${econMark}     `,
    `        ${DIM}╱│╲   ╱${RESET}      `,
    `  ${stateMark} ${DIM}───╱─┼─╲─╯${RESET}    ${sB}  `,
    `      ${FG.yellow}╱${RESET}  ${DIM}│${RESET}  ${FG.magenta}╲${RESET}        `,
    `     ${FG.yellow}╱${RESET}   ${facet}   ${FG.magenta}╲${RESET}       `,
    `    ${vertex}${DIM}════${RESET}${core}${DIM}════${RESET}${vertex}      `,
    `     ${FG.green}╲${RESET}   ${facet}   ${FG.cyan}╱${RESET}       `,
    `      ${FG.green}╲${RESET}  ${DIM}│${RESET}  ${FG.cyan}╱${RESET}        `,
    `  ${sC} ${DIM}───╲─┼─╱─╮${RESET}    ${p2pMark}  `,
    `        ${DIM}╲│╱   ╲${RESET}      `,
    `     ${FG.magenta}✦${RESET}   ${sD}     ${p2pMark}     `,
  ]
}

function buildRightRows(spine: EthySpine): string[] {
  const econMark = capabilityMark('economy', spine.capabilities.economy.status)
  const stateMark = capabilityMark('state', spine.capabilities.state.status)
  const p2pMark = capabilityMark('p2p', spine.capabilities.p2p.status)
  const net = spine.network.toUpperCase()
  const ver = `v${spine.clientVersion}`

  const word1 = `${BOLD}${FG.magenta}┏━━━╸${RESET} ${BOLD}${FG.yellow}╺┳╸${RESET} ${BOLD}${FG.green}╻ ╻${RESET} ${BOLD}${FG.cyan}╻ ╻${RESET}`
  const word2 = `${BOLD}${FG.magenta}┣━━  ${RESET} ${BOLD}${FG.yellow} ┃ ${RESET} ${BOLD}${FG.green}┣━┫${RESET} ${BOLD}${FG.cyan}┗┳┛${RESET}  ${DIM}${ver}${RESET}`
  const word3 = `${BOLD}${FG.magenta}┗━━━╸${RESET} ${BOLD}${FG.yellow} ╹ ${RESET} ${BOLD}${FG.green}╹ ╹${RESET} ${BOLD}${FG.cyan} ╹ ${RESET}  ${BOLD}${net}${RESET}`

  return [
    '',
    word1,
    word2,
    word3,
    '',
    `${BOLD}Execution-Free Ethereum Node${RESET}`,
    `${DIM}Economy · Flat State · Swarm Intelligence${RESET}`,
    '',
    `${econMark} ${BOLD}Economy${RESET}   ${stateMark} ${BOLD}State${RESET}   ${p2pMark} ${BOLD}P2P${RESET}`,
    '',
    `${DIM}Press ${RESET}${BOLD}Tab${RESET}${DIM} for help · ${RESET}${BOLD}/${RESET}${DIM} command · ask AI${RESET}`,
  ]
}

export function renderStartPageUIComponent(
  spine: EthySpine,
  innerWidth: number,
  maxBodyLines: number,
  tick = 0,
): string[] {
  const w = Math.max(20, innerWidth)
  if (maxBodyLines <= 0) return []

  const crystal = buildCrystalRows(spine, tick)
  const right = buildRightRows(spine)

  let composition: string[]
  let blockWidth: number

  if (w >= 58 && maxBodyLines >= 11) {
    // Full side-by-side Crystal + Architectural ETHY Banner (58 visible cols)
    blockWidth = 58
    composition = crystal.map((leftRow, i) => `${leftRow}   ${right[i] ?? ''}`)
  } else if (maxBodyLines >= 7) {
    // Medium compact composition for shorter or narrower terminals
    blockWidth = Math.min(w, 44)
    composition = [
      `      ${FG.magenta}┏━━━╸${RESET} ${FG.yellow}╺┳╸${RESET} ${FG.green}╻ ╻${RESET} ${FG.cyan}╻ ╻${RESET}   ${DIM}v${spine.clientVersion}${RESET}`,
      `      ${FG.magenta}┣━━  ${RESET} ${FG.yellow} ┃ ${RESET} ${FG.green}┣━┫${RESET} ${FG.cyan}┗┳┛${RESET}   ${BOLD}${spine.network.toUpperCase()}${RESET}`,
      `      ${FG.magenta}┗━━━╸${RESET} ${FG.yellow} ╹ ${RESET} ${FG.green}╹ ╹${RESET} ${FG.cyan} ╹ ${RESET}`,
      '',
      `  ${BOLD}Execution-Free Ethereum Intelligence Node${RESET}`,
      `  ${capabilityMark('economy', spine.capabilities.economy.status)} Economy   ${capabilityMark('state', spine.capabilities.state.status)} State   ${capabilityMark('p2p', spine.capabilities.p2p.status)} P2P`,
      `  ${DIM}Tab help · /command · ask AI${RESET}`,
    ]
  } else {
    blockWidth = Math.min(w, 40)
    composition = [
      `${BOLD}ETHY v${spine.clientVersion}${RESET} · ${spine.network.toUpperCase()}`,
      `${DIM}Tab help · /command · ask AI${RESET}`,
    ].slice(0, maxBodyLines)
  }

  const trimmed = composition.slice(0, maxBodyLines)
  const topPad = Math.max(0, Math.floor((maxBodyLines - trimmed.length) / 2))
  const rows: string[] = []
  for (let i = 0; i < maxBodyLines; i++) {
    if (i < topPad || i >= topPad + trimmed.length) {
      rows.push(fixedLine('', w))
    } else {
      const line = trimmed[i - topPad] ?? ''
      const actualW = Math.max(blockWidth, visibleWidth(line))
      rows.push(centerBlockLine(line, Math.min(w, actualW), w))
    }
  }
  return rows
}
